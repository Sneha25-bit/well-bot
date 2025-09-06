import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
  handleValidationErrors
} from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, handleValidationErrors, register);
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.post('/refresh', refreshToken);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/verifyemail/:token', verifyEmail);

// Protected routes
router.use(authenticate); // All routes below this middleware are protected

router.get('/me', getMe);
router.put('/updatedetails', validateUserProfileUpdate, handleValidationErrors, updateDetails);
router.put('/updatepassword', updatePassword);
router.get('/logout', logout);

export default router;
