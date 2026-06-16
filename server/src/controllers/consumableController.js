const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/ApiResponse');
const consumableService = require('../services/consumableService');

/**
 * Consumable (Bulk Inventory) Controller
 */

/** GET /api/consumables */
const getAllConsumables = asyncHandler(async (req, res) => {
  const result = await consumableService.getAll(req.query);
  sendSuccess(res, result.consumables, 'Items retrieved successfully', 200, result.meta);
});

/** GET /api/consumables/:id */
const getConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.getById(req.params.id);
  sendSuccess(res, consumable, 'Item retrieved successfully');
});

/** POST /api/consumables */
const createConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.create(req.body, req.user.id);
  sendCreated(res, consumable, 'Item created successfully');
});

/** PUT /api/consumables/:id */
const updateConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.update(req.params.id, req.body);
  sendSuccess(res, consumable, 'Item updated successfully');
});

/** DELETE /api/consumables/:id */
const deleteConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.deleteConsumable(req.params.id);
  sendSuccess(res, consumable, 'Item deleted successfully');
});

/** POST /api/consumables/:id/stock-in */
const stockIn = asyncHandler(async (req, res) => {
  const result = await consumableService.stockIn(req.params.id, req.body, req.user.id);
  sendSuccess(res, result, 'Stock added successfully');
});

/** POST /api/consumables/:id/stock-out */
const stockOut = asyncHandler(async (req, res) => {
  const result = await consumableService.stockOut(req.params.id, req.body, req.user.id);
  sendSuccess(res, result, 'Stock removed successfully');
});

/** POST /api/consumables/:id/damaged */
const markDamaged = asyncHandler(async (req, res) => {
  const result = await consumableService.markDamaged(req.params.id, req.body, req.user.id);
  sendSuccess(res, result, 'Units marked as damaged');
});

/** GET /api/consumables/:id/transactions */
const getTransactions = asyncHandler(async (req, res) => {
  const result = await consumableService.getTransactions(req.params.id, req.query);
  sendSuccess(res, result.transactions, 'Transactions retrieved', 200, result.meta);
});

/** GET /api/consumables/assignments */
const getAllAssignments = asyncHandler(async (req, res) => {
  const result = await consumableService.getAllAssignments(req.query);
  sendSuccess(res, result.assignments, 'Issuances retrieved successfully', 200, result.meta);
});

/** POST /api/consumables/:id/issue */
const issue = asyncHandler(async (req, res) => {
  const result = await consumableService.issue(req.params.id, req.body, req.user.id);
  sendCreated(res, result, 'Item issued successfully');
});

/** PATCH /api/consumables/assignments/:assignmentId/return */
const returnIssue = asyncHandler(async (req, res) => {
  const result = await consumableService.returnIssue(req.params.assignmentId, req.body, req.user.id);
  sendSuccess(res, result, 'Item returned successfully');
});

module.exports = {
  getAllConsumables,
  getConsumable,
  createConsumable,
  updateConsumable,
  deleteConsumable,
  stockIn,
  stockOut,
  markDamaged,
  getTransactions,
  getAllAssignments,
  issue,
  returnIssue,
};
