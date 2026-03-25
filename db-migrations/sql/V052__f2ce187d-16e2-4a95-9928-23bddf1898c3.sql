-- Remote Assist Session Types
CREATE TYPE public.remote_assist_status AS ENUM ('pending', 'active', 'ended', 'expired', 'cancelled');
CREATE TYPE public.remote_assist_mode AS ENUM ('view_only', 'guided_cursor');

-- Remote Assist Sessions Table
CREATE TABLE public.remote_assist_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_code VARCHAR(8) NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    user_role app_role NOT NULL,
    support_agent_id UUID,
    support_agent_role app_role,
    status remote_assist_status NOT NULL DEFAULT 'pending',
    mode remote_assist_mode NOT NULL DEFAULT 'guided_cursor',
    
    -- Timing
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '5 minutes'),
    max_duration_minutes INTEGER NOT NULL DEFAULT 30,
    
    -- Security
    user_consent_given BOOLEAN NOT NULL DEFAULT false,
    user_consent_at TIMESTAMPTZ,
    is_recording_enabled BOOLEAN NOT NULL DEFAULT true,
    recording_url TEXT,
    
    -- Agent Info (for watermark)
    agent_masked_id VARCHAR(20),
    agent_watermark_text TEXT,
    
    -- Connection metadata
    user_ip_address TEXT,
    user_device_fingerprint TEXT,
    agent_ip_address TEXT,
    agent_device_fingerprint TEXT,
    
    -- End reason
    ended_by UUID,
    end_reason TEXT
);

-- Remote Assist Events Log (for playback/audit)
CREATE TABLE public.remote_assist_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES remote_assist_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor_type VARCHAR(20) NOT NULL
);

-- Remote Assist Alerts (use TEXT[] for recipients to avoid casting issues)
CREATE TABLE public.remote_assist_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES remote_assist_sessions(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    recipients TEXT[] NOT NULL DEFAULT ARRAY['super_admin', 'admin'],
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sensitive Field Patterns (for auto-masking)
CREATE TABLE public.remote_assist_mask_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_name VARCHAR(100) NOT NULL,
    selector_pattern TEXT NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default mask patterns
INSERT INTO public.remote_assist_mask_patterns (pattern_name, selector_pattern, field_type) VALUES
('Password Fields', 'input[type="password"]', 'password'),
('Card Number', 'input[name*="card"], input[autocomplete*="cc-number"]', 'card'),
('CVV Fields', 'input[name*="cvv"], input[name*="cvc"], input[autocomplete*="cc-csc"]', 'card'),
('OTP Fields', 'input[name*="otp"], input[autocomplete="one-time-code"]', 'otp'),
('SSN Fields', 'input[name*="ssn"], input[name*="social"]', 'personal'),
('Bank Account', 'input[name*="account"], input[name*="routing"]', 'personal');

-- Enable RLS
ALTER TABLE public.remote_assist_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_assist_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_assist_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remote_assist_mask_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for remote_assist_sessions
CREATE POLICY "Users can view their own sessions"
ON public.remote_assist_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Support agents can view sessions they are assigned to"
ON public.remote_assist_sessions FOR SELECT
USING (
    auth.uid() = support_agent_id
    OR EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin', 'support')
    )
);

CREATE POLICY "Users can create sessions for themselves"
ON public.remote_assist_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Participants can update their sessions"
ON public.remote_assist_sessions FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() = support_agent_id);

-- RLS for events
CREATE POLICY "Session participants can view events"
ON public.remote_assist_events FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.remote_assist_sessions s
        WHERE s.id = session_id
        AND (s.user_id = auth.uid() OR s.support_agent_id = auth.uid())
    )
    OR EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'admin')
    )
);

CREATE POLICY "Session participants can insert events"
ON public.remote_assist_events FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.remote_assist_sessions s
        WHERE s.id = session_id
        AND (s.user_id = auth.uid() OR s.support_agent_id = auth.uid())
    )
);

-- RLS for alerts
CREATE POLICY "Authorized roles can view alerts"
ON public.remote_assist_alerts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role::text = ANY(recipients)
    )
);

CREATE POLICY "System can insert alerts"
ON public.remote_assist_alerts FOR INSERT
WITH CHECK (true);

-- RLS for mask patterns (read-only for most)
CREATE POLICY "Anyone can view active mask patterns"
ON public.remote_assist_mask_patterns FOR SELECT
USING (is_active = true);

CREATE POLICY "Super admin can manage mask patterns"
ON public.remote_assist_mask_patterns FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'super_admin'
    )
);

-- Helper function to generate session code
CREATE OR REPLACE FUNCTION public.generate_session_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$;

-- Function to create a remote assist session
CREATE OR REPLACE FUNCTION public.create_remote_assist_session()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session_id UUID;
    v_session_code TEXT;
    v_user_role app_role;
BEGIN
    SELECT role INTO v_user_role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
    
    IF EXISTS (
        SELECT 1 FROM public.remote_assist_sessions
        WHERE user_id = auth.uid()
        AND status IN ('pending', 'active')
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'You already have an active support session');
    END IF;
    
    LOOP
        v_session_code := generate_session_code();
        EXIT WHEN NOT EXISTS (
            SELECT 1 FROM public.remote_assist_sessions WHERE session_code = v_session_code
        );
    END LOOP;
    
    INSERT INTO public.remote_assist_sessions (
        session_code, user_id, user_role, mode, expires_at
    ) VALUES (
        v_session_code, auth.uid(), v_user_role, 'guided_cursor', now() + interval '5 minutes'
    )
    RETURNING id INTO v_session_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session_id,
        'session_code', v_session_code,
        'expires_at', now() + interval '5 minutes'
    );
