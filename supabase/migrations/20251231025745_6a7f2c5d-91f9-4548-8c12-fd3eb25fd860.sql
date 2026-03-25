-- ================================================
-- READ-ONLY PROMISE TRACKER SYSTEM (FIXED)
-- Observer role with ZERO control power
-- ================================================

-- Table: Promise View Logs (Audit trail for views)
CREATE TABLE IF NOT EXISTS public.promise_view_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id UUID NOT NULL,
  viewer_role TEXT NOT NULL,
  promise_id UUID REFERENCES public.promise_logs(id),
  view_type TEXT NOT NULL DEFAULT 'detail',
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  server_timestamp TIMESTAMPTZ DEFAULT now()
);

-- Table: Promise Export Logs (Audit trail for exports)
CREATE TABLE IF NOT EXISTS public.promise_export_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exporter_id UUID NOT NULL,
  exporter_role TEXT NOT NULL,
  export_format TEXT NOT NULL,
  filter_criteria JSONB,
  records_exported INTEGER DEFAULT 0,
  data_masked BOOLEAN DEFAULT true,
  exported_at TIMESTAMPTZ DEFAULT now(),
  server_timestamp TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promise_view_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promise_export_logs ENABLE ROW LEVEL SECURITY;

-- RLS: View logs are append-only
CREATE POLICY "Promise view logs are append only"
  ON public.promise_view_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Promise view logs readable by authorized roles"
  ON public.promise_view_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'master', 'promise_management', 'promise_tracker')
    )
  );

-- RLS: Export logs are append-only
CREATE POLICY "Promise export logs are append only"
  ON public.promise_export_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Promise export logs readable by authorized roles"
  ON public.promise_export_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'master', 'promise_management')
    )
  );

-- Prevent any updates or deletes on view logs
CREATE OR REPLACE FUNCTION public.prevent_view_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Promise view/export logs are immutable - no updates or deletes allowed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER prevent_view_log_update
  BEFORE UPDATE ON public.promise_view_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_view_log_modification();

CREATE TRIGGER prevent_view_log_delete
  BEFORE DELETE ON public.promise_view_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_view_log_modification();

CREATE TRIGGER prevent_export_log_update
  BEFORE UPDATE ON public.promise_export_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_view_log_modification();

CREATE TRIGGER prevent_export_log_delete
  BEFORE DELETE ON public.promise_export_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_view_log_modification();

-- View: Promise Tracker Read-Only View with masked data
CREATE OR REPLACE VIEW public.promise_tracker_view AS
SELECT 
  pl.id AS promise_id,
  pl.promise_type,
  COALESCE(pl.assigned_role, 'developer') AS linked_module,
  COALESCE(pl.assigned_role, 'developer') AS assigned_role,
  CASE 
    WHEN pl.developer_id IS NOT NULL 
    THEN SUBSTRING(pl.developer_id::text, 1, 8) || '***'
    ELSE 'Unknown'
  END AS assigned_user_masked,
  pl.created_at AS start_date,
  pl.deadline AS due_date,
  CASE 
    WHEN pl.status IN ('completed', 'breached') THEN 0
    ELSE GREATEST(0, EXTRACT(EPOCH FROM (pl.deadline - now())) / 60)
  END AS remaining_minutes,
  pl.status,
  pl.priority,
  pl.escalation_level,
  pl.escalated_at,
  pl.is_locked,
  pl.breach_reason,
  pl.extended_count,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'master', 'promise_management')
    ) THEN pl.approved_by
    ELSE NULL
  END AS approved_by,
  pl.approved_at,
  pl.finished_time,
  pl.task_id,
  pl.created_at,
  pl.updated_at
FROM public.promise_logs pl
ORDER BY 
  CASE WHEN pl.status IN ('assigned', 'promised', 'in_progress') THEN 0 ELSE 1 END,
  pl.deadline ASC;

-- View: Promise Tracker Metrics (Read-Only)
CREATE OR REPLACE VIEW public.promise_tracker_metrics AS
SELECT
  (SELECT COUNT(*) FROM public.promise_logs) AS total_promises,
  (SELECT COUNT(*) FROM public.promise_logs WHERE status IN ('assigned', 'promised', 'in_progress')) AS active_promises,
  (SELECT COUNT(*) FROM public.promise_logs WHERE status = 'pending_approval') AS pending_approval,
  (SELECT COUNT(*) FROM public.promise_logs 
   WHERE status IN ('assigned', 'promised', 'in_progress') 
   AND deadline < now()) AS overdue_promises,
  (SELECT COUNT(*) FROM public.promise_logs WHERE status = 'completed') AS fulfilled_promises,
  (SELECT COUNT(*) FROM public.promise_logs WHERE escalation_level > 0 AND status NOT IN ('completed', 'breached')) AS escalated_promises,
  now() AS last_updated;

-- Function: Log promise view (for audit)
CREATE OR REPLACE FUNCTION public.log_promise_view(
  p_promise_id UUID DEFAULT NULL,
  p_view_type TEXT DEFAULT 'list',
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_viewer_id UUID;
  v_viewer_role TEXT;
  v_log_id UUID;
BEGIN
  v_viewer_id := auth.uid();
  IF v_viewer_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT role::text INTO v_viewer_role
  FROM public.user_roles
  WHERE user_id = v_viewer_id
  LIMIT 1;

  INSERT INTO public.promise_view_logs (
    viewer_id, viewer_role, promise_id, view_type, ip_address, user_agent, session_id
  ) VALUES (
    v_viewer_id, COALESCE(v_viewer_role, 'unknown'), p_promise_id, p_view_type, p_ip_address, p_user_agent, p_session_id
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- Function: Log promise export (for audit)
CREATE OR REPLACE FUNCTION public.log_promise_export(
  p_export_format TEXT,
  p_filter_criteria JSONB DEFAULT NULL,
  p_records_exported INTEGER DEFAULT 0
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exporter_id UUID;
  v_exporter_role TEXT;
  v_log_id UUID;
BEGIN
  v_exporter_id := auth.uid();
  IF v_exporter_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT role::text INTO v_exporter_role
  FROM public.user_roles
  WHERE user_id = v_exporter_id
  LIMIT 1;

  INSERT INTO public.promise_export_logs (
    exporter_id, exporter_role, export_format, filter_criteria, records_exported, data_masked
  ) VALUES (
    v_exporter_id, COALESCE(v_exporter_role, 'unknown'), p_export_format, p_filter_criteria, p_records_exported, true
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

-- RLS: Promise Tracker role can only READ promises
CREATE POLICY "Promise tracker role read only access"
  ON public.promise_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'promise_tracker'
    )
  );

-- Grant SELECT on views
GRANT SELECT ON public.promise_tracker_view TO authenticated;
GRANT SELECT ON public.promise_tracker_metrics TO authenticated;