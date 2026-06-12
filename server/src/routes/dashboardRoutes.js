const router = require('express').Router();

const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT } = require('../middlewares/auth');

/**
 * Dashboard Routes
 * Base path: /api/dashboard
 */

// GET /api/dashboard/stats — system-wide statistics
router.get('/stats', authenticateJWT, dashboardController.getStats);

// GET /api/dashboard/activity — recent assignment activity
router.get('/activity', authenticateJWT, dashboardController.getRecentActivity);

module.exports = router;
