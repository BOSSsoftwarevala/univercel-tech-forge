-- Add server_manager role to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'server_manager';