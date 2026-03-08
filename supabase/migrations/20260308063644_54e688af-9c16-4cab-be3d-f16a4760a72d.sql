
-- CEO KPI Metrics - stores periodic KPI snapshots
CREATE TABLE public.ceo_kpi_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL DEFAULT 0,
  previous_value NUMERIC DEFAULT 0,
  change_percent NUMERIC DEFAULT 0,
  metric_category TEXT NOT NULL DEFAULT 'general',
  period_type TEXT NOT NULL DEFAULT 'daily',
  period_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Revenue Metrics - revenue breakdowns
CREATE TABLE public.ceo_revenue_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  revenue_source TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  target_amount NUMERIC DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  period_month TEXT NOT NULL,
  period_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  region TEXT DEFAULT 'global',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Product Performance
CREATE TABLE public.ceo_product_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID,
  product_name TEXT NOT NULL,
  total_sales INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  return_rate NUMERIC DEFAULT 0,
  growth_percent NUMERIC DEFAULT 0,
  category TEXT DEFAULT 'general',
  period_month TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Region Performance
CREATE TABLE public.ceo_region_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_name TEXT NOT NULL,
  country_code TEXT,
  total_users INTEGER NOT NULL DEFAULT 0,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  active_franchises INTEGER DEFAULT 0,
  growth_percent NUMERIC DEFAULT 0,
  market_share NUMERIC DEFAULT 0,
  risk_level TEXT DEFAULT 'low',
  period_month TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO System Health snapshots
CREATE TABLE public.ceo_system_health (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0,
  benchmark NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'healthy',
  module_name TEXT,
  details JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO AI Insights
CREATE TABLE public.ceo_ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL DEFAULT 'suggestion',
  title TEXT NOT NULL,
  description TEXT,
  confidence_score NUMERIC DEFAULT 0,
  impact_level TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'growth',
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID,
  acknowledged_at TIMESTAMPTZ,
  action_taken TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Reports
CREATE TABLE public.ceo_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL DEFAULT 'daily',
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  generated_by TEXT DEFAULT 'aira',
  status TEXT NOT NULL DEFAULT 'draft',
  submitted_to_boss BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ,
  boss_response TEXT,
  report_data JSONB DEFAULT '{}',
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CEO Scan Logs
CREATE TABLE public.ceo_scan_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_type TEXT NOT NULL DEFAULT 'full',
  initiated_by UUID,
  modules_scanned INTEGER DEFAULT 0,
  issues_found INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  scan_duration_ms INTEGER DEFAULT 0,
  scan_results JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ceo_kpi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_revenue_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_product_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_region_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_scan_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies - CEO role can read all, authenticated can read
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_kpi_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_revenue_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_product_performance FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_region_performance FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_system_health FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_ai_insights FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "CEO tables readable by authenticated" ON public.ceo_scan_logs FOR SELECT TO authenticated USING (true);

-- Insert policies for service role / edge functions
CREATE POLICY "Service can insert CEO data" ON public.ceo_kpi_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service can insert CEO data" ON public.ceo_revenue_metrics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service can insert CEO data" ON public.ceo_product_performance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service can insert CEO data" ON public.ceo_region_performance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service can insert CEO data" ON public.ceo_system_health FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service can insert CEO data" ON public.ceo_ai_insights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service can insert CEO data" ON public.ceo_reports FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Service can insert CEO data" ON public.ceo_scan_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Update policies for CEO insights (acknowledge) and reports (submit)
CREATE POLICY "CEO can update insights" ON public.ceo_ai_insights FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "CEO can update reports" ON public.ceo_reports FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.ceo_kpi_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ceo_ai_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ceo_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ceo_scan_logs;
