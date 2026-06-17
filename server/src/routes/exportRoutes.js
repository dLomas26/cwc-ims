const router = require('express').Router();

const exportController = require('../controllers/exportController');
const { authenticateJWT } = require('../middlewares/auth');

/**
 * Export Routes
 * Base path: /api/export
 * All routes require authentication
 */

// GET /api/export/employees — download employees Excel file
router.get('/employees', authenticateJWT, exportController.exportEmployees);

// GET /api/export/assets — download assets Excel file
router.get('/assets', authenticateJWT, exportController.exportAssets);

// GET /api/export/assignments — download assignment history Excel file
router.get('/assignments', authenticateJWT, exportController.exportAssignments);

// GET /api/export/stock — download consumable stock Excel file
router.get('/stock', authenticateJWT, exportController.exportStock);

// GET /api/export/bulk-inventory-transactions — download bulk inventory transactions Excel file
router.get('/bulk-inventory-transactions', authenticateJWT, exportController.exportBulkInventoryTransactions);

module.exports = router;
