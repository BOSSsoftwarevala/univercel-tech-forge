CREATE OR REPLACE FUNCTION public.can_manage_seo(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
    AND role IN ('boss_owner', 'super_admin', 'admin', 'seo_manager', 'marketing_manager', 'ceo')
    AND approval_status = 'approved'
)
$$;

ALTER TABLE public.seo_keywords
ADD COLUMN IF NOT EXISTS search_volume INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS cpc NUMERIC(12,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS difficulty_score INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS intent TEXT NOT NULL DEFAULT 'informational' CHECK (intent IN ('buy', 'info', 'commercial', 'navigational', 'transactional', 'informational')),
ADD COLUMN IF NOT EXISTS language_code TEXT NOT NULL DEFAULT 'en',
ADD COLUMN IF NOT EXISTS country_code TEXT,
ADD COLUMN IF NOT EXISTS trend_score INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS ctr NUMERIC(8,4) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS conversions INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS cluster_name TEXT,
ADD COLUMN IF NOT EXISTS serp_summary JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS competitor_data JSONB NOT NULL DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE public.seo_meta
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS schema_type TEXT DEFAULT 'WebPage',
ADD COLUMN IF NOT EXISTS seo_score INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS readability_score INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS updated_by UUID,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.seo_manager_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key TEXT NOT NULL UNIQUE DEFAULT 'global',
  auto_keyword_research BOOLEAN NOT NULL DEFAULT true,
  auto_content_generation BOOLEAN NOT NULL DEFAULT true,
  auto_publish BOOLEAN NOT NULL DEFAULT true,
  auto_rank_tracking BOOLEAN NOT NULL DEFAULT true,
  auto_backlink_outreach BOOLEAN NOT NULL DEFAULT true,
  auto_technical_fixes BOOLEAN NOT NULL DEFAULT true,
  approval_required BOOLEAN NOT NULL DEFAULT true,
  daily_optimization_enabled BOOLEAN NOT NULL DEFAULT true,
  default_language TEXT NOT NULL DEFAULT 'en',
  default_country TEXT NOT NULL DEFAULT 'IN',
  low_rank_threshold INTEGER NOT NULL DEFAULT 20,
  min_content_score INTEGER NOT NULL DEFAULT 80,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_keyword_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_name TEXT NOT NULL,
  niche TEXT NOT NULL,
  country_code TEXT NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  primary_keyword_id UUID REFERENCES public.seo_keywords(id) ON DELETE SET NULL,
  keyword_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  intent_mix JSONB NOT NULL DEFAULT '{}'::JSONB,
  opportunity_score INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES public.seo_keywords(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  content_markdown TEXT NOT NULL,
  faq_schema JSONB NOT NULL DEFAULT '[]'::JSONB,
  internal_links JSONB NOT NULL DEFAULT '[]'::JSONB,
  cta_text TEXT,
  seo_score INTEGER NOT NULL DEFAULT 0,
  readability_score INTEGER NOT NULL DEFAULT 0,
  publish_status TEXT NOT NULL DEFAULT 'draft' CHECK (publish_status IN ('draft', 'pending_approval', 'published', 'rejected')),
  published_url TEXT,
  language_code TEXT NOT NULL DEFAULT 'en',
  country_code TEXT,
  ai_generated BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES public.seo_keywords(id) ON DELETE SET NULL,
  page_slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT,
  features JSONB NOT NULL DEFAULT '[]'::JSONB,
  benefits JSONB NOT NULL DEFAULT '[]'::JSONB,
  testimonials JSONB NOT NULL DEFAULT '[]'::JSONB,
  cta_primary TEXT,
  body_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_score INTEGER NOT NULL DEFAULT 0,
  conversion_score INTEGER NOT NULL DEFAULT 0,
  publish_status TEXT NOT NULL DEFAULT 'draft' CHECK (publish_status IN ('draft', 'pending_approval', 'published', 'rejected')),
  preview_token TEXT,
  published_url TEXT,
  language_code TEXT NOT NULL DEFAULT 'en',
  country_code TEXT,
  ai_generated BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ,
  indexed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.landing_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  clicks INTEGER NOT NULL DEFAULT 0,
  form_submits INTEGER NOT NULL DEFAULT 0,
  signups INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC(8,4) NOT NULL DEFAULT 0,
  conversion_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  tracked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rank_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES public.seo_keywords(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 100,
  change_delta INTEGER NOT NULL DEFAULT 0,
  traffic INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC(8,4) NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_technical_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type TEXT NOT NULL CHECK (issue_type IN ('page_speed', 'mobile_friendly', 'sitemap', 'robots', 'indexing', 'broken_link', 'meta')),
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_url TEXT,
  auto_fixable BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'flagged', 'fixed', 'ignored')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_backlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blogs(id) ON DELETE SET NULL,
  landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE SET NULL,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  domain_authority INTEGER NOT NULL DEFAULT 0,
  spam_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'suspicious', 'toxic', 'pending')),
  outreach_status TEXT NOT NULL DEFAULT 'queued' CHECK (outreach_status IN ('queued', 'submitted', 'placed', 'failed')),
  disavow_suggested BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_type TEXT NOT NULL CHECK (audit_type IN ('full', 'content_gap', 'technical', 'landing', 'backlink')),
  target_url TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  findings JSONB NOT NULL DEFAULT '[]'::JSONB,
  suggestions JSONB NOT NULL DEFAULT '[]'::JSONB,
  status TEXT NOT NULL DEFAULT 'completed',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES public.seo_keywords(id) ON DELETE SET NULL,
  blog_id UUID REFERENCES public.blogs(id) ON DELETE SET NULL,
  landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE SET NULL,
  suggestion_type TEXT NOT NULL,
  title TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  reasoning TEXT,
  confidence INTEGER NOT NULL DEFAULT 0,
  impact TEXT NOT NULL DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'applied', 'dismissed')),
  auto_executed BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_approval (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'landing', 'email', 'social', 'ad')),
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE,
  landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by UUID,
  decided_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'landing', 'email', 'social', 'ad')),
  content_id UUID NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  content_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_score INTEGER NOT NULL DEFAULT 0,
  change_summary TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_type, content_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.localized_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('blog', 'landing', 'email', 'social', 'ad')),
  content_id UUID NOT NULL,
  language_code TEXT NOT NULL,
  country_code TEXT,
  localized_title TEXT,
  localized_body TEXT NOT NULL,
  localized_keywords JSONB NOT NULL DEFAULT '[]'::JSONB,
  seo_score INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (content_type, content_id, language_code, country_code)
);

