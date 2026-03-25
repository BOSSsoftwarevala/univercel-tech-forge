CREATE OR REPLACE FUNCTION public.can_manage_pro_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
    AND role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'admin', 'client_success', 'support', 'finance_manager')
)
$$;

CREATE OR REPLACE FUNCTION public.pro_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.pro_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Pro audit records are immutable';
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_pro_license_key()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'PRO-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16));
END;
$$;

CREATE TABLE IF NOT EXISTS public.pro_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  prime_user_id UUID UNIQUE REFERENCES public.prime_user_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company TEXT,
  plan_type TEXT NOT NULL DEFAULT 'yearly' CHECK (plan_type IN ('trial', 'monthly', 'yearly', 'lifetime', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'grace', 'high_risk')),
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date TIMESTAMPTZ,
  auto_renewal BOOLEAN NOT NULL DEFAULT true,
  support_tier TEXT NOT NULL DEFAULT 'premium' CHECK (support_tier IN ('premium', 'priority', 'vip', 'enterprise')),
  monthly_revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  renewal_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  last_payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (last_payment_status IN ('paid', 'pending', 'failed', 'hold')),
  company_domain TEXT,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  license_key TEXT NOT NULL UNIQUE DEFAULT public.generate_pro_license_key(),
  domain TEXT,
  device_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'pending', 'bound')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  last_verified_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pro_licenses_one_active_domain
ON public.pro_licenses(domain)
WHERE domain IS NOT NULL AND status IN ('active', 'bound');

CREATE TABLE IF NOT EXISTS public.pro_product_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  license_id UUID NOT NULL REFERENCES public.pro_licenses(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'restricted')),
  version TEXT,
  enabled_modules JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_changes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  legacy_ticket_id UUID UNIQUE REFERENCES public.priority_ticket_logs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  issue TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'waiting_user', 'resolved', 'escalated', 'breached')),
  assigned_role TEXT,
  assigned_to UUID,
  response_due_at TIMESTAMPTZ,
  resolution_due_at TIMESTAMPTZ,
  first_response_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  auto_fixed BOOLEAN NOT NULL DEFAULT false,
  ai_summary TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES public.pro_support_tickets(id) ON DELETE SET NULL,
  issue TEXT NOT NULL,
  build_version TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'ai_fixing', 'dev_review', 'resolved')),
  ai_attempts INTEGER NOT NULL DEFAULT 0,
  linked_module TEXT,
  dev_manager_status TEXT NOT NULL DEFAULT 'queued' CHECK (dev_manager_status IN ('queued', 'reviewing', 'fixing', 'deployed')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_assist_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES public.pro_support_tickets(id) ON DELETE SET NULL,
  assist_type TEXT NOT NULL DEFAULT 'live_assist' CHECK (assist_type IN ('live_assist', 'remote_session', 'priority_queue')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'approved', 'active', 'paused', 'ended', 'escalated')),
  mode TEXT NOT NULL DEFAULT 'guided' CHECK (mode IN ('view_only', 'guided', 'full_control')),
  priority_queue_position INTEGER,
  remote_session_enabled BOOLEAN NOT NULL DEFAULT false,
  linked_assist_session_id UUID,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_usage_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  period_key TEXT NOT NULL,
  api_usage NUMERIC(10,2) NOT NULL DEFAULT 0,
  api_limit NUMERIC(10,2) NOT NULL DEFAULT 100,
  storage_usage_gb NUMERIC(10,2) NOT NULL DEFAULT 0,
  storage_limit_gb NUMERIC(10,2) NOT NULL DEFAULT 100,
  feature_usage JSONB NOT NULL DEFAULT '{}'::jsonb,
  warning_state TEXT NOT NULL DEFAULT 'normal' CHECK (warning_state IN ('normal', 'warning', 'blocked')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pro_user_id, period_key)
);

