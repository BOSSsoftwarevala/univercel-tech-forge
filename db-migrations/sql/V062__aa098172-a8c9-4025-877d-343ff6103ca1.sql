-- Enable RLS on all wallet and financial tables
ALTER TABLE reseller_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE unified_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_payouts ENABLE ROW LEVEL SECURITY;

-- RLS policies for wallets (owner access)
DROP POLICY IF EXISTS "wallet_owner_access" ON wallets;
CREATE POLICY "wallet_owner_access" ON wallets FOR SELECT
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager')));

DROP POLICY IF EXISTS "wallet_admin_manage" ON wallets;
CREATE POLICY "wallet_admin_manage" ON wallets FOR ALL
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master')));

-- RLS policies for transactions
DROP POLICY IF EXISTS "transactions_owner_view" ON transactions;
CREATE POLICY "transactions_owner_view" ON transactions FOR SELECT
USING (
  wallet_id IN (SELECT wallet_id FROM wallets WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager'))
);

DROP POLICY IF EXISTS "transactions_system_insert" ON transactions;
CREATE POLICY "transactions_system_insert" ON transactions FOR INSERT WITH CHECK (true);

-- RLS policies for unified_wallets
DROP POLICY IF EXISTS "unified_wallet_owner" ON unified_wallets;
CREATE POLICY "unified_wallet_owner" ON unified_wallets FOR SELECT
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager')));

-- RLS policies for unified_wallet_transactions (has user_id column)
DROP POLICY IF EXISTS "unified_txn_owner" ON unified_wallet_transactions;
CREATE POLICY "unified_txn_owner" ON unified_wallet_transactions FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager'))
);

-- RLS policies for influencer_wallet
DROP POLICY IF EXISTS "influencer_wallet_owner" ON influencer_wallet;
CREATE POLICY "influencer_wallet_owner" ON influencer_wallet FOR SELECT
USING (influencer_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager')));

-- RLS policies for influencer_wallet_ledger (uses influencer_id)
DROP POLICY IF EXISTS "influencer_ledger_owner" ON influencer_wallet_ledger;
CREATE POLICY "influencer_ledger_owner" ON influencer_wallet_ledger FOR SELECT
USING (
  influencer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager'))
);

-- RLS policies for franchise_wallet_ledger (uses franchise_id)
DROP POLICY IF EXISTS "franchise_ledger_owner" ON franchise_wallet_ledger;
CREATE POLICY "franchise_ledger_owner" ON franchise_wallet_ledger FOR SELECT
USING (
  franchise_id IN (SELECT id FROM franchise_accounts WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager'))
);

-- RLS policies for reseller_wallet_transactions
DROP POLICY IF EXISTS "reseller_txn_owner" ON reseller_wallet_transactions;
CREATE POLICY "reseller_txn_owner" ON reseller_wallet_transactions FOR SELECT
USING (
  reseller_id IN (SELECT id FROM reseller_accounts WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager'))
);

-- RLS policies for developer_wallet_transactions
DROP POLICY IF EXISTS "developer_txn_owner" ON developer_wallet_transactions;
CREATE POLICY "developer_txn_owner" ON developer_wallet_transactions FOR SELECT
USING (
  developer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager'))
);

-- RLS policies for payout_requests
DROP POLICY IF EXISTS "payout_req_owner" ON payout_requests;
CREATE POLICY "payout_req_owner" ON payout_requests FOR SELECT
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager')));

DROP POLICY IF EXISTS "payout_req_insert" ON payout_requests;
CREATE POLICY "payout_req_insert" ON payout_requests FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "payout_req_admin_update" ON payout_requests;
CREATE POLICY "payout_req_admin_update" ON payout_requests FOR UPDATE
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master')));

-- RLS policies for payout_records (uses developer_id, not user_id)
DROP POLICY IF EXISTS "payout_rec_owner" ON payout_records;
CREATE POLICY "payout_rec_owner" ON payout_records FOR SELECT
USING (developer_id = auth.uid() OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager')));

-- RLS policies for franchise_payouts
DROP POLICY IF EXISTS "franchise_payout_owner" ON franchise_payouts;
CREATE POLICY "franchise_payout_owner" ON franchise_payouts FOR SELECT
USING (
  franchise_id IN (SELECT id FROM franchise_accounts WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('super_admin', 'master', 'finance_manager'))
);