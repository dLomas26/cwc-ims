const router = require('express').Router();

const reportController = require('../controllers/reportController');
const { authenticateJWT } = require('../middlewares/auth');

/**
 * Report Routes
 * Base path: /api/reports
 * All routes require authentication (viewers can access reports)
 */

// GET /api/reports/employees — employee-wise assets
router.get('/employees', authenticateJWT, reportController.getEmployeeAssetsReport);

// GET /api/reports/categories — category breakdown
router.get('/categories', authenticateJWT, reportController.getCategoryReport);

// GET /api/reports/asset-status — filtered asset list by status/category
router.get('/asset-status', authenticateJWT, reportController.getAssetStatusReport);

// GET /api/reports/assignment-history — history with date/employee filters
router.get('/assignment-history', authenticateJWT, reportController.getAssignmentHistoryReport);

// GET /api/reports/consumable-stock — all consumables with stock details
router.get('/consumable-stock', authenticateJWT, reportController.getConsumableStockReport);

// GET /api/reports/bulk-inventory-transactions — full audit log of bulk inventory stock movements
router.get('/bulk-inventory-transactions', authenticateJWT, reportController.getBulkInventoryTransactionsReport);

// GET /api/reports/damaged-assets — all damaged assets
router.get('/damaged-assets', authenticateJWT, reportController.getDamagedAssetsReport);

module.exports = router;
