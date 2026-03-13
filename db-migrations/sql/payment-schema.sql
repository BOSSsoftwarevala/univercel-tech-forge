-- Fixed-Price Marketplace Payment Schema
-- Single flat price: $249 USD for ALL products
-- No product_price column, no discount tables, no pricing rules

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id    TEXT NOT NULL,
  amount        NUMERIC(10, 2) NOT NULL DEFAULT 249.00
                  CONSTRAINT orders_amount_fixed CHECK (amount = 249.00),
  currency      TEXT NOT NULL DEFAULT 'USD'
                  CONSTRAINT orders_currency_usd CHECK (currency = 'USD'),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CONSTRAINT orders_status_valid CHECK (status IN ('pending','paid','failed','refunded')),
  idempotency_key TEXT UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  amount            NUMERIC(10, 2) NOT NULL DEFAULT 249.00
                      CONSTRAINT payments_amount_fixed CHECK (amount = 249.00),
  currency          TEXT NOT NULL DEFAULT 'USD'
                      CONSTRAINT payments_currency_usd CHECK (currency = 'USD'),
  gateway           TEXT NOT NULL
                      CONSTRAINT payments_gateway_valid CHECK (gateway IN ('flutterwave','stripe','payu')),
  gateway_txn_id    TEXT,
  webhook_verified  BOOLEAN NOT NULL DEFAULT false,
  status            TEXT NOT NULL DEFAULT 'pending'
                      CONSTRAINT payments_status_valid CHECK (status IN ('pending','completed','failed')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  product_id    TEXT NOT NULL,
  license_key   TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,
  activated_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit log (immutable — no UPDATE/DELETE allowed via RLS)
CREATE TABLE IF NOT EXISTS payment_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT NOT NULL,
  order_id    UUID REFERENCES orders(id),
  payment_id  UUID REFERENCES payments(id),
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_licenses_order_id ON licenses(order_id);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: users see only their own orders and licenses
ALTER TABLE orders               ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_audit_log    ENABLE ROW LEVEL SECURITY;

-- Orders: owner can read; service role writes
CREATE POLICY orders_select_own ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY orders_insert_service ON orders
  FOR INSERT WITH CHECK (true);   -- enforced via service-role in edge functions

-- Payments: owner can read via orders join
CREATE POLICY payments_select_own ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY payments_insert_service ON payments
  FOR INSERT WITH CHECK (true);

-- Licenses: owner can read
CREATE POLICY licenses_select_own ON licenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = licenses.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY licenses_insert_service ON licenses
  FOR INSERT WITH CHECK (true);

-- Audit log: append-only; no user reads (service role only)
CREATE POLICY audit_log_no_user_access ON payment_audit_log
  FOR ALL USING (false);
