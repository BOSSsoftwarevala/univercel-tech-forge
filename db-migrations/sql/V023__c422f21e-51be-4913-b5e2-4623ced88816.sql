-- =============================================
-- AI-POWERED ANTI-FRAUD & MISUSE PREVENTION SYSTEM
-- =============================================

-- Device Fingerprints
CREATE TABLE IF NOT EXISTS public.device_fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    fingerprint_hash TEXT NOT NULL,
    device_info JSONB DEFAULT '{}',
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    is_primary BOOLEAN DEFAULT false,
    is_trusted BOOLEAN DEFAULT false,
    is_blocked BOOLEAN DEFAULT false,
    blocked_reason TEXT,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, fingerprint_hash)
);

-- IP Intelligence
CREATE TABLE IF NOT EXISTS public.ip_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL UNIQUE,
    is_vpn BOOLEAN DEFAULT false,
    is_proxy BOOLEAN DEFAULT false,
    is_tor BOOLEAN DEFAULT false,
    is_datacenter BOOLEAN DEFAULT false,
    country_code TEXT,
    region TEXT,
    city TEXT,
    isp TEXT,
    org TEXT,
    risk_score INTEGER DEFAULT 0,
    is_blacklisted BOOLEAN DEFAULT false,
    blacklist_reason TEXT,
    first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    request_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fraud Scores
CREATE TABLE IF NOT EXISTS public.fraud_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    overall_score INTEGER DEFAULT 0,
    identity_score INTEGER DEFAULT 0,
    behavior_score INTEGER DEFAULT 0,
    transaction_score INTEGER DEFAULT 0,
    click_score INTEGER DEFAULT 0,
    device_score INTEGER DEFAULT 0,
    risk_level TEXT DEFAULT 'low',
    risk_factors TEXT[] DEFAULT '{}',
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    requires_review BOOLEAN DEFAULT false,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fraud Alerts
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    device_fingerprint TEXT,
    location TEXT,
    status TEXT DEFAULT 'pending',
    auto_action_taken TEXT,
    manual_action TEXT,
    resolved_by UUID,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    escalation_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Account Suspensions
CREATE TABLE IF NOT EXISTS public.account_suspensions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    suspension_type TEXT NOT NULL,
    reason TEXT NOT NULL,
    masked_reason TEXT,
    severity TEXT DEFAULT 'temporary',
    auto_triggered BOOLEAN DEFAULT true,
    trigger_alert_id UUID,
    suspended_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    appeal_submitted BOOLEAN DEFAULT false,
    appeal_text TEXT,
    appeal_submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    lifted_at TIMESTAMP WITH TIME ZONE,
    lifted_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Click Fraud Detection
CREATE TABLE IF NOT EXISTS public.click_fraud_detection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID,
    reseller_id UUID,
    franchise_id UUID,
    tracking_code TEXT,
    total_clicks INTEGER DEFAULT 0,
    valid_clicks INTEGER DEFAULT 0,
    invalid_clicks INTEGER DEFAULT 0,
    bot_clicks INTEGER DEFAULT 0,
    vpn_clicks INTEGER DEFAULT 0,
    duplicate_ip_clicks INTEGER DEFAULT 0,
    suspicious_patterns JSONB DEFAULT '{}',
    fraud_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'monitoring',
    flagged_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    review_notes TEXT,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Commission Fraud Detection
CREATE TABLE IF NOT EXISTS public.commission_fraud_detection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_role app_role NOT NULL,
    check_type TEXT NOT NULL,
    findings JSONB DEFAULT '{}',
    risk_indicators TEXT[] DEFAULT '{}',
    fraud_probability DECIMAL(3,2),
    amount_flagged DECIMAL(14,2),
    status TEXT DEFAULT 'pending',
    auto_hold_applied BOOLEAN DEFAULT false,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Lead Fraud Detection
CREATE TABLE IF NOT EXISTS public.lead_fraud_detection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID,
    submitted_by UUID,
    validation_score INTEGER DEFAULT 100,
    is_duplicate BOOLEAN DEFAULT false,
    duplicate_of UUID,
    phone_valid BOOLEAN,
    email_valid BOOLEAN,
    is_disposable_email BOOLEAN DEFAULT false,
    is_throwaway_phone BOOLEAN DEFAULT false,
    spam_patterns JSONB DEFAULT '{}',
    bulk_submission_detected BOOLEAN DEFAULT false,
    ip_address TEXT,
    device_fingerprint TEXT,
    fraud_indicators TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    quarantined BOOLEAN DEFAULT false,
    auto_rejected BOOLEAN DEFAULT false,
    rejection_reason TEXT,
    reviewed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Blacklist/Whitelist
CREATE TABLE IF NOT EXISTS public.access_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_type TEXT NOT NULL,
    entry_type TEXT NOT NULL,
    entry_value TEXT NOT NULL,
    reason TEXT,
    added_by UUID,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(list_type, entry_type, entry_value)
);

-- Login Locations for Impossible Travel
CREATE TABLE IF NOT EXISTS public.login_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_id UUID,
    ip_address TEXT,
    country_code TEXT,
    city TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    login_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    travel_speed_kmh DECIMAL(10,2),
    is_impossible_travel BOOLEAN DEFAULT false,
    previous_location_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Behavior Analytics
CREATE TABLE IF NOT EXISTS public.behavior_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_id UUID,
    page_url TEXT,
    event_type TEXT NOT NULL,
    mouse_velocity DECIMAL(10,2),
    scroll_pattern TEXT,
    keystroke_pattern TEXT,
    time_on_page INTEGER,
    click_coordinates JSONB,
    is_bot_like BOOLEAN DEFAULT false,
    bot_probability DECIMAL(3,2),
    anomaly_flags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Code Access Logs
