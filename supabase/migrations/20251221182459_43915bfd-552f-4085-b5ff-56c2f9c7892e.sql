-- ============================================
-- SOFTWARE VALA - Add new enum roles
-- Run this first, then tables in next migration
-- ============================================

-- Add missing roles to the enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'lead_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'task_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'demo_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'seo_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'marketing_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'client_success';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'hr_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'legal_compliance';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'api_security';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'r_and_d';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'performance_manager';