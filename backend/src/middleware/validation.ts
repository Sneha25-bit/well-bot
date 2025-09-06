import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender selection')
];

// User login validation
export const validateUserLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// User profile update validation
export const validateUserProfileUpdate: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'prefer-not-to-say'])
    .withMessage('Invalid gender selection'),
  body('height')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Height cannot be more than 20 characters'),
  body('weight')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Weight cannot be more than 20 characters'),
  body('bloodType')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Invalid blood type')
];

// Medicine validation
export const validateMedicine: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medicine name must be between 1 and 100 characters'),
  body('dosage')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Dosage must be between 1 and 50 characters'),
  body('frequency')
    .isIn(['once_daily', 'twice_daily', 'three_times_daily', 'four_times_daily', 'as_needed'])
    .withMessage('Invalid frequency selection'),
  body('times')
    .isArray({ min: 1 })
    .withMessage('At least one time must be provided'),
  body('times.*')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format. Use HH:MM format')
];

// Period cycle validation
export const validatePeriodCycle: ValidationChain[] = [
  body('periodStartDate')
    .isISO8601()
    .withMessage('Invalid period start date'),
  body('periodEndDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid period end date'),
  body('flowIntensity')
    .optional()
    .isIn(['light', 'medium', 'heavy'])
    .withMessage('Invalid flow intensity'),
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array'),
  body('mood')
    .optional()
    .isIn(['happy', 'sad', 'anxious', 'irritable', 'normal'])
    .withMessage('Invalid mood selection')
];

// Health plan validation
export const validateHealthPlan: ValidationChain[] = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  body('planType')
    .isIn(['recovery', 'maintenance', 'prevention', 'emergency'])
    .withMessage('Invalid plan type'),
  body('duration')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days'),
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('Symptoms must be an array')
];

// Chat message validation
export const validateChatMessage: ValidationChain[] = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  body('sessionType')
    .optional()
    .isIn(['general', 'symptom_check', 'emergency', 'medication', 'period_tracking'])
    .withMessage('Invalid session type')
];

// Emergency contact validation
export const validateEmergencyContact: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('relationship')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Relationship must be between 1 and 30 characters')
];
