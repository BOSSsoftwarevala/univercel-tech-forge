-- AI API SYSTEM ULTRA FIX — USAGE TRIGGER
-- Notifies on wallet_logs insert for realtime usage updates

CREATE OR REPLACE FUNCTION notify_ai_usage_update() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('ai_usage_update', NEW.user_id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_ai_usage_update ON public.wallet_logs;
CREATE TRIGGER trg_notify_ai_usage_update
AFTER INSERT ON public.wallet_logs
FOR EACH ROW EXECUTE FUNCTION notify_ai_usage_update();
