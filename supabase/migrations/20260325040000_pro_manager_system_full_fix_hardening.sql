-- Pro Manager System Full Fix + Hardening Migration
-- REAL DATA • ZERO FAILURE • SLA ENFORCED

-- Add missing SLA table
CREATE TABLE IF NOT EXISTS public.pro_sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  support_tier TEXT NOT NULL CHECK (support_tier IN ('premium', 'priority', 'vip', 'enterprise')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  response_time_limit INTEGER NOT NULL, -- minutes
  resolution_time_limit INTEGER NOT NULL, -- hours
  escalation_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_escalation_minutes INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(support_tier, priority)
);

-- Add usage limits table
CREATE TABLE IF NOT EXISTS public.pro_usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  limit_type TEXT NOT NULL CHECK (limit_type IN ('api_calls', 'storage_gb', 'bandwidth_gb', 'concurrent_users')),
  monthly_limit NUMERIC(14,2) NOT NULL,
  current_usage NUMERIC(14,2) NOT NULL DEFAULT 0,
  warning_threshold NUMERIC(5,2) NOT NULL DEFAULT 80, -- percentage
  block_threshold NUMERIC(5,2) NOT NULL DEFAULT 100, -- percentage
  reset_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warning', 'blocked', 'paused')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pro_user_id, limit_type)
);

-- Add AI helpdesk logs
CREATE TABLE IF NOT EXISTS public.pro_ai_helpdesk_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.pro_support_tickets(id) ON DELETE SET NULL,
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  confidence_score NUMERIC(5,2),
  suggested_action TEXT,
  human_override BOOLEAN NOT NULL DEFAULT false,
  human_response TEXT,
  resolution_status TEXT NOT NULL DEFAULT 'ai_handled' CHECK (resolution_status IN ('ai_handled', 'human_escalated', 'resolved', 'unresolved')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add renewal tracking
CREATE TABLE IF NOT EXISTS public.pro_renewal_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  renewal_type TEXT NOT NULL CHECK (renewal_type IN ('monthly', 'yearly', 'lifetime')),
  current_expiry TIMESTAMPTZ NOT NULL,
  next_renewal_date TIMESTAMPTZ,
  renewal_amount NUMERIC(14,2) NOT NULL,
  notification_sent BOOLEAN NOT NULL DEFAULT false,
  notification_date TIMESTAMPTZ,
  grace_period_days INTEGER NOT NULL DEFAULT 7,
  auto_renewal_enabled BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'notified', 'grace_period', 'expired', 'cancelled')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add device fingerprinting
CREATE TABLE IF NOT EXISTS public.pro_device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  license_id UUID REFERENCES public.pro_licenses(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  fingerprint_hash TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  location_data JSONB,
  trust_score NUMERIC(5,2) NOT NULL DEFAULT 50,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  block_reason TEXT,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(pro_user_id, device_id)
);

-- Add encrypted communication logs (separate from existing)
CREATE TABLE IF NOT EXISTS public.pro_secure_communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID NOT NULL REFERENCES public.pro_users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('chat', 'call', 'email', 'ai', 'assist')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound', 'internal')),
  encrypted_content TEXT NOT NULL, -- encrypted
  encryption_key_id TEXT NOT NULL,
  subject_hash TEXT, -- hashed for search
  actor_user_id UUID,
  admin_only BOOLEAN NOT NULL DEFAULT true,
  retention_days INTEGER NOT NULL DEFAULT 2555, -- 7 years
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add billing webhook logs
CREATE TABLE IF NOT EXISTS public.pro_billing_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pro_user_id UUID REFERENCES public.pro_users(id) ON DELETE SET NULL,
  webhook_source TEXT NOT NULL CHECK (webhook_source IN ('stripe', 'paypal', 'razorpay', 'manual')),
  webhook_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payment_amount NUMERIC(14,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  license_activated BOOLEAN NOT NULL DEFAULT false,
  expiry_extended TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  raw_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add cron job tracking
CREATE TABLE IF NOT EXISTS public.pro_cron_job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('expiry_check', 'sla_monitor', 'usage_reset', 'renewal_notify', 'compliance_check')),
  status TEXT NOT NULL CHECK (status IN ('started', 'running', 'completed', 'failed')),
  records_processed INTEGER NOT NULL DEFAULT 0,
  errors_count INTEGER NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  error_details TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add failure retry system
CREATE TABLE IF NOT EXISTS public.pro_retry_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  payload JSONB NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  next_retry_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_error TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fix existing tables with missing constraints
ALTER TABLE public.pro_licenses ADD CONSTRAINT unique_active_domain_per_user
EXCLUDE (domain WITH =) WHERE (domain IS NOT NULL AND status IN ('active', 'bound'));

ALTER TABLE public.pro_licenses ADD CONSTRAINT unique_device_per_user
EXCLUDE (device_id WITH =) WHERE (device_id IS NOT NULL AND status IN ('active', 'bound'));

