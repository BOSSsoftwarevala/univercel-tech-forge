
-- ═══════════════════════════════════════════════════════════════
-- MASTER ADMIN CONTROL CENTER - CORE DATABASE ARCHITECTURE
-- Part 1: Core Tables
-- ═══════════════════════════════════════════════════════════════

-- GEOGRAPHIC CONTROL
CREATE TABLE IF NOT EXISTS public.master_continents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'locked')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    continent_id UUID REFERENCES public.master_continents(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    iso_code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'locked')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BLACKBOX (IMMUTABLE CORE)
CREATE TABLE IF NOT EXISTS public.blackbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    module_name TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    user_id UUID,
    role_name TEXT,
    ip_address TEXT,
    geo_location TEXT,
    device_fingerprint TEXT,
    user_agent TEXT,
    risk_score INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    is_sealed BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent blackbox modifications
CREATE OR REPLACE FUNCTION public.prevent_blackbox_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'BLACKBOX is immutable - modifications are forbidden';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS blackbox_no_update ON public.blackbox_events;
DROP TRIGGER IF EXISTS blackbox_no_delete ON public.blackbox_events;

CREATE TRIGGER blackbox_no_update
    BEFORE UPDATE ON public.blackbox_events
    FOR EACH ROW EXECUTE FUNCTION public.prevent_blackbox_modification();

CREATE TRIGGER blackbox_no_delete
    BEFORE DELETE ON public.blackbox_events
    FOR EACH ROW EXECUTE FUNCTION public.prevent_blackbox_modification();

-- LIVE ACTIVITY ENGINE
CREATE TABLE IF NOT EXISTS public.master_live_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_module TEXT NOT NULL,
    action_name TEXT NOT NULL,
    action_description TEXT,
    user_id UUID,
    user_role TEXT,
    severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    payload JSONB DEFAULT '{}',
    blackbox_event_id UUID REFERENCES public.blackbox_events(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SUPER ADMIN CONTROL
CREATE TABLE IF NOT EXISTS public.master_super_admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    authority_scope JSONB NOT NULL DEFAULT '{"level": "global", "regions": []}',
    assigned_continent_id UUID REFERENCES public.master_continents(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'locked', 'pending')),
    last_active_at TIMESTAMPTZ,
    total_actions INTEGER DEFAULT 0,
    risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    super_admin_id UUID REFERENCES public.master_super_admin_profiles(id) ON DELETE RESTRICT,
    action TEXT NOT NULL,
    action_category TEXT NOT NULL,
    target_entity_type TEXT,
    target_entity_id UUID,
    ip_address TEXT,
    blackbox_event_id UUID REFERENCES public.blackbox_events(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GLOBAL RULES ENGINE
CREATE TABLE IF NOT EXISTS public.master_global_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name TEXT NOT NULL,
    rule_code TEXT NOT NULL UNIQUE,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('access', 'approval', 'security', 'rental', 'system')),
    description TEXT,
    rule_logic JSONB NOT NULL DEFAULT '{}',
    version INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
    impact_level TEXT DEFAULT 'low' CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
    created_by UUID,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_rule_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.master_global_rules(id) ON DELETE RESTRICT,
    executed_by UUID,
    execution_result TEXT NOT NULL CHECK (execution_result IN ('success', 'failure', 'partial', 'blocked')),
    impact_summary JSONB DEFAULT '{}',
    affected_entities INTEGER DEFAULT 0,
    blackbox_event_id UUID REFERENCES public.blackbox_events(id),
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- HIGH-RISK APPROVALS
CREATE TABLE IF NOT EXISTS public.master_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type TEXT NOT NULL,
    request_title TEXT NOT NULL,
    request_description TEXT,
    requested_by UUID NOT NULL,
    requested_by_role TEXT,
    target_entity_type TEXT,
    target_entity_id UUID,
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_factors JSONB DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'escalated', 'expired')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    required_approvers INTEGER DEFAULT 1,
    current_approvers INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id UUID REFERENCES public.master_approvals(id) ON DELETE RESTRICT,
    step_number INTEGER NOT NULL,
    approver_role TEXT NOT NULL,
    approver_user_id UUID,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'skipped')),
    decision_notes TEXT,
    decision_at TIMESTAMPTZ,
    blackbox_event_id UUID REFERENCES public.blackbox_events(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SECURITY MONITORING
CREATE TABLE IF NOT EXISTS public.master_security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_description TEXT,
    user_id UUID,
    ip_address TEXT,
    geo_location TEXT,
    device_fingerprint TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    blackbox_event_id UUID REFERENCES public.blackbox_events(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_ip_watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address TEXT NOT NULL,
    risk_level TEXT NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    block_reason TEXT,
    blocked_by UUID,
    blocked_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    hit_count INTEGER DEFAULT 1,
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SYSTEM LOCK (KILL SWITCH)
CREATE TABLE IF NOT EXISTS public.master_system_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lock_scope TEXT NOT NULL CHECK (lock_scope IN ('global', 'continent', 'country', 'module', 'user', 'feature')),
    lock_type TEXT NOT NULL DEFAULT 'full' CHECK (lock_type IN ('full', 'partial', 'read_only', 'maintenance')),
    target_id UUID,
    target_name TEXT,
    reason TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'high' CHECK (severity IN ('low', 'medium', 'high', 'critical', 'emergency')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    activated_by UUID NOT NULL,
    activated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    scheduled_release_at TIMESTAMPTZ,
    released_by UUID,
    released_at TIMESTAMPTZ,
    release_notes TEXT,
    blackbox_event_id UUID REFERENCES public.blackbox_events(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AUDIT EXPORTS
CREATE TABLE IF NOT EXISTS public.master_audit_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requested_by UUID NOT NULL,
    export_type TEXT NOT NULL CHECK (export_type IN ('full', 'filtered', 'compliance', 'forensic', 'incident')),
    export_scope JSONB NOT NULL DEFAULT '{}',
    date_range_start TIMESTAMPTZ,
    date_range_end TIMESTAMPTZ,
    file_path TEXT,
    file_size_bytes BIGINT,
    watermark_hash TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 3,
    expires_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'downloaded', 'expired', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.master_live_activity;
