-- Server Instances table for managing servers
CREATE TABLE public.server_instances (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    server_name TEXT NOT NULL,
    server_code TEXT UNIQUE NOT NULL,
    server_type TEXT NOT NULL CHECK (server_type IN ('production', 'staging', 'development', 'backup', 'cdn', 'database')),
    status TEXT DEFAULT 'provisioning' CHECK (status IN ('provisioning', 'online', 'offline', 'maintenance', 'error', 'terminated')),
    region TEXT NOT NULL,
    ip_address TEXT,
    cpu_cores INTEGER DEFAULT 2,
    ram_gb INTEGER DEFAULT 4,
    storage_gb INTEGER DEFAULT 100,
    os_type TEXT DEFAULT 'ubuntu-22.04',
    auto_scaling_enabled BOOLEAN DEFAULT false,
    min_instances INTEGER DEFAULT 1,
    max_instances INTEGER DEFAULT 5,
    current_cpu_usage DECIMAL(5,2) DEFAULT 0,
    current_memory_usage DECIMAL(5,2) DEFAULT 0,
    current_disk_usage DECIMAL(5,2) DEFAULT 0,
    uptime_percentage DECIMAL(5,2) DEFAULT 100,
    last_health_check TIMESTAMP WITH TIME ZONE,
    health_status TEXT DEFAULT 'healthy' CHECK (health_status IN ('healthy', 'warning', 'critical', 'unknown')),
    auto_setup_completed BOOLEAN DEFAULT false,
    setup_config JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Server Backups table
CREATE TABLE public.server_backups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
    backup_name TEXT NOT NULL,
    backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental', 'differential', 'snapshot')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'expired', 'deleted')),
    size_gb DECIMAL(10,2),
    storage_location TEXT,
    encryption_enabled BOOLEAN DEFAULT true,
    encryption_key_id TEXT,
    retention_days INTEGER DEFAULT 30,
    expires_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    is_auto_backup BOOLEAN DEFAULT false,
    triggered_by UUID,
    restore_point_id TEXT,
    checksum TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Backup Schedules table
CREATE TABLE public.backup_schedules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
    schedule_name TEXT NOT NULL,
    backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental', 'differential', 'snapshot')),
    frequency TEXT NOT NULL CHECK (frequency IN ('hourly', 'daily', 'weekly', 'monthly', 'custom')),
    cron_expression TEXT,
    retention_days INTEGER DEFAULT 30,
    max_backups INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    notify_on_success BOOLEAN DEFAULT false,
    notify_on_failure BOOLEAN DEFAULT true,
    notification_emails TEXT[],
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Server Setup Logs table
CREATE TABLE public.server_setup_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
    output TEXT,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Server Metrics History table
CREATE TABLE public.server_metrics_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    server_id UUID REFERENCES public.server_instances(id) ON DELETE CASCADE,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    network_in_mbps DECIMAL(10,2),
    network_out_mbps DECIMAL(10,2),
    active_connections INTEGER,
    request_count INTEGER,
    error_count INTEGER,
    response_time_ms INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.server_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_setup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.server_metrics_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only super admins can manage servers
CREATE POLICY "Super admins manage servers" ON public.server_instances
    FOR ALL USING (public.has_privileged_role(auth.uid()));

CREATE POLICY "Super admins manage backups" ON public.server_backups
    FOR ALL USING (public.has_privileged_role(auth.uid()));

CREATE POLICY "Super admins manage backup schedules" ON public.backup_schedules
    FOR ALL USING (public.has_privileged_role(auth.uid()));

CREATE POLICY "Super admins view setup logs" ON public.server_setup_logs
    FOR ALL USING (public.has_privileged_role(auth.uid()));

CREATE POLICY "Super admins view metrics" ON public.server_metrics_history
    FOR ALL USING (public.has_privileged_role(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_server_instances_status ON public.server_instances(status);
CREATE INDEX idx_server_instances_region ON public.server_instances(region);
CREATE INDEX idx_server_backups_server_id ON public.server_backups(server_id);
CREATE INDEX idx_server_backups_status ON public.server_backups(status);
CREATE INDEX idx_backup_schedules_next_run ON public.backup_schedules(next_run_at);
CREATE INDEX idx_server_metrics_recorded_at ON public.server_metrics_history(recorded_at);

-- Trigger for updated_at
CREATE TRIGGER update_server_instances_updated_at
    BEFORE UPDATE ON public.server_instances
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_backup_schedules_updated_at
    BEFORE UPDATE ON public.backup_schedules
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();