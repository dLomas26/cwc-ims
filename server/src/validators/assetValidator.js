const { z } = require('zod');

/**
 * Asset validation schemas
 * asset_id is REQUIRED and admin-entered (can contain letters, numbers, hyphens, etc.).
 */

const createAssetSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  category_id: z.coerce.number().int().positive('Category is required'),
  product_name: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  asset_number: z.string().optional(),
  purchase_date: z.string().optional(),
  warranty_expiry: z.string().optional(),
  remarks: z.string().optional(),
  custom_fields: z.record(z.any()).optional(),
});

const updateAssetSchema = z.object({
  category_id: z.coerce.number().int().positive().optional(),
  product_name: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  asset_number: z.string().optional(),
  purchase_date: z.string().optional(),
  warranty_expiry: z.string().optional(),
  remarks: z.string().optional(),
  custom_fields: z.record(z.any()).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['available', 'under_repair', 'damaged', 'retired'], {
    errorMap: () => ({ message: 'Status must be: available, under_repair, damaged, or retired' }),
  }),
});

module.exports = { createAssetSchema, updateAssetSchema, updateStatusSchema };
