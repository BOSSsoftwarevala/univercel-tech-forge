-- Demo validation logs table (immutable)
CREATE TABLE public.demo_validation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE,
  demo_url TEXT NOT NULL,
  validation_type TEXT NOT NULL, -- 'url_check', 'duplicate_check', 'reachability_check'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'passed', 'failed'
  error_message TEXT,
  http_status INTEGER,
  response_time_ms INTEGER,
  validated_by UUID,
  validated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Demo verification queue for bulk async processing
CREATE TABLE public.demo_verification_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add normalized URL column to demos for duplicate detection
ALTER TABLE public.demos 
ADD COLUMN IF NOT EXISTS normalized_url TEXT,
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS http_status INTEGER,
ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;

-- Create function to normalize URLs for duplicate detection
CREATE OR REPLACE FUNCTION normalize_demo_url(url TEXT)
RETURNS TEXT AS $$
DECLARE
  normalized TEXT;
BEGIN
  normalized := lower(url);
  -- Remove protocol
  normalized := regexp_replace(normalized, '^https?://', '');
  -- Remove www.
  normalized := regexp_replace(normalized, '^www\.', '');
  -- Remove trailing slashes
  normalized := regexp_replace(normalized, '/+$', '');
  -- Remove query params for core URL comparison
  normalized := regexp_replace(normalized, '\?.*$', '');
  RETURN normalized;
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- Create trigger to auto-populate normalized_url
CREATE OR REPLACE FUNCTION set_normalized_url()
RETURNS TRIGGER AS $$
BEGIN
  NEW.normalized_url := normalize_demo_url(NEW.url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trigger_set_normalized_url
BEFORE INSERT OR UPDATE OF url ON public.demos
FOR EACH ROW
EXECUTE FUNCTION set_normalized_url();

-- Update existing demos with normalized URLs
UPDATE public.demos SET normalized_url = normalize_demo_url(url) WHERE normalized_url IS NULL;

-- Create unique index on normalized_url for duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_demos_normalized_url_unique ON public.demos(normalized_url);

-- Create index for faster duplicate lookups
CREATE INDEX IF NOT EXISTS idx_demos_category_title ON public.demos(category, title);

-- RLS for validation logs (immutable - no update/delete)
ALTER TABLE public.demo_validation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo managers can insert validation logs"
ON public.demo_validation_logs FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'demo_manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

CREATE POLICY "Demo managers can view validation logs"
ON public.demo_validation_logs FOR SELECT
USING (
  has_role(auth.uid(), 'demo_manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  has_role(auth.uid(), 'master'::app_role)
);

-- RLS for verification queue
ALTER TABLE public.demo_verification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Demo managers can manage verification queue"
ON public.demo_verification_queue FOR ALL
USING (
  has_role(auth.uid(), 'demo_manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'demo_manager'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- System can insert into validation logs
CREATE POLICY "System can insert validation logs"
ON public.demo_validation_logs FOR INSERT
WITH CHECK (true);

-- System can manage verification queue
CREATE POLICY "System can manage verification queue"
ON public.demo_verification_queue FOR ALL
USING (true)
WITH CHECK (true);