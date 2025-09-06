import { Response } from 'express';
import HealthPlan from '../models/HealthPlan';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { generateHealthPlan } from '../utils/aiService';

// @desc    Get all health plans for user
// @route   GET /api/health-plans
// @access  Private
export const getHealthPlans = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { status, planType, page = 1, limit = 10 } = req.query;

  const query: any = { userId };
  
  if (status) {
    query.status = status;
  }
  
  if (planType) {
    query.planType = planType;
  }

  const healthPlans = await HealthPlan.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await HealthPlan.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      healthPlans,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }
  });
});

// @desc    Get single health plan
// @route   GET /api/health-plans/:id
// @access  Private
export const getHealthPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const healthPlan = await HealthPlan.findOne({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!healthPlan) {
    return res.status(404).json({
      success: false,
      message: 'Health plan not found'
    });
  }

  res.status(200).json({
    success: true,
    healthPlan
  });
});

// @desc    Create new health plan
// @route   POST /api/health-plans
// @access  Private
export const createHealthPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, planType, duration, symptoms, tasks } = req.body;

  // Calculate end date
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + duration);

  const healthPlanData = {
    userId: req.user!._id,
    title,
    description,
    planType,
    duration,
    startDate,
    endDate,
    symptoms: symptoms || [],
    tasks: tasks || [],
    aiGenerated: false
  };

  const healthPlan = await HealthPlan.create(healthPlanData);

  res.status(201).json({
    success: true,
    healthPlan
  });
});

// @desc    Update health plan
// @route   PUT /api/health-plans/:id
// @access  Private
export const updateHealthPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const healthPlan = await HealthPlan.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!healthPlan) {
    return res.status(404).json({
      success: false,
      message: 'Health plan not found'
    });
  }

  res.status(200).json({
    success: true,
    healthPlan
  });
});

// @desc    Delete health plan
// @route   DELETE /api/health-plans/:id
// @access  Private
export const deleteHealthPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const healthPlan = await HealthPlan.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!healthPlan) {
    return res.status(404).json({
      success: false,
      message: 'Health plan not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Health plan deleted successfully'
  });
});

// @desc    Toggle task completion
// @route   PUT /api/health-plans/:id/tasks/:taskId
// @access  Private
export const toggleTaskCompletion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { completed, notes } = req.body;

  const healthPlan = await HealthPlan.findOne({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!healthPlan) {
    return res.status(404).json({
      success: false,
      message: 'Health plan not found'
    });
  }

  // Find and update the task
  let taskFound = false;
  for (const timeOfDay of ['morning', 'afternoon', 'night']) {
    const tasks = healthPlan.tasks.filter(task => 
      task.timeOfDay === timeOfDay && task.id === taskId
    );
    
    if (tasks.length > 0) {
      const task = tasks[0];
      task.completed = completed !== undefined ? completed : !task.completed;
      task.completedAt = task.completed ? new Date() : undefined;
      if (notes !== undefined) {
        task.notes = notes;
      }
      taskFound = true;
      break;
    }
  }

  if (!taskFound) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  await healthPlan.save();

  res.status(200).json({
    success: true,
    message: 'Task updated successfully'
  });
});

// @desc    Generate AI health plan
// @route   POST /api/health-plans/generate
// @access  Private
export const generateAIHealthPlan = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { symptoms, planType = 'recovery', duration = 3 } = req.body;

  try {
    // Generate AI health plan using Gemini
    const aiPlan = await generateHealthPlan(symptoms, planType, {
      userId: req.user!._id,
      duration,
      userProfile: req.user
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + aiPlan.duration);

    const healthPlan = await HealthPlan.create({
      userId: req.user!._id,
      title: aiPlan.title,
      description: aiPlan.description,
      planType,
      duration: aiPlan.duration,
      startDate,
      endDate,
      symptoms,
      tasks: aiPlan.tasks,
      aiGenerated: true
    });

    res.status(201).json({
      success: true,
      healthPlan
    });
  } catch (error) {
    console.error('Error generating AI health plan:', error);
    
    // Fallback to basic plan generation
    const aiGeneratedTasks = generateTasksForSymptoms(symptoms, planType, duration);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    const healthPlan = await HealthPlan.create({
      userId: req.user!._id,
      title: `AI Generated ${planType} Plan`,
      description: `Personalized health plan based on your symptoms: ${symptoms.join(', ')}`,
      planType,
      duration,
      startDate,
      endDate,
      symptoms,
      tasks: aiGeneratedTasks,
      aiGenerated: true
    });

    res.status(201).json({
      success: true,
      healthPlan
    });
  }
});

// @desc    Get health plan analytics
// @route   GET /api/health-plans/analytics
// @access  Private
export const getHealthPlanAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { period = '30' } = req.query; // days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(period));

  const [
    totalPlans,
    activePlans,
    completedPlans,
    aiGeneratedPlans,
    averageCompletionRate
  ] = await Promise.all([
    HealthPlan.countDocuments({ userId }),
    HealthPlan.countDocuments({ userId, status: 'active' }),
    HealthPlan.countDocuments({ userId, status: 'completed' }),
    HealthPlan.countDocuments({ userId, aiGenerated: true }),
    HealthPlan.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, avgCompletion: { $avg: '$progress.completionPercentage' } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalPlans,
      activePlans,
      completedPlans,
      aiGeneratedPlans,
      averageCompletionRate: averageCompletionRate[0]?.avgCompletion || 0
    }
  });
});

// Helper function to generate tasks based on symptoms
const generateTasksForSymptoms = (symptoms: string[], planType: string, duration: number) => {
  const tasks: any[] = [];
  let taskId = 1;

  // Common tasks for different symptoms
  const symptomTasks: Record<string, any[]> = {
    headache: [
      { task: 'Take prescribed pain medication', priority: 'high', category: 'medication' },
      { task: 'Apply cold compress to forehead', priority: 'medium', category: 'other' },
      { task: 'Stay hydrated - drink 8 glasses of water', priority: 'medium', category: 'diet' },
      { task: 'Rest in a quiet, dark room', priority: 'high', category: 'rest' }
    ],
    fever: [
      { task: 'Monitor temperature every 4 hours', priority: 'high', category: 'monitoring' },
      { task: 'Take fever-reducing medication as prescribed', priority: 'high', category: 'medication' },
      { task: 'Stay hydrated with clear fluids', priority: 'high', category: 'diet' },
      { task: 'Get adequate rest', priority: 'high', category: 'rest' }
    ],
    fatigue: [
      { task: 'Take iron supplement if prescribed', priority: 'medium', category: 'medication' },
      { task: 'Eat iron-rich foods', priority: 'medium', category: 'diet' },
      { task: 'Light stretching exercises', priority: 'low', category: 'exercise' },
      { task: 'Early bedtime routine', priority: 'medium', category: 'rest' }
    ]
  };

  // Generate tasks for each day
  for (let day = 1; day <= duration; day++) {
    const timeSlots = ['morning', 'afternoon', 'night'];
    
    symptoms.forEach(symptom => {
      const symptomTaskList = symptomTasks[symptom.toLowerCase()] || [];
      
      symptomTaskList.forEach((symptomTask, index) => {
        const timeOfDay = timeSlots[index % timeSlots.length];
        
        tasks.push({
          id: taskId.toString(),
          task: symptomTask.task,
          completed: false,
          priority: symptomTask.priority,
          timeOfDay,
          category: symptomTask.category,
          estimatedDuration: 15
        });
        taskId++;
      });
    });
  }

  return tasks;
};
