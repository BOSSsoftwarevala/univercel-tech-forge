
-- =============================================
-- SECURITY LOCKDOWN: Close All Backdoors
-- =============================================

-- 1. Create security breach detection table
CREATE TABLE IF NOT EXISTS public.security_breach_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_type TEXT NOT NULL,
  ip_address TEXT,
  device_fingerprint TEXT,
  user_agent TEXT,
  attempted_action TEXT,
  attempted_resource TEXT,
  user_id UUID,
  blocked BOOLEAN DEFAULT true,
  severity TEXT DEFAULT 'high',
  geo_location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.security_breach_attempts ENABLE ROW LEVEL SECURITY;

-- Only master can view breach attempts
DROP POLICY IF EXISTS "Master can view breach attempts" ON public.security_breach_attempts;
CREATE POLICY "Master can view breach attempts" 
ON public.security_breach_attempts FOR SELECT 
USING (public.has_role(auth.uid(), 'master'));

-- 2. Create login restriction table - whitelist only
CREATE TABLE IF NOT EXISTS public.login_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  added_by UUID,
  added_by_role TEXT,
  ip_whitelist TEXT[],
  device_whitelist TEXT[],
  last_login_at TIMESTAMPTZ,
  last_login_ip TEXT,
  last_login_device TEXT,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.login_whitelist ENABLE ROW LEVEL SECURITY;

-- Only master/super_admin can manage whitelist
DROP POLICY IF EXISTS "Privileged can manage whitelist" ON public.login_whitelist;
CREATE POLICY "Privileged can manage whitelist" 
ON public.login_whitelist FOR ALL 
USING (public.has_privileged_role(auth.uid()));

-- 3. Create mandatory login verification function
CREATE OR REPLACE FUNCTION public.verify_login_allowed(
  p_user_id UUID,
  p_email TEXT,
  p_ip_address TEXT,
  p_device_fingerprint TEXT,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_whitelist RECORD;
  v_user_role TEXT;
  v_is_blocked BOOLEAN;
BEGIN
  -- Check if user is in whitelist
  SELECT * INTO v_whitelist
  FROM login_whitelist
  WHERE (user_id = p_user_id OR email = p_email)
  AND is_active = true
  LIMIT 1;
  
  -- Get user role
  SELECT role INTO v_user_role FROM user_roles WHERE user_id = p_user_id;
  
  -- If not in whitelist and not master/super_admin, block
  IF v_whitelist IS NULL AND v_user_role NOT IN ('master', 'super_admin') THEN
    -- Log the attempt
    INSERT INTO security_breach_attempts (
      attempt_type, ip_address, device_fingerprint, user_agent,
      attempted_action, user_id, severity
    ) VALUES (
      'unauthorized_login', p_ip_address, p_device_fingerprint, p_user_agent,
      'login_attempt', p_user_id, 'critical'
    );
    
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'not_whitelisted',
      'message', 'Your account is not authorized. Contact administrator.'
    );
  END IF;
  
  -- Check IP whitelist if configured
  IF v_whitelist IS NOT NULL AND v_whitelist.ip_whitelist IS NOT NULL AND array_length(v_whitelist.ip_whitelist, 1) > 0 THEN
    IF NOT (p_ip_address = ANY(v_whitelist.ip_whitelist)) THEN
      INSERT INTO security_breach_attempts (
        attempt_type, ip_address, device_fingerprint, user_agent,
        attempted_action, user_id, severity
      ) VALUES (
        'ip_not_whitelisted', p_ip_address, p_device_fingerprint, p_user_agent,
        'login_attempt', p_user_id, 'high'
      );
      
      RETURN jsonb_build_object(
        'allowed', false,
        'reason', 'ip_not_whitelisted',
        'message', 'Login from this location is not allowed.'
      );
    END IF;
  END IF;
  
  -- Update login tracking
  IF v_whitelist IS NOT NULL THEN
    UPDATE login_whitelist
    SET last_login_at = now(),
        last_login_ip = p_ip_address,
        last_login_device = p_device_fingerprint,
        login_count = login_count + 1,
        updated_at = now()
    WHERE id = v_whitelist.id;
  END IF;
  
  -- Log successful login to audit
  INSERT INTO audit_logs (user_id, action, module, role, meta_json)
  VALUES (
    p_user_id,
    'login_verified',
    'auth',
    v_user_role::app_role,
    jsonb_build_object(
      'ip_address', p_ip_address,
      'device', p_device_fingerprint,
      'timestamp', now()
    )
  );
  
  RETURN jsonb_build_object(
    'allowed', true,
    'role', v_user_role
  );
END;
$$;

