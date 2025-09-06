import express from 'express';
import {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  markMedicineTaken,
  getMedicineReminders,
  getMedicineAnalytics
} from '../controllers/medicineController';
import { authenticate } from '../middleware/auth';
import {
  validateMedicine,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/', getMedicines);
router.get('/reminders', getMedicineReminders);
router.get('/analytics', getMedicineAnalytics);
router.get('/:id', getMedicine);
router.post('/', validateMedicine, handleValidationErrors, createMedicine);
router.put('/:id', validateMedicine, handleValidationErrors, updateMedicine);
router.post('/:id/taken', markMedicineTaken);
router.delete('/:id', deleteMedicine);

export default router;
