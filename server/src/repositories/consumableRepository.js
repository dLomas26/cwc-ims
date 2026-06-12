const { query } = require('../config/database');

/**
 * Consumable Repository
 * All database operations for consumables and stock transactions
 */

/**
 * Find all consumables with pagination
 * available_quantity = current_stock - damaged_quantity
 * @param {Object} params
 * @returns {{ rows: Object[], total: number }}
 */
const findAll = async ({ search, limit, offset }) => {
  const conditions = [];
  const params = [];

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    params.push(term, term);
    conditions.push(
      `(c.name ILIKE $${params.length - 1} OR c.category ILIKE $${params.length})`
    );
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit, offset);

  const sql = `
    SELECT
      c.*,
      (c.current_stock - c.damaged_quantity) AS available_quantity,
      COUNT(*) OVER() AS total_count
    FROM consumables c
    ${whereClause}
    ORDER BY c.name ASC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const result = await query(sql, params);
  const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
  const rows = result.rows.map(({ total_count, ...row }) => row);

  return { rows, total };
};

/**
 * Find a single consumable by ID
 * @param {string} id
 * @returns {Object|null}
 */
const findById = async (id) => {
  const result = await query(
    `SELECT *, (current_stock - damaged_quantity) AS available_quantity FROM consumables WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Create a consumable
 * @param {Object} data
 * @returns {Object}
 */
const create = async ({ name, category, unit, remarks, created_by }) => {
  const result = await query(
    `INSERT INTO consumables (name, category, unit, remarks, created_by, current_stock, damaged_quantity)
     VALUES ($1, $2, $3, $4, $5, 0, 0)
     RETURNING *, (current_stock - damaged_quantity) AS available_quantity`,
    [name, category || null, unit || null, remarks || null, created_by]
  );
  return result.rows[0];
};

/**
 * Update a consumable's metadata fields
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 */
const update = async (id, data) => {
  const allowedFields = ['name', 'category', 'unit', 'remarks'];
  const setClauses = [];
  const params = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      params.push(data[field]);
      setClauses.push(`${field} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) return findById(id);

  params.push(new Date(), id);
  setClauses.push(`updated_at = $${params.length - 1}`);

  const result = await query(
    `UPDATE consumables SET ${setClauses.join(', ')} WHERE id = $${params.length}
     RETURNING *, (current_stock - damaged_quantity) AS available_quantity`,
    params
  );
  return result.rows[0] || null;
};

/**
 * Delete a consumable
 * @param {string} id
 */
const deleteConsumable = async (id) => {
  await query('DELETE FROM consumables WHERE id = $1', [id]);
};

/**
 * Add stock to a consumable (stock-in)
 * @param {string} id
 * @param {number} quantity
 * @returns {Object}
 */
const addStock = async (id, quantity) => {
  const result = await query(
    `UPDATE consumables
     SET current_stock = current_stock + $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *, (current_stock - damaged_quantity) AS available_quantity`,
    [quantity, id]
  );
  return result.rows[0] || null;
};

/**
 * Remove stock from a consumable (stock-out)
 * Pre-condition: enough available stock must exist (checked in service)
 * @param {string} id
 * @param {number} quantity
 * @returns {Object}
 */
const removeStock = async (id, quantity) => {
  const result = await query(
    `UPDATE consumables
     SET current_stock = current_stock - $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *, (current_stock - damaged_quantity) AS available_quantity`,
    [quantity, id]
  );
  return result.rows[0] || null;
};

/**
 * Mark units as damaged
 * @param {string} id
 * @param {number} quantity
 * @returns {Object}
 */
const markDamaged = async (id, quantity) => {
  const result = await query(
    `UPDATE consumables
     SET damaged_quantity = damaged_quantity + $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *, (current_stock - damaged_quantity) AS available_quantity`,
    [quantity, id]
  );
  return result.rows[0] || null;
};

/**
 * Get transaction history for a consumable
 * @param {string} consumableId
 * @param {Object} pagination
 * @returns {{ rows: Object[], total: number }}
 */
const getTransactions = async (consumableId, { limit, offset }) => {
  const result = await query(
    `SELECT
      st.*,
      u.full_name AS performed_by_name,
      COUNT(*) OVER() AS total_count
     FROM stock_transactions st
     LEFT JOIN users u ON u.id = st.performed_by
     WHERE st.consumable_id = $1
     ORDER BY st.created_at DESC
     LIMIT $2 OFFSET $3`,
    [consumableId, limit, offset]
  );

  const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count, 10) : 0;
  const rows = result.rows.map(({ total_count, ...row }) => row);

  return { rows, total };
};

/**
 * Create a stock transaction record
 * @param {Object} data
 * @returns {Object}
 */
const createTransaction = async ({
  consumable_id,
  transaction_type,
  quantity,
  reference,
  remarks,
  performed_by,
}) => {
  const result = await query(
    `INSERT INTO stock_transactions
       (consumable_id, transaction_type, quantity, reference, remarks, performed_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [consumable_id, transaction_type, quantity, reference || null, remarks || null, performed_by]
  );
  return result.rows[0];
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteConsumable,
  addStock,
  removeStock,
  markDamaged,
  getTransactions,
  createTransaction,
};
