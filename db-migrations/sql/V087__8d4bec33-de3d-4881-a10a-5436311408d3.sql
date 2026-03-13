-- ════════════════════════════════════════════════════════════════
-- SECURITY FUNCTIONS & TRIGGERS - ZERO TRUST ENFORCEMENT
-- ════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════
-- 1. HASH CHAIN GENERATOR FOR BLACKBOX
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.generate_blackbox_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_sequence BIGINT;
    v_previous_hash TEXT;
    v_event_hash TEXT;
    v_chain_hash TEXT;
BEGIN
    -- Get next sequence number
    SELECT COALESCE(MAX(sequence_number), 0) + 1 INTO v_sequence
    FROM public.master_blackbox_hash_chain;
    
    -- Get previous hash (or genesis hash for first record)
    IF v_sequence = 1 THEN
        v_previous_hash := encode(sha256('GENESIS_BLOCK_MASTER_ADMIN'::bytea), 'hex');
    ELSE
        SELECT chain_hash INTO v_previous_hash
        FROM public.master_blackbox_hash_chain
        WHERE sequence_number = v_sequence - 1;
    END IF;
    
    -- Generate event hash from blackbox event data
    v_event_hash := encode(sha256(
        (NEW.id::text || NEW.event_type || NEW.module_name || 
         COALESCE(NEW.user_id::text, '') || NEW.created_at::text)::bytea
    ), 'hex');
    
    -- Generate chain hash
    v_chain_hash := encode(sha256((v_event_hash || v_previous_hash)::bytea), 'hex');
    
    -- Insert into hash chain
    INSERT INTO public.master_blackbox_hash_chain (
        blackbox_event_id, sequence_number, event_hash, previous_hash, chain_hash
    ) VALUES (
        NEW.id, v_sequence, v_event_hash, v_previous_hash, v_chain_hash
    );
    
    RETURN NEW;
END;
$$;

-- Trigger to auto-generate hash chain on blackbox insert
DROP TRIGGER IF EXISTS trg_blackbox_hash_chain ON public.blackbox_events;
CREATE TRIGGER trg_blackbox_hash_chain
    AFTER INSERT ON public.blackbox_events
    FOR EACH ROW EXECUTE FUNCTION public.generate_blackbox_hash();

