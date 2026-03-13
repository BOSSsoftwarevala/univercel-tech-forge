-- =============================================
-- COMPREHENSIVE GLOBAL COMPLIANCE FRAMEWORK (Fixed)
-- =============================================

-- User Consent Management (GDPR, CCPA, PDPA, POPIA, NDPR)
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    consent_type TEXT NOT NULL,
    consent_version TEXT NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT false,
    granted_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    ip_address TEXT,
    user_agent TEXT,
    region TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, consent_type, consent_version)
);

-- Data Residency Configuration
CREATE TABLE IF NOT EXISTS public.data_residency_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code TEXT NOT NULL UNIQUE,
    region_name TEXT NOT NULL,
    storage_location TEXT NOT NULL,
    applicable_regulations TEXT[] DEFAULT '{}',
    cross_border_allowed BOOLEAN DEFAULT false,
    encryption_required BOOLEAN DEFAULT true,
    consent_required_for_transfer BOOLEAN DEFAULT true,
    data_retention_days INTEGER DEFAULT 1095,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Regional Tax Rules
CREATE TABLE IF NOT EXISTS public.regional_tax_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_code TEXT NOT NULL,
    state_code TEXT,
    tax_name TEXT NOT NULL,
    tax_rate DECIMAL(5,4) NOT NULL,
    tax_id_label TEXT,
    is_compound BOOLEAN DEFAULT false,
    applies_to TEXT[] DEFAULT '{}',
    exemption_categories TEXT[] DEFAULT '{}',
    effective_from DATE NOT NULL,
    effective_until DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Data Export/Deletion Requests
CREATE TABLE IF NOT EXISTS public.data_subject_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    request_type TEXT NOT NULL,
    regulation TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    requested_data_categories TEXT[] DEFAULT '{}',
    verification_method TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID,
    processed_at TIMESTAMP WITH TIME ZONE,
    export_file_url TEXT,
    rejection_reason TEXT,
    notes TEXT,
    deadline_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Refund & Dispute Requests
CREATE TABLE IF NOT EXISTS public.refund_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transaction_id UUID,
    sale_id UUID,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    reason TEXT NOT NULL,
    reason_category TEXT,
    status TEXT DEFAULT 'pending',
    ai_recommendation TEXT,
    ai_confidence_score DECIMAL(3,2),
    fraud_score DECIMAL(3,2),
    reviewed_by UUID,
    review_notes TEXT,
    approved_amount DECIMAL(12,2),
    chargeback_reference TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wallet Compliance Checks (AML/KYC)
CREATE TABLE IF NOT EXISTS public.wallet_compliance_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL,
    user_id UUID NOT NULL,
    check_type TEXT NOT NULL,
    risk_level TEXT DEFAULT 'low',
    status TEXT DEFAULT 'pending',
    details JSONB DEFAULT '{}',
    triggered_rules TEXT[],
    action_taken TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    report_filed BOOLEAN DEFAULT false,
    report_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suspicious Activity Reports (SAR)
CREATE TABLE IF NOT EXISTS public.suspicious_activity_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    wallet_id UUID,
    transaction_ids UUID[],
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_indicators TEXT[],
    total_amount DECIMAL(14,2),
    status TEXT DEFAULT 'draft',
    filed_by UUID,
    filed_at TIMESTAMP WITH TIME ZONE,
    regulatory_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- License Key Compliance
CREATE TABLE IF NOT EXISTS public.license_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key TEXT NOT NULL UNIQUE,
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    domain TEXT,
    allowed_domains TEXT[] DEFAULT '{}',
    max_activations INTEGER DEFAULT 1,
    current_activations INTEGER DEFAULT 0,
    is_transferable BOOLEAN DEFAULT false,
    no_resale BOOLEAN DEFAULT true,
    watermark_required BOOLEAN DEFAULT true,
    clone_detection_enabled BOOLEAN DEFAULT true,
    last_validated_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Compliance Audit Trail (Immutable)
CREATE TABLE IF NOT EXISTS public.compliance_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    actor_id UUID,
    actor_role app_role,
    ip_address TEXT,
    geo_location TEXT,
    user_agent TEXT,
    old_values JSONB,
    new_values JSONB,
    compliance_tags TEXT[],
    signature TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Developer Fair Labor Compliance
CREATE TABLE IF NOT EXISTS public.developer_work_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID NOT NULL,
    date DATE NOT NULL,
    total_work_minutes INTEGER DEFAULT 0,
    total_break_minutes INTEGER DEFAULT 0,
    tasks_assigned INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    voluntary_acceptance_rate DECIMAL(3,2),
    late_penalties_applied INTEGER DEFAULT 0,
    overtime_minutes INTEGER DEFAULT 0,
    overtime_consent_given BOOLEAN DEFAULT false,
    compliance_status TEXT DEFAULT 'compliant',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(developer_id, date)
);

