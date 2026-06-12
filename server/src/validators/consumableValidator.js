const { z } = require('zod');

/**
 * Consumable validation schemas
 */

const createConsumableSchema = z.object({
  name: z.string().min(1, 'Consumable name is required'),
  category: z.string().optional(),
  unit: z.string().optional(),
  remarks: z.string().optional(),
});

const updateConsumableSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  category: z.string().optional(),
  unit: z.string().optional(),
  remarks: z.string().optional(),
});

/**
 * Schema for stock transactions (stock-in, stock-out, damaged)
 */
const stockTransactionSchema = z.object({
  quantity: z
    .coerce
    .number({ required_error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  reference: z.string().optional(),
  remarks: z.string().optional(),
});

module.exports = { createConsumableSchema, updateConsumableSchema, stockTransactionSchema };
