-- CEO AI Mission Control

ALTER TABLE IF EXISTS public.tasks
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS due_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS entity_type TEXT,
  ADD COLUMN IF NOT EXISTS entity_id UUID,
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

UPDATE public.tasks
SET assignee_id = COALESCE(assignee_id, assigned_to_dev),
    title = COALESCE(title, remarks, 'Task ' || LEFT(task_id::TEXT, 8)),
    description = COALESCE(description, remarks),
    source = COALESCE(source, 'manual')
WHERE assignee_id IS NULL
   OR title IS NULL
   OR description IS NULL;

ALTER TABLE IF EXISTS public.system_health
  ADD COLUMN IF NOT EXISTS service TEXT,
  ADD COLUMN IF NOT EXISTS latency NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS error_rate NUMERIC(8,4),
  ADD COLUMN IF NOT EXISTS uptime NUMERIC(8,4),
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE public.system_health
SET service = COALESCE(service, metric),
    latency = COALESCE(latency, CASE WHEN unit = 'ms' THEN value END),
    error_rate = COALESCE(error_rate, CASE WHEN metric ILIKE '%error%' THEN value END),
    uptime = COALESCE(uptime, CASE WHEN metric ILIKE '%uptime%' THEN value END),
    updated_at = COALESCE(updated_at, timestamp),
    created_at = COALESCE(created_at, timestamp)
