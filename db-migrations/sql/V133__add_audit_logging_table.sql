-- V133__add_audit_logging_table.sql
-- Add comprehensive audit logging table for system-wide activity tracking

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(255) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by UUID NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT now(),
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'success'
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON public.audit_logs(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_by ON public.audit_logs(changed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit trail for all system changes';
COMMENT ON COLUMN public.audit_logs.entity_type IS 'Type of entity being audited (e.g., user, order, product)';
COMMENT ON COLUMN public.audit_logs.action IS 'Action performed (INSERT, UPDATE, DELETE)';
COMMENT ON COLUMN public.audit_logs.old_values IS 'Previous values before change';
COMMENT ON COLUMN public.audit_logs.new_values IS 'New values after change';
