-- Support Chatbot ERD

-- Chatbots table
CREATE TABLE public.support_chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'web' CHECK (channel IN ('web', 'android', 'whatsapp', 'ios')),
  ai_model TEXT NOT NULL DEFAULT 'gpt-4',
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'training', 'paused')),
  language_count INTEGER DEFAULT 1,
  welcome_message TEXT,
  fallback_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Conversations table
CREATE TABLE public.chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES public.support_chatbots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  guest_id TEXT,
  language TEXT DEFAULT 'en',
  country TEXT,
  device_type TEXT,
  app_version TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved_bot', 'resolved_agent', 'escalated', 'closed')),
  assigned_agent_id UUID,
  csat_score INTEGER CHECK (csat_score >= 1 AND csat_score <= 5),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'bot', 'agent')),
  sender_id UUID,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'quick_reply', 'card')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Knowledge Base table
CREATE TABLE public.chatbot_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES public.support_chatbots(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('pdf', 'doc', 'url', 'text', 'faq')),
  source_url TEXT,
  content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'trained', 'failed')),
  last_trained_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automation Rules table
CREATE TABLE public.chatbot_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES public.support_chatbots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('keyword', 'intent', 'time', 'sentiment', 'no_response')),
  trigger_value TEXT,
  condition_type TEXT CHECK (condition_type IN ('equals', 'contains', 'greater_than', 'less_than')),
  condition_value TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('send_message', 'handover', 'escalate', 'tag', 'close')),
  action_value TEXT,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agents table
CREATE TABLE public.chatbot_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'supervisor', 'admin')),
  availability TEXT DEFAULT 'offline' CHECK (availability IN ('online', 'busy', 'away', 'offline')),
  max_concurrent_chats INTEGER DEFAULT 5,
  languages TEXT[] DEFAULT ARRAY['en'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Working Hours table
CREATE TABLE public.chatbot_working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES public.support_chatbots(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT true,
  UNIQUE(chatbot_id, day_of_week)
);

-- Enable RLS
ALTER TABLE public.support_chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_working_hours ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view chatbots" ON public.support_chatbots
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage own chatbots" ON public.support_chatbots
  FOR ALL TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Authenticated can view conversations" ON public.chatbot_conversations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can manage conversations" ON public.chatbot_conversations
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can view messages" ON public.chatbot_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can create messages" ON public.chatbot_messages
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can view knowledge base" ON public.chatbot_knowledge_base
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can manage knowledge base" ON public.chatbot_knowledge_base
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can view automation rules" ON public.chatbot_automation_rules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can manage automation rules" ON public.chatbot_automation_rules
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can view agents" ON public.chatbot_agents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can manage agents" ON public.chatbot_agents
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated can view working hours" ON public.chatbot_working_hours
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can manage working hours" ON public.chatbot_working_hours
  FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_chatbot_conversations_chatbot ON public.chatbot_conversations(chatbot_id);
CREATE INDEX idx_chatbot_conversations_status ON public.chatbot_conversations(status);
CREATE INDEX idx_chatbot_messages_conversation ON public.chatbot_messages(conversation_id);
CREATE INDEX idx_chatbot_knowledge_base_chatbot ON public.chatbot_knowledge_base(chatbot_id);
CREATE INDEX idx_chatbot_automation_rules_chatbot ON public.chatbot_automation_rules(chatbot_id);

-- Updated_at trigger
CREATE TRIGGER update_support_chatbots_updated_at
  BEFORE UPDATE ON public.support_chatbots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();