-- ═══════════════════════════════════════════
-- 2. COMPREHENSIVE ACCESS CONTROL CHECK
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.master_check_access(
    p_user_id UUID,
    p_action TEXT,
    p_module TEXT DEFAULT NULL,
    p_entity_type TEXT DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_device_fingerprint TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB;
    v_system_lock_passed BOOLEAN := true;
    v_user_status_passed BOOLEAN := true;
    v_role_scope_passed BOOLEAN := true;
    v_permission_passed BOOLEAN := true;
    v_rental_passed BOOLEAN := true;
    v_risk_score_passed BOOLEAN := true;
    v_denial_reason TEXT;
    v_user_role TEXT;
    v_user_status TEXT;
    v_risk_score INTEGER := 0;
    v_final_result BOOLEAN := true;
BEGIN
    -- CHECK 1: SYSTEM LOCK
    IF EXISTS (
        SELECT 1 FROM public.master_system_locks
        WHERE lock_scope = 'global' AND released_at IS NULL
    ) THEN
        v_system_lock_passed := false;
        v_denial_reason := 'System is globally locked';
        v_final_result := false;
    END IF;
    
    -- Check user-specific lock
    IF v_final_result AND EXISTS (
        SELECT 1 FROM public.master_system_locks
        WHERE lock_scope = 'user' AND target_id = p_user_id AND released_at IS NULL
    ) THEN
        v_system_lock_passed := false;
        v_denial_reason := 'User is locked';
        v_final_result := false;
    END IF;
    
    -- CHECK 2: USER STATUS
    IF v_final_result THEN
        SELECT role::text, approval_status INTO v_user_role, v_user_status
        FROM public.user_roles
        WHERE user_id = p_user_id;
        
        IF v_user_status != 'approved' THEN
            v_user_status_passed := false;
            v_denial_reason := 'User not approved: ' || COALESCE(v_user_status, 'no status');
            v_final_result := false;
        END IF;
    END IF;
    
    -- CHECK 3: ROLE SCOPE (simplified - would need more complex logic in production)
    IF v_final_result AND v_user_role IS NULL THEN
        v_role_scope_passed := false;
        v_denial_reason := 'No role assigned';
        v_final_result := false;
    END IF;
    
    -- CHECK 4: PERMISSION
    IF v_final_result AND p_action IS NOT NULL THEN
        IF NOT public.master_user_has_permission(p_user_id, p_action) THEN
            v_permission_passed := false;
            v_denial_reason := 'Permission denied for action: ' || p_action;
            v_final_result := false;
        END IF;
    END IF;
    
    -- CHECK 5: RENTAL VALIDITY (if module requires rental)
    IF v_final_result AND p_module IS NOT NULL THEN
        -- Check if module is a rentable feature
        IF EXISTS (SELECT 1 FROM public.master_rentable_features WHERE module_name = p_module) THEN
            IF NOT public.check_rental_active(p_user_id, p_module) THEN
                v_rental_passed := false;
                v_denial_reason := 'Rental expired or not active for: ' || p_module;
                v_final_result := false;
            END IF;
        END IF;
    END IF;
    
    -- CHECK 6: RISK SCORE
    IF v_final_result THEN
        SELECT current_score INTO v_risk_score
        FROM public.risk_scores
        WHERE user_id = p_user_id;
        
        v_risk_score := COALESCE(v_risk_score, 0);
        
        IF v_risk_score >= 90 THEN
            v_risk_score_passed := false;
            v_denial_reason := 'Risk score too high: ' || v_risk_score;
            v_final_result := false;
        END IF;
    END IF;
    
    -- LOG ACCESS CHECK
    INSERT INTO public.master_access_checks (
        user_id, action, module, entity_type, entity_id,
        system_lock_passed, user_status_passed, role_scope_passed,
        permission_passed, rental_passed, risk_score_passed,
        final_result, denial_reason, risk_score,
        ip_address, device_fingerprint
    ) VALUES (
        p_user_id, p_action, p_module, p_entity_type, p_entity_id,
        v_system_lock_passed, v_user_status_passed, v_role_scope_passed,
        v_permission_passed, v_rental_passed, v_risk_score_passed,
        v_final_result, v_denial_reason, v_risk_score,
        p_ip_address, p_device_fingerprint
    );
    
    -- Build result
    v_result := jsonb_build_object(
        'allowed', v_final_result,
        'checks', jsonb_build_object(
            'system_lock', v_system_lock_passed,
            'user_status', v_user_status_passed,
            'role_scope', v_role_scope_passed,
            'permission', v_permission_passed,
            'rental', v_rental_passed,
            'risk_score', v_risk_score_passed
        ),
        'denial_reason', v_denial_reason,
        'risk_score', v_risk_score,
        'user_role', v_user_role
    );
    
    RETURN v_result;
END;
$$;

-- ═══════════════════════════════════════════
-- 3. RATE LIMIT CHECK FUNCTION
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.master_check_rate_limit(
    p_endpoint TEXT,
    p_identifier TEXT,
    p_identifier_type TEXT -- 'ip' or 'user'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_limit RECORD;
    v_tracking RECORD;
    v_is_blocked BOOLEAN := false;
    v_remaining INTEGER;
    v_reset_at TIMESTAMPTZ;
    v_cooldown_until TIMESTAMPTZ;
BEGIN
    -- Get rate limit config for endpoint
    SELECT * INTO v_limit
    FROM public.master_rate_limits
    WHERE (endpoint = p_endpoint OR endpoint = '/api/*')
    AND limit_type = p_identifier_type
    AND is_active = true
    LIMIT 1;
    
    IF v_limit IS NULL THEN
        -- No rate limit configured, allow
        RETURN jsonb_build_object('allowed', true, 'remaining', -1);
    END IF;
    
    -- Get or create tracking record
    SELECT * INTO v_tracking
    FROM public.master_rate_limit_tracking
    WHERE rate_limit_id = v_limit.id
    AND identifier = p_identifier
    AND identifier_type = p_identifier_type;
    
    IF v_tracking IS NULL THEN
        -- First request, create tracking
        INSERT INTO public.master_rate_limit_tracking (
            rate_limit_id, identifier, identifier_type, request_count, window_start
        ) VALUES (
            v_limit.id, p_identifier, p_identifier_type, 1, now()
        );
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', v_limit.max_requests - 1,
            'reset_at', now() + (v_limit.window_seconds || ' seconds')::interval
        );
    END IF;
    
    -- Check if in cooldown
    IF v_tracking.cooldown_until IS NOT NULL AND v_tracking.cooldown_until > now() THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'remaining', 0,
            'cooldown_until', v_tracking.cooldown_until,
            'reason', 'Rate limit cooldown active'
        );
    END IF;
    
    -- Check if window expired
    IF v_tracking.window_start + (v_limit.window_seconds || ' seconds')::interval < now() THEN
        -- Reset window
        UPDATE public.master_rate_limit_tracking
        SET request_count = 1, window_start = now(), is_blocked = false, cooldown_until = NULL
        WHERE id = v_tracking.id;
        
        RETURN jsonb_build_object(
            'allowed', true,
            'remaining', v_limit.max_requests - 1,
            'reset_at', now() + (v_limit.window_seconds || ' seconds')::interval
        );
    END IF;
    
    -- Check if limit exceeded
    IF v_tracking.request_count >= v_limit.max_requests THEN
        -- Apply cooldown
        v_cooldown_until := now() + (v_limit.cooldown_seconds || ' seconds')::interval;
        
        UPDATE public.master_rate_limit_tracking
        SET is_blocked = true, cooldown_until = v_cooldown_until
        WHERE id = v_tracking.id;
        
        -- Log security threat
        INSERT INTO public.master_security_threats (
            threat_type, severity, source_ip, source_user_id,
            target_entity, threat_data, auto_response
        ) VALUES (
            'rate_limit_exceeded', 'medium',
            CASE WHEN p_identifier_type = 'ip' THEN p_identifier ELSE NULL END,
            CASE WHEN p_identifier_type = 'user' THEN p_identifier::uuid ELSE NULL END,
            p_endpoint,
            jsonb_build_object('requests', v_tracking.request_count, 'limit', v_limit.max_requests),
            'cooldown'
        );
        
        RETURN jsonb_build_object(
            'allowed', false,
            'remaining', 0,
            'cooldown_until', v_cooldown_until,
            'reason', 'Rate limit exceeded'
        );
    END IF;
    
    -- Increment counter
    UPDATE public.master_rate_limit_tracking
    SET request_count = request_count + 1
    WHERE id = v_tracking.id;
    
    v_remaining := v_limit.max_requests - v_tracking.request_count - 1;
    v_reset_at := v_tracking.window_start + (v_limit.window_seconds || ' seconds')::interval;
    
    RETURN jsonb_build_object(
        'allowed', true,
        'remaining', v_remaining,
        'reset_at', v_reset_at
    );