CREATE TABLE IF NOT EXISTS public.pro_communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('chat', 'call', 'email', 'ai', 'assist')),
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound', 'internal')),
  subject TEXT,
  summary TEXT NOT NULL,
  actor_user_id UUID,
  restricted_admin_only BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID REFERENCES public.pro_users(id) ON DELETE SET NULL,
  ticket_id UUID REFERENCES public.pro_support_tickets(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('sla_breach', 'payment_hold', 'high_priority_issue', 'renewal_risk', 'usage_block', 'low_rating', 'license_misuse')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'escalated', 'resolved')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  escalation_level TEXT NOT NULL DEFAULT 'L1' CHECK (escalation_level IN ('L1', 'L2', 'Boss')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_satisfaction_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  rating NUMERIC(4,2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  feedback TEXT,
  source TEXT NOT NULL DEFAULT 'support' CHECK (source IN ('support', 'renewal', 'product', 'ai_helpdesk')),
  churn_risk TEXT NOT NULL DEFAULT 'low' CHECK (churn_risk IN ('low', 'medium', 'high')),
  alert_triggered BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_compliance_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('usage_policy', 'license_misuse', 'payment_hold', 'agreement_missing')),
  status TEXT NOT NULL DEFAULT 'warning' CHECK (status IN ('warning', 'suspended', 'resolved')),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pro_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  actor_user_id UUID,
  actor_role TEXT,
  pro_user_id UUID REFERENCES public.pro_users(id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  immutable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pro_users_status_plan ON public.pro_users(status, plan_type, expiry_date);
CREATE INDEX IF NOT EXISTS idx_pro_support_tickets_status_priority ON public.pro_support_tickets(status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_bug_reports_status ON public.pro_bug_reports(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_assist_requests_status ON public.pro_assist_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_alerts_status ON public.pro_alerts(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_communication_logs_user ON public.pro_communication_logs(pro_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_satisfaction_reviews_user ON public.pro_satisfaction_reviews(pro_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pro_compliance_flags_user ON public.pro_compliance_flags(pro_user_id, created_at DESC);

ALTER TABLE public.pro_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_product_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_assist_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_usage_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_satisfaction_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_compliance_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pro_users_manage" ON public.pro_users
FOR ALL USING (public.can_manage_pro_manager(auth.uid()) OR user_id = auth.uid())
WITH CHECK (public.can_manage_pro_manager(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "pro_licenses_manage" ON public.pro_licenses
FOR ALL USING (
  public.can_manage_pro_manager(auth.uid())
  OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid())
)
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_product_mappings_manage" ON public.pro_product_mappings
FOR ALL USING (
  public.can_manage_pro_manager(auth.uid())
  OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid())
)
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_support_tickets_manage" ON public.pro_support_tickets
FOR ALL USING (
  public.can_manage_pro_manager(auth.uid())
  OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid())
)
WITH CHECK (public.can_manage_pro_manager(auth.uid()) OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid()));

CREATE POLICY "pro_bug_reports_manage" ON public.pro_bug_reports
FOR ALL USING (public.can_manage_pro_manager(auth.uid()))
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_assist_requests_manage" ON public.pro_assist_requests
FOR ALL USING (
  public.can_manage_pro_manager(auth.uid())
  OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid())
)
WITH CHECK (public.can_manage_pro_manager(auth.uid()) OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid()));

CREATE POLICY "pro_usage_snapshots_manage" ON public.pro_usage_snapshots
FOR ALL USING (
  public.can_manage_pro_manager(auth.uid())
  OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid())
)
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_communication_logs_manage" ON public.pro_communication_logs
FOR ALL USING (public.can_manage_pro_manager(auth.uid()))
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_alerts_manage" ON public.pro_alerts
FOR ALL USING (public.can_manage_pro_manager(auth.uid()))
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_satisfaction_reviews_manage" ON public.pro_satisfaction_reviews
FOR ALL USING (public.can_manage_pro_manager(auth.uid()))
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_compliance_flags_manage" ON public.pro_compliance_flags
FOR ALL USING (public.can_manage_pro_manager(auth.uid()))
WITH CHECK (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_audit_logs_view" ON public.pro_audit_logs
FOR SELECT USING (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_audit_logs_insert" ON public.pro_audit_logs
FOR INSERT WITH CHECK (public.can_manage_pro_manager(auth.uid()));

DROP TRIGGER IF EXISTS pro_users_touch_updated_at ON public.pro_users;
CREATE TRIGGER pro_users_touch_updated_at BEFORE UPDATE ON public.pro_users FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_licenses_touch_updated_at ON public.pro_licenses;
CREATE TRIGGER pro_licenses_touch_updated_at BEFORE UPDATE ON public.pro_licenses FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_product_mappings_touch_updated_at ON public.pro_product_mappings;
CREATE TRIGGER pro_product_mappings_touch_updated_at BEFORE UPDATE ON public.pro_product_mappings FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_support_tickets_touch_updated_at ON public.pro_support_tickets;
CREATE TRIGGER pro_support_tickets_touch_updated_at BEFORE UPDATE ON public.pro_support_tickets FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_bug_reports_touch_updated_at ON public.pro_bug_reports;
CREATE TRIGGER pro_bug_reports_touch_updated_at BEFORE UPDATE ON public.pro_bug_reports FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_assist_requests_touch_updated_at ON public.pro_assist_requests;
CREATE TRIGGER pro_assist_requests_touch_updated_at BEFORE UPDATE ON public.pro_assist_requests FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_usage_snapshots_touch_updated_at ON public.pro_usage_snapshots;
CREATE TRIGGER pro_usage_snapshots_touch_updated_at BEFORE UPDATE ON public.pro_usage_snapshots FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_alerts_touch_updated_at ON public.pro_alerts;
CREATE TRIGGER pro_alerts_touch_updated_at BEFORE UPDATE ON public.pro_alerts FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_compliance_flags_touch_updated_at ON public.pro_compliance_flags;
CREATE TRIGGER pro_compliance_flags_touch_updated_at BEFORE UPDATE ON public.pro_compliance_flags FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

DROP TRIGGER IF EXISTS pro_audit_logs_no_mutation ON public.pro_audit_logs;
CREATE TRIGGER pro_audit_logs_no_mutation BEFORE UPDATE OR DELETE ON public.pro_audit_logs FOR EACH ROW EXECUTE FUNCTION public.pro_block_mutation();

INSERT INTO public.pro_users (
  user_id,
  prime_user_id,
  name,
  company,
  plan_type,
  status,
  start_date,
  expiry_date,
  auto_renewal,
  support_tier,
  monthly_revenue,
  renewal_amount,
  last_payment_status,
  company_domain,
  risk_level,
  metadata
)
SELECT
  pup.user_id,
  pup.id,
  pup.full_name,
  COALESCE(pup.metadata->>'company', split_part(pup.email, '@', 2)),
  CASE pup.subscription_tier
    WHEN 'trial' THEN 'trial'
    WHEN 'monthly' THEN 'monthly'
    WHEN 'yearly' THEN 'yearly'
    WHEN 'lifetime' THEN 'lifetime'
    ELSE 'yearly'
  END,
  CASE pup.subscription_status
    WHEN 'cancelled' THEN 'suspended'
    WHEN 'trial' THEN 'active'
    ELSE pup.subscription_status
  END,
  COALESCE(pup.subscription_start_date, now()),
  pup.subscription_end_date,
  COALESCE(pup.auto_renewal, true),
  CASE
    WHEN pup.priority_level >= 4 THEN 'enterprise'
    WHEN pup.priority_level = 3 THEN 'vip'
    WHEN pup.priority_level = 2 THEN 'priority'
    ELSE 'premium'
  END,
  COALESCE((SELECT SUM(amount) FROM public.prime_wallet_usage pwu WHERE pwu.prime_user_id = pup.id AND pwu.status = 'completed'), 0),
  COALESCE((SELECT amount FROM public.prime_wallet_usage pwu WHERE pwu.prime_user_id = pup.id ORDER BY created_at DESC LIMIT 1), 0),
  COALESCE((SELECT CASE WHEN pwu.status = 'completed' THEN 'paid' ELSE pwu.status END FROM public.prime_wallet_usage pwu WHERE pwu.prime_user_id = pup.id ORDER BY created_at DESC LIMIT 1), 'pending'),
  phs.custom_domain,
  CASE WHEN pup.subscription_status IN ('expired', 'suspended') THEN 'high' ELSE 'low' END,
  jsonb_build_object('region', pup.region, 'vip_badge_enabled', pup.vip_badge_enabled)
FROM public.prime_user_profiles pup
LEFT JOIN public.prime_hosting_status phs ON phs.prime_user_id = pup.id
ON CONFLICT (user_id) DO UPDATE SET
  prime_user_id = EXCLUDED.prime_user_id,
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  plan_type = EXCLUDED.plan_type,
  status = EXCLUDED.status,
  expiry_date = EXCLUDED.expiry_date,
  auto_renewal = EXCLUDED.auto_renewal,
  support_tier = EXCLUDED.support_tier,
  monthly_revenue = EXCLUDED.monthly_revenue,
  renewal_amount = EXCLUDED.renewal_amount,
  last_payment_status = EXCLUDED.last_payment_status,
  company_domain = EXCLUDED.company_domain,
  risk_level = EXCLUDED.risk_level,
  metadata = public.pro_users.metadata || EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.pro_support_tickets (
  pro_user_id,
  legacy_ticket_id,
  title,
  issue,
  priority,
  status,
  assigned_to,
  response_due_at,
  resolution_due_at,
  resolved_at,
  metadata
)
SELECT
  pu.id,
  ptl.id,
  ptl.subject,
  COALESCE(ptl.description, ptl.subject),
  CASE
    WHEN ptl.priority_level >= 4 THEN 'critical'
    WHEN ptl.priority_level = 3 THEN 'high'
    WHEN ptl.priority_level = 2 THEN 'medium'
    ELSE 'low'
  END,
  CASE ptl.status
    WHEN 'open' THEN 'new'
    WHEN 'closed' THEN 'resolved'
    ELSE ptl.status
  END,
  ptl.assigned_developer_id,
  ptl.created_at + (COALESCE(ptl.sla_target_hours, 2) || ' hours')::interval,
  COALESCE(ptl.sla_deadline, ptl.created_at + interval '24 hours'),
  ptl.resolved_at,
  jsonb_build_object('ticket_type', ptl.ticket_type, 'resolution_notes', ptl.resolution_notes)
FROM public.priority_ticket_logs ptl
JOIN public.prime_user_profiles pup ON pup.id = ptl.prime_user_id
JOIN public.pro_users pu ON pu.user_id = pup.user_id
ON CONFLICT (legacy_ticket_id) DO NOTHING;

INSERT INTO public.pro_satisfaction_reviews (
  pro_user_id,
  rating,
  feedback,
  source,
  churn_risk,
  alert_triggered,
  metadata
)
SELECT
  pu.id,
  GREATEST(0, LEAST(5, COALESCE(cf.rating, 0))),
  cf.feedback_text,
  'support',
  CASE
    WHEN COALESCE(cf.rating, 5) <= 2 THEN 'high'
    WHEN COALESCE(cf.rating, 5) = 3 THEN 'medium'
    ELSE 'low'
  END,
  COALESCE(cf.rating, 5) <= 2,
  jsonb_build_object('feedback_type', cf.feedback_type)
FROM public.client_feedback cf
JOIN public.pro_users pu ON pu.user_id = cf.user_id
WHERE cf.rating IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.pro_usage_snapshots (
  pro_user_id,
  period_key,
  api_usage,
  api_limit,
  storage_usage_gb,
  storage_limit_gb,
  feature_usage,
  warning_state,
  metadata
)
SELECT
  pu.id,
  to_char(current_date, 'YYYY-MM'),
  COALESCE((pup.priority_level * 15)::numeric, 10),
  100,
  CASE phs.hosting_tier
    WHEN 'enterprise' THEN 80
    WHEN 'premium' THEN 45
    ELSE 20
  END,
  100,
  jsonb_build_object(
    'features', COALESCE((SELECT jsonb_agg(feature_name) FROM public.prime_feature_access pfa WHERE pfa.prime_user_id = pup.id AND pfa.is_active), '[]'::jsonb),
    'ai_calls', COALESCE(pup.priority_level * 10, 5)
  ),
  CASE
    WHEN COALESCE((pup.priority_level * 15)::numeric, 10) >= 90 THEN 'blocked'
    WHEN COALESCE((pup.priority_level * 15)::numeric, 10) >= 70 THEN 'warning'
    ELSE 'normal'
  END,
  jsonb_build_object('hosting_status', phs.status)
FROM public.pro_users pu
LEFT JOIN public.prime_user_profiles pup ON pup.user_id = pu.user_id
LEFT JOIN public.prime_hosting_status phs ON phs.prime_user_id = pup.id
ON CONFLICT (pro_user_id, period_key) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.pro_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pro_support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pro_alerts;
