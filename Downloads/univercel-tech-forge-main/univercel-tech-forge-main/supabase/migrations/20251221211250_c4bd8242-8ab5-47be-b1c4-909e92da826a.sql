-- Create enum for AI providers
CREATE TYPE public.ai_provider AS ENUM ('openai', 'gemini', 'claude', 'lovable_ai', 'other');

-- Create enum for AI modules
CREATE TYPE public.ai_module AS ENUM ('seo', 'chatbot', 'dev_assist', 'ocr', 'image_gen', 'translation', 'analytics', 'other');

-- Create AI usage logs table
CREATE TABLE public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usage_id TEXT UNIQUE NOT NULL DEFAULT ('AI-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 8)),
    user_id UUID NOT NULL,
    user_role app_role NOT NULL,
    module ai_module NOT NULL,
    provider ai_provider NOT NULL DEFAULT 'lovable_ai',
    base_cost DECIMAL(10,4) NOT NULL DEFAULT 0,
    management_fee_percent DECIMAL(5,2) NOT NULL DEFAULT 30.00,
    management_fee DECIMAL(10,4) GENERATED ALWAYS AS (base_cost * (management_fee_percent / 100)) STORED,
    final_cost DECIMAL(10,4) GENERATED ALWAYS AS (base_cost * (1 + management_fee_percent / 100)) STORED,
    purpose TEXT,
    tokens_used INTEGER DEFAULT 0,
    request_count INTEGER DEFAULT 1,
    wallet_transaction_id UUID,
    qr_code_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    is_billed BOOLEAN DEFAULT false
);

-- Create AI billing QR codes table
CREATE TABLE public.ai_billing_qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code TEXT UNIQUE NOT NULL,
    usage_id UUID REFERENCES public.ai_usage_logs(id) ON DELETE SET NULL,
    statement_id UUID,
    qr_type TEXT NOT NULL DEFAULT 'single' CHECK (qr_type IN ('single', 'daily', 'weekly', 'monthly')),
    data_payload JSONB NOT NULL,
    base_cost_total DECIMAL(10,4) NOT NULL,
    management_fee_total DECIMAL(10,4) NOT NULL,
    final_cost_total DECIMAL(10,4) NOT NULL,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    is_valid BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_refreshed_at TIMESTAMPTZ DEFAULT now()
);

-- Create AI billing statements table
CREATE TABLE public.ai_billing_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statement_number TEXT UNIQUE NOT NULL DEFAULT ('STMT-' || to_char(now(), 'YYYYMM') || '-' || substr(gen_random_uuid()::text, 1, 6)),
    period_type TEXT NOT NULL DEFAULT 'monthly' CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    total_base_cost DECIMAL(12,4) NOT NULL DEFAULT 0,
    total_management_fee DECIMAL(12,4) NOT NULL DEFAULT 0,
    total_final_cost DECIMAL(12,4) NOT NULL DEFAULT 0,
    total_requests INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    usage_breakdown JSONB DEFAULT '{}',
    qr_code_id UUID REFERENCES public.ai_billing_qr_codes(id),
    wallet_transaction_id UUID,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- Create QR scan logs table for audit trail
CREATE TABLE public.ai_qr_scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_code_id UUID REFERENCES public.ai_billing_qr_codes(id) ON DELETE CASCADE,
    scanned_by UUID NOT NULL,
    scanner_role app_role NOT NULL,
    scan_type TEXT DEFAULT 'view' CHECK (scan_type IN ('view', 'download_png', 'download_pdf', 'screenshot_attempt', 'copy_attempt')),
    device_fingerprint TEXT,
    ip_address TEXT,
    user_agent TEXT,
    is_valid_scan BOOLEAN DEFAULT true,
    is_duplicate BOOLEAN DEFAULT false,
    watermark_applied BOOLEAN DEFAULT false,
    alert_triggered BOOLEAN DEFAULT false,
    alert_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create AI fraud detection table
CREATE TABLE public.ai_fraud_detection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    detection_type TEXT NOT NULL CHECK (detection_type IN ('duplicate_qr', 'spike_usage', 'misuse', 'screenshot', 'copy_attempt')),
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    details JSONB,
    related_usage_id UUID REFERENCES public.ai_usage_logs(id),
    related_qr_id UUID REFERENCES public.ai_billing_qr_codes(id),
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create AI efficiency scores table
CREATE TABLE public.ai_efficiency_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module ai_module NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    total_cost DECIMAL(12,4) DEFAULT 0,
    total_requests INTEGER DEFAULT 0,
    avg_cost_per_request DECIMAL(10,4) DEFAULT 0,
    efficiency_score DECIMAL(5,2) DEFAULT 0,
    comparison_to_market DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(module, period_start, period_end)
);

-- Enable RLS on all tables
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_billing_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_billing_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_qr_scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_fraud_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_efficiency_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only Super Admin, Finance Manager, and Auditor can view AI billing
CREATE POLICY "Admin roles can view AI usage logs"
ON public.ai_usage_logs FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "System can insert AI usage logs"
ON public.ai_usage_logs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin roles can view QR codes"
ON public.ai_billing_qr_codes FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "System can manage QR codes"
ON public.ai_billing_qr_codes FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin roles can view statements"
ON public.ai_billing_statements FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "System can manage statements"
ON public.ai_billing_statements FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin roles can view scan logs"
ON public.ai_qr_scan_logs FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "System can insert scan logs"
ON public.ai_qr_scan_logs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin roles can view fraud detection"
ON public.ai_fraud_detection FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "System can manage fraud detection"
ON public.ai_fraud_detection FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admin roles can view efficiency scores"
ON public.ai_efficiency_scores FOR SELECT
TO authenticated
USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "System can manage efficiency scores"
ON public.ai_efficiency_scores FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_ai_usage_logs_user ON public.ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_logs_created ON public.ai_usage_logs(created_at);
CREATE INDEX idx_ai_usage_logs_module ON public.ai_usage_logs(module);
CREATE INDEX idx_ai_qr_codes_expires ON public.ai_billing_qr_codes(expires_at);
CREATE INDEX idx_ai_scan_logs_qr ON public.ai_qr_scan_logs(qr_code_id);
CREATE INDEX idx_ai_fraud_user ON public.ai_fraud_detection(user_id);