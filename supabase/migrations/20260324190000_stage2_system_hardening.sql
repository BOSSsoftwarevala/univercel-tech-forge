CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  error TEXT NOT NULL,
  error_code TEXT,
  fix_status TEXT NOT NULL DEFAULT 'queued' CHECK (fix_status IN ('queued', 'in_progress', 'fixed', 'failed', 'ignored')),
  severity TEXT NOT NULL DEFAULT 'high' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  request_id TEXT,
  user_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'warning')),
  request_id TEXT,
  user_id UUID,
  duration_ms INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.api_failover_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL,
  function_name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module, function_name, base_url)
);

CREATE INDEX IF NOT EXISTS idx_error_logs_module_created_at ON public.error_logs (module, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_fix_status ON public.error_logs (fix_status, severity);
CREATE INDEX IF NOT EXISTS idx_system_logs_module_created_at ON public.system_logs (module, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_request_id ON public.system_logs (request_id);
CREATE INDEX IF NOT EXISTS idx_api_failover_targets_lookup ON public.api_failover_targets (module, function_name, priority) WHERE is_active = true;

CREATE UNIQUE INDEX IF NOT EXISTS idx_promise_logs_active_unique
  ON public.promise_logs (developer_id, task_id)
  WHERE status::text IN ('assigned', 'promised', 'in_progress', 'pending_approval');

CREATE UNIQUE INDEX IF NOT EXISTS idx_dev_timer_single_active
  ON public.dev_timer (dev_id, task_id)
  WHERE stop_timestamp IS NULL;

CREATE INDEX IF NOT EXISTS idx_promise_logs_deadline_status ON public.promise_logs (deadline, status);
CREATE INDEX IF NOT EXISTS idx_dev_timer_active_lookup ON public.dev_timer (dev_id, task_id, stop_timestamp);

ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_failover_targets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated insert error logs" ON public.error_logs;
CREATE POLICY "Authenticated insert error logs"
ON public.error_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Managers view error logs" ON public.error_logs;
CREATE POLICY "Managers view error logs"
ON public.error_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated insert system logs" ON public.system_logs;
CREATE POLICY "Authenticated insert system logs"
ON public.system_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Managers view system logs" ON public.system_logs;
CREATE POLICY "Managers view system logs"
ON public.system_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage failover targets" ON public.api_failover_targets;
CREATE POLICY "Admins manage failover targets"
ON public.api_failover_targets
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_stage2_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_error_logs_updated_at ON public.error_logs;
CREATE TRIGGER trg_error_logs_updated_at
BEFORE UPDATE ON public.error_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_stage2_timestamp();

CREATE OR REPLACE FUNCTION public.mark_error_log_fixed(
  p_error_log_id UUID,
  p_fix_status TEXT,
  p_resolution JSONB DEFAULT '{}'::jsonb
)
RETURNS public.error_logs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.error_logs;
BEGIN
  UPDATE public.error_logs
  SET
    fix_status = p_fix_status,
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('resolution', p_resolution, 'resolved_at', now())
  WHERE id = p_error_log_id
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.error_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_logs;

ALTER TABLE public.error_logs REPLICA IDENTITY FULL;
ALTER TABLE public.system_logs REPLICA IDENTITY FULL;