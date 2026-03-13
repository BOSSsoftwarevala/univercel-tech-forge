
-- Create new SEO tables (only the ones that don't exist)
CREATE TABLE IF NOT EXISTS public.seo_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_name TEXT NOT NULL,
  domain TEXT NOT NULL,
  description TEXT,
  country TEXT DEFAULT 'Global',
  language TEXT DEFAULT 'en',
  search_engine TEXT DEFAULT 'google',
  status TEXT DEFAULT 'active',
  seo_score INTEGER DEFAULT 0,
  total_keywords INTEGER DEFAULT 0,
  total_backlinks INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  last_audit_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns to seo_keywords if they don't exist
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS page_url TEXT;
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS position INTEGER;
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS prev_position INTEGER;
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS search_volume INTEGER DEFAULT 0;
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS difficulty INTEGER DEFAULT 0;
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS cpc NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS intent TEXT DEFAULT 'informational';
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS trend JSONB DEFAULT '[]';
ALTER TABLE public.seo_keywords ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

CREATE TABLE IF NOT EXISTS public.seo_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL,
  position INTEGER NOT NULL,
  search_engine TEXT DEFAULT 'google',
  country TEXT DEFAULT 'US',
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_backlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT,
  domain_authority INTEGER DEFAULT 0,
  link_type TEXT DEFAULT 'dofollow',
  status TEXT DEFAULT 'active',
  is_toxic BOOLEAN DEFAULT false,
  first_seen TIMESTAMPTZ DEFAULT now(),
  last_checked TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  audit_type TEXT DEFAULT 'full',
  total_pages_crawled INTEGER DEFAULT 0,
  healthy_pages INTEGER DEFAULT 0,
  warning_pages INTEGER DEFAULT 0,
  error_pages INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  status TEXT DEFAULT 'completed',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_traffic_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  date DATE NOT NULL,
  organic_traffic INTEGER DEFAULT 0,
  paid_traffic INTEGER DEFAULT 0,
  direct_traffic INTEGER DEFAULT 0,
  referral_traffic INTEGER DEFAULT 0,
  bounce_rate NUMERIC(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  pages_per_session NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  competitor_domain TEXT NOT NULL,
  competitor_name TEXT,
  domain_authority INTEGER DEFAULT 0,
  total_keywords INTEGER DEFAULT 0,
  organic_traffic INTEGER DEFAULT 0,
  common_keywords INTEGER DEFAULT 0,
  keyword_gap INTEGER DEFAULT 0,
  backlink_count INTEGER DEFAULT 0,
  last_analyzed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID,
  user_id UUID,
  action_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_traffic_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_projects_access' AND tablename = 'seo_projects') THEN
    CREATE POLICY "seo_projects_access" ON public.seo_projects FOR ALL TO authenticated
    USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'))
    WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_keywords_access' AND tablename = 'seo_keywords') THEN
    CREATE POLICY "seo_keywords_access" ON public.seo_keywords FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_rankings_access' AND tablename = 'seo_rankings') THEN
    CREATE POLICY "seo_rankings_access" ON public.seo_rankings FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_backlinks_access' AND tablename = 'seo_backlinks') THEN
    CREATE POLICY "seo_backlinks_access" ON public.seo_backlinks FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_audit_reports_access' AND tablename = 'seo_audit_reports') THEN
    CREATE POLICY "seo_audit_reports_access" ON public.seo_audit_reports FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_traffic_access' AND tablename = 'seo_traffic_stats') THEN
    CREATE POLICY "seo_traffic_access" ON public.seo_traffic_stats FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_competitors_access' AND tablename = 'seo_competitors') THEN
    CREATE POLICY "seo_competitors_access" ON public.seo_competitors FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_activity_logs_access' AND tablename = 'seo_activity_logs') THEN
    CREATE POLICY "seo_activity_logs_access" ON public.seo_activity_logs FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager') OR user_id = auth.uid());
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seo_keywords_project ON public.seo_keywords(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_rankings_keyword ON public.seo_rankings(keyword_id);
CREATE INDEX IF NOT EXISTS idx_seo_backlinks_project ON public.seo_backlinks(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_audit_project ON public.seo_audit_reports(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_traffic_project_date ON public.seo_traffic_stats(project_id, date);
CREATE INDEX IF NOT EXISTS idx_seo_competitors_project ON public.seo_competitors(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_logs_project ON public.seo_activity_logs(project_id);
