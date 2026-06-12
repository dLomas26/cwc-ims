const router = require('express').Router();

const categoryController = require('../controllers/categoryController');
const { authenticateJWT } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');
const { validateBody } = require('../middlewares/validate');
const {
  createCategorySchema,
  updateCategorySchema,
  createFieldSchema,
  updateFieldSchema,
} = require('../validators/categoryValidator');

/**
 * Category Routes
 * Base path: /api/categories
 */

router.get('/', authenticateJWT, categoryController.getAllCategories);
router.post('/', authenticateJWT, requireAdmin, validateBody(createCategorySchema), categoryController.createCategory);

router.get('/:id', authenticateJWT, categoryController.getCategoryById);
router.put('/:id', authenticateJWT, requireAdmin, validateBody(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', authenticateJWT, requireAdmin, categoryController.deleteCategory);

// Category field sub-routes
router.get('/:id/fields', authenticateJWT, categoryController.getCategoryFields);
router.post('/:id/fields', authenticateJWT, requireAdmin, validateBody(createFieldSchema), categoryController.addCategoryField);
router.put('/:id/fields/:fieldId', authenticateJWT, requireAdmin, validateBody(updateFieldSchema), categoryController.updateCategoryField);
router.delete('/:id/fields/:fieldId', authenticateJWT, requireAdmin, categoryController.deleteCategoryField);

module.exports = router;
