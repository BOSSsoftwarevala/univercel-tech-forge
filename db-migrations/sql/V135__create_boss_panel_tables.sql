-- V135__create_boss_panel_tables.sql
-- Create dedicated Boss Panel tables for metrics, modules, activity, reports, alerts, and audit

CREATE TABLE IF NOT EXISTS public.boss_system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_key VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL DEFAULT 0,
    metric_unit VARCHAR(50),
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    trend_direction VARCHAR(10) DEFAULT 'stable',
    trend_percentage NUMERIC DEFAULT 0,
    metadata JSONB,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_system_metrics_key ON public.boss_system_metrics(metric_key);
CREATE INDEX IF NOT EXISTS idx_boss_system_metrics_category ON public.boss_system_metrics(category);
CREATE INDEX IF NOT EXISTS idx_boss_system_metrics_recorded ON public.boss_system_metrics(recorded_at DESC);

CREATE TABLE IF NOT EXISTS public.boss_financial_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL DEFAULT 'daily',
    total_revenue NUMERIC NOT NULL DEFAULT 0,
    total_expenses NUMERIC NOT NULL DEFAULT 0,
    net_profit NUMERIC NOT NULL DEFAULT 0,
    gross_margin NUMERIC DEFAULT 0,
    revenue_by_source JSONB,
    expense_breakdown JSONB,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    is_forecast BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_financial_period ON public.boss_financial_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_boss_financial_type ON public.boss_financial_metrics(period_type);

CREATE TABLE IF NOT EXISTS public.boss_module_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_name VARCHAR(100) NOT NULL,
    module_key VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    health_score NUMERIC DEFAULT 100,
    uptime_percentage NUMERIC DEFAULT 100,
    last_heartbeat_at TIMESTAMPTZ,
    error_count INTEGER DEFAULT 0,
    warning_count INTEGER DEFAULT 0,
    request_count_24h INTEGER DEFAULT 0,
    avg_response_ms NUMERIC DEFAULT 0,
    version VARCHAR(20),
    dependencies JSONB,
    metadata JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_module_status_key ON public.boss_module_status(module_key);
CREATE INDEX IF NOT EXISTS idx_boss_module_status_status ON public.boss_module_status(status);

CREATE TABLE IF NOT EXISTS public.boss_user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    period_type VARCHAR(20) NOT NULL DEFAULT 'hourly',
    active_users INTEGER NOT NULL DEFAULT 0,
    new_signups INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    avg_session_duration_seconds NUMERIC DEFAULT 0,
    top_pages JSONB,
    activity_by_role JSONB,
    activity_by_region JSONB,
    bounce_rate NUMERIC DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_user_activity_period ON public.boss_user_activity(period_start DESC);
CREATE INDEX IF NOT EXISTS idx_boss_user_activity_type ON public.boss_user_activity(period_type);

CREATE TABLE IF NOT EXISTS public.boss_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    report_category VARCHAR(50) NOT NULL DEFAULT 'general',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    generated_by UUID,
    report_data JSONB,
    summary TEXT,
    period_start DATE,
    period_end DATE,
    file_url TEXT,
    file_format VARCHAR(10) DEFAULT 'pdf',
    is_scheduled BOOLEAN DEFAULT false,
    schedule_cron VARCHAR(100),
    next_run_at TIMESTAMPTZ,
    last_run_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_reports_type ON public.boss_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_boss_reports_status ON public.boss_reports(status);
CREATE INDEX IF NOT EXISTS idx_boss_reports_created ON public.boss_reports(created_at DESC);

CREATE TABLE IF NOT EXISTS public.boss_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_module VARCHAR(100),
    source_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    auto_generated BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_alerts_severity ON public.boss_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_boss_alerts_unresolved ON public.boss_alerts(is_resolved) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_boss_alerts_created ON public.boss_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_boss_alerts_type ON public.boss_alerts(alert_type);

CREATE TABLE IF NOT EXISTS public.boss_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_role VARCHAR(50),
    action_type VARCHAR(100) NOT NULL,
    action_target VARCHAR(255),
    target_id UUID,
    risk_level VARCHAR(20) DEFAULT 'low',
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    status VARCHAR(20) DEFAULT 'success',
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boss_audit_actor ON public.boss_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_boss_audit_action ON public.boss_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_boss_audit_risk ON public.boss_audit_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_boss_audit_created ON public.boss_audit_logs(created_at DESC);

-- RLS
ALTER TABLE public.boss_system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_financial_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_module_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_audit_logs ENABLE ROW LEVEL SECURITY;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.boss_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.boss_module_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.boss_system_metrics;
