const knex = require('knex');
const config = require('./env');
const logger = require('../utils/logger');

const db = knex({
  client: 'mysql2',
  connection: {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    charset: 'utf8mb4',
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
  },
  acquireConnectionTimeout: 10000,
  debug: config.nodeEnv === 'development',
});

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info('Database connection established successfully');
  })
  .catch((err) => {
    logger.error('Database connection failed:', err.message);
    // Don't exit - let the app handle connection errors
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing database connection');
  db.destroy()
    .then(() => {
      logger.info('Database connection closed');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Error closing database connection:', err);
      process.exit(1);
    });
});

module.exports = db;
