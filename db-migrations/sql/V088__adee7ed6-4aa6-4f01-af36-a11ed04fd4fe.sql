-- ============================================
-- SUPER ADMIN CONTROL SYSTEM DATABASE
-- Complete Tracking Architecture
-- ============================================

-- 1. SUPER ADMIN SESSIONS (Login & Session Control)
CREATE TABLE IF NOT EXISTS public.super_admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL,
  device_fingerprint TEXT,
  ip_address TEXT,
  geo_location TEXT,
  user_agent TEXT,
  assigned_scope JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  login_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  logout_at TIMESTAMPTZ,
  logout_reason TEXT,
  force_logged_out BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SUPER ADMIN ACTIONS (Every Click Logged)
CREATE TABLE IF NOT EXISTS public.super_admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.super_admin_sessions(id),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_category TEXT NOT NULL,
  target_entity TEXT,
  target_id UUID,
  action_data JSONB DEFAULT '{}',
  scope_context JSONB DEFAULT '{}',
  ip_address TEXT,
  device_fingerprint TEXT,
  result_status TEXT DEFAULT 'success',
  error_message TEXT,
  duration_ms INTEGER,
  is_sensitive BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SUPER ADMIN SCOPE ASSIGNMENTS (Geographic Control)
CREATE TABLE IF NOT EXISTS public.super_admin_scope_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('global', 'continent', 'country', 'region')),
  scope_value TEXT NOT NULL,
  parent_scope_id UUID REFERENCES public.super_admin_scope_assignments(id),
  assigned_by UUID,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  assignment_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SUPER ADMIN MODULE CONTROLS (Feature & Module Control)
CREATE TABLE IF NOT EXISTS public.super_admin_module_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL,
  scope_type TEXT NOT NULL,
  scope_value TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  enabled_by UUID,
  disabled_by UUID,
  enabled_at TIMESTAMPTZ,
  disabled_at TIMESTAMPTZ,
  access_level TEXT DEFAULT 'full',
  restrictions JSONB DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SUPER ADMIN RENTALS (Rental Management)
CREATE TABLE IF NOT EXISTS public.super_admin_rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL,
  assigned_to UUID NOT NULL,
  assigned_by UUID NOT NULL,
  scope_context JSONB DEFAULT '{}',
  rental_start TIMESTAMPTZ DEFAULT now(),
  rental_end TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  auto_revoke BOOLEAN DEFAULT true,
  extended_count INTEGER DEFAULT 0,
  last_extended_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID,
  revoke_reason TEXT,
  usage_stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SUPER ADMIN RULES (Global Rules - Scope Limited)
CREATE TABLE IF NOT EXISTS public.super_admin_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  rule_logic JSONB NOT NULL,
  scope_type TEXT NOT NULL,
  scope_value TEXT NOT NULL,
  created_by UUID NOT NULL,
  is_active BOOLEAN DEFAULT false,
  is_simulated BOOLEAN DEFAULT false,
  simulation_results JSONB,
  activated_at TIMESTAMPTZ,
  deactivated_at TIMESTAMPTZ,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  impact_assessment JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. SUPER ADMIN RULE EXECUTIONS
CREATE TABLE IF NOT EXISTS public.super_admin_rule_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES public.super_admin_rules(id),
  triggered_by TEXT NOT NULL,
  trigger_context JSONB DEFAULT '{}',
  execution_result TEXT NOT NULL,
  affected_entities JSONB DEFAULT '[]',
  execution_duration_ms INTEGER,
  error_details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SUPER ADMIN APPROVALS (High-Risk Approvals)
CREATE TABLE IF NOT EXISTS public.super_admin_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type TEXT NOT NULL,
  request_data JSONB NOT NULL,
  requested_by UUID NOT NULL,
  requested_by_role TEXT NOT NULL,
  risk_score INTEGER DEFAULT 0,
  risk_factors JSONB DEFAULT '[]',
  scope_context JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  approval_steps JSONB DEFAULT '[]',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SUPER ADMIN SECURITY EVENTS
CREATE TABLE IF NOT EXISTS public.super_admin_security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_ip TEXT,
  target_user_id UUID,
  event_data JSONB DEFAULT '{}',
  scope_context JSONB DEFAULT '{}',
  action_taken TEXT,
  action_taken_by UUID,
  action_taken_at TIMESTAMPTZ,
  is_resolved BOOLEAN DEFAULT false,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. SUPER ADMIN LOCKS (System Lock Operations)
