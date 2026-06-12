const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/ApiResponse');
const dashboardService = require('../services/dashboardService');

/**
 * Dashboard Controller
 */

/** GET /api/dashboard/stats */
const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  sendSuccess(res, stats, 'Dashboard statistics retrieved');
});

/** GET /api/dashboard/activity */
const getRecentActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const activity = await dashboardService.getRecentActivity(limit);
  sendSuccess(res, activity, 'Recent activity retrieved');
});

module.exports = { getStats, getRecentActivity };
