
ALTER TABLE public.software_catalog 
  ADD COLUMN IF NOT EXISTS listing_status TEXT DEFAULT 'draft' CHECK (listing_status IN ('draft', 'pending_review', 'approved', 'live', 'rejected')),
  ADD COLUMN IF NOT EXISTS generated_by_vala BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS product_icon_url TEXT,
  ADD COLUMN IF NOT EXISTS product_thumbnail_url TEXT,
  ADD COLUMN IF NOT EXISTS github_repo_url TEXT,
  ADD COLUMN IF NOT EXISTS demo_domain TEXT,
  ADD COLUMN IF NOT EXISTS build_metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS approved_by UUID,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_software_catalog_listing_status ON public.software_catalog(listing_status);
CREATE INDEX IF NOT EXISTS idx_software_catalog_generated_by_vala ON public.software_catalog(generated_by_vala) WHERE generated_by_vala = true;
