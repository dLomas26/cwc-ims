const { z } = require('zod');
const { RETURN_CONDITIONS } = require('../constants');

/**
 * Consumable (Bulk Inventory) validation schemas
 */

const createConsumableSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
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

const stockTransactionSchema = z.object({
  quantity: z
    .coerce
    .number({ required_error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  reference: z.string().optional(),
  remarks: z.string().optional(),
});

const issueConsumableSchema = z.object({
  employee_id: z.string().uuid('Employee ID must be a valid UUID'),
  quantity: z
    .coerce
    .number({ required_error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  is_returnable: z.boolean({ required_error: 'is_returnable is required' }),
  // Optional back-dated issue timestamp; defaults to NOW() if omitted
  assigned_at: z.string().optional(),
  remarks: z.string().optional(),
});

const returnConsumableSchema = z.object({
  returned_quantity: z
    .coerce
    .number({ required_error: 'Returned quantity is required' })
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  condition: z.enum(
    [RETURN_CONDITIONS.GOOD, RETURN_CONDITIONS.DAMAGED],
    { errorMap: () => ({ message: 'Condition must be either "good" or "damaged"' }) }
  ),
  remarks: z.string().optional(),
});

module.exports = {
  createConsumableSchema,
  updateConsumableSchema,
  stockTransactionSchema,
  issueConsumableSchema,
  returnConsumableSchema,
};
