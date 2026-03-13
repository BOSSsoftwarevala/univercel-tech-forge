-- Fix security warnings: Add SECURITY INVOKER to views and search_path to functions

-- Drop and recreate views with SECURITY INVOKER
DROP VIEW IF EXISTS public.promise_tracker_view;
DROP VIEW IF EXISTS public.promise_tracker_metrics;

-- Recreate Promise Tracker View with SECURITY INVOKER
CREATE VIEW public.promise_tracker_view 
WITH (security_invoker = true)
AS
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

-- Recreate Promise Tracker Metrics with SECURITY INVOKER
CREATE VIEW public.promise_tracker_metrics 
WITH (security_invoker = true)
AS
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

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.prevent_view_log_modification()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'Promise view/export logs are immutable - no updates or deletes allowed';
END;
$$;

-- Grant SELECT on views
GRANT SELECT ON public.promise_tracker_view TO authenticated;
GRANT SELECT ON public.promise_tracker_metrics TO authenticated;