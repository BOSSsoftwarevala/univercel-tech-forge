-- ============================================================
-- MARKETPLACE PAYMENT SYSTEM - Complete Schema
-- Phase 1: Database Schema & Security
-- ============================================================

-- ============================================================
-- 1. marketplace_applications table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.marketplace_applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  category      text NOT NULL,
  price_usd     numeric(12,2) NOT NULL CHECK (price_usd >= 0),
  margin_floor  numeric(5,2)  NOT NULL DEFAULT 20.00 CHECK (margin_floor >= 0 AND margin_floor <= 100),
  currency      text NOT NULL DEFAULT 'USD',
  is_active     boolean NOT NULL DEFAULT true,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by    uuid REFERENCES auth.users(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_applications_slug     ON public.marketplace_applications (slug);
CREATE INDEX IF NOT EXISTS idx_marketplace_applications_category ON public.marketplace_applications (category);
CREATE INDEX IF NOT EXISTS idx_marketplace_applications_active   ON public.marketplace_applications (is_active);

ALTER TABLE public.marketplace_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active applications"  ON public.marketplace_applications;
DROP POLICY IF EXISTS "Admin can manage applications"        ON public.marketplace_applications;

CREATE POLICY "Anyone can view active applications"
ON public.marketplace_applications FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin can manage applications"
ON public.marketplace_applications FOR ALL
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ============================================================
-- 2. orders table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  application_id    uuid NOT NULL REFERENCES public.marketplace_applications(id) ON DELETE RESTRICT,
  amount_usd        numeric(12,2) NOT NULL CHECK (amount_usd > 0),
  currency          text NOT NULL DEFAULT 'USD',
  status            text NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','processing','completed','failed','refunded','cancelled')),
  gateway           text NOT NULL
                       CHECK (gateway IN ('flutterwave','stripe','payu','paypal')),
  gateway_order_id  text,
  idempotency_key   text NOT NULL UNIQUE,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb,
  expires_at        timestamptz NOT NULL DEFAULT (now() + interval '1 hour'),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id        ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status         ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_gateway        ON public.orders (gateway);
CREATE INDEX IF NOT EXISTS idx_orders_created_at     ON public.orders (created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders"   ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can manage all orders" ON public.orders;

CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can manage all orders"
ON public.orders FOR ALL
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
);

-- ============================================================
-- 3. payments table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  gateway             text NOT NULL
                         CHECK (gateway IN ('flutterwave','stripe','payu','paypal')),
  gateway_payment_id  text NOT NULL,
  gateway_ref         text,
  amount              numeric(12,2) NOT NULL CHECK (amount > 0),
  currency            text NOT NULL DEFAULT 'USD',
  status              text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','success','failed','refunded')),
  webhook_verified    boolean NOT NULL DEFAULT false,
  webhook_payload     jsonb,
  verified_at         timestamptz,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gateway, gateway_payment_id)
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id     ON public.payments (order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id      ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status       ON public.payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway      ON public.payments (gateway);
CREATE INDEX IF NOT EXISTS idx_payments_verified     ON public.payments (webhook_verified);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments"   ON public.payments;
DROP POLICY IF EXISTS "Admin can manage all payments" ON public.payments;

CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all payments"
ON public.payments FOR ALL
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
);

