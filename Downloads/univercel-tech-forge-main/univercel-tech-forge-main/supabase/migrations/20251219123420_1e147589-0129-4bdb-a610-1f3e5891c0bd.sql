-- Create function to update timestamps FIRST
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enum for demo tech stack
CREATE TYPE public.demo_tech_stack AS ENUM ('php', 'node', 'java', 'python', 'react', 'angular', 'vue', 'other');

-- Create enum for demo status
CREATE TYPE public.demo_status AS ENUM ('active', 'inactive', 'maintenance', 'down');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'demo_manager', 'franchise', 'reseller', 'client', 'prime', 'developer');

-- Create demos table
CREATE TABLE public.demos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    masked_url TEXT,
    tech_stack demo_tech_stack NOT NULL DEFAULT 'other',
    description TEXT,
    status demo_status NOT NULL DEFAULT 'active',
    backup_url TEXT,
    multi_login_enabled BOOLEAN DEFAULT false,
    max_concurrent_logins INTEGER DEFAULT 1,
    health_check_interval INTEGER DEFAULT 5,
    last_health_check TIMESTAMP WITH TIME ZONE,
    uptime_percentage DECIMAL(5,2) DEFAULT 100.00,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_clicks table for analytics
CREATE TABLE public.demo_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    user_role app_role,
    franchise_id UUID,
    reseller_id UUID,
    ip_address TEXT,
    region TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    referrer TEXT,
    session_duration INTEGER,
    converted BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_health table
CREATE TABLE public.demo_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE NOT NULL,
    status demo_status NOT NULL,
    response_time INTEGER,
    error_message TEXT,
    checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rental_assign table
CREATE TABLE public.rental_assign (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE NOT NULL,
    assigned_to UUID REFERENCES auth.users(id) NOT NULL,
    assigned_by UUID REFERENCES auth.users(id) NOT NULL,
    assignee_role app_role NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create uptime_logs table
CREATE TABLE public.uptime_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    event_message TEXT NOT NULL,
    triggered_by UUID REFERENCES auth.users(id),
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    severity TEXT DEFAULT 'info',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demo_alerts table
CREATE TABLE public.demo_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    requires_action BOOLEAN DEFAULT true,
    escalated_to UUID[],
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    action_taken TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_assign ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uptime_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.can_access_demos(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'demo_manager', 'franchise', 'reseller', 'client', 'prime')) $$;

CREATE OR REPLACE FUNCTION public.can_manage_demos(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin', 'demo_manager')) $$;

-- RLS Policies
CREATE POLICY "Managers can manage demos" ON public.demos FOR ALL TO authenticated USING (public.can_manage_demos(auth.uid()));
CREATE POLICY "Users can view demos" ON public.demos FOR SELECT TO authenticated USING (public.can_access_demos(auth.uid()));
CREATE POLICY "Managers can view clicks" ON public.demo_clicks FOR SELECT TO authenticated USING (public.can_manage_demos(auth.uid()));
CREATE POLICY "Users can insert clicks" ON public.demo_clicks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Managers can manage health" ON public.demo_health FOR ALL TO authenticated USING (public.can_manage_demos(auth.uid()));
CREATE POLICY "Users can view health" ON public.demo_health FOR SELECT TO authenticated USING (public.can_access_demos(auth.uid()));
CREATE POLICY "Managers can manage rentals" ON public.rental_assign FOR ALL TO authenticated USING (public.can_manage_demos(auth.uid()));
CREATE POLICY "Users can view own rentals" ON public.rental_assign FOR SELECT TO authenticated USING (assigned_to = auth.uid());
CREATE POLICY "Users can view logs" ON public.uptime_logs FOR SELECT TO authenticated USING (public.can_access_demos(auth.uid()));
CREATE POLICY "Managers can insert logs" ON public.uptime_logs FOR INSERT TO authenticated WITH CHECK (public.can_manage_demos(auth.uid()));
CREATE POLICY "Managers can manage alerts" ON public.demo_alerts FOR ALL TO authenticated USING (public.can_manage_demos(auth.uid()));
CREATE POLICY "Users can view alerts" ON public.demo_alerts FOR SELECT TO authenticated USING (public.can_access_demos(auth.uid()));
CREATE POLICY "Super admin manages roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_demo_clicks_demo_id ON public.demo_clicks(demo_id);
CREATE INDEX idx_demo_clicks_clicked_at ON public.demo_clicks(clicked_at);
CREATE INDEX idx_demo_health_demo_id ON public.demo_health(demo_id);
CREATE INDEX idx_rental_assign_demo_id ON public.rental_assign(demo_id);
CREATE INDEX idx_uptime_logs_demo_id ON public.uptime_logs(demo_id);
CREATE INDEX idx_demo_alerts_is_active ON public.demo_alerts(is_active);

-- Trigger for updated_at
CREATE TRIGGER update_demos_updated_at BEFORE UPDATE ON public.demos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.demo_alerts;