const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const pinoHttp = require('pino-http');
const config = require('./config/env');
const logger = require('./utils/logger');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.nodeEnv === 'production' 
    ? ['https://yourdomain.com'] // Replace with actual domain(s)
    : '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
// app.use(limiter);

// Request logging (with PHI redaction)
app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.national_id',
      'res.headers["set-cookie"]',
    ],
    remove: true,
  },
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
