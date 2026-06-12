const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const { ROLES } = require('../constants');

/**
 * User Service
 * Business logic for user management (admin panel)
 */

const SALT_ROUNDS = 12;

/**
 * Get all system users
 * @returns {Object[]}
 */
const getAll = async () => {
  return userRepository.findAll();
};

/**
 * Get user by ID
 * @param {string} id
 * @returns {Object}
 */
const getById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw ApiError.notFound(`User with ID ${id} not found`);
  }
  return user;
};

/**
 * Update a user's role
 * Only super_admin can change roles; cannot demote last super_admin
 * @param {string} id - target user ID
 * @param {string} role - new role
 * @param {Object} requestingUser - authenticated user making the change
 * @returns {Object}
 */
const updateRole = async (id, role, requestingUser) => {
  // Cannot change your own role
  if (requestingUser.id === id) {
    throw ApiError.forbidden('You cannot change your own role');
  }

  const target = await userRepository.findById(id);
  if (!target) {
    throw ApiError.notFound(`User with ID ${id} not found`);
  }

  // Validate new role value
  const validRoles = Object.values(ROLES);
  if (!validRoles.includes(role)) {
    throw ApiError.badRequest(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  // Guard: cannot demote the last super_admin
  if (target.role === ROLES.SUPER_ADMIN && role !== ROLES.SUPER_ADMIN) {
    const allUsers = await userRepository.findAll();
    const superAdminCount = allUsers.filter((u) => u.role === ROLES.SUPER_ADMIN).length;
    if (superAdminCount <= 1) {
      throw ApiError.conflict(
        'Cannot demote the last super_admin. Promote another user first.'
      );
    }
  }

  return userRepository.updateRole(id, role);
};

/**
 * Create a new user (called by super_admin)
 * @param {Object} data - { email, password, full_name, role }
 * @returns {Object}
 */
const createUser = async ({ email, password, full_name, role = ROLES.VIEWER }) => {
  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    return await userRepository.create({ id, email, full_name, role, password_hash });
  } catch (err) {
    // Handle unique constraint violation on email
    if (err.code === '23505') {
      throw ApiError.conflict(`A user with email "${email}" already exists`);
    }
    throw err;
  }
};

/**
 * Activate or deactivate a user account
 * @param {string} id
 * @param {boolean} is_active
 * @param {Object} requestingUser
 * @returns {Object}
 */
const setActiveStatus = async (id, is_active, requestingUser) => {
  if (requestingUser.id === id) {
    throw ApiError.forbidden('You cannot deactivate your own account');
  }

  const target = await userRepository.findById(id);
  if (!target) {
    throw ApiError.notFound(`User with ID ${id} not found`);
  }

  return userRepository.updateUser(id, { is_active });
};

module.exports = { getAll, getById, updateRole, createUser, setActiveStatus };
