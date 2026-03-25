CREATE TABLE IF NOT EXISTS public.marketplace_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    buyer_role app_role NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE RESTRICT,
    wallet_id UUID REFERENCES public.wallets(wallet_id) ON DELETE SET NULL,
    gross_amount NUMERIC(12,2) NOT NULL,
    discount_percent INTEGER NOT NULL DEFAULT 0,
    final_amount NUMERIC(12,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending_verification',
    order_status TEXT NOT NULL DEFAULT 'payment_pending',
    client_domain TEXT,
    requirements JSONB DEFAULT '{}'::jsonb,
    external_reference TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_order_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_status TEXT NOT NULL,
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.marketplace_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
    buyer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE RESTRICT,
    license_key TEXT NOT NULL UNIQUE,
    license_status TEXT NOT NULL DEFAULT 'active',
    activated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_status ON public.marketplace_orders(buyer_user_id, order_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_product_created ON public.marketplace_orders(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_payment_status ON public.marketplace_orders(payment_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_order_events_order_created ON public.marketplace_order_events(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_licenses_buyer ON public.marketplace_licenses(buyer_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_licenses_product ON public.marketplace_licenses(product_id, created_at DESC);

ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "marketplace_orders_buyer_read" ON public.marketplace_orders;
CREATE POLICY "marketplace_orders_buyer_read"
ON public.marketplace_orders
FOR SELECT
USING (
    buyer_user_id = auth.uid()
    OR has_role(auth.uid(), 'boss_owner')
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'finance_manager')
);

DROP POLICY IF EXISTS "marketplace_orders_buyer_insert" ON public.marketplace_orders;
CREATE POLICY "marketplace_orders_buyer_insert"
ON public.marketplace_orders
FOR INSERT
WITH CHECK (buyer_user_id = auth.uid());

DROP POLICY IF EXISTS "marketplace_orders_admin_update" ON public.marketplace_orders;
CREATE POLICY "marketplace_orders_admin_update"
ON public.marketplace_orders
FOR UPDATE
USING (
    has_role(auth.uid(), 'boss_owner')
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'finance_manager')
);

DROP POLICY IF EXISTS "marketplace_order_events_visible" ON public.marketplace_order_events;
CREATE POLICY "marketplace_order_events_visible"
ON public.marketplace_order_events
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.marketplace_orders mo
        WHERE mo.id = marketplace_order_events.order_id
          AND (
            mo.buyer_user_id = auth.uid()
            OR has_role(auth.uid(), 'boss_owner')
            OR has_role(auth.uid(), 'admin')
            OR has_role(auth.uid(), 'finance_manager')
          )
    )
);

DROP POLICY IF EXISTS "marketplace_order_events_system_insert" ON public.marketplace_order_events;
CREATE POLICY "marketplace_order_events_system_insert"
ON public.marketplace_order_events
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "marketplace_licenses_owner_read" ON public.marketplace_licenses;
CREATE POLICY "marketplace_licenses_owner_read"
ON public.marketplace_licenses
FOR SELECT
USING (
    buyer_user_id = auth.uid()
    OR has_role(auth.uid(), 'boss_owner')
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'finance_manager')
);

DROP POLICY IF EXISTS "marketplace_licenses_admin_manage" ON public.marketplace_licenses;
CREATE POLICY "marketplace_licenses_admin_manage"
ON public.marketplace_licenses
FOR ALL
USING (
    has_role(auth.uid(), 'boss_owner')
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'finance_manager')
)
WITH CHECK (
    has_role(auth.uid(), 'boss_owner')
    OR has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'finance_manager')
);

CREATE OR REPLACE FUNCTION public.generate_marketplace_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    generated_order TEXT;
BEGIN
    generated_order := 'MKT-' || TO_CHAR(now(), 'YYYYMMDD-HH24MISS') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 6));
    RETURN generated_order;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_marketplace_license_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN 'LIC-' || UPPER(ENCODE(gen_random_bytes(12), 'hex'));
END;
$$;