END;
$$;

-- ═══════════════════════════════════════════
-- 4. REPLAY ATTACK PROTECTION
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.master_check_replay(
    p_request_id TEXT,
    p_request_hash TEXT,
    p_user_id UUID,
    p_endpoint TEXT,
    p_ip_address TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_existing RECORD;
BEGIN
    -- Clean up expired entries
    DELETE FROM public.master_replay_protection WHERE expires_at < now();
    
    -- Check if request ID already used
    SELECT * INTO v_existing
    FROM public.master_replay_protection
    WHERE request_id = p_request_id OR request_hash = p_request_hash;
    
    IF v_existing IS NOT NULL THEN
        -- Log replay attack
        INSERT INTO public.master_security_threats (
            threat_type, severity, source_ip, source_user_id,
            target_entity, threat_data, auto_response
        ) VALUES (
            'replay_attack', 'high', p_ip_address, p_user_id,
            p_endpoint,
            jsonb_build_object('request_id', p_request_id, 'original_used_at', v_existing.used_at),
            'block'
        );
        
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'Replay attack detected'
        );
    END IF;
    
    -- Store request for future checking (expires in 5 minutes)
    INSERT INTO public.master_replay_protection (
        request_id, request_hash, user_id, endpoint, ip_address, expires_at
    ) VALUES (
        p_request_id, p_request_hash, p_user_id, p_endpoint, p_ip_address,
        now() + interval '5 minutes'
    );
    
    RETURN jsonb_build_object('allowed', true);
END;
$$;

