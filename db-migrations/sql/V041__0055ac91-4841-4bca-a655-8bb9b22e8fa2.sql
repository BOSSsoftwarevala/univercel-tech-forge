-- Create persistent notifications table
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'danger', 'priority')),
    message TEXT NOT NULL,
    event_type TEXT,
    action_label TEXT,
    action_url TEXT,
    is_buzzer BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    role_target TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications OR notifications targeted to their role
CREATE POLICY "Users can view own notifications"
ON public.user_notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: System can insert notifications for any user (service role)
CREATE POLICY "Authenticated users can insert notifications"
ON public.user_notifications
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update (mark read/dismissed) their own notifications
CREATE POLICY "Users can update own notifications"
ON public.user_notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own notifications
CREATE POLICY "Users can delete own notifications"
ON public.user_notifications
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_user_notifications_created_at ON public.user_notifications(created_at DESC);
CREATE INDEX idx_user_notifications_unread ON public.user_notifications(user_id, is_read) WHERE is_read = false;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;

-- Add two_factor_enabled column to user_roles if not exists
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS two_factor_method TEXT CHECK (two_factor_method IN ('email', 'authenticator', NULL));
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS two_factor_verified_at TIMESTAMPTZ;