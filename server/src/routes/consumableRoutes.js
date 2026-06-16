const router = require('express').Router();

const consumableController = require('../controllers/consumableController');
const { authenticateJWT } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');
const { validateBody } = require('../middlewares/validate');
const {
  createConsumableSchema,
  updateConsumableSchema,
  stockTransactionSchema,
  issueConsumableSchema,
  returnConsumableSchema,
} = require('../validators/consumableValidator');

/**
 * Consumable (Bulk Inventory) Routes
 * Base path: /api/consumables
 *
 * IMPORTANT: more specific paths declared BEFORE /:id paths to avoid shadowing.
 */

// Assignments — must come before /:id
router.get('/assignments', authenticateJWT, consumableController.getAllAssignments);
router.patch(
  '/assignments/:assignmentId/return',
  authenticateJWT,
  requireAdmin,
  validateBody(returnConsumableSchema),
  consumableController.returnIssue
);

router.get('/', authenticateJWT, consumableController.getAllConsumables);
router.post('/', authenticateJWT, requireAdmin, validateBody(createConsumableSchema), consumableController.createConsumable);

router.get('/:id', authenticateJWT, consumableController.getConsumable);
router.put('/:id', authenticateJWT, requireAdmin, validateBody(updateConsumableSchema), consumableController.updateConsumable);
router.delete('/:id', authenticateJWT, requireAdmin, consumableController.deleteConsumable);

// Stock management
router.post('/:id/stock-in', authenticateJWT, requireAdmin, validateBody(stockTransactionSchema), consumableController.stockIn);
router.post('/:id/stock-out', authenticateJWT, requireAdmin, validateBody(stockTransactionSchema), consumableController.stockOut);
router.post('/:id/damaged', authenticateJWT, requireAdmin, validateBody(stockTransactionSchema), consumableController.markDamaged);

router.get('/:id/transactions', authenticateJWT, consumableController.getTransactions);

// Issue items to an employee
router.post(
  '/:id/issue',
  authenticateJWT,
  requireAdmin,
  validateBody(issueConsumableSchema),
  consumableController.issue
);

module.exports = router;