CREATE TABLE IF NOT EXISTS public.seo_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL CHECK (run_type IN ('daily_rank_check', 'content_generation', 'technical_fix', 'backlink_outreach', 'auto_optimization', 'publish_sync')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  summary JSONB NOT NULL DEFAULT '{}'::JSONB,
  triggered_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_seo_keywords_country_language ON public.seo_keywords(country_code, language_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(publish_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON public.landing_pages(publish_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rank_history_keyword ON public.rank_history(keyword_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_technical_issues_status ON public.seo_technical_issues(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_backlinks_status ON public.seo_backlinks(status, outreach_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_ai_suggestions_status ON public.seo_ai_suggestions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_approval_status ON public.content_approval(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_versions_content ON public.content_versions(content_type, content_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_localized_content_lookup ON public.localized_content(content_type, content_id, language_code);

ALTER TABLE public.seo_manager_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keyword_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_technical_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_approval ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localized_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_automation_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seo_manager_settings_access" ON public.seo_manager_settings;
CREATE POLICY "seo_manager_settings_access" ON public.seo_manager_settings
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

DROP POLICY IF EXISTS "seo_manage" ON public.seo_keywords;
CREATE POLICY "seo_manage" ON public.seo_keywords
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_meta_manage" ON public.seo_meta
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_reports_manage" ON public.seo_reports
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_keyword_clusters_manage" ON public.seo_keyword_clusters
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "blogs_manage" ON public.blogs
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "landing_pages_manage" ON public.landing_pages
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "landing_metrics_manage" ON public.landing_metrics
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "rank_history_manage" ON public.rank_history
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_technical_issues_manage" ON public.seo_technical_issues
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_backlinks_manage" ON public.seo_backlinks
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_audits_manage" ON public.seo_audits
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_ai_suggestions_manage" ON public.seo_ai_suggestions
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "content_approval_manage" ON public.content_approval
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "content_versions_manage" ON public.content_versions
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "localized_content_manage" ON public.localized_content
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_activity_logs_read" ON public.seo_activity_logs
FOR SELECT USING (public.can_manage_seo(auth.uid()));

CREATE POLICY "seo_activity_logs_insert" ON public.seo_activity_logs
FOR INSERT WITH CHECK (true);

CREATE POLICY "seo_automation_runs_manage" ON public.seo_automation_runs
FOR ALL USING (public.can_manage_seo(auth.uid()))
WITH CHECK (public.can_manage_seo(auth.uid()));

DROP TRIGGER IF EXISTS update_seo_keywords_updated_at ON public.seo_keywords;
CREATE TRIGGER update_seo_keywords_updated_at BEFORE UPDATE ON public.seo_keywords FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_meta_updated_at ON public.seo_meta;
CREATE TRIGGER update_seo_meta_updated_at BEFORE UPDATE ON public.seo_meta FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_manager_settings_updated_at ON public.seo_manager_settings;
CREATE TRIGGER update_seo_manager_settings_updated_at BEFORE UPDATE ON public.seo_manager_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_keyword_clusters_updated_at ON public.seo_keyword_clusters;
CREATE TRIGGER update_seo_keyword_clusters_updated_at BEFORE UPDATE ON public.seo_keyword_clusters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_blogs_updated_at ON public.blogs;
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_landing_pages_updated_at ON public.landing_pages;
CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON public.landing_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_technical_issues_updated_at ON public.seo_technical_issues;
CREATE TRIGGER update_seo_technical_issues_updated_at BEFORE UPDATE ON public.seo_technical_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_backlinks_updated_at ON public.seo_backlinks;
CREATE TRIGGER update_seo_backlinks_updated_at BEFORE UPDATE ON public.seo_backlinks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_seo_ai_suggestions_updated_at ON public.seo_ai_suggestions;
CREATE TRIGGER update_seo_ai_suggestions_updated_at BEFORE UPDATE ON public.seo_ai_suggestions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_content_approval_updated_at ON public.content_approval;
CREATE TRIGGER update_content_approval_updated_at BEFORE UPDATE ON public.content_approval FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_localized_content_updated_at ON public.localized_content;
CREATE TRIGGER update_localized_content_updated_at BEFORE UPDATE ON public.localized_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.seo_manager_settings (
  settings_key,
  auto_keyword_research,
  auto_content_generation,
  auto_publish,
  auto_rank_tracking,
  auto_backlink_outreach,
  auto_technical_fixes,
  approval_required,
  daily_optimization_enabled,
  default_language,
  default_country,
  low_rank_threshold,
  min_content_score,
  metadata
) VALUES (
  'global',
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  'en',
  'IN',
  20,
  80,
  jsonb_build_object('engine', 'seo_manager_god_mode', 'publish', 'indexed')
)
ON CONFLICT (settings_key) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.seo_keywords;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.landing_pages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seo_ai_suggestions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.seo_activity_logs;