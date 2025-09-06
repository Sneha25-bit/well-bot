import express from 'express';
import {
  getPeriodHistory,
  addPeriodEntry,
  getCurrentPeriodCycle,
  startPeriodCycle,
  endPeriodCycle,
  getPeriodPredictions,
  getPeriodAnalytics
} from '../controllers/periodController';
import { authenticate } from '../middleware/auth';
import {
  validatePeriodCycle,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/history', getPeriodHistory);
router.get('/current', getCurrentPeriodCycle);
router.get('/predictions', getPeriodPredictions);
router.get('/analytics', getPeriodAnalytics);
router.post('/entries', validatePeriodCycle, handleValidationErrors, addPeriodEntry);
router.post('/cycles', validatePeriodCycle, handleValidationErrors, startPeriodCycle);
router.put('/cycles/:id/end', endPeriodCycle);

export default router;
