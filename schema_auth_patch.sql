-- ============================================================
-- CWC Inventory Management — Auth Patch Migration
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- Add password_hash for Express-managed authentication
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add last_login tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