-- Cookie Consent Tracking
CREATE TABLE IF NOT EXISTS public.cookie_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID,
    essential BOOLEAN DEFAULT true,
    analytics BOOLEAN DEFAULT false,
    marketing BOOLEAN DEFAULT false,
    third_party BOOLEAN DEFAULT false,
    preferences BOOLEAN DEFAULT false,
    ip_address TEXT,
    region TEXT,
    consent_given_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    consent_updated_at TIMESTAMP WITH TIME ZONE
);

-- Regional Compliance Requirements
CREATE TABLE IF NOT EXISTS public.regional_compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code TEXT NOT NULL,
    requirement_type TEXT NOT NULL,
    requirement_name TEXT NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    enforcement_level TEXT DEFAULT 'strict',
    penalty_info TEXT,
    documentation_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(region_code, requirement_type, requirement_name)
);

-- Accessibility Compliance Tracking
CREATE TABLE IF NOT EXISTS public.accessibility_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_url TEXT NOT NULL,
    wcag_level TEXT DEFAULT 'AA',
    last_audit_date DATE,
    issues_found INTEGER DEFAULT 0,
    issues_resolved INTEGER DEFAULT 0,
    color_contrast_pass BOOLEAN,
    screen_reader_pass BOOLEAN,
    keyboard_nav_pass BOOLEAN,
    alt_text_pass BOOLEAN,
    language_support TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    auditor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_residency_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspicious_activity_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policies using correct role names
CREATE POLICY "Users manage own consents" ON public.user_consents
    FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins view all consents" ON public.user_consents
    FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));

CREATE POLICY "Anyone can view residency config" ON public.data_residency_config
    FOR SELECT USING (true);
CREATE POLICY "Admins manage residency config" ON public.data_residency_config
    FOR ALL USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Anyone can view tax rules" ON public.regional_tax_rules
    FOR SELECT USING (true);
CREATE POLICY "Finance manages tax rules" ON public.regional_tax_rules
    FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'finance_manager'));

CREATE POLICY "Users manage own data requests" ON public.data_subject_requests
    FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Legal processes data requests" ON public.data_subject_requests
    FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));

CREATE POLICY "Users view own refunds" ON public.refund_requests
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create refunds" ON public.refund_requests
    FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Finance manages refunds" ON public.refund_requests
    FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'finance_manager'));

CREATE POLICY "Finance views compliance checks" ON public.wallet_compliance_checks
    FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'finance_manager') OR has_role(auth.uid(), 'legal_compliance'));
CREATE POLICY "System inserts compliance checks" ON public.wallet_compliance_checks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Legal manages SAR" ON public.suspicious_activity_reports
    FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));

CREATE POLICY "Users view own licenses" ON public.license_compliance
    FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins manage licenses" ON public.license_compliance
    FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "System inserts audit trail" ON public.compliance_audit_trail
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Legal views audit trail" ON public.compliance_audit_trail
    FOR SELECT USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));

CREATE POLICY "Developers view own logs" ON public.developer_work_logs
    FOR SELECT USING (developer_id = get_developer_id(auth.uid()));
CREATE POLICY "HR manages work logs" ON public.developer_work_logs
    FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'hr_manager'));

CREATE POLICY "Anyone can insert cookie consent" ON public.cookie_consents
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own cookie consent" ON public.cookie_consents
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can view compliance requirements" ON public.regional_compliance_requirements
    FOR SELECT USING (true);
CREATE POLICY "Legal manages requirements" ON public.regional_compliance_requirements
    FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'legal_compliance'));

CREATE POLICY "Anyone can view accessibility status" ON public.accessibility_compliance
    FOR SELECT USING (true);