-- ═══════════════════════════════════════════
-- 5. LOGIN SECURITY CHECK
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.master_check_login_security(
    p_email TEXT,
    p_ip_address TEXT,
    p_device_fingerprint TEXT,
    p_geo_location TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_failed_attempts INTEGER;
    v_recent_success RECORD;
    v_is_blocked BOOLEAN := false;
    v_require_captcha BOOLEAN := false;
    v_is_anomaly BOOLEAN := false;
    v_anomaly_reasons JSONB := '[]'::jsonb;
    v_risk_score INTEGER := 0;
    v_max_failures INTEGER := 5;
    v_captcha_threshold INTEGER := 3;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    
    -- Get settings
    SELECT (setting_value_encrypted)::integer INTO v_max_failures
    FROM public.master_security_settings WHERE setting_key = 'max_login_failures';
    
    SELECT (setting_value_encrypted)::integer INTO v_captcha_threshold
    FROM public.master_security_settings WHERE setting_key = 'require_captcha_after_failures';
    
    -- Check IP blacklist
    IF EXISTS (
        SELECT 1 FROM public.master_ip_watchlist
        WHERE ip_address = p_ip_address AND blocked = true
    ) THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'IP address is blocked',
            'require_captcha', false
        );
    END IF;
    
    -- Count recent failed attempts for this IP
    SELECT COUNT(*) INTO v_failed_attempts
    FROM public.master_login_attempts
    WHERE ip_address = p_ip_address
    AND attempt_type IN ('failed_password', 'failed_mfa')
    AND created_at > now() - interval '1 hour';
    
    -- Check if should be blocked
    IF v_failed_attempts >= COALESCE(v_max_failures, 5) THEN
        v_is_blocked := true;
        v_risk_score := v_risk_score + 50;
    END IF;
    
    -- Check if captcha required
    IF v_failed_attempts >= COALESCE(v_captcha_threshold, 3) THEN
        v_require_captcha := true;
        v_risk_score := v_risk_score + 20;
    END IF;
    
    -- ANOMALY DETECTION
    IF v_user_id IS NOT NULL THEN
        -- Check for geo anomaly (different location than usual)
        SELECT * INTO v_recent_success
        FROM public.master_login_attempts
        WHERE user_id = v_user_id
        AND attempt_type = 'success'
        ORDER BY created_at DESC
        LIMIT 1;
        
        IF v_recent_success IS NOT NULL AND p_geo_location IS NOT NULL THEN
            IF v_recent_success.geo_location IS NOT NULL 
               AND v_recent_success.geo_location != p_geo_location THEN
                v_is_anomaly := true;
                v_anomaly_reasons := v_anomaly_reasons || '["geo_change"]'::jsonb;
                v_risk_score := v_risk_score + 30;
            END IF;
        END IF;
        
        -- Check for new device
        IF NOT EXISTS (
            SELECT 1 FROM public.master_device_fingerprints
            WHERE user_id = v_user_id
            AND fingerprint_hash = p_device_fingerprint
            AND is_blocked = false
        ) THEN
            v_is_anomaly := true;
            v_anomaly_reasons := v_anomaly_reasons || '["new_device"]'::jsonb;
            v_risk_score := v_risk_score + 20;
        END IF;
    END IF;
    
    RETURN jsonb_build_object(
        'allowed', NOT v_is_blocked,
        'require_captcha', v_require_captcha,
        'is_anomaly', v_is_anomaly,
        'anomaly_reasons', v_anomaly_reasons,
        'risk_score', v_risk_score,
        'failed_attempts', v_failed_attempts,
        'reason', CASE WHEN v_is_blocked THEN 'Too many failed attempts' ELSE NULL END
    );
END;
$$;

