const router = require('express').Router();

const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middlewares/auth');
const { requireSuperAdmin } = require('../middlewares/roles');
const { validateBody } = require('../middlewares/validate');
const { createUserByAdminSchema } = require('../validators/authValidator');
const { z } = require('zod');

/**
 * User Routes
 * Base path: /api/users
 * All routes require super_admin role
 */

// GET /api/users — list all system users
router.get('/', authenticateJWT, requireSuperAdmin, userController.getAllUsers);

// GET /api/users/:id — get a specific user
router.get('/:id', authenticateJWT, requireSuperAdmin, userController.getUser);

// POST /api/users — create a new user account
router.post(
  '/',
  authenticateJWT,
  requireSuperAdmin,
  validateBody(createUserByAdminSchema),
  userController.createUser
);

// PATCH /api/users/:id/role — update user role
router.patch(
  '/:id/role',
  authenticateJWT,
  requireSuperAdmin,
  validateBody(
    z.object({
      role: z.enum(['super_admin', 'admin', 'viewer'], {
        errorMap: () => ({ message: 'Role must be super_admin, admin, or viewer' }),
      }),
    })
  ),
  userController.updateRole
);

// PATCH /api/users/:id/status — activate or deactivate user
router.patch(
  '/:id/status',
  authenticateJWT,
  requireSuperAdmin,
  validateBody(
    z.object({
      is_active: z.boolean({ required_error: 'is_active boolean is required' }),
    })
  ),
  userController.setActiveStatus
);

// DELETE /api/users/:id — permanently delete a user account
router.delete(
  '/:id',
  authenticateJWT,
  requireSuperAdmin,
  userController.deleteUser
);

module.exports = router;
