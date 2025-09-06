import { Response } from 'express';
import Medicine from '../models/Medicine';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

// @desc    Get all medicines for user
// @route   GET /api/medicines
// @access  Private
export const getMedicines = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { isActive, page = 1, limit = 10 } = req.query;

  const query: any = { userId };
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const medicines = await Medicine.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await Medicine.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      medicines,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    }
  });
});

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private
export const getMedicine = asyncHandler(async (req: AuthRequest, res: Response) => {
  const medicine = await Medicine.findOne({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found'
    });
  }

  res.status(200).json({
    success: true,
    medicine
  });
});

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private
export const createMedicine = asyncHandler(async (req: AuthRequest, res: Response) => {
  const medicineData = {
    ...req.body,
    userId: req.user!._id
  };

  const medicine = await Medicine.create(medicineData);

  res.status(201).json({
    success: true,
    medicine
  });
});

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private
export const updateMedicine = asyncHandler(async (req: AuthRequest, res: Response) => {
  const medicine = await Medicine.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found'
    });
  }

  res.status(200).json({
    success: true,
    medicine
  });
});

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private
export const deleteMedicine = asyncHandler(async (req: AuthRequest, res: Response) => {
  const medicine = await Medicine.findOneAndDelete({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Medicine deleted successfully'
  });
});

// @desc    Mark medicine as taken
// @route   POST /api/medicines/:id/taken
// @access  Private
export const markMedicineTaken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { time, notes } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const medicine = await Medicine.findOne({
    _id: req.params.id,
    userId: req.user!._id
  });

  if (!medicine) {
    return res.status(404).json({
      success: false,
      message: 'Medicine not found'
    });
  }

  // Add completion record
  medicine.completionHistory.push({
    date: today,
    time: time || new Date().toTimeString().slice(0, 5),
    completed: true,
    notes
  });

  await medicine.save();

  res.status(200).json({
    success: true,
    message: 'Medicine marked as taken'
  });
});

// @desc    Get medicine reminders
// @route   GET /api/medicines/reminders
// @access  Private
export const getMedicineReminders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { date } = req.query;

  const targetDate = date ? new Date(date as string) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  const medicines = await Medicine.find({
    userId,
    isActive: true,
    'reminders.enabled': true
  });

  const reminders = medicines.map(medicine => {
    const todayCompletions = medicine.completionHistory.filter(
      completion => completion.date.getTime() === targetDate.getTime()
    );

    return {
      medicineId: medicine._id,
      name: medicine.name,
      dosage: medicine.dosage,
      times: medicine.times,
      completedTimes: todayCompletions.filter(c => c.completed).map(c => c.time),
      pendingTimes: medicine.times.filter(time => 
        !todayCompletions.some(c => c.time === time && c.completed)
      )
    };
  });

  res.status(200).json({
    success: true,
    reminders
  });
});

// @desc    Get medicine analytics
// @route   GET /api/medicines/analytics
// @access  Private
export const getMedicineAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;
  const { period = '30' } = req.query; // days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(period));

  const [
    totalMedicines,
    activeMedicines,
    aiSuggestedMedicines,
    completionStats
  ] = await Promise.all([
    Medicine.countDocuments({ userId }),
    Medicine.countDocuments({ userId, isActive: true }),
    Medicine.countDocuments({ userId, isAISuggested: true }),
    Medicine.aggregate([
      { $match: { userId: userId } },
      { $unwind: '$completionHistory' },
      { 
        $match: { 
          'completionHistory.date': { $gte: startDate },
          'completionHistory.completed': true 
        } 
      },
      { $group: { _id: null, totalCompletions: { $sum: 1 } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    analytics: {
      totalMedicines,
      activeMedicines,
      aiSuggestedMedicines,
      totalCompletions: completionStats[0]?.totalCompletions || 0
    }
  });
});
