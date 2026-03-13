-- =============================================================================
-- Master Control Layer – Enterprise Kill-Switch System
-- Provides owner-only kill-switches, write-protection, anomaly locking,
-- AI approval thresholds, command sandboxing, and an immutable audit trail.
-- =============================================================================

-- ─── Helper: check super_admin / boss_owner ──────────────────────────────────
-- Reuses the existing has_role() function if present; falls back to JWT check.
CREATE OR REPLACE FUNCTION public.mcl_is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try has_role() first (defined in earlier migrations).
  IF EXISTS (
    SELECT 1
    FROM   information_schema.routines
    WHERE  routine_schema = 'public'
    AND    routine_name   = 'has_role'
  ) THEN
    RETURN (
      public.has_role(auth.uid(), 'boss_owner'::public.app_role)
      OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
    );
  END IF;

  -- Fallback: inspect JWT user_metadata.role
  RETURN coalesce(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    ''
  ) IN ('boss_owner', 'super_admin');
END;
$$;

-- =============================================================================
-- 1. master_control_switches
--    Central kill-switch registry (global / regional / franchise).
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.master_control_switches (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  switch_key      text        NOT NULL UNIQUE,          -- e.g. 'global', 'region:IN', 'franchise:42'
  scope           text        NOT NULL DEFAULT 'global' CHECK (scope IN ('global','regional','franchise')),
  is_active       boolean     NOT NULL DEFAULT true,    -- false = kill-switch engaged
  reason          text,
  activated_by    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  activated_at    timestamptz NOT NULL DEFAULT now(),
  deactivated_by  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  deactivated_at  timestamptz,
  metadata        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mcs_scope_active
  ON public.master_control_switches (scope, is_active);

ALTER TABLE public.master_control_switches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin can manage kill switches" ON public.master_control_switches;
CREATE POLICY "super_admin can manage kill switches"
  ON public.master_control_switches
  FOR ALL
  USING  (public.mcl_is_super_admin())
  WITH CHECK (public.mcl_is_super_admin());

DROP POLICY IF EXISTS "authenticated read kill switch status" ON public.master_control_switches;
CREATE POLICY "authenticated read kill switch status"
  ON public.master_control_switches
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================================================
-- 2. production_write_protections
--    Tables / paths that require whitelist approval before writes.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.production_write_protections (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_key  text    NOT NULL UNIQUE,   -- table name or API path pattern
  is_protected  boolean NOT NULL DEFAULT true,
  whitelist     jsonb   NOT NULL DEFAULT '[]'::jsonb,  -- array of allowed user_ids
  created_by    uuid    REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.production_write_protections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin can manage write protections" ON public.production_write_protections;
CREATE POLICY "super_admin can manage write protections"
  ON public.production_write_protections
  FOR ALL
  USING  (public.mcl_is_super_admin())
  WITH CHECK (public.mcl_is_super_admin());

DROP POLICY IF EXISTS "authenticated read write protections" ON public.production_write_protections;
CREATE POLICY "authenticated read write protections"
  ON public.production_write_protections
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =============================================================================
-- 3. anomaly_locks
--    Auto-detected anomalies that lock down affected resources.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.anomaly_locks (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_key    text        NOT NULL,
  anomaly_type    text        NOT NULL,   -- e.g. 'rate_spike', 'auth_flood', 'data_exfil'
  severity        text        NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  is_locked       boolean     NOT NULL DEFAULT true,
  detected_at     timestamptz NOT NULL DEFAULT now(),
  locked_at       timestamptz NOT NULL DEFAULT now(),
  unlocked_at     timestamptz,
  unlocked_by     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  evidence        jsonb       NOT NULL DEFAULT '{}'::jsonb,
  resolved        boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_anomaly_locks_resource_locked
  ON public.anomaly_locks (resource_key, is_locked);
CREATE INDEX IF NOT EXISTS idx_anomaly_locks_severity
  ON public.anomaly_locks (severity, detected_at DESC);

ALTER TABLE public.anomaly_locks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin can manage anomaly locks" ON public.anomaly_locks;
CREATE POLICY "super_admin can manage anomaly locks"
  ON public.anomaly_locks
  FOR ALL
  USING  (public.mcl_is_super_admin())
  WITH CHECK (public.mcl_is_super_admin());

-- =============================================================================
-- 4. ai_action_approvals
--    Pending AI-generated operations awaiting threshold-based approval.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.ai_action_approvals (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type     text        NOT NULL,
  payload         jsonb       NOT NULL DEFAULT '{}'::jsonb,
  risk_score      integer     NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
  status          text        NOT NULL DEFAULT 'PENDING'
                              CHECK (status IN ('PENDING','APPROVED','REJECTED','EXPIRED','SANDBOXED')),
  requested_by    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,
  expires_at      timestamptz NOT NULL DEFAULT (now() + INTERVAL '1 hour'),
  review_notes    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_approvals_status_created
  ON public.ai_action_approvals (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_approvals_risk
  ON public.ai_action_approvals (risk_score DESC, status);

ALTER TABLE public.ai_action_approvals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin can manage ai approvals" ON public.ai_action_approvals;
CREATE POLICY "super_admin can manage ai approvals"
  ON public.ai_action_approvals
  FOR ALL
  USING  (public.mcl_is_super_admin())
  WITH CHECK (public.mcl_is_super_admin());

DROP POLICY IF EXISTS "requester can read own approvals" ON public.ai_action_approvals;
CREATE POLICY "requester can read own approvals"
  ON public.ai_action_approvals
  FOR SELECT
  USING (auth.uid() = requested_by);

-- =============================================================================
-- 5. command_sandbox_log
--    Immutable record of every AI-generated command that passed through the
--    sandbox (executed or blocked).
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.command_sandbox_log (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id     uuid        REFERENCES public.ai_action_approvals(id) ON DELETE SET NULL,
  command_type    text        NOT NULL,
  command_payload jsonb       NOT NULL DEFAULT '{}'::jsonb,
  execution_status text       NOT NULL DEFAULT 'PENDING'
                              CHECK (execution_status IN ('PENDING','EXECUTED','BLOCKED','FAILED')),
  executed_by     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  executed_at     timestamptz,
  block_reason    text,
  output          jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
  -- No updated_at – this log is append-only / immutable
);

CREATE INDEX IF NOT EXISTS idx_sandbox_log_status_created
  ON public.command_sandbox_log (execution_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sandbox_log_approval
  ON public.command_sandbox_log (approval_id);

ALTER TABLE public.command_sandbox_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin can read sandbox log" ON public.command_sandbox_log;
CREATE POLICY "super_admin can read sandbox log"
  ON public.command_sandbox_log
  FOR SELECT
  USING (public.mcl_is_super_admin());

DROP POLICY IF EXISTS "service role can insert sandbox log" ON public.command_sandbox_log;
CREATE POLICY "service role can insert sandbox log"
  ON public.command_sandbox_log
  FOR INSERT
  WITH CHECK (true);   -- insertion is controlled by the service; SELECT is restricted

-- =============================================================================
-- 6. master_control_audit_log
--    Immutable audit trail for every MCL action.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.master_control_audit_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  target_type text        NOT NULL,   -- 'kill_switch', 'write_protection', 'anomaly_lock', 'ai_approval', 'sandbox'
  target_id   uuid,
  before_state jsonb,
  after_state  jsonb,
  metadata     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  ip_address   inet,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now()
  -- Intentionally no updated_at; this table is append-only.
);

CREATE INDEX IF NOT EXISTS idx_mcl_audit_actor_created
  ON public.master_control_audit_log (actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mcl_audit_target
  ON public.master_control_audit_log (target_type, target_id, created_at DESC);

ALTER TABLE public.master_control_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "super_admin can read audit log" ON public.master_control_audit_log;
CREATE POLICY "super_admin can read audit log"
  ON public.master_control_audit_log
  FOR SELECT
  USING (public.mcl_is_super_admin());

DROP POLICY IF EXISTS "service role can insert audit log" ON public.master_control_audit_log;
CREATE POLICY "service role can insert audit log"
  ON public.master_control_audit_log
  FOR INSERT
  WITH CHECK (true);

-- =============================================================================
-- 7. updated_at triggers (for mutable tables only)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'master_control_switches',
    'production_write_protections',
    'anomaly_locks',
    'ai_action_approvals'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON public.%1$s;
       CREATE TRIGGER trg_%1$s_updated_at
         BEFORE UPDATE ON public.%1$s
         FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();',
      tbl
    );
  END LOOP;
END;
$$;

-- =============================================================================
-- 8. Seed: default global kill-switch (active = system running normally)
-- =============================================================================
INSERT INTO public.master_control_switches (switch_key, scope, is_active, reason)
VALUES ('global', 'global', true, 'System operational')
ON CONFLICT (switch_key) DO NOTHING;

INSERT INTO public.master_control_switches (switch_key, scope, is_active, reason)
VALUES ('readonly_emergency', 'global', false, 'Emergency read-only mode - not engaged')
ON CONFLICT (switch_key) DO NOTHING;
