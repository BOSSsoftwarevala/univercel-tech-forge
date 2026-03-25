ALTER TABLE public.developer_tasks
DROP CONSTRAINT IF EXISTS developer_tasks_status_check;

ALTER TABLE public.developer_tasks
ADD CONSTRAINT developer_tasks_status_check
CHECK (
  status IN (
    'new',
    'pending',
    'assigned',
    'accepted',
    'in_progress',
    'working',
    'paused',
    'blocked',
    'testing',
    'qa_queue',
    'review',
    'completed',
    'rejected',
    'escalated',
    'closed',
    'cancelled',
    'ai_in_progress',
    'ai_completed'
  )
);

ALTER TABLE public.developer_tasks
DROP CONSTRAINT IF EXISTS developer_tasks_priority_check;

ALTER TABLE public.developer_tasks
ADD CONSTRAINT developer_tasks_priority_check
CHECK (priority IN ('low', 'medium', 'high', 'critical', 'urgent'));

ALTER TABLE public.developer_tasks
ADD COLUMN IF NOT EXISTS sprint_id UUID,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_reason TEXT,
ADD COLUMN IF NOT EXISTS escalation_reason TEXT,
ADD COLUMN IF NOT EXISTS escalated_flag BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS qa_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS qa_comment TEXT,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS closed_by UUID;

