-- Create activity log types enum
CREATE TYPE public.activity_action_type AS ENUM (
  'login',
  'logout',
  'page_navigation',
  'demo_interaction',
  'copy_attempt',
  'link_edit',
  'approval_request',
  'force_logout',
  'task_update',
  'lead_action',
  'chat_message',
  'file_access',
  'settings_change',
  'error'
);

-- Create activity status enum
CREATE TYPE public.activity_status AS ENUM (
  'success',
  'fail',
  'blocked',
  'pending',
  'warning'
);

-- Create live activity logs table
CREATE TABLE public.live_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_role public.app_role NOT NULL,
  action_type public.activity_action_type NOT NULL,
  action_description TEXT,
  status public.activity_status DEFAULT 'success',
  page_url TEXT,
  ip_address TEXT,
  device_info TEXT,
  user_agent TEXT,
  duration_seconds INTEGER DEFAULT 0,
  is_abnormal BOOLEAN DEFAULT false,
  abnormal_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_live_activity_logs_user_id ON public.live_activity_logs(user_id);
CREATE INDEX idx_live_activity_logs_created_at ON public.live_activity_logs(created_at DESC);
CREATE INDEX idx_live_activity_logs_action_type ON public.live_activity_logs(action_type);
CREATE INDEX idx_live_activity_logs_user_role ON public.live_activity_logs(user_role);

-- Enable RLS
ALTER TABLE public.live_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Master can view all logs
CREATE POLICY "master_view_all_logs" ON public.live_activity_logs
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'master'));

-- RLS Policy: Super Admin can view all logs except master logs
CREATE POLICY "super_admin_view_non_master_logs" ON public.live_activity_logs
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') 
  AND user_role != 'master'
);

-- RLS Policy: Users can view their own logs
CREATE POLICY "users_view_own_logs" ON public.live_activity_logs
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- RLS Policy: System can insert logs (service role or authenticated users for their own actions)
CREATE POLICY "insert_own_logs" ON public.live_activity_logs
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create user online status table
CREATE TABLE public.user_online_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  user_role public.app_role NOT NULL,
  is_online BOOLEAN DEFAULT false,
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  session_started_at TIMESTAMPTZ,
  current_page TEXT,
  device_info TEXT,
  ip_address TEXT,
  force_logged_out BOOLEAN DEFAULT false,
  pending_approval BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_online_status ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Master can view all status
CREATE POLICY "master_view_all_status" ON public.user_online_status
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'master'));

-- RLS Policy: Super Admin can view all except master
CREATE POLICY "super_admin_view_non_master_status" ON public.user_online_status
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin') 
  AND user_role != 'master'
);

-- RLS Policy: Users can view and update their own status
CREATE POLICY "users_manage_own_status" ON public.user_online_status
FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_online_status;

-- Function to log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_action_type public.activity_action_type,
  p_description TEXT DEFAULT NULL,
  p_status public.activity_status DEFAULT 'success',
  p_page_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role public.app_role;
  v_log_id UUID;
BEGIN
  -- Get user role
  SELECT role INTO v_user_role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
  
  -- Insert activity log
  INSERT INTO public.live_activity_logs (
    user_id, user_role, action_type, action_description, status, page_url, metadata
  ) VALUES (
    auth.uid(), v_user_role, p_action_type, p_description, p_status, p_page_url, p_metadata
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Function to update online status
CREATE OR REPLACE FUNCTION public.update_online_status(
  p_is_online BOOLEAN,
  p_current_page TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role public.app_role;
BEGIN
  -- Get user role
  SELECT role INTO v_user_role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
  
  -- Upsert online status
  INSERT INTO public.user_online_status (user_id, user_role, is_online, current_page, session_started_at)
  VALUES (auth.uid(), v_user_role, p_is_online, p_current_page, CASE WHEN p_is_online THEN now() ELSE NULL END)
  ON CONFLICT (user_id) DO UPDATE SET
    is_online = p_is_online,
    last_seen_at = now(),
    current_page = COALESCE(p_current_page, user_online_status.current_page),
    session_started_at = CASE WHEN p_is_online AND user_online_status.session_started_at IS NULL THEN now() ELSE user_online_status.session_started_at END,
    updated_at = now();
  
  RETURN TRUE;
END;
$$;