-- Add hash function for license keys
CREATE OR REPLACE FUNCTION public.hash_license_key(license_key TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT encode(digest(license_key, 'sha256'), 'hex');
$$;

-- Add license key hashing
ALTER TABLE public.pro_licenses ADD COLUMN IF NOT EXISTS license_key_hash TEXT;
UPDATE public.pro_licenses SET license_key_hash = public.hash_license_key(license_key) WHERE license_key_hash IS NULL;
ALTER TABLE public.pro_licenses ALTER COLUMN license_key_hash SET NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pro_licenses_domain_status ON public.pro_licenses(domain, status) WHERE domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pro_licenses_device_status ON public.pro_licenses(device_id, status) WHERE device_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pro_licenses_key_hash ON public.pro_licenses(license_key_hash);
CREATE INDEX IF NOT EXISTS idx_pro_usage_limits_user_status ON public.pro_usage_limits(pro_user_id, status);
CREATE INDEX IF NOT EXISTS idx_pro_renewal_tracking_status_date ON public.pro_renewal_tracking(status, next_renewal_date);
CREATE INDEX IF NOT EXISTS idx_pro_device_fingerprints_user_blocked ON public.pro_device_fingerprints(pro_user_id, is_blocked);
CREATE INDEX IF NOT EXISTS idx_pro_alerts_type_status ON public.pro_alerts(alert_type, status);
CREATE INDEX IF NOT EXISTS idx_pro_retry_queue_status_next ON public.pro_retry_queue(status, next_retry_at);

-- Add RLS policies for new tables
ALTER TABLE public.pro_sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_ai_helpdesk_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_renewal_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_secure_communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_billing_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_cron_job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pro_retry_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "pro_sla_policies_manage" ON public.pro_sla_policies
FOR ALL USING (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_usage_limits_manage" ON public.pro_usage_limits
FOR ALL USING (
  public.can_manage_pro_manager(auth.uid())
  OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid())
);

CREATE POLICY "pro_ai_helpdesk_logs_manage" ON public.pro_ai_helpdesk_logs
FOR ALL USING (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_renewal_tracking_manage" ON public.pro_renewal_tracking
FOR ALL USING (
  public.can_manage_pro_manager(auth.uid())
  OR EXISTS (SELECT 1 FROM public.pro_users pu WHERE pu.id = pro_user_id AND pu.user_id = auth.uid())
);

CREATE POLICY "pro_device_fingerprints_manage" ON public.pro_device_fingerprints
FOR ALL USING (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_secure_communication_logs_manage" ON public.pro_secure_communication_logs
FOR ALL USING (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_billing_webhooks_manage" ON public.pro_billing_webhooks
FOR ALL USING (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_cron_job_logs_manage" ON public.pro_cron_job_logs
FOR ALL USING (public.can_manage_pro_manager(auth.uid()));

CREATE POLICY "pro_retry_queue_manage" ON public.pro_retry_queue
FOR ALL USING (public.can_manage_pro_manager(auth.uid()));

-- Insert default SLA policies
INSERT INTO public.pro_sla_policies (support_tier, priority, response_time_limit, resolution_time_limit, escalation_enabled, auto_escalation_minutes)
VALUES
  ('premium', 'low', 480, 72, true, 240), -- 8 hours response, 3 days resolution
  ('premium', 'medium', 240, 48, true, 120), -- 4 hours response, 2 days resolution
  ('premium', 'high', 60, 24, true, 30), -- 1 hour response, 1 day resolution
  ('premium', 'critical', 15, 4, true, 10), -- 15 min response, 4 hours resolution
  ('priority', 'low', 240, 48, true, 120),
  ('priority', 'medium', 120, 24, true, 60),
  ('priority', 'high', 30, 12, true, 15),
  ('priority', 'critical', 10, 2, true, 5),
  ('vip', 'low', 120, 24, true, 60),
  ('vip', 'medium', 60, 12, true, 30),
  ('vip', 'high', 15, 6, true, 10),
  ('vip', 'critical', 5, 1, true, 3),
  ('enterprise', 'low', 60, 12, true, 30),
  ('enterprise', 'medium', 30, 6, true, 15),
  ('enterprise', 'high', 10, 3, true, 5),
  ('enterprise', 'critical', 2, 1, true, 1)
ON CONFLICT (support_tier, priority) DO NOTHING;

-- Add triggers for updated_at
CREATE TRIGGER pro_sla_policies_updated_at
  BEFORE UPDATE ON public.pro_sla_policies
  FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

CREATE TRIGGER pro_usage_limits_updated_at
  BEFORE UPDATE ON public.pro_usage_limits
  FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

CREATE TRIGGER pro_renewal_tracking_updated_at
  BEFORE UPDATE ON public.pro_renewal_tracking
  FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

CREATE TRIGGER pro_device_fingerprints_updated_at
  BEFORE UPDATE ON public.pro_device_fingerprints
  FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

CREATE TRIGGER pro_retry_queue_updated_at
  BEFORE UPDATE ON public.pro_retry_queue
  FOR EACH ROW EXECUTE FUNCTION public.pro_touch_updated_at();

-- Add immutable trigger to audit logs
CREATE TRIGGER pro_audit_logs_immutable
  BEFORE UPDATE OR DELETE ON public.pro_audit_logs
  FOR EACH ROW EXECUTE FUNCTION public.pro_block_mutation();</content>
<parameter name="filePath">c:\Users\dell\softwarewalanet\database\migrations\V148__pro_manager_system_full_fix_hardening.sql