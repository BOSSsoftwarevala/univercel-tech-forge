-- Fix: system_activity_log is already in realtime publication; only create sync trigger + backfill

CREATE OR REPLACE FUNCTION public.sync_audit_logs_to_system_activity_log()
RETURNS TRIGGER AS $$
DECLARE
  v_actor_role text;
  v_target_id uuid;
BEGIN
  v_actor_role := COALESCE(NEW.role::text, 'unknown');

  -- target_id is optional and may not be a uuid in meta_json
  BEGIN
    v_target_id := NULLIF(NEW.meta_json->>'target_id', '')::uuid;
  EXCEPTION WHEN others THEN
    v_target_id := NULL;
  END;

  INSERT INTO public.system_activity_log (
    log_id,
    actor_role,
    actor_id,
    action_type,
    target,
    target_id,
    risk_level,
    metadata,
    timestamp,
    hash_signature
  ) VALUES (
    NEW.id,
    v_actor_role,
    NEW.user_id,
    NEW.action,
    NEW.module,
    v_target_id,
    COALESCE(NEW.meta_json->>'severity', 'low'),
    NEW.meta_json,
    NEW.timestamp,
    NULL
  )
  ON CONFLICT (log_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_sync_audit_logs_to_system_activity_log ON public.audit_logs;
CREATE TRIGGER trg_sync_audit_logs_to_system_activity_log
AFTER INSERT ON public.audit_logs
FOR EACH ROW
EXECUTE FUNCTION public.sync_audit_logs_to_system_activity_log();

-- Backfill latest audit logs into system_activity_log (idempotent)
INSERT INTO public.system_activity_log (
  log_id,
  actor_role,
  actor_id,
  action_type,
  target,
  target_id,
  risk_level,
  metadata,
  timestamp,
  hash_signature
)
SELECT
  a.id,
  COALESCE(a.role::text, 'unknown') as actor_role,
  a.user_id,
  a.action as action_type,
  a.module as target,
  CASE
    WHEN (a.meta_json ? 'target_id') THEN
      NULLIF(a.meta_json->>'target_id','')::uuid
    ELSE NULL
  END as target_id,
  COALESCE(a.meta_json->>'severity','low') as risk_level,
  a.meta_json as metadata,
  a.timestamp,
  NULL
FROM public.audit_logs a
LEFT JOIN public.system_activity_log s ON s.log_id = a.id
WHERE s.log_id IS NULL
ORDER BY a.timestamp DESC
LIMIT 5000;