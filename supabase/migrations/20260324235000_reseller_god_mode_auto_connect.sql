ALTER TABLE public.resellers
ADD COLUMN IF NOT EXISTS owner_id UUID,
ADD COLUMN IF NOT EXISTS marketplace_connected BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS dashboard_ready BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS manager_panel_ready BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS joined_from_marketplace BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS auto_suspend_reason TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::JSONB;

UPDATE public.resellers
SET owner_id = COALESCE(owner_id, user_id),
    last_activity_at = COALESCE(last_activity_at, updated_at, created_at, now())
WHERE owner_id IS NULL OR last_activity_at IS NULL;

ALTER TABLE public.territory_mapping
ADD COLUMN IF NOT EXISTS territory_key TEXT,
ADD COLUMN IF NOT EXISTS region_country TEXT,
ADD COLUMN IF NOT EXISTS region_state TEXT,
ADD COLUMN IF NOT EXISTS region_city TEXT,
ADD COLUMN IF NOT EXISTS assignment_status TEXT NOT NULL DEFAULT 'assigned' CHECK (assignment_status IN ('assigned', 'pending', 'released', 'blocked')),
ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::JSONB;

UPDATE public.territory_mapping
SET territory_key = COALESCE(
      territory_key,
      lower(concat_ws(':', territory_type, coalesce(territory_code, territory_name), coalesce(region_country, ''), coalesce(region_state, ''), coalesce(region_city, '')))
    ),
    region_country = COALESCE(region_country, CASE WHEN territory_type = 'country' THEN territory_name END, 'India'),
    region_state = COALESCE(region_state, CASE WHEN territory_type = 'state' THEN territory_name END),
    region_city = COALESCE(region_city, CASE WHEN territory_type = 'city' THEN territory_name END)
WHERE territory_key IS NULL OR region_country IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_territory_mapping_active_unique
ON public.territory_mapping(territory_key)
WHERE deleted_at IS NULL AND assignment_status = 'assigned';

CREATE TABLE IF NOT EXISTS public.marketplace_reseller_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  state TEXT,
  city TEXT,
  business_type TEXT NOT NULL,
  territory_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'pending', 'blocked', 'paused')),
  dashboard_route TEXT NOT NULL DEFAULT '/reseller-dashboard',
  manager_route TEXT NOT NULL DEFAULT '/reseller-manager',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id),
  UNIQUE (reseller_id)
);

