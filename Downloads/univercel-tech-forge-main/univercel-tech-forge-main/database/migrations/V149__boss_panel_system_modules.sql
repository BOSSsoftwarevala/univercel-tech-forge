-- Migration: V149__boss_panel_system_modules
-- Description: Add system modules management tables for Boss Panel
-- Date: 2026-03-25

-- System Modules Table: Core module management
CREATE TABLE IF NOT EXISTS public.system_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key TEXT NOT NULL UNIQUE, -- 'leads', 'products', 'demos', 'billing', 'ai_engine', 'servers', 'compliance'
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'disabled')),
  health_score INTEGER DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
  dependencies TEXT[] DEFAULT '{}', -- Array of module_keys this module depends on
  maintenance_reason TEXT,
  config JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- System Health Metrics Table: Track module performance over time
CREATE TABLE IF NOT EXISTS public.system_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.system_modules(id) ON DELETE CASCADE,
  response_time_ms INTEGER,
  has_errors BOOLEAN DEFAULT false,
  error_count INTEGER DEFAULT 0,
  cpu_usage_percent NUMERIC(5,2),
  memory_usage_percent NUMERIC(5,2),
  active_connections INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- System Audit Logs Table: Track all module management actions
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- 'module_enabled', 'module_disabled', 'module_maintenance_set', etc.
  action_type TEXT DEFAULT 'module_management',
  performed_by UUID NOT NULL REFERENCES auth.users(id),
  performed_by_role TEXT,
  target_type TEXT, -- 'system_module', 'user', 'server', etc.
  target_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'system_modules_access' AND tablename = 'system_modules') THEN
    CREATE POLICY "system_modules_access" ON public.system_modules FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'master'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'system_health_metrics_access' AND tablename = 'system_health_metrics') THEN
    CREATE POLICY "system_health_metrics_access" ON public.system_health_metrics FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'master'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'system_audit_logs_access' AND tablename = 'system_audit_logs') THEN
    CREATE POLICY "system_audit_logs_access" ON public.system_audit_logs FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'master') OR performed_by = auth.uid());
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_system_modules_status ON public.system_modules(status);
CREATE INDEX IF NOT EXISTS idx_system_modules_key ON public.system_modules(module_key);
CREATE INDEX IF NOT EXISTS idx_system_health_module_time ON public.system_health_metrics(module_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_audit_action ON public.system_audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_audit_performed_by ON public.system_audit_logs(performed_by, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_audit_target ON public.system_audit_logs(target_type, target_id);

-- Insert default system modules
INSERT INTO public.system_modules (module_key, name, description, status, health_score, dependencies) VALUES
  ('leads', 'Leads Management', 'Lead capture, qualification, and management system', 'active', 98, '{}'),
  ('products', 'Product Management', 'Product catalog, pricing, and inventory management', 'active', 100, '{}'),
  ('demos', 'Demo Management', 'Product demo scheduling and management', 'active', 95, '{products}'),
  ('billing', 'Billing & Payments', 'Payment processing, invoicing, and subscription management', 'active', 100, '{}'),
  ('ai_engine', 'AI Engine', 'AI-powered features and automation', 'active', 87, '{}'),
  ('servers', 'Server Infrastructure', 'Server provisioning, monitoring, and management', 'maintenance', 75, '{}'),
  ('compliance', 'Compliance & Security', 'Security monitoring, compliance checks, and audit trails', 'active', 100, '{}'),
  ('support', 'Customer Support', 'Ticket management, live chat, and support automation', 'active', 92, '{}'),
  ('analytics', 'Analytics & Reporting', 'Business intelligence and performance analytics', 'active', 96, '{}'),
  ('integrations', 'Third-party Integrations', 'API integrations with external services', 'active', 89, '{}')
ON CONFLICT (module_key) DO NOTHING;