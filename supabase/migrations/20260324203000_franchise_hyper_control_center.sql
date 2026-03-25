ALTER TABLE public.franchise_accounts
ADD COLUMN IF NOT EXISTS risk_level TEXT NOT NULL DEFAULT 'normal' CHECK (risk_level IN ('normal', 'watch', 'high', 'critical')),
ADD COLUMN IF NOT EXISTS freeze_reason TEXT,
ADD COLUMN IF NOT EXISTS wallet_locked BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_scale_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS last_auto_scale_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::JSONB;

CREATE TABLE IF NOT EXISTS public.franchise_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  store_code TEXT NOT NULL,
  store_name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'watch', 'frozen', 'dead')),
  capacity INTEGER NOT NULL DEFAULT 100,
  current_load INTEGER NOT NULL DEFAULT 0,
  performance_score NUMERIC(5,2) NOT NULL DEFAULT 75,
  live_users INTEGER NOT NULL DEFAULT 0,
  live_leads INTEGER NOT NULL DEFAULT 0,
  live_conversions INTEGER NOT NULL DEFAULT 0,
  revenue_per_second NUMERIC(12,2) NOT NULL DEFAULT 0,
  manager_user_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(franchise_id, store_code)
);

CREATE TABLE IF NOT EXISTS public.franchise_live_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  live_users INTEGER NOT NULL DEFAULT 0,
  live_leads INTEGER NOT NULL DEFAULT 0,
  live_conversions INTEGER NOT NULL DEFAULT 0,
  revenue_per_second NUMERIC(12,2) NOT NULL DEFAULT 0,
  active_stores INTEGER NOT NULL DEFAULT 0,
  queue_depth INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.franchise_store_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.franchise_stores(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('performance_recovery', 'ops_check', 'fraud_review', 'support_followup')),
  title TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.franchise_routing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  store_id UUID REFERENCES public.franchise_stores(id) ON DELETE SET NULL,
  agent_user_id UUID,
  city TEXT,
  state TEXT,
  country TEXT,
  ai_score INTEGER NOT NULL DEFAULT 50,
  queue_status TEXT NOT NULL DEFAULT 'queued' CHECK (queue_status IN ('queued', 'routed', 'no_agent', 'escalated')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.franchise_revenue_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.franchise_stores(id) ON DELETE SET NULL,
  payout_id UUID REFERENCES public.franchise_payouts(id) ON DELETE SET NULL,
  gateway_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  invoice_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  reported_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'matched' CHECK (status IN ('matched', 'mismatch', 'blocked')),
  mismatch_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.franchise_support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ops', 'payments', 'leads', 'security', 'legal', 'technical')),
  priority TEXT NOT NULL DEFAULT 'high' CHECK (priority IN ('high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated')),
  escalation_level INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.franchise_ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('best_store', 'best_agent', 'best_time_to_call', 'ad_budget_optimization', 'churn_prevention', 'action_plan')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed')),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.franchise_fraud_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.franchise_stores(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('fake_lead', 'fake_conversion', 'payout_manipulation', 'abnormal_spike')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'frozen', 'resolved')),
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_franchise_stores_franchise_status ON public.franchise_stores(franchise_id, status, performance_score DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_live_metrics_franchise_created ON public.franchise_live_metrics(franchise_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_store_tasks_franchise_status ON public.franchise_store_tasks(franchise_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_routing_queue_franchise_status ON public.franchise_routing_queue(franchise_id, queue_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_revenue_validations_franchise_status ON public.franchise_revenue_validations(franchise_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_support_tickets_franchise_status ON public.franchise_support_tickets(franchise_id, status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_ai_suggestions_franchise_status ON public.franchise_ai_suggestions(franchise_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_franchise_fraud_alerts_franchise_status ON public.franchise_fraud_alerts(franchise_id, status, severity, created_at DESC);

ALTER TABLE public.franchise_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_live_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_store_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_routing_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_revenue_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_fraud_alerts ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_manage_franchises(_user_id uuid)
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
    AND role IN ('boss_owner', 'ceo', 'admin', 'finance_manager', 'ai_manager', 'lead_manager')
)
$$;

DROP POLICY IF EXISTS "Admins can manage stores" ON public.franchise_stores;
CREATE POLICY "Admins can manage stores" ON public.franchise_stores
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own stores" ON public.franchise_stores;
CREATE POLICY "Franchises view own stores" ON public.franchise_stores
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage live metrics" ON public.franchise_live_metrics;
CREATE POLICY "Admins can manage live metrics" ON public.franchise_live_metrics
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own live metrics" ON public.franchise_live_metrics;
CREATE POLICY "Franchises view own live metrics" ON public.franchise_live_metrics
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage store tasks" ON public.franchise_store_tasks;
CREATE POLICY "Admins can manage store tasks" ON public.franchise_store_tasks
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own store tasks" ON public.franchise_store_tasks;
CREATE POLICY "Franchises view own store tasks" ON public.franchise_store_tasks
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage routing queue" ON public.franchise_routing_queue;
CREATE POLICY "Admins can manage routing queue" ON public.franchise_routing_queue
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own routing queue" ON public.franchise_routing_queue;
CREATE POLICY "Franchises view own routing queue" ON public.franchise_routing_queue
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage revenue validations" ON public.franchise_revenue_validations;
CREATE POLICY "Admins can manage revenue validations" ON public.franchise_revenue_validations
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own revenue validations" ON public.franchise_revenue_validations;
CREATE POLICY "Franchises view own revenue validations" ON public.franchise_revenue_validations
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage support tickets" ON public.franchise_support_tickets;
CREATE POLICY "Admins can manage support tickets" ON public.franchise_support_tickets
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises manage own support tickets" ON public.franchise_support_tickets;
CREATE POLICY "Franchises manage own support tickets" ON public.franchise_support_tickets
FOR ALL USING (franchise_id = public.get_franchise_id(auth.uid()))
WITH CHECK (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage ai suggestions" ON public.franchise_ai_suggestions;
CREATE POLICY "Admins can manage ai suggestions" ON public.franchise_ai_suggestions
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own ai suggestions" ON public.franchise_ai_suggestions;
CREATE POLICY "Franchises view own ai suggestions" ON public.franchise_ai_suggestions
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage fraud alerts" ON public.franchise_fraud_alerts;
CREATE POLICY "Admins can manage fraud alerts" ON public.franchise_fraud_alerts
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own fraud alerts" ON public.franchise_fraud_alerts;
CREATE POLICY "Franchises view own fraud alerts" ON public.franchise_fraud_alerts
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP TRIGGER IF EXISTS update_franchise_stores_updated_at ON public.franchise_stores;
CREATE TRIGGER update_franchise_stores_updated_at BEFORE UPDATE ON public.franchise_stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_franchise_store_tasks_updated_at ON public.franchise_store_tasks;
CREATE TRIGGER update_franchise_store_tasks_updated_at BEFORE UPDATE ON public.franchise_store_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_franchise_support_tickets_updated_at ON public.franchise_support_tickets;
CREATE TRIGGER update_franchise_support_tickets_updated_at BEFORE UPDATE ON public.franchise_support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_franchise_fraud_alerts_updated_at ON public.franchise_fraud_alerts;
CREATE TRIGGER update_franchise_fraud_alerts_updated_at BEFORE UPDATE ON public.franchise_fraud_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.franchise_stores (franchise_id, store_code, store_name, city, state, status, capacity, current_load, performance_score, live_users, live_leads, live_conversions, revenue_per_second, metadata)
SELECT fa.id, seed.store_code, seed.store_name, seed.city, seed.state, seed.status, seed.capacity, seed.current_load, seed.performance_score, seed.live_users, seed.live_leads, seed.live_conversions, seed.revenue_per_second, seed.metadata
FROM public.franchise_accounts fa
CROSS JOIN (
  VALUES
    ('STR-MUM-01', 'Mumbai Central', 'Mumbai', 'Maharashtra', 'active', 400, 215, 91.5, 842, 53, 12, 148.75, '{"tier":"flagship"}'::jsonb),
    ('STR-PUN-01', 'Pune Growth Hub', 'Pune', 'Maharashtra', 'watch', 280, 244, 58.2, 403, 31, 6, 62.10, '{"tier":"growth"}'::jsonb),
    ('STR-NAG-01', 'Nagpur Satellite', 'Nagpur', 'Maharashtra', 'dead', 150, 8, 24.4, 18, 1, 0, 0.50, '{"tier":"satellite"}'::jsonb)
) AS seed(store_code, store_name, city, state, status, capacity, current_load, performance_score, live_users, live_leads, live_conversions, revenue_per_second, metadata)
ON CONFLICT (franchise_id, store_code) DO NOTHING;