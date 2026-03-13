-- Add new roles to app_role enum (25-28)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'safe_assist';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'assist_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'promise_tracker';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'promise_management';