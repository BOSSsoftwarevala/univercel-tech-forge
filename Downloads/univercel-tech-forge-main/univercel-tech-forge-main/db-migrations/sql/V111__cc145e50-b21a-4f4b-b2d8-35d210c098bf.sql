
-- =============================================
-- SECURITY: Rate Limiting & Failed Login Tracking
-- =============================================

-- Rate Limiting Table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  ip_address TEXT,
  action_type TEXT NOT NULL,
  action_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  window_end TIMESTAMPTZ DEFAULT now() + interval '1 hour',
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits FOR ALL 
USING (public.has_privileged_role(auth.uid()));

-- Rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_requests INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_count INTEGER;
  v_is_blocked BOOLEAN;
BEGIN
  SELECT is_blocked INTO v_is_blocked
  FROM rate_limits
  WHERE user_id = p_user_id
  AND action_type = p_action_type
  AND window_end > now()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_is_blocked = true THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'rate_limited');
  END IF;
  
  SELECT COUNT(*) INTO v_count
  FROM rate_limits
  WHERE user_id = p_user_id
  AND action_type = p_action_type
  AND created_at > now() - (p_window_minutes || ' minutes')::interval;
  
  IF v_count >= p_max_requests THEN
    INSERT INTO rate_limits (user_id, action_type, is_blocked, window_end)
    VALUES (p_user_id, p_action_type, true, now() + interval '1 hour');
    
    RETURN jsonb_build_object('allowed', false, 'reason', 'rate_limited', 'retry_after', 3600);
  END IF;
  
  INSERT INTO rate_limits (user_id, action_type)
  VALUES (p_user_id, p_action_type);
  
  RETURN jsonb_build_object('allowed', true, 'remaining', p_max_requests - v_count - 1);
END;
$$;

-- Failed Login Tracking Table
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  ip_address TEXT,
  device_fingerprint TEXT,
  attempt_count INTEGER DEFAULT 1,
  last_attempt_at TIMESTAMPTZ DEFAULT now(),
  is_locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view failed logins" ON public.failed_login_attempts;
CREATE POLICY "Admins can view failed logins" 
ON public.failed_login_attempts FOR SELECT 
USING (public.has_privileged_role(auth.uid()));

-- Function to track failed logins
CREATE OR REPLACE FUNCTION public.track_failed_login(
  p_email TEXT,
  p_ip_address TEXT,
  p_device_fingerprint TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_record RECORD;
  v_max_attempts INTEGER := 5;
  v_lockout_minutes INTEGER := 30;
BEGIN
  SELECT * INTO v_record
  FROM failed_login_attempts
  WHERE email = p_email
  AND last_attempt_at > now() - interval '30 minutes'
  ORDER BY last_attempt_at DESC
  LIMIT 1;
  
  IF v_record IS NOT NULL THEN
    UPDATE failed_login_attempts
    SET attempt_count = attempt_count + 1,
        last_attempt_at = now(),
        is_locked = CASE WHEN attempt_count + 1 >= v_max_attempts THEN true ELSE false END,
        locked_until = CASE WHEN attempt_count + 1 >= v_max_attempts 
                       THEN now() + (v_lockout_minutes || ' minutes')::interval 
                       ELSE NULL END
    WHERE id = v_record.id;
    
    IF v_record.attempt_count + 1 >= v_max_attempts THEN
      RETURN jsonb_build_object(
        'locked', true, 
        'message', 'Account temporarily locked due to too many failed attempts',
        'retry_after', v_lockout_minutes * 60
      );
    END IF;
  ELSE
    INSERT INTO failed_login_attempts (email, ip_address, device_fingerprint)
    VALUES (p_email, p_ip_address, p_device_fingerprint);
  END IF;
  
  RETURN jsonb_build_object('locked', false, 'attempts_remaining', v_max_attempts - COALESCE(v_record.attempt_count, 0) - 1);
END;
$$;

-- Function to clear failed attempts on successful login
CREATE OR REPLACE FUNCTION public.clear_failed_logins(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM failed_login_attempts WHERE email = p_email;
END;
$$;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON public.rate_limits(user_id, action_type, created_at);
CREATE INDEX IF NOT EXISTS idx_failed_logins_email ON public.failed_login_attempts(email, last_attempt_at);