END;
$$;

-- Function for support agent to join session
CREATE OR REPLACE FUNCTION public.join_remote_assist_session(p_session_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session RECORD;
    v_agent_role app_role;
    v_masked_id TEXT;
BEGIN
    SELECT role INTO v_agent_role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
    
    IF v_agent_role NOT IN ('super_admin', 'admin', 'support') THEN
        INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
        VALUES (auth.uid(), 'unauthorized_remote_assist_join', 'remote_assist', v_agent_role,
            jsonb_build_object('session_code', p_session_code, 'blocked', true));
        
        RETURN jsonb_build_object('success', false, 'error', 'Access denied: Only support staff can join sessions');
    END IF;
    
    SELECT * INTO v_session FROM public.remote_assist_sessions
    WHERE session_code = upper(p_session_code)
    AND status = 'pending'
    AND expires_at > now()
    FOR UPDATE;
    
    IF v_session IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired session code');
    END IF;
    
    v_masked_id := v_agent_role::text || '_' || substr(md5(auth.uid()::text), 1, 6);
    
    UPDATE public.remote_assist_sessions
    SET support_agent_id = auth.uid(),
        support_agent_role = v_agent_role,
        agent_masked_id = v_masked_id,
        agent_watermark_text = 'Support: ' || v_masked_id || ' | ' || to_char(now(), 'YYYY-MM-DD HH24:MI')
    WHERE id = v_session.id;
    
    INSERT INTO public.remote_assist_alerts (session_id, alert_type, recipients, message)
    VALUES (v_session.id, 'session_joined', ARRAY['super_admin', 'admin'],
        'Support agent ' || v_masked_id || ' joined session with user');
    
    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (auth.uid(), 'remote_assist_joined', 'remote_assist', v_agent_role,
        jsonb_build_object('session_id', v_session.id, 'user_id', v_session.user_id));
    
    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_session.id,
        'user_id', v_session.user_id,
        'user_role', v_session.user_role,
        'mode', v_session.mode,
        'masked_id', v_masked_id
    );
END;
$$;

-- Function to give consent and start session
CREATE OR REPLACE FUNCTION public.give_remote_assist_consent(p_session_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session RECORD;
BEGIN
    SELECT * INTO v_session FROM public.remote_assist_sessions
    WHERE id = p_session_id AND user_id = auth.uid() FOR UPDATE;
    
    IF v_session IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Session not found');
    END IF;
    
    IF v_session.support_agent_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'No support agent has joined yet');
    END IF;
    
    UPDATE public.remote_assist_sessions
    SET user_consent_given = true, user_consent_at = now(), status = 'active', started_at = now(),
        expires_at = now() + (max_duration_minutes || ' minutes')::interval
    WHERE id = p_session_id;
    
    INSERT INTO public.remote_assist_events (session_id, event_type, event_data, actor_type)
    VALUES (p_session_id, 'consent_given', jsonb_build_object('timestamp', now()), 'user');
    
    INSERT INTO public.remote_assist_alerts (session_id, alert_type, recipients, message)
    VALUES (p_session_id, 'session_started', ARRAY['super_admin', 'admin'],
        'Remote assist session started: ' || v_session.session_code);
    
    RETURN jsonb_build_object('success', true, 'session_id', p_session_id,
        'expires_at', now() + (v_session.max_duration_minutes || ' minutes')::interval);
END;
$$;

-- Function to end session
CREATE OR REPLACE FUNCTION public.end_remote_assist_session(p_session_id UUID, p_reason TEXT DEFAULT 'User ended session')
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_session RECORD;
BEGIN
    SELECT * INTO v_session FROM public.remote_assist_sessions
    WHERE id = p_session_id AND (user_id = auth.uid() OR support_agent_id = auth.uid()) FOR UPDATE;
    
    IF v_session IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Session not found or access denied');
    END IF;
    
    UPDATE public.remote_assist_sessions
    SET status = 'ended', ended_at = now(), ended_by = auth.uid(), end_reason = p_reason
    WHERE id = p_session_id;
    
    INSERT INTO public.remote_assist_events (session_id, event_type, event_data, actor_type)
    VALUES (p_session_id, 'session_ended', jsonb_build_object('reason', p_reason, 'ended_by', auth.uid()), 'system');
    
    INSERT INTO public.remote_assist_alerts (session_id, alert_type, recipients, message)
    VALUES (p_session_id, 'session_ended', ARRAY['super_admin', 'admin'],
        'Remote assist session ended: ' || v_session.session_code || ' - ' || p_reason);
    
    RETURN jsonb_build_object('success', true, 'session_id', p_session_id);
END;
$$;

-- Enable realtime for alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.remote_assist_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.remote_assist_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.remote_assist_events;

-- Indexes
CREATE INDEX idx_remote_assist_sessions_code ON public.remote_assist_sessions(session_code);
CREATE INDEX idx_remote_assist_sessions_user ON public.remote_assist_sessions(user_id, status);
CREATE INDEX idx_remote_assist_sessions_agent ON public.remote_assist_sessions(support_agent_id, status);
CREATE INDEX idx_remote_assist_events_session ON public.remote_assist_events(session_id, timestamp);
CREATE INDEX idx_remote_assist_alerts_unread ON public.remote_assist_alerts(is_read, created_at) WHERE is_read = false;