-- Add trusted devices table
CREATE TABLE public.trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_name TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  location TEXT,
  is_trusted BOOLEAN DEFAULT false,
  trust_expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ,
  revoked_by UUID,
  UNIQUE(user_id, device_fingerprint)
);

-- Add backup codes table for 2FA recovery
CREATE TABLE public.backup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code_hash TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add password verification log
CREATE TABLE public.password_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  device_fingerprint TEXT,
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '5 minutes')
);

-- Add critical action types enum
DO $$ BEGIN
  CREATE TYPE critical_action_type AS ENUM (
    'delete_data',
    'edit_financial',
    'add_user',
    'remove_user',
    'change_role',
    'server_action',
    'bulk_operation',
    'export_data',
    'change_settings',
    'ai_action'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add session security table
CREATE TABLE public.session_security (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  session_token_hash TEXT,
  session_started_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  session_timeout_minutes INTEGER DEFAULT 30,
  force_logout_at TIMESTAMPTZ,
  ip_locked BOOLEAN DEFAULT false,
  allowed_ips TEXT[],
  require_password_for_delete BOOLEAN DEFAULT true,
  require_password_for_financial BOOLEAN DEFAULT true,
  require_email_verify_for_critical BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Super Admin approval queue view enhancements
ALTER TABLE public.action_approval_queue 
ADD COLUMN IF NOT EXISTS password_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS password_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_link_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS email_link_token TEXT,
ADD COLUMN IF NOT EXISTS email_link_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS device_trusted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_risk_assessment JSONB;

-- Enable RLS
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_security ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trusted_devices
CREATE POLICY "Users can view own trusted devices"
ON public.trusted_devices FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own trusted devices"
ON public.trusted_devices FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for backup_codes
CREATE POLICY "Users can view own backup codes"
ON public.backup_codes FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own backup codes"
ON public.backup_codes FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for password_verifications
CREATE POLICY "Users can view own password verifications"
ON public.password_verifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create password verifications"
ON public.password_verifications FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- RLS Policies for session_security
CREATE POLICY "Users can view own session security"
ON public.session_security FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can manage own session security"
ON public.session_security FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- Super admins can view all
CREATE POLICY "Super admins can view all devices"
ON public.trusted_devices FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can view all sessions"
ON public.session_security FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Function to check if device is trusted
CREATE OR REPLACE FUNCTION public.is_device_trusted(p_user_id UUID, p_fingerprint TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trusted_devices
    WHERE user_id = p_user_id
    AND device_fingerprint = p_fingerprint
    AND is_trusted = true
    AND revoked_at IS NULL
    AND (trust_expires_at IS NULL OR trust_expires_at > now())
  )
$$;

-- Function to check if password was recently verified
CREATE OR REPLACE FUNCTION public.is_password_recently_verified(p_user_id UUID, p_action_type TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.password_verifications
    WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND expires_at > now()
  )
$$;

-- Function to generate backup codes
CREATE OR REPLACE FUNCTION public.generate_backup_codes(p_user_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  codes TEXT[] := ARRAY[]::TEXT[];
  i INTEGER;
  code TEXT;
BEGIN
  -- Delete existing unused codes
  DELETE FROM public.backup_codes WHERE user_id = p_user_id AND is_used = false;
  
  -- Generate 10 new codes
  FOR i IN 1..10 LOOP
    code := upper(substr(md5(random()::text), 1, 4) || '-' || substr(md5(random()::text), 1, 4));
    codes := array_append(codes, code);
    
    INSERT INTO public.backup_codes (user_id, code_hash)
    VALUES (p_user_id, encode(sha256(code::bytea), 'hex'));
  END LOOP;
  
  RETURN codes;
END;
$$;

-- Function to verify backup code
CREATE OR REPLACE FUNCTION public.verify_backup_code(p_user_id UUID, p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_id UUID;
BEGIN
  SELECT id INTO code_id
  FROM public.backup_codes
  WHERE user_id = p_user_id
  AND code_hash = encode(sha256(upper(p_code)::bytea), 'hex')
  AND is_used = false
  LIMIT 1;
  
  IF code_id IS NOT NULL THEN
    UPDATE public.backup_codes
    SET is_used = true, used_at = now()
    WHERE id = code_id;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Function to check session validity
CREATE OR REPLACE FUNCTION public.check_session_valid(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_rec RECORD;
BEGIN
  SELECT * INTO session_rec FROM public.session_security WHERE user_id = p_user_id;
  
  IF session_rec IS NULL THEN
    RETURN jsonb_build_object('valid', true, 'reason', 'no_restrictions');
  END IF;
  
  -- Check force logout
  IF session_rec.force_logout_at IS NOT NULL AND session_rec.force_logout_at > session_rec.session_started_at THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'force_logout');
  END IF;
  
  -- Check session timeout
  IF session_rec.last_activity_at + (session_rec.session_timeout_minutes || ' minutes')::interval < now() THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'session_timeout');
  END IF;
  
  RETURN jsonb_build_object('valid', true, 'reason', 'active');
END;
$$;