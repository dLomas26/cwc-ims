const ApiError = require('../utils/ApiError');
const { ROLES } = require('../constants');

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = [ROLES.VIEWER, ROLES.ADMIN, ROLES.SUPER_ADMIN];

/**
 * Check if user's role meets minimum required role
 */
const hasRole = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  return userLevel >= requiredLevel;
};

/**
 * Middleware factory: require minimum role
 * Usage: authorizeRole('admin') or authorizeRole('super_admin')
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const hasPermission = roles.some((role) => hasRole(req.user.role, role));

    if (!hasPermission) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
};

/**
 * Shorthand middleware factories
 */
const requireAdmin = authorizeRole(ROLES.ADMIN);
const requireSuperAdmin = authorizeRole(ROLES.SUPER_ADMIN);

module.exports = { authorizeRole, requireAdmin, requireSuperAdmin, hasRole };
