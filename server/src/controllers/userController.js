const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/ApiResponse');
const userService = require('../services/userService');

/**
 * User Controller
 * Admin panel for managing system users
 */

/** GET /api/users */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  sendSuccess(res, users, 'Users retrieved successfully');
});

/** GET /api/users/:id */
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.params.id);
  sendSuccess(res, user, 'User retrieved successfully');
});

/** POST /api/users */
const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendCreated(res, user, 'User created successfully');
});

/** PATCH /api/users/:id/role */
const updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await userService.updateRole(req.params.id, role, req.user);
  sendSuccess(res, user, 'User role updated successfully');
});

/** PATCH /api/users/:id/status */
const setActiveStatus = asyncHandler(async (req, res) => {
  const { is_active } = req.body;
  if (typeof is_active !== 'boolean') {
    const ApiError = require('../utils/ApiError');
    throw ApiError.badRequest('is_active must be a boolean');
  }
  const user = await userService.setActiveStatus(req.params.id, is_active, req.user);
  sendSuccess(res, user, `User ${is_active ? 'activated' : 'deactivated'} successfully`);
});

/** DELETE /api/users/:id */
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user);
  sendSuccess(res, null, 'User deleted successfully');
});

module.exports = { getAllUsers, getUser, createUser, updateRole, setActiveStatus, deleteUser };
