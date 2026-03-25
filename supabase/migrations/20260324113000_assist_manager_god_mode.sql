DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assist_manager_session_status') THEN
    CREATE TYPE public.assist_manager_session_status AS ENUM ('pending', 'approved', 'denied', 'active', 'paused', 'ended', 'expired', 'blocked');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assist_manager_control_status') THEN
    CREATE TYPE public.assist_manager_control_status AS ENUM ('allowed', 'blocked', 'revoked');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.assist_manager_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  relay_session_id UUID REFERENCES public.safe_assist_sessions(id) ON DELETE SET NULL,
  agent_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  assist_type TEXT NOT NULL CHECK (assist_type IN ('support', 'dev', 'sales')),
  target_role TEXT NOT NULL,
  purpose TEXT NOT NULL,
  permission_scope JSONB NOT NULL DEFAULT '[]'::JSONB,
  status public.assist_manager_session_status NOT NULL DEFAULT 'pending',
  approval_required BOOLEAN NOT NULL DEFAULT true,
  approval_user_id UUID,
  approval_reason TEXT,
  approval_granted_at TIMESTAMPTZ,
  denial_reason TEXT,
  permission_token_hash TEXT,
  device_binding_hash TEXT,
  requester_ip TEXT,
  requester_device TEXT,
  target_ip TEXT,
  target_device TEXT,
  current_escalation_level INTEGER NOT NULL DEFAULT 0,
  ai_risk_score INTEGER NOT NULL DEFAULT 0,
  emergency_stopped BOOLEAN NOT NULL DEFAULT false,
  start_requested_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  max_duration_minutes INTEGER NOT NULL DEFAULT 120,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT assist_manager_sessions_duration_check CHECK (max_duration_minutes BETWEEN 5 AND 480)
);

