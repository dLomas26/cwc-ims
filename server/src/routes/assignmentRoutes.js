const router = require('express').Router();

const assignmentController = require('../controllers/assignmentController');
const { authenticateJWT } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');
const { validateBody } = require('../middlewares/validate');
const { createAssignmentSchema, returnAssignmentSchema } = require('../validators/assignmentValidator');

/**
 * Assignment Routes
 * Base path: /api/assignments
 *
 * IMPORTANT: /history must be declared BEFORE /:id routes to avoid route shadowing
 */

// GET /api/assignments/history — full assignment history with filters
router.get('/history', authenticateJWT, assignmentController.getHistory);

// GET /api/assignments — active assignments list
router.get('/', authenticateJWT, assignmentController.getAllAssignments);

// POST /api/assignments — assign an asset to an employee
router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  validateBody(createAssignmentSchema),
  assignmentController.assignAsset
);

// PATCH /api/assignments/:id/return — return an assigned asset
router.patch(
  '/:id/return',
  authenticateJWT,
  requireAdmin,
  validateBody(returnAssignmentSchema),
  assignmentController.returnAsset
);

// DELETE /api/assignments/:id — permanently delete a returned assignment record
router.delete(
  '/:id',
  authenticateJWT,
  requireAdmin,
  assignmentController.deleteAssignment
);

module.exports = router;
