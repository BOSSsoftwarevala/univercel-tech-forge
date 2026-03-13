
-- =====================================================
-- COMPREHENSIVE WALLET & PAYOUT RLS POLICIES
-- =====================================================

-- 1. WALLET TABLES - Enable RLS and create policies
-- =====================================================

-- unified_wallets
ALTER TABLE unified_wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "unified_wallets_owner_or_finance" ON unified_wallets;
CREATE POLICY "unified_wallets_owner_or_finance"
ON unified_wallets FOR SELECT
USING (
  user_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "unified_wallets_system_insert" ON unified_wallets;
CREATE POLICY "unified_wallets_system_insert"
ON unified_wallets FOR INSERT
WITH CHECK (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

DROP POLICY IF EXISTS "unified_wallets_finance_update" ON unified_wallets;
CREATE POLICY "unified_wallets_finance_update"
ON unified_wallets FOR UPDATE
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "wallets_owner_or_finance" ON wallets;
CREATE POLICY "wallets_owner_or_finance"
ON wallets FOR SELECT
USING (
  user_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "wallets_system_insert" ON wallets;
CREATE POLICY "wallets_system_insert"
ON wallets FOR INSERT
WITH CHECK (user_id = auth.uid() OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

DROP POLICY IF EXISTS "wallets_finance_update" ON wallets;
CREATE POLICY "wallets_finance_update"
ON wallets FOR UPDATE
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- reseller_wallet
ALTER TABLE reseller_wallet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reseller_wallet_owner_or_finance" ON reseller_wallet;
CREATE POLICY "reseller_wallet_owner_or_finance"
ON reseller_wallet FOR SELECT
USING (
  reseller_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "reseller_wallet_system_insert" ON reseller_wallet;
CREATE POLICY "reseller_wallet_system_insert"
ON reseller_wallet FOR INSERT
WITH CHECK (reseller_id = auth.uid() OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

DROP POLICY IF EXISTS "reseller_wallet_finance_update" ON reseller_wallet;
CREATE POLICY "reseller_wallet_finance_update"
ON reseller_wallet FOR UPDATE
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- developer_wallet
ALTER TABLE developer_wallet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "developer_wallet_owner_or_finance" ON developer_wallet;
CREATE POLICY "developer_wallet_owner_or_finance"
ON developer_wallet FOR SELECT
USING (
  developer_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "developer_wallet_system_insert" ON developer_wallet;
CREATE POLICY "developer_wallet_system_insert"
ON developer_wallet FOR INSERT
WITH CHECK (developer_id = auth.uid() OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

DROP POLICY IF EXISTS "developer_wallet_finance_update" ON developer_wallet;
CREATE POLICY "developer_wallet_finance_update"
ON developer_wallet FOR UPDATE
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- influencer_wallet
ALTER TABLE influencer_wallet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "influencer_wallet_owner_or_finance" ON influencer_wallet;
CREATE POLICY "influencer_wallet_owner_or_finance"
ON influencer_wallet FOR SELECT
USING (
  influencer_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "influencer_wallet_system_insert" ON influencer_wallet;
CREATE POLICY "influencer_wallet_system_insert"
ON influencer_wallet FOR INSERT
WITH CHECK (influencer_id = auth.uid() OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

DROP POLICY IF EXISTS "influencer_wallet_finance_update" ON influencer_wallet;
CREATE POLICY "influencer_wallet_finance_update"
ON influencer_wallet FOR UPDATE
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- franchise_wallet (check if exists, create policies)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'franchise_wallet') THEN
    ALTER TABLE franchise_wallet ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 2. WALLET TRANSACTION TABLES
-- =====================================================

-- reseller_wallet_transactions
ALTER TABLE reseller_wallet_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reseller_txn_owner_or_finance" ON reseller_wallet_transactions;
CREATE POLICY "reseller_txn_owner_or_finance"
ON reseller_wallet_transactions FOR SELECT
USING (
  reseller_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "reseller_txn_system_insert" ON reseller_wallet_transactions;
CREATE POLICY "reseller_txn_system_insert"
ON reseller_wallet_transactions FOR INSERT
WITH CHECK (true);

-- developer_wallet_transactions
ALTER TABLE developer_wallet_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "developer_txn_owner_or_finance" ON developer_wallet_transactions;
CREATE POLICY "developer_txn_owner_or_finance"
ON developer_wallet_transactions FOR SELECT
USING (
  developer_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "developer_txn_system_insert" ON developer_wallet_transactions;
CREATE POLICY "developer_txn_system_insert"
ON developer_wallet_transactions FOR INSERT
WITH CHECK (true);

-- influencer_wallet_ledger
ALTER TABLE influencer_wallet_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "influencer_ledger_owner_or_finance" ON influencer_wallet_ledger;
CREATE POLICY "influencer_ledger_owner_or_finance"
ON influencer_wallet_ledger FOR SELECT
USING (
  influencer_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "influencer_ledger_system_insert" ON influencer_wallet_ledger;
CREATE POLICY "influencer_ledger_system_insert"
ON influencer_wallet_ledger FOR INSERT
WITH CHECK (true);

-- franchise_wallet_ledger
ALTER TABLE franchise_wallet_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "franchise_ledger_owner_or_finance" ON franchise_wallet_ledger;
CREATE POLICY "franchise_ledger_owner_or_finance"
ON franchise_wallet_ledger FOR SELECT
USING (
  franchise_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "franchise_ledger_system_insert" ON franchise_wallet_ledger;
CREATE POLICY "franchise_ledger_system_insert"
ON franchise_wallet_ledger FOR INSERT
WITH CHECK (true);

-- unified_wallet_transactions
ALTER TABLE unified_wallet_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "unified_txn_owner_or_finance" ON unified_wallet_transactions;
CREATE POLICY "unified_txn_owner_or_finance"
ON unified_wallet_transactions FOR SELECT
USING (
  user_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "unified_txn_system_insert" ON unified_wallet_transactions;
CREATE POLICY "unified_txn_system_insert"
ON unified_wallet_transactions FOR INSERT
WITH CHECK (true);

-- 3. PAYOUT TABLES - Finance-only access
-- =====================================================

-- payout_requests
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payout_req_owner_or_finance" ON payout_requests;
CREATE POLICY "payout_req_owner_or_finance"
ON payout_requests FOR SELECT
USING (
  user_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "payout_req_user_insert" ON payout_requests;
CREATE POLICY "payout_req_user_insert"
ON payout_requests FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "payout_req_finance_update" ON payout_requests;
CREATE POLICY "payout_req_finance_update"
ON payout_requests FOR UPDATE
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- payout_records
ALTER TABLE payout_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "payout_rec_owner_or_finance" ON payout_records;
CREATE POLICY "payout_rec_owner_or_finance"
ON payout_records FOR SELECT
USING (
  developer_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "payout_rec_finance_insert" ON payout_records;
CREATE POLICY "payout_rec_finance_insert"
ON payout_records FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- reseller_payouts
ALTER TABLE reseller_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reseller_payout_owner_or_finance" ON reseller_payouts;
CREATE POLICY "reseller_payout_owner_or_finance"
ON reseller_payouts FOR SELECT
USING (
  reseller_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "reseller_payout_finance_manage" ON reseller_payouts;
CREATE POLICY "reseller_payout_finance_manage"
ON reseller_payouts FOR ALL
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- influencer_payout_requests
ALTER TABLE influencer_payout_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "influencer_payout_owner_or_finance" ON influencer_payout_requests;
CREATE POLICY "influencer_payout_owner_or_finance"
ON influencer_payout_requests FOR SELECT
USING (
  influencer_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "influencer_payout_user_insert" ON influencer_payout_requests;
CREATE POLICY "influencer_payout_user_insert"
ON influencer_payout_requests FOR INSERT
WITH CHECK (influencer_id = auth.uid());

DROP POLICY IF EXISTS "influencer_payout_finance_update" ON influencer_payout_requests;
CREATE POLICY "influencer_payout_finance_update"
ON influencer_payout_requests FOR UPDATE
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- franchise_payouts
ALTER TABLE franchise_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "franchise_payout_owner_or_finance" ON franchise_payouts;
CREATE POLICY "franchise_payout_owner_or_finance"
ON franchise_payouts FOR SELECT
USING (
  franchise_id = auth.uid()
  OR has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

DROP POLICY IF EXISTS "franchise_payout_finance_manage" ON franchise_payouts;
CREATE POLICY "franchise_payout_finance_manage"
ON franchise_payouts FOR ALL
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- 4. APPROVAL AUDIT LOG TABLE (for auto-approval logic)
-- =====================================================

CREATE TABLE IF NOT EXISTS approval_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_request_id UUID,
  action TEXT NOT NULL, -- 'auto_approved', 'held', 'manual_approved', 'rejected'
  reason TEXT,
  amount NUMERIC,
  daily_limit_exceeded BOOLEAN DEFAULT false,
  monthly_limit_exceeded BOOLEAN DEFAULT false,
  user_flagged BOOLEAN DEFAULT false,
  approved_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE approval_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approval_audit_finance_only"
ON approval_audit_logs FOR SELECT
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

CREATE POLICY "approval_audit_system_insert"
ON approval_audit_logs FOR INSERT
WITH CHECK (true);

-- 5. PAYOUT LIMITS CONFIGURATION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS payout_limits_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  daily_limit NUMERIC NOT NULL DEFAULT 5000,
  monthly_limit NUMERIC NOT NULL DEFAULT 50000,
  auto_approve_threshold NUMERIC NOT NULL DEFAULT 1000,
  requires_manual_review BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payout_limits_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payout_limits_finance_view"
ON payout_limits_config FOR SELECT
USING (
  has_role(auth.uid(), 'finance_manager')
  OR has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

CREATE POLICY "payout_limits_admin_manage"
ON payout_limits_config FOR ALL
USING (
  has_role(auth.uid(), 'super_admin')
  OR has_role(auth.uid(), 'master')
);

-- Insert default limits
INSERT INTO payout_limits_config (role, daily_limit, monthly_limit, auto_approve_threshold)
VALUES 
  ('developer', 5000, 50000, 1000),
  ('reseller', 10000, 100000, 2000),
  ('influencer', 5000, 50000, 1000),
  ('franchise', 25000, 250000, 5000)
ON CONFLICT DO NOTHING;
