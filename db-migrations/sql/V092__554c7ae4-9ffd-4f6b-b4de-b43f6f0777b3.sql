-- ============================================
-- SUPER ADMIN CONTROL SYSTEM - ADDITIONAL ERD ENTITIES
-- Only creating tables that don't already exist
-- ============================================

-- ENTITY: SUPER_ADMIN_PROFILES (Extended profile for super admins)
CREATE TABLE IF NOT EXISTS public.super_admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  assigned_continent_id UUID,
  assigned_country_id UUID,
  authority_scope TEXT DEFAULT 'country',
  can_manage_users BOOLEAN DEFAULT true,
  can_manage_admins BOOLEAN DEFAULT true,
  can_manage_rules BOOLEAN DEFAULT true,
  can_manage_security BOOLEAN DEFAULT true,
  can_manage_rentals BOOLEAN DEFAULT true,
  can_lock_scope BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_DASHBOARD_WIDGETS
CREATE TABLE IF NOT EXISTS public.super_admin_dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  widget_code TEXT NOT NULL,
  position_index INTEGER DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  widget_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_DASHBOARD_VIEWS
CREATE TABLE IF NOT EXISTS public.super_admin_dashboard_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  widget_code TEXT NOT NULL,
  view_duration_seconds INTEGER,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: USER_STATUS_HISTORY
CREATE TABLE IF NOT EXISTS public.user_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  changed_by_super_admin_id UUID,
  old_status TEXT,
  new_status TEXT NOT NULL,
  reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_USER_VIEWS
CREATE TABLE IF NOT EXISTS public.super_admin_user_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  user_id UUID NOT NULL,
  view_context TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: ADMINS (managed by Super Admin)
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  created_by_super_admin_id UUID,
  assigned_scope JSONB DEFAULT '{}',
  scope_type TEXT DEFAULT 'country',
  status TEXT DEFAULT 'active',
  permissions_list JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: ADMIN_SCOPE_HISTORY
CREATE TABLE IF NOT EXISTS public.admin_scope_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  changed_by_super_admin_id UUID,
  old_scope JSONB,
  new_scope JSONB NOT NULL,
  change_reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: ROLES
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  scope_type TEXT DEFAULT 'global',
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: PERMISSIONS
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_code TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: ROLE_PERMISSIONS (Junction Table)
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL,
  permission_id UUID NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- ENTITY: SUPER_ADMIN_ROLE_VIEWS
CREATE TABLE IF NOT EXISTS public.super_admin_role_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  role_id UUID NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_PERMISSION_VIEWS
CREATE TABLE IF NOT EXISTS public.super_admin_permission_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  permission_id UUID NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: CONTINENTS
CREATE TABLE IF NOT EXISTS public.continents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: COUNTRIES
CREATE TABLE IF NOT EXISTS public.countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  continent_id UUID NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_REGION_ACTIONS
CREATE TABLE IF NOT EXISTS public.super_admin_region_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  region_type TEXT NOT NULL,
  region_id UUID NOT NULL,
  action TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  action_time TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SYSTEM_MODULES
CREATE TABLE IF NOT EXISTS public.system_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_code TEXT NOT NULL UNIQUE,
  module_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  is_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_MODULE_ACTIONS
CREATE TABLE IF NOT EXISTS public.super_admin_module_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  module_id UUID NOT NULL,
  action TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  action_time TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: RENTAL_PLANS
CREATE TABLE IF NOT EXISTS public.rental_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  duration_type TEXT NOT NULL,
  duration_value INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: RENTABLE_FEATURES
CREATE TABLE IF NOT EXISTS public.rentable_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_code TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  module_code TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: RENTALS
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  assigned_to_user_id UUID NOT NULL,
  assigned_by_super_admin_id UUID,
  start_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_RENTAL_ACTIONS
CREATE TABLE IF NOT EXISTS public.super_admin_rental_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  rental_id UUID NOT NULL,
  action TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  action_time TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: RULES
CREATE TABLE IF NOT EXISTS public.rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  rule_logic JSONB NOT NULL DEFAULT '{}',
  scope_definition JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_by_super_admin_id UUID,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: RULE_EXECUTION_LOGS
CREATE TABLE IF NOT EXISTS public.rule_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL,
  executed_by_super_admin_id UUID,
  trigger_type TEXT NOT NULL,
  execution_result TEXT NOT NULL,
  affected_entities JSONB DEFAULT '[]',
  execution_duration_ms INTEGER,
  executed_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: APPROVALS
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type TEXT NOT NULL,
  requested_by_user_id UUID NOT NULL,
  request_data JSONB DEFAULT '{}',
  risk_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: APPROVAL_DECISIONS
CREATE TABLE IF NOT EXISTS public.approval_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id UUID NOT NULL,
  super_admin_id UUID NOT NULL,
  decision TEXT NOT NULL,
  decision_reason TEXT,
  decision_time TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SECURITY_EVENTS
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  affected_user_id UUID,
  ip_address TEXT,
  geo_location TEXT,
  device_fingerprint TEXT,
  user_agent TEXT,
  severity TEXT DEFAULT 'medium',
  is_resolved BOOLEAN DEFAULT false,
  detected_at TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SUPER_ADMIN_SECURITY_ACTIONS
