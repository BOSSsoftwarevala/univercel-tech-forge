-- V135__backend_services_tables.sql
-- Add tables for email queue, product licenses, and API rate limiting

-- ─── Email Queue ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_to TEXT NOT NULL,
    email_from TEXT NOT NULL DEFAULT 'notifications@softwarevala.net',
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    email_type VARCHAR(100) NOT NULL DEFAULT 'notification',
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'retrying')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    last_error TEXT,
    metadata JSONB,
    scheduled_at TIMESTAMPTZ DEFAULT now(),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled_at ON public.email_queue(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_email_type ON public.email_queue(email_type);
CREATE INDEX IF NOT EXISTS idx_email_queue_priority ON public.email_queue(priority, scheduled_at);

COMMENT ON TABLE public.email_queue IS 'Persistent queue for outbound emails with retry support';

-- ─── Product Licenses ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key VARCHAR(255) UNIQUE NOT NULL,
    product_id UUID NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    order_id UUID,
    domain_bound TEXT,
    device_fingerprint TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'unused'
        CHECK (status IN ('unused', 'active', 'expired', 'revoked', 'suspended')),
    expires_at TIMESTAMPTZ,
    activated_at TIMESTAMPTZ,
    last_validated_at TIMESTAMPTZ,
    activation_count INT NOT NULL DEFAULT 0,
    max_activations INT NOT NULL DEFAULT 1,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_licenses_license_key ON public.product_licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_product_licenses_product_id ON public.product_licenses(product_id);
CREATE INDEX IF NOT EXISTS idx_product_licenses_user_id ON public.product_licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_product_licenses_status ON public.product_licenses(status);
CREATE INDEX IF NOT EXISTS idx_product_licenses_expires_at ON public.product_licenses(expires_at)
    WHERE expires_at IS NOT NULL;

COMMENT ON TABLE public.product_licenses IS 'Product license keys with domain and device binding support';

-- ─── API Rate Limits ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL,          -- IP address or user_id
    identifier_type VARCHAR(10) NOT NULL DEFAULT 'ip'
        CHECK (identifier_type IN ('ip', 'user', 'api_key')),
    endpoint TEXT NOT NULL DEFAULT '*',
    request_count INT NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    window_end TIMESTAMPTZ NOT NULL,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_api_rate_limits_identifier_window
    ON public.api_rate_limits(identifier, endpoint, window_start);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_identifier ON public.api_rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_window_end ON public.api_rate_limits(window_end);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_blocked ON public.api_rate_limits(is_blocked)
    WHERE is_blocked = true;

COMMENT ON TABLE public.api_rate_limits IS 'Tracks API request counts per identifier for throttling';

-- ─── RPC: Atomic counter increment ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_rate_limit_counter(
    p_identifier TEXT,
    p_endpoint TEXT,
    p_window_start TIMESTAMPTZ
)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count INT;
BEGIN
    UPDATE public.api_rate_limits
    SET request_count = request_count + 1,
        updated_at = now()
    WHERE identifier = p_identifier
      AND endpoint = p_endpoint
      AND window_start = p_window_start
    RETURNING request_count INTO new_count;

    RETURN COALESCE(new_count, 0);
END;
$$;
