-- Lead source enum
CREATE TYPE public.lead_source_type AS ENUM ('website', 'demo', 'influencer', 'reseller', 'referral', 'social', 'direct', 'other');

-- Lead status enum
CREATE TYPE public.lead_status_type AS ENUM ('new', 'assigned', 'contacted', 'follow_up', 'qualified', 'negotiation', 'closed_won', 'closed_lost');

-- Lead priority enum
CREATE TYPE public.lead_priority AS ENUM ('hot', 'warm', 'cold');

-- Lead industry enum
CREATE TYPE public.lead_industry AS ENUM ('retail', 'healthcare', 'finance', 'education', 'real_estate', 'manufacturing', 'hospitality', 'logistics', 'technology', 'other');

-- Main leads table
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    masked_email TEXT,
    masked_phone TEXT,
    company TEXT,
    industry lead_industry DEFAULT 'other',
    source lead_source_type NOT NULL DEFAULT 'website',
    source_reference_id UUID,
    status lead_status_type NOT NULL DEFAULT 'new',
    priority lead_priority DEFAULT 'warm',
    region TEXT,
    city TEXT,
    country TEXT DEFAULT 'India',
    requirements TEXT,
    budget_range TEXT,
    ai_score INTEGER DEFAULT 50,
    conversion_probability DECIMAL(5,2) DEFAULT 50.00,
    is_duplicate BOOLEAN DEFAULT false,
    duplicate_of UUID REFERENCES public.leads(id),
    assigned_to UUID REFERENCES auth.users(id),
    assigned_role app_role,
    assigned_at TIMESTAMP WITH TIME ZONE,
    last_contact_at TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    closed_reason TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead assignment history
CREATE TABLE public.lead_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES auth.users(id) NOT NULL,
    assigned_by UUID REFERENCES auth.users(id) NOT NULL,
    assigned_role app_role NOT NULL,
    reason TEXT,
    auto_assigned BOOLEAN DEFAULT false,
    assignment_score INTEGER,
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead activity logs (immutable - no update/delete)
CREATE TABLE public.lead_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    action_type TEXT NOT NULL,
    details TEXT,
    old_value TEXT,
    new_value TEXT,
    performed_by UUID REFERENCES auth.users(id),
    performer_role app_role,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead scores from AI
CREATE TABLE public.lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    score_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    confidence DECIMAL(5,2),
    factors JSONB,
    model_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead sources tracking
CREATE TABLE public.lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type lead_source_type NOT NULL,
    reference_id UUID,
    referrer_name TEXT,
    referrer_role app_role,
    campaign_id TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    is_active BOOLEAN DEFAULT true,
    total_leads INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead escalations
CREATE TABLE public.lead_escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    escalation_level INTEGER DEFAULT 1,
    reason TEXT NOT NULL,
    escalated_from UUID REFERENCES auth.users(id),
    escalated_to UUID REFERENCES auth.users(id),
    escalated_to_role app_role,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    auto_escalated BOOLEAN DEFAULT false,
    idle_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead follow-ups
CREATE TABLE public.lead_follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    follow_up_type TEXT NOT NULL,
    notes TEXT,
    ai_suggested_message TEXT,
    assigned_to UUID REFERENCES auth.users(id) NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    outcome TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead alerts for buzzer system
CREATE TABLE public.lead_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT DEFAULT 'info',
    is_active BOOLEAN DEFAULT true,
    requires_action BOOLEAN DEFAULT true,
    target_users UUID[],
    target_roles app_role[],
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    action_taken TEXT,
    auto_escalate_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_alerts ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.can_manage_leads(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'demo_manager')) $$;

CREATE OR REPLACE FUNCTION public.can_view_leads(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'demo_manager', 'franchise', 'reseller')) $$;

-- RLS Policies
CREATE POLICY "Managers full access to leads" ON public.leads FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "Users view assigned leads" ON public.leads FOR SELECT TO authenticated USING (assigned_to = auth.uid() OR public.can_view_leads(auth.uid()));

CREATE POLICY "Managers manage assignments" ON public.lead_assignments FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "Users view own assignments" ON public.lead_assignments FOR SELECT TO authenticated USING (assigned_to = auth.uid());

CREATE POLICY "View logs" ON public.lead_logs FOR SELECT TO authenticated USING (public.can_view_leads(auth.uid()));
CREATE POLICY "Insert logs" ON public.lead_logs FOR INSERT TO authenticated WITH CHECK (public.can_view_leads(auth.uid()));

CREATE POLICY "View scores" ON public.lead_scores FOR SELECT TO authenticated USING (public.can_view_leads(auth.uid()));
CREATE POLICY "Manage scores" ON public.lead_scores FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));

CREATE POLICY "Manage sources" ON public.lead_sources FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "View sources" ON public.lead_sources FOR SELECT TO authenticated USING (public.can_view_leads(auth.uid()));

CREATE POLICY "Manage escalations" ON public.lead_escalations FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "View own escalations" ON public.lead_escalations FOR SELECT TO authenticated USING (escalated_to = auth.uid() OR escalated_from = auth.uid());

CREATE POLICY "Manage follow-ups" ON public.lead_follow_ups FOR ALL TO authenticated USING (assigned_to = auth.uid() OR public.can_manage_leads(auth.uid()));

CREATE POLICY "Manage alerts" ON public.lead_alerts FOR ALL TO authenticated USING (public.can_manage_leads(auth.uid()));
CREATE POLICY "View alerts" ON public.lead_alerts FOR SELECT TO authenticated USING (auth.uid() = ANY(target_users) OR public.can_view_leads(auth.uid()));

-- Indexes
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_priority ON public.leads(priority);
CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_region ON public.leads(region);
CREATE INDEX idx_lead_assignments_lead_id ON public.lead_assignments(lead_id);
CREATE INDEX idx_lead_logs_lead_id ON public.lead_logs(lead_id);
CREATE INDEX idx_lead_alerts_is_active ON public.lead_alerts(is_active);
CREATE INDEX idx_lead_follow_ups_scheduled ON public.lead_follow_ups(scheduled_at);

-- Trigger for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_alerts;

-- Function to mask contact info
CREATE OR REPLACE FUNCTION public.mask_contact_info()
RETURNS TRIGGER AS $$
BEGIN
    NEW.masked_email := CONCAT(LEFT(NEW.email, 2), '****@', SPLIT_PART(NEW.email, '@', 2));
    NEW.masked_phone := CONCAT(LEFT(NEW.phone, 3), '****', RIGHT(NEW.phone, 2));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER mask_lead_contact BEFORE INSERT OR UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.mask_contact_info();