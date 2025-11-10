require('dotenv').config();

const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'JWT_SECRET'
];

// Validate required environment variablesript
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

module.exports = {
  // Server
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },


  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Security
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  authRateLimit: {
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5', 10),
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};
