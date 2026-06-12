/**
 * Main API Router
 * Mounts all route modules under their respective paths
 */
const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/employees', require('./employeeRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/assets', require('./assetRoutes'));
router.use('/assignments', require('./assignmentRoutes'));
router.use('/consumables', require('./consumableRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/reports', require('./reportRoutes'));
router.use('/export', require('./exportRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;
