CREATE OR REPLACE FUNCTION public.can_access_finance(_user_id uuid)
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
    AND role IN ('boss_owner', 'super_admin', 'ceo', 'admin', 'finance_manager')
)
$$;

CREATE OR REPLACE FUNCTION public.finance_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.finance_block_delete()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Finance records are immutable and cannot be deleted';
END;
$$;

CREATE OR REPLACE FUNCTION public.finance_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Immutable finance log cannot be edited';
END;
$$;

CREATE TABLE IF NOT EXISTS public.finance_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('expense', 'payout', 'refund', 'tax', 'transaction')),
  entity_id UUID,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  current_level TEXT NOT NULL DEFAULT 'system_check' CHECK (current_level IN ('system_check', 'manager_approval', 'boss_approval', 'complete')),
  required_levels TEXT[] NOT NULL DEFAULT ARRAY['system_check', 'manager_approval']::TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'blocked')),
  requested_by UUID,
  manager_approved_by UUID,
  manager_approved_at TIMESTAMPTZ,
  boss_approved_by UUID,
  boss_approved_at TIMESTAMPTZ,
  system_checked_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_code TEXT NOT NULL UNIQUE DEFAULT ('FIN-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 12))),
  source_module TEXT NOT NULL CHECK (source_module IN ('marketplace', 'franchise', 'reseller', 'influencer', 'finance', 'tax', 'refund', 'payout', 'system')),
  source_type TEXT NOT NULL CHECK (source_type IN (
    'marketplace_sale',
    'franchise_revenue',
    'reseller_sale',
    'influencer_conversion',
    'expense',
    'commission_split',
    'payout',
    'refund',
    'tax',
    'adjustment',
    'reconciliation'
  )),
  direction TEXT NOT NULL CHECK (direction IN ('inflow', 'outflow')),
  entity_type TEXT,
  entity_id UUID,
  source_record_id TEXT,
  external_reference TEXT,
  gross_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (gross_amount >= 0),
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  net_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  invoice_id UUID REFERENCES public.invoices(invoice_id) ON DELETE SET NULL,
  approval_request_id UUID REFERENCES public.finance_approval_requests(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('pending', 'approved', 'posted', 'blocked', 'rejected', 'paid', 'refunded')),
  mismatch_flag BOOLEAN NOT NULL DEFAULT false,
  fraud_flag BOOLEAN NOT NULL DEFAULT false,
  immutable_locked BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  manager_approved_by UUID,
  boss_approved_by UUID,
  approved_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.finance_transactions(id) ON DELETE RESTRICT,
  debit_account TEXT NOT NULL,
  credit_account TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  source TEXT NOT NULL,
  ref_id TEXT,
  narration TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_commission_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.finance_transactions(id) ON DELETE CASCADE,
  source_module TEXT NOT NULL CHECK (source_module IN ('marketplace', 'franchise', 'reseller', 'influencer', 'finance')),
  source_record_id TEXT,
  currency TEXT NOT NULL DEFAULT 'INR',
  sale_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  platform_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  influencer_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  reseller_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  franchise_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_withheld NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'computed' CHECK (status IN ('computed', 'approved', 'posted', 'blocked')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('salary', 'marketing', 'infrastructure', 'operations', 'tax', 'refund', 'other')),
  subcategory TEXT,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  approval_request_id UUID REFERENCES public.finance_approval_requests(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'posted', 'blocked')),
  requested_by UUID,
  manager_approved_by UUID,
  boss_approved_by UUID,
  approved_at TIMESTAMPTZ,
  reason TEXT,
  transaction_id UUID REFERENCES public.finance_transactions(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_code TEXT NOT NULL UNIQUE DEFAULT ('PAY-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 10))),
  target_type TEXT NOT NULL CHECK (target_type IN ('influencer', 'reseller', 'franchise')),
  target_id UUID NOT NULL,
  target_user_id UUID,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  approval_request_id UUID REFERENCES public.finance_approval_requests(id) ON DELETE SET NULL,
  reference_transaction_id UUID REFERENCES public.finance_transactions(id) ON DELETE SET NULL,
  eligibility_status TEXT NOT NULL DEFAULT 'pending' CHECK (eligibility_status IN ('pending', 'verified', 'insufficient_balance', 'blocked')),
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'manager_approved', 'boss_approved', 'approved', 'rejected', 'blocked')),
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'paid', 'rejected', 'blocked')),
  otp_required BOOLEAN NOT NULL DEFAULT true,
  otp_verified BOOLEAN NOT NULL DEFAULT false,
  otp_verification_id UUID REFERENCES public.otp_verifications(id) ON DELETE SET NULL,
  device_fingerprint TEXT,
  payment_method TEXT DEFAULT 'bank_transfer',
  bank_details JSONB DEFAULT '{}'::JSONB,
  risk_score NUMERIC(8,2) NOT NULL DEFAULT 0,
  transaction_reference TEXT,
  rejection_reason TEXT,
  requested_by UUID,
  manager_approved_by UUID,
  boss_approved_by UUID,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_code TEXT NOT NULL UNIQUE DEFAULT ('REF-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 10))),
  transaction_id UUID NOT NULL REFERENCES public.finance_transactions(id) ON DELETE RESTRICT,
  refund_transaction_id UUID REFERENCES public.finance_transactions(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  approval_request_id UUID REFERENCES public.finance_approval_requests(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'approved', 'rejected', 'processed', 'blocked')),
  reason TEXT NOT NULL,
  requested_by UUID,
  verified_by UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_tax_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.finance_transactions(id) ON DELETE CASCADE,
  tax_type TEXT NOT NULL CHECK (tax_type IN ('gst', 'tds', 'regional', 'vat', 'other')),
  region_code TEXT,
  base_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(8,4) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  report_month DATE NOT NULL DEFAULT date_trunc('month', now())::DATE,
  invoice_id UUID REFERENCES public.invoices(invoice_id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('fraud_detected', 'payout_pending', 'high_expense', 'revenue_drop', 'mismatch', 'duplicate_transaction')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'blocked')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  transaction_id UUID REFERENCES public.finance_transactions(id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reconciliation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  bank_inflow NUMERIC(14,2) NOT NULL DEFAULT 0,
  bank_outflow NUMERIC(14,2) NOT NULL DEFAULT 0,
  system_inflow NUMERIC(14,2) NOT NULL DEFAULT 0,
  system_outflow NUMERIC(14,2) NOT NULL DEFAULT 0,
  mismatch_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'matched' CHECK (status IN ('matched', 'issue_detected', 'resolved')),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  actor_role TEXT,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  immutable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_finance_transactions_source ON public.finance_transactions(source_module, source_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_status ON public.finance_transactions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_entity ON public.finance_transactions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_record ON public.finance_transactions(source_record_id);
CREATE INDEX IF NOT EXISTS idx_finance_ledger_entries_tx ON public.finance_ledger_entries(transaction_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_expenses_status ON public.finance_expenses(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_payouts_status ON public.finance_payouts(approval_status, payout_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_refunds_status ON public.finance_refunds(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_tax_month ON public.finance_tax_records(report_month, tax_type);
CREATE INDEX IF NOT EXISTS idx_finance_alerts_status ON public.finance_alerts(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_finance_audit_created ON public.finance_audit_trail(created_at DESC);

ALTER TABLE public.finance_approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_commission_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_tax_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_audit_trail ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Finance controls approval requests" ON public.finance_approval_requests;
CREATE POLICY "Finance controls approval requests"
ON public.finance_approval_requests
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls transactions" ON public.finance_transactions;
CREATE POLICY "Finance controls transactions"
ON public.finance_transactions
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls ledger entries" ON public.finance_ledger_entries;
CREATE POLICY "Finance controls ledger entries"
ON public.finance_ledger_entries
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls commission splits" ON public.finance_commission_splits;
CREATE POLICY "Finance controls commission splits"
ON public.finance_commission_splits
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls expenses" ON public.finance_expenses;
CREATE POLICY "Finance controls expenses"
ON public.finance_expenses
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls payouts" ON public.finance_payouts;
CREATE POLICY "Finance controls payouts"
ON public.finance_payouts
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls refunds" ON public.finance_refunds;
CREATE POLICY "Finance controls refunds"
ON public.finance_refunds
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls tax records" ON public.finance_tax_records;
CREATE POLICY "Finance controls tax records"
ON public.finance_tax_records
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls alerts" ON public.finance_alerts;
CREATE POLICY "Finance controls alerts"
ON public.finance_alerts
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls reconciliations" ON public.finance_reconciliations;
CREATE POLICY "Finance controls reconciliations"
ON public.finance_reconciliations
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP POLICY IF EXISTS "Finance controls audit trail" ON public.finance_audit_trail;
CREATE POLICY "Finance controls audit trail"
ON public.finance_audit_trail
FOR ALL USING (public.can_access_finance(auth.uid()));

DROP TRIGGER IF EXISTS finance_approval_requests_touch_updated_at ON public.finance_approval_requests;
CREATE TRIGGER finance_approval_requests_touch_updated_at
BEFORE UPDATE ON public.finance_approval_requests
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_transactions_touch_updated_at ON public.finance_transactions;
CREATE TRIGGER finance_transactions_touch_updated_at
BEFORE UPDATE ON public.finance_transactions
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_commission_splits_touch_updated_at ON public.finance_commission_splits;
CREATE TRIGGER finance_commission_splits_touch_updated_at
BEFORE UPDATE ON public.finance_commission_splits
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_expenses_touch_updated_at ON public.finance_expenses;
CREATE TRIGGER finance_expenses_touch_updated_at
BEFORE UPDATE ON public.finance_expenses
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_payouts_touch_updated_at ON public.finance_payouts;
CREATE TRIGGER finance_payouts_touch_updated_at
BEFORE UPDATE ON public.finance_payouts
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_refunds_touch_updated_at ON public.finance_refunds;
CREATE TRIGGER finance_refunds_touch_updated_at
BEFORE UPDATE ON public.finance_refunds
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_tax_records_touch_updated_at ON public.finance_tax_records;
CREATE TRIGGER finance_tax_records_touch_updated_at
BEFORE UPDATE ON public.finance_tax_records
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_alerts_touch_updated_at ON public.finance_alerts;
CREATE TRIGGER finance_alerts_touch_updated_at
BEFORE UPDATE ON public.finance_alerts
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_reconciliations_touch_updated_at ON public.finance_reconciliations;
CREATE TRIGGER finance_reconciliations_touch_updated_at
BEFORE UPDATE ON public.finance_reconciliations
FOR EACH ROW EXECUTE FUNCTION public.finance_touch_updated_at();

DROP TRIGGER IF EXISTS finance_transactions_no_delete ON public.finance_transactions;
CREATE TRIGGER finance_transactions_no_delete
BEFORE DELETE ON public.finance_transactions
FOR EACH ROW EXECUTE FUNCTION public.finance_block_delete();

DROP TRIGGER IF EXISTS finance_ledger_entries_no_mutation ON public.finance_ledger_entries;
CREATE TRIGGER finance_ledger_entries_no_mutation
BEFORE UPDATE OR DELETE ON public.finance_ledger_entries
FOR EACH ROW EXECUTE FUNCTION public.finance_block_mutation();

DROP TRIGGER IF EXISTS finance_audit_trail_no_mutation ON public.finance_audit_trail;
CREATE TRIGGER finance_audit_trail_no_mutation
BEFORE UPDATE OR DELETE ON public.finance_audit_trail
FOR EACH ROW EXECUTE FUNCTION public.finance_block_mutation();

ALTER PUBLICATION supabase_realtime ADD TABLE public.finance_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.finance_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.finance_payouts;