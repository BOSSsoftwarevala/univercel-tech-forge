
-- ═══════════════════════════════════════════════════════════════
-- MASTER ADMIN - Part 3: Identity & Access Control (Final Lock)
-- ═══════════════════════════════════════════════════════════════

-- MASTER ROLES
CREATE TABLE IF NOT EXISTS public.master_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    scope_level TEXT NOT NULL DEFAULT 'global' CHECK (scope_level IN ('global', 'continent', 'country', 'region')),
    hierarchy_level INTEGER NOT NULL DEFAULT 0,
    is_system_role BOOLEAN DEFAULT false,
    can_be_deleted BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- MASTER PERMISSIONS
CREATE TABLE IF NOT EXISTS public.master_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_code TEXT NOT NULL UNIQUE,
    permission_name TEXT NOT NULL,
    description TEXT,
    module_name TEXT NOT NULL,
    is_sensitive BOOLEAN DEFAULT false,
    requires_2fa BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ROLE-PERMISSION MAPPING
CREATE TABLE IF NOT EXISTS public.master_role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.master_roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.master_permissions(id) ON DELETE CASCADE,
    granted_by UUID,
    granted_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(role_id, permission_id)
);

-- MASTER USERS (Control Center Users)
CREATE TABLE IF NOT EXISTS public.master_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role_id UUID REFERENCES public.master_roles(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'locked', 'pending', 'terminated')),
    status_reason TEXT,
    last_login_at TIMESTAMPTZ,
    last_login_ip TEXT,
    login_count INTEGER DEFAULT 0,
    failed_login_count INTEGER DEFAULT 0,
    is_2fa_enabled BOOLEAN DEFAULT false,
    assigned_continent_id UUID REFERENCES public.master_continents(id),
    assigned_country_ids UUID[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- USER SESSIONS TRACKING
CREATE TABLE IF NOT EXISTS public.master_user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.master_users(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    device_fingerprint TEXT,
    geo_location TEXT,
    is_active BOOLEAN DEFAULT true,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_activity_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    terminated_at TIMESTAMPTZ,
    terminated_reason TEXT
);

-- PERMISSION GRANTS (Dynamic per-user overrides)
CREATE TABLE IF NOT EXISTS public.master_permission_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.master_users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.master_permissions(id) ON DELETE CASCADE,
    grant_type TEXT NOT NULL DEFAULT 'allow' CHECK (grant_type IN ('allow', 'deny')),
    granted_by UUID,
    expires_at TIMESTAMPTZ,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, permission_id)
);

-- ENABLE RLS
ALTER TABLE public.master_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_permission_grants ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "master_roles_all" ON public.master_roles FOR ALL USING (public.is_master());
CREATE POLICY "master_permissions_all" ON public.master_permissions FOR ALL USING (public.is_master());
CREATE POLICY "master_role_permissions_all" ON public.master_role_permissions FOR ALL USING (public.is_master());
CREATE POLICY "master_users_all" ON public.master_users FOR ALL USING (public.is_master());
CREATE POLICY "master_user_sessions_all" ON public.master_user_sessions FOR ALL USING (public.is_master());
CREATE POLICY "master_permission_grants_all" ON public.master_permission_grants FOR ALL USING (public.is_master());

-- Super Admin read access
CREATE POLICY "super_admin_roles_read" ON public.master_roles FOR SELECT USING (public.is_super_admin());
CREATE POLICY "super_admin_permissions_read" ON public.master_permissions FOR SELECT USING (public.is_super_admin());
CREATE POLICY "super_admin_users_read" ON public.master_users FOR SELECT USING (public.is_super_admin());

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_master_users_role ON public.master_users(role_id);
CREATE INDEX IF NOT EXISTS idx_master_users_status ON public.master_users(status);
CREATE INDEX IF NOT EXISTS idx_master_users_email ON public.master_users(email);
CREATE INDEX IF NOT EXISTS idx_master_sessions_user ON public.master_user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_master_sessions_active ON public.master_user_sessions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_master_role_perms_role ON public.master_role_permissions(role_id);

