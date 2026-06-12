const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendCreated } = require('../utils/ApiResponse');
const assignmentService = require('../services/assignmentService');

/**
 * Assignment Controller
 */

/** GET /api/assignments */
const getAllAssignments = asyncHandler(async (req, res) => {
  const result = await assignmentService.getAll(req.query);
  sendSuccess(res, result.assignments, 'Assignments retrieved successfully', 200, result.meta);
});

/** POST /api/assignments */
const assignAsset = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.assign(req.body, req.user.id);
  sendCreated(res, assignment, 'Asset assigned successfully');
});

/** PATCH /api/assignments/:id/return */
const returnAsset = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.returnAsset(
    req.params.id,
    req.body,
    req.user.id
  );
  sendSuccess(res, assignment, 'Asset returned successfully');
});

/** GET /api/assignments/history */
const getHistory = asyncHandler(async (req, res) => {
  const result = await assignmentService.getHistory(req.query);
  sendSuccess(res, result.history, 'Assignment history retrieved', 200, result.meta);
});

module.exports = { getAllAssignments, assignAsset, returnAsset, getHistory };
