-- Add Assist Manager specific tables and RLS policies

-- Create assist_request_queue table for tracking assist requests
CREATE TABLE IF NOT EXISTS public.assist_request_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.safe_assist_sessions(id) ON DELETE CASCADE,
    requesting_user_id UUID NOT NULL,
    requesting_user_role public.app_role,
    requested_support_staff_id UUID,
    requested_duration_minutes INTEGER DEFAULT 30,
    requested_mode TEXT DEFAULT 'readonly',
    request_reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assist_eligibility_settings table
CREATE TABLE IF NOT EXISTS public.assist_eligibility_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role public.app_role NOT NULL UNIQUE,
    is_assist_enabled BOOLEAN DEFAULT true,
    max_sessions_per_staff INTEGER DEFAULT 5,
    max_duration_minutes INTEGER DEFAULT 60,
    requires_approval BOOLEAN DEFAULT true,
    allowed_modes TEXT[] DEFAULT ARRAY['readonly'],
    updated_by UUID,
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create assist_abuse_flags table
CREATE TABLE IF NOT EXISTS public.assist_abuse_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL,
    flag_type TEXT NOT NULL CHECK (flag_type IN ('excessive_sessions', 'repeated_force_ends', 'over_duration', 'policy_violation', 'consent_bypass_attempt')),
    flag_count INTEGER DEFAULT 1,
    severity TEXT DEFAULT 'warning' CHECK (severity IN ('info', 'warning', 'critical')),
    details JSONB,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create assist_force_end_logs table for immutable audit
CREATE TABLE IF NOT EXISTS public.assist_force_end_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.safe_assist_sessions(id) ON DELETE RESTRICT,
    ended_by UUID NOT NULL,
    ended_by_role public.app_role,
    end_type TEXT NOT NULL CHECK (end_type IN ('normal', 'force_single', 'force_all')),
    reason TEXT NOT NULL,
    session_duration_seconds INTEGER,
    was_policy_violation BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assist_request_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_eligibility_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_abuse_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_force_end_logs ENABLE ROW LEVEL SECURITY;

-- RLS for assist_request_queue (assist_manager can view and manage)
CREATE POLICY "assist_manager_can_view_requests" ON public.assist_request_queue
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

CREATE POLICY "assist_manager_can_update_requests" ON public.assist_request_queue
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

-- RLS for assist_eligibility_settings
CREATE POLICY "assist_manager_can_view_eligibility" ON public.assist_eligibility_settings
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

CREATE POLICY "assist_manager_can_update_eligibility" ON public.assist_eligibility_settings
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

-- RLS for assist_abuse_flags (read-only for assist_manager, write for super_admin+)
CREATE POLICY "assist_manager_can_view_abuse_flags" ON public.assist_abuse_flags
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

CREATE POLICY "super_admin_can_insert_abuse_flags" ON public.assist_abuse_flags
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

-- RLS for assist_force_end_logs (immutable - insert only, no update/delete)
CREATE POLICY "assist_manager_can_view_force_logs" ON public.assist_force_end_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

CREATE POLICY "assist_manager_can_insert_force_logs" ON public.assist_force_end_logs
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role IN ('assist_manager', 'super_admin', 'master')
        )
    );

-- Create function for force ending session with audit
CREATE OR REPLACE FUNCTION public.force_end_assist_session(
    p_session_id UUID,
    p_reason TEXT,
    p_end_type TEXT DEFAULT 'force_single'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session RECORD;
    v_user_role TEXT;
    v_duration INTEGER;
BEGIN
    -- Get user role
    SELECT role INTO v_user_role FROM user_roles WHERE user_id = auth.uid();
    
    -- Only assist_manager, super_admin, master can force end
    IF v_user_role NOT IN ('assist_manager', 'super_admin', 'master') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Access denied: Only Assist Manager can force end sessions');
    END IF;
    
    -- Validate reason is provided
    IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'A valid reason is required (minimum 5 characters)');
    END IF;
    
    -- Get session
    SELECT * INTO v_session FROM safe_assist_sessions WHERE id = p_session_id FOR UPDATE;
    
    IF v_session IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Session not found');
    END IF;
    
    IF v_session.status NOT IN ('active', 'pending', 'connected') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Session is not active');
    END IF;
    
    -- Calculate duration
    v_duration := EXTRACT(EPOCH FROM (now() - COALESCE(v_session.started_at, v_session.created_at)))::INTEGER;
    
    -- End the session
    UPDATE safe_assist_sessions
    SET status = 'ended',
        ended_at = now(),
        ended_by = auth.uid(),
        end_reason = 'FORCE_END: ' || p_reason
    WHERE id = p_session_id;
    
    -- Log to immutable audit
    INSERT INTO assist_force_end_logs (
        session_id, ended_by, ended_by_role, end_type, reason, session_duration_seconds
    ) VALUES (
        p_session_id, auth.uid(), v_user_role::app_role, p_end_type, p_reason, v_duration
    );
    
    -- Log to main audit
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        auth.uid(),
        'assist_session_force_ended',
        'safe_assist',
        v_user_role::app_role,
        jsonb_build_object(
            'session_id', p_session_id,
            'reason', p_reason,
            'end_type', p_end_type,
            'duration_seconds', v_duration
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'session_id', p_session_id,
        'duration_seconds', v_duration
    );
END;
$$;

-- Create function to force end all active sessions
CREATE OR REPLACE FUNCTION public.force_end_all_assist_sessions(p_reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_role TEXT;
    v_count INTEGER := 0;
    v_session RECORD;
BEGIN
    -- Get user role
    SELECT role INTO v_user_role FROM user_roles WHERE user_id = auth.uid();
    
    -- Only assist_manager, super_admin, master can force end all
    IF v_user_role NOT IN ('assist_manager', 'super_admin', 'master') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Access denied');
    END IF;
    
    -- Validate reason
    IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 5 THEN
        RETURN jsonb_build_object('success', false, 'error', 'A valid reason is required');
    END IF;
    
    -- End all active sessions
    FOR v_session IN 
        SELECT id FROM safe_assist_sessions WHERE status IN ('active', 'pending', 'connected')
    LOOP
        PERFORM force_end_assist_session(v_session.id, p_reason, 'force_all');
        v_count := v_count + 1;
    END LOOP;
    
    RETURN jsonb_build_object('success', true, 'sessions_ended', v_count);
END;
$$;