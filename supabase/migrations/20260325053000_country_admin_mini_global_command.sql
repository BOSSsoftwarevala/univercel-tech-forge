CREATE OR REPLACE FUNCTION public.can_manage_country_control(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
    AND role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'admin', 'continent_super_admin', 'country_head', 'area_manager', 'finance_manager', 'marketing_manager', 'reseller_manager', 'franchise_manager', 'influencer_manager')
)
$$;

CREATE OR REPLACE FUNCTION public.country_control_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.country_control_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Country control audit rows are immutable';
END;
$$;

CREATE TABLE IF NOT EXISTS public.country_control_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  continent TEXT,
  auto_approve_resellers BOOLEAN NOT NULL DEFAULT false,
  auto_approve_influencers BOOLEAN NOT NULL DEFAULT false,
  auto_escalate_incidents BOOLEAN NOT NULL DEFAULT true,
  ai_growth_mode TEXT NOT NULL DEFAULT 'balanced' CHECK (ai_growth_mode IN ('balanced', 'aggressive', 'defensive')),
  target_growth_percent NUMERIC(8,2) NOT NULL DEFAULT 12,
  target_health_percent NUMERIC(8,2) NOT NULL DEFAULT 95,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.country_region_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  continent TEXT,
  region_key TEXT NOT NULL,
  region_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'warning', 'critical')),
  priority_tier TEXT NOT NULL DEFAULT 'standard' CHECK (priority_tier IN ('strategic', 'standard', 'recovery')),
  launched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (country_code, region_key)
);

CREATE TABLE IF NOT EXISTS public.country_manager_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  region_key TEXT NOT NULL,
  manager_user_id UUID,
  manager_name TEXT NOT NULL,
  manager_role TEXT NOT NULL DEFAULT 'area_manager' CHECK (manager_role IN ('area_manager', 'country_head', 'ops_lead')),
  assignment_status TEXT NOT NULL DEFAULT 'active' CHECK (assignment_status IN ('active', 'pending', 'rebalancing', 'paused')),
  assigned_by UUID,
  assignment_source TEXT NOT NULL DEFAULT 'manual' CHECK (assignment_source IN ('manual', 'ai_bench', 'auto_rebalance')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (country_code, region_key, manager_name)
);