-- 4. Create function to add user to whitelist (Master only)
CREATE OR REPLACE FUNCTION public.add_to_login_whitelist(
  p_target_user_id UUID,
  p_email TEXT,
  p_ip_whitelist TEXT[] DEFAULT NULL,
  p_device_whitelist TEXT[] DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin_role TEXT;
BEGIN
  -- Only master can add to whitelist
  SELECT role INTO v_admin_role FROM user_roles WHERE user_id = auth.uid();
  
  IF v_admin_role != 'master' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Master Admin can manage login whitelist');
  END IF;
  
  INSERT INTO login_whitelist (user_id, email, added_by, added_by_role, ip_whitelist, device_whitelist)
  VALUES (p_target_user_id, p_email, auth.uid(), v_admin_role, p_ip_whitelist, p_device_whitelist)
  ON CONFLICT (user_id) DO UPDATE SET
    is_active = true,
    ip_whitelist = COALESCE(p_ip_whitelist, login_whitelist.ip_whitelist),
    device_whitelist = COALESCE(p_device_whitelist, login_whitelist.device_whitelist),
    updated_at = now();
  
  -- Audit log
  INSERT INTO audit_logs (user_id, action, module, role, meta_json)
  VALUES (
    auth.uid(),
    'whitelist_user_added',
    'security',
    'master',
    jsonb_build_object('target_user_id', p_target_user_id, 'email', p_email)
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'User added to login whitelist');
END;
$$;

-- 5. Create function to remove user from whitelist
CREATE OR REPLACE FUNCTION public.remove_from_login_whitelist(p_target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_admin_role TEXT;
BEGIN
  SELECT role INTO v_admin_role FROM user_roles WHERE user_id = auth.uid();
  
  IF v_admin_role != 'master' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Only Master Admin can manage login whitelist');
  END IF;
  
  UPDATE login_whitelist SET is_active = false, updated_at = now()
  WHERE user_id = p_target_user_id;
  
  -- Force logout the user
  UPDATE user_roles 
  SET force_logged_out_at = now(), force_logged_out_by = auth.uid()
  WHERE user_id = p_target_user_id;
  
  RETURN jsonb_build_object('success', true, 'message', 'User removed from whitelist and logged out');
END;
$$;

-- 6. Create immutable security event log (cannot be deleted)
CREATE TABLE IF NOT EXISTS public.immutable_security_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID,
  user_role TEXT,
  ip_address TEXT,
  device_fingerprint TEXT,
  action_details JSONB,
  signature TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.immutable_security_log ENABLE ROW LEVEL SECURITY;

-- Only master can view, no one can delete
DROP POLICY IF EXISTS "Master can view security log" ON public.immutable_security_log;
CREATE POLICY "Master can view security log" 
ON public.immutable_security_log FOR SELECT 
USING (public.has_role(auth.uid(), 'master'));

-- Prevent any modifications
CREATE OR REPLACE FUNCTION public.prevent_security_log_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RAISE EXCEPTION 'Security logs are immutable - modifications forbidden';
END;
$$;

DROP TRIGGER IF EXISTS prevent_security_log_update ON public.immutable_security_log;
CREATE TRIGGER prevent_security_log_update
BEFORE UPDATE OR DELETE ON public.immutable_security_log
FOR EACH ROW EXECUTE FUNCTION prevent_security_log_modification();

-- 7. Log all sensitive actions
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_user_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_device_fingerprint TEXT DEFAULT NULL,
  p_action_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_log_id UUID;
  v_user_role TEXT;
  v_signature TEXT;
BEGIN
  SELECT role INTO v_user_role FROM user_roles WHERE user_id = p_user_id;
  
  -- Create tamper-proof signature
  v_signature := encode(sha256((p_event_type || COALESCE(p_user_id::text, '') || COALESCE(p_ip_address, '') || now()::text)::bytea), 'hex');
  
  INSERT INTO immutable_security_log (
    event_type, user_id, user_role, ip_address, device_fingerprint, action_details, signature
  ) VALUES (
    p_event_type, p_user_id, v_user_role, p_ip_address, p_device_fingerprint, p_action_details, v_signature
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 8. Add unique constraint to login_whitelist
ALTER TABLE public.login_whitelist DROP CONSTRAINT IF EXISTS login_whitelist_user_id_key;
ALTER TABLE public.login_whitelist ADD CONSTRAINT login_whitelist_user_id_key UNIQUE (user_id);

-- 9. Create index for performance
CREATE INDEX IF NOT EXISTS idx_security_breach_created ON public.security_breach_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_immutable_log_created ON public.immutable_security_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whitelist_email ON public.login_whitelist(email);