CREATE TABLE IF NOT EXISTS public.code_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID NOT NULL,
    task_id UUID,
    action_type TEXT NOT NULL,
    file_path TEXT,
    repository TEXT,
    access_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ip_address TEXT,
    device_fingerprint TEXT,
    is_outside_hours BOOLEAN DEFAULT false,
    is_suspicious BOOLEAN DEFAULT false,
    suspicious_reason TEXT,
    copy_attempt BOOLEAN DEFAULT false,
    export_attempt BOOLEAN DEFAULT false,
    watermark_applied BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transaction Monitoring
CREATE TABLE IF NOT EXISTS public.transaction_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID,
    transaction_id UUID,
    user_id UUID NOT NULL,
    transaction_type TEXT,
    amount DECIMAL(14,2),
    currency TEXT DEFAULT 'INR',
    risk_score INTEGER DEFAULT 0,
    risk_factors TEXT[] DEFAULT '{}',
    velocity_check_passed BOOLEAN DEFAULT true,
    pattern_check_passed BOOLEAN DEFAULT true,
    geo_check_passed BOOLEAN DEFAULT true,
    is_flagged BOOLEAN DEFAULT false,
    flag_reason TEXT,
    requires_2fa BOOLEAN DEFAULT false,
    is_held BOOLEAN DEFAULT false,
    hold_reason TEXT,
    released_at TIMESTAMP WITH TIME ZONE,
    released_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_monitoring ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users view own devices" ON public.device_fingerprints FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System inserts devices" ON public.device_fingerprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage devices" ON public.device_fingerprints FOR ALL USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins view IP intel" ON public.ip_intelligence FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "System inserts IP intel" ON public.ip_intelligence FOR INSERT WITH CHECK (true);
CREATE POLICY "System updates IP intel" ON public.ip_intelligence FOR UPDATE USING (true);

CREATE POLICY "Users view own fraud score" ON public.fraud_scores FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage fraud scores" ON public.fraud_scores FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "System upserts fraud scores" ON public.fraud_scores FOR INSERT WITH CHECK (true);

CREATE POLICY "System creates alerts" ON public.fraud_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage alerts" ON public.fraud_alerts FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance_manager'));

CREATE POLICY "Users view own suspensions" ON public.account_suspensions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage suspensions" ON public.account_suspensions FOR ALL USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins view click fraud" ON public.click_fraud_detection FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "System inserts click fraud" ON public.click_fraud_detection FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view commission fraud" ON public.commission_fraud_detection FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'finance_manager'));
CREATE POLICY "System inserts commission fraud" ON public.commission_fraud_detection FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view lead fraud" ON public.lead_fraud_detection FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'lead_manager'));
CREATE POLICY "System inserts lead fraud" ON public.lead_fraud_detection FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage access lists" ON public.access_lists FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "System reads access lists" ON public.access_lists FOR SELECT USING (true);

CREATE POLICY "Users view own locations" ON public.login_locations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System inserts locations" ON public.login_locations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view locations" ON public.login_locations FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "System inserts behavior" ON public.behavior_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view behavior" ON public.behavior_analytics FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "System inserts code logs" ON public.code_access_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Devs view own code logs" ON public.code_access_logs FOR SELECT USING (developer_id = get_developer_id(auth.uid()));
CREATE POLICY "Admins view code logs" ON public.code_access_logs FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "System inserts tx monitoring" ON public.transaction_monitoring FOR INSERT WITH CHECK (true);
CREATE POLICY "Finance views tx monitoring" ON public.transaction_monitoring FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'finance_manager'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_user ON public.device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_hash ON public.device_fingerprints(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_ip_intelligence_ip ON public.ip_intelligence(ip_address);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user ON public.fraud_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON public.fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_account_suspensions_user ON public.account_suspensions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_login_locations_user ON public.login_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_analytics_user ON public.behavior_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_access_lists_lookup ON public.access_lists(list_type, entry_type, entry_value);

-- Function: Check if IP/device is allowed
CREATE OR REPLACE FUNCTION check_access_allowed(
    p_ip_address TEXT,
    p_device_fingerprint TEXT,
    p_email TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_blocked BOOLEAN := false;
    v_reason TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM access_lists WHERE list_type = 'blacklist' AND entry_type = 'ip' AND entry_value = p_ip_address AND is_active = true AND (expires_at IS NULL OR expires_at > now())) THEN
        v_blocked := true;
        v_reason := 'IP address is blacklisted';
    END IF;
    
    IF NOT v_blocked AND p_device_fingerprint IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM access_lists WHERE list_type = 'blacklist' AND entry_type = 'device' AND entry_value = p_device_fingerprint AND is_active = true) THEN
            v_blocked := true;
            v_reason := 'Device is blacklisted';
        END IF;
    END IF;
    
    IF NOT v_blocked AND p_email IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM access_lists WHERE list_type = 'blacklist' AND entry_type = 'email' AND entry_value = p_email AND is_active = true) THEN
            v_blocked := true;
            v_reason := 'Email is blacklisted';
        END IF;
    END IF;
    
    IF NOT v_blocked THEN
        IF EXISTS (SELECT 1 FROM ip_intelligence WHERE ip_address = p_ip_address AND (is_blacklisted = true OR risk_score > 80)) THEN
            v_blocked := true;
            v_reason := 'High risk IP detected';
        END IF;
    END IF;
    
    RETURN jsonb_build_object('allowed', NOT v_blocked, 'blocked', v_blocked, 'reason', v_reason);
END;
$$;