-- Update verify_login_allowed to bypass whitelist for boss_owner and ceo
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
  
  -- If not in whitelist and not privileged, block
  IF v_whitelist IS NULL AND v_user_role NOT IN ('master', 'super_admin', 'boss_owner', 'ceo') THEN
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