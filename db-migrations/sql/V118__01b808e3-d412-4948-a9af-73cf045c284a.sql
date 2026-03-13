-- Boss Panel Database Tables (Append-Only)

-- Boss accounts table
CREATE TABLE IF NOT EXISTS public.boss_accounts (
  boss_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Boss sessions table
CREATE TABLE IF NOT EXISTS public.boss_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boss_id UUID REFERENCES public.boss_accounts(boss_id),
  ip_address TEXT,
  device_fingerprint TEXT,
  login_time TIMESTAMPTZ DEFAULT now(),
  logout_time TIMESTAMPTZ
);

-- System activity log (append-only)
CREATE TABLE IF NOT EXISTS public.system_activity_log (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_role TEXT NOT NULL,
  actor_id UUID,
  action_type TEXT NOT NULL,
  target TEXT,
  target_id UUID,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT now(),
  hash_signature TEXT
);

-- Approval actions table
CREATE TABLE IF NOT EXISTS public.approval_actions (
  approval_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boss_id UUID REFERENCES public.boss_accounts(boss_id),
  request_type TEXT NOT NULL,
  request_ref_id UUID,
  decision TEXT CHECK (decision IN ('approved', 'rejected', 'pending')),
  reason TEXT,
  decided_at TIMESTAMPTZ DEFAULT now()
);

-- System modules table
CREATE TABLE IF NOT EXISTS public.system_modules (
  module_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'maintenance', 'locked')),
  is_critical BOOLEAN DEFAULT false,
  locked_by UUID,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Emergency events table
CREATE TABLE IF NOT EXISTS public.emergency_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  boss_id UUID REFERENCES public.boss_accounts(boss_id),
  action TEXT NOT NULL CHECK (action IN ('lockdown', 'unlock', 'suspend_all', 'restore')),
  reason TEXT NOT NULL,
  affected_modules TEXT[],
  timestamp TIMESTAMPTZ DEFAULT now()
);

-- Security alerts table
CREATE TABLE IF NOT EXISTS public.security_alerts (
  alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_user_id UUID,
  affected_role TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID
);

-- Compliance status table
CREATE TABLE IF NOT EXISTS public.compliance_status (
  record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region TEXT NOT NULL,
  country TEXT,
  compliance_score INTEGER DEFAULT 100 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  last_checked TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  issues JSONB DEFAULT '[]'
);

-- Enable RLS on all tables
ALTER TABLE public.boss_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for boss_accounts (boss can read their own)
CREATE POLICY "Boss can view own account" ON public.boss_accounts
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for boss_sessions
CREATE POLICY "Boss can view own sessions" ON public.boss_sessions
  FOR SELECT USING (boss_id IN (SELECT boss_id FROM public.boss_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Boss can insert sessions" ON public.boss_sessions
  FOR INSERT WITH CHECK (boss_id IN (SELECT boss_id FROM public.boss_accounts WHERE user_id = auth.uid()));

-- RLS Policies for system_activity_log (read-only for boss)
CREATE POLICY "Boss can view all activity logs" ON public.system_activity_log
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

CREATE POLICY "System can insert activity logs" ON public.system_activity_log
  FOR INSERT WITH CHECK (true);

-- RLS Policies for approval_actions
CREATE POLICY "Boss can view approvals" ON public.approval_actions
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Boss can insert approvals" ON public.approval_actions
  FOR INSERT WITH CHECK (boss_id IN (SELECT boss_id FROM public.boss_accounts WHERE user_id = auth.uid()));

-- RLS Policies for system_modules
CREATE POLICY "Boss can view modules" ON public.system_modules
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Boss can update module status" ON public.system_modules
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

-- RLS Policies for emergency_events
CREATE POLICY "Boss can view emergency events" ON public.emergency_events
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Boss can create emergency events" ON public.emergency_events
  FOR INSERT WITH CHECK (boss_id IN (SELECT boss_id FROM public.boss_accounts WHERE user_id = auth.uid()));

-- RLS Policies for security_alerts
CREATE POLICY "Boss can view security alerts" ON public.security_alerts
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

CREATE POLICY "Boss can update security alerts" ON public.security_alerts
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

-- RLS Policies for compliance_status
CREATE POLICY "Boss can view compliance status" ON public.compliance_status
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid()));

-- Enable realtime for activity log
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.security_alerts;