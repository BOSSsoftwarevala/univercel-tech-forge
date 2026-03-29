CREATE OR REPLACE FUNCTION public.can_manage_global_command(_user_id uuid)
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
    AND role IN ('boss_owner', 'master', 'super_admin', 'ceo', 'admin', 'server_manager', 'performance_manager', 'finance_manager', 'legal_compliance')
)
$$;

CREATE OR REPLACE FUNCTION public.global_command_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.global_command_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Global command audit rows are immutable';
END;
$$;

CREATE TABLE IF NOT EXISTS public.global_system_connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  layer_name TEXT NOT NULL CHECK (layer_name IN ('data_ingestion', 'realtime_processing', 'ai_analytics', 'control_engine', 'visual_dashboard')),
  status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'degraded', 'outage', 'maintenance')),
  health_score NUMERIC(5,2) NOT NULL DEFAULT 100,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  auto_fix_enabled BOOLEAN NOT NULL DEFAULT true,
  failure_count INTEGER NOT NULL DEFAULT 0,
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.global_command_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  scope_type TEXT NOT NULL DEFAULT 'global' CHECK (scope_type IN ('global', 'continent', 'country', 'region')),
  continent TEXT,
  country TEXT,
  entity_type TEXT,
  entity_id UUID,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('info', 'low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  revenue_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  user_count_delta INTEGER NOT NULL DEFAULT 0,
  risk_score NUMERIC(8,2) NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.global_command_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type TEXT NOT NULL CHECK (incident_type IN ('server_issue', 'payment_anomaly', 'fraud_alert', 'connector_down', 'region_underperforming', 'latency_spike', 'security_breach')),
  severity TEXT NOT NULL DEFAULT 'high' CHECK (severity IN ('warning', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'auto_fixed', 'escalated', 'resolved')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  source_system TEXT,
  source_id UUID,
  escalation_level TEXT NOT NULL DEFAULT 'L1' CHECK (escalation_level IN ('L1', 'L2', 'Boss')),
  auto_fix_status TEXT NOT NULL DEFAULT 'pending' CHECK (auto_fix_status IN ('pending', 'executed', 'failed', 'manual_required')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.global_region_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type TEXT NOT NULL DEFAULT 'continent' CHECK (scope_type IN ('continent', 'country', 'region')),
  continent TEXT NOT NULL,
  country TEXT,
  active_users INTEGER NOT NULL DEFAULT 0,
  franchises INTEGER NOT NULL DEFAULT 0,
  resellers INTEGER NOT NULL DEFAULT 0,
  products INTEGER NOT NULL DEFAULT 0,
  sales INTEGER NOT NULL DEFAULT 0,
  revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  growth_percent NUMERIC(8,2) NOT NULL DEFAULT 0,
  health_percent NUMERIC(8,2) NOT NULL DEFAULT 100,
  alerts_open INTEGER NOT NULL DEFAULT 0,
  servers_online INTEGER NOT NULL DEFAULT 0,
  risk_score NUMERIC(8,2) NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.global_scaling_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL CHECK (action_type IN ('scale_up', 'scale_down', 'route_optimize', 'connector_restart', 'incident_auto_fix')),
  scope_key TEXT NOT NULL,
  target_ref TEXT,
  requested_by UUID,
  executed_by TEXT NOT NULL DEFAULT 'system',
  action_status TEXT NOT NULL DEFAULT 'executed' CHECK (action_status IN ('queued', 'executed', 'failed')),
  action_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_global_system_connectors_status ON public.global_system_connectors(status, health_score DESC);
CREATE INDEX IF NOT EXISTS idx_global_command_events_created ON public.global_command_events(created_at DESC, severity);
CREATE INDEX IF NOT EXISTS idx_global_command_incidents_status ON public.global_command_incidents(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_global_region_snapshots_scope ON public.global_region_snapshots(scope_type, continent, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_global_scaling_actions_created ON public.global_scaling_actions(created_at DESC, action_type);

ALTER TABLE public.global_system_connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_command_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_command_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_region_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_scaling_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "global_connectors_manage" ON public.global_system_connectors
FOR ALL USING (public.can_manage_global_command(auth.uid()))
WITH CHECK (public.can_manage_global_command(auth.uid()));

CREATE POLICY "global_events_view" ON public.global_command_events
FOR SELECT USING (public.can_manage_global_command(auth.uid()));

CREATE POLICY "global_events_insert" ON public.global_command_events
FOR INSERT WITH CHECK (public.can_manage_global_command(auth.uid()));

CREATE POLICY "global_incidents_manage" ON public.global_command_incidents
FOR ALL USING (public.can_manage_global_command(auth.uid()))
WITH CHECK (public.can_manage_global_command(auth.uid()));

CREATE POLICY "global_snapshots_manage" ON public.global_region_snapshots
FOR ALL USING (public.can_manage_global_command(auth.uid()))
WITH CHECK (public.can_manage_global_command(auth.uid()));

CREATE POLICY "global_scaling_view" ON public.global_scaling_actions
FOR SELECT USING (public.can_manage_global_command(auth.uid()));

CREATE POLICY "global_scaling_insert" ON public.global_scaling_actions
FOR INSERT WITH CHECK (public.can_manage_global_command(auth.uid()));

DROP TRIGGER IF EXISTS global_system_connectors_touch_updated_at ON public.global_system_connectors;
CREATE TRIGGER global_system_connectors_touch_updated_at
BEFORE UPDATE ON public.global_system_connectors
FOR EACH ROW EXECUTE FUNCTION public.global_command_touch_updated_at();

DROP TRIGGER IF EXISTS global_command_incidents_touch_updated_at ON public.global_command_incidents;
CREATE TRIGGER global_command_incidents_touch_updated_at
BEFORE UPDATE ON public.global_command_incidents
FOR EACH ROW EXECUTE FUNCTION public.global_command_touch_updated_at();

DROP TRIGGER IF EXISTS global_region_snapshots_touch_updated_at ON public.global_region_snapshots;
CREATE TRIGGER global_region_snapshots_touch_updated_at
BEFORE UPDATE ON public.global_region_snapshots
FOR EACH ROW EXECUTE FUNCTION public.global_command_touch_updated_at();

DROP TRIGGER IF EXISTS global_scaling_actions_no_mutation ON public.global_scaling_actions;
CREATE TRIGGER global_scaling_actions_no_mutation
BEFORE UPDATE OR DELETE ON public.global_scaling_actions
FOR EACH ROW EXECUTE FUNCTION public.global_command_block_mutation();

INSERT INTO public.global_system_connectors (system_key, display_name, layer_name, status, health_score, latency_ms, auto_fix_enabled, metadata)
VALUES
  ('marketplace', 'Marketplace', 'data_ingestion', 'operational', 99, 120, true, jsonb_build_object('scope', 'sales')),
  ('sales', 'Sales Engine', 'realtime_processing', 'operational', 98, 150, true, jsonb_build_object('scope', 'revenue')),
  ('license', 'License Control', 'control_engine', 'operational', 99, 110, true, jsonb_build_object('scope', 'license')),
  ('deploy', 'Deployment Engine', 'control_engine', 'operational', 97, 210, true, jsonb_build_object('scope', 'delivery')),
  ('analytics', 'Analytics Brain', 'ai_analytics', 'operational', 96, 180, true, jsonb_build_object('scope', 'ai')),
  ('servers', 'Server Infra', 'data_ingestion', 'operational', 98, 95, true, jsonb_build_object('scope', 'infra')),
  ('notifications', 'Notifications', 'realtime_processing', 'operational', 97, 130, true, jsonb_build_object('scope', 'alerts')),
  ('security', 'Security Shield', 'control_engine', 'operational', 99, 90, true, jsonb_build_object('scope', 'risk')),
  ('finance', 'Finance Ledger', 'visual_dashboard', 'operational', 98, 140, true, jsonb_build_object('scope', 'billing'))
ON CONFLICT (system_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  layer_name = EXCLUDED.layer_name,
  auto_fix_enabled = EXCLUDED.auto_fix_enabled,
  metadata = public.global_system_connectors.metadata || EXCLUDED.metadata,
  updated_at = now();

ALTER PUBLICATION supabase_realtime ADD TABLE public.global_system_connectors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_command_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_command_incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_region_snapshots;
