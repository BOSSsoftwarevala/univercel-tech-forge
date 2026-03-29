-- Internal Chat Channels
CREATE TABLE public.internal_chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  channel_type TEXT NOT NULL DEFAULT 'role_based', -- 'role_based', 'direct', 'group', 'broadcast'
  target_roles public.app_role[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  is_frozen BOOLEAN DEFAULT false,
  frozen_by UUID REFERENCES auth.users(id),
  frozen_at TIMESTAMP WITH TIME ZONE
);

-- Internal Chat Messages
CREATE TABLE public.internal_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES public.internal_chat_channels(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  sender_role public.app_role NOT NULL,
  sender_masked_name TEXT NOT NULL,
  sender_region TEXT,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'voice_note', 'ai_auto_reply', 'system'
  content TEXT NOT NULL,
  original_content TEXT, -- Stores original before masking
  voice_transcript TEXT,
  is_masked BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  flagged_by TEXT, -- 'ai' or user_id
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_by UUID[] DEFAULT '{}'
);

-- Chat Violations Log
CREATE TABLE public.chat_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  channel_id UUID REFERENCES public.internal_chat_channels(id),
  message_id UUID REFERENCES public.internal_chat_messages(id),
  violation_type TEXT NOT NULL, -- 'contact_share', 'profanity', 'abuse', 'data_leak', 'bypass_attempt'
  violation_level INTEGER DEFAULT 1, -- 1=warning, 2=mute, 3=force_logout
  description TEXT,
  detected_content TEXT,
  action_taken TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Chat User Status
CREATE TABLE public.chat_user_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  is_online BOOLEAN DEFAULT false,
  is_muted BOOLEAN DEFAULT false,
  muted_until TIMESTAMP WITH TIME ZONE,
  mute_reason TEXT,
  violation_count INTEGER DEFAULT 0,
  last_seen TIMESTAMP WITH TIME ZONE,
  last_active_channel UUID REFERENCES public.internal_chat_channels(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.internal_chat_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_user_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for channels
CREATE POLICY "Authenticated users can view active approved channels"
ON public.internal_chat_channels FOR SELECT
TO authenticated
USING (is_active = true AND (is_approved = true OR public.has_role(auth.uid(), 'super_admin')));

CREATE POLICY "Super admin can manage all channels"
ON public.internal_chat_channels FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for messages
CREATE POLICY "Authenticated users can view messages in their channels"
ON public.internal_chat_messages FOR SELECT
TO authenticated
USING (is_visible = true OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Authenticated users can send messages"
ON public.internal_chat_messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Super admin can manage all messages"
ON public.internal_chat_messages FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for violations (super admin only)
CREATE POLICY "Super admin can view violations"
ON public.chat_violations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR user_id = auth.uid());

CREATE POLICY "System can create violations"
ON public.chat_violations FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for user status
CREATE POLICY "Users can view online status"
ON public.chat_user_status FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own status"
ON public.chat_user_status FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own status"
ON public.chat_user_status FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.internal_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_user_status;

-- Create indexes for performance
CREATE INDEX idx_chat_messages_channel ON public.internal_chat_messages(channel_id);
CREATE INDEX idx_chat_messages_sender ON public.internal_chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created ON public.internal_chat_messages(created_at DESC);
CREATE INDEX idx_chat_violations_user ON public.chat_violations(user_id);
CREATE INDEX idx_chat_status_user ON public.chat_user_status(user_id);