CREATE TABLE IF NOT EXISTS public.developer_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.developer_tasks
ADD CONSTRAINT developer_tasks_sprint_id_fkey
FOREIGN KEY (sprint_id) REFERENCES public.developer_sprints(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.developer_build_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  build_target TEXT NOT NULL DEFAULT 'staging',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'paused', 'failed', 'retrying', 'qa_queue', 'completed')),
  timer_started_at TIMESTAMPTZ,
  timer_stopped_at TIMESTAMPTZ,
  total_minutes INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  build_output JSONB NOT NULL DEFAULT '{}'::JSONB,
  qa_sent_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.developer_bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.developer_tasks(id) ON DELETE SET NULL,
  reported_by UUID NOT NULL,
  assigned_developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'fixed', 'verified', 'closed', 'rejected')),
  fix_notes TEXT,
  verified_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.developer_workflow_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  task_id UUID REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('delay', 'security', 'performance', 'compliance', 'qa', 'build')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.developer_task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL,
  author_role app_role NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'internal' CHECK (comment_type IN ('internal', 'review', 'qa')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.developer_access_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  access_status TEXT NOT NULL DEFAULT 'active' CHECK (access_status IN ('active', 'temporary', 'locked', 'restricted')),
  access_type TEXT NOT NULL DEFAULT 'standard' CHECK (access_type IN ('standard', 'temporary', 'restricted')),
  expires_at TIMESTAMPTZ,
  lock_reason TEXT,
  allowed_ip TEXT,
  device_fingerprint TEXT,
  session_timeout_minutes INTEGER NOT NULL DEFAULT 120,
  violation_count INTEGER NOT NULL DEFAULT 0,
  last_violation_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_ai_decision (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL UNIQUE REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('ai', 'human', 'hybrid')),
  confidence_score INTEGER NOT NULL DEFAULT 0,
  assigned_to TEXT,
  override_mode TEXT CHECK (override_mode IN ('ai', 'human', 'hybrid')),
  cost_score INTEGER NOT NULL DEFAULT 0,
  delay_risk_score INTEGER NOT NULL DEFAULT 0,
  reasoning TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_developer_tasks_sprint ON public.developer_tasks(sprint_id);
CREATE INDEX IF NOT EXISTS idx_build_runs_task ON public.developer_build_runs(task_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON public.developer_bug_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_alerts_user_status ON public.developer_workflow_alerts(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON public.developer_task_comments(task_id, created_at DESC);

ALTER TABLE public.developer_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_build_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_workflow_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_access_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_ai_decision ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers can manage developer sprints" ON public.developer_sprints;
CREATE POLICY "Managers can manage developer sprints" ON public.developer_sprints
FOR ALL USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers can view assigned sprints" ON public.developer_sprints;
CREATE POLICY "Developers can view assigned sprints" ON public.developer_sprints
FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.developer_tasks dt
    WHERE dt.sprint_id = developer_sprints.id
      AND dt.developer_id = public.get_developer_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Managers can manage build runs" ON public.developer_build_runs;
CREATE POLICY "Managers can manage build runs" ON public.developer_build_runs
FOR ALL USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers can manage own build runs" ON public.developer_build_runs;
CREATE POLICY "Developers can manage own build runs" ON public.developer_build_runs
FOR ALL USING (developer_id = public.get_developer_id(auth.uid()))
WITH CHECK (developer_id = public.get_developer_id(auth.uid()));

DROP POLICY IF EXISTS "Managers can manage bug reports" ON public.developer_bug_reports;
CREATE POLICY "Managers can manage bug reports" ON public.developer_bug_reports
FOR ALL USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers can view assigned bugs" ON public.developer_bug_reports;
CREATE POLICY "Developers can view assigned bugs" ON public.developer_bug_reports
FOR SELECT USING (
  assigned_developer_id = public.get_developer_id(auth.uid())
  OR reported_by = auth.uid()
);

DROP POLICY IF EXISTS "Managers can manage workflow alerts" ON public.developer_workflow_alerts;
CREATE POLICY "Managers can manage workflow alerts" ON public.developer_workflow_alerts
FOR ALL USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Users can view own workflow alerts" ON public.developer_workflow_alerts;
CREATE POLICY "Users can view own workflow alerts" ON public.developer_workflow_alerts
FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

DROP POLICY IF EXISTS "Comments visible to task participants" ON public.developer_task_comments;
CREATE POLICY "Comments visible to task participants" ON public.developer_task_comments
FOR SELECT USING (
  public.can_manage_developers(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.developer_tasks dt
    WHERE dt.id = developer_task_comments.task_id
      AND dt.developer_id = public.get_developer_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Comments inserted by task participants" ON public.developer_task_comments;
CREATE POLICY "Comments inserted by task participants" ON public.developer_task_comments
FOR INSERT WITH CHECK (
  public.can_manage_developers(auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.developer_tasks dt
    WHERE dt.id = developer_task_comments.task_id
      AND dt.developer_id = public.get_developer_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Managers can manage access controls" ON public.developer_access_controls;
CREATE POLICY "Managers can manage access controls" ON public.developer_access_controls
FOR ALL USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Users can view own access control" ON public.developer_access_controls;
CREATE POLICY "Users can view own access control" ON public.developer_access_controls
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Managers can manage task ai decisions" ON public.task_ai_decision;
CREATE POLICY "Managers can manage task ai decisions" ON public.task_ai_decision
FOR ALL USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers can view own ai decisions" ON public.task_ai_decision;
CREATE POLICY "Developers can view own ai decisions" ON public.task_ai_decision
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.developer_tasks dt
    WHERE dt.id = task_ai_decision.task_id
      AND dt.developer_id = public.get_developer_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "settings_admin" ON public.system_settings;
CREATE POLICY "settings_manager" ON public.system_settings
FOR ALL USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

CREATE OR REPLACE FUNCTION public.lock_user_access(target_user_id UUID, actor_user_id UUID, reason TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.can_manage_developers(actor_user_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  INSERT INTO public.developer_access_controls (user_id, access_status, access_type, lock_reason, updated_at)
  VALUES (target_user_id, 'locked', 'restricted', reason, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    access_status = 'locked',
    access_type = 'restricted',
    lock_reason = EXCLUDED.lock_reason,
    updated_at = now();

  UPDATE public.user_sessions
  SET is_active = false,
      force_logout_flag = true,
      logout_at = now()
  WHERE user_id = target_user_id
    AND is_active = true;

  UPDATE public.user_roles
  SET force_logged_out_at = now(),
      force_logged_out_by = actor_user_id
  WHERE user_id = target_user_id;

  INSERT INTO public.developer_workflow_alerts (user_id, alert_type, severity, title, message, status)
  VALUES (target_user_id, 'security', 'critical', 'Access Locked', coalesce(reason, 'Access locked by administrator'), 'open');

  INSERT INTO public.audit_logs (user_id, action, module, meta_json)
  VALUES (actor_user_id, 'developer_access_locked', 'developer_security', jsonb_build_object('target_user_id', target_user_id, 'reason', reason, 'timestamp', now()));

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.temp_grant_user_access(target_user_id UUID, actor_user_id UUID, expires_at_input TIMESTAMPTZ)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.can_manage_developers(actor_user_id) THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  INSERT INTO public.developer_access_controls (user_id, access_status, access_type, expires_at, updated_at)
  VALUES (target_user_id, 'temporary', 'temporary', expires_at_input, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    access_status = 'temporary',
    access_type = 'temporary',
    expires_at = EXCLUDED.expires_at,
    lock_reason = NULL,
    updated_at = now();

  INSERT INTO public.audit_logs (user_id, action, module, meta_json)
  VALUES (actor_user_id, 'developer_access_temp_grant', 'developer_security', jsonb_build_object('target_user_id', target_user_id, 'expires_at', expires_at_input, 'timestamp', now()));

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_developer_violation_control()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_violation_count INTEGER;
BEGIN
  SELECT user_id INTO v_user_id FROM public.developers WHERE id = NEW.developer_id;

  INSERT INTO public.developer_access_controls (user_id, violation_count, last_violation_at)
  VALUES (v_user_id, 1, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    violation_count = developer_access_controls.violation_count + 1,
    last_violation_at = now(),
    updated_at = now()
  RETURNING violation_count INTO v_violation_count;

  INSERT INTO public.developer_workflow_alerts (user_id, task_id, alert_type, severity, title, message, status, metadata)
  VALUES (
    v_user_id,
    NEW.task_id,
    CASE WHEN NEW.violation_type IN ('behavior') THEN 'security' ELSE 'performance' END,
    CASE WHEN NEW.severity = 'critical' THEN 'critical' ELSE 'high' END,
    'Violation Recorded',
    coalesce(NEW.description, NEW.violation_type),
    'open',
    jsonb_build_object('violation_type', NEW.violation_type, 'penalty_amount', NEW.penalty_amount)
  );

  IF v_violation_count >= 3 THEN
    UPDATE public.developer_access_controls
    SET access_status = 'locked',
        access_type = 'restricted',
        lock_reason = 'Auto locked after 3 violations',
        updated_at = now()
    WHERE user_id = v_user_id;

    UPDATE public.user_sessions
    SET is_active = false,
        force_logout_flag = true,
        logout_at = now()
    WHERE user_id = v_user_id
      AND is_active = true;

    UPDATE public.user_roles
    SET force_logged_out_at = now()
    WHERE user_id = v_user_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_developer_violation_control ON public.developer_violations;
CREATE TRIGGER trigger_developer_violation_control
AFTER INSERT ON public.developer_violations
FOR EACH ROW EXECUTE FUNCTION public.handle_developer_violation_control();

CREATE OR REPLACE FUNCTION public.verify_login_allowed(
  p_user_id UUID,
  p_email TEXT,
  p_ip_address TEXT,
  p_device_fingerprint TEXT,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_whitelist RECORD;
  v_user_role TEXT;
  v_access_control RECORD;
BEGIN
  SELECT * INTO v_access_control
  FROM public.developer_access_controls
  WHERE user_id = p_user_id
  LIMIT 1;

  IF v_access_control.access_status = 'locked' THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'locked', 'message', coalesce(v_access_control.lock_reason, 'Account locked by administrator.'));
  END IF;

  IF v_access_control.access_status = 'temporary' AND v_access_control.expires_at IS NOT NULL AND v_access_control.expires_at < now() THEN
    UPDATE public.developer_access_controls
    SET access_status = 'restricted',
        access_type = 'restricted',
        updated_at = now()
    WHERE user_id = p_user_id;

    RETURN jsonb_build_object('allowed', false, 'reason', 'temporary_expired', 'message', 'Temporary access has expired.');
  END IF;

  IF v_access_control.allowed_ip IS NOT NULL AND v_access_control.allowed_ip <> p_ip_address THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'ip_mismatch', 'message', 'Login from this IP is blocked.');
  END IF;

  IF v_access_control.device_fingerprint IS NOT NULL AND v_access_control.device_fingerprint <> p_device_fingerprint THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'device_mismatch', 'message', 'Unknown device blocked.');
  END IF;

  SELECT * INTO v_whitelist
  FROM login_whitelist
  WHERE (user_id = p_user_id OR email = p_email)
    AND is_active = true
  LIMIT 1;

  SELECT role INTO v_user_role FROM user_roles WHERE user_id = p_user_id LIMIT 1;

  IF v_whitelist IS NULL AND v_user_role NOT IN ('master', 'super_admin', 'boss_owner', 'ceo') THEN
    INSERT INTO security_breach_attempts (
      attempt_type, ip_address, device_fingerprint, user_agent,
      attempted_action, user_id, severity
    ) VALUES (
      'unauthorized_login', p_ip_address, p_device_fingerprint, p_user_agent,
      'login_attempt', p_user_id, 'critical'
    );

    INSERT INTO public.developer_workflow_alerts (user_id, alert_type, severity, title, message, status)
    VALUES (p_user_id, 'security', 'high', 'Unauthorized Login Attempt', 'Login blocked because the account is not whitelisted.', 'open');

    RETURN jsonb_build_object('allowed', false, 'reason', 'not_whitelisted', 'message', 'Your account is not authorized. Contact administrator.');
  END IF;

  IF v_whitelist IS NOT NULL AND v_whitelist.ip_whitelist IS NOT NULL AND array_length(v_whitelist.ip_whitelist, 1) > 0 THEN
    IF NOT (p_ip_address = ANY(v_whitelist.ip_whitelist)) THEN
      INSERT INTO security_breach_attempts (
        attempt_type, ip_address, device_fingerprint, user_agent,
        attempted_action, user_id, severity
      ) VALUES (
        'ip_not_whitelisted', p_ip_address, p_device_fingerprint, p_user_agent,
        'login_attempt', p_user_id, 'high'
      );

      INSERT INTO public.developer_workflow_alerts (user_id, alert_type, severity, title, message, status)
      VALUES (p_user_id, 'security', 'high', 'IP Binding Blocked Login', 'Login blocked due to IP binding mismatch.', 'open');

      RETURN jsonb_build_object('allowed', false, 'reason', 'ip_not_whitelisted', 'message', 'Login from this location is not allowed.');
    END IF;
  END IF;

  IF v_whitelist IS NOT NULL THEN
    UPDATE login_whitelist
    SET last_login_at = now(),
        last_login_ip = p_ip_address,
        last_login_device = p_device_fingerprint,
        login_count = login_count + 1,
        updated_at = now()
    WHERE id = v_whitelist.id;
  END IF;

  INSERT INTO audit_logs (user_id, action, module, role, meta_json)
  VALUES (
    p_user_id,
    'login_verified',
    'auth',
    COALESCE(v_user_role, 'developer')::app_role,
    jsonb_build_object('ip_address', p_ip_address, 'device', p_device_fingerprint, 'timestamp', now())
  );

  RETURN jsonb_build_object('allowed', true, 'role', v_user_role);
END;
$$;

CREATE TRIGGER update_developer_sprints_updated_at
BEFORE UPDATE ON public.developer_sprints
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_developer_build_runs_updated_at
BEFORE UPDATE ON public.developer_build_runs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_developer_bug_reports_updated_at
BEFORE UPDATE ON public.developer_bug_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_developer_access_controls_updated_at
BEFORE UPDATE ON public.developer_access_controls
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_ai_decision_updated_at
BEFORE UPDATE ON public.task_ai_decision
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.system_settings (setting_key, setting_value, is_public)
VALUES
  ('developer.notifications.task_assignment_alerts', 'true', false),
  ('developer.notifications.code_submission_alerts', 'true', false),
  ('developer.notifications.bug_alerts', 'true', false),
  ('developer.notifications.deadline_warnings', 'true', false),
  ('developer.security.ip_binding', 'false', false),
  ('developer.security.device_binding', 'false', false),
  ('developer.security.session_timeout_minutes', '120', false),
  ('developer.ai.quality_score', 'true', false),
  ('developer.ai.auto_delay_prediction', 'true', false),
  ('developer.ai.skill_match', 'true', false)
ON CONFLICT (setting_key) DO NOTHING;