const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const config = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Register a new user
 */
const register = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  // Hash password
  const password_hash = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // Insert user
  const [userId] = await db('users').insert({
    name,
    email,
    password_hash,
    role: role || 'receptionist',
  });

  // Get created user (without password)
  const user = await db('users')
    .select('id', 'name', 'email', 'role', 'created_at')
    .where({ id: userId })
    .first();

  return user;
};

/**
 * Login user and return JWT token
 */
const login = async (email, password) => {
  // Find user
  const user = await db('users')
    .where({ email, deleted_at: null })
    .first();

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Generate refresh token (optional feature)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );
};

/**
 * Refresh access token
 */
const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret);

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await db('users')
      .where({ id: decoded.userId, deleted_at: null })
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate new access token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return { token };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Refresh token expired', 401);
    }
    throw new AppError('Invalid refresh token', 401);
  }
};

module.exports = {
  register,
  login,
  generateRefreshToken,
  refreshToken,
};
