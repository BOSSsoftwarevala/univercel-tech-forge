-- =============================================
-- SECURITY FIXES PART 1: CHAT & MESSAGES
-- =============================================

-- 1. FIX: internal_chat_messages - Use security definer function for channel membership
CREATE OR REPLACE FUNCTION can_access_internal_channel(_user_id uuid, _channel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM internal_chat_channels c
    JOIN user_roles ur ON ur.user_id = _user_id
    WHERE c.id = _channel_id
    AND c.is_active = true
    AND ur.role = ANY(c.target_roles)
  )
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id
    AND role IN ('super_admin'::app_role, 'master'::app_role)
  )
$$;

DROP POLICY IF EXISTS "Authenticated users can view messages in their channels" ON internal_chat_messages;

CREATE POLICY "Channel role members can view messages"
ON internal_chat_messages
FOR SELECT
USING (
  sender_id = auth.uid()
  OR can_access_internal_channel(auth.uid(), channel_id)
);

-- 2. FIX: dedicated_support_messages - Restrict to assigned support staff
DROP POLICY IF EXISTS "Thread participants view messages" ON dedicated_support_messages;

CREATE POLICY "Thread participants and assigned support view messages"
ON dedicated_support_messages
FOR SELECT
USING (
  sender_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM dedicated_support_threads t
    WHERE t.id = dedicated_support_messages.thread_id
    AND (
      t.prime_user_id = get_prime_user_id(auth.uid())
      OR t.participant_developer_id = get_developer_id(auth.uid())
      OR has_role(auth.uid(), 'super_admin'::app_role)
      OR has_role(auth.uid(), 'master'::app_role)
    )
  )
);

-- 3. FIX: chat_messages - Strengthen thread participant check
DROP POLICY IF EXISTS "users_read_msg" ON chat_messages;

CREATE POLICY "Thread participants read messages"
ON chat_messages
FOR SELECT
USING (
  sender_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM chat_threads
    WHERE chat_threads.thread_id = chat_messages.thread_id
    AND (
      chat_threads.created_by = auth.uid()
      OR has_role(auth.uid(), 'super_admin'::app_role)
      OR has_role(auth.uid(), 'master'::app_role)
    )
  )
);

-- 4. FIX: personal_chat_messages - Add audit logging function
CREATE OR REPLACE FUNCTION log_admin_message_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF has_role(auth.uid(), 'super_admin'::app_role) 
     AND auth.uid() != NEW.sender_id 
     AND auth.uid() != COALESCE(NEW.receiver_id, auth.uid()) THEN
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
      auth.uid(),
      'admin_read_personal_message',
      'personal_chat',
      'super_admin'::app_role,
      jsonb_build_object(
        'message_id', NEW.id,
        'thread_id', NEW.thread_id,
        'access_time', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;