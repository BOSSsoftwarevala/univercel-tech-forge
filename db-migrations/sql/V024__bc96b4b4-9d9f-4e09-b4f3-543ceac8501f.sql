-- =============================================
-- RISK ENGINE DATABASE SCHEMA
-- =============================================

-- Dynamic Risk Scores
CREATE TABLE IF NOT EXISTS public.risk_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    current_score INTEGER NOT NULL DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
    previous_score INTEGER DEFAULT 0,
    risk_level TEXT NOT NULL DEFAULT 'normal' CHECK (risk_level IN ('normal', 'caution', 'watch', 'high', 'critical')),
    login_pattern_score INTEGER DEFAULT 0,
    device_score INTEGER DEFAULT 0,
    transaction_score INTEGER DEFAULT 0,
    behavior_score INTEGER DEFAULT 0,
    commission_score INTEGER DEFAULT 0,
    lead_score INTEGER DEFAULT 0,
    factors JSONB DEFAULT '[]'::jsonb,
    last_calculated_at TIMESTAMPTZ DEFAULT now(),
    auto_action_taken TEXT,
    escalation_level INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Reputation Scores for entities
CREATE TABLE IF NOT EXISTS public.reputation_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'franchise', 'reseller', 'influencer', 'developer', 'store')),
    entity_id UUID NOT NULL,
    star_rating DECIMAL(2,1) DEFAULT 5.0 CHECK (star_rating >= 0 AND star_rating <= 5),
    trust_index INTEGER DEFAULT 100 CHECK (trust_index >= 0 AND trust_index <= 100),
    performance_rating INTEGER DEFAULT 100,
    complaint_ratio DECIMAL(5,4) DEFAULT 0,
    delivery_accuracy DECIMAL(5,2) DEFAULT 100,
    total_transactions INTEGER DEFAULT 0,
    successful_transactions INTEGER DEFAULT 0,
    failed_transactions INTEGER DEFAULT 0,
    fraud_incidents INTEGER DEFAULT 0,
    payout_priority TEXT DEFAULT 'normal' CHECK (payout_priority IN ('low', 'normal', 'high', 'priority')),
    wallet_privilege_level TEXT DEFAULT 'standard' CHECK (wallet_privilege_level IN ('restricted', 'limited', 'standard', 'premium')),
    lead_assignment_priority TEXT DEFAULT 'normal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(entity_type, entity_id)
);

-- Risk Events Log
CREATE TABLE IF NOT EXISTS public.risk_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL CHECK (event_category IN ('login', 'transaction', 'behavior', 'device', 'lead', 'commission', 'demo', 'code', 'communication')),
    severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    risk_contribution INTEGER DEFAULT 0,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    device_fingerprint TEXT,
    geo_location TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Risk Escalations
CREATE TABLE IF NOT EXISTS public.risk_escalations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    escalation_level INTEGER NOT NULL CHECK (escalation_level >= 1 AND escalation_level <= 4),
    trigger_event_id UUID REFERENCES public.risk_events(id),
    trigger_reason TEXT NOT NULL,
    risk_score_at_time INTEGER,
    action_taken TEXT NOT NULL,
    action_details JSONB DEFAULT '{}'::jsonb,
    auto_triggered BOOLEAN DEFAULT true,
    triggered_by UUID,
    reversed BOOLEAN DEFAULT false,
    reversed_at TIMESTAMPTZ,
    reversed_by UUID,
    reversal_reason TEXT,
    notification_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Risk Watchlist
CREATE TABLE IF NOT EXISTS public.risk_watchlist (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    watchlist_type TEXT NOT NULL CHECK (watchlist_type IN ('monitor', 'restrict', 'whitelist', 'blacklist')),
    reason TEXT NOT NULL,
    added_by UUID,
    auto_added BOOLEAN DEFAULT false,
    trigger_threshold INTEGER,
    current_status TEXT DEFAULT 'active' CHECK (current_status IN ('active', 'expired', 'removed')),
    expires_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Behavior Patterns (learned patterns)
CREATE TABLE IF NOT EXISTS public.behavior_patterns (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    pattern_type TEXT NOT NULL,
    baseline_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    current_data JSONB DEFAULT '{}'::jsonb,
    deviation_score DECIMAL(5,2) DEFAULT 0,
    samples_count INTEGER DEFAULT 0,
    last_sample_at TIMESTAMPTZ,
    is_anomalous BOOLEAN DEFAULT false,
    anomaly_detected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, pattern_type)
);

-- Risk Audit Trail
CREATE TABLE IF NOT EXISTS public.risk_audit_trail (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    risk_score_before INTEGER,
    risk_score_after INTEGER,
    trigger_type TEXT,
    reasoning JSONB DEFAULT '{}'::jsonb,
    calculation_details JSONB DEFAULT '{}'::jsonb,
    escalation_trace JSONB DEFAULT '[]'::jsonb,
    actor_id UUID,
    actor_role TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Real-time Risk Alerts
CREATE TABLE IF NOT EXISTS public.risk_alerts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    risk_score INTEGER,
    risk_level TEXT,
    indicators JSONB DEFAULT '[]'::jsonb,
    recommended_action TEXT,
    auto_action_available BOOLEAN DEFAULT false,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID,
    action_taken TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for risk_scores
CREATE POLICY "Users can view own risk score" ON public.risk_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all risk scores" ON public.risk_scores FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance', 'finance_manager'))
);
CREATE POLICY "System can manage risk scores" ON public.risk_scores FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for reputation_scores
CREATE POLICY "Public view reputation" ON public.reputation_scores FOR SELECT USING (true);
CREATE POLICY "Admins manage reputation" ON public.reputation_scores FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance'))
);

