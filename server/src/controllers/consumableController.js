const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/ApiResponse');
const consumableService = require('../services/consumableService');

/**
 * Consumable Controller
 */

/** GET /api/consumables */
const getAllConsumables = asyncHandler(async (req, res) => {
  const result = await consumableService.getAll(req.query);
  sendSuccess(res, result.consumables, 'Consumables retrieved successfully', 200, result.meta);
});

/** GET /api/consumables/:id */
const getConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.getById(req.params.id);
  sendSuccess(res, consumable, 'Consumable retrieved successfully');
});

/** POST /api/consumables */
const createConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.create(req.body, req.user.id);
  sendCreated(res, consumable, 'Consumable created successfully');
});

/** PUT /api/consumables/:id */
const updateConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.update(req.params.id, req.body);
  sendSuccess(res, consumable, 'Consumable updated successfully');
});

/** DELETE /api/consumables/:id */
const deleteConsumable = asyncHandler(async (req, res) => {
  const consumable = await consumableService.deleteConsumable(req.params.id);
  sendSuccess(res, consumable, 'Consumable deleted successfully');
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
};
