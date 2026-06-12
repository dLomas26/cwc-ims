const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/ApiResponse');
const reportService = require('../services/reportService');

/**
 * Report Controller
 */

/** GET /api/reports/employees */
const getEmployeeAssetsReport = asyncHandler(async (req, res) => {
  const data = await reportService.getEmployeeAssets();
  sendSuccess(res, data, 'Employee assets report retrieved');
});

/** GET /api/reports/categories */
const getCategoryReport = asyncHandler(async (req, res) => {
  const data = await reportService.getCategoryAssets();
  sendSuccess(res, data, 'Category report retrieved');
});

/** GET /api/reports/asset-status */
const getAssetStatusReport = asyncHandler(async (req, res) => {
  const { category_id, status } = req.query;
  const data = await reportService.getAssetStatusReport({ category_id, status });
  sendSuccess(res, data, 'Asset status report retrieved');
});

/** GET /api/reports/assignment-history */
const getAssignmentHistoryReport = asyncHandler(async (req, res) => {
  const { from_date, to_date, employee_id } = req.query;
  const data = await reportService.getAssignmentHistory({ from_date, to_date, employee_id });
  sendSuccess(res, data, 'Assignment history report retrieved');
});

/** GET /api/reports/consumable-stock */
const getConsumableStockReport = asyncHandler(async (req, res) => {
  const data = await reportService.getConsumableStock();
  sendSuccess(res, data, 'Consumable stock report retrieved');
});

/** GET /api/reports/damaged-assets */
const getDamagedAssetsReport = asyncHandler(async (req, res) => {
  const data = await reportService.getDamagedAssets();
  sendSuccess(res, data, 'Damaged assets report retrieved');
});

module.exports = {
  getEmployeeAssetsReport,
  getCategoryReport,
  getAssetStatusReport,
  getAssignmentHistoryReport,
  getConsumableStockReport,
  getDamagedAssetsReport,
};
