-- AI API SYSTEM ULTRA FIX MIGRATION

-- 1. ROUTES: Ensure all client routes map to real server endpoints (handled in API layer)

-- 2. BUY FLOW: Enforce server-only buy flow (buy → key → wallet deduct)
-- (Handled in API logic, not SQL)

-- 3. LICENSE: Separate api_keys and licenses
CREATE TABLE IF NOT EXISTS public.api_keys (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    key text NOT NULL UNIQUE,
    status text NOT NULL CHECK (status IN ('active','revoked','expired')),
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.licenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    license_code text NOT NULL UNIQUE,
    product_id uuid NOT NULL,
    status text NOT NULL CHECK (status IN ('active','revoked','expired')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. REALTIME: Replace polling with event update (triggers/notifications)
CREATE OR REPLACE FUNCTION notify_ai_wallet_update() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('ai_wallet_update', NEW.user_id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_ai_wallet_update ON public.wallets;
CREATE TRIGGER trg_notify_ai_wallet_update
AFTER UPDATE ON public.wallets
FOR EACH ROW EXECUTE FUNCTION notify_ai_wallet_update();

-- 5. WALLET: Strict server billing only (enforced in API, not SQL)

-- 6. GATEWAY: Validate key + rate limit (enforced in API, not SQL)

-- 7. BILLING: Fix precision (use numeric for all billing fields)
ALTER TABLE public.wallets ALTER COLUMN balance TYPE numeric;
ALTER TABLE public.wallet_logs ALTER COLUMN amount TYPE numeric;

-- Test: Validate with real transactions (manual/test suite)