CREATE TABLE IF NOT EXISTS public.super_admin_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_type TEXT NOT NULL CHECK (lock_type IN ('user', 'region', 'module', 'emergency')),
  lock_target TEXT NOT NULL,
  lock_target_id UUID,
  scope_context JSONB DEFAULT '{}',
  locked_by UUID NOT NULL,
  lock_reason TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  force_logout_triggered BOOLEAN DEFAULT false,
  affected_users INTEGER DEFAULT 0,
  unlocked_by UUID,
  unlocked_at TIMESTAMPTZ,
  unlock_reason TEXT,
  is_global_request BOOLEAN DEFAULT false,
  global_request_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. SUPER ADMIN AUDIT ACCESS (Read-Only Audit Logs)
CREATE TABLE IF NOT EXISTS public.super_admin_audit_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.super_admin_sessions(id),
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'filter', 'timeline_replay', 'export_request')),
  accessed_module TEXT NOT NULL,
  filter_criteria JSONB DEFAULT '{}',
  records_viewed INTEGER DEFAULT 0,
  access_duration_seconds INTEGER,
  export_requested BOOLEAN DEFAULT false,
  export_approved BOOLEAN,
  export_approved_by UUID,
  watermark_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. SUPER ADMIN USER MANAGEMENT ACTIONS
CREATE TABLE IF NOT EXISTS public.super_admin_user_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('view', 'suspend', 'lock', 'unlock', 'search', 'filter')),
  action_data JSONB DEFAULT '{}',
  scope_validated BOOLEAN DEFAULT true,
  permission_checked BOOLEAN DEFAULT true,
  result_status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. SUPER ADMIN ADMIN MANAGEMENT
CREATE TABLE IF NOT EXISTS public.super_admin_admin_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  target_admin_id UUID,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'assign_role', 'assign_scope', 'edit', 'suspend', 'lock', 'revoke')),
  role_assigned TEXT,
  scope_assigned JSONB,
  previous_state JSONB DEFAULT '{}',
  new_state JSONB DEFAULT '{}',
  hierarchy_validated BOOLEAN DEFAULT true,
  scope_validated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. SUPER ADMIN AI RISK VIEWS
CREATE TABLE IF NOT EXISTS public.super_admin_risk_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL,
  view_type TEXT NOT NULL CHECK (view_type IN ('user_risk', 'admin_risk', 'anomaly_flags', 'manual_review')),
  target_entity_id UUID,
  risk_score_viewed INTEGER,
  anomaly_data JSONB DEFAULT '{}',
  manual_review_triggered BOOLEAN DEFAULT false,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. SUPER ADMIN LIVE ACTIVITY VIEWS
CREATE TABLE IF NOT EXISTS public.super_admin_live_activity_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.super_admin_sessions(id),
  view_started_at TIMESTAMPTZ DEFAULT now(),
  view_ended_at TIMESTAMPTZ,
  filters_applied JSONB DEFAULT '{}',
  events_observed INTEGER DEFAULT 0,
  alerts_acknowledged INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.super_admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_scope_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_module_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_rule_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_audit_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_admin_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_risk_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_live_activity_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Super Admin tables (Super Admin can access their scope)
CREATE POLICY "Super admins can view their sessions" ON public.super_admin_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can insert sessions" ON public.super_admin_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can update their sessions" ON public.super_admin_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view their actions" ON public.super_admin_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can insert actions" ON public.super_admin_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can view their scope" ON public.super_admin_scope_assignments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view module controls" ON public.super_admin_module_controls
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage module controls" ON public.super_admin_module_controls
  FOR ALL USING (auth.uid() = enabled_by OR auth.uid() = disabled_by);

CREATE POLICY "Super admins can view rentals" ON public.super_admin_rentals
  FOR SELECT USING (auth.uid() = assigned_by OR auth.uid() = assigned_to);

CREATE POLICY "Super admins can manage rentals" ON public.super_admin_rentals
  FOR ALL USING (auth.uid() = assigned_by);

CREATE POLICY "Super admins can view rules" ON public.super_admin_rules
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage their rules" ON public.super_admin_rules
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Super admins can view rule executions" ON public.super_admin_rule_executions
  FOR SELECT USING (true);

