-- ════════════════════════════════════════════════════════════════
-- MASTER ADMIN SECURITY ARCHITECTURE - ZERO TRUST IMPLEMENTATION
-- ════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════
-- 1. DEVICE FINGERPRINT REGISTRY
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_device_fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    fingerprint_hash TEXT NOT NULL,
    device_name TEXT,
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    geo_location TEXT,
    is_trusted BOOLEAN DEFAULT false,
    trust_level INTEGER DEFAULT 0, -- 0-100
    first_seen_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    is_blocked BOOLEAN DEFAULT false,
    blocked_reason TEXT,
    blocked_at TIMESTAMPTZ,
    blocked_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, fingerprint_hash)
);

-- ═══════════════════════════════════════════
-- 2. LOGIN ATTEMPTS (Rate Limiting & Security)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_login_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email TEXT,
    ip_address TEXT NOT NULL,
    device_fingerprint TEXT,
    geo_location TEXT,
    attempt_type TEXT NOT NULL, -- 'success', 'failed_password', 'failed_mfa', 'blocked', 'locked'
    failure_reason TEXT,
    risk_score INTEGER DEFAULT 0,
    is_anomaly BOOLEAN DEFAULT false,
    anomaly_reasons JSONB DEFAULT '[]'::jsonb,
    captcha_required BOOLEAN DEFAULT false,
    captcha_passed BOOLEAN,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 3. TOKEN REGISTRY (Session Management)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_token_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    token_type TEXT NOT NULL, -- 'access', 'refresh'
    device_fingerprint TEXT,
    ip_address TEXT,
    geo_location TEXT,
    issued_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    last_used_at TIMESTAMPTZ,
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMPTZ,
    revoke_reason TEXT, -- 'logout', 'role_change', 'system_lock', 'rental_expiry', 'security_threat'
    revoked_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 4. BLACKBOX HASH CHAIN (Tamper Detection)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_blackbox_hash_chain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blackbox_event_id UUID NOT NULL REFERENCES public.blackbox_events(id),
    sequence_number BIGINT NOT NULL UNIQUE,
    event_hash TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    chain_hash TEXT NOT NULL, -- hash(event_hash + previous_hash)
    verification_status TEXT DEFAULT 'valid', -- 'valid', 'tampered', 'pending'
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 5. RATE LIMITS CONFIGURATION
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL,
    limit_type TEXT NOT NULL, -- 'ip', 'user', 'global'
    max_requests INTEGER NOT NULL,
    window_seconds INTEGER NOT NULL,
    cooldown_seconds INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(endpoint, limit_type)
);

-- ═══════════════════════════════════════════
-- 6. RATE LIMIT TRACKING
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_rate_limit_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rate_limit_id UUID REFERENCES public.master_rate_limits(id),
    identifier TEXT NOT NULL, -- IP or user_id
    identifier_type TEXT NOT NULL, -- 'ip', 'user'
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT now(),
    cooldown_until TIMESTAMPTZ,
    is_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 7. SECURITY THREAT LOG
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_security_threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    threat_type TEXT NOT NULL, -- 'brute_force', 'replay_attack', 'injection', 'privilege_escalation', 'anomaly', 'geo_anomaly'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
    source_ip TEXT,
    source_user_id UUID,
    target_entity TEXT,
    target_id UUID,
    threat_data JSONB DEFAULT '{}'::jsonb,
    auto_response TEXT, -- 'none', 'captcha', 'step_up', 'session_kill', 'user_lock', 'ip_block'
    auto_response_at TIMESTAMPTZ,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    resolution_notes TEXT,
    blackbox_event_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 8. ACCESS CONTROL CHECKS LOG
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_access_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    module TEXT,
    entity_type TEXT,
    entity_id UUID,
    check_system_lock BOOLEAN DEFAULT true,
    check_user_status BOOLEAN DEFAULT true,
    check_role_scope BOOLEAN DEFAULT true,
    check_permission BOOLEAN DEFAULT true,
    check_rental BOOLEAN DEFAULT true,
    check_risk_score BOOLEAN DEFAULT true,
    system_lock_passed BOOLEAN,
    user_status_passed BOOLEAN,
    role_scope_passed BOOLEAN,
    permission_passed BOOLEAN,
    rental_passed BOOLEAN,
    risk_score_passed BOOLEAN,
    final_result BOOLEAN NOT NULL,
    denial_reason TEXT,
    risk_score INTEGER,
    ip_address TEXT,
    device_fingerprint TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 9. SECURITY SETTINGS (Encrypted Vault)
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value_encrypted TEXT, -- encrypted value
    setting_type TEXT DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    is_secret BOOLEAN DEFAULT false,
    rotation_required BOOLEAN DEFAULT false,
    last_rotated_at TIMESTAMPTZ,
    rotation_interval_days INTEGER,
    updated_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════
