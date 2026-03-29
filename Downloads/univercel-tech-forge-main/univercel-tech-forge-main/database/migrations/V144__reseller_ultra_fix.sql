-- RESELLER ULTRA FIX MIGRATION

-- 1. Enforce payout via API only (no direct insert)
-- (Handled in API layer, not SQL)

-- 2. Duplicate check: Add unique constraint or index on (reseller_id, last4, created_at::date)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_reseller_payout_last4_date ON public.reseller_payouts (reseller_id, last4, (date_trunc('day', created_at)));

-- 3. Use reseller_wallets everywhere (already enforced by schema)
-- 4. Wallet UI: Fetch via API (handled in frontend)

-- 5. Add try/catch + rollback for payout (handled in API logic)

-- 6. Payout release: Add status and trigger logic
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS released_at timestamptz;

-- 7. API map: Align all routes (handled in API layer)

-- 8. Security: Enforce RLS and server-only writes
-- (RLS already enabled, add stricter policies if needed)

-- 9. Realtime: Enable triggers for wallet, payout, leads
-- Example: Notify on wallet or payout change
CREATE OR REPLACE FUNCTION notify_reseller_wallet_update() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('reseller_wallet_update', NEW.reseller_id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_reseller_wallet_update ON public.reseller_wallets;
CREATE TRIGGER trg_notify_reseller_wallet_update
AFTER UPDATE ON public.reseller_wallets
FOR EACH ROW EXECUTE FUNCTION notify_reseller_wallet_update();

CREATE OR REPLACE FUNCTION notify_reseller_payout_update() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('reseller_payout_update', NEW.reseller_id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_reseller_payout_update ON public.reseller_payouts;
CREATE TRIGGER trg_notify_reseller_payout_update
AFTER UPDATE ON public.reseller_payouts
FOR EACH ROW EXECUTE FUNCTION notify_reseller_payout_update();

-- (Repeat for leads if needed)
