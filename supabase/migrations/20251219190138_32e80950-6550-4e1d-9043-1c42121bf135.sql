-- Personal Chat System with Admin Approval

-- Chat threads table
CREATE TABLE public.personal_chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one UUID NOT NULL,
  participant_two UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Personal messages table with approval workflow
CREATE TABLE public.personal_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.personal_chat_threads(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'image', 'file')),
  content TEXT,
  voice_url TEXT,
  voice_duration INTEGER, -- in seconds
  file_url TEXT,
  file_name TEXT,
  
  -- Approval workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Metadata
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Message approval queue for super admin
CREATE TABLE public.message_approval_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.personal_chat_messages(id) ON DELETE CASCADE NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_admin UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.personal_chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_approval_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for threads
CREATE POLICY "Users can view their own threads"
ON public.personal_chat_threads FOR SELECT
USING (auth.uid() = participant_one OR auth.uid() = participant_two);

CREATE POLICY "Super admin can view all threads"
ON public.personal_chat_threads FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

CREATE POLICY "Users can create threads"
ON public.personal_chat_threads FOR INSERT
WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

-- RLS Policies for messages
CREATE POLICY "Users can view approved messages in their threads"
ON public.personal_chat_messages FOR SELECT
USING (
  (auth.uid() = sender_id OR auth.uid() = receiver_id) 
  AND (status = 'approved' OR sender_id = auth.uid())
);

CREATE POLICY "Super admin can view all messages"
ON public.personal_chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

CREATE POLICY "Users can send messages"
ON public.personal_chat_messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Super admin can update messages"
ON public.personal_chat_messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- RLS Policies for approval queue
CREATE POLICY "Super admin can manage approval queue"
ON public.message_approval_queue FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- Trigger to add messages to approval queue
CREATE OR REPLACE FUNCTION add_to_approval_queue()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.message_approval_queue (message_id, priority)
  VALUES (NEW.id, 'normal');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_created
AFTER INSERT ON public.personal_chat_messages
FOR EACH ROW
EXECUTE FUNCTION add_to_approval_queue();

-- Function to update thread timestamp
CREATE OR REPLACE FUNCTION update_thread_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.personal_chat_threads
  SET last_message_at = now(), updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_sent
AFTER INSERT ON public.personal_chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_thread_timestamp();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.personal_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_approval_queue;