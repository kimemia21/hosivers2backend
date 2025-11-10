const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`
    ================================================
    🚀 Server running in ${config.nodeEnv} mode
    🏥 Hospital Records Management System
    📡 Listening on port ${PORT}
    🔗 API Base URL: http://localhost:${PORT}/api/v1
    📊 Health Check: http://localhost:${PORT}/api/v1/health
    ================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

module.exports = server;
