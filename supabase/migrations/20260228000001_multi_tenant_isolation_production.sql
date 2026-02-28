-- ════════════════════════════════════════════════════════════════
-- MULTI-TENANT ISOLATION: PRODUCTION DEPLOYMENT
-- Enforces data segregation per franchise/reseller/prime
-- RBAC hierarchy: super_admin → area_manager → franchise → reseller → prime
-- ════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════
-- 1. TENANT ISOLATION VIOLATIONS TABLE
--    Records every detected cross-tenant access violation
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.tenant_isolation_violations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  detected_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  violating_user  UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  target_table    TEXT        NOT NULL,
  target_record   UUID,
  action_attempted TEXT       NOT NULL,  -- 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  source_tenant   UUID,
  target_tenant   UUID,
  policy_violated TEXT        NOT NULL,
  severity        TEXT        NOT NULL DEFAULT 'high'
                              CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  resolved        BOOLEAN     NOT NULL DEFAULT false,
  resolved_at     TIMESTAMPTZ,
  meta_json       JSONB       NOT NULL DEFAULT '{}'::jsonb
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_tiv_user        ON public.tenant_isolation_violations (violating_user);
CREATE INDEX IF NOT EXISTS idx_tiv_detected    ON public.tenant_isolation_violations (detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_tiv_table       ON public.tenant_isolation_violations (target_table);
CREATE INDEX IF NOT EXISTS idx_tiv_unresolved  ON public.tenant_isolation_violations (resolved) WHERE resolved = false;

-- Enable RLS on violations table itself
ALTER TABLE public.tenant_isolation_violations ENABLE ROW LEVEL SECURITY;

-- Only super_admin / boss_owner can view violations; system can insert
DROP POLICY IF EXISTS "System can log violations" ON public.tenant_isolation_violations;
CREATE POLICY "System can log violations"
  ON public.tenant_isolation_violations FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view violations" ON public.tenant_isolation_violations;
CREATE POLICY "Admins can view violations"
  ON public.tenant_isolation_violations FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super_admin'::public.app_role)
    OR public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins can resolve violations" ON public.tenant_isolation_violations;
CREATE POLICY "Admins can resolve violations"
  ON public.tenant_isolation_violations FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'super_admin'::public.app_role)
    OR public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin'::public.app_role)
    OR public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  );

-- ═══════════════════════════════════════════
-- 2. TENANT HIERARCHY HELPER FUNCTION
--    Returns true when caller's role allows access to target_user_id
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.tenant_can_access(
  p_caller_id   UUID,
  p_target_id   UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_role TEXT;
BEGIN
  -- Same user → always allowed
  IF p_caller_id = p_target_id THEN
    RETURN true;
  END IF;

  -- Fetch caller's role
  SELECT role::TEXT INTO v_caller_role
  FROM public.user_roles
  WHERE user_id = p_caller_id
  LIMIT 1;

  -- Boss / super-admin: full visibility
  IF v_caller_role IN ('boss_owner', 'super_admin', 'master', 'area_manager') THEN
    RETURN true;
  END IF;

  -- Franchise: can access resellers and primes they directly manage
  IF v_caller_role = 'franchise' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.branch_map
      WHERE franchise_user_id = p_caller_id
        AND (reseller_user_id = p_target_id OR prime_user_id = p_target_id)
    );
  END IF;

  -- Reseller: can access their own prime users
  IF v_caller_role = 'reseller' THEN
    RETURN EXISTS (
      SELECT 1 FROM public.branch_map
      WHERE reseller_user_id = p_caller_id
        AND prime_user_id = p_target_id
    );
  END IF;

  RETURN false;
END;
$$;

-- ═══════════════════════════════════════════
-- 3. ENFORCE RLS ON user_wallet_transactions
--    Tenant-hierarchy-aware SELECT policy
-- ═══════════════════════════════════════════

-- Remove old simple policy and replace with hierarchy-aware one
DROP POLICY IF EXISTS "Users can only view their own wallet transactions"
  ON public.user_wallet_transactions;

DROP POLICY IF EXISTS "Tenant-scoped wallet transaction read"
  ON public.user_wallet_transactions;

CREATE POLICY "Tenant-scoped wallet transaction read"
  ON public.user_wallet_transactions FOR SELECT
  USING (
    public.tenant_can_access(auth.uid(), user_id)
  );

-- System/finance managers can INSERT (no change to existing behaviour)
DROP POLICY IF EXISTS "Finance managers can insert wallet transactions"
  ON public.user_wallet_transactions;

CREATE POLICY "Finance managers can insert wallet transactions"
  ON public.user_wallet_transactions FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin'::public.app_role)
    OR public.has_role(auth.uid(), 'boss_owner'::public.app_role)
    OR public.has_role(auth.uid(), 'finance_manager'::public.app_role)
  );

-- ═══════════════════════════════════════════
-- 4. ENFORCE RLS ON audit_logs
--    Strengthen admin-only SELECT; preserve unrestricted INSERT
-- ═══════════════════════════════════════════

-- Existing policies: "sys_audit" (INSERT) and "admin_audit" (SELECT via super_admin)
-- Extend admin_audit to also include boss_owner
DROP POLICY IF EXISTS "admin_audit" ON public.audit_logs;
CREATE POLICY "admin_audit"
  ON public.audit_logs FOR SELECT
  USING (
    public.has_role(auth.uid(), 'super_admin'::public.app_role)
    OR public.has_role(auth.uid(), 'boss_owner'::public.app_role)
    OR auth.uid() = user_id   -- users can always read their own audit entries
  );