CREATE TABLE IF NOT EXISTS public.reseller_sync_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_reseller_links(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'join_reseller',
    'marketplace_connect',
    'dashboard_ready',
    'manager_ready',
    'territory_assigned',
    'territory_conflict',
    'lead_routed',
    'revenue_linked',
    'approval_synced',
    'contract_ready'
  )),
  source_module TEXT NOT NULL,
  target_module TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'completed' CHECK (sync_status IN ('pending', 'completed', 'failed')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_reseller_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_reseller_links(id) ON DELETE SET NULL,
  reseller_lead_id UUID REFERENCES public.reseller_leads(id) ON DELETE SET NULL,
  lead_name TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  city TEXT,
  business_type TEXT NOT NULL,
  territory_key TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'marketplace',
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'admin_pool', 'closed_won', 'closed_lost')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_reseller_revenue_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.marketplace_reseller_links(id) ON DELETE SET NULL,
  marketplace_order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE SET NULL,
  reseller_order_id UUID REFERENCES public.reseller_orders(id) ON DELETE SET NULL,
  commission_id UUID REFERENCES public.reseller_commissions(id) ON DELETE SET NULL,
  ledger_entry_id UUID REFERENCES public.reseller_wallet_ledger(id) ON DELETE SET NULL,
  sale_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  wallet_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'linked' CHECK (status IN ('linked', 'reconciled', 'blocked')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_admin_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  lead_name TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  city TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'closed')),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_support_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'high' CHECK (priority IN ('medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'resolved', 'escalated')),
  assigned_to UUID,
  escalated_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('territory', 'contract', 'pricing', 'discount', 'payout')),
  request_title TEXT NOT NULL,
  request_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed')),
  requested_by UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  execution_blocked BOOLEAN NOT NULL DEFAULT true,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_pricing_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  price_floor NUMERIC(12,2) NOT NULL,
  custom_price NUMERIC(12,2),
  margin_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_limit_percent NUMERIC(5,2) NOT NULL DEFAULT 20,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (reseller_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_marketplace_reseller_links_user ON public.marketplace_reseller_links(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reseller_links_reseller ON public.marketplace_reseller_links(reseller_id);
CREATE INDEX IF NOT EXISTS idx_reseller_sync_events_reseller_created ON public.reseller_sync_events(reseller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_reseller_leads_reseller_created ON public.marketplace_reseller_leads(reseller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_reseller_revenue_reseller_created ON public.marketplace_reseller_revenue_links(reseller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reseller_admin_pool_status_created ON public.reseller_admin_pool(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reseller_support_cases_reseller_status ON public.reseller_support_cases(reseller_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reseller_approval_requests_reseller_status ON public.reseller_approval_requests(reseller_id, status, created_at DESC);

ALTER TABLE public.marketplace_reseller_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reseller_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reseller_revenue_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_admin_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_support_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_pricing_controls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage marketplace reseller links" ON public.marketplace_reseller_links;
CREATE POLICY "Admins manage marketplace reseller links"
ON public.marketplace_reseller_links
FOR ALL USING (public.can_manage_reseller_system(auth.uid()));

DROP POLICY IF EXISTS "Users view own marketplace reseller link" ON public.marketplace_reseller_links;
CREATE POLICY "Users view own marketplace reseller link"
ON public.marketplace_reseller_links
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage reseller sync events" ON public.reseller_sync_events;
CREATE POLICY "Admins manage reseller sync events"
ON public.reseller_sync_events
FOR ALL USING (public.can_manage_reseller_system(auth.uid()));

DROP POLICY IF EXISTS "Resellers view own reseller sync events" ON public.reseller_sync_events;
CREATE POLICY "Resellers view own reseller sync events"
ON public.reseller_sync_events
FOR SELECT USING (reseller_id = public.get_reseller_system_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage marketplace reseller leads" ON public.marketplace_reseller_leads;
CREATE POLICY "Admins manage marketplace reseller leads"
ON public.marketplace_reseller_leads
FOR ALL USING (public.can_manage_reseller_system(auth.uid()));

DROP POLICY IF EXISTS "Resellers view own marketplace reseller leads" ON public.marketplace_reseller_leads;
CREATE POLICY "Resellers view own marketplace reseller leads"
ON public.marketplace_reseller_leads
FOR SELECT USING (reseller_id = public.get_reseller_system_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage reseller revenue links" ON public.marketplace_reseller_revenue_links;
CREATE POLICY "Admins manage reseller revenue links"
ON public.marketplace_reseller_revenue_links
FOR ALL USING (public.can_manage_reseller_system(auth.uid()));

DROP POLICY IF EXISTS "Resellers view own reseller revenue links" ON public.marketplace_reseller_revenue_links;
CREATE POLICY "Resellers view own reseller revenue links"
ON public.marketplace_reseller_revenue_links
FOR SELECT USING (reseller_id = public.get_reseller_system_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage reseller admin pool" ON public.reseller_admin_pool;
CREATE POLICY "Admins manage reseller admin pool"
ON public.reseller_admin_pool
FOR ALL USING (public.can_manage_reseller_system(auth.uid()));

DROP POLICY IF EXISTS "Admins manage reseller support cases" ON public.reseller_support_cases;
CREATE POLICY "Admins manage reseller support cases"
ON public.reseller_support_cases
FOR ALL USING (public.can_manage_reseller_system(auth.uid()) OR reseller_id = public.get_reseller_system_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage reseller approval requests" ON public.reseller_approval_requests;
CREATE POLICY "Admins manage reseller approval requests"
ON public.reseller_approval_requests
FOR ALL USING (public.can_manage_reseller_system(auth.uid()) OR reseller_id = public.get_reseller_system_id(auth.uid()));

DROP POLICY IF EXISTS "Admins manage reseller pricing controls" ON public.reseller_pricing_controls;
CREATE POLICY "Admins manage reseller pricing controls"
ON public.reseller_pricing_controls
FOR ALL USING (public.can_manage_reseller_system(auth.uid()) OR reseller_id = public.get_reseller_system_id(auth.uid()));

DROP TRIGGER IF EXISTS update_marketplace_reseller_links_updated_at ON public.marketplace_reseller_links;
CREATE TRIGGER update_marketplace_reseller_links_updated_at
BEFORE UPDATE ON public.marketplace_reseller_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reseller_support_cases_updated_at ON public.reseller_support_cases;
CREATE TRIGGER update_reseller_support_cases_updated_at
BEFORE UPDATE ON public.reseller_support_cases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reseller_approval_requests_updated_at ON public.reseller_approval_requests;
CREATE TRIGGER update_reseller_approval_requests_updated_at
BEFORE UPDATE ON public.reseller_approval_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reseller_pricing_controls_updated_at ON public.reseller_pricing_controls;
CREATE TRIGGER update_reseller_pricing_controls_updated_at
BEFORE UPDATE ON public.reseller_pricing_controls
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_territory_mapping_updated_at ON public.territory_mapping;
CREATE TRIGGER update_territory_mapping_updated_at
BEFORE UPDATE ON public.territory_mapping
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.reseller_sync_events;