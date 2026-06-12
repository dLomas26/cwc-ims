const { z } = require('zod');

/**
 * Login request schema
 */
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Initial admin setup schema
 * Used only when no users exist in the database
 */
const setupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required'),
});

/**
 * Create user schema (for super_admin to create additional users)
 */
const createUserByAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  role: z.enum(['super_admin', 'admin', 'viewer']).default('viewer'),
});

module.exports = { loginSchema, setupSchema, createUserByAdminSchema };
