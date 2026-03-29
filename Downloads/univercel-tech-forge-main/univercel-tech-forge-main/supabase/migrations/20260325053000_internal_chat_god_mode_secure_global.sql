CREATE OR REPLACE FUNCTION public.can_manage_internal_chat(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN (
        'boss_owner'::public.app_role,
        'master'::public.app_role,
        'super_admin'::public.app_role,
        'ceo'::public.app_role,
        'admin'::public.app_role,
        'api_security'::public.app_role,
        'hr_manager'::public.app_role,
        'legal_compliance'::public.app_role,
        'support'::public.app_role,
        'client_success'::public.app_role
      )
  );
$$;

ALTER TABLE public.internal_chat_channels
  ADD COLUMN IF NOT EXISTS auto_translate_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_ai_auto_reply boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_boss_monitor boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS risk_level text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS escalation_mode text NOT NULL DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE public.internal_chat_messages
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS moderation_score numeric(6,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contains_sensitive_data boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS translated_content text,
  ADD COLUMN IF NOT EXISTS translated_language text,
  ADD COLUMN IF NOT EXISTS ai_summary text,
  ADD COLUMN IF NOT EXISTS escalation_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS delivery_status text NOT NULL DEFAULT 'delivered';

CREATE TABLE IF NOT EXISTS public.internal_chat_channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.internal_chat_channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role public.app_role,
  can_post boolean NOT NULL DEFAULT true,
  added_by uuid REFERENCES auth.users(id),
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (channel_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.internal_chat_escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.internal_chat_channels(id) ON DELETE CASCADE,
  message_id uuid REFERENCES public.internal_chat_messages(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  escalation_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  reason text,
  ai_summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  resolved_by uuid REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS public.internal_chat_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.internal_chat_channels(id) ON DELETE CASCADE,
  message_id uuid REFERENCES public.internal_chat_messages(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type text NOT NULL,
  activity_summary text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.internal_chat_control_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key text NOT NULL UNIQUE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.internal_chat_channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_chat_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_chat_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_chat_control_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.touch_internal_chat_channel()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_internal_chat_channel ON public.internal_chat_channels;
CREATE TRIGGER trg_touch_internal_chat_channel
BEFORE UPDATE ON public.internal_chat_channels
FOR EACH ROW
EXECUTE FUNCTION public.touch_internal_chat_channel();

CREATE OR REPLACE FUNCTION public.can_access_internal_channel(_user_id uuid, _channel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.internal_chat_channels c
    WHERE c.id = _channel_id
      AND c.is_active = true
      AND (
        c.created_by = _user_id
        OR public.can_manage_internal_chat(_user_id)
        OR EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.user_id = _user_id
            AND c.target_roles IS NOT NULL
            AND ur.role = ANY(c.target_roles)
        )
        OR EXISTS (
          SELECT 1
          FROM public.internal_chat_channel_members m
          WHERE m.channel_id = c.id
            AND m.user_id = _user_id
        )
      )
  );
$$;

DROP POLICY IF EXISTS "Authenticated users can view active approved channels" ON public.internal_chat_channels;
CREATE POLICY "Authorized users can view active approved channels"
ON public.internal_chat_channels FOR SELECT
TO authenticated
USING (
  is_active = true
  AND (
    public.can_access_internal_channel(auth.uid(), id)
    OR (is_approved = false AND public.can_manage_internal_chat(auth.uid()))
  )
);

DROP POLICY IF EXISTS "Super admin can manage all channels" ON public.internal_chat_channels;
CREATE POLICY "Managers can manage internal chat channels"
ON public.internal_chat_channels FOR ALL
TO authenticated
USING (public.can_manage_internal_chat(auth.uid()))
WITH CHECK (public.can_manage_internal_chat(auth.uid()));

DROP POLICY IF EXISTS "Channel role members can view messages" ON public.internal_chat_messages;
CREATE POLICY "Authorized users can read internal chat messages"
ON public.internal_chat_messages FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid()
  OR public.can_access_internal_channel(auth.uid(), channel_id)
);

DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.internal_chat_messages;
CREATE POLICY "Authorized users can insert internal chat messages"
ON public.internal_chat_messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND public.can_access_internal_channel(auth.uid(), channel_id)
);

DROP POLICY IF EXISTS "Super admin can manage all messages" ON public.internal_chat_messages;
CREATE POLICY "Managers can manage internal chat messages"
ON public.internal_chat_messages FOR ALL
TO authenticated
USING (public.can_manage_internal_chat(auth.uid()))
WITH CHECK (public.can_manage_internal_chat(auth.uid()));

CREATE POLICY "Users can view own chat memberships"
ON public.internal_chat_channel_members FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.can_manage_internal_chat(auth.uid()));

