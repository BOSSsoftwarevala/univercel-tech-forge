-- Security Functions for Next-Gen Architecture

-- Function to add to crypto audit chain (blockchain-style)
CREATE OR REPLACE FUNCTION public.add_to_audit_chain(
  p_user_id UUID,
  p_action_type TEXT,
  p_module TEXT,
  p_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_block_id UUID;
  v_block_number BIGINT;
  v_previous_hash TEXT;
  v_data_hash TEXT;
  v_block_hash TEXT;
  v_nonce TEXT;
  v_is_genesis BOOLEAN := false;
BEGIN
  SELECT block_number, block_hash INTO v_block_number, v_previous_hash
  FROM public.crypto_audit_chain
  ORDER BY block_number DESC
  LIMIT 1;
  
  IF v_block_number IS NULL THEN
    v_block_number := 0;
    v_previous_hash := '0000000000000000000000000000000000000000000000000000000000000000';
    v_is_genesis := true;
  ELSE
    v_block_number := v_block_number + 1;
  END IF;
  
  v_nonce := encode(gen_random_bytes(16), 'hex');
  
  v_data_hash := encode(
    sha256(convert_to(p_action_type || p_module || COALESCE(p_data::TEXT, '') || v_nonce, 'UTF8')),
    'hex'
  );
  
  v_block_hash := encode(
    sha256(convert_to(v_block_number::TEXT || v_previous_hash || v_data_hash || now()::TEXT, 'UTF8')),
    'hex'
  );
  
  INSERT INTO public.crypto_audit_chain (
    block_number, user_id, action_type, module, data_hash, previous_hash, block_hash, nonce, is_genesis, metadata
  ) VALUES (
    v_block_number, p_user_id, p_action_type, p_module, v_data_hash, v_previous_hash, v_block_hash, v_nonce, v_is_genesis, p_data
  )
  RETURNING id INTO v_block_id;
  
  RETURN v_block_id;
END;
$$;

-- Function to verify chain integrity
CREATE OR REPLACE FUNCTION public.verify_audit_chain()
RETURNS TABLE(is_valid BOOLEAN, last_verified_block BIGINT, broken_at_block BIGINT, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current RECORD;
  v_previous RECORD;
  v_is_valid BOOLEAN := true;
  v_broken_block BIGINT := NULL;
  v_error TEXT := NULL;
  v_last_block BIGINT := 0;
BEGIN
  FOR v_current IN SELECT * FROM public.crypto_audit_chain ORDER BY block_number ASC
  LOOP
    v_last_block := v_current.block_number;
    
    IF v_current.block_number = 0 THEN
      IF v_current.previous_hash != '0000000000000000000000000000000000000000000000000000000000000000' THEN
        v_is_valid := false;
        v_broken_block := 0;
        v_error := 'Genesis block has invalid previous hash';
        EXIT;
      END IF;
    ELSE
      SELECT * INTO v_previous FROM public.crypto_audit_chain WHERE block_number = v_current.block_number - 1;
      IF v_previous.block_hash != v_current.previous_hash THEN
        v_is_valid := false;
        v_broken_block := v_current.block_number;
        v_error := 'Chain broken: previous_hash mismatch';
        EXIT;
      END IF;
    END IF;
  END LOOP;
  
  RETURN QUERY SELECT v_is_valid, v_last_block, v_broken_block, v_error;
END;
$$;

-- Function to issue security token
CREATE OR REPLACE FUNCTION public.issue_security_token(
  p_user_id UUID,
  p_token_type TEXT,
  p_device_fingerprint TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_validity_minutes INT DEFAULT 30,
  p_max_usage INT DEFAULT 1
)
RETURNS TABLE(token_id UUID, token_hash TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_id UUID;
  v_token_hash TEXT;
BEGIN
  v_token_hash := encode(sha256(convert_to(
    gen_random_uuid()::TEXT || p_user_id::TEXT || p_device_fingerprint || now()::TEXT,
    'UTF8'
  )), 'hex');
  
  INSERT INTO public.security_tokens (
    user_id, token_hash, token_type, device_fingerprint, ip_address, user_agent, expires_at, max_usage
  ) VALUES (
    p_user_id, v_token_hash, p_token_type, p_device_fingerprint, p_ip_address, p_user_agent,
    now() + (p_validity_minutes || ' minutes')::INTERVAL, p_max_usage
  )
  RETURNING id INTO v_token_id;
  
  PERFORM public.add_to_audit_chain(p_user_id, 'token_issued', 'security',
    jsonb_build_object('token_type', p_token_type, 'device', p_device_fingerprint));
  
  RETURN QUERY SELECT v_token_id, v_token_hash;
END;
$$;

-- Function for zero-trust verification
CREATE OR REPLACE FUNCTION public.zero_trust_verify(
  p_user_id UUID,
  p_action TEXT,
  p_device_fingerprint TEXT,
  p_ip_address INET DEFAULT NULL,
  p_geolocation JSONB DEFAULT NULL
)
RETURNS TABLE(allowed BOOLEAN, risk_score DECIMAL, denial_reason TEXT, required_factors TEXT[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed BOOLEAN := true;
  v_risk DECIMAL := 0;
  v_denial TEXT := NULL;
  v_factors TEXT[] := ARRAY[]::TEXT[];
  v_threat_count INT;
  v_failed_logins INT;
  v_whitelist_check BOOLEAN;
  v_anomalies JSONB := '[]'::jsonb;
BEGIN
  SELECT COUNT(*) INTO v_threat_count
  FROM public.threat_intelligence
  WHERE is_active = true
    AND ((indicator_type = 'fingerprint' AND indicator_value = p_device_fingerprint)
      OR (indicator_type = 'ip' AND indicator_value = p_ip_address::TEXT))
    AND threat_level IN ('critical', 'high');
  
  IF v_threat_count > 0 THEN
    v_risk := v_risk + 0.5;
    v_anomalies := v_anomalies || '["known_threat_indicator"]'::jsonb;
  END IF;
  
  SELECT COUNT(*) INTO v_failed_logins
  FROM public.failed_login_attempts
  WHERE (user_id = p_user_id OR ip_address = p_ip_address)
    AND attempt_time > now() - INTERVAL '1 hour';
  
  IF v_failed_logins > 3 THEN
    v_risk := v_risk + 0.3;
    v_anomalies := v_anomalies || '["multiple_failed_logins"]'::jsonb;
  END IF;
  
  IF p_action IN ('withdrawal', 'role_change', 'system_config', 'data_export') THEN
    SELECT EXISTS(
      SELECT 1 FROM public.login_whitelist
      WHERE user_id = p_user_id AND is_active = true
        AND (allowed_devices IS NULL OR p_device_fingerprint = ANY(allowed_devices))
    ) INTO v_whitelist_check;
    
    IF NOT v_whitelist_check THEN
      v_risk := v_risk + 0.4;
      v_factors := array_append(v_factors, 'whitelist_verification');
    END IF;
  END IF;
  
  IF v_risk >= 0.8 THEN
    v_allowed := false;
    v_denial := 'Risk threshold exceeded';
  ELSIF v_risk >= 0.5 THEN
    v_factors := array_append(v_factors, 'mfa_required');
  END IF;
  
  INSERT INTO public.zero_trust_verifications (
    user_id, verification_type, verification_result, risk_score, device_fingerprint,
    ip_address, geolocation, factors_verified, anomalies_detected, action_allowed, denial_reason
  ) VALUES (
    p_user_id, p_action, v_allowed, v_risk, p_device_fingerprint,
    p_ip_address, p_geolocation, to_jsonb(v_factors), v_anomalies, v_allowed, v_denial
  );
  
  PERFORM public.add_to_audit_chain(p_user_id, 'zero_trust_check', 'security',
    jsonb_build_object('action', p_action, 'result', v_allowed, 'risk_score', v_risk));
  
  RETURN QUERY SELECT v_allowed, v_risk, v_denial, v_factors;
END;
$$;

-- Function to create threat alert
CREATE OR REPLACE FUNCTION public.create_threat_alert(
  p_threat_level TEXT,
  p_alert_type TEXT,
  p_title TEXT,
  p_description TEXT,
  p_affected_user_id UUID DEFAULT NULL,
  p_affected_module TEXT DEFAULT NULL,
  p_source_ip INET DEFAULT NULL,
  p_device_fingerprint TEXT DEFAULT NULL,
  p_ai_confidence DECIMAL DEFAULT NULL,
  p_recommended_action TEXT DEFAULT NULL,
  p_auto_mitigate BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alert_id UUID;
  v_alert_code TEXT;
BEGIN
  v_alert_code := 'ALERT-' || to_char(now(), 'YYYYMMDD') || '-' || encode(gen_random_bytes(4), 'hex');
  
  INSERT INTO public.realtime_threat_alerts (
    alert_id, threat_level, alert_type, title, description, affected_user_id,
    affected_module, source_ip, device_fingerprint, ai_confidence, recommended_action, auto_mitigated
  ) VALUES (
    v_alert_code, p_threat_level, p_alert_type, p_title, p_description, p_affected_user_id,
    p_affected_module, p_source_ip, p_device_fingerprint, p_ai_confidence, p_recommended_action, p_auto_mitigate
  )
  RETURNING id INTO v_alert_id;
  
  IF p_auto_mitigate AND p_affected_user_id IS NOT NULL THEN
    UPDATE public.security_tokens
    SET revoked_at = now(), revoked_reason = 'auto_mitigation:' || p_alert_type
    WHERE user_id = p_affected_user_id AND revoked_at IS NULL;
    
    UPDATE public.user_sessions
    SET force_logout = true, logout_reason = 'Security alert: ' || p_title
    WHERE user_id = p_affected_user_id AND is_active = true;
  END IF;
  
  PERFORM public.add_to_audit_chain(p_affected_user_id, 'threat_alert_created', 'security',
    jsonb_build_object('alert_id', v_alert_code, 'level', p_threat_level, 'auto_mitigated', p_auto_mitigate));
  
  RETURN v_alert_id;
END;
$$;