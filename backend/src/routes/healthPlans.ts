import express from 'express';
import {
  getHealthPlans,
  getHealthPlan,
  createHealthPlan,
  updateHealthPlan,
  deleteHealthPlan,
  toggleTaskCompletion,
  generateAIHealthPlan,
  getHealthPlanAnalytics
} from '../controllers/healthPlanController';
import { authenticate } from '../middleware/auth';
import {
  validateHealthPlan,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/', getHealthPlans);
router.get('/analytics', getHealthPlanAnalytics);
router.get('/:id', getHealthPlan);
router.post('/', validateHealthPlan, handleValidationErrors, createHealthPlan);
router.post('/generate', generateAIHealthPlan);
router.put('/:id', validateHealthPlan, handleValidationErrors, updateHealthPlan);
router.put('/:id/tasks/:taskId', toggleTaskCompletion);
router.delete('/:id', deleteHealthPlan);

export default router;