CREATE POLICY "Managers can manage chat memberships"
ON public.internal_chat_channel_members FOR ALL
TO authenticated
USING (public.can_manage_internal_chat(auth.uid()))
WITH CHECK (public.can_manage_internal_chat(auth.uid()));

CREATE POLICY "Users can view own escalations and managers can view all"
ON public.internal_chat_escalations FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.can_manage_internal_chat(auth.uid()));

CREATE POLICY "Managers can manage escalations"
ON public.internal_chat_escalations FOR ALL
TO authenticated
USING (public.can_manage_internal_chat(auth.uid()))
WITH CHECK (public.can_manage_internal_chat(auth.uid()));

CREATE POLICY "Users can view own chat activity and managers can view all"
ON public.internal_chat_activity_log FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.can_manage_internal_chat(auth.uid()));

CREATE POLICY "System can insert chat activity"
ON public.internal_chat_activity_log FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Managers can view and update chat control settings"
ON public.internal_chat_control_settings FOR ALL
TO authenticated
USING (public.can_manage_internal_chat(auth.uid()))
WITH CHECK (public.can_manage_internal_chat(auth.uid()));

INSERT INTO public.internal_chat_control_settings (settings_key, settings)
VALUES (
  'global',
  jsonb_build_object(
    'ai_first_reply', true,
    'auto_translate', true,
    'boss_monitor', true,
    'voice_transcription', true,
    'allow_external_contact', false,
    'screenshot_notice', true,
    'escalation_threshold', 70,
    'mute_threshold', 3
  )
)
ON CONFLICT (settings_key) DO NOTHING;

INSERT INTO public.internal_chat_channels (
  name,
  description,
  channel_type,
  target_roles,
  is_active,
  is_approved,
  auto_translate_enabled,
  allow_ai_auto_reply,
  allow_boss_monitor,
  risk_level,
  escalation_mode
)
SELECT *
FROM (
  VALUES
    (
      'Global Ops Bridge',
      'AI-routed global operations coordination with masked identities only.',
      'role_based',
      ARRAY['boss_owner'::public.app_role, 'master'::public.app_role, 'super_admin'::public.app_role, 'ceo'::public.app_role, 'admin'::public.app_role, 'support'::public.app_role, 'client_success'::public.app_role],
      true,
      true,
      true,
      true,
      true,
      'high',
      'auto'
    ),
    (
      'Developer Secure Grid',
      'Developer and task execution channel with AI-assisted routing.',
      'role_based',
      ARRAY['developer'::public.app_role, 'task_manager'::public.app_role, 'rnd_manager'::public.app_role, 'admin'::public.app_role],
      true,
      true,
      true,
      true,
      true,
      'normal',
      'auto'
    ),
    (
      'Sales And Support Shield',
      'Sales, lead and support collaboration with leak prevention.',
      'role_based',
      ARRAY['lead_manager'::public.app_role, 'support'::public.app_role, 'client_success'::public.app_role, 'marketing_manager'::public.app_role, 'admin'::public.app_role],
      true,
      true,
      true,
      true,
      true,
      'normal',
      'auto'
    ),
    (
      'Boss Monitor Broadcast',
      'Read-only executive broadcast and escalation monitor.',
      'broadcast',
      ARRAY['boss_owner'::public.app_role, 'master'::public.app_role, 'super_admin'::public.app_role, 'ceo'::public.app_role, 'admin'::public.app_role],
      true,
      true,
      true,
      true,
      true,
      'critical',
      'manual'
    )
) AS seed(
  name,
  description,
  channel_type,
  target_roles,
  is_active,
  is_approved,
  auto_translate_enabled,
  allow_ai_auto_reply,
  allow_boss_monitor,
  risk_level,
  escalation_mode
)
WHERE NOT EXISTS (
  SELECT 1 FROM public.internal_chat_channels existing WHERE existing.name = seed.name
);

CREATE INDEX IF NOT EXISTS idx_internal_chat_messages_moderation_status ON public.internal_chat_messages(moderation_status);
CREATE INDEX IF NOT EXISTS idx_internal_chat_messages_escalation_status ON public.internal_chat_messages(escalation_status);
CREATE INDEX IF NOT EXISTS idx_internal_chat_channels_updated_at ON public.internal_chat_channels(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_internal_chat_channel_members_user_id ON public.internal_chat_channel_members(user_id);
CREATE INDEX IF NOT EXISTS idx_internal_chat_channel_members_channel_id ON public.internal_chat_channel_members(channel_id);
CREATE INDEX IF NOT EXISTS idx_internal_chat_escalations_status ON public.internal_chat_escalations(status, severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internal_chat_activity_log_channel_id ON public.internal_chat_activity_log(channel_id, created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'internal_chat_escalations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.internal_chat_escalations;
  END IF;
END $$;