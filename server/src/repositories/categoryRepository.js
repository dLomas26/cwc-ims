const { query } = require('../config/database');

/**
 * Category Repository
 * All database operations for categories and their custom fields
 */

/**
 * Find all categories with a count of their associated fields
 * @returns {Object[]}
 */
const findAll = async () => {
  const result = await query(
    `SELECT
      c.*,
      COUNT(cf.id) AS field_count,
      COUNT(a.id) AS asset_count
     FROM categories c
     LEFT JOIN category_fields cf ON cf.category_id = c.id
     LEFT JOIN assets a ON a.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC`
  );
  return result.rows;
};

/**
 * Find a category by ID (no fields included)
 * @param {string} id
 * @returns {Object|null}
 */
const findById = async (id) => {
  const result = await query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Find a category with all its custom fields
 * @param {string} id
 * @returns {Object|null}
 */
const findWithFields = async (id) => {
  const [categoryResult, fieldsResult] = await Promise.all([
    query('SELECT * FROM categories WHERE id = $1', [id]),
    query(
      `SELECT * FROM category_fields WHERE category_id = $1 ORDER BY sort_order ASC, field_label ASC`,
      [id]
    ),
  ]);

  if (!categoryResult.rows[0]) return null;

  return {
    ...categoryResult.rows[0],
    fields: fieldsResult.rows,
  };
};

/**
 * Create a new category
 * @param {Object} data
 * @param {string} data.name
 * @param {string} [data.description]
 * @param {string} data.created_by
 * @returns {Object}
 */
const create = async ({ name, description, created_by }) => {
  const result = await query(
    `INSERT INTO categories (name, description, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description || null, created_by]
  );
  return result.rows[0];
};

/**
 * Update a category's name or description
 * @param {string} id
 * @param {Object} data
 * @returns {Object}
 */
const update = async (id, data) => {
  const setClauses = [];
  const params = [];

  if (data.name !== undefined) {
    params.push(data.name);
    setClauses.push(`name = $${params.length}`);
  }

  if (data.description !== undefined) {
    params.push(data.description);
    setClauses.push(`description = $${params.length}`);
  }

  if (setClauses.length === 0) return findById(id);

  params.push(new Date(), id);
  setClauses.push(`updated_at = $${params.length - 1}`);

  const result = await query(
    `UPDATE categories SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0] || null;
};

/**
 * Delete a category by ID
 * @param {string} id
 */
const deleteCategory = async (id) => {
  await query('DELETE FROM categories WHERE id = $1', [id]);
};

/**
 * Get all custom fields for a category ordered by sort_order
 * @param {string} categoryId
 * @returns {Object[]}
 */
const getFields = async (categoryId) => {
  const result = await query(
    `SELECT * FROM category_fields WHERE category_id = $1 ORDER BY sort_order ASC, field_label ASC`,
    [categoryId]
  );
  return result.rows;
};

/**
 * Find a single field by its own id, optionally scoped to a category
 * @param {number|string} fieldId
 * @param {number|string} [categoryId]
 * @returns {Object|null}
 */
const findFieldById = async (fieldId, categoryId) => {
  let sql, params;
  if (categoryId !== undefined) {
    sql = 'SELECT * FROM category_fields WHERE id = $1 AND category_id = $2';
    params = [fieldId, categoryId];
  } else {
    sql = 'SELECT * FROM category_fields WHERE id = $1';
    params = [fieldId];
  }
  const result = await query(sql, params);
  return result.rows[0] || null;
};

/**
 * Add a new custom field to a category
 * @param {string} categoryId
 * @param {Object} data
 * @returns {Object}
 */
const addField = async (categoryId, { field_name, field_label, field_type, field_options, is_required, sort_order }) => {
  const result = await query(
    `INSERT INTO category_fields
      (category_id, field_name, field_label, field_type, field_options, is_required, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      categoryId,
      field_name,
      field_label,
      field_type,
      field_options ? JSON.stringify(field_options) : null,
      is_required ?? false,
      sort_order ?? 0,
    ]
  );
  return result.rows[0];
};

/**
 * Update an existing category field
 * @param {string} fieldId
 * @param {Object} data
 * @returns {Object}
 */
const updateField = async (fieldId, data) => {
  const allowedFields = ['field_label', 'field_type', 'field_options', 'is_required', 'sort_order'];
  const setClauses = [];
  const params = [];

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(data, field)) {
      const value = field === 'field_options' && data[field]
        ? JSON.stringify(data[field])
        : data[field];
      params.push(value);
      setClauses.push(`${field} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) {
    const result = await query('SELECT * FROM category_fields WHERE id = $1', [fieldId]);
    return result.rows[0];
  }

  params.push(fieldId);
  const result = await query(
    `UPDATE category_fields SET ${setClauses.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  return result.rows[0] || null;
};

/**
 * Delete a custom field
 * @param {string} fieldId
 */
const deleteField = async (fieldId) => {
  await query('DELETE FROM category_fields WHERE id = $1', [fieldId]);
};

/**
 * Count assets belonging to a category
 * @param {string} categoryId
 * @returns {number}
 */
const countAssets = async (categoryId) => {
  const result = await query(
    'SELECT COUNT(*) AS count FROM assets WHERE category_id = $1',
    [categoryId]
  );
  return parseInt(result.rows[0].count, 10);
};

module.exports = {
  findAll,
  findById,
  findWithFields,
  create,
  update,
  deleteCategory,
  getFields,
  findFieldById,
  addField,
  updateField,
  deleteField,
  countAssets,
};
