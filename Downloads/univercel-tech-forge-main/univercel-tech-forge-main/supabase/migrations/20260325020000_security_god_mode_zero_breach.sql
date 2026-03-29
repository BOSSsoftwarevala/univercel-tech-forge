CREATE OR REPLACE FUNCTION public.can_manage_security(_user_id uuid)
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
    AND role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'admin', 'api_security', 'finance_manager')
)
$$;

CREATE OR REPLACE FUNCTION public.security_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.security_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Security audit records are immutable';
END;
$$;

ALTER TABLE public.user_sessions
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS geo_city TEXT,
ADD COLUMN IF NOT EXISTS geo_country TEXT,
ADD COLUMN IF NOT EXISTS session_token_hash TEXT,
ADD COLUMN IF NOT EXISTS auth_strength TEXT NOT NULL DEFAULT 'password' CHECK (auth_strength IN ('password', 'password_otp', 'password_totp', 'password_backup_code', 'biometric_ready')),
ADD COLUMN IF NOT EXISTS forced_reauth BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS revoked_reason TEXT,
ADD COLUMN IF NOT EXISTS risk_score NUMERIC(8,2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_user_sessions_active_last_activity
ON public.user_sessions(is_active, last_activity_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_sessions_risk
ON public.user_sessions(risk_score DESC, is_active);

CREATE TABLE IF NOT EXISTS public.security_control_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key TEXT NOT NULL UNIQUE DEFAULT 'global',
  zero_trust_enabled BOOLEAN NOT NULL DEFAULT true,
  email_otp_enabled BOOLEAN NOT NULL DEFAULT true,
  totp_enabled BOOLEAN NOT NULL DEFAULT true,
  backup_codes_enabled BOOLEAN NOT NULL DEFAULT true,
  biometric_ready BOOLEAN NOT NULL DEFAULT true,
  require_2fa_for_admin BOOLEAN NOT NULL DEFAULT true,
  require_2fa_for_finance BOOLEAN NOT NULL DEFAULT true,
  unknown_device_requires_otp BOOLEAN NOT NULL DEFAULT true,
  geo_change_force_reauth BOOLEAN NOT NULL DEFAULT true,
  high_risk_auto_block BOOLEAN NOT NULL DEFAULT true,
  inactivity_timeout_minutes INTEGER NOT NULL DEFAULT 30,
  password_expiry_days INTEGER NOT NULL DEFAULT 90,
  login_rate_limit INTEGER NOT NULL DEFAULT 5,
  api_rate_limit INTEGER NOT NULL DEFAULT 100,
  finance_extra_auth_amount NUMERIC(14,2) NOT NULL DEFAULT 100000,
  settings_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT security_control_settings_timeout_check CHECK (inactivity_timeout_minutes BETWEEN 5 AND 1440),
  CONSTRAINT security_control_settings_password_check CHECK (password_expiry_days BETWEEN 30 AND 365),
  CONSTRAINT security_control_settings_login_rate_check CHECK (login_rate_limit BETWEEN 3 AND 20),
  CONSTRAINT security_control_settings_api_rate_check CHECK (api_rate_limit BETWEEN 10 AND 10000)
);

CREATE TABLE IF NOT EXISTS public.security_live_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('new_login', 'suspicious_login', 'geo_change', 'ip_change', 'unknown_device', 'brute_force', 'bot_activity', 'session_anomaly', 'payout_attempt', 'finance_risk', 'breach_attempt', 'account_locked')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'investigating', 'blocked', 'resolved')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
  related_ip TEXT,
  related_country TEXT,
  risk_score NUMERIC(8,2) NOT NULL DEFAULT 0,
  source_table TEXT,
  source_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_user_risk_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  active_role TEXT,
  account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'watch', 'locked', 'disabled')),
  last_login_at TIMESTAMPTZ,
  last_ip TEXT,
  last_country TEXT,
  known_device_count INTEGER NOT NULL DEFAULT 0,
  failed_logins_24h INTEGER NOT NULL DEFAULT 0,
  threat_score NUMERIC(8,2) NOT NULL DEFAULT 0,
  requires_step_up BOOLEAN NOT NULL DEFAULT false,
  finance_guard_enabled BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_incident_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_type TEXT NOT NULL CHECK (response_type IN ('alert_acknowledged', 'alert_resolved', 'session_revoked', 'user_locked', 'user_disabled', 'ip_blocked', 'signout_everywhere', 'password_reset_forced', '2fa_enabled', 'scan_executed')),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_session_id UUID REFERENCES public.user_sessions(id) ON DELETE SET NULL,
  related_alert_id UUID REFERENCES public.security_live_alerts(id) ON DELETE SET NULL,
  response_notes TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  immutable BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_live_alerts_status
