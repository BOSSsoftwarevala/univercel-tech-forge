-- Super Admin Action Log (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.super_admin_action_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  session_id UUID,
  action_type VARCHAR(100) NOT NULL,
  action_category VARCHAR(50) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  target_name TEXT,
  scope_type VARCHAR(20),
  scope_value TEXT,
  risk_level VARCHAR(20) DEFAULT 'normal',
  requires_confirmation BOOLEAN DEFAULT false,
  confirmation_provided BOOLEAN,
  reason TEXT,
  previous_state JSONB,
  new_state JSONB,
  ip_address TEXT,
  geo_location TEXT,
  device_fingerprint TEXT,
  user_agent TEXT,
  execution_time_ms INTEGER,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Login Attempts (Rate Limiting)
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  device_fingerprint TEXT,
  attempt_type VARCHAR(20) DEFAULT 'password',
  success BOOLEAN DEFAULT false,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- IP Blocklist
CREATE TABLE IF NOT EXISTS public.ip_blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  reason TEXT NOT NULL,
  blocked_by UUID NOT NULL,
  blocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_permanent BOOLEAN DEFAULT false,
  unblocked_by UUID,
  unblocked_at TIMESTAMP WITH TIME ZONE
);

-- Add columns to super_admin_sessions if missing
ALTER TABLE public.super_admin_sessions 
ADD COLUMN IF NOT EXISTS geo_location TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add lock_type and expires_at to system_locks if missing
ALTER TABLE public.system_locks
ADD COLUMN IF NOT EXISTS lock_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS scope_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS scope_value TEXT,
ADD COLUMN IF NOT EXISTS unlock_reason TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Add security columns to super_admin if not exists
ALTER TABLE public.super_admin 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login_ip TEXT,
ADD COLUMN IF NOT EXISTS last_login_device TEXT,
ADD COLUMN IF NOT EXISTS failed_login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS security_clearance VARCHAR(20) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS requires_2fa BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS max_session_duration_minutes INTEGER DEFAULT 480,
ADD COLUMN IF NOT EXISTS allowed_ip_ranges TEXT[],
ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.super_admin_action_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_blocklist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Super admins can view action logs" ON public.super_admin_action_log;
CREATE POLICY "Super admins can view action logs"
ON public.super_admin_action_log FOR SELECT
USING (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can insert action logs" ON public.super_admin_action_log;
CREATE POLICY "Super admins can insert action logs"
ON public.super_admin_action_log FOR INSERT
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admins can view login attempts" ON public.login_attempts;
CREATE POLICY "Super admins can view login attempts"
ON public.login_attempts FOR SELECT
USING (public.is_super_admin());

DROP POLICY IF EXISTS "Anyone can insert login attempts" ON public.login_attempts;
CREATE POLICY "Anyone can insert login attempts"
ON public.login_attempts FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Super admins can manage IP blocklist" ON public.ip_blocklist;
CREATE POLICY "Super admins can manage IP blocklist"
ON public.ip_blocklist FOR ALL
USING (public.is_super_admin());

-- Prevent modification of action logs
CREATE OR REPLACE FUNCTION public.prevent_action_log_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Action logs are immutable';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_action_log_modification ON public.super_admin_action_log;
CREATE TRIGGER prevent_action_log_modification
BEFORE UPDATE OR DELETE ON public.super_admin_action_log
FOR EACH ROW EXECUTE FUNCTION public.prevent_action_log_modification();

-- Function to validate Super Admin session
CREATE OR REPLACE FUNCTION public.validate_super_admin_session(
  p_user_id UUID,
  p_session_token TEXT,
  p_ip_address TEXT,
  p_device_fingerprint TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_session RECORD;
  v_admin RECORD;
  v_lock RECORD;
BEGIN
  -- Check IP blocklist
  IF EXISTS (SELECT 1 FROM ip_blocklist WHERE ip_address = p_ip_address AND (expires_at IS NULL OR expires_at > now())) THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'ip_blocked');
  END IF;

  -- Get session
  SELECT * INTO v_session FROM super_admin_sessions
  WHERE user_id = p_user_id AND session_token = p_session_token AND is_active = true;
  
  IF v_session IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'session_not_found');
  END IF;
  
  -- Check session expiry
  IF v_session.expires_at < now() THEN
    UPDATE super_admin_sessions SET is_active = false, terminated_at = now(), termination_reason = 'expired' WHERE id = v_session.id;
    RETURN jsonb_build_object('valid', false, 'reason', 'session_expired');
  END IF;
  
  -- Check device fingerprint
  IF v_session.device_fingerprint != p_device_fingerprint THEN
    UPDATE super_admin_sessions SET is_active = false, terminated_at = now(), termination_reason = 'device_mismatch' WHERE id = v_session.id;
    RETURN jsonb_build_object('valid', false, 'reason', 'device_mismatch');
  END IF;
  
  -- Get admin status
  SELECT * INTO v_admin FROM super_admin WHERE user_id = p_user_id;
  
  IF v_admin IS NULL OR v_admin.status != 'active' THEN
    UPDATE super_admin_sessions SET is_active = false, terminated_at = now(), termination_reason = 'admin_inactive' WHERE id = v_session.id;
    RETURN jsonb_build_object('valid', false, 'reason', 'admin_inactive');
  END IF;
  
  -- Check system locks
  SELECT * INTO v_lock FROM system_locks 
  WHERE lock_scope = 'system' AND is_active = true AND (expires_at IS NULL OR expires_at > now())
  LIMIT 1;
  
  IF v_lock IS NOT NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'system_locked', 'lock_reason', v_lock.reason);
  END IF;
  
  -- Update last activity
  UPDATE super_admin_sessions SET last_activity_at = now(), ip_address = p_ip_address WHERE id = v_session.id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'session_id', v_session.id,
    'admin_id', v_admin.id,
    'scope_type', v_admin.scope_type,
    'assigned_scope', v_admin.assigned_scope,
    'security_clearance', v_admin.security_clearance
  );
