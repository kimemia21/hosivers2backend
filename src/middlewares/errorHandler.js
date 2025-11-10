const logger = require('../utils/logger');
const config = require('../config/env');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error (excluding operational errors in production)
  if (!err.isOperational || config.nodeEnv === 'development') {
    logger.error({
      err,
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  }

  // Development error response
  if (config.nodeEnv === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production error response
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak error details
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
