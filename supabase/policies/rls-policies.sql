-- ============================================================
-- Software Vala – Row-Level Security (RLS) Policies
-- ============================================================
-- Apply to your Supabase project via the SQL Editor or as a
-- migration.  Run as the postgres/service-role user.
-- ============================================================

-- --------------------------------------------------------
-- Helper: current user id & role
-- --------------------------------------------------------
-- auth.uid() and auth.role() are built-in Supabase helpers.

-- --------------------------------------------------------
-- 1. user_roles  (critical – identity table)
-- --------------------------------------------------------

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users may only read their own role row.
CREATE POLICY "user_roles: self read"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Privileged roles may read any row.
CREATE POLICY "user_roles: privileged read"
  ON public.user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo')
    )
  );

-- Only service-role / backend may insert/update/delete.
CREATE POLICY "user_roles: service write"
  ON public.user_roles FOR ALL
  USING (auth.role() = 'service_role');

-- --------------------------------------------------------
-- 2. audit_logs  (append-only for users)
-- --------------------------------------------------------

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users may insert their own audit events.
CREATE POLICY "audit_logs: self insert"
  ON public.audit_logs FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Users may read only their own logs.
CREATE POLICY "audit_logs: self read"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Privileged roles may read all audit logs.
CREATE POLICY "audit_logs: privileged read"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo')
    )
  );

-- No UPDATE or DELETE allowed on audit logs (integrity).
-- Even service_role must not modify audit entries to preserve the audit trail.
-- Use time-based partitioning or archiving for data lifecycle management instead.

-- --------------------------------------------------------
-- 3. developers
-- --------------------------------------------------------

ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "developers: self read/write"
  ON public.developers FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "developers: privileged read"
  ON public.developers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'dev_manager')
    )
  );

-- --------------------------------------------------------
-- 4. franchise_accounts
-- --------------------------------------------------------

ALTER TABLE public.franchise_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "franchise_accounts: self read/write"
  ON public.franchise_accounts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "franchise_accounts: manager read"
  ON public.franchise_accounts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'franchise_manager')
    )
  );

-- --------------------------------------------------------
-- 5. reseller_accounts
-- --------------------------------------------------------

ALTER TABLE public.reseller_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reseller_accounts: self read/write"
  ON public.reseller_accounts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "reseller_accounts: manager read"
  ON public.reseller_accounts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'reseller_manager')
    )
  );

-- --------------------------------------------------------
-- 6. prime_user_profiles
-- --------------------------------------------------------

ALTER TABLE public.prime_user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prime_user_profiles: self read/write"
  ON public.prime_user_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "prime_user_profiles: admin read"
  ON public.prime_user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo')
    )
  );

-- --------------------------------------------------------
-- 7. influencer_accounts
-- --------------------------------------------------------

ALTER TABLE public.influencer_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "influencer_accounts: self read/write"
  ON public.influencer_accounts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "influencer_accounts: manager read"
  ON public.influencer_accounts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'influencer_manager')
    )
  );

-- --------------------------------------------------------
-- 8. leads
-- --------------------------------------------------------

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Assigned user can read their leads.
CREATE POLICY "leads: assigned read"
  ON public.leads FOR SELECT
  USING (auth.uid() = assigned_to OR auth.uid() = created_by);

CREATE POLICY "leads: assigned update"
  ON public.leads FOR UPDATE
  USING (auth.uid() = assigned_to);

-- Lead managers can manage all leads.
CREATE POLICY "leads: manager full"
  ON public.leads FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'lead_manager')
    )
  );

-- --------------------------------------------------------
-- 9. ip_locks  (sensitive security table)
-- --------------------------------------------------------

ALTER TABLE public.ip_locks ENABLE ROW LEVEL SECURITY;

-- Users may read their own lock.
CREATE POLICY "ip_locks: self read"
  ON public.ip_locks FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role may write ip_locks.
CREATE POLICY "ip_locks: service write"
  ON public.ip_locks FOR ALL
  USING (auth.role() = 'service_role');

-- --------------------------------------------------------
-- 10. otp_verifications
-- --------------------------------------------------------

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Users may only insert their own OTP requests.
CREATE POLICY "otp_verifications: self insert"
  ON public.otp_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Backend service handles verification queries.
CREATE POLICY "otp_verifications: service all"
  ON public.otp_verifications FOR ALL
  USING (auth.role() = 'service_role');

-- --------------------------------------------------------
-- END OF RLS POLICIES
-- --------------------------------------------------------
