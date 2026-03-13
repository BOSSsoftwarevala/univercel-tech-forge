-- Client domains table  
CREATE TABLE IF NOT EXISTS public.client_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deployment_id UUID REFERENCES public.client_deployments(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  domain_type TEXT DEFAULT 'custom',
  dns_status TEXT DEFAULT 'pending',
  ssl_status TEXT DEFAULT 'pending',
  ssl_expires_at TIMESTAMPTZ,
  a_record_ip TEXT DEFAULT '185.158.133.1',
  txt_record TEXT,
  is_primary BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.client_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage client domains"
ON public.client_domains FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Product files metadata table
CREATE TABLE IF NOT EXISTS public.product_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  storage_path TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  category TEXT DEFAULT 'source',
  description TEXT,
  uploaded_by UUID,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage product files"
ON public.product_files FOR ALL TO authenticated
USING (true) WITH CHECK (true);