CREATE POLICY "Super admins can insert rule executions" ON public.super_admin_rule_executions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super admins can view approvals" ON public.super_admin_approvals
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage approvals" ON public.super_admin_approvals
  FOR ALL USING (auth.uid() = reviewed_by OR auth.uid() = requested_by);

CREATE POLICY "Super admins can view security events" ON public.super_admin_security_events
  FOR SELECT USING (true);

CREATE POLICY "Super admins can insert security events" ON public.super_admin_security_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Super admins can update security events" ON public.super_admin_security_events
  FOR UPDATE USING (auth.uid() = action_taken_by);

CREATE POLICY "Super admins can view locks" ON public.super_admin_locks
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage locks" ON public.super_admin_locks
  FOR ALL USING (auth.uid() = locked_by OR auth.uid() = unlocked_by);

CREATE POLICY "Super admins can view audit access" ON public.super_admin_audit_access
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can insert audit access" ON public.super_admin_audit_access
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can view user actions" ON public.super_admin_user_actions
  FOR SELECT USING (auth.uid() = admin_user_id);

CREATE POLICY "Super admins can insert user actions" ON public.super_admin_user_actions
  FOR INSERT WITH CHECK (auth.uid() = admin_user_id);

CREATE POLICY "Super admins can view admin management" ON public.super_admin_admin_management
  FOR SELECT USING (auth.uid() = actor_id);

CREATE POLICY "Super admins can insert admin management" ON public.super_admin_admin_management
  FOR INSERT WITH CHECK (auth.uid() = actor_id);

CREATE POLICY "Super admins can view risk views" ON public.super_admin_risk_views
  FOR SELECT USING (auth.uid() = viewer_id);

CREATE POLICY "Super admins can insert risk views" ON public.super_admin_risk_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);

CREATE POLICY "Super admins can view live activity" ON public.super_admin_live_activity_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage live activity" ON public.super_admin_live_activity_views
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_sa_sessions_user ON public.super_admin_sessions(user_id);
CREATE INDEX idx_sa_sessions_active ON public.super_admin_sessions(is_active);
CREATE INDEX idx_sa_actions_user ON public.super_admin_actions(user_id);
CREATE INDEX idx_sa_actions_type ON public.super_admin_actions(action_type);
CREATE INDEX idx_sa_actions_created ON public.super_admin_actions(created_at);
CREATE INDEX idx_sa_scope_user ON public.super_admin_scope_assignments(user_id);
CREATE INDEX idx_sa_rentals_active ON public.super_admin_rentals(is_active);
CREATE INDEX idx_sa_rules_active ON public.super_admin_rules(is_active);
CREATE INDEX idx_sa_approvals_status ON public.super_admin_approvals(status);
CREATE INDEX idx_sa_security_severity ON public.super_admin_security_events(severity);
CREATE INDEX idx_sa_locks_active ON public.super_admin_locks(is_active);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_super_admin_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sa_sessions_timestamp BEFORE UPDATE ON public.super_admin_sessions
  FOR EACH ROW EXECUTE FUNCTION update_super_admin_timestamp();

CREATE TRIGGER update_sa_scope_timestamp BEFORE UPDATE ON public.super_admin_scope_assignments
  FOR EACH ROW EXECUTE FUNCTION update_super_admin_timestamp();

CREATE TRIGGER update_sa_modules_timestamp BEFORE UPDATE ON public.super_admin_module_controls
  FOR EACH ROW EXECUTE FUNCTION update_super_admin_timestamp();

CREATE TRIGGER update_sa_rentals_timestamp BEFORE UPDATE ON public.super_admin_rentals
  FOR EACH ROW EXECUTE FUNCTION update_super_admin_timestamp();

CREATE TRIGGER update_sa_rules_timestamp BEFORE UPDATE ON public.super_admin_rules
  FOR EACH ROW EXECUTE FUNCTION update_super_admin_timestamp();

CREATE TRIGGER update_sa_approvals_timestamp BEFORE UPDATE ON public.super_admin_approvals
  FOR EACH ROW EXECUTE FUNCTION update_super_admin_timestamp();

CREATE TRIGGER update_sa_locks_timestamp BEFORE UPDATE ON public.super_admin_locks
  FOR EACH ROW EXECUTE FUNCTION update_super_admin_timestamp();