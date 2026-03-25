ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS response_prediction NUMERIC(5,2) NOT NULL DEFAULT 50,
ADD COLUMN IF NOT EXISTS best_call_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_routed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS contact_mask_level TEXT NOT NULL DEFAULT 'standard' CHECK (contact_mask_level IN ('standard', 'strict')),
ADD COLUMN IF NOT EXISTS channel_name TEXT,
ADD COLUMN IF NOT EXISTS external_reference TEXT,
ADD COLUMN IF NOT EXISTS conversion_value NUMERIC(12,2) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.lead_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('call', 'email', 'whatsapp')),
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  message TEXT,
  notes TEXT,
  outcome TEXT,
  next_action_at TIMESTAMPTZ,
  performed_by UUID REFERENCES auth.users(id),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_manager_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_key TEXT NOT NULL UNIQUE DEFAULT 'primary',
  export_locked BOOLEAN NOT NULL DEFAULT true,
  auto_assign_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_routing_enabled BOOLEAN NOT NULL DEFAULT true,
  ai_scoring_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_followup_enabled BOOLEAN NOT NULL DEFAULT true,
  require_ai_approval BOOLEAN NOT NULL DEFAULT true,
  delay_alert_minutes INTEGER NOT NULL DEFAULT 10,
  reminder_window_minutes INTEGER NOT NULL DEFAULT 30,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('followup', 'call_time', 'response_prediction', 'drop_off_alert', 'conversion_probability')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed')),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_user_id UUID REFERENCES auth.users(id),
  actor_role app_role,
  masked_view BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_manager_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_security_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_manage_leads(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('boss_owner', 'super_admin', 'master', 'ceo', 'admin', 'lead_manager', 'demo_manager')
  )
$$;

CREATE OR REPLACE FUNCTION public.can_view_leads(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('boss_owner', 'super_admin', 'master', 'ceo', 'admin', 'lead_manager', 'demo_manager', 'franchise', 'reseller', 'sales', 'marketing_manager', 'client_success')
  )
$$;

DROP POLICY IF EXISTS "Manage lead communications" ON public.lead_communications;
CREATE POLICY "Manage lead communications" ON public.lead_communications
FOR ALL TO authenticated
USING (public.can_view_leads(auth.uid()))
WITH CHECK (public.can_view_leads(auth.uid()));

DROP POLICY IF EXISTS "Manage lead manager settings" ON public.lead_manager_settings;
CREATE POLICY "Manage lead manager settings" ON public.lead_manager_settings
FOR ALL TO authenticated
USING (public.can_manage_leads(auth.uid()))
WITH CHECK (public.can_manage_leads(auth.uid()));

DROP POLICY IF EXISTS "Manage lead AI suggestions" ON public.lead_ai_suggestions;
CREATE POLICY "Manage lead AI suggestions" ON public.lead_ai_suggestions
FOR ALL TO authenticated
USING (public.can_manage_leads(auth.uid()) OR EXISTS (
  SELECT 1 FROM public.leads WHERE leads.id = lead_ai_suggestions.lead_id AND leads.assigned_to = auth.uid()
))
WITH CHECK (public.can_manage_leads(auth.uid()) OR EXISTS (
  SELECT 1 FROM public.leads WHERE leads.id = lead_ai_suggestions.lead_id AND leads.assigned_to = auth.uid()
));

DROP POLICY IF EXISTS "View lead security events" ON public.lead_security_events;
CREATE POLICY "View lead security events" ON public.lead_security_events
FOR SELECT TO authenticated
USING (public.can_manage_leads(auth.uid()));

DROP POLICY IF EXISTS "Insert lead security events" ON public.lead_security_events;
CREATE POLICY "Insert lead security events" ON public.lead_security_events
FOR INSERT TO authenticated
WITH CHECK (public.can_manage_leads(auth.uid()) OR auth.uid() = actor_user_id);

CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON public.leads(deleted_at);
CREATE INDEX IF NOT EXISTS idx_leads_last_routed_at ON public.leads(last_routed_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_communications_lead_id ON public.lead_communications(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_ai_suggestions_lead_id ON public.lead_ai_suggestions(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_security_events_lead_id ON public.lead_security_events(lead_id, created_at DESC);

DROP TRIGGER IF EXISTS update_lead_manager_settings_updated_at ON public.lead_manager_settings;
CREATE TRIGGER update_lead_manager_settings_updated_at
BEFORE UPDATE ON public.lead_manager_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_ai_suggestions_updated_at ON public.lead_ai_suggestions;
CREATE TRIGGER update_lead_ai_suggestions_updated_at
BEFORE UPDATE ON public.lead_ai_suggestions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.lead_manager_settings (workspace_key, export_locked, auto_assign_enabled, auto_routing_enabled, ai_scoring_enabled, auto_followup_enabled, require_ai_approval, delay_alert_minutes, reminder_window_minutes, settings)
VALUES ('primary', true, true, true, true, true, true, 10, 30, '{"anti_loss":true,"instant_hot_call":true,"cold_automation":true}'::jsonb)
ON CONFLICT (workspace_key) DO UPDATE SET
  export_locked = EXCLUDED.export_locked,
  auto_assign_enabled = EXCLUDED.auto_assign_enabled,
  auto_routing_enabled = EXCLUDED.auto_routing_enabled,
  ai_scoring_enabled = EXCLUDED.ai_scoring_enabled,
  auto_followup_enabled = EXCLUDED.auto_followup_enabled,
  require_ai_approval = EXCLUDED.require_ai_approval,
  delay_alert_minutes = EXCLUDED.delay_alert_minutes,
  reminder_window_minutes = EXCLUDED.reminder_window_minutes,
  settings = EXCLUDED.settings,
  updated_at = now();

ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_communications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_ai_suggestions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_security_events;

-- Add missing lead_events table for comprehensive event tracking
CREATE TABLE IF NOT EXISTS public.lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('stage_change', 'assignment', 'communication', 'followup', 'scoring', 'conversion', 'loss', 'alert')),
  event_action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  performed_by UUID REFERENCES auth.users(id),
  performer_role app_role,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add SLA policies table for SLA engine
CREATE TABLE IF NOT EXISTS public.lead_sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  support_tier TEXT NOT NULL CHECK (support_tier IN ('basic', 'vip', 'enterprise')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  response_time_limit INTEGER NOT NULL DEFAULT 480, -- minutes
  resolution_time_limit INTEGER NOT NULL DEFAULT 1440, -- minutes
  escalation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add retry queue for failure handling
CREATE TABLE IF NOT EXISTS public.lead_retry_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  priority INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  next_retry_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Add cron job logs for background processing
CREATE TABLE IF NOT EXISTS public.lead_cron_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  execution_time_ms INTEGER,
  error_message TEXT,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_retry_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_cron_job_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_events
DROP POLICY IF EXISTS "Manage lead events" ON public.lead_events;
CREATE POLICY "Manage lead events" ON public.lead_events
FOR ALL TO authenticated
USING (public.can_view_leads(auth.uid()))
WITH CHECK (public.can_view_leads(auth.uid()));

-- RLS Policies for SLA policies
DROP POLICY IF EXISTS "Manage SLA policies" ON public.lead_sla_policies;
CREATE POLICY "Manage SLA policies" ON public.lead_sla_policies
FOR ALL TO authenticated
USING (public.can_manage_leads(auth.uid()))
WITH CHECK (public.can_manage_leads(auth.uid()));

-- RLS Policies for retry queue
DROP POLICY IF EXISTS "Manage retry queue" ON public.lead_retry_queue;
CREATE POLICY "Manage retry queue" ON public.lead_retry_queue
FOR ALL TO authenticated
USING (public.can_manage_leads(auth.uid()))
WITH CHECK (public.can_manage_leads(auth.uid()));

-- RLS Policies for cron job logs
DROP POLICY IF EXISTS "View cron job logs" ON public.lead_cron_job_logs;
CREATE POLICY "View cron job logs" ON public.lead_cron_job_logs
FOR SELECT TO authenticated
USING (public.can_manage_leads(auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON public.lead_events(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_events_type ON public.lead_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_retry_queue_status ON public.lead_retry_queue(status, priority DESC, next_retry_at ASC);
CREATE INDEX IF NOT EXISTS idx_lead_cron_job_logs_name ON public.lead_cron_job_logs(job_name, executed_at DESC);

-- Insert default SLA policies
INSERT INTO public.lead_sla_policies (support_tier, priority, response_time_limit, resolution_time_limit, escalation_rules)
VALUES 
  ('basic', 'low', 480, 2880, '{"escalate_after": 240, "escalate_to": "L2"}'),
  ('basic', 'medium', 240, 1440, '{"escalate_after": 120, "escalate_to": "L2"}'),
  ('basic', 'high', 120, 720, '{"escalate_after": 60, "escalate_to": "L1"}'),
  ('basic', 'critical', 30, 240, '{"escalate_after": 15, "escalate_to": "Boss"}'),
  ('vip', 'low', 240, 1440, '{"escalate_after": 120, "escalate_to": "L2"}'),
  ('vip', 'medium', 120, 720, '{"escalate_after": 60, "escalate_to": "L1"}'),
  ('vip', 'high', 60, 360, '{"escalate_after": 30, "escalate_to": "L1"}'),
  ('vip', 'critical', 15, 120, '{"escalate_after": 10, "escalate_to": "Boss"}'),
  ('enterprise', 'low', 120, 720, '{"escalate_after": 60, "escalate_to": "L1"}'),
  ('enterprise', 'medium', 60, 360, '{"escalate_after": 30, "escalate_to": "L1"}'),
  ('enterprise', 'high', 30, 180, '{"escalate_after": 15, "escalate_to": "Boss"}'),
  ('enterprise', 'critical', 10, 60, '{"escalate_after": 5, "escalate_to": "Boss"}')
ON CONFLICT DO NOTHING;

-- Add realtime publication for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_retry_queue;