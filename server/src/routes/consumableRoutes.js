const router = require('express').Router();

const consumableController = require('../controllers/consumableController');
const { authenticateJWT } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');
const { validateBody } = require('../middlewares/validate');
const {
  createConsumableSchema,
  updateConsumableSchema,
  stockTransactionSchema,
} = require('../validators/consumableValidator');

/**
 * Consumable Routes
 * Base path: /api/consumables
 */

router.get('/', authenticateJWT, consumableController.getAllConsumables);
router.post('/', authenticateJWT, requireAdmin, validateBody(createConsumableSchema), consumableController.createConsumable);

router.get('/:id', authenticateJWT, consumableController.getConsumable);
router.put('/:id', authenticateJWT, requireAdmin, validateBody(updateConsumableSchema), consumableController.updateConsumable);
router.delete('/:id', authenticateJWT, requireAdmin, consumableController.deleteConsumable);

// Stock management sub-routes
router.post('/:id/stock-in', authenticateJWT, requireAdmin, validateBody(stockTransactionSchema), consumableController.stockIn);
router.post('/:id/stock-out', authenticateJWT, requireAdmin, validateBody(stockTransactionSchema), consumableController.stockOut);
router.post('/:id/damaged', authenticateJWT, requireAdmin, validateBody(stockTransactionSchema), consumableController.markDamaged);

router.get('/:id/transactions', authenticateJWT, consumableController.getTransactions);

module.exports = router;
