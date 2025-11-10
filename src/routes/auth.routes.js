const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validation');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const config = require('../config/env');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: config.authRateLimit.windowMs,
  max: config.authRateLimit.max,
  message: 'Too many authentication attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Protected routes - admin only for registration
router.post(
  '/register',
  authenticate,
  authorize('admin'),
  validate(registerSchema),
  authController.register
);

// Optional: Refresh token endpoint
router.post('/refresh', authController.refresh);

module.exports = router;
