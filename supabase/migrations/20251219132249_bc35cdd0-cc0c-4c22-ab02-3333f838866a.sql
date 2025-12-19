-- Add 'prime' and 'client_success' to app_role enum
DO $$ BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'prime';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client_success';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;