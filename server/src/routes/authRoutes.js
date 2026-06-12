const router = require('express').Router();

const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/auth');
const { validateBody } = require('../middlewares/validate');
const { loginSchema, setupSchema } = require('../validators/authValidator');

/**
 * Auth Routes
 * Base path: /api/auth
 */

// POST /api/auth/login — authenticate with email + password
router.post('/login', validateBody(loginSchema), authController.login);

// POST /api/auth/logout — invalidate session (client drops JWT)
router.post('/logout', authenticateJWT, authController.logout);

// GET /api/auth/me — return current user's profile
router.get('/me', authenticateJWT, authController.getMe);

// POST /api/auth/setup — create first super_admin (only if no users exist)
router.post('/setup', validateBody(setupSchema), authController.createInitialAdmin);

module.exports = router;
