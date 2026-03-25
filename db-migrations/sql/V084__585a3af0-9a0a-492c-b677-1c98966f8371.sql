
-- ═══════════════════════════════════════════════════════════════
-- MASTER ADMIN - Part 2: Rental, AI, Risk, RLS, Indexes, Seeds
-- ═══════════════════════════════════════════════════════════════

-- RENTAL ENGINE
CREATE TABLE IF NOT EXISTS public.master_rental_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name TEXT NOT NULL,
    plan_code TEXT NOT NULL UNIQUE,
    duration_type TEXT NOT NULL CHECK (duration_type IN ('hour', 'day', 'week', 'month', 'year', 'unlimited')),
    duration_value INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_rentable_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_code TEXT NOT NULL UNIQUE,
    feature_name TEXT NOT NULL,
    module_name TEXT NOT NULL,
    description TEXT,
    is_premium BOOLEAN DEFAULT false,
    base_price DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    feature_id UUID REFERENCES public.master_rentable_features(id) ON DELETE RESTRICT,
    plan_id UUID REFERENCES public.master_rental_plans(id) ON DELETE RESTRICT,
    start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspended', 'pending')),
    revoked_by UUID,
    revoked_at TIMESTAMPTZ,
    revoke_reason TEXT,
    auto_renew BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_rental_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id UUID REFERENCES public.master_rentals(id) ON DELETE RESTRICT,
    usage_type TEXT NOT NULL,
    usage_metric JSONB DEFAULT '{}',
    ip_address TEXT,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI WATCHER & RISK ENGINE