-- 10. ANTI-REPLAY TOKENS
-- ═══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.master_replay_protection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT NOT NULL UNIQUE,
    request_hash TEXT NOT NULL,
    user_id UUID,
    endpoint TEXT NOT NULL,
    ip_address TEXT,
    used_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- ═══════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_user ON public.master_device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_hash ON public.master_device_fingerprints(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON public.master_login_attempts(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_attempts_user ON public.master_login_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_token_registry_user ON public.master_token_registry(user_id);
CREATE INDEX IF NOT EXISTS idx_token_registry_hash ON public.master_token_registry(token_hash);
CREATE INDEX IF NOT EXISTS idx_hash_chain_sequence ON public.master_blackbox_hash_chain(sequence_number);
CREATE INDEX IF NOT EXISTS idx_rate_limit_tracking ON public.master_rate_limit_tracking(identifier, identifier_type);
CREATE INDEX IF NOT EXISTS idx_security_threats_severity ON public.master_security_threats(severity, is_resolved);
CREATE INDEX IF NOT EXISTS idx_access_checks_user ON public.master_access_checks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_replay_protection_expires ON public.master_replay_protection(expires_at);

-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════
ALTER TABLE public.master_device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_token_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_blackbox_hash_chain ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_rate_limit_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_security_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_access_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_replay_protection ENABLE ROW LEVEL SECURITY;

-- Security tables: Master full access, Super Admin read, Security team limited access
CREATE POLICY "master_device_fingerprints_policy" ON public.master_device_fingerprints
    FOR ALL USING (public.has_role(auth.uid(), 'master'::app_role));

CREATE POLICY "master_device_fingerprints_read_policy" ON public.master_device_fingerprints
    FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "master_login_attempts_policy" ON public.master_login_attempts
    FOR ALL USING (public.has_role(auth.uid(), 'master'::app_role));

CREATE POLICY "master_login_attempts_insert_policy" ON public.master_login_attempts
    FOR INSERT WITH CHECK (true); -- Allow system inserts

CREATE POLICY "master_login_attempts_read_policy" ON public.master_login_attempts
    FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "master_token_registry_policy" ON public.master_token_registry
    FOR ALL USING (public.has_role(auth.uid(), 'master'::app_role));

CREATE POLICY "master_token_registry_self_policy" ON public.master_token_registry
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "master_hash_chain_policy" ON public.master_blackbox_hash_chain
    FOR SELECT USING (public.has_role(auth.uid(), 'master'::app_role) OR public.has_role(auth.uid(), 'super_admin'::app_role));

-- Hash chain is append-only
CREATE POLICY "master_hash_chain_insert_policy" ON public.master_blackbox_hash_chain
    FOR INSERT WITH CHECK (true);

CREATE POLICY "master_rate_limits_policy" ON public.master_rate_limits
    FOR ALL USING (public.has_role(auth.uid(), 'master'::app_role));

CREATE POLICY "master_rate_limit_tracking_policy" ON public.master_rate_limit_tracking
    FOR ALL USING (true); -- System managed

CREATE POLICY "master_security_threats_policy" ON public.master_security_threats
    FOR ALL USING (public.has_role(auth.uid(), 'master'::app_role));

CREATE POLICY "master_security_threats_read_policy" ON public.master_security_threats
    FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "master_access_checks_policy" ON public.master_access_checks
    FOR ALL USING (public.has_role(auth.uid(), 'master'::app_role));

CREATE POLICY "master_access_checks_insert_policy" ON public.master_access_checks
    FOR INSERT WITH CHECK (true); -- System inserts

CREATE POLICY "master_security_settings_policy" ON public.master_security_settings
    FOR ALL USING (public.has_role(auth.uid(), 'master'::app_role));

CREATE POLICY "master_replay_protection_policy" ON public.master_replay_protection
    FOR ALL USING (true); -- System managed

-- ═══════════════════════════════════════════
-- TIMESTAMP TRIGGERS
-- ═══════════════════════════════════════════
CREATE TRIGGER update_master_device_fingerprints_timestamp
    BEFORE UPDATE ON public.master_device_fingerprints
    FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();

CREATE TRIGGER update_master_rate_limits_timestamp
    BEFORE UPDATE ON public.master_rate_limits
    FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();

CREATE TRIGGER update_master_rate_limit_tracking_timestamp
    BEFORE UPDATE ON public.master_rate_limit_tracking
    FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();

CREATE TRIGGER update_master_security_settings_timestamp
    BEFORE UPDATE ON public.master_security_settings
    FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();

-- ═══════════════════════════════════════════
-- SEED RATE LIMITS
-- ═══════════════════════════════════════════
INSERT INTO public.master_rate_limits (endpoint, limit_type, max_requests, window_seconds, cooldown_seconds) VALUES
    ('/auth/login', 'ip', 5, 300, 900), -- 5 attempts per 5 min, 15 min cooldown
    ('/auth/login', 'user', 10, 3600, 1800), -- 10 attempts per hour, 30 min cooldown
    ('/api/*', 'ip', 100, 60, 60), -- 100 requests per minute
    ('/api/*', 'user', 200, 60, 30), -- 200 requests per minute per user
    ('/auth/refresh', 'user', 20, 3600, 0), -- 20 refreshes per hour
    ('/security/*', 'user', 50, 60, 120), -- Security endpoints limited
    ('/audit/*', 'user', 30, 60, 60) -- Audit endpoints limited
ON CONFLICT (endpoint, limit_type) DO NOTHING;

-- ═══════════════════════════════════════════
-- SEED SECURITY SETTINGS
-- ═══════════════════════════════════════════
INSERT INTO public.master_security_settings (setting_key, setting_value_encrypted, setting_type, is_secret) VALUES
    ('jwt_expiry_minutes', '15', 'number', false),
    ('refresh_token_expiry_hours', '24', 'number', false),
    ('max_login_failures', '5', 'number', false),
    ('lockout_duration_minutes', '30', 'number', false),
    ('require_captcha_after_failures', '3', 'number', false),
    ('risk_score_threshold_high', '70', 'number', false),
    ('risk_score_threshold_critical', '90', 'number', false),
    ('session_inactivity_timeout_minutes', '30', 'number', false),
    ('geo_anomaly_enabled', 'true', 'boolean', false),
    ('device_fingerprint_required', 'true', 'boolean', false)
ON CONFLICT (setting_key) DO NOTHING;