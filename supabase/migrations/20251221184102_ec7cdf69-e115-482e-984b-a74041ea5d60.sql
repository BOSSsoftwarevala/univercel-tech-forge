
-- SOFTWARE VALA - Remaining Enterprise Tables

-- HR & HIRING
CREATE TABLE IF NOT EXISTS public.hr_applicants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position TEXT NOT NULL,
    full_name TEXT NOT NULL,
    masked_email TEXT,
    masked_phone TEXT,
    resume_path TEXT,
    portfolio_url TEXT,
    experience_years INTEGER,
    skills_json JSONB,
    source TEXT,
    status TEXT DEFAULT 'new',
    screening_score INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hr_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id UUID NOT NULL REFERENCES public.hr_applicants(id),
    interviewer_id UUID NOT NULL,
    interview_type TEXT DEFAULT 'technical',
    scheduled_at TIMESTAMPTZ NOT NULL,
    conducted_at TIMESTAMPTZ,
    score INTEGER,
    feedback TEXT,
    recommendation TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- LEGAL & COMPLIANCE
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_type TEXT NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT,
    version TEXT,
    region TEXT[],
    effective_date DATE,
    requires_signature BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    document_id UUID NOT NULL REFERENCES public.legal_documents(id),
    signed_at TIMESTAMPTZ,
    ip_address TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compliance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    compliance_type TEXT NOT NULL,
    issue TEXT,
    severity TEXT DEFAULT 'low',
    resolution TEXT,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- SECURITY
CREATE TABLE IF NOT EXISTS public.frozen_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    freeze_reason TEXT NOT NULL,
    frozen_by UUID,
    freeze_date TIMESTAMPTZ DEFAULT now(),
    unfreeze_date TIMESTAMPTZ,
    status TEXT DEFAULT 'frozen'
);

CREATE TABLE IF NOT EXISTS public.suspicious_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    reason TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    details JSONB,
    flagged_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    status TEXT DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS public.ip_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ip_address TEXT NOT NULL,
    label TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, ip_address)
);

CREATE TABLE IF NOT EXISTS public.role_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role app_role NOT NULL UNIQUE,
    max_devices INTEGER DEFAULT 3,
    max_sessions INTEGER DEFAULT 2,
    ip_restriction BOOLEAN DEFAULT false,
    geo_restriction BOOLEAN DEFAULT false,
    allowed_countries TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PRODUCT & FEATURES
CREATE TABLE IF NOT EXISTS public.product_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID,
    name TEXT NOT NULL,
    description TEXT,
    is_core BOOLEAN DEFAULT true,
    additional_price NUMERIC(15,2) DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.product_modules(id),
    flag_key TEXT NOT NULL UNIQUE,
    flag_name TEXT,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    rollout_percentage INTEGER DEFAULT 0,
    target_roles app_role[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- LOCALIZATION
CREATE TABLE IF NOT EXISTS public.localization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lang_code TEXT NOT NULL,
    content_key TEXT NOT NULL,
    content_value TEXT NOT NULL,
    context TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(lang_code, content_key)
);

-- SEO (Enhanced)
CREATE TABLE IF NOT EXISTS public.seo_meta (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    keywords TEXT[],
    og_image TEXT,
    canonical_url TEXT,
    robots TEXT DEFAULT 'index, follow',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_id UUID REFERENCES public.seo_keywords(id),
    position INTEGER,
    impressions INTEGER,
    clicks INTEGER,
    report_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- PROMO ASSETS
CREATE TABLE IF NOT EXISTS public.promo_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID,
    asset_type TEXT,
    file_path TEXT NOT NULL,
    file_name TEXT,
    usage_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- CLIENT FEEDBACK
CREATE TABLE IF NOT EXISTS public.client_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    feedback_type TEXT DEFAULT 'general',
    rating INTEGER,
    csat_score INTEGER,
    nps_score INTEGER,
    feedback_text TEXT,
    category TEXT,
    status TEXT DEFAULT 'new',
    responded_by UUID,
    response_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- VOICE LOGS
CREATE TABLE IF NOT EXISTS public.voice_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.chat_rooms(id),
    sender_id UUID NOT NULL,
    transcript TEXT,
    audio_path TEXT,
    duration_seconds INTEGER,
    language TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TASK DELIVERIES
CREATE TABLE IF NOT EXISTS public.task_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    developer_id UUID NOT NULL,
    delivery_type TEXT DEFAULT 'final',
    files_json JSONB,
    commit_url TEXT,
    notes TEXT,
    delivered_at TIMESTAMPTZ DEFAULT now(),
    reviewed_by UUID,
    review_status TEXT DEFAULT 'pending',
    quality_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- LEAD HISTORY
CREATE TABLE IF NOT EXISTS public.lead_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    updated_by UUID,
    updated_by_role app_role,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hr_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frozen_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspicious_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_history ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "hr_manage" ON public.hr_applicants FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'hr_manager'));
CREATE POLICY "hr_interviews" ON public.hr_interviews FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'hr_manager'));
CREATE POLICY "legal_view" ON public.legal_documents FOR SELECT USING (status = 'active');
CREATE POLICY "legal_manage" ON public.legal_documents FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));
CREATE POLICY "agree_own" ON public.user_agreements FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "agree_sign" ON public.user_agreements FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "agree_legal" ON public.user_agreements FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));
CREATE POLICY "comply_legal" ON public.compliance_logs FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));
CREATE POLICY "frozen_admin" ON public.frozen_accounts FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "suspicious_admin" ON public.suspicious_activity FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "ip_own" ON public.ip_whitelist FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "ip_admin" ON public.ip_whitelist FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "restrict_view" ON public.role_restrictions FOR SELECT USING (true);
CREATE POLICY "restrict_admin" ON public.role_restrictions FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "module_view" ON public.product_modules FOR SELECT USING (true);
CREATE POLICY "module_admin" ON public.product_modules FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "flag_view" ON public.feature_flags FOR SELECT USING (enabled = true);
CREATE POLICY "flag_admin" ON public.feature_flags FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "locale_view" ON public.localization FOR SELECT USING (true);
CREATE POLICY "locale_admin" ON public.localization FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "seo_meta_manage" ON public.seo_meta FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'seo_manager'));
CREATE POLICY "seo_report_manage" ON public.seo_reports FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'seo_manager'));
CREATE POLICY "promo_manage" ON public.promo_assets FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'marketing_manager'));
CREATE POLICY "feedback_own" ON public.client_feedback FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "feedback_insert" ON public.client_feedback FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "feedback_cs" ON public.client_feedback FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'client_success'));
CREATE POLICY "voice_admin" ON public.voice_logs FOR SELECT USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "voice_insert" ON public.voice_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "delivery_dev" ON public.task_deliveries FOR ALL USING (developer_id = get_developer_id(auth.uid()));
CREATE POLICY "delivery_manage" ON public.task_deliveries FOR ALL USING (can_manage_developers(auth.uid()));
CREATE POLICY "lead_hist_view" ON public.lead_history FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'lead_manager'));
CREATE POLICY "lead_hist_insert" ON public.lead_history FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hr_status ON public.hr_applicants(status);
CREATE INDEX IF NOT EXISTS idx_legal_type ON public.legal_documents(doc_type);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.client_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_hist ON public.lead_history(lead_id);