END;
$$;

-- Function to check authorization
CREATE OR REPLACE FUNCTION public.check_super_admin_authorization(
  p_user_id UUID,
  p_action VARCHAR(100),
  p_target_scope JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin RECORD;
  v_scope_match BOOLEAN := true;
BEGIN
  SELECT * INTO v_admin FROM super_admin WHERE user_id = p_user_id AND status = 'active';
  
  IF v_admin IS NULL THEN
    RETURN jsonb_build_object('authorized', false, 'reason', 'not_super_admin');
  END IF;
  
  -- Check scope if not global
  IF p_target_scope IS NOT NULL AND v_admin.scope_type != 'global' THEN
    IF v_admin.scope_type = 'continent' THEN
      v_scope_match := (p_target_scope->>'continent') = ANY(
        SELECT jsonb_array_elements_text(v_admin.assigned_scope->'continents')
      );
    ELSIF v_admin.scope_type = 'country' THEN
      v_scope_match := (p_target_scope->>'country') = ANY(
        SELECT jsonb_array_elements_text(v_admin.assigned_scope->'countries')
      );
    END IF;
    
    IF NOT v_scope_match THEN
      RETURN jsonb_build_object('authorized', false, 'reason', 'scope_violation');
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    'authorized', true,
    'admin_id', v_admin.id,
    'scope_type', v_admin.scope_type,
    'assigned_scope', v_admin.assigned_scope
  );
END;
$$;

-- Function to log action
CREATE OR REPLACE FUNCTION public.log_super_admin_action(
  p_admin_id UUID,
  p_action_type VARCHAR(100),
  p_action_category VARCHAR(50),
  p_target_type VARCHAR(50) DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_risk_level VARCHAR(20) DEFAULT 'normal',
  p_reason TEXT DEFAULT NULL,
  p_previous_state JSONB DEFAULT NULL,
  p_new_state JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_status VARCHAR(20) DEFAULT 'success'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_log_id UUID;
  v_signature TEXT;
BEGIN
  v_signature := encode(sha256(
    (p_admin_id::text || p_action_type || COALESCE(p_target_id::text, '') || now()::text)::bytea
  ), 'hex');
  
  INSERT INTO super_admin_action_log (
    admin_id, action_type, action_category,
    target_type, target_id, risk_level, reason,
    previous_state, new_state, ip_address, status, signature
  ) VALUES (
    p_admin_id, p_action_type, p_action_category,
    p_target_type, p_target_id, p_risk_level, p_reason,
    p_previous_state, p_new_state, p_ip_address, p_status, v_signature
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION public.check_login_rate_limit(
  p_email TEXT,
  p_ip_address TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_recent_failures INTEGER;
  v_ip_failures INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_recent_failures FROM login_attempts
  WHERE email = p_email AND success = false AND created_at > now() - interval '15 minutes';
  
  SELECT COUNT(*) INTO v_ip_failures FROM login_attempts
  WHERE ip_address = p_ip_address AND success = false AND created_at > now() - interval '15 minutes';
  
  IF v_recent_failures >= 5 THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'too_many_attempts_email', 'wait_minutes', 15);
  END IF;
  
  IF v_ip_failures >= 10 THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'too_many_attempts_ip', 'wait_minutes', 15);
  END IF;
  
  RETURN jsonb_build_object('allowed', true, 'email_attempts', v_recent_failures, 'ip_attempts', v_ip_failures);
END;
$$;

-- Create session with security
CREATE OR REPLACE FUNCTION public.create_super_admin_session(
  p_user_id UUID,
  p_device_fingerprint TEXT,
  p_ip_address TEXT,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin RECORD;
  v_session_token TEXT;
  v_session_id UUID;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get admin
  SELECT * INTO v_admin FROM super_admin WHERE user_id = p_user_id AND status = 'active';
  
  IF v_admin IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_super_admin');
  END IF;
  
  -- Terminate other active sessions (one session per device policy)
  UPDATE super_admin_sessions 
  SET is_active = false, terminated_at = now(), termination_reason = 'new_session'
  WHERE user_id = p_user_id AND is_active = true;
  
  -- Generate session token
  v_session_token := encode(gen_random_bytes(32), 'hex');
  v_expires_at := now() + (COALESCE(v_admin.max_session_duration_minutes, 480) || ' minutes')::interval;
  
  -- Create session
  INSERT INTO super_admin_sessions (
    user_id, session_token, device_fingerprint, ip_address, user_agent, expires_at
  ) VALUES (
    p_user_id, v_session_token, p_device_fingerprint, p_ip_address, p_user_agent, v_expires_at
  ) RETURNING id INTO v_session_id;
  
  -- Update admin login info
  UPDATE super_admin 
  SET last_login_at = now(), last_login_ip = p_ip_address, last_login_device = p_device_fingerprint, failed_login_count = 0
  WHERE id = v_admin.id;
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'session_token', v_session_token,
    'expires_at', v_expires_at,
    'admin_id', v_admin.id,
    'scope_type', v_admin.scope_type,
    'assigned_scope', v_admin.assigned_scope
  );
END;
$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON public.login_attempts(email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON public.login_attempts(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_action_log_admin ON public.super_admin_action_log(admin_id, created_at DESC);