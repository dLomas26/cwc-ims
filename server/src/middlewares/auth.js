const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { query } = require('../config/database');

/**
 * Verify JWT token and attach user to request
 */
const authenticateJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('No token provided');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  // Load user from database
  const result = await query(
    'SELECT id, email, full_name, role, is_active FROM users WHERE id = $1',
    [decoded.sub || decoded.id]
  );

  if (!result.rows.length) {
    throw ApiError.unauthorized('User not found');
  }

  const user = result.rows[0];

  if (!user.is_active) {
    throw ApiError.forbidden('Account is deactivated');
  }

  req.user = user;
  next();
});

module.exports = { authenticateJWT };