CREATE TABLE IF NOT EXISTS public.super_admin_security_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  security_event_id UUID NOT NULL,
  action TEXT NOT NULL,
  action_data JSONB DEFAULT '{}',
  action_time TIMESTAMPTZ DEFAULT now()
);

-- ENTITY: SYSTEM_LOCKS
CREATE TABLE IF NOT EXISTS public.system_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_scope TEXT NOT NULL,
  target_id UUID,
  target_name TEXT,
  reason TEXT NOT NULL,
  locked_by_super_admin_id UUID,
  is_active BOOLEAN DEFAULT true,
  force_logout_triggered BOOLEAN DEFAULT false,
  locked_at TIMESTAMPTZ DEFAULT now(),
  unlocked_at TIMESTAMPTZ,
  unlocked_by UUID
);

-- ENTITY: SUPER_ADMIN_ACTIVITY_LOG (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.super_admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  super_admin_id UUID NOT NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  target_entity TEXT,
  target_id UUID,
  action_data JSONB DEFAULT '{}',
  ip_address TEXT,
  device_fingerprint TEXT,
  user_agent TEXT,
  session_id UUID,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.super_admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_dashboard_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_user_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_scope_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_role_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_permission_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.continents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_region_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_module_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentable_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_rental_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_security_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_admin_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies using security definer function pattern
CREATE POLICY "sa_profiles_access" ON public.super_admin_profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY "sa_widgets_access" ON public.super_admin_dashboard_widgets FOR ALL USING (public.is_super_admin());
CREATE POLICY "sa_dashboard_views_access" ON public.super_admin_dashboard_views FOR ALL USING (public.is_super_admin());
CREATE POLICY "user_status_history_access" ON public.user_status_history FOR ALL USING (public.is_super_admin());
CREATE POLICY "sa_user_views_access" ON public.super_admin_user_views FOR ALL USING (public.is_super_admin());
CREATE POLICY "admins_access" ON public.admins FOR ALL USING (public.is_super_admin());
CREATE POLICY "admin_scope_history_access" ON public.admin_scope_history FOR ALL USING (public.is_super_admin());
CREATE POLICY "roles_read" ON public.roles FOR SELECT USING (true);
CREATE POLICY "permissions_read" ON public.permissions FOR SELECT USING (true);
CREATE POLICY "role_permissions_read" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "sa_role_views_access" ON public.super_admin_role_views FOR ALL USING (public.is_super_admin());
CREATE POLICY "sa_permission_views_access" ON public.super_admin_permission_views FOR ALL USING (public.is_super_admin());
CREATE POLICY "continents_read" ON public.continents FOR SELECT USING (true);
CREATE POLICY "countries_read" ON public.countries FOR SELECT USING (true);
CREATE POLICY "sa_region_actions_access" ON public.super_admin_region_actions FOR ALL USING (public.is_super_admin());
CREATE POLICY "system_modules_read" ON public.system_modules FOR SELECT USING (true);
CREATE POLICY "sa_module_actions_access" ON public.super_admin_module_actions FOR ALL USING (public.is_super_admin());
CREATE POLICY "rental_plans_read" ON public.rental_plans FOR SELECT USING (true);
CREATE POLICY "rentable_features_read" ON public.rentable_features FOR SELECT USING (true);
CREATE POLICY "rentals_access" ON public.rentals FOR ALL USING (public.is_super_admin());
CREATE POLICY "sa_rental_actions_access" ON public.super_admin_rental_actions FOR ALL USING (public.is_super_admin());
CREATE POLICY "rules_access" ON public.rules FOR ALL USING (public.is_super_admin());
CREATE POLICY "rule_execution_logs_access" ON public.rule_execution_logs FOR ALL USING (public.is_super_admin());
CREATE POLICY "approvals_access" ON public.approvals FOR ALL USING (public.is_super_admin());
CREATE POLICY "approval_decisions_access" ON public.approval_decisions FOR ALL USING (public.is_super_admin());
CREATE POLICY "security_events_access" ON public.security_events FOR ALL USING (public.is_super_admin());
CREATE POLICY "sa_security_actions_access" ON public.super_admin_security_actions FOR ALL USING (public.is_super_admin());
CREATE POLICY "system_locks_access" ON public.system_locks FOR ALL USING (public.is_super_admin());
CREATE POLICY "sa_activity_log_access" ON public.super_admin_activity_log FOR ALL USING (public.is_super_admin());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sa_profiles_user ON public.super_admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sa_widgets_admin ON public.super_admin_dashboard_widgets(super_admin_id);
CREATE INDEX IF NOT EXISTS idx_user_status_user ON public.user_status_history(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_user ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS idx_countries_continent ON public.countries(continent_id);
CREATE INDEX IF NOT EXISTS idx_rentals_user ON public.rentals(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_rules_status ON public.rules(status);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approvals(status);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON public.security_events(severity);
CREATE INDEX IF NOT EXISTS idx_system_locks_active ON public.system_locks(is_active);
CREATE INDEX IF NOT EXISTS idx_sa_activity_log_admin ON public.super_admin_activity_log(super_admin_id);
CREATE INDEX IF NOT EXISTS idx_sa_activity_log_created ON public.super_admin_activity_log(created_at);