-- TIMESTAMP TRIGGERS
CREATE TRIGGER update_master_roles_ts BEFORE UPDATE ON public.master_roles FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();
CREATE TRIGGER update_master_users_ts BEFORE UPDATE ON public.master_users FOR EACH ROW EXECUTE FUNCTION public.master_update_timestamp();

-- AUTO-LOG USER STATUS CHANGES TO BLACKBOX
CREATE OR REPLACE FUNCTION public.log_user_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        PERFORM public.log_to_blackbox(
            'update',
            'identity',
            'master_user',
            NEW.id,
            NULL,
            NULL,
            NULL,
            NULL,
            NULL,
            CASE WHEN NEW.status IN ('suspended', 'locked', 'terminated') THEN 70 ELSE 20 END,
            jsonb_build_object(
                'old_status', OLD.status,
                'new_status', NEW.status,
                'reason', NEW.status_reason
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER log_user_status_change_trigger
    AFTER UPDATE ON public.master_users
    FOR EACH ROW EXECUTE FUNCTION public.log_user_status_change();

-- SEED: ROLES
INSERT INTO public.master_roles (name, display_name, scope_level, hierarchy_level, is_system_role, can_be_deleted) VALUES
    ('master', 'Master Admin', 'global', 100, true, false),
    ('super_admin', 'Super Admin', 'global', 90, true, false),
    ('admin', 'Administrator', 'continent', 70, true, false),
    ('security', 'Security Officer', 'global', 80, true, false),
    ('auditor', 'Auditor', 'global', 60, true, false),
    ('viewer', 'Viewer', 'country', 10, true, false)
ON CONFLICT (name) DO NOTHING;

-- SEED: PERMISSIONS
INSERT INTO public.master_permissions (permission_code, permission_name, module_name, is_sensitive, requires_2fa) VALUES
    -- Overview
    ('overview.view', 'View Overview', 'overview', false, false),
    ('overview.blackbox.view', 'View Blackbox Panel', 'overview', true, false),
    -- Continents
    ('continents.view', 'View Continents', 'continents', false, false),
    ('continents.manage', 'Manage Continents', 'continents', true, true),
    ('continents.lock', 'Lock Continent', 'continents', true, true),
    -- Super Admins
    ('superadmins.view', 'View Super Admins', 'super_admins', true, false),
    ('superadmins.manage', 'Manage Super Admins', 'super_admins', true, true),
    ('superadmins.suspend', 'Suspend Super Admin', 'super_admins', true, true),
    -- Global Rules
    ('rules.view', 'View Rules', 'global_rules', false, false),
    ('rules.create', 'Create Rules', 'global_rules', true, true),
    ('rules.execute', 'Execute Rules', 'global_rules', true, true),
    -- Approvals
    ('approvals.view', 'View Approvals', 'approvals', false, false),
    ('approvals.decide', 'Approve/Reject', 'approvals', true, true),
    ('approvals.escalate', 'Escalate Approvals', 'approvals', true, false),
    -- Security
    ('security.view', 'View Security', 'security', true, false),
    ('security.manage', 'Manage Security', 'security', true, true),
    ('security.block_ip', 'Block IP Address', 'security', true, true),
    -- Audit
    ('audit.view', 'View Audit Logs', 'audit', true, false),
    ('audit.export', 'Export Audit', 'audit', true, true),
    ('audit.replay', 'Replay Timeline', 'audit', true, false),
    -- System Lock
    ('systemlock.view', 'View System Lock', 'system_lock', true, false),
    ('systemlock.activate', 'Activate Lock', 'system_lock', true, true),
    ('systemlock.release', 'Release Lock', 'system_lock', true, true),
    -- Rental
    ('rental.view', 'View Rentals', 'rental', false, false),
    ('rental.manage', 'Manage Rentals', 'rental', true, true),
    ('rental.revoke', 'Revoke Rental', 'rental', true, true),
    -- AI Watcher
    ('ai.view', 'View AI Analysis', 'ai_watcher', true, false),
    ('ai.alerts.manage', 'Manage AI Alerts', 'ai_watcher', true, false)
ON CONFLICT (permission_code) DO NOTHING;

-- ASSIGN ALL PERMISSIONS TO MASTER ROLE
INSERT INTO public.master_role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.master_roles r, public.master_permissions p
WHERE r.name = 'master'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ASSIGN MOST PERMISSIONS TO SUPER_ADMIN (except system lock activate)
INSERT INTO public.master_role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.master_roles r, public.master_permissions p
WHERE r.name = 'super_admin' 
AND p.permission_code NOT IN ('systemlock.activate', 'systemlock.release')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ASSIGN VIEW PERMISSIONS TO AUDITOR
INSERT INTO public.master_role_permissions (role_id, permission_id)
SELECT r.id, p.id 
FROM public.master_roles r, public.master_permissions p
WHERE r.name = 'auditor' 
AND p.permission_code LIKE '%.view' OR p.permission_code IN ('audit.export', 'audit.replay')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- CHECK USER HAS PERMISSION FUNCTION
CREATE OR REPLACE FUNCTION public.master_user_has_permission(p_user_id UUID, p_permission_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_permission BOOLEAN := false;
    v_grant_override TEXT;
BEGIN
    -- Check for explicit deny first
    SELECT grant_type INTO v_grant_override
    FROM public.master_permission_grants
    WHERE user_id = p_user_id
    AND permission_id = (SELECT id FROM public.master_permissions WHERE permission_code = p_permission_code)
    AND (expires_at IS NULL OR expires_at > now());
    
    IF v_grant_override = 'deny' THEN
        RETURN false;
    ELSIF v_grant_override = 'allow' THEN
        RETURN true;
    END IF;
    
    -- Check role permissions
    SELECT EXISTS (
        SELECT 1 FROM public.master_users u
        JOIN public.master_role_permissions rp ON u.role_id = rp.role_id
        JOIN public.master_permissions p ON rp.permission_id = p.id
        WHERE u.id = p_user_id
        AND p.permission_code = p_permission_code
        AND u.status = 'active'
    ) INTO v_has_permission;
    
    RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- CHECK SYSTEM LOCK STATUS FUNCTION
CREATE OR REPLACE FUNCTION public.is_system_locked(p_scope TEXT DEFAULT 'global', p_target_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.master_system_locks
        WHERE is_active = true
        AND (
            lock_scope = 'global'
            OR (lock_scope = p_scope AND (p_target_id IS NULL OR target_id = p_target_id))
        )
        AND (scheduled_release_at IS NULL OR scheduled_release_at > now())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RENTAL AUTO-EXPIRY CHECK
CREATE OR REPLACE FUNCTION public.check_rental_active(p_user_id UUID, p_feature_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.master_rentals r
        JOIN public.master_rentable_features f ON r.feature_id = f.id
        WHERE r.user_id = p_user_id
        AND f.feature_code = p_feature_code
        AND r.status = 'active'
        AND r.end_time > now()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- AUTO-EXPIRE RENTALS FUNCTION
CREATE OR REPLACE FUNCTION public.auto_expire_rentals()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.master_rentals
    SET status = 'expired', updated_at = now()
    WHERE status = 'active' AND end_time <= now();
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    
    -- Log to blackbox if any expired
    IF v_count > 0 THEN
        PERFORM public.log_to_blackbox(
            'update',
            'rental_engine',
            'rental_batch',
            NULL,
            NULL,
            'system',
            NULL, NULL, NULL,
            0,
            jsonb_build_object('action', 'auto_expire', 'count', v_count)
        );
    END IF;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
