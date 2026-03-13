
-- Add user submission and approval workflow to server_instances
ALTER TABLE public.server_instances 
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'suspended')),
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS is_user_submitted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_ai_analysis TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ai_health_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_suggestions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS protection_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS protection_level TEXT DEFAULT 'standard' CHECK (protection_level IN ('basic', 'standard', 'advanced', 'enterprise')),
ADD COLUMN IF NOT EXISTS threat_alerts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'unknown' CHECK (compliance_status IN ('unknown', 'compliant', 'non_compliant', 'review_required'));

-- Create AI server analysis logs table
CREATE TABLE IF NOT EXISTS public.server_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('health', 'security', 'performance', 'compliance', 'threat')),
    analysis_result JSONB NOT NULL DEFAULT '{}'::jsonb,
    health_score INTEGER,
    risk_score INTEGER,
    suggestions JSONB DEFAULT '[]'::jsonb,
    threats_detected JSONB DEFAULT '[]'::jsonb,
    recommendations TEXT[],
    analyzed_at TIMESTAMPTZ DEFAULT now(),
    analyzed_by TEXT DEFAULT 'ai_system',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create server protection events table
CREATE TABLE IF NOT EXISTS public.server_protection_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('threat_detected', 'attack_blocked', 'anomaly_detected', 'policy_violation', 'auto_remediation', 'manual_intervention')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT,
    source_ip TEXT,
    blocked BOOLEAN DEFAULT false,
    auto_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create server submission requests table for approval workflow
CREATE TABLE IF NOT EXISTS public.server_submission_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    user_role TEXT NOT NULL,
    server_name TEXT NOT NULL,
    server_type TEXT NOT NULL,
    ip_address TEXT,
    hostname TEXT,
    provider TEXT,
    region TEXT,
    purpose TEXT,
    expected_usage TEXT,
    compliance_requirements TEXT[],
    additional_notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'cancelled')),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    rejection_reason TEXT,
    created_server_id UUID REFERENCES public.server_instances(id),
    ai_pre_check_result JSONB,
    ai_risk_assessment JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.server_ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_protection_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_submission_requests ENABLE ROW LEVEL SECURITY;

-- RLS for server_ai_analysis
CREATE POLICY "Super admins can view all AI analysis" ON public.server_ai_analysis
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'master'))
    );

CREATE POLICY "Users can view their server analysis" ON public.server_ai_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.server_instances si 
            WHERE si.id = server_id AND si.submitted_by = auth.uid()
        )
    );

-- RLS for server_protection_events
CREATE POLICY "Super admins can manage protection events" ON public.server_protection_events
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'master'))
    );

CREATE POLICY "Users can view their server protection events" ON public.server_protection_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.server_instances si 
            WHERE si.id = server_id AND si.submitted_by = auth.uid()
        )
    );

-- RLS for server_submission_requests
CREATE POLICY "Users can submit and view own requests" ON public.server_submission_requests
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all requests" ON public.server_submission_requests
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'master'))
    );

-- Update server_instances RLS for user-submitted servers
CREATE POLICY "Users can view their submitted servers" ON public.server_instances
    FOR SELECT USING (submitted_by = auth.uid());

-- Enable realtime for protection events
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_protection_events;
