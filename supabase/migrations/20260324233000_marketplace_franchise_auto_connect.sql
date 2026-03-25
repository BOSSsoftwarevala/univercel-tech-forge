ALTER TABLE public.franchise_accounts
ADD COLUMN IF NOT EXISTS owner_id UUID,
ADD COLUMN IF NOT EXISTS marketplace_connected BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS dashboard_ready BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS manager_panel_ready BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS joined_from_marketplace BOOLEAN NOT NULL DEFAULT false;

UPDATE public.franchise_accounts
SET owner_id = COALESCE(owner_id, user_id)
WHERE owner_id IS NULL;

CREATE TABLE IF NOT EXISTS public.marketplace_franchise_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  selected_plan TEXT NOT NULL,
  city TEXT NOT NULL,
  business_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'paused', 'disconnected')),
  marketplace_connected BOOLEAN NOT NULL DEFAULT true,
  dashboard_route TEXT NOT NULL DEFAULT '/franchise-dashboard',
  manager_route TEXT NOT NULL DEFAULT '/franchise-manager',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id),
  UNIQUE (franchise_id)
);

CREATE TABLE IF NOT EXISTS public.franchise_sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_franchise_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'join_franchise',
    'marketplace_connect',
    'dashboard_ready',
    'manager_ready',
    'marketplace_lead_routed',
    'marketplace_revenue_linked',
    'approval_synced'
  )),
  source_module TEXT NOT NULL,
  target_module TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'completed' CHECK (sync_status IN ('pending', 'completed', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_franchise_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_franchise_links(id) ON DELETE SET NULL,
  franchise_lead_id UUID REFERENCES public.franchise_leads(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.franchise_stores(id) ON DELETE SET NULL,
  assigned_agent_user_id UUID,
  lead_name TEXT NOT NULL,
  city TEXT NOT NULL,
  business_type TEXT NOT NULL,
  selected_plan TEXT,
  source TEXT NOT NULL DEFAULT 'marketplace',
  status TEXT NOT NULL DEFAULT 'routed' CHECK (status IN ('new', 'routed', 'assigned', 'closed_won', 'closed_lost')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_franchise_revenue_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_franchise_links(id) ON DELETE SET NULL,
  marketplace_order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE SET NULL,
  franchise_commission_id UUID REFERENCES public.franchise_commissions(id) ON DELETE SET NULL,
  ledger_entry_id UUID REFERENCES public.franchise_wallet_ledger(id) ON DELETE SET NULL,
  sale_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  wallet_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'linked' CHECK (status IN ('linked', 'reconciled', 'blocked')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_franchise_links_user ON public.marketplace_franchise_links(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_franchise_links_franchise ON public.marketplace_franchise_links(franchise_id);
CREATE INDEX IF NOT EXISTS idx_franchise_sync_events_franchise_created ON public.franchise_sync_events(franchise_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_franchise_leads_franchise_created ON public.marketplace_franchise_leads(franchise_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_franchise_revenue_franchise_created ON public.marketplace_franchise_revenue_links(franchise_id, created_at DESC);

ALTER TABLE public.marketplace_franchise_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_franchise_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_franchise_revenue_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage marketplace franchise links" ON public.marketplace_franchise_links;
CREATE POLICY "Admins manage marketplace franchise links"
ON public.marketplace_franchise_links
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Users view own marketplace franchise link" ON public.marketplace_franchise_links;
CREATE POLICY "Users view own marketplace franchise link"
ON public.marketplace_franchise_links
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Franchises view own marketplace franchise link" ON public.marketplace_franchise_links;
CREATE POLICY "Franchises view own marketplace franchise link"
ON public.marketplace_franchise_links
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage franchise sync events" ON public.franchise_sync_events;
CREATE POLICY "Admins manage franchise sync events"
ON public.franchise_sync_events
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own sync events" ON public.franchise_sync_events;
CREATE POLICY "Franchises view own sync events"
ON public.franchise_sync_events
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage marketplace franchise leads" ON public.marketplace_franchise_leads;
CREATE POLICY "Admins manage marketplace franchise leads"
ON public.marketplace_franchise_leads
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own marketplace franchise leads" ON public.marketplace_franchise_leads;
CREATE POLICY "Franchises view own marketplace franchise leads"
ON public.marketplace_franchise_leads
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage marketplace franchise revenue links" ON public.marketplace_franchise_revenue_links;
CREATE POLICY "Admins manage marketplace franchise revenue links"
ON public.marketplace_franchise_revenue_links
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own marketplace franchise revenue links" ON public.marketplace_franchise_revenue_links;
CREATE POLICY "Franchises view own marketplace franchise revenue links"
ON public.marketplace_franchise_revenue_links
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP TRIGGER IF EXISTS update_marketplace_franchise_links_updated_at ON public.marketplace_franchise_links;
CREATE TRIGGER update_marketplace_franchise_links_updated_at
BEFORE UPDATE ON public.marketplace_franchise_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.franchise_sync_events;