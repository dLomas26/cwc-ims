const assignmentRepository = require('../repositories/assignmentRepository');
const assetRepository = require('../repositories/assetRepository');
const employeeRepository = require('../repositories/employeeRepository');
const { parsePagination, buildPaginationMeta } = require('../utils/pagination');
const ApiError = require('../utils/ApiError');
const { ASSET_STATUSES, RETURN_CONDITIONS } = require('../constants');

/**
 * Assignment Service
 * Business logic for asset assignment and return operations
 */

/**
 * Get paginated list of active assignments
 * @param {Object} queryParams
 * @returns {{ assignments: Object[], meta: Object }}
 */
const getAll = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { employee_id, asset_id, is_active } = queryParams;

  const isActiveBool = is_active === 'false' ? false : true;

  const { rows, total } = await assignmentRepository.findAll({
    employee_id,
    asset_id,
    is_active: isActiveBool,
    limit,
    offset,
  });

  return {
    assignments: rows,
    meta: buildPaginationMeta(total, page, limit),
  };
};

/**
 * Assign an asset to an employee
 * Full validation: asset must exist and be available, employee must exist
 * @param {Object} data - { employee_id, asset_id, serial_number, asset_number, remarks }
 * @param {string} userId - performing user ID
 * @returns {Object} created assignment
 */
const assign = async (data, userId) => {
  const { employee_id, asset_id, serial_number, asset_number, assigned_at, remarks } = data;

  // 1. Verify employee exists and is not archived
  const employee = await employeeRepository.findById(employee_id);
  if (!employee) {
    throw ApiError.notFound(`Employee with ID ${employee_id} not found`);
  }
  if (employee.is_archived) {
    throw ApiError.conflict('Cannot assign assets to an archived employee');
  }

  // 2. Verify asset exists and is available
  const asset = await assetRepository.findById(asset_id);
  if (!asset) {
    throw ApiError.notFound(`Asset with ID ${asset_id} not found`);
  }
  if (asset.status !== ASSET_STATUSES.AVAILABLE) {
    throw ApiError.conflict(
      `Asset is not available for assignment. Current status: "${asset.status}"`
    );
  }

  // 3. Double-check no active assignment exists (race condition guard)
  const existingAssignment = await assignmentRepository.findActiveByAssetId(asset_id);
  if (existingAssignment) {
    throw ApiError.conflict('Asset already has an active assignment');
  }

  // 4. Update asset record with serial/asset number if provided
  if (serial_number || asset_number) {
    const updateFields = {};
    if (serial_number) updateFields.serial_number = serial_number;
    if (asset_number) updateFields.asset_number = asset_number;
    await assetRepository.update(asset_id, updateFields);
  }

  // 5. Create the assignment record
  const assignment = await assignmentRepository.create({
    employee_id,
    asset_id,
    remarks,
    assigned_at: assigned_at || null,
    assigned_by: userId,
  });

  // 6. Update asset status to 'assigned'
  await assetRepository.updateStatus(asset_id, ASSET_STATUSES.ASSIGNED);

  return assignment;
};

/**
 * Return an assigned asset
 * @param {string} assignmentId
 * @param {Object} returnData - { condition, remarks }
 * @param {string} userId
 * @returns {Object} updated assignment
 */
const returnAsset = async (assignmentId, { condition, remarks }, userId) => {
  // 1. Verify assignment exists and is active
  const assignment = await assignmentRepository.findById(assignmentId);
  if (!assignment) {
    throw ApiError.notFound(`Assignment with ID ${assignmentId} not found`);
  }
  if (!assignment.is_active) {
    throw ApiError.conflict('This assignment has already been returned');
  }

  // 2. Update assignment record
  const updated = await assignmentRepository.returnAssignment(assignmentId, {
    returned_at: new Date(),
    return_condition: condition,
    returned_by: userId,
    remarks,
  });

  // 3. Update asset status based on return condition
  const newStatus =
    condition === RETURN_CONDITIONS.GOOD
      ? ASSET_STATUSES.AVAILABLE
      : ASSET_STATUSES.DAMAGED;

  await assetRepository.updateStatus(assignment.asset_id, newStatus);

  return updated;
};

/**
 * Get paginated assignment history
 * @param {Object} queryParams
 * @returns {{ history: Object[], meta: Object }}
 */
const getHistory = async (queryParams) => {
  const { page, limit, offset } = parsePagination(queryParams);
  const { search, employee_id, category_id } = queryParams;

  const { rows, total } = await assignmentRepository.getHistory({
    search,
    employee_id,
    category_id,
    limit,
    offset,
  });

  return {
    history: rows,
    meta: buildPaginationMeta(total, page, limit),
  };
};

/**
 * Delete an assignment record permanently
 * Only allowed for already-returned (inactive) assignments to prevent
 * orphaning an asset's "assigned" status.
 * @param {string} id
 * @returns {boolean}
 */
const deleteAssignment = async (id) => {
  const assignment = await assignmentRepository.findById(id);
  if (!assignment) {
    throw ApiError.notFound(`Assignment with ID ${id} not found`);
  }
  if (assignment.is_active) {
    throw ApiError.conflict(
      'Cannot delete an active assignment. Return the asset first.'
    );
  }
  await assignmentRepository.deleteAssignment(id);
  return true;
};

module.exports = { getAll, assign, returnAsset, getHistory, deleteAssignment };
