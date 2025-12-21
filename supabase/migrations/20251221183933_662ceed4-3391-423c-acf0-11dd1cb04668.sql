
-- SOFTWARE VALA - Enterprise Tables (No FK conflicts)

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ip_address TEXT,
    device_info TEXT,
    location TEXT,
    country TEXT,
    login_at TIMESTAMPTZ DEFAULT now(),
    logout_at TIMESTAMPTZ,
    force_logout_flag BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ip_address TEXT,
    device_info TEXT,
    attempt_status TEXT DEFAULT 'success',
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.masked_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    masked_email TEXT NOT NULL,
    masked_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_timers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    developer_id UUID NOT NULL,
    start_time TIMESTAMPTZ DEFAULT now(),
    end_time TIMESTAMPTZ,
    total_seconds INTEGER DEFAULT 0,
    is_paused BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'running',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL,
    keyword TEXT NOT NULL,
    current_rank INTEGER,
    region TEXT,
    status TEXT DEFAULT 'tracking',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type TEXT DEFAULT 'direct',
    purpose TEXT,
    created_by UUID NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_room_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id),
    sender_id UUID NOT NULL,
    masked_sender_name TEXT,
    message_text TEXT NOT NULL,
    edit_blocked BOOLEAN DEFAULT true,
    delete_blocked BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_role app_role,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.masked_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_timers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_audit_log ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_user ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.master_audit_log(user_id);

-- RLS Policies
CREATE POLICY "session_own" ON public.user_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "session_admin" ON public.user_sessions FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "login_own" ON public.login_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "login_insert" ON public.login_history FOR INSERT WITH CHECK (true);
CREATE POLICY "mask_own" ON public.masked_identities FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "mask_admin" ON public.masked_identities FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "timer_dev" ON public.task_timers FOR ALL USING (developer_id = get_developer_id(auth.uid()));
CREATE POLICY "seo_manage" ON public.seo_keywords FOR ALL USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'seo_manager'));
CREATE POLICY "room_view" ON public.chat_rooms FOR SELECT USING (created_by = auth.uid() OR has_role(auth.uid(), 'super_admin'));
CREATE POLICY "room_create" ON public.chat_rooms FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "msg_view" ON public.chat_room_messages FOR SELECT USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "msg_send" ON public.chat_room_messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "settings_public" ON public.system_settings FOR SELECT USING (is_public = true);
CREATE POLICY "settings_admin" ON public.system_settings FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "audit_admin" ON public.master_audit_log FOR SELECT USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "audit_insert" ON public.master_audit_log FOR INSERT WITH CHECK (true);
