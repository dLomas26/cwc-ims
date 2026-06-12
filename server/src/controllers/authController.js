const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/ApiResponse');
const authService = require('../services/authService');

/**
 * Auth Controller
 * Handles HTTP layer for authentication endpoints
 */

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, result, 'Login successful');
});

/**
 * POST /api/auth/logout
 * Stateless JWT logout – client is responsible for dropping the token
 */
const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, null, 'Logged out successfully');
});

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  sendSuccess(res, user, 'User profile retrieved');
});

/**
 * POST /api/auth/setup
 * Create the first super_admin account
 * Only works when no users exist in the system
 */
const createInitialAdmin = asyncHandler(async (req, res) => {
  const { email, password, full_name } = req.body;
  const result = await authService.createInitialAdmin({ email, password, full_name });
  sendCreated(res, result, 'Initial admin account created successfully');
});

module.exports = { login, logout, getMe, createInitialAdmin };
