
-- Add SEO columns to software_catalog
ALTER TABLE public.software_catalog 
  ADD COLUMN IF NOT EXISTS seo_slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS marketing_hashtags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS feature_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS og_image_url TEXT,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS long_description TEXT,
  ADD COLUMN IF NOT EXISTS hreflang_codes TEXT[] DEFAULT '{en}';

-- Create index on slug for fast URL lookups
CREATE INDEX IF NOT EXISTS idx_software_catalog_seo_slug ON public.software_catalog(seo_slug);

-- Create function to auto-generate slug from product name
CREATE OR REPLACE FUNCTION public.generate_seo_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug from name
  base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;
  
  -- Handle uniqueness
  WHILE EXISTS (SELECT 1 FROM public.software_catalog WHERE seo_slug = final_slug AND id != NEW.id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.seo_slug := final_slug;
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate slug on insert/update when slug is null
DROP TRIGGER IF EXISTS trg_generate_seo_slug ON public.software_catalog;
CREATE TRIGGER trg_generate_seo_slug
  BEFORE INSERT OR UPDATE OF name ON public.software_catalog
  FOR EACH ROW
  WHEN (NEW.seo_slug IS NULL)
  EXECUTE FUNCTION public.generate_seo_slug();
