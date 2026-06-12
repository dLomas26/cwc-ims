const consumableRepository = require('../repositories/consumableRepository');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');
const { TRANSACTION_TYPES } = require('../constants');

/**
 * Consumable Service
 * Business logic for consumable stock management
 */

/**
 * Get paginated consumables list
 * @param {Object} queryParams
 * @returns {{ consumables: Object[], meta: Object }}
 */
const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { search } = queryParams;

  const { rows, total } = await consumableRepository.findAll({ search, limit, offset });

  return {
    consumables: rows,
    meta: buildPaginationMeta(total, page, limit),
  };
};

/**
 * Get a single consumable by ID
 * @param {string} id
 * @returns {Object}
 */
const getById = async (id) => {
  const consumable = await consumableRepository.findById(id);
  if (!consumable) {
    throw ApiError.notFound(`Consumable with ID ${id} not found`);
  }
  return consumable;
};

/**
 * Create a new consumable
 * @param {Object} data
 * @param {string} userId
 * @returns {Object}
 */
const create = async (data, userId) => {
  return consumableRepository.create({ ...data, created_by: userId });
};

/**
 * Update consumable metadata
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 */
const update = async (id, data) => {
  const existing = await consumableRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Consumable with ID ${id} not found`);
  }
  return consumableRepository.update(id, data);
};

/**
 * Delete a consumable
 * @param {string} id
 */
const deleteConsumable = async (id) => {
  const existing = await consumableRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Consumable with ID ${id} not found`);
  }
  await consumableRepository.deleteConsumable(id);
  return existing;
};

/**
 * Add stock (stock-in transaction)
 * @param {string} id
 * @param {Object} data - { quantity, reference, remarks }
 * @param {string} userId
 * @returns {{ consumable: Object, transaction: Object }}
 */
const stockIn = async (id, { quantity, reference, remarks }, userId) => {
  const existing = await consumableRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Consumable with ID ${id} not found`);
  }

  const [consumable, transaction] = await Promise.all([
    consumableRepository.addStock(id, quantity),
    consumableRepository.createTransaction({
      consumable_id: id,
      transaction_type: TRANSACTION_TYPES.STOCK_IN,
      quantity,
      reference,
      remarks,
      performed_by: userId,
    }),
  ]);

  return { consumable, transaction };
};

/**
 * Remove stock (stock-out transaction)
 * Validates that sufficient available stock exists
 * @param {string} id
 * @param {Object} data - { quantity, reference, remarks }
 * @param {string} userId
 * @returns {{ consumable: Object, transaction: Object }}
 */
const stockOut = async (id, { quantity, reference, remarks }, userId) => {
  const existing = await consumableRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Consumable with ID ${id} not found`);
  }

  const availableQty = parseInt(existing.available_quantity, 10);
  if (quantity > availableQty) {
    throw ApiError.conflict(
      `Insufficient stock. Requested: ${quantity}, Available: ${availableQty}`
    );
  }

  const [consumable, transaction] = await Promise.all([
    consumableRepository.removeStock(id, quantity),
    consumableRepository.createTransaction({
      consumable_id: id,
      transaction_type: TRANSACTION_TYPES.STOCK_OUT,
      quantity,
      reference,
      remarks,
      performed_by: userId,
    }),
  ]);

  return { consumable, transaction };
};

/**
 * Mark consumable units as damaged
 * Validates sufficient available stock to mark as damaged
 * @param {string} id
 * @param {Object} data - { quantity, reference, remarks }
 * @param {string} userId
 * @returns {{ consumable: Object, transaction: Object }}
 */
const markDamaged = async (id, { quantity, reference, remarks }, userId) => {
  const existing = await consumableRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Consumable with ID ${id} not found`);
  }

  const availableQty = parseInt(existing.available_quantity, 10);
  if (quantity > availableQty) {
    throw ApiError.conflict(
      `Cannot mark ${quantity} units as damaged. Only ${availableQty} available units exist.`
    );
  }

  const [consumable, transaction] = await Promise.all([
    consumableRepository.markDamaged(id, quantity),
    consumableRepository.createTransaction({
      consumable_id: id,
      transaction_type: TRANSACTION_TYPES.DAMAGED,
      quantity,
      reference,
      remarks,
      performed_by: userId,
    }),
  ]);

  return { consumable, transaction };
};

/**
 * Get transaction history for a consumable
 * @param {string} id
 * @param {Object} queryParams
 * @returns {{ transactions: Object[], meta: Object }}
 */
const getTransactions = async (id, queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);

  const existing = await consumableRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound(`Consumable with ID ${id} not found`);
  }

  const { rows, total } = await consumableRepository.getTransactions(id, { limit, offset });

  return {
    transactions: rows,
    meta: buildPaginationMeta(total, page, limit),
  };
};

module.exports = { getAll, getById, create, update, deleteConsumable, stockIn, stockOut, markDamaged, getTransactions };
