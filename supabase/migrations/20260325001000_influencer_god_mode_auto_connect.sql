ALTER TABLE public.influencer_accounts
ADD COLUMN IF NOT EXISTS influencer_code TEXT,
ADD COLUMN IF NOT EXISTS owner_id UUID,
ADD COLUMN IF NOT EXISTS platform TEXT,
ADD COLUMN IF NOT EXISTS social_handle TEXT,
ADD COLUMN IF NOT EXISTS followers_count BIGINT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS niche TEXT,
ADD COLUMN IF NOT EXISTS marketplace_connected BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS dashboard_ready BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS manager_panel_ready BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS joined_from_marketplace BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS fraud_blocked BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS tracking_link_active BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::JSONB;

UPDATE public.influencer_accounts
SET owner_id = COALESCE(owner_id, user_id),
    influencer_code = COALESCE(influencer_code, 'INF-' || upper(substring(replace(id::text, '-', '') from 1 for 8))),
    last_activity_at = COALESCE(last_activity_at, updated_at, created_at, now())
WHERE owner_id IS NULL OR influencer_code IS NULL OR last_activity_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_influencer_accounts_code_unique ON public.influencer_accounts(influencer_code);

CREATE TABLE IF NOT EXISTS public.marketplace_influencer_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  followers BIGINT NOT NULL DEFAULT 0,
  niche TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'pending', 'blocked', 'paused')),
  dashboard_route TEXT NOT NULL DEFAULT '/influencer-dashboard',
  manager_route TEXT NOT NULL DEFAULT '/influencer-manager',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id),
  UNIQUE (influencer_id)
);

