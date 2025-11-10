const pino = require('pino');
const config = require('../config/env');

const logger = pino({
  level: config.logLevel,
  transport: config.nodeEnv === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
  // Redact sensitive fields to prevent PHI leakage
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.national_id',
      'res.headers["set-cookie"]',
      '*.password',
      '*.password_hash',
      '*.national_id',
    ],
    remove: true,
  },
});

module.exports = logger;
