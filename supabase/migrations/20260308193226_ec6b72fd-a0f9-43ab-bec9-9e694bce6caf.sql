
CREATE TABLE public.vala_auto_builds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  software_name TEXT NOT NULL,
  logo_description TEXT NOT NULL,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  build_progress INTEGER NOT NULL DEFAULT 0,
  current_step TEXT DEFAULT 'waiting',
  demo_domain TEXT,
  repository_url TEXT,
  marketplace_card_id UUID,
  specs_json JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vala_auto_builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view auto builds"
ON public.vala_auto_builds FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert auto builds"
ON public.vala_auto_builds FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update auto builds"
ON public.vala_auto_builds FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);
