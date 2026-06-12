const { z } = require('zod');
const { FIELD_TYPES } = require('../constants');

/**
 * Category validation schemas
 */

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name cannot be empty').optional(),
  description: z.string().optional(),
});

/**
 * Schema for adding or updating a custom field on a category
 */
const createFieldSchema = z.object({
  field_name: z
    .string()
    .min(1, 'Field name is required')
    .regex(/^[a-z_][a-z0-9_]*$/, 'Field name must be lowercase letters, numbers, and underscores only'),
  field_label: z.string().min(1, 'Field label is required'),
  field_type: z.enum(
    [FIELD_TYPES.TEXT, FIELD_TYPES.NUMBER, FIELD_TYPES.DATE, FIELD_TYPES.BOOLEAN, FIELD_TYPES.SELECT],
    { errorMap: () => ({ message: 'Invalid field type' }) }
  ),
  field_options: z
    .array(z.string())
    .optional()
    .nullable(),
  is_required: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

const updateFieldSchema = z.object({
  field_label: z.string().min(1).optional(),
  field_type: z
    .enum([FIELD_TYPES.TEXT, FIELD_TYPES.NUMBER, FIELD_TYPES.DATE, FIELD_TYPES.BOOLEAN, FIELD_TYPES.SELECT])
    .optional(),
  field_options: z.array(z.string()).optional().nullable(),
  is_required: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

module.exports = { createCategorySchema, updateCategorySchema, createFieldSchema, updateFieldSchema };
