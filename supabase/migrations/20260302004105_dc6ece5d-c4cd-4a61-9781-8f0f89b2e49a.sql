
-- Create immutable activity_log table
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type VARCHAR(100) NOT NULL,
  user_id UUID,
  role VARCHAR(50),
  entity_type VARCHAR(100),
  entity_id UUID,
  tenant_id UUID,
  severity_level VARCHAR(20) DEFAULT 'info',
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_log_action_ts ON public.activity_log(action_type, created_at DESC);
CREATE INDEX idx_activity_log_tenant ON public.activity_log(tenant_id);
CREATE INDEX idx_activity_log_severity ON public.activity_log(severity_level, created_at DESC);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id, created_at DESC);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert activity logs"
  ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Boss and admins can read activity logs"
  ON public.activity_log FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'boss_owner') OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'master')
  );

ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;

COMMENT ON TABLE public.activity_log IS 'Immutable real-time activity log for Boss Panel monitoring';