ON public.security_live_alerts(status, severity, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_live_alerts_user
ON public.security_live_alerts(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_risk_profiles_status
ON public.security_user_risk_profiles(account_status, threat_score DESC);

CREATE INDEX IF NOT EXISTS idx_security_incident_responses_target
ON public.security_incident_responses(target_user_id, created_at DESC);

ALTER TABLE public.security_control_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_live_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_user_risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incident_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "session_admin" ON public.user_sessions;
CREATE POLICY "session_security_manager"
ON public.user_sessions
FOR ALL USING (public.can_manage_security(auth.uid()));

DROP POLICY IF EXISTS "Security admin" ON public.security_logs;
CREATE POLICY "security_logs_manager"
ON public.security_logs
FOR ALL USING (public.can_manage_security(auth.uid()));

DROP POLICY IF EXISTS "Master can view breach attempts" ON public.security_breach_attempts;
CREATE POLICY "security_breach_manager_view"
ON public.security_breach_attempts
FOR SELECT USING (public.can_manage_security(auth.uid()));

CREATE POLICY "security_breach_insert"
ON public.security_breach_attempts
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Privileged can manage whitelist" ON public.login_whitelist;
CREATE POLICY "security_whitelist_manage"
ON public.login_whitelist
FOR ALL USING (public.can_manage_security(auth.uid()));

DROP POLICY IF EXISTS "Master can view security log" ON public.immutable_security_log;
CREATE POLICY "security_immutable_log_view"
ON public.immutable_security_log
FOR SELECT USING (public.can_manage_security(auth.uid()) OR user_id = auth.uid());

DROP POLICY IF EXISTS "Users can manage own 2FA settings" ON public.user_2fa_settings;
CREATE POLICY "users_manage_own_2fa_settings"
ON public.user_2fa_settings
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "security_managers_view_2fa_settings"
ON public.user_2fa_settings
FOR SELECT USING (public.can_manage_security(auth.uid()));

DROP POLICY IF EXISTS "Super admins can view all devices" ON public.trusted_devices;
CREATE POLICY "security_managers_view_all_devices"
ON public.trusted_devices
FOR SELECT USING (public.can_manage_security(auth.uid()));

DROP POLICY IF EXISTS "Super admins can view all sessions" ON public.session_security;
CREATE POLICY "security_managers_view_all_session_security"
ON public.session_security
FOR SELECT USING (public.can_manage_security(auth.uid()));

DROP POLICY IF EXISTS "Super admins can view all action logs" ON public.verified_action_logs;
CREATE POLICY "security_managers_view_verified_action_logs"
ON public.verified_action_logs
FOR SELECT USING (public.can_manage_security(auth.uid()));

CREATE POLICY "security_control_settings_manage"
ON public.security_control_settings
FOR ALL USING (public.can_manage_security(auth.uid()))
WITH CHECK (public.can_manage_security(auth.uid()));

CREATE POLICY "security_live_alerts_manage"
ON public.security_live_alerts
FOR ALL USING (public.can_manage_security(auth.uid()) OR user_id = auth.uid())
WITH CHECK (public.can_manage_security(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "security_risk_profiles_manage"
ON public.security_user_risk_profiles
FOR ALL USING (public.can_manage_security(auth.uid()) OR user_id = auth.uid())
WITH CHECK (public.can_manage_security(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "security_incident_responses_view"
ON public.security_incident_responses
FOR SELECT USING (public.can_manage_security(auth.uid()) OR target_user_id = auth.uid());

CREATE POLICY "security_incident_responses_insert"
ON public.security_incident_responses
FOR INSERT WITH CHECK (public.can_manage_security(auth.uid()));

DROP TRIGGER IF EXISTS security_control_settings_touch_updated_at ON public.security_control_settings;
CREATE TRIGGER security_control_settings_touch_updated_at
BEFORE UPDATE ON public.security_control_settings
FOR EACH ROW EXECUTE FUNCTION public.security_touch_updated_at();

DROP TRIGGER IF EXISTS security_live_alerts_touch_updated_at ON public.security_live_alerts;
CREATE TRIGGER security_live_alerts_touch_updated_at
BEFORE UPDATE ON public.security_live_alerts
FOR EACH ROW EXECUTE FUNCTION public.security_touch_updated_at();

DROP TRIGGER IF EXISTS security_user_risk_profiles_touch_updated_at ON public.security_user_risk_profiles;
CREATE TRIGGER security_user_risk_profiles_touch_updated_at
BEFORE UPDATE ON public.security_user_risk_profiles
FOR EACH ROW EXECUTE FUNCTION public.security_touch_updated_at();

DROP TRIGGER IF EXISTS user_sessions_touch_updated_at_security ON public.user_sessions;
CREATE TRIGGER user_sessions_touch_updated_at_security
BEFORE UPDATE ON public.user_sessions
FOR EACH ROW EXECUTE FUNCTION public.security_touch_updated_at();

DROP TRIGGER IF EXISTS security_incident_responses_no_mutation ON public.security_incident_responses;
CREATE TRIGGER security_incident_responses_no_mutation
BEFORE UPDATE OR DELETE ON public.security_incident_responses
FOR EACH ROW EXECUTE FUNCTION public.security_block_mutation();

INSERT INTO public.security_control_settings (
  settings_key,
  zero_trust_enabled,
  email_otp_enabled,
  totp_enabled,
  backup_codes_enabled,
  biometric_ready,
  require_2fa_for_admin,
  require_2fa_for_finance,
  unknown_device_requires_otp,
  geo_change_force_reauth,
  high_risk_auto_block,
  inactivity_timeout_minutes,
  password_expiry_days,
  login_rate_limit,
  api_rate_limit,
  finance_extra_auth_amount,
  settings_json
)
VALUES (
  'global',
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  30,
  90,
  5,
  100,
  100000,
  jsonb_build_object(
    'shield_mode', 'military_bank_grade',
    'zero_breach', true,
    'every_request_verified', true,
    'every_action_logged', true
  )
)
ON CONFLICT (settings_key) DO UPDATE SET
  zero_trust_enabled = EXCLUDED.zero_trust_enabled,
  email_otp_enabled = EXCLUDED.email_otp_enabled,
  totp_enabled = EXCLUDED.totp_enabled,
  backup_codes_enabled = EXCLUDED.backup_codes_enabled,
  biometric_ready = EXCLUDED.biometric_ready,
  require_2fa_for_admin = EXCLUDED.require_2fa_for_admin,
  require_2fa_for_finance = EXCLUDED.require_2fa_for_finance,
  unknown_device_requires_otp = EXCLUDED.unknown_device_requires_otp,
  geo_change_force_reauth = EXCLUDED.geo_change_force_reauth,
  high_risk_auto_block = EXCLUDED.high_risk_auto_block,
  inactivity_timeout_minutes = EXCLUDED.inactivity_timeout_minutes,
  password_expiry_days = EXCLUDED.password_expiry_days,
  login_rate_limit = EXCLUDED.login_rate_limit,
  api_rate_limit = EXCLUDED.api_rate_limit,
  finance_extra_auth_amount = EXCLUDED.finance_extra_auth_amount,
  settings_json = public.security_control_settings.settings_json || EXCLUDED.settings_json,
  updated_at = now();

ALTER PUBLICATION supabase_realtime ADD TABLE public.security_live_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_sessions;
