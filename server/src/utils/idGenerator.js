const { ID_PREFIXES } = require('../constants');
const { query } = require('../config/database');

/**
 * Generate next employee ID from pool or sequential counter
 */
const generateEmployeeId = async () => {
  return generateId('employee', ID_PREFIXES.EMPLOYEE, 'employees', 'employee_id', 'employee_id_pool');
};

/**
 * Generate next asset ID from pool or sequential counter
 */
const generateAssetId = async () => {
  return generateId('asset', ID_PREFIXES.ASSET, 'assets', 'asset_id', 'asset_id_pool');
};

/**
 * Core ID generation logic
 * 1. Check pool for reusable IDs
 * 2. If none, find max numeric suffix and increment
 */
const generateId = async (type, prefix, tableName, idColumn, poolTable) => {
  // Try pool first
  const poolResult = await query(
    `SELECT id, ${idColumn} FROM ${poolTable} ORDER BY id ASC LIMIT 1`
  );

  if (poolResult.rows.length > 0) {
    const row = poolResult.rows[0];
    await query(`DELETE FROM ${poolTable} WHERE id = $1`, [row.id]);
    return row[idColumn];
  }

  // Find max existing ID
  const maxResult = await query(
    `SELECT ${idColumn} FROM ${tableName} WHERE ${idColumn} LIKE $1 ORDER BY ${idColumn} DESC LIMIT 1`,
    [`${prefix}%`]
  );

  let nextNum = 1;
  if (maxResult.rows.length > 0) {
    const lastId = maxResult.rows[0][idColumn];
    const numStr = lastId.replace(prefix, '');
    nextNum = parseInt(numStr, 10) + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, '0')}`;
};

/**
 * Release an employee ID back to pool
 */
const releaseEmployeeId = async (employeeId) => {
  if (employeeId.startsWith(ID_PREFIXES.EMPLOYEE)) {
    await query(
      'INSERT INTO employee_id_pool (employee_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [employeeId]
    );
  }
};

/**
 * Release an asset ID back to pool
 */
const releaseAssetId = async (assetId) => {
  if (assetId.startsWith(ID_PREFIXES.ASSET)) {
    await query(
      'INSERT INTO asset_id_pool (asset_id) VALUES ($1) ON CONFLICT DO NOTHING',
      [assetId]
    );
  }
};

module.exports = { generateEmployeeId, generateAssetId, releaseEmployeeId, releaseAssetId };