CREATE TABLE IF NOT EXISTS public.assist_manager_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assist_manager_sessions(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL,
  requester_user_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  response_reason TEXT,
  ip TEXT,
  device TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_manager_control_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assist_manager_sessions(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  control_status public.assist_manager_control_status NOT NULL DEFAULT 'allowed',
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  ip TEXT,
  device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_manager_file_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assist_manager_sessions(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL,
  receiver_user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT,
  checksum_sha256 TEXT NOT NULL,
  encrypted BOOLEAN NOT NULL DEFAULT true,
  transfer_status TEXT NOT NULL CHECK (transfer_status IN ('queued', 'transferring', 'completed', 'blocked', 'failed')),
  chunk_count INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_manager_chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assist_manager_sessions(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'chat' CHECK (message_type IN ('chat', 'system', 'voice_status')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_manager_session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assist_manager_sessions(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  actions JSONB NOT NULL DEFAULT '[]'::JSONB,
  files JSONB NOT NULL DEFAULT '[]'::JSONB,
  chat JSONB NOT NULL DEFAULT '[]'::JSONB,
  ip TEXT,
  device TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_manager_ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.assist_manager_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  analysis JSONB NOT NULL DEFAULT '{}'::JSONB,
  suggestion TEXT,
  auto_executed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_manager_device_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  device_hash TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT true,
  label TEXT,
  blocked_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, device_hash)
);

CREATE TABLE IF NOT EXISTS public.assist_manager_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key TEXT NOT NULL UNIQUE,
  settings_value JSONB NOT NULL DEFAULT '{}'::JSONB,
  updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_manager_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.assist_manager_sessions(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  user_id UUID,
  role TEXT,
  ip TEXT,
  device TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assist_manager_sessions_status ON public.assist_manager_sessions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assist_manager_sessions_target_user ON public.assist_manager_sessions(target_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assist_manager_sessions_agent ON public.assist_manager_sessions(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assist_manager_approvals_status ON public.assist_manager_approvals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assist_manager_control_events_session ON public.assist_manager_control_events(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assist_manager_file_logs_session ON public.assist_manager_file_logs(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assist_manager_chat_logs_session ON public.assist_manager_chat_logs(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assist_manager_audit_logs_session ON public.assist_manager_audit_logs(session_id, timestamp DESC);

ALTER TABLE public.assist_manager_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_control_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_file_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_device_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_manager_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "assist_manager_manage_sessions" ON public.assist_manager_sessions;
CREATE POLICY "assist_manager_manage_sessions"
ON public.assist_manager_sessions
FOR ALL
USING (
  auth.uid() = agent_id
  OR auth.uid() = target_user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  auth.uid() = agent_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_manage_approvals" ON public.assist_manager_approvals;
CREATE POLICY "assist_manager_manage_approvals"
ON public.assist_manager_approvals
FOR ALL
USING (
  auth.uid() = target_user_id
  OR auth.uid() = requester_user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  auth.uid() = target_user_id
  OR auth.uid() = requester_user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_manage_control_events" ON public.assist_manager_control_events;
CREATE POLICY "assist_manager_manage_control_events"
ON public.assist_manager_control_events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_control_events.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_control_events.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_manage_file_logs" ON public.assist_manager_file_logs;
CREATE POLICY "assist_manager_manage_file_logs"
ON public.assist_manager_file_logs
FOR ALL
USING (
  sender_user_id = auth.uid()
  OR receiver_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  sender_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_manage_chat_logs" ON public.assist_manager_chat_logs;
CREATE POLICY "assist_manager_manage_chat_logs"
ON public.assist_manager_chat_logs
FOR ALL
USING (
  sender_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_chat_logs.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  sender_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_view_session_logs" ON public.assist_manager_session_logs;
CREATE POLICY "assist_manager_view_session_logs"
ON public.assist_manager_session_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_session_logs.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_insert_session_logs" ON public.assist_manager_session_logs;
CREATE POLICY "assist_manager_insert_session_logs"
ON public.assist_manager_session_logs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_session_logs.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_manage_ai_logs" ON public.assist_manager_ai_logs;
CREATE POLICY "assist_manager_manage_ai_logs"
ON public.assist_manager_ai_logs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_ai_logs.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_ai_logs.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_manage_device_access" ON public.assist_manager_device_access;
CREATE POLICY "assist_manager_manage_device_access"
ON public.assist_manager_device_access
FOR ALL
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_manage_settings" ON public.assist_manager_settings;
CREATE POLICY "assist_manager_manage_settings"
ON public.assist_manager_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_view_audit_logs" ON public.assist_manager_audit_logs;
CREATE POLICY "assist_manager_view_audit_logs"
ON public.assist_manager_audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.assist_manager_sessions s
    WHERE s.id = assist_manager_audit_logs.session_id
      AND (s.agent_id = auth.uid() OR s.target_user_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('assist_manager', 'super_admin', 'master')
      AND ur.approval_status = 'approved'
  )
);

DROP POLICY IF EXISTS "assist_manager_insert_audit_logs" ON public.assist_manager_audit_logs;
CREATE POLICY "assist_manager_insert_audit_logs"
ON public.assist_manager_audit_logs
FOR INSERT
WITH CHECK (true);

CREATE TRIGGER update_assist_manager_sessions_updated_at
BEFORE UPDATE ON public.assist_manager_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assist_manager_approvals_updated_at
BEFORE UPDATE ON public.assist_manager_approvals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assist_manager_file_logs_updated_at
BEFORE UPDATE ON public.assist_manager_file_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assist_manager_device_access_updated_at
BEFORE UPDATE ON public.assist_manager_device_access
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assist_manager_settings_updated_at
BEFORE UPDATE ON public.assist_manager_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.assist_manager_settings (settings_key, settings_value)
VALUES
  ('global', jsonb_build_object(
    'default_duration_minutes', 30,
    'max_duration_minutes', 120,
    'auto_timeout_minutes', 15,
    'require_consent', true,
    'approval_required', true,
    'allow_file_transfer', true,
    'allow_voice', true,
    'working_hours_only', false,
    'ai_risk_threshold', 75,
    'auto_escalate', true,
    'auto_end_over_limit', true,
    'mask_sensitive', true
  ))
ON CONFLICT (settings_key) DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.assist_manager_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assist_manager_approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assist_manager_control_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assist_manager_file_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assist_manager_chat_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assist_manager_ai_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assist_manager_audit_logs;