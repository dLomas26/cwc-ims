const { query } = require('../config/database');

/**
 * User Repository
 * All database operations for user management (admin panel)
 */

/**
 * Find all users (never return password_hash)
 * @returns {Object[]}
 */
const findAll = async () => {
  const result = await query(
    `SELECT id, email, full_name, role, is_active, last_login_at, created_at
     FROM users
     ORDER BY created_at ASC`
  );
  return result.rows;
};

/**
 * Find a user by UUID (excludes password_hash)
 * @param {string} id
 * @returns {Object|null}
 */
const findById = async (id) => {
  const result = await query(
    `SELECT id, email, full_name, role, is_active, last_login_at, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Create a new user with hashed password
 * @param {Object} data
 * @returns {Object}
 */
const create = async ({ id, email, full_name, role, password_hash }) => {
  const result = await query(
    `INSERT INTO users (id, email, full_name, role, password_hash, is_active)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING id, email, full_name, role, is_active, created_at`,
    [id, email, full_name, role, password_hash]
  );
  return result.rows[0];
};

/**
 * Update a user's role
 * @param {string} id
 * @param {string} role
 * @returns {Object}
 */
const updateRole = async (id, role) => {
  const result = await query(
    `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2
     RETURNING id, email, full_name, role, is_active, created_at`,
    [role, id]
  );
  return result.rows[0] || null;
};

/**
 * Update a user's active status or other fields
 * @param {string} id
 * @param {Object} data - { is_active, full_name }
 * @returns {Object}
 */
const updateUser = async (id, data) => {
  const allowedFields = ['is_active', 'full_name'];
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
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${params.length}
     RETURNING id, email, full_name, role, is_active, created_at`,
    params
  );
  return result.rows[0] || null;
};

module.exports = { findAll, findById, create, updateRole, updateUser };
