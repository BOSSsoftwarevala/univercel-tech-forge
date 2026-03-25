-- =============================================
-- SERVER MANAGER ADDITIONAL TABLES
-- =============================================

-- Server Plans (for marketplace) - if not exists
CREATE TABLE IF NOT EXISTS public.server_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  cpu_cores INTEGER NOT NULL,
  ram_gb INTEGER NOT NULL,
  storage_gb INTEGER NOT NULL,
  bandwidth_tb INTEGER NOT NULL DEFAULT 1,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  regions TEXT[] DEFAULT ARRAY['us-east', 'us-west', 'eu-west', 'ap-south'],
  is_recommended BOOLEAN DEFAULT false,
  recommended_for TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Server Performance Summary
CREATE TABLE IF NOT EXISTS public.server_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  uptime_percent DECIMAL(5,2) DEFAULT 100.00,
  sla_percent DECIMAL(5,2) DEFAULT 99.99,
  avg_latency_ms INTEGER DEFAULT 0,
  error_rate DECIMAL(5,2) DEFAULT 0.00,
  performance_score INTEGER DEFAULT 100,
  last_calculated TIMESTAMPTZ DEFAULT now()
);

-- Server Incidents
CREATE TABLE IF NOT EXISTS public.server_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES public.server_alerts(id),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to UUID,
  escalated BOOLEAN DEFAULT false,
  escalated_to UUID,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Firewall Rules
CREATE TABLE IF NOT EXISTS public.firewall_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL DEFAULT 'allow',
  ip_range TEXT,
  port_range TEXT,
  protocol TEXT DEFAULT 'tcp',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Server Purchases
CREATE TABLE IF NOT EXISTS public.server_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES public.server_plans(id),
  server_id UUID REFERENCES public.server_instances(id),
  region TEXT NOT NULL,
  os TEXT DEFAULT 'ubuntu-22.04',
  auto_backup BOOLEAN DEFAULT false,
  firewall_preset TEXT DEFAULT 'standard',
  scaling_rules JSONB DEFAULT '{}',
  payment_method TEXT NOT NULL DEFAULT 'wallet',
  wallet_transaction_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Server Billing
CREATE TABLE IF NOT EXISTS public.server_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  cpu_hours DECIMAL(10,2) DEFAULT 0,
  storage_gb_hours DECIMAL(10,2) DEFAULT 0,
  bandwidth_used_gb DECIMAL(10,2) DEFAULT 0,
  base_cost DECIMAL(10,2) DEFAULT 0,
  usage_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT false,
  invoice_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Server Webhooks
CREATE TABLE IF NOT EXISTS public.server_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  last_attempt TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.server_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firewall_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active server plans" ON public.server_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Super admin can manage plans" ON public.server_plans
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authorized users can view performance" ON public.server_performance
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'server_manager')
  );

CREATE POLICY "Authorized users can view incidents" ON public.server_incidents
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'server_manager')
  );

CREATE POLICY "Authorized users can manage incidents" ON public.server_incidents
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'server_manager')
  );

CREATE POLICY "Authorized users can view firewall rules" ON public.firewall_rules
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'server_manager')
  );

CREATE POLICY "Super admin can manage firewall rules" ON public.firewall_rules
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can view their own purchases" ON public.server_purchases
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create purchases" ON public.server_purchases
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Authorized users can view billing" ON public.server_billing
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR 
    public.has_role(auth.uid(), 'server_manager')
  );

CREATE POLICY "Super admin can manage webhooks" ON public.server_webhooks
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin'));

-- Insert default server plans
INSERT INTO public.server_plans (plan_name, plan_type, cpu_cores, ram_gb, storage_gb, bandwidth_tb, price_monthly, price_yearly, is_recommended, recommended_for) VALUES
('Starter Compute', 'compute', 2, 4, 50, 1, 29.99, 299.90, false, ARRAY['web']),
('Pro Compute', 'compute', 4, 8, 100, 2, 59.99, 599.90, true, ARRAY['web', 'api']),
('Enterprise Compute', 'compute', 8, 16, 200, 5, 119.99, 1199.90, false, ARRAY['high_load']),
('Memory Optimized S', 'memory', 2, 16, 50, 1, 49.99, 499.90, false, ARRAY['cache']),
('Memory Optimized L', 'memory', 4, 32, 100, 2, 99.99, 999.90, true, ARRAY['database', 'cache']),
('Storage Basic', 'storage', 2, 4, 500, 2, 39.99, 399.90, false, ARRAY['backup']),
('Storage Pro', 'storage', 4, 8, 2000, 5, 89.99, 899.90, true, ARRAY['backup', 'media']),
('GPU Starter', 'gpu', 4, 16, 100, 2, 199.99, 1999.90, false, ARRAY['ai', 'ml']),
('GPU Pro', 'gpu', 8, 32, 200, 5, 399.99, 3999.90, true, ARRAY['ai', 'ml', 'training'])
ON CONFLICT DO NOTHING;

-- Enable realtime for live monitoring
ALTER PUBLICATION supabase_realtime ADD TABLE public.server_alerts;