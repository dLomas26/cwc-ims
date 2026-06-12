const dashboardRepository = require('../repositories/dashboardRepository');

/**
 * Dashboard Service
 */

/**
 * Get all dashboard statistics
 * @returns {Object}
 */
const getStats = async () => {
  return dashboardRepository.getStats();
};

/**
 * Get recent activity feed
 * @param {number} limit
 * @returns {Object[]}
 */
const getRecentActivity = async (limit = 10) => {
  return dashboardRepository.getRecentActivity(limit);
};

module.exports = { getStats, getRecentActivity };
