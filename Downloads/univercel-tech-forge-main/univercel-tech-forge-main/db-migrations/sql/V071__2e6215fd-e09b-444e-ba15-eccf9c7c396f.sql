-- Create server_instances table for server management
CREATE TABLE IF NOT EXISTS public.server_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_name TEXT NOT NULL,
  server_type TEXT CHECK (server_type IN ('production', 'staging', 'backup', 'ai', 'database')) DEFAULT 'production',
  continent TEXT,
  country TEXT,
  data_center TEXT,
  ip_address TEXT,
  status TEXT CHECK (status IN ('active', 'down', 'maintenance', 'isolated')) DEFAULT 'active',
  cpu_usage DECIMAL(5,2) DEFAULT 0,
  ram_usage DECIMAL(5,2) DEFAULT 0,
  disk_usage DECIMAL(5,2) DEFAULT 0,
  uptime_percent DECIMAL(5,2) DEFAULT 100,
  last_health_check TIMESTAMPTZ,
  last_restart TIMESTAMPTZ,
  auto_scaling_enabled BOOLEAN DEFAULT false,
  security_risk_level TEXT CHECK (security_risk_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  last_patch_date TIMESTAMPTZ,
  backup_status TEXT CHECK (backup_status IN ('healthy', 'warning', 'failed')) DEFAULT 'healthy',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create server_manager_accounts table
CREATE TABLE IF NOT EXISTS public.server_manager_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  assigned_servers UUID[] DEFAULT '{}',
  assigned_continents TEXT[] DEFAULT '{}',
  can_restart_production BOOLEAN DEFAULT false,
  can_restore_backups BOOLEAN DEFAULT false,
  max_approval_level TEXT CHECK (max_approval_level IN ('low', 'medium')) DEFAULT 'low',
  last_login_time TIMESTAMPTZ,
  login_device TEXT,
  ip_locked BOOLEAN DEFAULT true,
  allowed_ips TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create server_actions table for approval workflow
CREATE TABLE IF NOT EXISTS public.server_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id),
  action_type TEXT CHECK (action_type IN ('restart', 'scale_up', 'scale_down', 'patch', 'backup', 'restore', 'isolate', 'enable_service', 'disable_service')) NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')) NOT NULL,
  requested_by UUID NOT NULL,
  approval_status TEXT CHECK (approval_status IN ('pending', 'approved', 'rejected', 'auto_approved')) DEFAULT 'pending',
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  executed_at TIMESTAMPTZ,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create server_alerts table
CREATE TABLE IF NOT EXISTS public.server_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id),
  alert_type TEXT CHECK (alert_type IN ('high_cpu', 'high_ram', 'disk_full', 'unreachable', 'security_breach', 'ddos', 'memory_leak', 'auto_scale')) NOT NULL,
  severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'warning',
  message TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create server_audit_logs table (immutable)
CREATE TABLE IF NOT EXISTS public.server_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id),
  action TEXT NOT NULL,
  performed_by UUID NOT NULL,
  device_fingerprint TEXT,
  ip_address TEXT,
  before_state JSONB,
  after_state JSONB,
  risk_level TEXT,
  approval_id UUID REFERENCES public.server_actions(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.server_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_manager_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security function
CREATE OR REPLACE FUNCTION public.is_server_manager(_user_id uuid)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role IN ('server_manager', 'super_admin', 'master')
  )
$$;

-- RLS Policies
CREATE POLICY "Server managers can view servers" ON public.server_instances FOR SELECT USING (public.is_server_manager(auth.uid()));
CREATE POLICY "Admins can modify servers" ON public.server_instances FOR ALL USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'master'));

CREATE POLICY "Server managers view own account" ON public.server_manager_accounts FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'master'));

CREATE POLICY "Server managers view actions" ON public.server_actions FOR SELECT USING (public.is_server_manager(auth.uid()));
CREATE POLICY "Server managers create actions" ON public.server_actions FOR INSERT WITH CHECK (public.is_server_manager(auth.uid()));

CREATE POLICY "Server managers view alerts" ON public.server_alerts FOR SELECT USING (public.is_server_manager(auth.uid()));
CREATE POLICY "Server managers update alerts" ON public.server_alerts FOR UPDATE USING (public.is_server_manager(auth.uid()));

CREATE POLICY "Server managers view audit logs" ON public.server_audit_logs FOR SELECT USING (public.is_server_manager(auth.uid()));
CREATE POLICY "No delete on audit logs" ON public.server_audit_logs FOR DELETE USING (false);