CREATE OR REPLACE FUNCTION public.create_marketplace_order(
    p_user_id UUID,
    p_user_role app_role,
    p_product_id UUID,
    p_payment_method TEXT,
    p_client_domain TEXT DEFAULT NULL,
    p_requirements TEXT DEFAULT NULL,
    p_external_reference TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_product public.products%ROWTYPE;
    v_wallet public.wallets%ROWTYPE;
    v_order_id UUID;
    v_order_number TEXT;
    v_license_key TEXT;
    v_transaction_id UUID;
    v_gross_amount NUMERIC(12,2);
    v_discount_percent INTEGER;
    v_final_amount NUMERIC(12,2);
    v_payment_status TEXT;
    v_order_status TEXT;
    v_risk_score INTEGER;
BEGIN
    SELECT *
    INTO v_product
    FROM public.products
    WHERE product_id = p_product_id
      AND COALESCE(is_active, true) = true
      AND COALESCE(status, 'active') NOT IN ('inactive', 'parked', 'deleted')
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product is not available for purchase');
    END IF;

    v_gross_amount := COALESCE(v_product.lifetime_price, v_product.monthly_price);
    IF v_gross_amount IS NULL OR v_gross_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product pricing is not configured');
    END IF;

    v_discount_percent := CASE p_user_role
        WHEN 'franchise' THEN 30
        WHEN 'reseller' THEN 15
        WHEN 'prime' THEN 10
        ELSE 0
    END;

    v_final_amount := ROUND(v_gross_amount * ((100 - v_discount_percent)::NUMERIC / 100), 2);
    v_order_number := public.generate_marketplace_order_number();

    IF p_payment_method = 'wallet' THEN
        SELECT *
        INTO v_wallet
        FROM public.wallets
        WHERE user_id = p_user_id
        FOR UPDATE;

        IF NOT FOUND THEN
            INSERT INTO public.wallets (user_id, balance, currency)
            VALUES (p_user_id, 0, 'INR')
            RETURNING * INTO v_wallet;
        END IF;

        IF COALESCE(v_wallet.balance, 0) < v_final_amount THEN
            RETURN jsonb_build_object('success', false, 'error', 'Insufficient wallet balance');
        END IF;

        UPDATE public.wallets
        SET balance = balance - v_final_amount,
            updated_at = now()
        WHERE wallet_id = v_wallet.wallet_id;

        INSERT INTO public.transactions (
            wallet_id,
            type,
            amount,
            reference,
            related_user,
            related_role,
            status
        )
        VALUES (
            v_wallet.wallet_id,
            'marketplace_purchase',
            -v_final_amount,
            v_order_number,
            p_user_id,
            p_user_role,
            'completed'
        )
        RETURNING transaction_id INTO v_transaction_id;

        INSERT INTO public.wallet_audit_log (
            user_id,
            wallet_id,
            operation_type,
            status,
            amount,
            previous_balance,
            new_balance,
            transaction_id,
            metadata
        )
        VALUES (
            p_user_id,
            v_wallet.wallet_id,
            'marketplace_purchase',
            'completed',
            v_final_amount,
            v_wallet.balance,
            v_wallet.balance - v_final_amount,
            v_transaction_id,
            jsonb_build_object('product_id', p_product_id, 'order_number', v_order_number)
        );

        v_payment_status := 'verified';
        v_order_status := 'processing';
    ELSE
        v_payment_status := 'pending_verification';
        v_order_status := 'payment_pending';
    END IF;

    INSERT INTO public.marketplace_orders (
        order_number,
        buyer_user_id,
        buyer_role,
        product_id,
        wallet_id,
        gross_amount,
        discount_percent,
        final_amount,
        payment_method,
        payment_status,
        order_status,
        client_domain,
        requirements,
        external_reference,
        metadata
    )
    VALUES (
        v_order_number,
        p_user_id,
        p_user_role,
        p_product_id,
        v_wallet.wallet_id,
        v_gross_amount,
        v_discount_percent,
        v_final_amount,
        p_payment_method,
        v_payment_status,
        v_order_status,
        p_client_domain,
        jsonb_build_object('notes', COALESCE(p_requirements, '')),
        p_external_reference,
        jsonb_build_object('source', 'marketplace_ui')
    )
    RETURNING id INTO v_order_id;

    INSERT INTO public.marketplace_order_events (order_id, event_type, event_status, actor_user_id, payload)
    VALUES (
        v_order_id,
        'order_created',
        v_order_status,
        p_user_id,
        jsonb_build_object('payment_status', v_payment_status, 'payment_method', p_payment_method)
    );

    IF p_payment_method = 'wallet' THEN
        v_license_key := public.generate_marketplace_license_key();

        INSERT INTO public.marketplace_licenses (
            order_id,
            buyer_user_id,
            product_id,
            license_key,
            metadata
        )
        VALUES (
            v_order_id,
            p_user_id,
            p_product_id,
            v_license_key,
            jsonb_build_object('order_number', v_order_number)
        );

        INSERT INTO public.marketplace_order_events (order_id, event_type, event_status, actor_user_id, payload)
        VALUES (
            v_order_id,
            'license_generated',
            'active',
            p_user_id,
            jsonb_build_object('license_key', v_license_key)
        );
    END IF;

    v_risk_score := CASE
        WHEN v_final_amount >= 100000 THEN 85
        WHEN v_final_amount >= 50000 THEN 60
        ELSE 20
    END;

    INSERT INTO public.transaction_monitoring (
        transaction_id,
        user_id,
        wallet_id,
        transaction_type,
        amount,
        currency,
        risk_score,
        is_flagged,
        is_held,
        hold_reason,
        requires_2fa,
        risk_factors,
        velocity_check_passed,
        geo_check_passed,
        pattern_check_passed,
        flag_reason
    )
    VALUES (
        v_transaction_id,
        p_user_id,
        v_wallet.wallet_id,
        'marketplace_purchase',
        v_final_amount,
        'INR',
        v_risk_score,
        v_risk_score >= 60,
        v_risk_score >= 85,
        CASE WHEN v_risk_score >= 85 THEN 'high_value_purchase' ELSE NULL END,
        v_risk_score >= 85,
        CASE WHEN v_risk_score >= 60 THEN ARRAY['high_purchase_value'] ELSE ARRAY[]::TEXT[] END,
        true,
        true,
        true,
        CASE WHEN v_risk_score >= 60 THEN 'Review marketplace purchase' ELSE NULL END
    );

    IF v_risk_score >= 85 THEN
        INSERT INTO public.fraud_alerts (user_id, type, severity, flagged_by_ai, status)
        VALUES (p_user_id, 'marketplace_purchase_review', 'high', true, 'open');
    END IF;

    INSERT INTO public.user_notifications (user_id, type, message, event_type, action_label, action_url, role_target, is_buzzer)
    VALUES (
        p_user_id,
        'success',
        'Marketplace order ' || v_order_number || ' created for ' || v_product.product_name,
        'marketplace_order_created',
        'View order',
        '/franchise',
        ARRAY[p_user_role::TEXT],
        false
    );

    INSERT INTO public.user_notifications (user_id, type, message, event_type, action_label, action_url, role_target, is_buzzer)
    SELECT
        ur.user_id,
        CASE WHEN v_risk_score >= 85 THEN 'priority' ELSE 'info' END,
        'New marketplace order ' || v_order_number || ' by ' || p_user_role::TEXT || ' for ' || v_product.product_name,
        'marketplace_order_admin',
        'Review order',
        '/super-admin/product-manager',
        ARRAY[ur.role::TEXT],
        v_risk_score >= 85
    FROM public.user_roles ur
    WHERE ur.role IN ('boss_owner', 'admin', 'finance_manager');

    INSERT INTO public.audit_logs (module, action, user_id, role, meta_json)
    VALUES (
        'marketplace',
        'order_created',
        p_user_id,
        p_user_role,
        jsonb_build_object(
            'order_id', v_order_id,
            'order_number', v_order_number,
            'product_id', p_product_id,
            'payment_method', p_payment_method,
            'payment_status', v_payment_status,
            'order_status', v_order_status,
            'amount', v_final_amount
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'payment_status', v_payment_status,
        'order_status', v_order_status,
        'license_key', v_license_key,
        'final_amount', v_final_amount,
        'risk_score', v_risk_score
    );
END;
$$;
