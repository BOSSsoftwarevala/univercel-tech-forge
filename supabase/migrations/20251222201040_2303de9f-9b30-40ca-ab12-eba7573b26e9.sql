-- Create demo_report_cards table for tracking all demo actions
CREATE TABLE public.demo_report_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE,
    demo_name TEXT NOT NULL,
    sector TEXT,
    sub_category TEXT,
    action_type TEXT NOT NULL CHECK (action_type IN ('add', 'edit', 'delete', 'fix', 'replace_link', 'approve', 'reject', 'health_check', 'status_update')),
    performed_by UUID NOT NULL,
    performed_by_role TEXT NOT NULL,
    action_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    demo_status TEXT,
    uptime_state TEXT,
    error_details TEXT,
    fix_details TEXT,
    completion_time_seconds INTEGER,
    old_values JSONB,
    new_values JSONB,
    auto_registered BOOLEAN DEFAULT true,
    workflow_status TEXT DEFAULT 'submitted' CHECK (workflow_status IN ('submitted', 'in_progress', 'fixed', 'live', 'disabled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_report_cards ENABLE ROW LEVEL SECURITY;

-- Demo Manager can view their own report cards
CREATE POLICY "Demo managers can view their own report cards"
ON public.demo_report_cards
FOR SELECT
TO authenticated
USING (
    performed_by = auth.uid() 
    AND EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'demo_manager'
    )
);

-- Demo Manager can insert report cards
CREATE POLICY "Demo managers can create report cards"
ON public.demo_report_cards
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'demo_manager'
    )
);

-- Super Admin and Admin can view all report cards
CREATE POLICY "Super admins can view all report cards"
ON public.demo_report_cards
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'admin')
    )
);

-- Create function to check if user is demo_manager
CREATE OR REPLACE FUNCTION public.is_demo_manager(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id
        AND role = 'demo_manager'
    )
$$;

-- Create function to log unauthorized demo access attempts
CREATE OR REPLACE FUNCTION public.log_unauthorized_demo_attempt(
    _user_id UUID,
    _user_role TEXT,
    _action_attempted TEXT,
    _demo_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        _user_id,
        'unauthorized_demo_access_attempt',
        'demo_security',
        _user_role::app_role,
        jsonb_build_object(
            'action_attempted', _action_attempted,
            'demo_id', _demo_id,
            'blocked', true,
            'flagged', true,
            'timestamp', now()
        )
    )
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;

-- Create function to auto-create report card on demo action
CREATE OR REPLACE FUNCTION public.create_demo_report_card(
    _demo_id UUID,
    _demo_name TEXT,
    _action_type TEXT,
    _sector TEXT DEFAULT NULL,
    _sub_category TEXT DEFAULT NULL,
    _demo_status TEXT DEFAULT NULL,
    _uptime_state TEXT DEFAULT NULL,
    _error_details TEXT DEFAULT NULL,
    _fix_details TEXT DEFAULT NULL,
    _old_values JSONB DEFAULT NULL,
    _new_values JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    report_id UUID;
    user_role TEXT;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
    
    -- Only demo_manager can create report cards
    IF user_role != 'demo_manager' THEN
        PERFORM public.log_unauthorized_demo_attempt(auth.uid(), user_role, _action_type, _demo_id);
        RAISE EXCEPTION 'Access denied: Only Demo Manager can perform demo actions';
    END IF;
    
    INSERT INTO public.demo_report_cards (
        demo_id, demo_name, sector, sub_category, action_type,
        performed_by, performed_by_role, demo_status, uptime_state,
        error_details, fix_details, old_values, new_values,
        auto_registered, workflow_status
    )
    VALUES (
        _demo_id, _demo_name, _sector, _sub_category, _action_type,
        auth.uid(), user_role, _demo_status, _uptime_state,
        _error_details, _fix_details, _old_values, _new_values,
        true, 'submitted'
    )
    RETURNING id INTO report_id;
    
    -- Also log to audit_logs
    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        auth.uid(),
        _action_type,
        'demo',
        user_role::app_role,
        jsonb_build_object(
            'demo_id', _demo_id,
            'demo_name', _demo_name,
            'report_card_id', report_id,
            'auto_registered', true
        )
    );
    
    RETURN report_id;
END;
$$;

-- Update RLS on demos table to restrict modifications to demo_manager only
-- First drop any existing permissive policies
DROP POLICY IF EXISTS "Anyone can view demos" ON public.demos;
DROP POLICY IF EXISTS "Authenticated users can insert demos" ON public.demos;
DROP POLICY IF EXISTS "Users can update demos" ON public.demos;
DROP POLICY IF EXISTS "Users can delete demos" ON public.demos;

-- Create new restrictive policies for demos
CREATE POLICY "Anyone can view demos"
ON public.demos
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only demo_manager can insert demos"
ON public.demos
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('demo_manager', 'super_admin')
    )
);

CREATE POLICY "Only demo_manager can update demos"
ON public.demos
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('demo_manager', 'super_admin')
    )
);

CREATE POLICY "Only demo_manager can delete demos"
ON public.demos
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('demo_manager', 'super_admin')
    )
);

-- Update RLS on demo_alerts table
DROP POLICY IF EXISTS "Anyone can view alerts" ON public.demo_alerts;
DROP POLICY IF EXISTS "Users can insert alerts" ON public.demo_alerts;
DROP POLICY IF EXISTS "Users can update alerts" ON public.demo_alerts;

CREATE POLICY "Anyone can view demo alerts"
ON public.demo_alerts
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only demo_manager can insert alerts"
ON public.demo_alerts
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('demo_manager', 'super_admin')
    )
);

CREATE POLICY "Only demo_manager can update alerts"
ON public.demo_alerts
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('demo_manager', 'super_admin')
    )
);

-- Create index for better performance
CREATE INDEX idx_demo_report_cards_performed_by ON public.demo_report_cards(performed_by);
CREATE INDEX idx_demo_report_cards_demo_id ON public.demo_report_cards(demo_id);
CREATE INDEX idx_demo_report_cards_action_timestamp ON public.demo_report_cards(action_timestamp DESC);