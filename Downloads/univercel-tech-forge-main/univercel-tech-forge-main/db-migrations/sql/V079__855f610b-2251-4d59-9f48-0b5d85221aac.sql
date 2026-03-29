-- Fix: Convert SECURITY DEFINER view to regular view with proper access control
DROP VIEW IF EXISTS public.promise_manager_metrics;

-- Recreate as a regular view (SECURITY INVOKER - default)
CREATE VIEW public.promise_manager_metrics AS
SELECT 
    COUNT(*) FILTER (WHERE status NOT IN ('completed', 'breached')) AS total_active,
    COUNT(*) FILTER (WHERE status = 'pending_approval') AS pending_approval,
    COUNT(*) FILTER (WHERE status IN ('promised', 'in_progress', 'assigned') AND deadline < now()) AS overdue,
    COUNT(*) FILTER (WHERE status = 'completed') AS fulfilled,
    COUNT(*) FILTER (WHERE status = 'breached') AS breached,
    COUNT(*) AS total_promises,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / 
        NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'breached')), 0) * 100, 2
    ) AS fulfillment_rate,
    COUNT(*) FILTER (WHERE escalation_level > 0 AND status NOT IN ('completed', 'breached')) AS active_escalations
FROM promise_logs;

-- Explicitly set SECURITY INVOKER (the default, but being explicit)
ALTER VIEW public.promise_manager_metrics SET (security_invoker = true);