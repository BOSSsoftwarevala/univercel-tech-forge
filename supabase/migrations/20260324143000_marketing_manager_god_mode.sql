CREATE OR REPLACE FUNCTION public.can_manage_marketing(_user_id UUID)
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
    AND role IN ('boss_owner', 'super_admin', 'admin', 'marketing_manager', 'seo_manager', 'lead_manager', 'ceo')
    AND approval_status = 'approved'
)
$$;

CREATE TABLE IF NOT EXISTS public.marketing_manager_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key TEXT NOT NULL UNIQUE DEFAULT 'global',
  auto_campaign_engine BOOLEAN NOT NULL DEFAULT true,
  auto_social_publish BOOLEAN NOT NULL DEFAULT true,
  auto_followups BOOLEAN NOT NULL DEFAULT true,
  auto_budget_adjustment BOOLEAN NOT NULL DEFAULT true,
  hourly_optimization_enabled BOOLEAN NOT NULL DEFAULT true,
  manager_approval_required BOOLEAN NOT NULL DEFAULT true,
  budget_guard_enabled BOOLEAN NOT NULL DEFAULT true,
  default_budget NUMERIC(14,2) NOT NULL DEFAULT 25000,
  max_campaign_budget NUMERIC(14,2) NOT NULL DEFAULT 500000,
  low_ctr_threshold NUMERIC(8,4) NOT NULL DEFAULT 0.015,
  high_cpc_threshold NUMERIC(12,2) NOT NULL DEFAULT 150,
  low_conversion_threshold NUMERIC(8,4) NOT NULL DEFAULT 0.01,
  updated_by UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_campaigns
ADD COLUMN IF NOT EXISTS objective TEXT,
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS audience JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS creatives JSONB NOT NULL DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'auto_approved')),
ADD COLUMN IF NOT EXISTS automation_status TEXT NOT NULL DEFAULT 'draft' CHECK (automation_status IN ('draft', 'queued', 'running', 'paused', 'optimizing', 'completed', 'stopped')),
ADD COLUMN IF NOT EXISTS daily_budget NUMERIC(14,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget_limit NUMERIC(14,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS impressions BIGINT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS conversions INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS roi_value NUMERIC(14,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_health_score INTEGER NOT NULL DEFAULT 75,
ADD COLUMN IF NOT EXISTS compliance_status TEXT NOT NULL DEFAULT 'passed' CHECK (compliance_status IN ('passed', 'warning', 'failed')),
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS launched_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::JSONB;

CREATE TABLE IF NOT EXISTS public.marketing_seo_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche TEXT NOT NULL,
  country_code TEXT NOT NULL,
  keyword TEXT NOT NULL,
  search_volume INTEGER NOT NULL DEFAULT 0,
  difficulty_score INTEGER NOT NULL DEFAULT 0,
  cpc NUMERIC(12,2) NOT NULL DEFAULT 0,
  competition_score NUMERIC(8,4) NOT NULL DEFAULT 0,
  trend_score INTEGER NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'ai_research',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (country_code, keyword)
);

CREATE TABLE IF NOT EXISTS public.marketing_seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_url TEXT,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('onpage', 'technical', 'content', 'policy')),
  score INTEGER NOT NULL DEFAULT 0,
  findings JSONB NOT NULL DEFAULT '[]'::JSONB,
  suggestions JSONB NOT NULL DEFAULT '[]'::JSONB,
  status TEXT NOT NULL DEFAULT 'completed',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_backlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  backlink_type TEXT NOT NULL DEFAULT 'guest_post',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'placed', 'failed', 'review')),
  authority_score INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES public.marketing_seo_keywords(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 100,
  change_delta INTEGER NOT NULL DEFAULT 0,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_ads_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta_ads', 'youtube_ads', 'display_ads', 'linkedin_ads', 'tiktok_ads')),
  account_id TEXT NOT NULL,
  account_name TEXT,
  access_token_encrypted TEXT NOT NULL,
  token_hint TEXT,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'expired', 'revoked', 'error')),
  daily_spend_limit NUMERIC(14,2) NOT NULL DEFAULT 0,
  monthly_spend_limit NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, account_id)
);

