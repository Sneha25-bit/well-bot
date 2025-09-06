import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getDashboardData,
  deleteUserAccount,
  getUserPreferences,
  updateUserPreferences
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import {
  validateUserProfileUpdate,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get('/profile', getUserProfile);
router.put('/profile', validateUserProfileUpdate, handleValidationErrors, updateUserProfile);
router.get('/dashboard', getDashboardData);
router.get('/preferences', getUserPreferences);
router.put('/preferences', updateUserPreferences);
router.delete('/account', deleteUserAccount);

export default router;