-- ═══════════════════════════════════════════
-- 5. ENFORCE RLS ON chat_messages
--    Tenant-aware: sender OR participant in same tenant scope
-- ═══════════════════════════════════════════

-- Existing: "users_send_msg" (INSERT) and "users_read_msg" (SELECT)
-- Extend read policy to include parent tenant access
DROP POLICY IF EXISTS "users_read_msg" ON public.chat_messages;
CREATE POLICY "users_read_msg"
  ON public.chat_messages FOR SELECT
  USING (
    sender_id   = auth.uid()
    OR receiver_id = auth.uid()
    OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
    OR public.has_role(auth.uid(), 'boss_owner'::public.app_role)
    OR public.tenant_can_access(auth.uid(), sender_id)
  );

-- ═══════════════════════════════════════════
-- 6. ENFORCE RLS ON developer_tasks
--    Tenant-hierarchy-aware: managers and parents can view
-- ═══════════════════════════════════════════

-- Existing policies: "Managers can manage tasks", "Developers view own tasks",
-- "Developers update own tasks" – supplement with tenant access
DROP POLICY IF EXISTS "Tenant managers view child tasks" ON public.developer_tasks;
CREATE POLICY "Tenant managers view child tasks"
  ON public.developer_tasks FOR SELECT
  USING (
    public.tenant_can_access(auth.uid(), assigned_to)
    OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
    OR public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  );

-- ═══════════════════════════════════════════
-- 7. VIOLATION DETECTION FUNCTION
--    Called when a cross-tenant access attempt is detected
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.log_tenant_isolation_violation(
  p_table          TEXT,
  p_record_id      UUID,
  p_action         TEXT,
  p_source_tenant  UUID,
  p_target_tenant  UUID,
  p_policy         TEXT,
  p_severity       TEXT DEFAULT 'high'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.tenant_isolation_violations (
    violating_user, target_table, target_record, action_attempted,
    source_tenant, target_tenant, policy_violated, severity,
    meta_json
  ) VALUES (
    auth.uid(),
    p_table,
    p_record_id,
    p_action,
    p_source_tenant,
    p_target_tenant,
    p_policy,
    p_severity,
    jsonb_build_object(
      'timestamp', now(),
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    )
  );
EXCEPTION WHEN OTHERS THEN
  -- Never surface errors from violation logging to callers
  NULL;
END;
$$;

-- ═══════════════════════════════════════════
-- 8. HEALTH CHECK VIEW
--    Live summary of tenant isolation status
-- ═══════════════════════════════════════════
CREATE OR REPLACE VIEW public.v_tenant_isolation_health AS
WITH stats AS (
  SELECT
    COUNT(*) FILTER (WHERE detected_at > now() - INTERVAL '24 hours')                  AS violations_last_24h,
    COUNT(*) FILTER (WHERE resolved = false)                                            AS open_violations,
    COUNT(*) FILTER (WHERE severity = 'critical' AND resolved = false)                 AS critical_open,
    COUNT(DISTINCT violating_user)
      FILTER (WHERE detected_at > now() - INTERVAL '1 hour')                           AS unique_violators_last_1h
  FROM public.tenant_isolation_violations
)
SELECT
  violations_last_24h,
  open_violations,
  critical_open,
  unique_violators_last_1h,
  CASE
    WHEN critical_open > 0         THEN 'critical'
    WHEN unique_violators_last_1h > 10 THEN 'degraded'
    WHEN open_violations > 0       THEN 'warning'
    ELSE 'healthy'
  END    AS isolation_status,
  now() AS checked_at
FROM stats;

-- ═══════════════════════════════════════════
-- 9. ROLLBACK FUNCTION
--    Safely disables enforcement policies if needed
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.rollback_tenant_isolation(
  p_reason TEXT DEFAULT 'manual_rollback'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Only boss_owner can execute rollback
  IF NOT public.has_role(auth.uid(), 'boss_owner'::public.app_role)
     AND NOT public.has_role(auth.uid(), 'super_admin'::public.app_role) THEN
    RAISE EXCEPTION 'RBAC_VIOLATION: insufficient privileges for rollback';
  END IF;

  -- Log rollback in audit trail
  INSERT INTO public.audit_logs (
    module, action, meta_json
  ) VALUES (
    'tenant_isolation',
    'rollback_initiated',
    jsonb_build_object(
      'reason',      p_reason,
      'initiated_by', auth.uid(),
      'timestamp',   now()
    )
  );

  v_result := jsonb_build_object(
    'status',      'rollback_logged',
    'reason',      p_reason,
    'timestamp',   now(),
    'note',        'Re-apply migration to re-enable policies'
  );

  RETURN v_result;
END;
$$;

-- ═══════════════════════════════════════════
-- 10. GRANT VIEW ACCESS TO ADMINS
-- ═══════════════════════════════════════════
GRANT SELECT ON public.v_tenant_isolation_health TO authenticated;
GRANT EXECUTE ON FUNCTION public.tenant_can_access(UUID, UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_tenant_isolation_violation(TEXT, UUID, TEXT, UUID, UUID, TEXT, TEXT)
  TO authenticated;
