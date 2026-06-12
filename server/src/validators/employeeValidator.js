const { z } = require('zod');

/**
 * Employee validation schemas
 * employee_id is REQUIRED and admin-entered (can contain letters, numbers, hyphens).
 */

const createEmployeeSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Employee name is required'),
  division: z.string().optional(),
  designation: z.string().optional(),
  mobile: z.string().optional(),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  remarks: z.string().optional(),
});

const updateEmployeeSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').optional(),
  division: z.string().optional(),
  designation: z.string().optional(),
  mobile: z.string().optional(),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  remarks: z.string().optional(),
});

module.exports = { createEmployeeSchema, updateEmployeeSchema };