-- ═══════════════════════════════════════════
-- 6. REVOKE ALL USER TOKENS
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.master_revoke_user_tokens(
    p_user_id UUID,
    p_reason TEXT,
    p_revoked_by UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.master_token_registry
    SET is_revoked = true,
        revoked_at = now(),
        revoke_reason = p_reason,
        revoked_by = p_revoked_by
    WHERE user_id = p_user_id
    AND is_revoked = false;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    -- Log to blackbox
    INSERT INTO public.blackbox_events (
        event_type, module_name, entity_type, entity_id,
        user_id, metadata
    ) VALUES (
        'token_revoke', 'security', 'user', p_user_id,
        p_revoked_by,
        jsonb_build_object('reason', p_reason, 'tokens_revoked', v_count)
    );
    
    RETURN v_count;
END;
$$;

-- ═══════════════════════════════════════════
-- 7. AUTO THREAT RESPONSE
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.master_auto_threat_response(
    p_threat_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_threat RECORD;
    v_action_taken TEXT;
BEGIN
    SELECT * INTO v_threat FROM public.master_security_threats WHERE id = p_threat_id;
    
    IF v_threat IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Threat not found');
    END IF;
    
    -- Determine action based on severity and type
    CASE v_threat.severity
        WHEN 'critical' THEN
            -- Lock user and revoke tokens
            IF v_threat.source_user_id IS NOT NULL THEN
                INSERT INTO public.master_system_locks (
                    lock_scope, target_id, reason, activated_by
                ) VALUES (
                    'user', v_threat.source_user_id,
                    'Auto-locked: ' || v_threat.threat_type,
                    NULL -- System
                );
                
                PERFORM public.master_revoke_user_tokens(
                    v_threat.source_user_id, 'security_threat', NULL
                );
                
                v_action_taken := 'user_lock';
            END IF;
            
            -- Block IP
            IF v_threat.source_ip IS NOT NULL THEN
                INSERT INTO public.master_ip_watchlist (ip_address, risk_level, blocked)
                VALUES (v_threat.source_ip, 'critical', true)
                ON CONFLICT (ip_address) DO UPDATE SET blocked = true, risk_level = 'critical';
                
                v_action_taken := COALESCE(v_action_taken || ', ', '') || 'ip_block';
            END IF;
            
        WHEN 'high' THEN
            -- Revoke tokens only
            IF v_threat.source_user_id IS NOT NULL THEN
                PERFORM public.master_revoke_user_tokens(
                    v_threat.source_user_id, 'security_threat', NULL
                );
                v_action_taken := 'session_kill';
            END IF;
            
        WHEN 'medium' THEN
            v_action_taken := 'logged_only';
            
        ELSE
            v_action_taken := 'none';
    END CASE;
    
    -- Update threat record
    UPDATE public.master_security_threats
    SET auto_response = v_action_taken,
        auto_response_at = now()
    WHERE id = p_threat_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'action_taken', v_action_taken,
        'threat_id', p_threat_id
    );
END;
$$;

-- ═══════════════════════════════════════════
-- 8. VERIFY HASH CHAIN INTEGRITY
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.master_verify_hash_chain(
    p_start_sequence BIGINT DEFAULT 1,
    p_end_sequence BIGINT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_record RECORD;
    v_expected_hash TEXT;
    v_tampered_count INTEGER := 0;
    v_verified_count INTEGER := 0;
    v_max_sequence BIGINT;
BEGIN
    -- Get max sequence if not specified
    IF p_end_sequence IS NULL THEN
        SELECT MAX(sequence_number) INTO v_max_sequence FROM public.master_blackbox_hash_chain;
    ELSE
        v_max_sequence := p_end_sequence;
    END IF;
    
    FOR v_record IN
        SELECT * FROM public.master_blackbox_hash_chain
        WHERE sequence_number >= p_start_sequence
        AND sequence_number <= v_max_sequence
        ORDER BY sequence_number
    LOOP
        -- Verify chain hash
        v_expected_hash := encode(sha256((v_record.event_hash || v_record.previous_hash)::bytea), 'hex');
        
        IF v_expected_hash != v_record.chain_hash THEN
            -- Mark as tampered
            UPDATE public.master_blackbox_hash_chain
            SET verification_status = 'tampered', verified_at = now()
            WHERE id = v_record.id;
            
            v_tampered_count := v_tampered_count + 1;
            
            -- Log security threat
            INSERT INTO public.master_security_threats (
                threat_type, severity, target_entity, target_id, threat_data
            ) VALUES (
                'blackbox_tampering', 'critical', 'blackbox_hash_chain', v_record.id,
                jsonb_build_object('sequence', v_record.sequence_number, 'expected', v_expected_hash, 'actual', v_record.chain_hash)
            );
        ELSE
            UPDATE public.master_blackbox_hash_chain
            SET verification_status = 'valid', verified_at = now()
            WHERE id = v_record.id;
            
            v_verified_count := v_verified_count + 1;
        END IF;
    END LOOP;
    
    RETURN jsonb_build_object(
        'verified_count', v_verified_count,
        'tampered_count', v_tampered_count,
        'integrity', CASE WHEN v_tampered_count = 0 THEN 'intact' ELSE 'compromised' END,
        'range', jsonb_build_object('start', p_start_sequence, 'end', v_max_sequence)
    );
END;
$$;