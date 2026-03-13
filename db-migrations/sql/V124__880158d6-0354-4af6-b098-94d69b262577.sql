-- Box Action Permissions System
-- Enforces role-based access control for box-level actions

-- ===== BOX ACTION PERMISSIONS TABLE =====
CREATE TABLE IF NOT EXISTS public.box_action_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    box_type TEXT NOT NULL CHECK (box_type IN ('data', 'process', 'ai', 'approval', 'live')),
    action_type TEXT NOT NULL CHECK (action_type IN ('view', 'edit', 'update', 'post', 'approve', 'reject', 'suspend', 'resume', 'stop', 'start', 'delete', 'startAi', 'stopAi', 'viewLogs', 'pauseMonitoring')),
    is_allowed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (role, box_type, action_type)
);

-- Enable RLS
ALTER TABLE public.box_action_permissions ENABLE ROW LEVEL SECURITY;

-- Anyone can read permissions (needed for UI to know what buttons to show)
CREATE POLICY "Permissions are publicly readable"
ON public.box_action_permissions
FOR SELECT
USING (true);

-- ===== BOX ACTION AUDIT LOGS =====
CREATE TABLE IF NOT EXISTS public.box_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_role TEXT NOT NULL,
    box_type TEXT NOT NULL,
    box_entity_id TEXT NOT NULL,
    action_type TEXT NOT NULL,
    action_result TEXT NOT NULL CHECK (action_result IN ('success', 'denied', 'error')),
    previous_status TEXT,
    new_status TEXT,
    metadata JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.box_action_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own action logs
CREATE POLICY "Users can view their own action logs"
ON public.box_action_logs
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert action logs
CREATE POLICY "System can insert action logs"
ON public.box_action_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ===== BOX STATUS TRACKING =====
CREATE TABLE IF NOT EXISTS public.box_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id TEXT NOT NULL UNIQUE,
    box_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'stopped', 'error')),
    last_action TEXT,
    last_action_by UUID,
    last_action_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.box_status ENABLE ROW LEVEL SECURITY;

-- Anyone can read box status
CREATE POLICY "Box status is publicly readable"
ON public.box_status
FOR SELECT
USING (true);

-- Authenticated users can update status
CREATE POLICY "Authenticated users can update box status"
ON public.box_status
FOR ALL
TO authenticated
USING (true);

-- ===== DEFAULT PERMISSION SEEDS =====
-- Boss/Owner gets ALL permissions
INSERT INTO public.box_action_permissions (role, box_type, action_type, is_allowed)
SELECT 'boss_owner', box_type, action_type, true
FROM (VALUES ('data'), ('process'), ('ai'), ('approval'), ('live')) AS bt(box_type)
CROSS JOIN (VALUES ('view'), ('edit'), ('update'), ('post'), ('approve'), ('reject'), ('suspend'), ('resume'), ('stop'), ('start'), ('delete'), ('startAi'), ('stopAi'), ('viewLogs'), ('pauseMonitoring')) AS at(action_type)
ON CONFLICT (role, box_type, action_type) DO NOTHING;

-- CEO gets strategic actions (no delete)
INSERT INTO public.box_action_permissions (role, box_type, action_type, is_allowed)
SELECT 'ceo', box_type, action_type, true
FROM (VALUES ('data'), ('process'), ('ai'), ('approval'), ('live')) AS bt(box_type)
CROSS JOIN (VALUES ('view'), ('edit'), ('update'), ('approve'), ('reject'), ('suspend'), ('resume'), ('stop'), ('start'), ('startAi'), ('stopAi'), ('viewLogs'), ('pauseMonitoring')) AS at(action_type)
ON CONFLICT (role, box_type, action_type) DO NOTHING;

-- Area Manager gets operational actions
INSERT INTO public.box_action_permissions (role, box_type, action_type, is_allowed)
SELECT 'area_manager', box_type, action_type, true
FROM (VALUES ('data'), ('process'), ('ai'), ('approval'), ('live')) AS bt(box_type)
CROSS JOIN (VALUES ('view'), ('edit'), ('update'), ('approve'), ('reject'), ('resume'), ('start'), ('viewLogs')) AS at(action_type)
ON CONFLICT (role, box_type, action_type) DO NOTHING;

-- Finance Manager permissions
INSERT INTO public.box_action_permissions (role, box_type, action_type, is_allowed)
SELECT 'finance_manager', box_type, action_type, true
FROM (VALUES ('data'), ('approval')) AS bt(box_type)
CROSS JOIN (VALUES ('view'), ('edit'), ('update'), ('approve'), ('reject')) AS at(action_type)
ON CONFLICT (role, box_type, action_type) DO NOTHING;

-- Super Admin gets ALL permissions
INSERT INTO public.box_action_permissions (role, box_type, action_type, is_allowed)
SELECT 'super_admin', box_type, action_type, true
FROM (VALUES ('data'), ('process'), ('ai'), ('approval'), ('live')) AS bt(box_type)
CROSS JOIN (VALUES ('view'), ('edit'), ('update'), ('post'), ('approve'), ('reject'), ('suspend'), ('resume'), ('stop'), ('start'), ('delete'), ('startAi'), ('stopAi'), ('viewLogs'), ('pauseMonitoring')) AS at(action_type)
ON CONFLICT (role, box_type, action_type) DO NOTHING;

-- Readonly roles get view only
INSERT INTO public.box_action_permissions (role, box_type, action_type, is_allowed)
SELECT role, box_type, 'view', true
FROM (VALUES ('client'), ('reseller'), ('franchise'), ('influencer'), ('prime')) AS r(role)
CROSS JOIN (VALUES ('data'), ('process'), ('ai'), ('approval'), ('live')) AS bt(box_type)
ON CONFLICT (role, box_type, action_type) DO NOTHING;

-- ===== FUNCTION: Check box action permission =====
CREATE OR REPLACE FUNCTION public.check_box_action_permission(
    _user_id UUID,
    _box_type TEXT,
    _action_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    _user_role TEXT;
    _is_allowed BOOLEAN;
BEGIN
    -- Get user's role (cast enum to text)
    SELECT role::text INTO _user_role
    FROM public.user_roles
    WHERE user_id = _user_id
    LIMIT 1;
    
    IF _user_role IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check permission
    SELECT is_allowed INTO _is_allowed
    FROM public.box_action_permissions
    WHERE role = _user_role
    AND box_type = _box_type
    AND action_type = _action_type;
    
    RETURN COALESCE(_is_allowed, false);
END;
$$;