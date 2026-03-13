-- =============================================================================
-- 002_security_hardening.sql
-- Zero Trust Security Hardening: Immutable Payment Ledger, RLS, Encryption
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. PAYMENT EVENT LEDGER (Immutable hash-chain append-only table)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_event_ledger (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_num    BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
    event_type      VARCHAR(64) NOT NULL,
    order_id        UUID,
    user_id         UUID,
    amount          NUMERIC(18,4),
    currency        VARCHAR(8),
    gateway         VARCHAR(64),
    gateway_ref     TEXT,
    event_data      JSONB NOT NULL DEFAULT '{}',
    previous_hash   TEXT NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
    event_hash      TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Append-only: block UPDATE and DELETE via RLS + trigger
CREATE OR REPLACE FUNCTION public.prevent_ledger_modification()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    RAISE EXCEPTION 'payment_event_ledger is append-only – modifications are forbidden';
END;
$$;

DROP TRIGGER IF EXISTS trg_ledger_immutable ON public.payment_event_ledger;
CREATE TRIGGER trg_ledger_immutable
    BEFORE UPDATE OR DELETE ON public.payment_event_ledger
    FOR EACH ROW EXECUTE FUNCTION public.prevent_ledger_modification();

CREATE INDEX IF NOT EXISTS idx_pel_order_id    ON public.payment_event_ledger(order_id);
CREATE INDEX IF NOT EXISTS idx_pel_user_id     ON public.payment_event_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_pel_created_at  ON public.payment_event_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pel_seq         ON public.payment_event_ledger(sequence_num);

COMMENT ON TABLE  public.payment_event_ledger IS 'Immutable SHA-256 hash-chain ledger for every payment event';
COMMENT ON COLUMN public.payment_event_ledger.previous_hash IS 'SHA-256 of the previous ledger row (genesis = 64 zeros)';
COMMENT ON COLUMN public.payment_event_ledger.event_hash    IS 'SHA-256(previous_hash || event_type || order_id || amount || currency || gateway_ref || created_at)';

-- ---------------------------------------------------------------------------
-- 2. ORDERS TABLE (if it does not yet exist)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL,
    product_id          UUID,
    idempotency_key     TEXT UNIQUE,
    amount              NUMERIC(18,4) NOT NULL,
    currency            VARCHAR(8) NOT NULL DEFAULT 'USD',
    status              VARCHAR(32) NOT NULL DEFAULT 'pending',
    gateway             VARCHAR(64),
    gateway_order_id    TEXT,
    risk_score          SMALLINT DEFAULT 0,
    fraud_flags         JSONB DEFAULT '[]',
    ip_address          INET,
    device_fingerprint  TEXT,
    expires_at          TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 minutes'),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id     ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_idempotency ON public.orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON public.orders(created_at DESC);

-- ---------------------------------------------------------------------------
-- 3. PAYMENTS TABLE (if it does not yet exist)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES public.orders(id),
    user_id         UUID NOT NULL,
    gateway         VARCHAR(64) NOT NULL,
    gateway_ref     TEXT UNIQUE NOT NULL,
    amount          NUMERIC(18,4) NOT NULL,
    currency        VARCHAR(8) NOT NULL,
    status          VARCHAR(32) NOT NULL DEFAULT 'pending',
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at     TIMESTAMPTZ,
    webhook_payload JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id   ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id    ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_ref ON public.payments(gateway_ref);

-- ---------------------------------------------------------------------------
-- 4. LICENSES TABLE (if it does not yet exist)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.licenses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id      UUID NOT NULL REFERENCES public.payments(id),
    order_id        UUID NOT NULL REFERENCES public.orders(id),
    user_id         UUID NOT NULL,
    product_id      UUID,
    license_key     TEXT NOT NULL,
    status          VARCHAR(32) NOT NULL DEFAULT 'active',
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_licenses_user_id    ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_order_id   ON public.licenses(order_id);
CREATE INDEX IF NOT EXISTS idx_licenses_payment_id ON public.licenses(payment_id);

-- ---------------------------------------------------------------------------
-- 5. WEBHOOK REPLAY CACHE  (idempotency / deduplication)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webhook_replay_cache (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_ref     TEXT NOT NULL UNIQUE,
    gateway         VARCHAR(64) NOT NULL,
    processed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

CREATE INDEX IF NOT EXISTS idx_wrc_gateway_ref ON public.webhook_replay_cache(gateway_ref);
CREATE INDEX IF NOT EXISTS idx_wrc_expires_at  ON public.webhook_replay_cache(expires_at);

-- ---------------------------------------------------------------------------
-- 6. FRAUD FLAGS TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fraud_flags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,
    order_id        UUID,
    ip_address      INET,
    reason          TEXT NOT NULL,
    risk_score      SMALLINT NOT NULL DEFAULT 0,
    reviewed        BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed_by     UUID,
    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ff_user_id    ON public.fraud_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_ff_order_id   ON public.fraud_flags(order_id);
CREATE INDEX IF NOT EXISTS idx_ff_reviewed   ON public.fraud_flags(reviewed);
CREATE INDEX IF NOT EXISTS idx_ff_created_at ON public.fraud_flags(created_at DESC);

-- ---------------------------------------------------------------------------
-- 7. ROW-LEVEL SECURITY
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- NOTE ON SERVICE_ROLE AND RLS IN SUPABASE
-- In Supabase, the service_role key bypasses RLS automatically.
-- Therefore, policies below only need to cover authenticated (anon/user) access.
-- Edge functions using SERVICE_ROLE_KEY are implicitly unrestricted.
-- ---------------------------------------------------------------------------

-- Orders: authenticated users see only their own rows
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_select_own ON public.orders;
DROP POLICY IF EXISTS orders_insert_own ON public.orders;

CREATE POLICY orders_select_own ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

-- Users may create their own orders; status changes are service_role only
CREATE POLICY orders_insert_own ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments: authenticated users can view their own; no direct insert/update
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payments_select_own ON public.payments;

CREATE POLICY payments_select_own ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- Licenses: authenticated users see only their own
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS licenses_select_own ON public.licenses;

CREATE POLICY licenses_select_own ON public.licenses
    FOR SELECT USING (auth.uid() = user_id);

-- Payment event ledger: no direct access for authenticated users (service_role only via RLS bypass)
ALTER TABLE public.payment_event_ledger ENABLE ROW LEVEL SECURITY;

-- No permissive policies for authenticated users — only service_role (bypass) can access

-- Fraud flags: no direct access for authenticated users
ALTER TABLE public.fraud_flags ENABLE ROW LEVEL SECURITY;

-- No permissive policies for authenticated users — only service_role (bypass) can access

-- ---------------------------------------------------------------------------
-- 8. HELPER FUNCTION: append a ledger entry (called from edge functions)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.append_payment_ledger(
    p_event_type    TEXT,
    p_order_id      UUID,
    p_user_id       UUID,
    p_amount        NUMERIC,
    p_currency      TEXT,
    p_gateway       TEXT,
    p_gateway_ref   TEXT,
    p_event_data    JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_previous_hash TEXT;
    v_event_hash    TEXT;
    v_new_id        UUID;
    v_raw           TEXT;
BEGIN
    -- Fetch the hash of the most recent ledger row
    SELECT COALESCE(event_hash, '0000000000000000000000000000000000000000000000000000000000000000')
    INTO   v_previous_hash
    FROM   public.payment_event_ledger
    ORDER  BY sequence_num DESC
    LIMIT  1;

    IF v_previous_hash IS NULL THEN
        v_previous_hash := '0000000000000000000000000000000000000000000000000000000000000000';
    END IF;

    -- Compute event hash using pgcrypto (SHA-256)
    v_raw := v_previous_hash
          || COALESCE(p_event_type,  '')
          || COALESCE(p_order_id::TEXT, '')
          || COALESCE(p_amount::TEXT, '')
          || COALESCE(p_currency, '')
          || COALESCE(p_gateway_ref, '')
          || now()::TEXT;

    v_event_hash := encode(digest(v_raw, 'sha256'), 'hex');

    INSERT INTO public.payment_event_ledger (
        event_type, order_id, user_id, amount, currency,
        gateway, gateway_ref, event_data, previous_hash, event_hash
    ) VALUES (
        p_event_type, p_order_id, p_user_id, p_amount, p_currency,
        p_gateway, p_gateway_ref, p_event_data, v_previous_hash, v_event_hash
    )
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
END;
$$;

-- ---------------------------------------------------------------------------
-- 9. HELPER FUNCTION: find duplicate payment gateway references
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.find_duplicate_payment_refs()
RETURNS TABLE(gateway_ref TEXT, occurrence_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT gateway_ref, COUNT(*) AS occurrence_count
    FROM   public.payments
    GROUP  BY gateway_ref
    HAVING COUNT(*) > 1;
$$;

-- ---------------------------------------------------------------------------
-- 10. FINANCIAL RECONCILIATION VIEW (used by the cron function)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.reconciliation_summary AS
SELECT
    o.id           AS order_id,
    o.user_id,
    o.amount       AS order_amount,
    o.currency,
    o.status       AS order_status,
    p.id           AS payment_id,
    p.amount       AS payment_amount,
    p.status       AS payment_status,
    p.verified,
    l.id           AS license_id,
    CASE
        WHEN p.id IS NULL                    THEN 'orphan_order'
        WHEN p.amount <> o.amount            THEN 'amount_mismatch'
        WHEN l.id IS NULL AND p.verified     THEN 'missing_license'
        ELSE 'ok'
    END            AS reconciliation_status
FROM   public.orders  o
LEFT JOIN public.payments  p ON p.order_id = o.id
LEFT JOIN public.licenses  l ON l.payment_id = p.id;

COMMENT ON VIEW public.reconciliation_summary IS
    'Daily reconciliation: orders vs payments vs licenses';
