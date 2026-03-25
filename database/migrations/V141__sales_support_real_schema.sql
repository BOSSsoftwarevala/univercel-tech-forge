-- Sales & Support Real System - Database Schema
-- Date: 2026-03-25
-- Implements: support tickets, live chat, leads, auto-assignment, action logging

-- ========================================================================
-- 1. Support Agents / Team Members
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.support_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id varchar(50) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  status varchar(50) DEFAULT 'available', -- available, busy, away, offline
  active_tickets_count int DEFAULT 0,
  average_resolution_time int, -- in minutes
  customer_satisfaction_score numeric(3,2), -- 0-5.0
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_support_agents_user_id ON public.support_agents (user_id);
CREATE INDEX idx_support_agents_status ON public.support_agents (status);

-- ========================================================================
-- 2. Support Tickets
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id varchar(50) NOT NULL UNIQUE, -- TKT-001 format
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  description text NOT NULL,
  category varchar(100) NOT NULL, -- technical, billing, feature, demo, account, fraud_dispute
  priority varchar(20) NOT NULL DEFAULT 'medium', -- low, medium, high, critical, urgent
  status varchar(50) NOT NULL DEFAULT 'new', -- new, assigned, in_progress, waiting, resolved, closed, escalated
  assigned_to uuid REFERENCES public.support_agents(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  closed_at timestamptz,
  sla_deadline timestamptz,
  escalation_level int DEFAULT 0, -- 0 = no escalation, 1+ = escalated
  tags varchar(100)[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets (user_id);
CREATE INDEX idx_support_tickets_assigned_to ON public.support_tickets (assigned_to);
CREATE INDEX idx_support_tickets_status ON public.support_tickets (status);
CREATE INDEX idx_support_tickets_priority ON public.support_tickets (priority);
CREATE INDEX idx_support_tickets_category ON public.support_tickets (category);
CREATE INDEX idx_support_tickets_created_at ON public.support_tickets (created_at DESC);
CREATE INDEX idx_support_tickets_sla_deadline ON public.support_tickets (sla_deadline);

-- ========================================================================
-- 3. Support Messages / Chat Messages
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type varchar(50) NOT NULL, -- customer, agent, system
  message_text text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb, -- array of {url, type, name, size}
  is_internal boolean DEFAULT false, -- internal notes only for agents
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_support_messages_ticket_id ON public.support_messages (ticket_id);
CREATE INDEX idx_support_messages_sender_id ON public.support_messages (sender_id);
CREATE INDEX idx_support_messages_created_at ON public.support_messages (created_at DESC);

-- ========================================================================
-- 4. Live Chat Sessions
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id varchar(50) NOT NULL UNIQUE, -- CHAT-001 format
  visitor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_email varchar(255),
  visitor_name varchar(255),
  assigned_to uuid REFERENCES public.support_agents(id) ON DELETE SET NULL,
  status varchar(50) NOT NULL DEFAULT 'waiting', -- waiting, active, resolved, transferred
  sentiment varchar(50) DEFAULT 'neutral', -- positive, neutral, negative
  wait_time_seconds int DEFAULT 0,
  resolution_time_seconds int,
  message_count int DEFAULT 0,
  transferred_from uuid REFERENCES public.support_agents(id),
  started_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  resolved_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_chat_sessions_visitor_id ON public.chat_sessions (visitor_id);
CREATE INDEX idx_chat_sessions_assigned_to ON public.chat_sessions (assigned_to);
CREATE INDEX idx_chat_sessions_status ON public.chat_sessions (status);
CREATE INDEX idx_chat_sessions_started_at ON public.chat_sessions (started_at DESC);

-- ========================================================================
-- 5. Chat Messages (Real-time)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id uuid NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type varchar(50) NOT NULL, -- visitor, agent, system
  message_text text NOT NULL,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_chat_session_id ON public.chat_messages (chat_session_id);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages (sender_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages (created_at DESC);

-- ========================================================================
-- 6. Leads Management
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id varchar(50) NOT NULL UNIQUE, -- LEAD-001 format
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(20),
  company varchar(255),
  product_interest varchar(100), -- product name/type they're interested in
  country varchar(100),
  budget_range varchar(50), -- low, medium, high, enterprise
  status varchar(50) NOT NULL DEFAULT 'new', -- new, contacted, demo_scheduled, qualified, converted, lost
  lead_score int DEFAULT 50, -- 0-100
  conversion_probability numeric(3,2) DEFAULT 0.50, -- 0-1.0
  assigned_to uuid REFERENCES public.support_agents(id) ON DELETE SET NULL,
  source varchar(100), -- organic, referral, campaign, marketplace
  last_contacted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  risk_factors varchar(255)[],
  signals varchar(255)[],
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX idx_leads_email ON public.leads (email);
CREATE INDEX idx_leads_phone ON public.leads (phone);
CREATE INDEX idx_leads_status ON public.leads (status);
CREATE INDEX idx_leads_assigned_to ON public.leads (assigned_to);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_lead_score ON public.leads (lead_score DESC);

-- ========================================================================
-- 7. Lead Assignments History
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.lead_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to uuid NOT NULL REFERENCES public.support_agents(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id),
  auto_assigned boolean DEFAULT false,
  reason varchar(255), -- auto-assign reason / algorithm matched
  created_at timestamptz NOT NULL DEFAULT now(),
  unassigned_at timestamptz,
  outcome varchar(50) -- converted, lost, dropped, reassigned
);

CREATE INDEX idx_lead_assignments_lead_id ON public.lead_assignments (lead_id);
CREATE INDEX idx_lead_assignments_assigned_to ON public.lead_assignments (assigned_to);

-- ========================================================================
-- 8. Action Logs (Audit Trail)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type varchar(100) NOT NULL, -- create_ticket, assign_ticket, resolve_ticket, send_message, etc.
  resource_type varchar(100), -- ticket, chat, lead, agent
  resource_id uuid,
  resource_name varchar(255),
  old_value jsonb,
  new_value jsonb,
  ip_address varchar(45),
  user_agent text,
  status varchar(50) DEFAULT 'success', -- success, failed, pending
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_action_logs_user_id ON public.action_logs (user_id);
CREATE INDEX idx_action_logs_action_type ON public.action_logs (action_type);
CREATE INDEX idx_action_logs_resource_type ON public.action_logs (resource_type);
CREATE INDEX idx_action_logs_created_at ON public.action_logs (created_at DESC);

-- ========================================================================
-- 9. Lead Scoring Predictions (AI-generated)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.lead_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  score int,
  conversion_probability numeric(3,2),
  recommended_handler uuid REFERENCES public.support_agents(id),
  handler_reason text,
  risk_factors varchar(255)[],
  signals varchar(255)[],
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX idx_lead_predictions_lead_id ON public.lead_predictions (lead_id);
CREATE INDEX idx_lead_predictions_created_at ON public.lead_predictions (created_at DESC);

-- ========================================================================
-- 10. RLS Policies
-- ========================================================================

-- Support Tickets RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.support_agents WHERE id = assigned_to
  ) OR auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Users can create own tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Agents can update assigned tickets" ON public.support_tickets
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.support_agents WHERE id = assigned_to) OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Support Messages RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages on own tickets" ON public.support_messages
  FOR SELECT USING (
    ticket_id IN (SELECT id FROM public.support_tickets WHERE user_id = auth.uid()) OR
    auth.uid() IN (SELECT user_id FROM public.support_agents) OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Chat Sessions RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chats" ON public.chat_sessions
  FOR SELECT USING (
    auth.uid() = visitor_id OR
    auth.uid() IN (SELECT user_id FROM public.support_agents WHERE id = assigned_to) OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Leads RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents and admins can view leads" ON public.leads
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.support_agents) OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "Assigned agents can update leads" ON public.leads
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM public.support_agents WHERE id = assigned_to) OR
    auth.jwt() ->> 'role' = 'super_admin'
  );

-- Action Logs RLS
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs and admins can view all" ON public.action_logs
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'super_admin');
