import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id);

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const fieldsToUpdate = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    height: req.body.height,
    weight: req.body.weight,
    bloodType: req.body.bloodType,
    allergies: req.body.allergies,
    medications: req.body.medications,
    chronicConditions: req.body.chronicConditions,
    emergencyContact: req.body.emergencyContact,
    preferences: req.body.preferences
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined) {
      delete fieldsToUpdate[key as keyof typeof fieldsToUpdate];
    }
  });

  const user = await User.findByIdAndUpdate(req.user!._id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
export const getDashboardData = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  // Import models dynamically to avoid circular dependencies
  const ChatSession = (await import('../models/ChatSession')).default;
  const Medicine = (await import('../models/Medicine')).default;
  const HealthPlan = (await import('../models/HealthPlan')).default;

  // Get today's date for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get various counts and data
  const [
    totalChatSessions,
    todayChatSessions,
    activeMedicines,
    activeHealthPlans,
    recentChatSessions
  ] = await Promise.all([
    ChatSession.countDocuments({ userId }),
    ChatSession.countDocuments({ 
      userId, 
      createdAt: { $gte: today, $lt: tomorrow } 
    }),
    Medicine.countDocuments({ userId, isActive: true }),
    HealthPlan.countDocuments({ userId, status: 'active' }),
    ChatSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title sessionType createdAt')
  ]);

  // Calculate health score (placeholder logic)
  const healthScore = Math.min(100, Math.max(0, 
    100 - (activeMedicines * 5) - (activeHealthPlans * 3)
  ));

  res.status(200).json({
    success: true,
    data: {
      stats: {
        healthScore,
        activeMedicines,
        totalChatSessions,
        todayChatSessions,
        activeHealthPlans
      },
      recentActivity: recentChatSessions
    }
  });
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!._id;

  // Import models dynamically
  const ChatSession = (await import('../models/ChatSession')).default;
  const Medicine = (await import('../models/Medicine')).default;
  const HealthPlan = (await import('../models/HealthPlan')).default;
  const PeriodCycle = (await import('../models/PeriodCycle')).PeriodCycle;
  const PeriodHistory = (await import('../models/PeriodCycle')).PeriodHistory;
  const EmergencyContact = (await import('../models/EmergencyContact')).default;

  // Delete all user data
  await Promise.all([
    User.findByIdAndDelete(userId),
    ChatSession.deleteMany({ userId }),
    Medicine.deleteMany({ userId }),
    HealthPlan.deleteMany({ userId }),
    PeriodCycle.deleteMany({ userId }),
    PeriodHistory.deleteMany({ userId }),
    EmergencyContact.deleteMany({ userId })
  ]);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// @desc    Get user preferences
// @route   GET /api/users/preferences
// @access  Private
export const getUserPreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id).select('preferences');

  res.status(200).json({
    success: true,
    preferences: user?.preferences
  });
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updateUserPreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.user!._id,
    { preferences: req.body.preferences },
    { new: true, runValidators: true }
  ).select('preferences');

  res.status(200).json({
    success: true,
    preferences: user?.preferences
  });
});
