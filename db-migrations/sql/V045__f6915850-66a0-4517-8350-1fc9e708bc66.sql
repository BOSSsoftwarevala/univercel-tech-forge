
-- Create OTP verification system for critical actions
CREATE TABLE IF NOT EXISTS public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    otp_code TEXT NOT NULL,
    otp_type TEXT NOT NULL CHECK (otp_type IN ('login', 'action', 'delete', 'edit', 'add', 'remove', 'financial', 'server', 'ai_action')),
    action_description TEXT,
    action_data JSONB,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '5 minutes'),
    verified_at TIMESTAMPTZ,
    is_used BOOLEAN DEFAULT false,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create action approval queue for AI and critical operations
CREATE TABLE IF NOT EXISTS public.action_approval_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    user_role TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('add', 'edit', 'delete', 'remove', 'ai_operation', 'financial', 'server_change', 'config_change')),
    action_target TEXT NOT NULL,
    action_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    otp_required BOOLEAN DEFAULT true,
    otp_verified BOOLEAN DEFAULT false,
    otp_verification_id UUID REFERENCES public.otp_verifications(id),
    email_verified BOOLEAN DEFAULT false,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'otp_pending', 'approved', 'rejected', 'expired', 'cancelled')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    auto_approve_eligible BOOLEAN DEFAULT false,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours'),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user 2FA settings table
CREATE TABLE IF NOT EXISTS public.user_2fa_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    is_2fa_enabled BOOLEAN DEFAULT true,
    preferred_method TEXT DEFAULT 'email' CHECK (preferred_method IN ('email', 'sms', 'authenticator')),
    phone_number TEXT,
    phone_verified BOOLEAN DEFAULT false,
    authenticator_secret TEXT,
    authenticator_verified BOOLEAN DEFAULT false,
    backup_codes TEXT[],
    last_otp_sent_at TIMESTAMPTZ,
    otp_rate_limit_until TIMESTAMPTZ,
    trusted_devices JSONB DEFAULT '[]'::jsonb,
    require_otp_for_login BOOLEAN DEFAULT false,
    require_otp_for_actions BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create audit trail for all verified actions
CREATE TABLE IF NOT EXISTS public.verified_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    user_role TEXT,
    action_type TEXT NOT NULL,
    action_target TEXT,
    action_data JSONB,
    otp_verification_id UUID REFERENCES public.otp_verifications(id),
    approval_id UUID REFERENCES public.action_approval_queue(id),
    verification_method TEXT,
    ip_address TEXT,
    user_agent TEXT,
    geo_location TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_action_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for otp_verifications
CREATE POLICY "Users can view own OTP records" ON public.otp_verifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert OTP" ON public.otp_verifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can verify own OTP" ON public.otp_verifications
    FOR UPDATE USING (user_id = auth.uid());

-- RLS policies for action_approval_queue
CREATE POLICY "Users can view own action requests" ON public.action_approval_queue
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all action requests" ON public.action_approval_queue
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'master'))
    );

CREATE POLICY "Users can create action requests" ON public.action_approval_queue
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS policies for user_2fa_settings
CREATE POLICY "Users can manage own 2FA settings" ON public.user_2fa_settings
    FOR ALL USING (user_id = auth.uid());

-- RLS policies for verified_action_logs
CREATE POLICY "Users can view own action logs" ON public.verified_action_logs
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all action logs" ON public.verified_action_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'master'))
    );

-- Function to generate OTP
CREATE OR REPLACE FUNCTION public.generate_otp(
    p_user_id UUID,
    p_otp_type TEXT,
    p_action_description TEXT DEFAULT NULL,
    p_action_data JSONB DEFAULT NULL
) RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_otp TEXT;
    v_otp_id UUID;
BEGIN
    -- Generate 6-digit OTP
    v_otp := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    
    -- Insert OTP record
    INSERT INTO public.otp_verifications (user_id, otp_code, otp_type, action_description, action_data)
    VALUES (p_user_id, v_otp, p_otp_type, p_action_description, p_action_data)
    RETURNING id INTO v_otp_id;
    
    -- Update rate limit
    UPDATE public.user_2fa_settings 
    SET last_otp_sent_at = now()
    WHERE user_id = p_user_id;
    
    RETURN v_otp;
END;
$$;

-- Function to verify OTP
CREATE OR REPLACE FUNCTION public.verify_otp(
    p_user_id UUID,
    p_otp_code TEXT,
    p_otp_type TEXT
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_otp_record RECORD;
    v_result JSONB;
BEGIN
    -- Find valid OTP
    SELECT * INTO v_otp_record
    FROM public.otp_verifications
    WHERE user_id = p_user_id
    AND otp_code = p_otp_code
    AND otp_type = p_otp_type
    AND is_used = false
    AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF v_otp_record IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired OTP');
    END IF;
    
    -- Mark as used
    UPDATE public.otp_verifications
    SET is_used = true, verified_at = now()
    WHERE id = v_otp_record.id;
    
    RETURN jsonb_build_object(
        'success', true, 
        'verification_id', v_otp_record.id,
        'action_data', v_otp_record.action_data
    );
END;
$$;

-- Function to check if action requires OTP
CREATE OR REPLACE FUNCTION public.requires_otp_verification(
    p_user_id UUID,
    p_action_type TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_settings RECORD;
BEGIN
    SELECT * INTO v_settings FROM public.user_2fa_settings WHERE user_id = p_user_id;
    
    -- If no settings, require OTP by default for safety
    IF v_settings IS NULL THEN
        RETURN true;
    END IF;
    
    -- Check if 2FA is enabled and OTP required for actions
    RETURN v_settings.is_2fa_enabled AND v_settings.require_otp_for_actions;
END;
$$;
