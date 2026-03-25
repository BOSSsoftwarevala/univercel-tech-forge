ALTER TABLE public.platform_api_services
ADD COLUMN IF NOT EXISTS price_per_request DECIMAL(12,6) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_per_token DECIMAL(12,6) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_limit INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN IF NOT EXISTS speed_mode TEXT NOT NULL DEFAULT 'standard' CHECK (speed_mode IN ('economy', 'standard', 'priority')),
ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS error_count INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_error_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE TABLE IF NOT EXISTS public.ai_api_client_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_user_id UUID NOT NULL,
    api_service_id UUID NOT NULL REFERENCES public.platform_api_services(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES public.unified_wallets(id) ON DELETE SET NULL,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('daily', 'monthly', 'per_use')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired', 'blocked', 'cancelled')),
    usage_limit INTEGER NOT NULL DEFAULT 0,
    usage_count INTEGER NOT NULL DEFAULT 0,
    expiry_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    last_billed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_api_client_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES public.ai_api_client_subscriptions(id) ON DELETE CASCADE,
    client_user_id UUID NOT NULL,
    api_service_id UUID NOT NULL REFERENCES public.platform_api_services(id) ON DELETE CASCADE,
    api_key TEXT NOT NULL UNIQUE,
    api_key_hash TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'revoked', 'expired')),
    usage_count INTEGER NOT NULL DEFAULT 0,
    usage_limit INTEGER NOT NULL DEFAULT 0,
    expiry_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_api_usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES public.ai_api_client_subscriptions(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES public.ai_api_client_keys(id) ON DELETE SET NULL,
    client_user_id UUID NOT NULL,
    api_service_id UUID NOT NULL REFERENCES public.platform_api_services(id) ON DELETE CASCADE,
    request_count INTEGER NOT NULL DEFAULT 1,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(12,6) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'blocked', 'error')),
    error_message TEXT,
    source TEXT NOT NULL DEFAULT 'internal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_api_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_user_id UUID NOT NULL,
    subscription_id UUID REFERENCES public.ai_api_client_subscriptions(id) ON DELETE SET NULL,
    api_service_id UUID REFERENCES public.platform_api_services(id) ON DELETE SET NULL,
    api_key_id UUID REFERENCES public.ai_api_client_keys(id) ON DELETE SET NULL,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('usage_80', 'wallet_low', 'api_error', 'limit_exceeded', 'billing_blocked')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_api_client_subscriptions_client ON public.ai_api_client_subscriptions(client_user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_api_client_subscriptions_api ON public.ai_api_client_subscriptions(api_service_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_api_client_keys_client ON public.ai_api_client_keys(client_user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_api_client_keys_lookup ON public.ai_api_client_keys(api_key, status);
CREATE INDEX IF NOT EXISTS idx_ai_api_usage_events_client_created ON public.ai_api_usage_events(client_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_api_usage_events_api_created ON public.ai_api_usage_events(api_service_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_api_alerts_client_read ON public.ai_api_alerts(client_user_id, is_read, created_at DESC);

ALTER TABLE public.ai_api_client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_api_client_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_api_usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_api_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_api_subscriptions_owner_select" ON public.ai_api_client_subscriptions;
CREATE POLICY "ai_api_subscriptions_owner_select"
ON public.ai_api_client_subscriptions FOR SELECT
USING (
    client_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_subscriptions_admin_manage" ON public.ai_api_client_subscriptions;
CREATE POLICY "ai_api_subscriptions_admin_manage"
ON public.ai_api_client_subscriptions FOR ALL
USING (
    public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
)
WITH CHECK (
    public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_keys_owner_select" ON public.ai_api_client_keys;
CREATE POLICY "ai_api_keys_owner_select"
ON public.ai_api_client_keys FOR SELECT
USING (
    client_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_keys_admin_manage" ON public.ai_api_client_keys;
CREATE POLICY "ai_api_keys_admin_manage"
ON public.ai_api_client_keys FOR ALL
USING (
    public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
)
WITH CHECK (
    public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_usage_owner_select" ON public.ai_api_usage_events;
CREATE POLICY "ai_api_usage_owner_select"
ON public.ai_api_usage_events FOR SELECT
USING (
    client_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_usage_admin_manage" ON public.ai_api_usage_events;
CREATE POLICY "ai_api_usage_admin_manage"
ON public.ai_api_usage_events FOR ALL
USING (
    public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
)
WITH CHECK (
    public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_alerts_owner_select" ON public.ai_api_alerts;
CREATE POLICY "ai_api_alerts_owner_select"
ON public.ai_api_alerts FOR SELECT
USING (
    client_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_alerts_owner_update" ON public.ai_api_alerts;
CREATE POLICY "ai_api_alerts_owner_update"
ON public.ai_api_alerts FOR UPDATE
USING (
    client_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
)
WITH CHECK (
    client_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "ai_api_alerts_admin_insert" ON public.ai_api_alerts;
CREATE POLICY "ai_api_alerts_admin_insert"
ON public.ai_api_alerts FOR INSERT
WITH CHECK (
    public.has_role(auth.uid(), 'boss_owner')
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'ai_manager')
    OR public.has_role(auth.uid(), 'ceo')
);

DROP TRIGGER IF EXISTS update_ai_api_client_subscriptions_updated_at ON public.ai_api_client_subscriptions;
CREATE TRIGGER update_ai_api_client_subscriptions_updated_at
BEFORE UPDATE ON public.ai_api_client_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_api_client_keys_updated_at ON public.ai_api_client_keys;
CREATE TRIGGER update_ai_api_client_keys_updated_at
BEFORE UPDATE ON public.ai_api_client_keys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.platform_api_services (
    name,
    provider,
    type,
    endpoint,
    status,
    billing_status,
    price_per_request,
    price_per_token,
    max_limit,
    speed_mode,
    is_enabled,
    auto_stop_on_unpaid,
    notes
)
SELECT * FROM (
    VALUES
        (
            'OpenAI Responses',
            'openai',
            'ai',
            '/functions/v1/api-ai-marketplace/gateway/use',
            'running',
            'paid',
            0.15,
            0.002,
            10000,
            'priority',
            true,
            true,
            'Primary text-generation API product'
        ),
        (
            'SMS Gateway',
            'twilio',
            'messaging',
            '/functions/v1/api-ai-marketplace/gateway/use',
            'running',
            'paid',
            0.08,
            0,
            20000,
            'standard',
            true,
            true,
            'Transactional SMS delivery API'
        ),
        (
            'Email Relay',
            'resend',
            'messaging',
            '/functions/v1/api-ai-marketplace/gateway/use',
            'running',
            'paid',
            0.03,
            0,
            50000,
            'economy',
            true,
            true,
            'Email sending and tracking API'
        )
) AS seed_data(
    name,
    provider,
    type,
    endpoint,
    status,
    billing_status,
    price_per_request,
    price_per_token,
    max_limit,
    speed_mode,
    is_enabled,
    auto_stop_on_unpaid,
    notes
)
WHERE NOT EXISTS (
    SELECT 1 FROM public.platform_api_services existing
    WHERE existing.name = seed_data.name
);