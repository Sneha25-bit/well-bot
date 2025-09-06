import express from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import chatRoutes from './chat';
import medicineRoutes from './medicines';
import periodRoutes from './period';
import healthPlanRoutes from './healthPlans';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wellness Bot API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chat', chatRoutes);
router.use('/medicines', medicineRoutes);
router.use('/period', periodRoutes);
router.use('/health-plans', healthPlanRoutes);

export default router;