CREATE TABLE IF NOT EXISTS public.country_command_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  region_key TEXT,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  source TEXT NOT NULL DEFAULT 'system' CHECK (source IN ('user', 'ai', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.country_command_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  region_key TEXT,
  incident_type TEXT NOT NULL CHECK (incident_type IN ('operational', 'payment', 'fraud', 'growth', 'connector', 'compliance', 'security')),
  severity TEXT NOT NULL DEFAULT 'high' CHECK (severity IN ('warning', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'auto_fixed', 'escalated', 'resolved')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  escalation_level TEXT NOT NULL DEFAULT 'L1' CHECK (escalation_level IN ('L1', 'L2', 'Country Head', 'Continent')),
  auto_fix_status TEXT NOT NULL DEFAULT 'pending' CHECK (auto_fix_status IN ('pending', 'executed', 'failed', 'manual_required')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.country_region_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  region_key TEXT NOT NULL,
  region_name TEXT NOT NULL,
  active_users INTEGER NOT NULL DEFAULT 0,
  franchises INTEGER NOT NULL DEFAULT 0,
  resellers INTEGER NOT NULL DEFAULT 0,
  influencers INTEGER NOT NULL DEFAULT 0,
  managers INTEGER NOT NULL DEFAULT 0,
  areas INTEGER NOT NULL DEFAULT 0,
  pending_approvals INTEGER NOT NULL DEFAULT 0,
  open_alerts INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  performance_percent NUMERIC(8,2) NOT NULL DEFAULT 0,
  health_percent NUMERIC(8,2) NOT NULL DEFAULT 100,
  risk_score NUMERIC(8,2) NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.country_growth_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('region_create', 'manager_assign', 'network_decision', 'incident_response', 'self_heal', 'growth_rebalance')),
  target_ref TEXT,
  requested_by UUID,
  executed_by TEXT NOT NULL DEFAULT 'system',
  action_status TEXT NOT NULL DEFAULT 'executed' CHECK (action_status IN ('queued', 'executed', 'failed')),
  action_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_country_control_settings_country ON public.country_control_settings(country_code);
CREATE INDEX IF NOT EXISTS idx_country_region_registry_country ON public.country_region_registry(country_code, region_key);
CREATE INDEX IF NOT EXISTS idx_country_manager_assignments_country ON public.country_manager_assignments(country_code, region_key, assignment_status);
CREATE INDEX IF NOT EXISTS idx_country_command_events_country_created ON public.country_command_events(country_code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_country_command_incidents_country_status ON public.country_command_incidents(country_code, status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_country_region_snapshots_country_time ON public.country_region_snapshots(country_code, snapshot_at DESC, region_key);
CREATE INDEX IF NOT EXISTS idx_country_growth_actions_country_created ON public.country_growth_actions(country_code, created_at DESC);

ALTER TABLE public.country_control_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_region_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_manager_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_command_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_command_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_region_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_growth_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "country_control_settings_manage" ON public.country_control_settings
FOR ALL USING (public.can_manage_country_control(auth.uid()))
WITH CHECK (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_region_registry_manage" ON public.country_region_registry
FOR ALL USING (public.can_manage_country_control(auth.uid()))
WITH CHECK (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_manager_assignments_manage" ON public.country_manager_assignments
FOR ALL USING (public.can_manage_country_control(auth.uid()))
WITH CHECK (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_command_events_view" ON public.country_command_events
FOR SELECT USING (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_command_events_insert" ON public.country_command_events
FOR INSERT WITH CHECK (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_command_incidents_manage" ON public.country_command_incidents
FOR ALL USING (public.can_manage_country_control(auth.uid()))
WITH CHECK (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_region_snapshots_manage" ON public.country_region_snapshots
FOR ALL USING (public.can_manage_country_control(auth.uid()))
WITH CHECK (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_growth_actions_view" ON public.country_growth_actions
FOR SELECT USING (public.can_manage_country_control(auth.uid()));

CREATE POLICY "country_growth_actions_insert" ON public.country_growth_actions
FOR INSERT WITH CHECK (public.can_manage_country_control(auth.uid()));

DROP TRIGGER IF EXISTS country_control_settings_touch_updated_at ON public.country_control_settings;
CREATE TRIGGER country_control_settings_touch_updated_at
BEFORE UPDATE ON public.country_control_settings
FOR EACH ROW EXECUTE FUNCTION public.country_control_touch_updated_at();

DROP TRIGGER IF EXISTS country_region_registry_touch_updated_at ON public.country_region_registry;
CREATE TRIGGER country_region_registry_touch_updated_at
BEFORE UPDATE ON public.country_region_registry
FOR EACH ROW EXECUTE FUNCTION public.country_control_touch_updated_at();

DROP TRIGGER IF EXISTS country_manager_assignments_touch_updated_at ON public.country_manager_assignments;
CREATE TRIGGER country_manager_assignments_touch_updated_at
BEFORE UPDATE ON public.country_manager_assignments
FOR EACH ROW EXECUTE FUNCTION public.country_control_touch_updated_at();

DROP TRIGGER IF EXISTS country_command_incidents_touch_updated_at ON public.country_command_incidents;
CREATE TRIGGER country_command_incidents_touch_updated_at
BEFORE UPDATE ON public.country_command_incidents
FOR EACH ROW EXECUTE FUNCTION public.country_control_touch_updated_at();

DROP TRIGGER IF EXISTS country_region_snapshots_touch_updated_at ON public.country_region_snapshots;
CREATE TRIGGER country_region_snapshots_touch_updated_at
BEFORE UPDATE ON public.country_region_snapshots
FOR EACH ROW EXECUTE FUNCTION public.country_control_touch_updated_at();

DROP TRIGGER IF EXISTS country_growth_actions_no_mutation ON public.country_growth_actions;
CREATE TRIGGER country_growth_actions_no_mutation
BEFORE UPDATE OR DELETE ON public.country_growth_actions
FOR EACH ROW EXECUTE FUNCTION public.country_control_block_mutation();

INSERT INTO public.country_control_settings (country_code, country_name, continent, ai_growth_mode, target_growth_percent, target_health_percent, metadata)
VALUES
  ('IN', 'India', 'Asia', 'balanced', 14, 96, jsonb_build_object('priority_market', true)),
  ('NG', 'Nigeria', 'Africa', 'aggressive', 18, 94, jsonb_build_object('priority_market', true)),
  ('US', 'United States', 'North America', 'balanced', 10, 97, jsonb_build_object('priority_market', true)),
  ('DE', 'Germany', 'Europe', 'defensive', 9, 98, jsonb_build_object('priority_market', false))
ON CONFLICT (country_code) DO UPDATE SET
  country_name = EXCLUDED.country_name,
  continent = EXCLUDED.continent,
  ai_growth_mode = EXCLUDED.ai_growth_mode,
  target_growth_percent = EXCLUDED.target_growth_percent,
  target_health_percent = EXCLUDED.target_health_percent,
  metadata = public.country_control_settings.metadata || EXCLUDED.metadata,
  updated_at = now();

ALTER PUBLICATION supabase_realtime ADD TABLE public.country_control_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.country_region_registry;
ALTER PUBLICATION supabase_realtime ADD TABLE public.country_manager_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.country_command_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.country_command_incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.country_region_snapshots;
ALTER PUBLICATION supabase_realtime ADD TABLE public.country_growth_actions;