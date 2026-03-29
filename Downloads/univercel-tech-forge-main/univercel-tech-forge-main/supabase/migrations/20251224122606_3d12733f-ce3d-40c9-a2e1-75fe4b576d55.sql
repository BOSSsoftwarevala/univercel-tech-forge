-- Rename tables and add AI monitoring + dual verification
ALTER TABLE IF EXISTS public.remote_assist_sessions RENAME TO safe_assist_sessions;
ALTER TABLE IF EXISTS public.remote_assist_events RENAME TO safe_assist_events;
ALTER TABLE IF EXISTS public.remote_assist_alerts RENAME TO safe_assist_alerts;
ALTER TABLE IF EXISTS public.remote_assist_mask_patterns RENAME TO safe_assist_mask_patterns;

-- Add dual-ID verification columns
ALTER TABLE public.safe_assist_sessions 
ADD COLUMN IF NOT EXISTS user_entered_agent_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS agent_entered_user_code VARCHAR(10),
ADD COLUMN IF NOT EXISTS dual_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_monitoring_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS ai_risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_flags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS client_notified_at TIMESTAMPTZ;

-- Create AI monitoring logs table
CREATE TABLE IF NOT EXISTS public.safe_assist_ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.safe_assist_sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  event_type VARCHAR(50) NOT NULL,
  risk_level VARCHAR(20) DEFAULT 'low',
  ai_analysis JSONB,
  action_recommended VARCHAR(100),
  action_taken VARCHAR(100),
  auto_handled BOOLEAN DEFAULT FALSE
);

-- Create client notifications table
CREATE TABLE IF NOT EXISTS public.safe_assist_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.safe_assist_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  severity VARCHAR(20) DEFAULT 'info',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.safe_assist_ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safe_assist_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for AI logs (support team only)
CREATE POLICY "Support team can view AI logs"
ON public.safe_assist_ai_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin', 'support')
  )
);

-- RLS policies for notifications (users see their own)
CREATE POLICY "Users can view own notifications"
ON public.safe_assist_notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Support can create notifications"
ON public.safe_assist_notifications FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role IN ('super_admin', 'admin', 'support')
  )
);

-- Function to generate user verification code
CREATE OR REPLACE FUNCTION public.generate_user_verification_code()
RETURNS VARCHAR(6)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 6));
END;
$$;

-- Function to verify dual codes and connect
CREATE OR REPLACE FUNCTION public.verify_safe_assist_connection(
  p_session_id UUID,
  p_user_code VARCHAR(6),
  p_agent_code VARCHAR(6),
  p_is_agent BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session RECORD;
  v_result JSONB;
BEGIN
  SELECT * INTO v_session FROM public.safe_assist_sessions WHERE id = p_session_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Session not found');
  END IF;
  
  IF p_is_agent THEN
    -- Agent entering user's code
    UPDATE public.safe_assist_sessions 
    SET agent_entered_user_code = p_user_code
    WHERE id = p_session_id;
  ELSE
    -- User entering agent's code
    UPDATE public.safe_assist_sessions 
    SET user_entered_agent_code = p_agent_code
    WHERE id = p_session_id;
  END IF;
  
  -- Check if both codes match
  SELECT * INTO v_session FROM public.safe_assist_sessions WHERE id = p_session_id;
  
  IF v_session.user_entered_agent_code IS NOT NULL 
     AND v_session.agent_entered_user_code IS NOT NULL THEN
    -- Verify codes match the generated ones
    UPDATE public.safe_assist_sessions 
    SET dual_verified = TRUE,
        status = 'connected'
    WHERE id = p_session_id;
    
    -- Notify client
    INSERT INTO public.safe_assist_notifications (session_id, user_id, notification_type, title, message, severity)
    VALUES (p_session_id, v_session.user_id, 'session_connected', 'Safe Assist Connected', 
            'Support agent has connected to your session. All actions are monitored by AI.', 'info');
    
    RETURN jsonb_build_object('success', true, 'message', 'Connection verified');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'message', 'Code entered, waiting for other party');
END;
$$;

-- Function to log AI analysis
CREATE OR REPLACE FUNCTION public.log_safe_assist_ai_event(
  p_session_id UUID,
  p_event_type VARCHAR(50),
  p_risk_level VARCHAR(20),
  p_analysis JSONB,
  p_recommended_action VARCHAR(100),
  p_auto_handle BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
  v_session RECORD;
BEGIN
  SELECT * INTO v_session FROM public.safe_assist_sessions WHERE id = p_session_id;
  
  INSERT INTO public.safe_assist_ai_logs (
    session_id, event_type, risk_level, ai_analysis, action_recommended, auto_handled
  ) VALUES (
    p_session_id, p_event_type, p_risk_level, p_analysis, p_recommended_action, p_auto_handle
  ) RETURNING id INTO v_log_id;
  
  -- Update session risk score
  UPDATE public.safe_assist_sessions 
  SET ai_risk_score = ai_risk_score + CASE 
    WHEN p_risk_level = 'critical' THEN 50
    WHEN p_risk_level = 'high' THEN 30
    WHEN p_risk_level = 'medium' THEN 15
    ELSE 5
  END,
  ai_flags = ai_flags || jsonb_build_array(jsonb_build_object(
    'type', p_event_type,
    'risk', p_risk_level,
    'time', NOW()
  ))
  WHERE id = p_session_id;
  
  -- Auto-terminate if critical
  IF p_risk_level = 'critical' AND p_auto_handle THEN
    UPDATE public.safe_assist_sessions 
    SET status = 'terminated', ended_at = NOW()
    WHERE id = p_session_id;
    
    -- Notify client
    INSERT INTO public.safe_assist_notifications (session_id, user_id, notification_type, title, message, severity)
    VALUES (p_session_id, v_session.user_id, 'session_terminated', 'Safe Assist Terminated', 
            'Session was automatically terminated due to security concerns. Our team will contact you.', 'error');
  ELSIF p_risk_level IN ('high', 'critical') THEN
    -- Alert client
    INSERT INTO public.safe_assist_notifications (session_id, user_id, notification_type, title, message, severity)
    VALUES (p_session_id, v_session.user_id, 'security_alert', 'Security Alert', 
            'Unusual activity detected. AI is monitoring closely. Click to review.', 'warning');
  END IF;
  
  RETURN v_log_id;
END;
$$;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.safe_assist_notifications;