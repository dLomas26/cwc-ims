const router = require('express').Router();

const assetController = require('../controllers/assetController');
const { authenticateJWT } = require('../middlewares/auth');
const { requireAdmin } = require('../middlewares/roles');
const { validateBody } = require('../middlewares/validate');
const { createAssetSchema, updateAssetSchema, updateStatusSchema } = require('../validators/assetValidator');

/**
 * Asset Routes
 * Base path: /api/assets
 */

router.get('/', authenticateJWT, assetController.getAllAssets);
router.post('/', authenticateJWT, requireAdmin, validateBody(createAssetSchema), assetController.createAsset);

router.get('/:id', authenticateJWT, assetController.getAsset);
router.put('/:id', authenticateJWT, requireAdmin, validateBody(updateAssetSchema), assetController.updateAsset);
router.patch('/:id/status', authenticateJWT, requireAdmin, validateBody(updateStatusSchema), assetController.updateAssetStatus);
router.delete('/:id', authenticateJWT, requireAdmin, assetController.deleteAsset);

module.exports = router;
