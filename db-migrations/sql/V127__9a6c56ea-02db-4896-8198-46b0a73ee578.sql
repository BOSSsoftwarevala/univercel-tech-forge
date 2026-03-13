-- Core Enterprise Platform Database Structure - Complete

-- Button Registry Table
CREATE TABLE public.button_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  button_id TEXT UNIQUE NOT NULL,
  module_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  api_endpoint TEXT,
  db_table TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Action Logs Table
CREATE TABLE public.action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  button_id TEXT,
  module_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_result TEXT NOT NULL,
  response_time_ms INTEGER,
  error_message TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Observation Logs Table
CREATE TABLE public.ai_observation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_type TEXT NOT NULL,
  module_name TEXT NOT NULL,
  action_id UUID,
  user_id UUID REFERENCES auth.users(id),
  observation_data JSONB,
  confidence_score DECIMAL(3,2),
  action_taken TEXT,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.button_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_observation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Read button registry" ON public.button_registry FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert action logs" ON public.action_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Read own action logs" ON public.action_logs FOR SELECT TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Read ai observations" ON public.ai_observation_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Insert ai observations" ON public.ai_observation_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes
CREATE INDEX idx_action_logs_user ON public.action_logs(user_id);
CREATE INDEX idx_action_logs_time ON public.action_logs(created_at DESC);
CREATE INDEX idx_action_logs_mod ON public.action_logs(module_name);
CREATE INDEX idx_button_registry_mod ON public.button_registry(module_name);