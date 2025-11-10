const jwt = require('jsonwebtoken');
const config = require('../config/env');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const db = require('../config/database');

/**
 * Middleware to authenticate JWT token
 */
const authenticate = catchAsync(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided. Please authenticate.', 401);
  }

  const token = authHeader.split(' ')[1];

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Token expired. Please login again.', 401);
    }
    throw new AppError('Invalid token. Please authenticate.', 401);
  }

  // Check if user still exists
  const user = await db('users')
    .where({ id: decoded.userId, deleted_at: null })
    .first();

  if (!user) {
    throw new AppError('User no longer exists.', 401);
  }

  // Attach user to request
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  next();
});

/**
 * Middleware to check if user has required role(s)
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action.',
        403
      );
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
