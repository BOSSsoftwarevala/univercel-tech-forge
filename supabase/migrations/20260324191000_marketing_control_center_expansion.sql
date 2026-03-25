ALTER TABLE public.marketing_influencers
ADD COLUMN IF NOT EXISTS niche TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS fraud_notes TEXT,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.routing_rules_country (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  team_name TEXT,
  assigned_role TEXT NOT NULL DEFAULT 'lead_manager',
  assigned_user_id UUID,
  priority_weight INTEGER NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_regional_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  region_type TEXT NOT NULL CHECK (region_type IN ('continent', 'country', 'city', 'language', 'festival')),
  region_value TEXT NOT NULL,
  language_code TEXT,
  budget_override NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_influencer_payout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.marketing_influencers(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES public.marketing_influencer_campaigns(id) ON DELETE SET NULL,
  payout_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  payout_currency TEXT NOT NULL DEFAULT 'INR',
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'held', 'paid', 'reversed')),
  fraud_adjustment_percent NUMERIC(6,2) NOT NULL DEFAULT 0,
  payout_reason TEXT,
  reference_note TEXT,
  processed_by UUID,
  processed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketing_privacy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  masked_fields TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  privacy_status TEXT NOT NULL DEFAULT 'masked' CHECK (privacy_status IN ('masked', 'restricted', 'exported', 'reviewed')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_routing_rules_country_active ON public.routing_rules_country(is_active, priority_weight DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_regional_campaigns_type ON public.marketing_regional_campaigns(region_type, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_influencer_payout_logs_status ON public.marketing_influencer_payout_logs(payout_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_privacy_logs_created_at ON public.marketing_privacy_logs(created_at DESC);

ALTER TABLE public.routing_rules_country ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_regional_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_influencer_payout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_privacy_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "routing_rules_country_manage" ON public.routing_rules_country;
CREATE POLICY "routing_rules_country_manage" ON public.routing_rules_country
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

DROP POLICY IF EXISTS "marketing_regional_campaigns_manage" ON public.marketing_regional_campaigns;
CREATE POLICY "marketing_regional_campaigns_manage" ON public.marketing_regional_campaigns
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

DROP POLICY IF EXISTS "marketing_influencer_payout_logs_manage" ON public.marketing_influencer_payout_logs;
CREATE POLICY "marketing_influencer_payout_logs_manage" ON public.marketing_influencer_payout_logs
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

DROP POLICY IF EXISTS "marketing_privacy_logs_manage" ON public.marketing_privacy_logs;
CREATE POLICY "marketing_privacy_logs_manage" ON public.marketing_privacy_logs
FOR ALL USING (public.can_manage_marketing(auth.uid()))
WITH CHECK (public.can_manage_marketing(auth.uid()));

DROP TRIGGER IF EXISTS update_routing_rules_country_updated_at ON public.routing_rules_country;
CREATE TRIGGER update_routing_rules_country_updated_at BEFORE UPDATE ON public.routing_rules_country FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketing_regional_campaigns_updated_at ON public.marketing_regional_campaigns;
CREATE TRIGGER update_marketing_regional_campaigns_updated_at BEFORE UPDATE ON public.marketing_regional_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketing_influencer_payout_logs_updated_at ON public.marketing_influencer_payout_logs;
CREATE TRIGGER update_marketing_influencer_payout_logs_updated_at BEFORE UPDATE ON public.marketing_influencer_payout_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.routing_rules_country (country_code, country_name, team_name, assigned_role, priority_weight, metadata)
VALUES
  ('IN', 'India', 'India Sales', 'lead_manager', 100, jsonb_build_object('channel', 'regional_team')),
  ('US', 'United States', 'US Sales', 'lead_manager', 95, jsonb_build_object('channel', 'regional_team')),
  ('AE', 'United Arab Emirates', 'Middle East Sales', 'lead_manager', 90, jsonb_build_object('channel', 'regional_team')),
  ('GB', 'United Kingdom', 'UK Sales', 'lead_manager', 85, jsonb_build_object('channel', 'regional_team'))
ON CONFLICT (country_code) DO UPDATE
SET country_name = EXCLUDED.country_name,
    team_name = EXCLUDED.team_name,
    assigned_role = EXCLUDED.assigned_role,
    priority_weight = EXCLUDED.priority_weight,
    metadata = EXCLUDED.metadata,
    is_active = true,
    updated_at = now();

ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_regional_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_influencer_payout_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_privacy_logs;