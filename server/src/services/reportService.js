const reportRepository = require('../repositories/reportRepository');

/**
 * Report Service
 * Provides business-level access to report data
 */

const getEmployeeAssets = async () => reportRepository.getEmployeeAssets();

const getCategoryAssets = async () => reportRepository.getCategoryAssets();

const getAssetStatusReport = async (filters) => reportRepository.getAssetStatusReport(filters);

const getAssignmentHistory = async (filters) => reportRepository.getAssignmentHistory(filters);

const getConsumableStock = async () => reportRepository.getConsumableStock();

const getDamagedAssets = async () => reportRepository.getDamagedAssets();

module.exports = {
  getEmployeeAssets,
  getCategoryAssets,
  getAssetStatusReport,
  getAssignmentHistory,
  getConsumableStock,
  getDamagedAssets,
};
