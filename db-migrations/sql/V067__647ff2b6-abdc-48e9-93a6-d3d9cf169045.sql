-- Super Admin Global Control Center Tables

-- TABLE: super_admin - Core super admin profiles
CREATE TABLE public.super_admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  continent TEXT NOT NULL,
  login_status TEXT DEFAULT 'offline' CHECK (login_status IN ('online', 'offline', 'away', 'busy')),
  current_device TEXT,
  last_login_time TIMESTAMP WITH TIME ZONE,
  risk_score INTEGER DEFAULT 0,
  countries_managed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: admin_area_manager - Country-level managers
CREATE TABLE public.admin_area_manager (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  country TEXT NOT NULL,
  assigned_super_admin_id UUID REFERENCES public.super_admin(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  current_activity TEXT,
  login_device TEXT,
  last_login_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: role_activity_log - All role actions tracking
CREATE TABLE public.role_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_type app_role NOT NULL,
  role_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_object TEXT,
  ip_address TEXT,
  device TEXT,
  geo_location TEXT,
  risk_flag TEXT DEFAULT 'green' CHECK (risk_flag IN ('green', 'yellow', 'red')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: sa_approval_queue - Super Admin approval workflow
CREATE TABLE public.sa_approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by_role app_role NOT NULL,
  requested_by_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_payload JSONB DEFAULT '{}'::jsonb,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by_super_admin_id UUID REFERENCES public.super_admin(id),
  review_time TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: task_master - Task management
CREATE TABLE public.task_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by_super_admin_id UUID REFERENCES public.super_admin(id),
  assigned_to_role app_role NOT NULL,
  assigned_to_id UUID,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: task_activity - Task progress tracking
CREATE TABLE public.task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.task_master(id) ON DELETE CASCADE,
  performed_by_role app_role NOT NULL,
  performed_by_id UUID NOT NULL,
  action TEXT NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: system_alerts - System-wide alerts
CREATE TABLE public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table TEXT NOT NULL,
  source_id UUID,
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical', 'emergency')),
  title TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  auto_action_taken TEXT,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: ai_insights - AI-generated insights
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT DEFAULT 'global' CHECK (scope IN ('global', 'continent', 'country', 'role')),
  scope_value TEXT,
  related_role app_role,
  issue_detected TEXT NOT NULL,
  suggested_action TEXT,
  confidence_score NUMERIC(5,2) DEFAULT 0,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- TABLE: audit_lock - Immutable audit records
CREATE TABLE public.audit_lock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_ref_id UUID NOT NULL,
  locked_by TEXT DEFAULT 'system',
  lock_reason TEXT NOT NULL,
  unlock_condition TEXT,
  is_locked BOOLEAN DEFAULT true,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  unlocked_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.super_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_area_manager ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sa_approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_lock ENABLE ROW LEVEL SECURITY;

-- RLS Policies for super_admin
CREATE POLICY "Super admins can view all super admins"
  ON public.super_admin FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Master can manage super admins"
  ON public.super_admin FOR ALL
  USING (has_role(auth.uid(), 'master'));

-- RLS Policies for admin_area_manager
CREATE POLICY "Super admins can view area managers"
  ON public.admin_area_manager FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Super admins can manage area managers"
  ON public.admin_area_manager FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

-- RLS Policies for role_activity_log
CREATE POLICY "Super admins can view activity logs"
  ON public.role_activity_log FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "System can insert activity logs"
  ON public.role_activity_log FOR INSERT
  WITH CHECK (true);

-- RLS Policies for sa_approval_queue
CREATE POLICY "Super admins can view approval queue"
  ON public.sa_approval_queue FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Super admins can manage approvals"
  ON public.sa_approval_queue FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Users can create approval requests"
  ON public.sa_approval_queue FOR INSERT
  WITH CHECK (true);

-- RLS Policies for task_master
CREATE POLICY "Super admins can view tasks"
  ON public.task_master FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Super admins can manage tasks"
  ON public.task_master FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

-- RLS Policies for task_activity
CREATE POLICY "Super admins can view task activities"
  ON public.task_activity FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "System can insert task activities"
  ON public.task_activity FOR INSERT
  WITH CHECK (true);

-- RLS Policies for system_alerts
CREATE POLICY "Super admins can view alerts"
  ON public.system_alerts FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Super admins can manage alerts"
  ON public.system_alerts FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "System can create alerts"
  ON public.system_alerts FOR INSERT
  WITH CHECK (true);

-- RLS Policies for ai_insights
CREATE POLICY "Super admins can view AI insights"
  ON public.ai_insights FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Super admins can acknowledge insights"
  ON public.ai_insights FOR UPDATE
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "System can create AI insights"
  ON public.ai_insights FOR INSERT
  WITH CHECK (true);

-- RLS Policies for audit_lock
CREATE POLICY "Super admins can view audit locks"
  ON public.audit_lock FOR SELECT
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'master'));

CREATE POLICY "Only master can manage audit locks"
  ON public.audit_lock FOR ALL
  USING (has_role(auth.uid(), 'master'));

-- Create indexes for performance
CREATE INDEX idx_role_activity_log_role ON public.role_activity_log(role_type, role_id);
CREATE INDEX idx_role_activity_log_risk ON public.role_activity_log(risk_flag) WHERE risk_flag != 'green';
CREATE INDEX idx_sa_approval_queue_status ON public.sa_approval_queue(status) WHERE status = 'pending';
CREATE INDEX idx_task_master_status ON public.task_master(status);
CREATE INDEX idx_system_alerts_status ON public.system_alerts(status) WHERE status = 'active';
CREATE INDEX idx_ai_insights_scope ON public.ai_insights(scope, is_acknowledged);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.role_activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sa_approval_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_insights;