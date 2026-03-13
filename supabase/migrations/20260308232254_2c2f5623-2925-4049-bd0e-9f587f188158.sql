-- 1. Create auto_builds table for Continuous Creation Dashboard
CREATE TABLE IF NOT EXISTS public.auto_builds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'General',
  software_name text NOT NULL,
  logo_description text,
  logo_url text,
  status text NOT NULL DEFAULT 'queued',
  build_progress integer NOT NULL DEFAULT 0,
  current_step text NOT NULL DEFAULT 'selecting_category',
  demo_domain text,
  repository_url text,
  specs_json jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.auto_builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view auto_builds" 
ON public.auto_builds FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert auto_builds" 
ON public.auto_builds FOR INSERT 
TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update auto_builds" 
ON public.auto_builds FOR UPDATE 
TO authenticated USING (true);

-- 2. Create product-files storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-files', 'product-files', false, 524288000,
  ARRAY['application/zip', 'application/x-zip-compressed', 'application/vnd.android.package-archive', 'application/octet-stream', 'application/gzip', 'application/x-tar', 'image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf', 'text/plain', 'application/json']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Auth users can upload product files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-files');

CREATE POLICY "Auth users can view product files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'product-files');

CREATE POLICY "Auth users can delete product files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'product-files');

-- Enable realtime for auto_builds
ALTER PUBLICATION supabase_realtime ADD TABLE public.auto_builds;