-- RLS Policies for risk_events
CREATE POLICY "Users can view own risk events" ON public.risk_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all risk events" ON public.risk_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance', 'finance_manager'))
);
CREATE POLICY "System can manage risk events" ON public.risk_events FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for risk_escalations
CREATE POLICY "Users can view own escalations" ON public.risk_escalations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage escalations" ON public.risk_escalations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance'))
);

-- RLS Policies for risk_watchlist
CREATE POLICY "Admins can manage watchlist" ON public.risk_watchlist FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance'))
);

-- RLS Policies for behavior_patterns
CREATE POLICY "System can manage behavior patterns" ON public.behavior_patterns FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for risk_audit_trail
CREATE POLICY "Admins can view audit trail" ON public.risk_audit_trail FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance'))
);
CREATE POLICY "System can insert audit trail" ON public.risk_audit_trail FOR INSERT WITH CHECK (true);

-- RLS Policies for risk_alerts
CREATE POLICY "Admins can manage alerts" ON public.risk_alerts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance', 'finance_manager'))
) WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'legal_compliance', 'finance_manager'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_risk_scores_user ON public.risk_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_level ON public.risk_scores(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_scores_score ON public.risk_scores(current_score DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_entity ON public.reputation_scores(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_events_user ON public.risk_events(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_events_category ON public.risk_events(event_category);
CREATE INDEX IF NOT EXISTS idx_risk_events_created ON public.risk_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_escalations_user ON public.risk_escalations(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_escalations_level ON public.risk_escalations(escalation_level);
CREATE INDEX IF NOT EXISTS idx_risk_watchlist_user ON public.risk_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_watchlist_type ON public.risk_watchlist(watchlist_type);
CREATE INDEX IF NOT EXISTS idx_behavior_patterns_user ON public.behavior_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_active ON public.risk_alerts(is_active, severity);

-- Function to calculate risk level from score
CREATE OR REPLACE FUNCTION public.get_risk_level(score INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN CASE
        WHEN score <= 20 THEN 'normal'
        WHEN score <= 40 THEN 'caution'
        WHEN score <= 60 THEN 'watch'
        WHEN score <= 80 THEN 'high'
        ELSE 'critical'
    END;
END;
$$;

-- Function to update risk score
CREATE OR REPLACE FUNCTION public.update_risk_score(
    p_user_id UUID,
    p_login_score INTEGER DEFAULT NULL,
    p_device_score INTEGER DEFAULT NULL,
    p_transaction_score INTEGER DEFAULT NULL,
    p_behavior_score INTEGER DEFAULT NULL,
    p_commission_score INTEGER DEFAULT NULL,
    p_lead_score INTEGER DEFAULT NULL,
    p_factors JSONB DEFAULT NULL
)
RETURNS public.risk_scores
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result public.risk_scores;
BEGIN
    INSERT INTO public.risk_scores (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    UPDATE public.risk_scores
    SET
        previous_score = current_score,
        login_pattern_score = COALESCE(p_login_score, login_pattern_score),
        device_score = COALESCE(p_device_score, device_score),
        transaction_score = COALESCE(p_transaction_score, transaction_score),
        behavior_score = COALESCE(p_behavior_score, behavior_score),
        commission_score = COALESCE(p_commission_score, commission_score),
        lead_score = COALESCE(p_lead_score, lead_score),
        factors = COALESCE(p_factors, factors),
        last_calculated_at = now(),
        updated_at = now()
    WHERE user_id = p_user_id;

    UPDATE public.risk_scores
    SET
        current_score = LEAST(100, GREATEST(0, 
            COALESCE(login_pattern_score, 0) * 0.15 +
            COALESCE(device_score, 0) * 0.20 +
            COALESCE(transaction_score, 0) * 0.25 +
            COALESCE(behavior_score, 0) * 0.15 +
            COALESCE(commission_score, 0) * 0.15 +
            COALESCE(lead_score, 0) * 0.10
        )::INTEGER),
        risk_level = public.get_risk_level(LEAST(100, GREATEST(0, 
            COALESCE(login_pattern_score, 0) * 0.15 +
            COALESCE(device_score, 0) * 0.20 +
            COALESCE(transaction_score, 0) * 0.25 +
            COALESCE(behavior_score, 0) * 0.15 +
            COALESCE(commission_score, 0) * 0.15 +
            COALESCE(lead_score, 0) * 0.10
        )::INTEGER))
    WHERE user_id = p_user_id
    RETURNING * INTO v_result;

    RETURN v_result;
END;
$$;

-- Function to log risk audit
CREATE OR REPLACE FUNCTION public.log_risk_audit(
    p_user_id UUID,
    p_action TEXT,
    p_score_before INTEGER,
    p_score_after INTEGER,
    p_trigger_type TEXT,
    p_reasoning JSONB DEFAULT '{}'::jsonb,
    p_calculation JSONB DEFAULT '{}'::jsonb,
    p_actor_id UUID DEFAULT NULL,
    p_actor_role TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.risk_audit_trail (
        user_id, action, risk_score_before, risk_score_after,
        trigger_type, reasoning, calculation_details,
        actor_id, actor_role
    ) VALUES (
        p_user_id, p_action, p_score_before, p_score_after,
        p_trigger_type, p_reasoning, p_calculation,
        p_actor_id, p_actor_role
    ) RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$;

-- Enable realtime for risk alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.risk_alerts;