CREATE POLICY "Admins manage accessibility" ON public.accessibility_compliance
    FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_consents_user ON public.user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON public.user_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_data_subject_requests_user ON public.data_subject_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_subject_requests_status ON public.data_subject_requests(status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_user ON public.refund_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON public.refund_requests(status);
CREATE INDEX IF NOT EXISTS idx_wallet_compliance_user ON public.wallet_compliance_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_compliance_risk ON public.wallet_compliance_checks(risk_level);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_entity ON public.compliance_audit_trail(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_actor ON public.compliance_audit_trail(actor_id);
CREATE INDEX IF NOT EXISTS idx_developer_work_logs_dev ON public.developer_work_logs(developer_id);
CREATE INDEX IF NOT EXISTS idx_license_compliance_product ON public.license_compliance(product_id);

-- Function to log compliance audit
CREATE OR REPLACE FUNCTION log_compliance_audit(
    p_entity_type TEXT,
    p_entity_id UUID,
    p_action TEXT,
    p_actor_id UUID,
    p_actor_role app_role,
    p_ip_address TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_compliance_tags TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
    v_signature TEXT;
BEGIN
    v_signature := encode(sha256((p_entity_type || p_entity_id::text || p_action || COALESCE(p_actor_id::text, '') || now()::text)::bytea), 'hex');
    
    INSERT INTO compliance_audit_trail (
        entity_type, entity_id, action, actor_id, actor_role,
        ip_address, old_values, new_values, compliance_tags, signature
    ) VALUES (
        p_entity_type, p_entity_id, p_action, p_actor_id, p_actor_role,
        p_ip_address, p_old_values, p_new_values, p_compliance_tags, v_signature
    ) RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$;

-- Function to calculate tax
CREATE OR REPLACE FUNCTION calculate_regional_tax(
    p_country_code TEXT,
    p_state_code TEXT,
    p_amount DECIMAL,
    p_category TEXT DEFAULT 'products'
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_tax_rate DECIMAL := 0;
    v_tax_name TEXT := 'Tax';
    v_tax_amount DECIMAL := 0;
BEGIN
    SELECT tax_rate, tax_name INTO v_tax_rate, v_tax_name
    FROM regional_tax_rules
    WHERE country_code = p_country_code
    AND (state_code IS NULL OR state_code = p_state_code)
    AND p_category = ANY(applies_to)
    AND is_active = true
    AND effective_from <= CURRENT_DATE
    AND (effective_until IS NULL OR effective_until >= CURRENT_DATE)
    ORDER BY state_code NULLS LAST
    LIMIT 1;
    
    v_tax_amount := ROUND(p_amount * COALESCE(v_tax_rate, 0), 2);
    
    RETURN jsonb_build_object(
        'tax_name', COALESCE(v_tax_name, 'Tax'),
        'tax_rate', COALESCE(v_tax_rate, 0),
        'tax_amount', v_tax_amount,
        'subtotal', p_amount,
        'total', p_amount + v_tax_amount
    );
END;
$$;

-- Insert default data
INSERT INTO data_residency_config (region_code, region_name, storage_location, applicable_regulations, cross_border_allowed) VALUES
('IN', 'India', 'india', ARRAY['DPDP', 'IT Act'], true),
('EU', 'European Union', 'eu', ARRAY['GDPR'], false),
('US', 'United States', 'us', ARRAY['CCPA', 'HIPAA'], true),
('ZA', 'South Africa', 'uae', ARRAY['POPIA'], true),
('NG', 'Nigeria', 'uae', ARRAY['NDPR'], true),
('KE', 'Kenya', 'uae', ARRAY['DPA Kenya'], true),
('AE', 'UAE', 'uae', ARRAY['PDPL'], true),
('GB', 'United Kingdom', 'eu', ARRAY['UK GDPR'], false)
ON CONFLICT (region_code) DO NOTHING;

INSERT INTO regional_tax_rules (country_code, state_code, tax_name, tax_rate, tax_id_label, applies_to, effective_from) VALUES
('IN', NULL, 'GST', 0.18, 'GSTIN', ARRAY['products', 'services', 'subscriptions'], '2017-07-01'),
('US', 'CA', 'Sales Tax', 0.0725, 'Tax ID', ARRAY['products'], '2020-01-01'),
('US', 'TX', 'Sales Tax', 0.0625, 'Tax ID', ARRAY['products'], '2020-01-01'),
('GB', NULL, 'VAT', 0.20, 'VAT Number', ARRAY['products', 'services', 'subscriptions'], '2020-01-01'),
('DE', NULL, 'VAT', 0.19, 'VAT Number', ARRAY['products', 'services', 'subscriptions'], '2020-01-01'),
('FR', NULL, 'VAT', 0.20, 'VAT Number', ARRAY['products', 'services', 'subscriptions'], '2020-01-01'),
('AE', NULL, 'VAT', 0.05, 'TRN', ARRAY['products', 'services', 'subscriptions'], '2018-01-01'),
('ZA', NULL, 'VAT', 0.15, 'VAT Number', ARRAY['products', 'services', 'subscriptions'], '2020-01-01')
ON CONFLICT DO NOTHING;

INSERT INTO regional_compliance_requirements (region_code, requirement_type, requirement_name, description, is_mandatory) VALUES
('EU', 'consent', 'Explicit Consent', 'Must obtain explicit consent before processing personal data', true),
('EU', 'disclosure', 'Privacy Notice', 'Must provide clear privacy notice at data collection point', true),
('EU', 'retention', 'Data Minimization', 'Only retain data for as long as necessary', true),
('EU', 'notification', 'Breach Notification', 'Must notify authority within 72 hours of data breach', true),
('US', 'consent', 'Opt-Out Right', 'Must allow users to opt-out of data sale (CCPA)', true),
('IN', 'consent', 'Informed Consent', 'Must obtain consent with clear purpose disclosure', true),
('IN', 'disclosure', 'Data Fiduciary Notice', 'Must disclose data processing purposes clearly', true),
('ZA', 'consent', 'Lawful Processing', 'Must have lawful basis for processing personal info', true),
('NG', 'consent', 'Consent Requirement', 'Must obtain consent for personal data processing', true)
ON CONFLICT DO NOTHING;