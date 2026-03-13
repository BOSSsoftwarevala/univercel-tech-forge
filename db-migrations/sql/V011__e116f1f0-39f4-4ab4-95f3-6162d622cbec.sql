-- Create promise status enum
CREATE TYPE public.promise_status AS ENUM ('assigned', 'promised', 'in_progress', 'breached', 'completed');

-- Create promise_logs table for tracking all promises
CREATE TABLE public.promise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.developer_tasks(id) ON DELETE CASCADE NOT NULL,
    promise_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    finished_time TIMESTAMP WITH TIME ZONE,
    breach_reason TEXT,
    score_effect INTEGER DEFAULT 0,
    status promise_status NOT NULL DEFAULT 'promised',
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    extended_count INTEGER DEFAULT 0,
    extended_deadline TIMESTAMP WITH TIME ZONE,
    extended_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create buzzer_queue table for notification system
CREATE TABLE public.buzzer_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_type TEXT NOT NULL,
    role_target app_role,
    region TEXT,
    task_id UUID REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
    lead_id UUID,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'pending',
    accepted_by UUID,
    accepted_at TIMESTAMP WITH TIME ZONE,
    auto_escalate_after INTEGER DEFAULT 5,
    escalation_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create permissions table for granular access control
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name TEXT NOT NULL,
    role app_role NOT NULL,
    read_access BOOLEAN DEFAULT false,
    write_access BOOLEAN DEFAULT false,
    admin_access BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(module_name, role)
);

-- Create rd_ideas table for R&D department
CREATE TABLE public.rd_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    submitted_by UUID,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    votes INTEGER DEFAULT 0,
    category TEXT,
    implementation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal_logs table for compliance
CREATE TABLE public.legal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type TEXT NOT NULL,
    user_id UUID,
    compliance_flag BOOLEAN DEFAULT false,
    description TEXT,
    module_affected TEXT,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create marketing_campaigns table
CREATE TABLE public.marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    channel TEXT NOT NULL,
    budget NUMERIC DEFAULT 0,
    spent NUMERIC DEFAULT 0,
    conversion_rate NUMERIC DEFAULT 0,
    leads_generated INTEGER DEFAULT 0,
    influencer_id UUID,
    franchise_id UUID,
    status TEXT DEFAULT 'draft',
    start_date DATE,
    end_date DATE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.promise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buzzer_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rd_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Promise logs policies
CREATE POLICY "Developers view own promises" ON public.promise_logs
    FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Developers create own promises" ON public.promise_logs
    FOR INSERT WITH CHECK (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Developers update own promises" ON public.promise_logs
    FOR UPDATE USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Managers manage all promises" ON public.promise_logs
    FOR ALL USING (can_manage_developers(auth.uid()));

-- Buzzer queue policies
CREATE POLICY "Users view relevant buzzers" ON public.buzzer_queue
    FOR SELECT USING (
        has_role(auth.uid(), role_target) OR 
        has_role(auth.uid(), 'super_admin')
    );

CREATE POLICY "System inserts buzzers" ON public.buzzer_queue
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users accept buzzers" ON public.buzzer_queue
    FOR UPDATE USING (
        has_role(auth.uid(), role_target) OR 
        has_role(auth.uid(), 'super_admin')
    );

CREATE POLICY "Admins manage buzzers" ON public.buzzer_queue
    FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- Permissions table policies
CREATE POLICY "Anyone view permissions" ON public.permissions
    FOR SELECT USING (true);

CREATE POLICY "Admins manage permissions" ON public.permissions
    FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- R&D ideas policies
CREATE POLICY "Anyone view rd ideas" ON public.rd_ideas
    FOR SELECT USING (true);

CREATE POLICY "Authenticated submit ideas" ON public.rd_ideas
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins manage rd ideas" ON public.rd_ideas
    FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- Legal logs policies (read-only for non-admins)
CREATE POLICY "Admins manage legal logs" ON public.legal_logs
    FOR ALL USING (has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Legal team view logs" ON public.legal_logs
    FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

-- Marketing campaigns policies
CREATE POLICY "View own campaigns" ON public.marketing_campaigns
    FOR SELECT USING (
        created_by = auth.uid() OR
        franchise_id = get_franchise_id(auth.uid()) OR
        has_role(auth.uid(), 'super_admin')
    );

CREATE POLICY "Admins manage campaigns" ON public.marketing_campaigns
    FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- Create function to check promise overlap
CREATE OR REPLACE FUNCTION public.has_overlapping_promise(_developer_id UUID, _deadline TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.promise_logs
        WHERE developer_id = _developer_id
        AND status IN ('promised', 'in_progress')
        AND deadline > now()
        AND _deadline < deadline
    )
$$;

-- Create function to check workload threshold
CREATE OR REPLACE FUNCTION public.exceeds_workload_threshold(_developer_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT (
        SELECT COUNT(*) FROM public.promise_logs
        WHERE developer_id = _developer_id
        AND status IN ('promised', 'in_progress')
    ) >= 3
$$;

-- Create trigger for promise breach detection
CREATE OR REPLACE FUNCTION public.check_promise_breach()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deadline < now() AND NEW.status IN ('promised', 'in_progress') THEN
        NEW.status := 'breached';
        NEW.breach_reason := COALESCE(NEW.breach_reason, 'Deadline exceeded');
        NEW.score_effect := -10;
    END IF;
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER promise_breach_check
    BEFORE UPDATE ON public.promise_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.check_promise_breach();

-- Insert default permissions for all modules
INSERT INTO public.permissions (module_name, role, read_access, write_access, admin_access) VALUES
('lead_manager', 'super_admin', true, true, true),
('developer_manager', 'super_admin', true, true, true),
('reseller_manager', 'super_admin', true, true, true),
('franchise_manager', 'super_admin', true, true, true),
('influencer_manager', 'super_admin', true, true, true),
('prime_user_manager', 'super_admin', true, true, true),
('seo_manager', 'super_admin', true, true, true),
('support_manager', 'super_admin', true, true, true),
('task_manager', 'super_admin', true, true, true),
('demo_manager', 'super_admin', true, true, true),
('performance_manager', 'super_admin', true, true, true),
('client_success_manager', 'super_admin', true, true, true),
('marketing_manager', 'super_admin', true, true, true),
('finance_manager', 'super_admin', true, true, true),
('rnd_department', 'super_admin', true, true, true),
('legal_compliance', 'super_admin', true, true, true),
('hr_hiring', 'super_admin', true, true, true),
('system_settings', 'super_admin', true, true, true),
('notification_buzzer', 'super_admin', true, true, true),
('lead_manager', 'franchise', true, true, false),
('developer_manager', 'developer', true, false, false),
('task_manager', 'developer', true, true, false),
('demo_manager', 'franchise', true, false, false),
('demo_manager', 'reseller', true, false, false);