CREATE TABLE IF NOT EXISTS public.influencer_referral_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  parent_influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  grandparent_influencer_id UUID REFERENCES public.influencer_accounts(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'archived')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (influencer_id),
  CHECK (influencer_id <> parent_influencer_id),
  CHECK (influencer_id <> COALESCE(grandparent_influencer_id, influencer_id))
);

CREATE TABLE IF NOT EXISTS public.influencer_referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  referred_influencer_id UUID REFERENCES public.influencer_accounts(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'lead', 'conversion', 'campaign_sale')),
  source_conversion_id UUID REFERENCES public.influencer_conversion_logs(id) ON DELETE SET NULL,
  sale_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  reward_base_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.influencer_platform_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  niche TEXT,
  currency TEXT NOT NULL DEFAULT 'INR',
  rate_per_real_reach NUMERIC(12,6) NOT NULL DEFAULT 0,
  rate_per_engagement NUMERIC(12,6) NOT NULL DEFAULT 0,
  cpc_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  cpl_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  cpa_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (platform, niche)
);

CREATE TABLE IF NOT EXISTS public.influencer_commission_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  source_influencer_id UUID REFERENCES public.influencer_accounts(id) ON DELETE SET NULL,
  source_conversion_id UUID REFERENCES public.influencer_conversion_logs(id) ON DELETE SET NULL,
  commission_kind TEXT NOT NULL CHECK (commission_kind IN ('campaign', 'referral_l1', 'referral_l2', 'bonus', 'adjustment')),
  level INTEGER NOT NULL DEFAULT 0 CHECK (level IN (0, 1, 2)),
  reference_key TEXT NOT NULL,
  base_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  commission_rate NUMERIC(12,4) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'credited' CHECK (status IN ('pending', 'credited', 'blocked')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (influencer_id, reference_key)
);

CREATE TABLE IF NOT EXISTS public.influencer_ai_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('content', 'contract', 'scan', 'suggestion')),
  title TEXT NOT NULL,
  prompt TEXT,
  output_text TEXT,
  output_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'reviewed', 'archived')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.influencer_ai_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL DEFAULT 'campaign',
  contract_title TEXT NOT NULL,
  party_name TEXT,
  payout_model TEXT NOT NULL DEFAULT 'hybrid',
  terms_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  ai_summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_influencer_referral_relationships_parent ON public.influencer_referral_relationships(parent_influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_referral_relationships_grandparent ON public.influencer_referral_relationships(grandparent_influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_referral_events_referrer_created ON public.influencer_referral_events(referrer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_platform_rates_platform_status ON public.influencer_platform_rates(platform, status);
CREATE INDEX IF NOT EXISTS idx_influencer_commission_journal_influencer_created ON public.influencer_commission_journal(influencer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_ai_assets_influencer_created ON public.influencer_ai_assets(influencer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_ai_contracts_influencer_created ON public.influencer_ai_contracts(influencer_id, created_at DESC);

INSERT INTO public.influencer_platform_rates (
  platform,
  niche,
  rate_per_real_reach,
  rate_per_engagement,
  cpc_rate,
  cpl_rate,
  cpa_rate,
  metadata
)
VALUES
  ('instagram', NULL, 0.020000, 0.350000, 0.60, 8.00, 120.00, '{"label":"Instagram default"}'::JSONB),
  ('youtube', NULL, 0.030000, 0.500000, 0.75, 10.00, 160.00, '{"label":"YouTube default"}'::JSONB),
  ('linkedin', NULL, 0.040000, 0.650000, 1.20, 18.00, 240.00, '{"label":"LinkedIn default"}'::JSONB),
  ('facebook', NULL, 0.018000, 0.280000, 0.55, 7.00, 110.00, '{"label":"Facebook default"}'::JSONB),
  ('generic', NULL, 0.015000, 0.250000, 0.50, 5.00, 100.00, '{"label":"Fallback default"}'::JSONB)
ON CONFLICT (platform, niche) DO NOTHING;

ALTER TABLE public.influencer_referral_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_referral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_platform_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_commission_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_ai_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_ai_contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage influencer referral relationships" ON public.influencer_referral_relationships;
CREATE POLICY "Admins manage influencer referral relationships"
ON public.influencer_referral_relationships
FOR ALL USING (public.can_manage_influencers(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own referral relationships" ON public.influencer_referral_relationships;
CREATE POLICY "Influencers view own referral relationships"
ON public.influencer_referral_relationships
FOR SELECT USING (
  influencer_id = public.get_influencer_id(auth.uid())
  OR parent_influencer_id = public.get_influencer_id(auth.uid())
  OR grandparent_influencer_id = public.get_influencer_id(auth.uid())
);

DROP POLICY IF EXISTS "Admins manage influencer referral events" ON public.influencer_referral_events;
CREATE POLICY "Admins manage influencer referral events"
ON public.influencer_referral_events
FOR ALL USING (public.can_manage_influencers(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own referral events" ON public.influencer_referral_events;
CREATE POLICY "Influencers view own referral events"
ON public.influencer_referral_events
FOR SELECT USING (
  referrer_id = public.get_influencer_id(auth.uid())
  OR referred_influencer_id = public.get_influencer_id(auth.uid())
);

DROP POLICY IF EXISTS "Authenticated users view platform rates" ON public.influencer_platform_rates;
CREATE POLICY "Authenticated users view platform rates"
ON public.influencer_platform_rates
FOR SELECT USING (
  auth.uid() IS NOT NULL
  AND (public.is_influencer(auth.uid()) OR public.can_manage_influencers(auth.uid()) OR public.can_access_finance(auth.uid()))
);

DROP POLICY IF EXISTS "Admins manage platform rates" ON public.influencer_platform_rates;
CREATE POLICY "Admins manage platform rates"
ON public.influencer_platform_rates
FOR ALL USING (public.can_manage_influencers(auth.uid()) OR public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Admins manage commission journal" ON public.influencer_commission_journal;
CREATE POLICY "Admins manage commission journal"
ON public.influencer_commission_journal
FOR ALL USING (public.can_manage_influencers(auth.uid()) OR public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own commission journal" ON public.influencer_commission_journal;
CREATE POLICY "Influencers view own commission journal"
ON public.influencer_commission_journal
FOR SELECT USING (influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage influencer ai assets" ON public.influencer_ai_assets;
CREATE POLICY "Admins manage influencer ai assets"
ON public.influencer_ai_assets
FOR ALL USING (public.can_manage_influencers(auth.uid()) OR influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage influencer ai contracts" ON public.influencer_ai_contracts;
CREATE POLICY "Admins manage influencer ai contracts"
ON public.influencer_ai_contracts
FOR ALL USING (public.can_manage_influencers(auth.uid()) OR influencer_id = public.get_influencer_id(auth.uid()));

DROP TRIGGER IF EXISTS update_influencer_platform_rates_updated_at ON public.influencer_platform_rates;
CREATE TRIGGER update_influencer_platform_rates_updated_at
BEFORE UPDATE ON public.influencer_platform_rates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_influencer_ai_contracts_updated_at ON public.influencer_ai_contracts;
CREATE TRIGGER update_influencer_ai_contracts_updated_at
BEFORE UPDATE ON public.influencer_ai_contracts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();