CREATE TABLE IF NOT EXISTS public.influencer_sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_influencer_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'join_influencer',
    'marketplace_connect',
    'dashboard_ready',
    'manager_ready',
    'campaign_created',
    'tracking_link_created',
    'lead_created',
    'conversion_recorded',
    'fraud_detected',
    'payout_credited',
    'approval_synced',
    'message_sent'
  )),
  source_module TEXT NOT NULL,
  target_module TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'completed' CHECK (sync_status IN ('pending', 'completed', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_influencer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_influencer_links(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  assignment_status TEXT NOT NULL DEFAULT 'active' CHECK (assignment_status IN ('active', 'paused', 'blocked')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (influencer_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.marketplace_influencer_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_influencer_links(id) ON DELETE SET NULL,
  referral_link_id UUID REFERENCES public.influencer_referral_links(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  lead_name TEXT NOT NULL,
  platform TEXT,
  niche TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'converted', 'duplicate', 'blocked')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_influencer_revenue_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_influencer_links(id) ON DELETE SET NULL,
  marketplace_order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE SET NULL,
  conversion_id UUID REFERENCES public.influencer_conversion_logs(id) ON DELETE SET NULL,
  ledger_entry_id UUID REFERENCES public.influencer_wallet_ledger(id) ON DELETE SET NULL,
  sale_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  wallet_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'linked' CHECK (status IN ('linked', 'reconciled', 'blocked')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.influencer_fraud_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  click_id UUID REFERENCES public.influencer_click_logs(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  flag_type TEXT NOT NULL CHECK (flag_type IN ('fake_click', 'bot_traffic', 'duplicate_lead', 'tracking_bypass')),
  severity TEXT NOT NULL DEFAULT 'high' CHECK (severity IN ('medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'blocked', 'resolved')),
  score NUMERIC(8,2) NOT NULL DEFAULT 0,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.influencer_message_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('broadcast', 'campaign_update', 'fraud_alert', 'payout_update')),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_by UUID,
  delivery_status TEXT NOT NULL DEFAULT 'queued' CHECK (delivery_status IN ('queued', 'sent', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.influencer_campaign_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.influencer_campaign_map(id) ON DELETE SET NULL,
  marketing_campaign_id UUID REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_influencer_links_user ON public.marketplace_influencer_links(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_influencer_links_influencer ON public.marketplace_influencer_links(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_sync_events_influencer_created ON public.influencer_sync_events(influencer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_influencer_leads_influencer_created ON public.marketplace_influencer_leads(influencer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_influencer_revenue_influencer_created ON public.marketplace_influencer_revenue_links(influencer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_fraud_flags_influencer_status ON public.influencer_fraud_flags(influencer_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_message_queue_status ON public.influencer_message_queue(delivery_status, created_at DESC);

ALTER TABLE public.marketplace_influencer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_influencer_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_influencer_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_influencer_revenue_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_fraud_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_message_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_campaign_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage marketplace influencer links" ON public.marketplace_influencer_links;
CREATE POLICY "Admins manage marketplace influencer links"
ON public.marketplace_influencer_links
FOR ALL USING (public.can_manage_influencers(auth.uid()));

DROP POLICY IF EXISTS "Users view own marketplace influencer link" ON public.marketplace_influencer_links;
CREATE POLICY "Users view own marketplace influencer link"
ON public.marketplace_influencer_links
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage influencer sync events" ON public.influencer_sync_events;
CREATE POLICY "Admins manage influencer sync events"
ON public.influencer_sync_events
FOR ALL USING (public.can_manage_influencers(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own influencer sync events" ON public.influencer_sync_events;
CREATE POLICY "Influencers view own influencer sync events"
ON public.influencer_sync_events
FOR SELECT USING (influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage marketplace influencer products" ON public.marketplace_influencer_products;
CREATE POLICY "Admins manage marketplace influencer products"
ON public.marketplace_influencer_products
FOR ALL USING (public.can_manage_influencers(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own marketplace influencer products" ON public.marketplace_influencer_products;
CREATE POLICY "Influencers view own marketplace influencer products"
ON public.marketplace_influencer_products
FOR SELECT USING (influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage marketplace influencer leads" ON public.marketplace_influencer_leads;
CREATE POLICY "Admins manage marketplace influencer leads"
ON public.marketplace_influencer_leads
FOR ALL USING (public.can_manage_influencers(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own marketplace influencer leads" ON public.marketplace_influencer_leads;
CREATE POLICY "Influencers view own marketplace influencer leads"
ON public.marketplace_influencer_leads
FOR SELECT USING (influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage marketplace influencer revenue links" ON public.marketplace_influencer_revenue_links;
CREATE POLICY "Admins manage marketplace influencer revenue links"
ON public.marketplace_influencer_revenue_links
FOR ALL USING (public.can_manage_influencers(auth.uid()) OR public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own marketplace influencer revenue links" ON public.marketplace_influencer_revenue_links;
CREATE POLICY "Influencers view own marketplace influencer revenue links"
ON public.marketplace_influencer_revenue_links
FOR SELECT USING (influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage influencer fraud flags" ON public.influencer_fraud_flags;
CREATE POLICY "Admins manage influencer fraud flags"
ON public.influencer_fraud_flags
FOR ALL USING (public.can_manage_influencers(auth.uid()));

DROP POLICY IF EXISTS "Influencers view own fraud flags" ON public.influencer_fraud_flags;
CREATE POLICY "Influencers view own fraud flags"
ON public.influencer_fraud_flags
FOR SELECT USING (influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage influencer message queue" ON public.influencer_message_queue;
CREATE POLICY "Admins manage influencer message queue"
ON public.influencer_message_queue
FOR ALL USING (public.can_manage_influencers(auth.uid()) OR influencer_id = public.get_influencer_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage influencer campaign messages" ON public.influencer_campaign_messages;
CREATE POLICY "Admins manage influencer campaign messages"
ON public.influencer_campaign_messages
FOR ALL USING (public.can_manage_influencers(auth.uid()) OR influencer_id = public.get_influencer_id(auth.uid()));

DROP TRIGGER IF EXISTS update_marketplace_influencer_links_updated_at ON public.marketplace_influencer_links;
CREATE TRIGGER update_marketplace_influencer_links_updated_at
BEFORE UPDATE ON public.marketplace_influencer_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketplace_influencer_products_updated_at ON public.marketplace_influencer_products;
CREATE TRIGGER update_marketplace_influencer_products_updated_at
BEFORE UPDATE ON public.marketplace_influencer_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_influencer_fraud_flags_updated_at ON public.influencer_fraud_flags;
CREATE TRIGGER update_influencer_fraud_flags_updated_at
BEFORE UPDATE ON public.influencer_fraud_flags
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.influencer_sync_events;