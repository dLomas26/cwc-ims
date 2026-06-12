const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const authRepository = require('../repositories/authRepository');
const ApiError = require('../utils/ApiError');

/**
 * Auth Service
 * Business logic for authentication operations
 *
 * DEPENDENCY: bcryptjs must be installed
 * Run: npm install bcryptjs
 */

const SALT_ROUNDS = 12;

/**
 * Generate a signed JWT token for a user
 * @param {Object} user
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw ApiError.internal('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn }
  );
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, user: Object }}
 */
const login = async (email, password) => {
  // Find user by email
  const user = await authRepository.getUserByEmail(email);

  if (!user) {
    // Use generic message to prevent user enumeration
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.is_active) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact an administrator.');
  }

  // Check if password_hash exists (user must set password via setup or admin)
  if (!user.password_hash) {
    throw ApiError.unauthorized(
      'No password set for this account. Please contact an administrator to set your password.'
    );
  }

  // Compare password with stored hash
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login timestamp (non-blocking)
  authRepository.updateLastLogin(user.id).catch((err) => {
    console.error('Failed to update last login:', err.message);
  });

  const token = generateToken(user);

  // Return token and user data (never return password_hash)
  const { password_hash, ...safeUser } = user;
  return { token, user: safeUser };
};

/**
 * Get authenticated user by ID (for /me endpoint)
 * @param {string} userId
 * @returns {Object}
 */
const getMe = async (userId) => {
  const user = await authRepository.getUserById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
};

/**
 * Create the initial super_admin user (only runs when no users exist)
 * @param {Object} data - { email, password, full_name }
 * @returns {{ token: string, user: Object }}
 */
const createInitialAdmin = async ({ email, password, full_name }) => {
  // Guard: only allowed when system has no users
  const userCount = await authRepository.countUsers();
  if (userCount > 0) {
    throw ApiError.conflict(
      'Setup already complete. An administrator account already exists.'
    );
  }

  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await authRepository.createUser({
    id,
    email,
    full_name,
    role: 'super_admin',
    password_hash,
  });

  const token = generateToken(user);
  return { token, user };
};

/**
 * Create a new user (called by super_admin)
 * @param {Object} data - { email, password, full_name, role }
 * @returns {Object} created user
 */
const createUser = async ({ email, password, full_name, role }) => {
  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await authRepository.createUser({
    id,
    email,
    full_name,
    role,
    password_hash,
  });

  return user;
};

module.exports = { login, getMe, createInitialAdmin, createUser, generateToken };