CREATE TABLE IF NOT EXISTS public.master_ai_behavior_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    behavior_score INTEGER NOT NULL DEFAULT 50 CHECK (behavior_score >= 0 AND behavior_score <= 100),
    anomaly_level TEXT NOT NULL DEFAULT 'none' CHECK (anomaly_level IN ('none', 'low', 'medium', 'high', 'critical')),
    anomaly_factors JSONB DEFAULT '[]',
    pattern_analysis JSONB DEFAULT '{}',
    last_login_pattern JSONB DEFAULT '{}',
    last_action_pattern JSONB DEFAULT '{}',
    is_flagged BOOLEAN DEFAULT false,
    flagged_reason TEXT,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_risk_entity_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    risk_value INTEGER NOT NULL DEFAULT 0 CHECK (risk_value >= 0 AND risk_value <= 100),
    risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_factors JSONB DEFAULT '[]',
    trend TEXT DEFAULT 'stable' CHECK (trend IN ('improving', 'stable', 'worsening')),
    previous_value INTEGER,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_ai_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT NOT NULL,
    alert_title TEXT NOT NULL,
    alert_description TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger', 'critical')),
    source_module TEXT NOT NULL,
    target_user_id UUID,
    target_entity_type TEXT,
    target_entity_id UUID,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMPTZ,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    auto_action_taken TEXT,
    blackbox_event_id UUID REFERENCES public.blackbox_events(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SYSTEM VAULT
CREATE TABLE IF NOT EXISTS public.master_system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json', 'encrypted')),
    is_encrypted BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    last_modified_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ENABLE RLS ON ALL NEW TABLES
ALTER TABLE public.blackbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_live_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_continents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_super_admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_global_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_rule_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_ip_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_system_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_audit_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_rental_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_rentable_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_rental_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_ai_behavior_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_risk_entity_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_ai_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_system_settings ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES: Master has full access
CREATE POLICY "master_blackbox_select" ON public.blackbox_events FOR SELECT USING (public.is_master());
CREATE POLICY "master_blackbox_insert" ON public.blackbox_events FOR INSERT WITH CHECK (true);

CREATE POLICY "master_live_activity_all" ON public.master_live_activity FOR ALL USING (public.is_master());
CREATE POLICY "master_continents_all" ON public.master_continents FOR ALL USING (public.is_master());
CREATE POLICY "master_countries_all" ON public.master_countries FOR ALL USING (public.is_master());
CREATE POLICY "master_super_admin_profiles_all" ON public.master_super_admin_profiles FOR ALL USING (public.is_master());
CREATE POLICY "master_admin_activity_log_all" ON public.master_admin_activity_log FOR ALL USING (public.is_master());
CREATE POLICY "master_global_rules_all" ON public.master_global_rules FOR ALL USING (public.is_master());
CREATE POLICY "master_rule_execution_logs_all" ON public.master_rule_execution_logs FOR ALL USING (public.is_master());
CREATE POLICY "master_approvals_all" ON public.master_approvals FOR ALL USING (public.is_master());
CREATE POLICY "master_approval_steps_all" ON public.master_approval_steps FOR ALL USING (public.is_master());
CREATE POLICY "master_security_events_all" ON public.master_security_events FOR ALL USING (public.is_master());
CREATE POLICY "master_ip_watchlist_all" ON public.master_ip_watchlist FOR ALL USING (public.is_master());
CREATE POLICY "master_system_locks_all" ON public.master_system_locks FOR ALL USING (public.is_master());
CREATE POLICY "master_audit_exports_all" ON public.master_audit_exports FOR ALL USING (public.is_master());
CREATE POLICY "master_rental_plans_all" ON public.master_rental_plans FOR ALL USING (public.is_master());
CREATE POLICY "master_rentable_features_all" ON public.master_rentable_features FOR ALL USING (public.is_master());
CREATE POLICY "master_rentals_all" ON public.master_rentals FOR ALL USING (public.is_master());
CREATE POLICY "master_rental_usage_logs_all" ON public.master_rental_usage_logs FOR ALL USING (public.is_master());
CREATE POLICY "master_ai_behavior_scores_all" ON public.master_ai_behavior_scores FOR ALL USING (public.is_master());
CREATE POLICY "master_risk_entity_scores_all" ON public.master_risk_entity_scores FOR ALL USING (public.is_master());
CREATE POLICY "master_ai_alerts_all" ON public.master_ai_alerts FOR ALL USING (public.is_master());
CREATE POLICY "master_system_settings_all" ON public.master_system_settings FOR ALL USING (public.is_master());

-- Super Admin read access for key tables
CREATE POLICY "super_admin_blackbox_read" ON public.blackbox_events FOR SELECT USING (public.is_super_admin());
CREATE POLICY "super_admin_live_activity_read" ON public.master_live_activity FOR SELECT USING (public.is_super_admin());
CREATE POLICY "super_admin_security_events_read" ON public.master_security_events FOR SELECT USING (public.is_super_admin());
CREATE POLICY "super_admin_ai_alerts_read" ON public.master_ai_alerts FOR SELECT USING (public.is_super_admin());
CREATE POLICY "super_admin_continents_read" ON public.master_continents FOR SELECT USING (public.is_super_admin());
CREATE POLICY "super_admin_countries_read" ON public.master_countries FOR SELECT USING (public.is_super_admin());

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_bb_events_user ON public.blackbox_events(user_id);
CREATE INDEX IF NOT EXISTS idx_bb_events_module ON public.blackbox_events(module_name);
CREATE INDEX IF NOT EXISTS idx_bb_events_type ON public.blackbox_events(event_type);
CREATE INDEX IF NOT EXISTS idx_bb_events_created ON public.blackbox_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_act_module ON public.master_live_activity(source_module);
CREATE INDEX IF NOT EXISTS idx_live_act_created ON public.master_live_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.master_approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_risk ON public.master_approvals(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_sec_events_type ON public.master_security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_sec_events_severity ON public.master_security_events(severity);
CREATE INDEX IF NOT EXISTS idx_locks_active ON public.master_system_locks(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_rentals_user ON public.master_rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.master_rentals(status);
CREATE INDEX IF NOT EXISTS idx_ai_behavior_user ON public.master_ai_behavior_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_alerts_unresolved ON public.master_ai_alerts(is_resolved) WHERE is_resolved = false;

-- AUTO-UPDATE TIMESTAMP FUNCTION
CREATE OR REPLACE FUNCTION public.master_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- TIMESTAMP TRIGGERS
DROP TRIGGER IF EXISTS update_master_continents_ts ON public.master_continents;
DROP TRIGGER IF EXISTS update_master_countries_ts ON public.master_countries;
DROP TRIGGER IF EXISTS update_master_super_admin_profiles_ts ON public.master_super_admin_profiles;
DROP TRIGGER IF EXISTS update_master_global_rules_ts ON public.master_global_rules;
DROP TRIGGER IF EXISTS update_master_approvals_ts ON public.master_approvals;
DROP TRIGGER IF EXISTS update_master_ip_watchlist_ts ON public.master_ip_watchlist;
DROP TRIGGER IF EXISTS update_master_system_locks_ts ON public.master_system_locks;
DROP TRIGGER IF EXISTS update_master_rental_plans_ts ON public.master_rental_plans;
DROP TRIGGER IF EXISTS update_master_rentable_features_ts ON public.master_rentable_features;
DROP TRIGGER IF EXISTS update_master_rentals_ts ON public.master_rentals;
DROP TRIGGER IF EXISTS update_master_ai_behavior_scores_ts ON public.master_ai_behavior_scores;
DROP TRIGGER IF EXISTS update_master_system_settings_ts ON public.master_system_settings;

CREATE TRIGGER update_master_continents_ts BEFORE UPDATE ON public.master_continents FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_countries_ts BEFORE UPDATE ON public.master_countries FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_super_admin_profiles_ts BEFORE UPDATE ON public.master_super_admin_profiles FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_global_rules_ts BEFORE UPDATE ON public.master_global_rules FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_approvals_ts BEFORE UPDATE ON public.master_approvals FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_ip_watchlist_ts BEFORE UPDATE ON public.master_ip_watchlist FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_system_locks_ts BEFORE UPDATE ON public.master_system_locks FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_rental_plans_ts BEFORE UPDATE ON public.master_rental_plans FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_rentable_features_ts BEFORE UPDATE ON public.master_rentable_features FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_rentals_ts BEFORE UPDATE ON public.master_rentals FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_ai_behavior_scores_ts BEFORE UPDATE ON public.master_ai_behavior_scores FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_system_settings_ts BEFORE UPDATE ON public.master_system_settings FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();

-- BLACKBOX LOGGING FUNCTION
CREATE OR REPLACE FUNCTION public.log_to_blackbox(
    p_event_type TEXT,
    p_module_name TEXT,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_role_name TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_geo_location TEXT DEFAULT NULL,
    p_device_fingerprint TEXT DEFAULT NULL,
    p_risk_score INTEGER DEFAULT 0,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO public.blackbox_events (
        event_type, module_name, entity_type, entity_id,
        user_id, role_name, ip_address, geo_location,
        device_fingerprint, risk_score, metadata
    ) VALUES (
        p_event_type, p_module_name, p_entity_type, p_entity_id,
        p_user_id, p_role_name, p_ip_address, p_geo_location,
        p_device_fingerprint, p_risk_score, p_metadata
    ) RETURNING id INTO v_event_id;
    
    -- Also log to live activity
    INSERT INTO public.master_live_activity (
        source_module, action_name, user_id, user_role,
        severity, payload, blackbox_event_id
    ) VALUES (
        p_module_name, p_event_type, p_user_id, p_role_name,
        CASE 
            WHEN p_risk_score >= 80 THEN 'critical'
            WHEN p_risk_score >= 60 THEN 'high'
            WHEN p_risk_score >= 40 THEN 'medium'
            ELSE 'low'
        END,
        p_metadata,
        v_event_id
    );
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- SEED: CONTINENTS
INSERT INTO public.master_continents (name, code, status) VALUES
    ('Africa', 'AF', 'active'),
    ('Asia', 'AS', 'active'),
    ('Europe', 'EU', 'active'),
    ('North America', 'NA', 'active'),
    ('South America', 'SA', 'active'),
    ('Oceania', 'OC', 'active'),
    ('Antarctica', 'AN', 'disabled')
ON CONFLICT (code) DO NOTHING;

-- SEED: RENTAL PLANS
INSERT INTO public.master_rental_plans (plan_name, plan_code, duration_type, duration_value, price) VALUES
    ('Hourly Access', 'HOURLY', 'hour', 1, 9.99),
    ('Daily Access', 'DAILY', 'day', 1, 49.99),
    ('Weekly Access', 'WEEKLY', 'week', 1, 199.99),
    ('Monthly Access', 'MONTHLY', 'month', 1, 499.99),
    ('Annual Access', 'ANNUAL', 'year', 1, 4999.99),
    ('Enterprise Unlimited', 'UNLIMITED', 'unlimited', 0, 9999.99)
ON CONFLICT (plan_code) DO NOTHING;

-- SEED: RENTABLE FEATURES
INSERT INTO public.master_rentable_features (feature_code, feature_name, module_name, is_premium, base_price) VALUES
    ('BLACKBOX_VIEW', 'Blackbox Event Viewer', 'overview', true, 99.99),
    ('CONTINENT_CONTROL', 'Continent Management', 'continents', true, 199.99),
    ('ADMIN_MANAGEMENT', 'Super Admin Control', 'super_admins', true, 299.99),
    ('RULE_ENGINE', 'Global Rules Engine', 'global_rules', true, 149.99),
    ('HIGH_RISK_APPROVAL', 'High-Risk Approvals', 'approvals', true, 249.99),
    ('SECURITY_MONITOR', 'Security Monitoring', 'security', true, 399.99),
    ('AUDIT_EXPORT', 'Audit Export Tools', 'audit', true, 199.99),
    ('SYSTEM_LOCK', 'System Lock Controls', 'system_lock', true, 499.99),
    ('AI_WATCHER', 'AI Behavior Analysis', 'ai_watcher', true, 349.99),
    ('RISK_ENGINE', 'Risk Scoring Engine', 'risk_engine', true, 299.99)
ON CONFLICT (feature_code) DO NOTHING;

-- SEED: COUNTRIES
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'Nigeria', 'NG', 'active' FROM public.master_continents c WHERE c.code = 'AF' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'South Africa', 'ZA', 'active' FROM public.master_continents c WHERE c.code = 'AF' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'Egypt', 'EG', 'active' FROM public.master_continents c WHERE c.code = 'AF' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'China', 'CN', 'active' FROM public.master_continents c WHERE c.code = 'AS' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'India', 'IN', 'active' FROM public.master_continents c WHERE c.code = 'AS' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'Japan', 'JP', 'active' FROM public.master_continents c WHERE c.code = 'AS' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'United Kingdom', 'GB', 'active' FROM public.master_continents c WHERE c.code = 'EU' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'Germany', 'DE', 'active' FROM public.master_continents c WHERE c.code = 'EU' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'France', 'FR', 'active' FROM public.master_continents c WHERE c.code = 'EU' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'United States', 'US', 'active' FROM public.master_continents c WHERE c.code = 'NA' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'Canada', 'CA', 'active' FROM public.master_continents c WHERE c.code = 'NA' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'Brazil', 'BR', 'active' FROM public.master_continents c WHERE c.code = 'SA' ON CONFLICT (iso_code) DO NOTHING;
INSERT INTO public.master_countries (continent_id, name, iso_code, status)
SELECT c.id, 'Australia', 'AU', 'active' FROM public.master_continents c WHERE c.code = 'OC' ON CONFLICT (iso_code) DO NOTHING;
