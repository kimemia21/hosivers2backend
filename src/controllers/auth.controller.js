const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

/**
 * Register new user
 * POST /auth/register
 * @access Admin only
 */
const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: user,
  });
});

/**
 * Login user
 * POST /auth/login
 * @access Public
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: result,
  });
});

/**
 * Refresh access token
 * POST /auth/refresh
 * @access Public
 */
const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  register,
  login,
  refresh,
};
