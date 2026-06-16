const { z } = require('zod');
const { RETURN_CONDITIONS } = require('../constants');

/**
 * Assignment validation schemas
 */

const createAssignmentSchema = z.object({
  employee_id: z.string().uuid('Employee ID must be a valid UUID'),
  asset_id: z.string().uuid('Asset ID must be a valid UUID'),
  // Optional: if provided, these get saved to the asset record too
  serial_number: z.string().optional(),
  asset_number: z.string().optional(),
  // Optional back-dated assignment timestamp; defaults to NOW() if omitted
  assigned_at: z.string().optional(),
  remarks: z.string().optional(),
});

const returnAssignmentSchema = z.object({
  condition: z.enum(
    [RETURN_CONDITIONS.GOOD, RETURN_CONDITIONS.DAMAGED],
    { errorMap: () => ({ message: 'Condition must be either "good" or "damaged"' }) }
  ),
  remarks: z.string().optional(),
});

module.exports = { createAssignmentSchema, returnAssignmentSchema };