-- ============================================================
-- 4. licenses table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.licenses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  payment_id      uuid NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  application_id  uuid NOT NULL REFERENCES public.marketplace_applications(id) ON DELETE RESTRICT,
  license_key     text NOT NULL UNIQUE,
  license_type    text NOT NULL DEFAULT 'standard'
                     CHECK (license_type IN ('standard','premium','enterprise','trial')),
  status          text NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active','revoked','expired','suspended')),
  max_activations integer NOT NULL DEFAULT 1,
  activations     integer NOT NULL DEFAULT 0,
  valid_from      timestamptz NOT NULL DEFAULT now(),
  valid_until     timestamptz,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  issued_at       timestamptz NOT NULL DEFAULT now(),
  revoked_at      timestamptz,
  revoked_by      uuid REFERENCES auth.users(id),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_licenses_user_id        ON public.licenses (user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_application_id ON public.licenses (application_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key    ON public.licenses (license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_status         ON public.licenses (status);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own licenses"   ON public.licenses;
DROP POLICY IF EXISTS "Admin can manage all licenses" ON public.licenses;

CREATE POLICY "Users can view own licenses"
ON public.licenses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all licenses"
ON public.licenses FOR ALL
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ============================================================
-- 5. demo_sessions table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.demo_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id),
  application_id  uuid NOT NULL REFERENCES public.marketplace_applications(id) ON DELETE CASCADE,
  session_token   text NOT NULL UNIQUE,
  visitor_email   text,
  visitor_name    text,
  ip_address      text,
  user_agent      text,
  status          text NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active','expired','revoked')),
  expires_at      timestamptz NOT NULL DEFAULT (now() + interval '30 minutes'),
  last_activity   timestamptz NOT NULL DEFAULT now(),
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_sessions_user_id        ON public.demo_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_application_id ON public.demo_sessions (application_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_token          ON public.demo_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_expires_at     ON public.demo_sessions (expires_at);

ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own demo sessions"   ON public.demo_sessions;
DROP POLICY IF EXISTS "Anyone can create demo sessions"    ON public.demo_sessions;
DROP POLICY IF EXISTS "Admin can manage all demo sessions" ON public.demo_sessions;

CREATE POLICY "Users can view own demo sessions"
ON public.demo_sessions FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create demo sessions"
ON public.demo_sessions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can manage all demo sessions"
ON public.demo_sessions FOR ALL
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'demo_manager'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'demo_manager'::public.app_role)
);

-- ============================================================
-- 6. payment_recovery_jobs table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_recovery_jobs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  status       text NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','processing','recovered','failed','abandoned')),
  attempts     integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 3,
  next_retry   timestamptz NOT NULL DEFAULT (now() + interval '1 hour'),
  last_error   text,
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_recovery_order_id  ON public.payment_recovery_jobs (order_id);
CREATE INDEX IF NOT EXISTS idx_payment_recovery_status    ON public.payment_recovery_jobs (status);
CREATE INDEX IF NOT EXISTS idx_payment_recovery_next_retry ON public.payment_recovery_jobs (next_retry) WHERE status IN ('pending','processing');

ALTER TABLE public.payment_recovery_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage payment recovery" ON public.payment_recovery_jobs;

CREATE POLICY "Admin can manage payment recovery"
ON public.payment_recovery_jobs FOR ALL
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
);

-- ============================================================
-- 7. Immutable payment_audit_logs table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users(id),
  order_id   uuid REFERENCES public.orders(id),
  payment_id uuid REFERENCES public.payments(id),
  event_type text NOT NULL,
  actor_id   uuid REFERENCES auth.users(id),
  actor_role text,
  ip_address text,
  payload    jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Immutability: no UPDATE or DELETE allowed via triggers
CREATE OR REPLACE FUNCTION public.prevent_audit_log_modification()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RAISE EXCEPTION 'payment_audit_logs are immutable';
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_update  ON public.payment_audit_logs;
DROP TRIGGER IF EXISTS trg_prevent_audit_log_delete  ON public.payment_audit_logs;

CREATE TRIGGER trg_prevent_audit_log_update
BEFORE UPDATE ON public.payment_audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_modification();

CREATE TRIGGER trg_prevent_audit_log_delete
BEFORE DELETE ON public.payment_audit_logs
FOR EACH ROW EXECUTE FUNCTION public.prevent_audit_log_modification();

CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_order_id   ON public.payment_audit_logs (order_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_payment_id ON public.payment_audit_logs (payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_user_id    ON public.payment_audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_payment_audit_logs_created_at ON public.payment_audit_logs (created_at DESC);

ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payment audit logs" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "Service can insert payment audit logs" ON public.payment_audit_logs;
DROP POLICY IF EXISTS "Admin can view all payment audit logs" ON public.payment_audit_logs;

CREATE POLICY "Users can view own payment audit logs"
ON public.payment_audit_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service can insert payment audit logs"
ON public.payment_audit_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can view all payment audit logs"
ON public.payment_audit_logs FOR SELECT
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
);

-- ============================================================
-- 8. Trigger: auto update updated_at on mutable tables
-- ============================================================
DROP TRIGGER IF EXISTS trg_marketplace_applications_updated_at ON public.marketplace_applications;
CREATE TRIGGER trg_marketplace_applications_updated_at
BEFORE UPDATE ON public.marketplace_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_payments_updated_at ON public.payments;
CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_licenses_updated_at ON public.licenses;
CREATE TRIGGER trg_licenses_updated_at
BEFORE UPDATE ON public.licenses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_payment_recovery_updated_at ON public.payment_recovery_jobs;
CREATE TRIGGER trg_payment_recovery_updated_at
BEFORE UPDATE ON public.payment_recovery_jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
