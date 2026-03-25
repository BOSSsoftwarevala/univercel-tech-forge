-- Developer Management Module Tables

-- Developers table
CREATE TABLE public.developers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    masked_email TEXT,
    masked_phone TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    onboarding_completed BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Developer Skills table
CREATE TABLE public.developer_skills (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_experience INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Developer Tasks table
CREATE TABLE public.developer_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    assigned_by UUID,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    tech_stack TEXT[] DEFAULT '{}',
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'accepted', 'working', 'testing', 'completed', 'blocked', 'escalated', 'cancelled')),
    estimated_hours DECIMAL(5,2) DEFAULT 2.00,
    max_delivery_hours DECIMAL(5,2) DEFAULT 2.00,
    promised_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    paused_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    deadline TIMESTAMP WITH TIME ZONE,
    pause_reason TEXT,
    total_paused_minutes INTEGER DEFAULT 0,
    delivery_notes TEXT,
    client_id UUID,
    masked_client_info JSONB,
    buzzer_active BOOLEAN DEFAULT true,
    buzzer_acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Task Logs table (immutable)
CREATE TABLE public.task_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.developer_tasks(id) ON DELETE CASCADE NOT NULL,
    developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    action_type TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    details TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance Scores table
CREATE TABLE public.performance_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    speed_score DECIMAL(5,2) DEFAULT 0.00,
    quality_score DECIMAL(5,2) DEFAULT 0.00,
    communication_score DECIMAL(5,2) DEFAULT 0.00,
    overall_score DECIMAL(5,2) DEFAULT 0.00,
    tasks_completed INTEGER DEFAULT 0,
    tasks_on_time INTEGER DEFAULT 0,
    on_time_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_hours_worked DECIMAL(10,2) DEFAULT 0.00,
    penalties_applied INTEGER DEFAULT 0,
    incentives_earned DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payout Records table
CREATE TABLE public.payout_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID REFERENCES public.developers(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.developer_tasks(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('task_payment', 'bonus', 'incentive', 'penalty', 'adjustment')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'failed', 'cancelled')),
    description TEXT,
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    transaction_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Escalation Records table
CREATE TABLE public.escalation_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.developer_tasks(id) ON DELETE CASCADE NOT NULL,
    developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    escalated_to UUID,
    escalated_to_role app_role,
    reason TEXT NOT NULL,
    idle_minutes INTEGER,
    escalation_level INTEGER DEFAULT 1,
    auto_escalated BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Developer Chat Messages (masked)
CREATE TABLE public.developer_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.developer_tasks(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID NOT NULL,
    sender_role app_role NOT NULL,
    message TEXT NOT NULL,
    is_system_message BOOLEAN DEFAULT false,
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_messages ENABLE ROW LEVEL SECURITY;

-- Helper function for developer access
CREATE OR REPLACE FUNCTION public.can_manage_developers(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'demo_manager')
) 
$$;

-- Helper function for finance access
CREATE OR REPLACE FUNCTION public.can_access_finance(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role IN ('super_admin')
) 
$$;

-- Helper function to get developer_id from user_id
CREATE OR REPLACE FUNCTION public.get_developer_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT id FROM public.developers WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for developers
CREATE POLICY "Managers can manage developers" ON public.developers
FOR ALL USING (can_manage_developers(auth.uid()));

CREATE POLICY "Developers view own profile" ON public.developers
FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for developer_skills
CREATE POLICY "Managers can manage skills" ON public.developer_skills
FOR ALL USING (can_manage_developers(auth.uid()));

CREATE POLICY "Developers view own skills" ON public.developer_skills
FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

-- RLS Policies for developer_tasks
CREATE POLICY "Managers can manage tasks" ON public.developer_tasks
FOR ALL USING (can_manage_developers(auth.uid()));

CREATE POLICY "Developers view own tasks" ON public.developer_tasks
FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Developers update own tasks" ON public.developer_tasks
FOR UPDATE USING (developer_id = get_developer_id(auth.uid()));

-- RLS Policies for task_logs (immutable - insert only)
CREATE POLICY "Insert task logs" ON public.task_logs
FOR INSERT WITH CHECK (can_manage_developers(auth.uid()) OR developer_id = get_developer_id(auth.uid()));

CREATE POLICY "View task logs" ON public.task_logs
FOR SELECT USING (can_manage_developers(auth.uid()) OR developer_id = get_developer_id(auth.uid()));

-- RLS Policies for performance_scores
CREATE POLICY "Managers can manage scores" ON public.performance_scores
FOR ALL USING (can_manage_developers(auth.uid()));

CREATE POLICY "Developers view own scores" ON public.performance_scores
FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

-- RLS Policies for payout_records
CREATE POLICY "Finance can manage payouts" ON public.payout_records
FOR ALL USING (can_access_finance(auth.uid()));

CREATE POLICY "Developers view own payouts" ON public.payout_records
FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

-- RLS Policies for escalation_records
CREATE POLICY "Managers can manage escalations" ON public.escalation_records
FOR ALL USING (can_manage_developers(auth.uid()));

CREATE POLICY "Developers view own escalations" ON public.escalation_records
FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

-- RLS Policies for developer_messages (no delete allowed)
CREATE POLICY "Insert messages" ON public.developer_messages
FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "View task messages" ON public.developer_messages
FOR SELECT USING (
    can_manage_developers(auth.uid()) OR 
    EXISTS (
        SELECT 1 FROM public.developer_tasks 
        WHERE id = task_id 
        AND developer_id = get_developer_id(auth.uid())
    )
);

-- Trigger for masking developer contact info
CREATE OR REPLACE FUNCTION public.mask_developer_contact()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.masked_email := CONCAT(LEFT(NEW.email, 2), '****@', SPLIT_PART(NEW.email, '@', 2));
    IF NEW.phone IS NOT NULL THEN
        NEW.masked_phone := CONCAT(LEFT(NEW.phone, 3), '****', RIGHT(NEW.phone, 2));
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER mask_developer_contact_trigger
BEFORE INSERT OR UPDATE ON public.developers
FOR EACH ROW EXECUTE FUNCTION public.mask_developer_contact();

-- Trigger to update timestamps
CREATE TRIGGER update_developers_updated_at
BEFORE UPDATE ON public.developers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_developer_tasks_updated_at
BEFORE UPDATE ON public.developer_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_scores_updated_at
BEFORE UPDATE ON public.performance_scores
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();