-- =============================================
-- SERVER MANAGER AUTO-CALLING ENGINE SCHEMA
-- =============================================

-- Server Health (dedicated table for real-time health)
CREATE TABLE IF NOT EXISTS public.server_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE UNIQUE,
  health_score INTEGER DEFAULT 100,
  sla_uptime DECIMAL(5,2) DEFAULT 99.99,
  last_check_at TIMESTAMPTZ DEFAULT now(),
  consecutive_failures INTEGER DEFAULT 0,
  is_healthy BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-scaling policies
CREATE TABLE IF NOT EXISTS public.auto_scaling_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  cpu_threshold_percent INTEGER DEFAULT 80,
  ram_threshold_percent INTEGER DEFAULT 85,
  consecutive_checks_required INTEGER DEFAULT 3,
  scale_up_cpu INTEGER DEFAULT 2,
  scale_up_ram INTEGER DEFAULT 4,
  max_cpu INTEGER DEFAULT 32,
  max_ram INTEGER DEFAULT 64,
  cooldown_minutes INTEGER DEFAULT 10,
  last_scale_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-healing configuration
CREATE TABLE IF NOT EXISTS public.auto_healing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  is_enabled BOOLEAN DEFAULT true,
  heartbeat_timeout_seconds INTEGER DEFAULT 60,
  max_restart_attempts INTEGER DEFAULT 3,
  restart_count INTEGER DEFAULT 0,
  last_restart_at TIMESTAMPTZ,
  auto_shutdown_on_failure BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Background job scheduler
CREATE TABLE IF NOT EXISTS public.background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  interval_seconds INTEGER NOT NULL,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  run_count INTEGER DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Job execution logs
CREATE TABLE IF NOT EXISTS public.job_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.background_jobs(id),
  job_type TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running',
  result JSONB,
  error TEXT,
  servers_processed INTEGER DEFAULT 0
);

-- Real-time metrics cache (for fast dashboard reads)
CREATE TABLE IF NOT EXISTS public.server_metrics_cache (
  server_id UUID PRIMARY KEY REFERENCES public.server_instances(id) ON DELETE CASCADE,
  cpu_percent DECIMAL(5,2) DEFAULT 0,
  ram_percent DECIMAL(5,2) DEFAULT 0,
  disk_percent DECIMAL(5,2) DEFAULT 0,
  network_in DECIMAL(10,2) DEFAULT 0,
  network_out DECIMAL(10,2) DEFAULT 0,
  health_score INTEGER DEFAULT 100,
  status TEXT DEFAULT 'online',
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.server_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_scaling_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_healing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_metrics_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Server managers can view health" ON public.server_health
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'server_manager'));

CREATE POLICY "Server managers can view scaling policies" ON public.auto_scaling_policies
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'server_manager'));

CREATE POLICY "Super admin can manage scaling policies" ON public.auto_scaling_policies
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Server managers can view healing config" ON public.auto_healing_config
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'server_manager'));

CREATE POLICY "Super admin can manage healing config" ON public.auto_healing_config
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view background jobs" ON public.background_jobs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view job logs" ON public.job_execution_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Anyone can view metrics cache" ON public.server_metrics_cache
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'server_manager'));

-- Insert default background jobs
INSERT INTO public.background_jobs (job_type, interval_seconds, next_run_at) VALUES
('metrics_collector', 5, now()),
('alert_checker', 30, now()),
('performance_updater', 60, now()),
('plan_recommender', 300, now()),
('billing_forecaster', 3600, now()),
('auto_scaler', 15, now()),
('auto_healer', 10, now())
ON CONFLICT DO NOTHING;

-- Enable realtime for metrics cache
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_metrics_cache;
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_health;

-- Function to simulate metrics (for demo/testing)
CREATE OR REPLACE FUNCTION public.generate_server_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  srv RECORD;
BEGIN
  FOR srv IN SELECT id, status FROM server_instances WHERE status != 'decommissioned'
  LOOP
    -- Insert metrics history
    INSERT INTO server_metrics_history (
      server_id, cpu_percent, ram_percent, disk_percent, 
      network_in, network_out, recorded_at
    ) VALUES (
      srv.id,
      CASE WHEN srv.status = 'online' THEN 20 + random() * 60 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN 30 + random() * 50 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN 40 + random() * 40 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN random() * 1000 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN random() * 500 ELSE 0 END,
      now()
    );
    
    -- Update cache
    INSERT INTO server_metrics_cache (server_id, cpu_percent, ram_percent, disk_percent, network_in, network_out, status, last_updated)
    VALUES (
      srv.id,
      CASE WHEN srv.status = 'online' THEN 20 + random() * 60 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN 30 + random() * 50 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN 40 + random() * 40 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN random() * 1000 ELSE 0 END,
      CASE WHEN srv.status = 'online' THEN random() * 500 ELSE 0 END,
      srv.status,
      now()
    )
    ON CONFLICT (server_id) DO UPDATE SET
      cpu_percent = EXCLUDED.cpu_percent,
      ram_percent = EXCLUDED.ram_percent,
      disk_percent = EXCLUDED.disk_percent,
      network_in = EXCLUDED.network_in,
      network_out = EXCLUDED.network_out,
      status = EXCLUDED.status,
      last_updated = now();
    
    -- Update heartbeat
    UPDATE server_instances SET last_heartbeat = now() WHERE id = srv.id AND status = 'online';
  END LOOP;
END;
$$;

-- Function for auto-scaling check
CREATE OR REPLACE FUNCTION public.check_auto_scaling()
RETURNS TABLE(server_id UUID, needs_scaling BOOLEAN, scale_reason TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.server_id,
    (c.cpu_percent > COALESCE(p.cpu_threshold_percent, 80) OR c.ram_percent > COALESCE(p.ram_threshold_percent, 85)) AS needs_scaling,
    CASE 
      WHEN c.cpu_percent > COALESCE(p.cpu_threshold_percent, 80) THEN 'CPU threshold exceeded'
      WHEN c.ram_percent > COALESCE(p.ram_threshold_percent, 85) THEN 'RAM threshold exceeded'
      ELSE NULL
    END AS scale_reason
  FROM server_metrics_cache c
  LEFT JOIN auto_scaling_policies p ON c.server_id = p.server_id
  WHERE p.is_enabled = true OR p.is_enabled IS NULL;
END;
$$;

-- Function for auto-healing check
CREATE OR REPLACE FUNCTION public.check_auto_healing()
RETURNS TABLE(server_id UUID, needs_healing BOOLEAN, heal_reason TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id AS server_id,
    (s.last_heartbeat < now() - interval '60 seconds' AND s.status = 'online') AS needs_healing,
    CASE 
      WHEN s.last_heartbeat < now() - interval '60 seconds' THEN 'Heartbeat timeout'
      ELSE NULL
    END AS heal_reason
  FROM server_instances s
  LEFT JOIN auto_healing_config h ON s.id = h.server_id
  WHERE s.status NOT IN ('offline', 'decommissioned')
  AND (h.is_enabled = true OR h.is_enabled IS NULL);
END;
$$;