WHERE service IS NULL
   OR latency IS NULL
   OR error_rate IS NULL
   OR uptime IS NULL;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'fulfilled', 'failed', 'cancelled', 'refunded')),
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  source TEXT NOT NULL DEFAULT 'ceo',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(product_id) ON DELETE SET NULL,
  price NUMERIC(14,2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'authorized', 'paid', 'failed', 'refunded')),
  txn_id TEXT,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wallet_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(wallet_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  balance_after NUMERIC(14,2) NOT NULL DEFAULT 0,
  ref_id UUID,
  ref_type TEXT,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reseller_id UUID REFERENCES public.resellers(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'credited', 'paid', 'rejected')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID REFERENCES public.resellers(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'processing', 'completed', 'rejected')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  stage TEXT NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'negotiation', 'won', 'lost')),
  value NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost', 'archived')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reseller_id UUID REFERENCES public.resellers(id) ON DELETE SET NULL,
  summary TEXT,
  closed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms', 'call', 'system')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'sent', 'failed', 'cancelled')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical', 'emergency')),
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'dismissed')),
  title TEXT NOT NULL,
  message TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_table TEXT,
  source_id UUID,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approval_required BOOLEAN NOT NULL DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  entity_type TEXT,
  entity_id UUID,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.actions_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'completed', 'failed', 'approval_required')),
  risk TEXT NOT NULL DEFAULT 'low' CHECK (risk IN ('low', 'medium', 'high', 'critical')),
  idempotency_key TEXT NOT NULL UNIQUE,
  actor UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intent TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  risk TEXT NOT NULL DEFAULT 'low' CHECK (risk IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approval_required', 'queued', 'completed', 'failed', 'cancelled')),
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  approval_required BOOLEAN NOT NULL DEFAULT false,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_log_id UUID REFERENCES public.actions_log(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.job_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'dead_letter')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_status ON public.orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_order_status ON public.payments(order_id, status);
CREATE INDEX IF NOT EXISTS idx_events_log_type_created_at ON public.events_log(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_wallet_created_at ON public.wallet_ledger(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status_severity ON public.alerts(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_actions_status_created_at ON public.ai_actions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_actions_log_status_created_at ON public.actions_log(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_status_stage ON public.deals(status, stage, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_followups_entity_status ON public.followups(entity_type, entity_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status ON public.tasks(assignee_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_job_queue_status_run_at ON public.job_queue(status, run_at);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ceo_orders_select" ON public.orders;
CREATE POLICY "ceo_orders_select" ON public.orders FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_orders_manage" ON public.orders;
CREATE POLICY "ceo_orders_manage" ON public.orders FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_order_items_select" ON public.order_items;
CREATE POLICY "ceo_order_items_select" ON public.order_items FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_order_items_manage" ON public.order_items;
CREATE POLICY "ceo_order_items_manage" ON public.order_items FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_payments_select" ON public.payments;
CREATE POLICY "ceo_payments_select" ON public.payments FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_payments_manage" ON public.payments;
CREATE POLICY "ceo_payments_manage" ON public.payments FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_wallet_ledger_select" ON public.wallet_ledger;
CREATE POLICY "ceo_wallet_ledger_select" ON public.wallet_ledger FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
  OR wallet_id IN (SELECT wallet_id FROM public.wallets WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "ceo_wallet_ledger_manage" ON public.wallet_ledger;
CREATE POLICY "ceo_wallet_ledger_manage" ON public.wallet_ledger FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_commissions_select" ON public.commissions;
CREATE POLICY "ceo_commissions_select" ON public.commissions FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_commissions_manage" ON public.commissions;
CREATE POLICY "ceo_commissions_manage" ON public.commissions FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_payouts_select" ON public.payouts;
CREATE POLICY "ceo_payouts_select" ON public.payouts FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_payouts_manage" ON public.payouts;
CREATE POLICY "ceo_payouts_manage" ON public.payouts FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_deals_select" ON public.deals;
CREATE POLICY "ceo_deals_select" ON public.deals FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
  OR owner_id = auth.uid()
);

DROP POLICY IF EXISTS "ceo_deals_manage" ON public.deals;
CREATE POLICY "ceo_deals_manage" ON public.deals FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_followups_select" ON public.followups;
CREATE POLICY "ceo_followups_select" ON public.followups FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
  OR assignee_id = auth.uid()
);

DROP POLICY IF EXISTS "ceo_followups_manage" ON public.followups;
CREATE POLICY "ceo_followups_manage" ON public.followups FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_alerts_select" ON public.alerts;
CREATE POLICY "ceo_alerts_select" ON public.alerts FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_alerts_manage" ON public.alerts;
CREATE POLICY "ceo_alerts_manage" ON public.alerts FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_events_select" ON public.events_log;
CREATE POLICY "ceo_events_select" ON public.events_log FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_events_insert" ON public.events_log;
CREATE POLICY "ceo_events_insert" ON public.events_log FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "ceo_actions_select" ON public.actions_log;
CREATE POLICY "ceo_actions_select" ON public.actions_log FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_actions_manage" ON public.actions_log;
CREATE POLICY "ceo_actions_manage" ON public.actions_log FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_ai_actions_select" ON public.ai_actions;
CREATE POLICY "ceo_ai_actions_select" ON public.ai_actions FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_ai_actions_manage" ON public.ai_actions;
CREATE POLICY "ceo_ai_actions_manage" ON public.ai_actions FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_ai_memory_select" ON public.ai_memory;
CREATE POLICY "ceo_ai_memory_select" ON public.ai_memory FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_ai_memory_manage" ON public.ai_memory;
CREATE POLICY "ceo_ai_memory_manage" ON public.ai_memory FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_job_queue_select" ON public.job_queue;
CREATE POLICY "ceo_job_queue_select" ON public.job_queue FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "ceo_job_queue_manage" ON public.job_queue;
CREATE POLICY "ceo_job_queue_manage" ON public.job_queue FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'ceo') OR has_role(auth.uid(), 'admin')
);

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_order_items_updated_at ON public.order_items;
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_commissions_updated_at ON public.commissions;
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payouts_updated_at ON public.payouts;
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON public.payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_deals_updated_at ON public.deals;
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_followups_updated_at ON public.followups;
CREATE TRIGGER update_followups_updated_at BEFORE UPDATE ON public.followups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_alerts_updated_at ON public.alerts;
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_actions_log_updated_at ON public.actions_log;
CREATE TRIGGER update_actions_log_updated_at BEFORE UPDATE ON public.actions_log FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_actions_updated_at ON public.ai_actions;
CREATE TRIGGER update_ai_actions_updated_at BEFORE UPDATE ON public.ai_actions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_memory_updated_at ON public.ai_memory;
CREATE TRIGGER update_ai_memory_updated_at BEFORE UPDATE ON public.ai_memory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_queue_updated_at ON public.job_queue;
CREATE TRIGGER update_job_queue_updated_at BEFORE UPDATE ON public.job_queue FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_health_updated_at ON public.system_health;
CREATE TRIGGER update_system_health_updated_at BEFORE UPDATE ON public.system_health FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.ceo_credit_wallet(
  p_actor_id UUID,
  p_wallet_id UUID,
  p_amount NUMERIC,
  p_ref_id UUID DEFAULT NULL,
  p_ref_type TEXT DEFAULT 'ceo_command'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet public.wallets%ROWTYPE;
  v_new_balance NUMERIC(14,2);
  v_entry_id UUID;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero';
  END IF;

  SELECT * INTO v_wallet
  FROM public.wallets
  WHERE wallet_id = p_wallet_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  v_new_balance := COALESCE(v_wallet.balance, 0) + p_amount;

  UPDATE public.wallets
  SET balance = v_new_balance,
      updated_at = now()
  WHERE wallet_id = p_wallet_id;

  INSERT INTO public.wallet_ledger (
    wallet_id,
    type,
    amount,
    balance_after,
    ref_id,
    ref_type,
    actor_id
  ) VALUES (
    p_wallet_id,
    'credit',
    p_amount,
    v_new_balance,
    p_ref_id,
    p_ref_type,
    p_actor_id
  )
  RETURNING id INTO v_entry_id;

  RETURN jsonb_build_object(
    'wallet_id', p_wallet_id,
    'ledger_entry_id', v_entry_id,
    'new_balance', v_new_balance,
    'amount', p_amount,
    'user_id', v_wallet.user_id
  );
END;
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_ledger;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.followups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.actions_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_actions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_queue;