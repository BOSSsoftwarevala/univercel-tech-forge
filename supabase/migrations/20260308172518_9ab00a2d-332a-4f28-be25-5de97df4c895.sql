ALTER TABLE public.software_catalog ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
UPDATE public.software_catalog SET is_active = true WHERE is_active IS NULL;