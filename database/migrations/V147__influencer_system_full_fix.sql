-- INFLUENCER SYSTEM FULL FIX - ADDITIONAL TABLES
-- Adds missing tables for complete end-to-end influencer system

-- 1. FRAUD FLAGS TABLE
CREATE TABLE IF NOT EXISTS public.influencer_fraud_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    flag_type TEXT NOT NULL CHECK (flag_type IN ('ip_spam', 'rapid_signup', 'duplicate_email', 'device_fingerprint', 'click_fraud', 'conversion_fraud')),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    evidence JSONB NOT NULL DEFAULT '{}'::JSONB,
    blocked_until TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. AI CONTENTS TABLE
CREATE TABLE IF NOT EXISTS public.influencer_ai_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.influencer_campaign_map(id),
    content_type TEXT NOT NULL CHECK (content_type IN ('post', 'story', 'video', 'image', 'text', 'contract')),
    title TEXT NOT NULL,
    content TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    safety_score NUMERIC DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100),
    is_safe BOOLEAN DEFAULT true,
    ai_provider TEXT DEFAULT 'openai',
    prompt_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. APPROVAL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.influencer_approval_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payout_request_id UUID NOT NULL REFERENCES public.influencer_payout_requests(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'otp_sent', 'otp_verified')),
    performed_by UUID NOT NULL,
    performer_role app_role NOT NULL,
    notes TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TRACE LOGS TABLE FOR END-TO-END TRACKING
CREATE TABLE IF NOT EXISTS public.influencer_trace_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id TEXT NOT NULL,
    step TEXT NOT NULL,
    influencer_id UUID REFERENCES public.influencer_accounts(id),
    referral_id UUID REFERENCES public.influencer_referral_relationships(id),
    lead_id UUID REFERENCES public.leads(id),
    conversion_id UUID REFERENCES public.influencer_conversion_logs(id),
    commission_id UUID REFERENCES public.influencer_commission_journal(id),
    transaction_id UUID REFERENCES public.finance_transactions(id),
    status TEXT NOT NULL CHECK (status IN ('started', 'processing', 'completed', 'failed', 'retry')),
    error_message TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. COMMISSION RULES TABLE
CREATE TABLE IF NOT EXISTS public.influencer_commission_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_type TEXT NOT NULL CHECK (rule_type IN ('campaign', 'referral_l1', 'referral_l2', 'bonus')),
    platform TEXT,
    niche TEXT,
    min_amount NUMERIC DEFAULT 0,
    max_amount NUMERIC,
    rate_percentage NUMERIC NOT NULL CHECK (rate_percentage >= 0 AND rate_percentage <= 100),
    fixed_amount NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    conditions JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_influencer_fraud_flags_influencer_created ON public.influencer_fraud_flags(influencer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_fraud_flags_type_severity ON public.influencer_fraud_flags(flag_type, severity);
CREATE INDEX IF NOT EXISTS idx_influencer_ai_contents_influencer_created ON public.influencer_ai_contents(influencer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_ai_contents_campaign ON public.influencer_ai_contents(campaign_id);
CREATE INDEX IF NOT EXISTS idx_influencer_approval_logs_payout ON public.influencer_approval_logs(payout_request_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_influencer_trace_logs_trace_step ON public.influencer_trace_logs(trace_id, step);
CREATE INDEX IF NOT EXISTS idx_influencer_trace_logs_influencer ON public.influencer_trace_logs(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_commission_rules_type_active ON public.influencer_commission_rules(rule_type, is_active);

-- UNIQUE CONSTRAINTS FOR DATA INTEGRITY
ALTER TABLE public.influencer_commission_journal
ADD CONSTRAINT IF NOT EXISTS unique_influencer_reference_key UNIQUE (influencer_id, reference_key);

-- RLS POLICIES
ALTER TABLE public.influencer_fraud_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_ai_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_trace_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_commission_rules ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR FRAUD FLAGS
CREATE POLICY "Admins manage fraud flags" ON public.influencer_fraud_flags FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers view own fraud flags" ON public.influencer_fraud_flags FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

-- RLS POLICIES FOR AI CONTENTS
CREATE POLICY "Admins manage AI contents" ON public.influencer_ai_contents FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers manage own AI contents" ON public.influencer_ai_contents FOR ALL USING (influencer_id = get_influencer_id(auth.uid()));

-- RLS POLICIES FOR APPROVAL LOGS
CREATE POLICY "Admins and finance manage approval logs" ON public.influencer_approval_logs FOR ALL USING (
    can_manage_influencers(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('finance_manager', 'super_admin'))
);

-- RLS POLICIES FOR TRACE LOGS
CREATE POLICY "Admins view trace logs" ON public.influencer_trace_logs FOR SELECT USING (can_manage_influencers(auth.uid()));

-- RLS POLICIES FOR COMMISSION RULES
CREATE POLICY "Admins manage commission rules" ON public.influencer_commission_rules FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Finance view commission rules" ON public.influencer_commission_rules FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('finance_manager', 'super_admin'))
);

-- INSERT DEFAULT COMMISSION RULES
INSERT INTO public.influencer_commission_rules (rule_type, platform, rate_percentage, conditions) VALUES
('campaign', 'generic', 5.0, '{"min_conversions": 1}'::jsonb),
('referral_l1', 'generic', 10.0, '{"min_signups": 1}'::jsonb),
('referral_l2', 'generic', 5.0, '{"min_signups": 1}'::jsonb),
('bonus', 'generic', 2.0, '{"achievement_type": "milestone"}'::jsonb)
ON CONFLICT DO NOTHING;