CREATE TABLE IF NOT EXISTS public.marketing_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter', 'tiktok', 'whatsapp')),
  title TEXT,
  content TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  creative_urls TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'cancelled')),
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('ad_copy', 'landing_text', 'email_template', 'sms_template', 'whatsapp_template', 'social_post')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'scheduled')),
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_lead_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  source_channel TEXT NOT NULL,
  source_platform TEXT,
  country_code TEXT,
  region TEXT,
  score_label TEXT NOT NULL DEFAULT 'warm' CHECK (score_label IN ('hot', 'warm', 'cold')),
  score_value INTEGER NOT NULL DEFAULT 50,
  intent_summary TEXT,
  assigned_to_user UUID,
  assigned_to_role TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.marketing_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_type TEXT NOT NULL CHECK (channel_type IN ('email', 'sms', 'whatsapp', 'social', 'ad')),
  template_name TEXT NOT NULL,
  subject_line TEXT,
  body TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]'::JSONB,
  compliance_status TEXT NOT NULL DEFAULT 'passed' CHECK (compliance_status IN ('passed', 'warning', 'failed')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.marketing_templates(id) ON DELETE SET NULL,
  channel_type TEXT NOT NULL CHECK (channel_type IN ('email', 'sms', 'whatsapp')),
  recipient TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'queued' CHECK (delivery_status IN ('queued', 'sent', 'delivered', 'failed', 'opened', 'clicked')),
  open_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  click_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  followers BIGINT NOT NULL DEFAULT 0,
  engagement_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  category TEXT,
  fake_follower_score INTEGER NOT NULL DEFAULT 0,
  influencer_score INTEGER NOT NULL DEFAULT 0,
  payout_status TEXT NOT NULL DEFAULT 'eligible' CHECK (payout_status IN ('eligible', 'hold', 'blocked')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_influencer_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.marketing_influencers(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  payout NUMERIC(14,2) NOT NULL DEFAULT 0,
  deliverables JSONB NOT NULL DEFAULT '[]'::JSONB,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  engagement NUMERIC(8,4) NOT NULL DEFAULT 0,
  suspicious BOOLEAN NOT NULL DEFAULT false,
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'hold', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (influencer_id, campaign_id)
);

CREATE TABLE IF NOT EXISTS public.marketing_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  actor_user_id UUID,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_compliance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  policy_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'warning', 'failed')),
  details TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('weekly', 'performance', 'roi', 'channel', 'compliance')),
  title TEXT NOT NULL,
  report_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  generated_by UUID,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_traffic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  source_channel TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('visit', 'click', 'lead', 'conversion', 'bounce', 'retarget')),
  sessions_count INTEGER NOT NULL DEFAULT 1,
  bounce_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  country_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.marketing_content_queue(id) ON DELETE CASCADE,
  approval_type TEXT NOT NULL CHECK (approval_type IN ('campaign', 'content', 'ai_change')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by UUID,
  decided_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL CHECK (run_type IN ('hourly_optimization', 'daily_rank_check', 'followup', 'retargeting', 'report_generation')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  summary JSONB NOT NULL DEFAULT '{}'::JSONB,
  triggered_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON public.marketing_campaigns(status, approval_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_seo_keywords_country ON public.marketing_seo_keywords(country_code, niche, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_ads_accounts_platform ON public.marketing_ads_accounts(platform, status);
CREATE INDEX IF NOT EXISTS idx_marketing_social_posts_status ON public.marketing_social_posts(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_marketing_content_queue_status ON public.marketing_content_queue(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_lead_attribution_campaign ON public.marketing_lead_attribution(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_ai_insights_status ON public.marketing_ai_insights(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_delivery_logs_status ON public.marketing_delivery_logs(channel_type, delivery_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_influencer_campaigns_campaign ON public.marketing_influencer_campaigns(campaign_id, payout_status);
CREATE INDEX IF NOT EXISTS idx_marketing_alerts_status ON public.marketing_alerts(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_activity_logs_campaign ON public.marketing_activity_logs(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_traffic_events_campaign ON public.marketing_traffic_events(campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_approvals_status ON public.marketing_approvals(status, created_at DESC);

ALTER TABLE public.marketing_manager_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_ads_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_content_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_lead_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_delivery_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_influencer_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_traffic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_automation_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketing_settings_access" ON public.marketing_manager_settings;
CREATE POLICY "marketing_settings_access" ON public.marketing_manager_settings
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

DROP POLICY IF EXISTS "marketing_campaigns_access" ON public.marketing_campaigns;
CREATE POLICY "marketing_campaigns_access" ON public.marketing_campaigns
FOR ALL USING (public.can_manage_marketing(auth.uid()) OR created_by = auth.uid())
WITH CHECK (public.can_manage_marketing(auth.uid()) OR created_by = auth.uid());

DROP POLICY IF EXISTS "marketing_generic_manage" ON public.marketing_seo_keywords;
CREATE POLICY "marketing_generic_manage" ON public.marketing_seo_keywords
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_seo_audits_manage" ON public.marketing_seo_audits
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_backlinks_manage" ON public.marketing_backlinks
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_rankings_manage" ON public.marketing_rankings
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_ads_accounts_manage" ON public.marketing_ads_accounts
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_social_posts_manage" ON public.marketing_social_posts
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_content_queue_manage" ON public.marketing_content_queue
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_lead_attribution_manage" ON public.marketing_lead_attribution
FOR ALL USING (public.can_manage_marketing(auth.uid()) OR assigned_to_user = auth.uid())
WITH CHECK (public.can_manage_marketing(auth.uid()) OR assigned_to_user = auth.uid());

CREATE POLICY "marketing_ai_insights_manage" ON public.marketing_ai_insights
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_templates_manage" ON public.marketing_templates
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_delivery_logs_manage" ON public.marketing_delivery_logs
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_influencers_manage" ON public.marketing_influencers
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_influencer_campaigns_manage" ON public.marketing_influencer_campaigns
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_alerts_manage" ON public.marketing_alerts
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_activity_logs_read" ON public.marketing_activity_logs
FOR SELECT USING (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_activity_logs_insert" ON public.marketing_activity_logs
FOR INSERT WITH CHECK (true);

CREATE POLICY "marketing_compliance_logs_manage" ON public.marketing_compliance_logs
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_reports_manage" ON public.marketing_reports
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_traffic_events_manage" ON public.marketing_traffic_events
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_approvals_manage" ON public.marketing_approvals
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

CREATE POLICY "marketing_automation_runs_manage" ON public.marketing_automation_runs
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

DROP TRIGGER IF EXISTS update_marketing_manager_settings_updated_at ON public.marketing_manager_settings;
CREATE TRIGGER update_marketing_manager_settings_updated_at BEFORE UPDATE ON public.marketing_manager_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_campaigns_updated_at ON public.marketing_campaigns;
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_seo_keywords_updated_at ON public.marketing_seo_keywords;
CREATE TRIGGER update_marketing_seo_keywords_updated_at BEFORE UPDATE ON public.marketing_seo_keywords FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_backlinks_updated_at ON public.marketing_backlinks;
CREATE TRIGGER update_marketing_backlinks_updated_at BEFORE UPDATE ON public.marketing_backlinks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_ads_accounts_updated_at ON public.marketing_ads_accounts;
CREATE TRIGGER update_marketing_ads_accounts_updated_at BEFORE UPDATE ON public.marketing_ads_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_social_posts_updated_at ON public.marketing_social_posts;
CREATE TRIGGER update_marketing_social_posts_updated_at BEFORE UPDATE ON public.marketing_social_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_content_queue_updated_at ON public.marketing_content_queue;
CREATE TRIGGER update_marketing_content_queue_updated_at BEFORE UPDATE ON public.marketing_content_queue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_lead_attribution_updated_at ON public.marketing_lead_attribution;
CREATE TRIGGER update_marketing_lead_attribution_updated_at BEFORE UPDATE ON public.marketing_lead_attribution FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_ai_insights_updated_at ON public.marketing_ai_insights;
CREATE TRIGGER update_marketing_ai_insights_updated_at BEFORE UPDATE ON public.marketing_ai_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_templates_updated_at ON public.marketing_templates;
CREATE TRIGGER update_marketing_templates_updated_at BEFORE UPDATE ON public.marketing_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_delivery_logs_updated_at ON public.marketing_delivery_logs;
CREATE TRIGGER update_marketing_delivery_logs_updated_at BEFORE UPDATE ON public.marketing_delivery_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_influencers_updated_at ON public.marketing_influencers;
CREATE TRIGGER update_marketing_influencers_updated_at BEFORE UPDATE ON public.marketing_influencers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_influencer_campaigns_updated_at ON public.marketing_influencer_campaigns;
CREATE TRIGGER update_marketing_influencer_campaigns_updated_at BEFORE UPDATE ON public.marketing_influencer_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_alerts_updated_at ON public.marketing_alerts;
CREATE TRIGGER update_marketing_alerts_updated_at BEFORE UPDATE ON public.marketing_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_marketing_approvals_updated_at ON public.marketing_approvals;
CREATE TRIGGER update_marketing_approvals_updated_at BEFORE UPDATE ON public.marketing_approvals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.marketing_manager_settings (
  settings_key,
  auto_campaign_engine,
  auto_social_publish,
  auto_followups,
  auto_budget_adjustment,
  hourly_optimization_enabled,
  manager_approval_required,
  budget_guard_enabled,
  default_budget,
  max_campaign_budget,
  low_ctr_threshold,
  high_cpc_threshold,
  low_conversion_threshold,
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
  25000,
  500000,
  0.015,
  150,
  0.01,
  jsonb_build_object('engine', 'god_level', 'automation', 'enabled')
)
ON CONFLICT (settings_key) DO NOTHING;

INSERT INTO public.marketing_influencers (name, platform, followers, engagement_rate, category, fake_follower_score, influencer_score, metadata)
VALUES
  ('Aarav Growth', 'instagram', 240000, 0.0540, 'saas', 12, 88, jsonb_build_object('region', 'IN', 'verified', true)),
  ('Nexa B2B', 'linkedin', 98000, 0.0670, 'enterprise', 8, 91, jsonb_build_object('region', 'IN', 'verified', true)),
  ('Clicks With Mira', 'youtube', 410000, 0.0390, 'marketing', 18, 79, jsonb_build_object('region', 'AE', 'verified', true))
ON CONFLICT DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_ai_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_content_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_activity_logs;