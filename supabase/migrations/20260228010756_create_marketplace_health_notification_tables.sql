-- Migration: Create missing tables for marketplace, product catalog, and system health
-- marketplace_orders, product_catalog, system_health, notification_settings

-- =====================================================================
-- 1. product_catalog table - Maps products to the marketplace catalog
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.product_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  product_name text NOT NULL,
  category text,
  description text,
  pricing_model text DEFAULT 'one_time',
  lifetime_price numeric(12, 2),
  monthly_price numeric(12, 2),
  tech_stack text,
  sync_status text NOT NULL DEFAULT 'active' CHECK (sync_status IN ('active', 'inactive', 'archived')),
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_catalog_product_id ON public.product_catalog(product_id);
CREATE INDEX IF NOT EXISTS idx_product_catalog_category ON public.product_catalog(category);
CREATE INDEX IF NOT EXISTS idx_product_catalog_sync_status ON public.product_catalog(sync_status);

ALTER TABLE public.product_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage product catalog" ON public.product_catalog;
DROP POLICY IF EXISTS "Authenticated users can view active catalog" ON public.product_catalog;

CREATE POLICY "Admins can manage product catalog"
  ON public.product_catalog
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('boss_owner', 'ceo', 'admin', 'product_manager')
    )
  );

CREATE POLICY "Authenticated users can view active catalog"
  ON public.product_catalog
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND sync_status = 'active'
  );

-- =====================================================================
-- 2. marketplace_orders table - Product purchase orders
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(product_id),
  buyer_id uuid REFERENCES auth.users(id),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_amount numeric(12, 2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled', 'refunded')),
  notes text,
  ordered_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_id ON public.marketplace_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_id ON public.marketplace_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON public.marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_ordered_at ON public.marketplace_orders(ordered_at DESC);

ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins and finance can manage all orders" ON public.marketplace_orders;
DROP POLICY IF EXISTS "Buyers can view their own orders" ON public.marketplace_orders;
DROP POLICY IF EXISTS "Authorized roles can create orders" ON public.marketplace_orders;

CREATE POLICY "Admins and finance can manage all orders"
  ON public.marketplace_orders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('boss_owner', 'ceo', 'admin', 'finance_manager')
    )
  );

CREATE POLICY "Buyers can view their own orders"
  ON public.marketplace_orders
  FOR SELECT
  USING (buyer_id = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Authorized roles can create orders"
  ON public.marketplace_orders
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('boss_owner', 'ceo', 'admin', 'franchise', 'reseller', 'finance_manager')
    )
  );

-- =====================================================================
-- 3. system_health table - Server/system health check history
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.system_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_type text NOT NULL DEFAULT 'servers'
    CHECK (check_type IN ('servers', 'full_system', 'module', 'api')),
  overall_status text NOT NULL DEFAULT 'healthy'
    CHECK (overall_status IN ('healthy', 'degraded', 'critical', 'outage')),
  total_servers integer DEFAULT 0,
  healthy_servers integer DEFAULT 0,
  degraded_servers integer DEFAULT 0,
  critical_servers integer DEFAULT 0,
  details jsonb DEFAULT '{}'::jsonb,
  checked_by uuid REFERENCES auth.users(id),
  checked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_system_health_checked_at ON public.system_health(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_overall_status ON public.system_health(overall_status);
CREATE INDEX IF NOT EXISTS idx_system_health_check_type ON public.system_health(check_type);

ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view system health" ON public.system_health;
DROP POLICY IF EXISTS "System can insert health records" ON public.system_health;

CREATE POLICY "Admins can view system health"
  ON public.system_health
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('boss_owner', 'ceo', 'admin', 'incident', 'performance_manager')
    )
  );

CREATE POLICY "System can insert health records"
  ON public.system_health
  FOR INSERT
  WITH CHECK (true);

-- =====================================================================
-- 4. notification_settings table - Per-user notification preferences
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled boolean NOT NULL DEFAULT true,
  sms_enabled boolean NOT NULL DEFAULT false,
  push_enabled boolean NOT NULL DEFAULT true,
  in_app_enabled boolean NOT NULL DEFAULT true,
  lead_alerts boolean NOT NULL DEFAULT true,
  task_alerts boolean NOT NULL DEFAULT true,
  payment_alerts boolean NOT NULL DEFAULT true,
  system_alerts boolean NOT NULL DEFAULT true,
  marketing_emails boolean NOT NULL DEFAULT false,
  digest_frequency text DEFAULT 'daily' CHECK (digest_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'never')),
  quiet_hours_start time,
  quiet_hours_end time,
  updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_notification_settings_user_id ON public.notification_settings(user_id);

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own notification settings" ON public.notification_settings;

CREATE POLICY "Users can manage their own notification settings"
  ON public.notification_settings
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =====================================================================
-- 5. aira_logs table - AIRA command execution log (if not exists)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.aira_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  role text,
  command text NOT NULL,
  module text NOT NULL,
  parameters jsonb DEFAULT '{}'::jsonb,
  context jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'executing', 'completed', 'error', 'unknown_command')),
  result jsonb DEFAULT '{}'::jsonb,
  error_message text,
  executed_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aira_logs_user_id ON public.aira_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_aira_logs_module ON public.aira_logs(module);
CREATE INDEX IF NOT EXISTS idx_aira_logs_status ON public.aira_logs(status);
CREATE INDEX IF NOT EXISTS idx_aira_logs_executed_at ON public.aira_logs(executed_at DESC);

ALTER TABLE public.aira_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all AIRA logs" ON public.aira_logs;
DROP POLICY IF EXISTS "System can insert AIRA logs" ON public.aira_logs;

CREATE POLICY "Admins can view all AIRA logs"
  ON public.aira_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('boss_owner', 'ceo', 'admin', 'ai_manager')
    )
  );

CREATE POLICY "System can insert AIRA logs"
  ON public.aira_logs
  FOR INSERT
  WITH CHECK (true);

-- =====================================================================
-- 6. commissions table - Commission records (if not exists)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payee_id uuid NOT NULL REFERENCES auth.users(id),
  amount numeric(12, 2) NOT NULL DEFAULT 0,
  commission_type text NOT NULL DEFAULT 'sale'
    CHECK (commission_type IN ('sale', 'referral', 'bonus', 'recurring')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  reference_id uuid,
  notes text,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  rejected_by uuid REFERENCES auth.users(id),
  rejected_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_commissions_payee_id ON public.commissions(payee_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_created_at ON public.commissions(created_at DESC);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Finance managers can manage commissions" ON public.commissions;
DROP POLICY IF EXISTS "Payees can view their own commissions" ON public.commissions;

CREATE POLICY "Finance managers can manage commissions"
  ON public.commissions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('boss_owner', 'ceo', 'admin', 'finance_manager')
    )
  );

CREATE POLICY "Payees can view their own commissions"
  ON public.commissions
  FOR SELECT
  USING (payee_id = auth.uid());
