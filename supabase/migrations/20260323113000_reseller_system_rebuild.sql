-- Enterprise reseller system rebuild

CREATE TABLE IF NOT EXISTS public.resellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    user_id UUID,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE SET NULL,
    reseller_code TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'inactive', 'rejected')),
    onboarding_stage TEXT NOT NULL DEFAULT 'application' CHECK (onboarding_stage IN ('application', 'kyc', 'agreement', 'approved', 'live')),
    default_commission_rate NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
    source TEXT NOT NULL DEFAULT 'direct',
    tags TEXT[] NOT NULL DEFAULT '{}',
    notes TEXT,
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL UNIQUE REFERENCES public.resellers(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    legal_name TEXT,
    owner_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    masked_email TEXT,
    masked_phone TEXT,
    company_name TEXT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    postal_code TEXT,
    language_code TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL UNIQUE REFERENCES public.resellers(id) ON DELETE CASCADE,
    currency TEXT NOT NULL DEFAULT 'INR',
    available_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
    pending_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_credited NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_debited NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_commission NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_payout NUMERIC(14,2) NOT NULL DEFAULT 0,
    last_entry_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_wallet_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.reseller_wallets(id) ON DELETE CASCADE,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('commission', 'credit', 'debit', 'adjustment', 'payout_hold', 'payout_release', 'payout_complete')),
    amount NUMERIC(14,2) NOT NULL,
    balance_after NUMERIC(14,2) NOT NULL,
    pending_after NUMERIC(14,2) NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    description TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company_name TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'prospect', 'inactive', 'archived')),
    notes TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_products_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
    assignment_status TEXT NOT NULL DEFAULT 'active' CHECK (assignment_status IN ('active', 'paused', 'revoked')),
    commission_override NUMERIC(5,2),
    pricing_override NUMERIC(12,2),
    assigned_by UUID,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT reseller_products_map_unique_active UNIQUE (reseller_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.reseller_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE RESTRICT,
    client_id UUID REFERENCES public.reseller_clients(id) ON DELETE SET NULL,
    product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE RESTRICT,
    marketplace_order_id UUID REFERENCES public.marketplace_orders(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL DEFAULT 'reseller_portal',
    gross_amount NUMERIC(14,2) NOT NULL,
    discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    net_amount NUMERIC(14,2) NOT NULL,
    commission_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'created' CHECK (order_status IN ('created', 'processing', 'fulfilled', 'cancelled')),
    requirements TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    fulfilled_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.reseller_orders(id) ON DELETE CASCADE,
    commission_type TEXT NOT NULL DEFAULT 'sale' CHECK (commission_type IN ('sale', 'bonus', 'adjustment', 'refund')),
    base_amount NUMERIC(14,2) NOT NULL,
    commission_rate NUMERIC(5,2) NOT NULL,
    commission_amount NUMERIC(14,2) NOT NULL,
    ledger_entry_id UUID REFERENCES public.reseller_wallet_ledger(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'credited', 'rejected')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT reseller_commissions_unique_order UNIQUE (order_id)
);

ALTER TABLE public.reseller_commissions ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE public.reseller_commissions ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.reseller_orders(id) ON DELETE CASCADE;
ALTER TABLE public.reseller_commissions ADD COLUMN IF NOT EXISTS base_amount NUMERIC(14,2);
ALTER TABLE public.reseller_commissions ADD COLUMN IF NOT EXISTS ledger_entry_id UUID REFERENCES public.reseller_wallet_ledger(id) ON DELETE SET NULL;
ALTER TABLE public.reseller_commissions ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE public.reseller_commissions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.reseller_commissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE public.reseller_commissions
SET base_amount = COALESCE(base_amount, sale_amount),
    updated_at = COALESCE(updated_at, created_at, now())
WHERE base_amount IS NULL;

CREATE TABLE IF NOT EXISTS public.reseller_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    payout_number TEXT NOT NULL UNIQUE,
    amount NUMERIC(14,2) NOT NULL,
    fee_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    net_amount NUMERIC(14,2) NOT NULL,
    payout_method TEXT NOT NULL,
    payout_status TEXT NOT NULL DEFAULT 'requested' CHECK (payout_status IN ('requested', 'approved', 'processing', 'completed', 'rejected')),
    bank_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    requested_by UUID,
    processed_by UUID,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ,
    transaction_reference TEXT,
    notes TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS payout_number TEXT;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS fee_amount NUMERIC(14,2) NOT NULL DEFAULT 0;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS net_amount NUMERIC(14,2);
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS payout_method TEXT;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS payout_status TEXT;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS requested_by UUID;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS processed_by UUID;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS transaction_reference TEXT;
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.reseller_payouts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

UPDATE public.reseller_payouts
SET payout_number = COALESCE(payout_number, transaction_ref, 'RSP-LEGACY-' || LEFT(REPLACE(id::TEXT, '-', ''), 10)),
    payout_method = COALESCE(payout_method, payment_method, 'bank_transfer'),
    payout_status = COALESCE(
        payout_status,
        CASE
            WHEN status = 'pending' THEN 'requested'
            WHEN status = 'processing' THEN 'processing'
            WHEN status = 'completed' THEN 'completed'
            WHEN status = 'approved' THEN 'approved'
            ELSE 'rejected'
        END
    ),
    net_amount = COALESCE(net_amount, amount),
    transaction_reference = COALESCE(transaction_reference, transaction_ref),
    updated_at = COALESCE(updated_at, created_at, now())
WHERE payout_number IS NULL
   OR payout_method IS NULL
   OR payout_status IS NULL
   OR net_amount IS NULL;

CREATE TABLE IF NOT EXISTS public.reseller_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    user_notification_id UUID REFERENCES public.user_notifications(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'danger', 'priority')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    event_type TEXT,
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    read_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reseller_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID REFERENCES public.resellers(id) ON DELETE CASCADE,
    actor_user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    meta_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reseller_activity_logs ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE public.reseller_activity_logs ADD COLUMN IF NOT EXISTS actor_user_id UUID;
ALTER TABLE public.reseller_activity_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE public.reseller_activity_logs ADD COLUMN IF NOT EXISTS entity_type TEXT;
ALTER TABLE public.reseller_activity_logs ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE public.reseller_activity_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.reseller_activity_logs ADD COLUMN IF NOT EXISTS meta_json JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.reseller_activity_logs
SET action = COALESCE(action, activity_type, 'legacy_activity'),
    entity_type = COALESCE(entity_type, 'reseller'),
    user_agent = COALESCE(user_agent, device_info),
    meta_json = CASE
        WHEN meta_json = '{}'::jsonb THEN COALESCE(metadata, '{}'::jsonb)
        ELSE meta_json
    END
WHERE action IS NULL
   OR entity_type IS NULL
   OR user_agent IS NULL
   OR meta_json = '{}'::jsonb;

CREATE TABLE IF NOT EXISTS public.kyc_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'verified', 'rejected')),
    doc_type TEXT,
    doc_number TEXT,
    document_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    agreement_type TEXT NOT NULL CHECK (agreement_type IN ('reseller_master', 'commission', 'nda', 'territory')),
    version TEXT NOT NULL DEFAULT '1.0',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'expired', 'revoked')),
    signed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    document_url TEXT,
    terms_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.territory_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    reseller_id UUID NOT NULL REFERENCES public.resellers(id) ON DELETE CASCADE,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE SET NULL,
    territory_type TEXT NOT NULL CHECK (territory_type IN ('country', 'state', 'city', 'district', 'region', 'pincode')),
    territory_code TEXT,
    territory_name TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
    effective_to TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resellers_user_id ON public.resellers(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_resellers_status ON public.resellers(status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_resellers_tenant_status ON public.resellers(tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_profiles_search ON public.reseller_profiles(lower(business_name), lower(email));
CREATE INDEX IF NOT EXISTS idx_reseller_wallets_reseller_id ON public.reseller_wallets(reseller_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_wallet_ledger_reseller_created ON public.reseller_wallet_ledger(reseller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reseller_clients_reseller_status ON public.reseller_clients(reseller_id, status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_products_map_reseller_status ON public.reseller_products_map(reseller_id, assignment_status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_orders_reseller_created ON public.reseller_orders(reseller_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_orders_product_status ON public.reseller_orders(product_id, payment_status, order_status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_commissions_reseller_status ON public.reseller_commissions(reseller_id, status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_payouts_reseller_status ON public.reseller_payouts(reseller_id, payout_status, requested_at DESC) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reseller_commissions_order_unique ON public.reseller_commissions(order_id) WHERE order_id IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_reseller_payouts_number_unique ON public.reseller_payouts(payout_number) WHERE payout_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_notifications_reseller_unread ON public.reseller_notifications(reseller_id, is_read, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_reseller_activity_logs_reseller_created ON public.reseller_activity_logs(reseller_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_reseller_status ON public.kyc_verifications(reseller_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_territory_mapping_reseller_primary ON public.territory_mapping(reseller_id, is_primary) WHERE deleted_at IS NULL;

ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_products_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territory_mapping ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.generate_reseller_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_code TEXT;
BEGIN
    LOOP
        v_code := 'RS-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', '') FROM 1 FOR 8));
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.resellers WHERE reseller_code = v_code);
    END LOOP;
    RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_reseller_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_number TEXT;
BEGIN
    LOOP
        v_order_number := 'RSO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((FLOOR(RANDOM() * 99999))::TEXT, 5, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.reseller_orders WHERE order_number = v_order_number);
    END LOOP;
    RETURN v_order_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_reseller_payout_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_payout_number TEXT;
BEGIN
    LOOP
        v_payout_number := 'RSP-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD((FLOOR(RANDOM() * 99999))::TEXT, 5, '0');
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.reseller_payouts WHERE payout_number = v_payout_number);
    END LOOP;
    RETURN v_payout_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_reseller_system_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT id
FROM public.resellers
WHERE user_id = _user_id
  AND deleted_at IS NULL
LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.can_manage_reseller_system(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('boss_owner', 'super_admin', 'ceo', 'admin', 'reseller_manager', 'finance_manager', 'franchise')
)
$$;

CREATE OR REPLACE FUNCTION public.mask_reseller_profile_contact()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.masked_email := CASE
        WHEN NEW.email IS NULL THEN NULL
        ELSE CONCAT(LEFT(NEW.email, 2), '***@', SPLIT_PART(NEW.email, '@', 2))
    END;
    NEW.masked_phone := CASE
        WHEN NEW.phone IS NULL THEN NULL
        ELSE CONCAT(LEFT(NEW.phone, 3), '****', RIGHT(NEW.phone, 2))
    END;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mask_reseller_profile_contact ON public.reseller_profiles;
CREATE TRIGGER trg_mask_reseller_profile_contact
BEFORE INSERT OR UPDATE ON public.reseller_profiles
FOR EACH ROW EXECUTE FUNCTION public.mask_reseller_profile_contact();

CREATE OR REPLACE FUNCTION public.ensure_reseller_wallet(p_reseller_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_wallet_id UUID;
    v_tenant_id UUID;
BEGIN
    SELECT tenant_id INTO v_tenant_id FROM public.resellers WHERE id = p_reseller_id;

    INSERT INTO public.reseller_wallets (tenant_id, reseller_id)
    VALUES (v_tenant_id, p_reseller_id)
    ON CONFLICT (reseller_id) DO NOTHING;

    SELECT id INTO v_wallet_id
    FROM public.reseller_wallets
    WHERE reseller_id = p_reseller_id;

    RETURN v_wallet_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_reseller_notification(
    p_reseller_id UUID,
    p_user_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_event_type TEXT DEFAULT NULL,
    p_action_url TEXT DEFAULT NULL,
    p_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_notification_id UUID;
    v_tenant_id UUID;
    v_user_notification_id UUID;
BEGIN
    SELECT tenant_id INTO v_tenant_id FROM public.resellers WHERE id = p_reseller_id;

    INSERT INTO public.user_notifications (user_id, type, message, event_type, action_url, role_target)
    VALUES (p_user_id, p_type, p_message, p_event_type, p_action_url, ARRAY['reseller'])
    RETURNING id INTO v_user_notification_id;

    INSERT INTO public.reseller_notifications (
        tenant_id,
        reseller_id,
        user_notification_id,
        type,
        title,
        message,
        event_type,
        action_url,
        payload
    )
    VALUES (
        v_tenant_id,
        p_reseller_id,
        v_user_notification_id,
        p_type,
        p_title,
        p_message,
        p_event_type,
        p_action_url,
        COALESCE(p_payload, '{}'::jsonb)
    )
    RETURNING id INTO v_notification_id;

    RETURN v_notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.append_reseller_wallet_entry(
    p_reseller_id UUID,
    p_entry_type TEXT,
    p_amount NUMERIC,
    p_reference_type TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_wallet RECORD;
    v_ledger_id UUID;
    v_new_available NUMERIC(14,2);
    v_new_pending NUMERIC(14,2);
BEGIN
    IF p_amount IS NULL OR p_amount <= 0 THEN
        RAISE EXCEPTION 'Amount must be greater than zero';
    END IF;

    PERFORM public.ensure_reseller_wallet(p_reseller_id);

    SELECT * INTO v_wallet
    FROM public.reseller_wallets
    WHERE reseller_id = p_reseller_id
    FOR UPDATE;

    v_new_available := v_wallet.available_balance;
    v_new_pending := v_wallet.pending_balance;

    CASE p_entry_type
        WHEN 'commission', 'credit', 'adjustment' THEN
            v_new_available := v_new_available + p_amount;
        WHEN 'debit' THEN
            IF v_wallet.available_balance < p_amount THEN
                RAISE EXCEPTION 'Insufficient wallet balance';
            END IF;
            v_new_available := v_new_available - p_amount;
        WHEN 'payout_hold' THEN
            IF v_wallet.available_balance < p_amount THEN
                RAISE EXCEPTION 'Insufficient wallet balance';
            END IF;
            v_new_available := v_new_available - p_amount;
            v_new_pending := v_new_pending + p_amount;
        WHEN 'payout_release' THEN
            IF v_wallet.pending_balance < p_amount THEN
                RAISE EXCEPTION 'Insufficient pending payout balance';
            END IF;
            v_new_available := v_new_available + p_amount;
            v_new_pending := v_new_pending - p_amount;
        WHEN 'payout_complete' THEN
            IF v_wallet.pending_balance < p_amount THEN
                RAISE EXCEPTION 'Insufficient pending payout balance';
            END IF;
            v_new_pending := v_new_pending - p_amount;
        ELSE
            RAISE EXCEPTION 'Unsupported wallet entry type: %', p_entry_type;
    END CASE;

    UPDATE public.reseller_wallets
    SET available_balance = v_new_available,
        pending_balance = v_new_pending,
        total_credited = total_credited + CASE WHEN p_entry_type IN ('commission', 'credit', 'adjustment') THEN p_amount ELSE 0 END,
        total_debited = total_debited + CASE WHEN p_entry_type IN ('debit', 'payout_complete') THEN p_amount ELSE 0 END,
        total_commission = total_commission + CASE WHEN p_entry_type = 'commission' THEN p_amount ELSE 0 END,
        total_payout = total_payout + CASE WHEN p_entry_type = 'payout_complete' THEN p_amount ELSE 0 END,
        last_entry_at = now(),
        updated_at = now()
    WHERE id = v_wallet.id;

    INSERT INTO public.reseller_wallet_ledger (
        tenant_id,
        reseller_id,
        wallet_id,
        entry_type,
        amount,
        balance_after,
        pending_after,
        reference_type,
        reference_id,
        description,
        metadata
    )
    VALUES (
        v_wallet.tenant_id,
        p_reseller_id,
        v_wallet.id,
        p_entry_type,
        p_amount,
        v_new_available,
        v_new_pending,
        p_reference_type,
        p_reference_id,
        p_description,
        COALESCE(p_metadata, '{}'::jsonb)
    )
    RETURNING id INTO v_ledger_id;

    RETURN v_ledger_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_reseller_record(
    p_actor_user_id UUID,
    p_reseller_user_id UUID,
    p_business_name TEXT,
    p_owner_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_city TEXT DEFAULT NULL,
    p_state TEXT DEFAULT NULL,
    p_country TEXT DEFAULT 'India',
    p_franchise_id UUID DEFAULT NULL,
    p_commission_rate NUMERIC DEFAULT 15,
    p_tenant_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_reseller_id UUID;
    v_reseller_code TEXT;
    v_tenant_id UUID := COALESCE(p_tenant_id, p_actor_user_id);
BEGIN
    IF p_business_name IS NULL OR p_email IS NULL OR p_phone IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Missing required reseller fields');
    END IF;

    v_reseller_code := public.generate_reseller_code();

    INSERT INTO public.resellers (
        tenant_id,
        user_id,
        franchise_id,
        reseller_code,
        status,
        onboarding_stage,
        default_commission_rate,
        source,
        created_by
    )
    VALUES (
        v_tenant_id,
        p_reseller_user_id,
        p_franchise_id,
        v_reseller_code,
        'pending',
        'application',
        COALESCE(p_commission_rate, 15),
        'manager_created',
        p_actor_user_id
    )
    RETURNING id INTO v_reseller_id;

    INSERT INTO public.reseller_profiles (
        tenant_id,
        reseller_id,
        business_name,
        owner_name,
        email,
        phone,
        city,
        state,
        country,
        company_name
    )
    VALUES (
        v_tenant_id,
        v_reseller_id,
        p_business_name,
        COALESCE(p_owner_name, p_business_name),
        p_email,
        p_phone,
        p_city,
        p_state,
        COALESCE(p_country, 'India'),
        p_business_name
    );

    PERFORM public.ensure_reseller_wallet(v_reseller_id);

    INSERT INTO public.kyc_verifications (tenant_id, reseller_id, status)
    VALUES (v_tenant_id, v_reseller_id, 'pending');

    INSERT INTO public.agreements (tenant_id, reseller_id, agreement_type, status)
    VALUES (v_tenant_id, v_reseller_id, 'reseller_master', 'pending');

    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        p_actor_user_id,
        'reseller_created',
        'reseller_system',
        'reseller_manager',
        jsonb_build_object('reseller_id', v_reseller_id, 'reseller_code', v_reseller_code)
    );

    RETURN jsonb_build_object(
        'success', true,
        'reseller_id', v_reseller_id,
        'reseller_code', v_reseller_code
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.set_reseller_status(
    p_actor_user_id UUID,
    p_reseller_id UUID,
    p_status TEXT,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_reseller RECORD;
BEGIN
    SELECT * INTO v_reseller
    FROM public.resellers
    WHERE id = p_reseller_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Reseller not found');
    END IF;

    UPDATE public.resellers
    SET status = p_status,
        onboarding_stage = CASE WHEN p_status = 'active' THEN 'live' ELSE onboarding_stage END,
        approved_by = CASE WHEN p_status = 'active' THEN p_actor_user_id ELSE approved_by END,
        approved_at = CASE WHEN p_status = 'active' THEN now() ELSE approved_at END,
        suspended_at = CASE WHEN p_status = 'suspended' THEN now() ELSE suspended_at END,
        updated_at = now(),
        notes = COALESCE(p_reason, notes)
    WHERE id = p_reseller_id;

    INSERT INTO public.reseller_activity_logs (tenant_id, reseller_id, actor_user_id, action, entity_type, entity_id, meta_json)
    VALUES (v_reseller.tenant_id, p_reseller_id, p_actor_user_id, 'status_changed', 'reseller', p_reseller_id, jsonb_build_object('status', p_status, 'reason', p_reason));

    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (p_actor_user_id, 'reseller_status_changed', 'reseller_system', 'reseller_manager', jsonb_build_object('reseller_id', p_reseller_id, 'status', p_status, 'reason', p_reason));

    PERFORM public.create_reseller_notification(
        p_reseller_id,
        v_reseller.user_id,
        CASE WHEN p_status = 'active' THEN 'success' WHEN p_status = 'rejected' THEN 'danger' ELSE 'warning' END,
        'Approval status changed',
        'Your reseller account status is now ' || p_status,
        'approval_status_changed',
        '/reseller?tab=profile',
        jsonb_build_object('status', p_status, 'reason', p_reason)
    );

    RETURN jsonb_build_object('success', true, 'status', p_status);
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_reseller_product(
    p_actor_user_id UUID,
    p_reseller_id UUID,
    p_product_id UUID,
    p_commission_override NUMERIC DEFAULT NULL,
    p_pricing_override NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_reseller RECORD;
BEGIN
    SELECT * INTO v_reseller FROM public.resellers WHERE id = p_reseller_id AND deleted_at IS NULL;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Reseller not found');
    END IF;

    INSERT INTO public.reseller_products_map (
        tenant_id,
        reseller_id,
        product_id,
        assignment_status,
        commission_override,
        pricing_override,
        assigned_by
    )
    VALUES (
        v_reseller.tenant_id,
        p_reseller_id,
        p_product_id,
        'active',
        p_commission_override,
        p_pricing_override,
        p_actor_user_id
    )
    ON CONFLICT (reseller_id, product_id)
    DO UPDATE SET
        assignment_status = 'active',
        commission_override = COALESCE(EXCLUDED.commission_override, public.reseller_products_map.commission_override),
        pricing_override = COALESCE(EXCLUDED.pricing_override, public.reseller_products_map.pricing_override),
        assigned_by = EXCLUDED.assigned_by,
        deleted_at = NULL,
        updated_at = now();

    INSERT INTO public.reseller_activity_logs (tenant_id, reseller_id, actor_user_id, action, entity_type, entity_id, meta_json)
    VALUES (v_reseller.tenant_id, p_reseller_id, p_actor_user_id, 'product_assigned', 'product', p_product_id, jsonb_build_object('commission_override', p_commission_override, 'pricing_override', p_pricing_override));

    RETURN jsonb_build_object('success', true);
END;
$$;

CREATE OR REPLACE FUNCTION public.create_reseller_order(
    p_actor_user_id UUID,
    p_actor_role TEXT,
    p_reseller_id UUID,
    p_product_id UUID,
    p_client_id UUID DEFAULT NULL,
    p_payment_method TEXT DEFAULT 'bank_transfer',
    p_payment_status TEXT DEFAULT 'paid',
    p_sale_amount NUMERIC DEFAULT NULL,
    p_client_name TEXT DEFAULT NULL,
    p_client_email TEXT DEFAULT NULL,
    p_client_phone TEXT DEFAULT NULL,
    p_company_name TEXT DEFAULT NULL,
    p_requirements TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_reseller RECORD;
    v_product RECORD;
    v_assignment RECORD;
    v_client_id UUID := p_client_id;
    v_order_id UUID;
    v_order_number TEXT;
    v_sale_amount NUMERIC(14,2);
    v_commission_rate NUMERIC(5,2);
    v_commission_amount NUMERIC(14,2);
    v_ledger_id UUID;
    v_commission_id UUID;
BEGIN
    SELECT * INTO v_reseller
    FROM public.resellers
    WHERE id = p_reseller_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Reseller not found');
    END IF;

    IF p_actor_role = 'reseller' AND v_reseller.user_id IS DISTINCT FROM p_actor_user_id THEN
        RETURN jsonb_build_object('success', false, 'error', 'You cannot create orders for another reseller');
    END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE product_id = p_product_id
      AND COALESCE(is_active, true) = true;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product not found');
    END IF;

    SELECT * INTO v_assignment
    FROM public.reseller_products_map
    WHERE reseller_id = p_reseller_id
      AND product_id = p_product_id
      AND assignment_status = 'active'
      AND deleted_at IS NULL;

    IF p_actor_role = 'reseller' AND NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product is not assigned to this reseller');
    END IF;

    IF v_client_id IS NULL THEN
        IF p_client_name IS NULL THEN
            RETURN jsonb_build_object('success', false, 'error', 'Client details are required');
        END IF;

        INSERT INTO public.reseller_clients (
            tenant_id,
            reseller_id,
            full_name,
            email,
            phone,
            company_name,
            status
        )
        VALUES (
            v_reseller.tenant_id,
            p_reseller_id,
            p_client_name,
            p_client_email,
            p_client_phone,
            p_company_name,
            'active'
        )
        RETURNING id INTO v_client_id;
    END IF;

    v_sale_amount := COALESCE(p_sale_amount, v_assignment.pricing_override, v_product.lifetime_price, v_product.monthly_price, 0);

    IF v_sale_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Product sale amount is not configured');
    END IF;

    v_commission_rate := COALESCE(v_assignment.commission_override, v_reseller.default_commission_rate, 15);
    v_commission_amount := ROUND(v_sale_amount * (v_commission_rate / 100), 2);
    v_order_number := public.generate_reseller_order_number();

    INSERT INTO public.reseller_orders (
        tenant_id,
        reseller_id,
        client_id,
        product_id,
        order_number,
        source,
        gross_amount,
        net_amount,
        commission_amount,
        payment_method,
        payment_status,
        order_status,
        requirements
    )
    VALUES (
        v_reseller.tenant_id,
        p_reseller_id,
        v_client_id,
        p_product_id,
        v_order_number,
        CASE WHEN p_actor_role = 'reseller' THEN 'reseller_portal' ELSE 'manager_console' END,
        v_sale_amount,
        v_sale_amount,
        v_commission_amount,
        p_payment_method,
        p_payment_status,
        CASE WHEN p_payment_status = 'paid' THEN 'fulfilled' ELSE 'created' END,
        p_requirements
    )
    RETURNING id INTO v_order_id;

    IF p_payment_status = 'paid' THEN
        v_ledger_id := public.append_reseller_wallet_entry(
            p_reseller_id,
            'commission',
            v_commission_amount,
            'reseller_order',
            v_order_id,
            'Commission credited for order ' || v_order_number,
            jsonb_build_object('order_id', v_order_id)
        );
    END IF;

    INSERT INTO public.reseller_commissions (
        tenant_id,
        reseller_id,
        order_id,
        commission_type,
        base_amount,
        commission_rate,
        commission_amount,
        ledger_entry_id,
        status,
        paid_at
    )
    VALUES (
        v_reseller.tenant_id,
        p_reseller_id,
        v_order_id,
        'sale',
        v_sale_amount,
        v_commission_rate,
        v_commission_amount,
        v_ledger_id,
        CASE WHEN p_payment_status = 'paid' THEN 'credited' ELSE 'pending' END,
        CASE WHEN p_payment_status = 'paid' THEN now() ELSE NULL END
    )
    RETURNING id INTO v_commission_id;

    INSERT INTO public.reseller_activity_logs (tenant_id, reseller_id, actor_user_id, action, entity_type, entity_id, meta_json)
    VALUES (
        v_reseller.tenant_id,
        p_reseller_id,
        p_actor_user_id,
        'order_created',
        'order',
        v_order_id,
        jsonb_build_object('product_id', p_product_id, 'client_id', v_client_id, 'commission_amount', v_commission_amount)
    );

    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        p_actor_user_id,
        'reseller_order_created',
        'reseller_system',
        p_actor_role,
        jsonb_build_object('order_id', v_order_id, 'reseller_id', p_reseller_id, 'commission_id', v_commission_id)
    );

    INSERT INTO public.transaction_monitoring (
        user_id,
        transaction_id,
        amount,
        transaction_type,
        risk_score,
        status,
        metadata
    )
    VALUES (
        v_reseller.user_id,
        v_order_id,
        v_sale_amount,
        'reseller_sale',
        CASE WHEN v_sale_amount >= 250000 THEN 65 ELSE 15 END,
        'monitored',
        jsonb_build_object('reseller_id', p_reseller_id, 'order_number', v_order_number)
    );

    IF v_sale_amount >= 500000 THEN
        INSERT INTO public.fraud_alerts (user_id, type, severity, flagged_by_ai, status)
        VALUES (v_reseller.user_id, 'reseller_large_sale', 'medium', true, 'open');
    END IF;

    PERFORM public.create_reseller_notification(
        p_reseller_id,
        v_reseller.user_id,
        'success',
        'Order placed',
        'Order ' || v_order_number || ' has been recorded successfully.',
        'order_placed',
        '/reseller?tab=orders',
        jsonb_build_object('order_id', v_order_id, 'commission_amount', v_commission_amount)
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'commission_id', v_commission_id,
        'commission_amount', v_commission_amount
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_reseller_commission(
    p_actor_user_id UUID,
    p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_order RECORD;
    v_commission RECORD;
    v_ledger_id UUID;
BEGIN
    SELECT * INTO v_order
    FROM public.reseller_orders
    WHERE id = p_order_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found');
    END IF;

    SELECT * INTO v_commission
    FROM public.reseller_commissions
    WHERE order_id = p_order_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF v_order.payment_status <> 'paid' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Commission can only be applied to paid orders');
    END IF;

    IF FOUND AND v_commission.status = 'credited' THEN
        RETURN jsonb_build_object('success', true, 'commission_id', v_commission.id, 'already_credited', true);
    END IF;

    v_ledger_id := public.append_reseller_wallet_entry(
        v_order.reseller_id,
        'commission',
        v_order.commission_amount,
        'reseller_order',
        p_order_id,
        'Commission applied for order ' || v_order.order_number,
        jsonb_build_object('order_id', p_order_id)
    );

    UPDATE public.reseller_commissions
    SET status = 'credited',
        ledger_entry_id = v_ledger_id,
        approved_by = p_actor_user_id,
        approved_at = now(),
        paid_at = now(),
        updated_at = now()
    WHERE order_id = p_order_id;

    RETURN jsonb_build_object('success', true, 'ledger_entry_id', v_ledger_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_reseller_wallet(
    p_actor_user_id UUID,
    p_reseller_id UUID,
    p_entry_type TEXT,
    p_amount NUMERIC,
    p_reason TEXT,
    p_reference_type TEXT DEFAULT 'manual_adjustment',
    p_reference_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_ledger_id UUID;
BEGIN
    v_ledger_id := public.append_reseller_wallet_entry(
        p_reseller_id,
        p_entry_type,
        p_amount,
        p_reference_type,
        p_reference_id,
        p_reason,
        jsonb_build_object('actor_user_id', p_actor_user_id)
    );

    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (p_actor_user_id, 'reseller_wallet_updated', 'reseller_system', 'finance_manager', jsonb_build_object('reseller_id', p_reseller_id, 'entry_type', p_entry_type, 'amount', p_amount, 'ledger_entry_id', v_ledger_id));

    RETURN jsonb_build_object('success', true, 'ledger_entry_id', v_ledger_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.request_reseller_payout(
    p_actor_user_id UUID,
    p_amount NUMERIC,
    p_payout_method TEXT,
    p_bank_details JSONB DEFAULT '{}'::jsonb,
    p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_reseller RECORD;
    v_payout_id UUID := gen_random_uuid();
    v_payout_number TEXT;
    v_net_amount NUMERIC(14,2);
BEGIN
    SELECT * INTO v_reseller
    FROM public.resellers
    WHERE user_id = p_actor_user_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Reseller account not found');
    END IF;

    IF p_amount IS NULL OR p_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'error', 'Payout amount must be greater than zero');
    END IF;

    v_payout_number := public.generate_reseller_payout_number();
    v_net_amount := p_amount;

    INSERT INTO public.reseller_payouts (
        id,
        tenant_id,
        reseller_id,
        payout_number,
        amount,
        net_amount,
        payout_method,
        payout_status,
        bank_details,
        requested_by,
        notes
    )
    VALUES (
        v_payout_id,
        v_reseller.tenant_id,
        v_reseller.id,
        v_payout_number,
        p_amount,
        v_net_amount,
        p_payout_method,
        'requested',
        COALESCE(p_bank_details, '{}'::jsonb),
        p_actor_user_id,
        p_note
    );

    PERFORM public.append_reseller_wallet_entry(
        v_reseller.id,
        'payout_hold',
        p_amount,
        'reseller_payout',
        v_payout_id,
        'Payout requested ' || v_payout_number,
        jsonb_build_object('payout_id', v_payout_id)
    );

    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (p_actor_user_id, 'reseller_payout_requested', 'reseller_system', 'reseller', jsonb_build_object('payout_id', v_payout_id, 'amount', p_amount));

    PERFORM public.create_reseller_notification(
        v_reseller.id,
        v_reseller.user_id,
        'warning',
        'Payout requested',
        'Your payout request ' || v_payout_number || ' is awaiting processing.',
        'payout_requested',
        '/reseller?tab=wallet',
        jsonb_build_object('payout_id', v_payout_id)
    );

    RETURN jsonb_build_object('success', true, 'payout_id', v_payout_id, 'payout_number', v_payout_number);
END;
$$;

CREATE OR REPLACE FUNCTION public.process_reseller_payout(
    p_actor_user_id UUID,
    p_payout_id UUID,
    p_action TEXT,
    p_note TEXT DEFAULT NULL,
    p_transaction_reference TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_payout RECORD;
    v_reseller RECORD;
BEGIN
    SELECT * INTO v_payout
    FROM public.reseller_payouts
    WHERE id = p_payout_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Payout request not found');
    END IF;

    SELECT * INTO v_reseller FROM public.resellers WHERE id = v_payout.reseller_id;

    IF p_action = 'completed' THEN
        PERFORM public.append_reseller_wallet_entry(
            v_payout.reseller_id,
            'payout_complete',
            v_payout.amount,
            'reseller_payout',
            p_payout_id,
            'Payout completed ' || v_payout.payout_number,
            jsonb_build_object('transaction_reference', p_transaction_reference)
        );

        UPDATE public.reseller_payouts
        SET payout_status = 'completed',
            processed_by = p_actor_user_id,
            processed_at = now(),
            transaction_reference = p_transaction_reference,
            notes = COALESCE(p_note, notes),
            updated_at = now()
        WHERE id = p_payout_id;
    ELSIF p_action = 'rejected' THEN
        PERFORM public.append_reseller_wallet_entry(
            v_payout.reseller_id,
            'payout_release',
            v_payout.amount,
            'reseller_payout',
            p_payout_id,
            'Payout rejected ' || v_payout.payout_number,
            jsonb_build_object('reason', p_note)
        );

        UPDATE public.reseller_payouts
        SET payout_status = 'rejected',
            processed_by = p_actor_user_id,
            processed_at = now(),
            notes = COALESCE(p_note, notes),
            updated_at = now()
        WHERE id = p_payout_id;
    ELSE
        UPDATE public.reseller_payouts
        SET payout_status = 'approved',
            processed_by = p_actor_user_id,
            processed_at = now(),
            notes = COALESCE(p_note, notes),
            updated_at = now()
        WHERE id = p_payout_id;
    END IF;

    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (p_actor_user_id, 'reseller_payout_processed', 'reseller_system', 'finance_manager', jsonb_build_object('payout_id', p_payout_id, 'action', p_action));

    PERFORM public.create_reseller_notification(
        v_reseller.id,
        v_reseller.user_id,
        CASE WHEN p_action = 'rejected' THEN 'danger' ELSE 'success' END,
        'Payout status updated',
        'Your payout request ' || v_payout.payout_number || ' is now ' || p_action || '.',
        'payout_status_changed',
        '/reseller?tab=wallet',
        jsonb_build_object('payout_id', p_payout_id, 'action', p_action)
    );

    RETURN jsonb_build_object('success', true, 'action', p_action);
END;
$$;

DROP POLICY IF EXISTS "Resellers view own resellers" ON public.resellers;
CREATE POLICY "Resellers view own reseller row" ON public.resellers
FOR SELECT USING (user_id = auth.uid() OR can_manage_reseller_system(auth.uid()));

DROP POLICY IF EXISTS "Managers update resellers" ON public.resellers;
CREATE POLICY "Managers update resellers" ON public.resellers
FOR ALL USING (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own profile" ON public.reseller_profiles
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers update own profile" ON public.reseller_profiles
FOR UPDATE USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own wallet" ON public.reseller_wallets
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Finance manage reseller wallet" ON public.reseller_wallets
FOR ALL USING (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own wallet ledger" ON public.reseller_wallet_ledger
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers insert reseller wallet ledger" ON public.reseller_wallet_ledger
FOR INSERT WITH CHECK (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers manage own clients" ON public.reseller_clients
FOR ALL USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view product assignments" ON public.reseller_products_map
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers manage product assignments" ON public.reseller_products_map
FOR ALL USING (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers manage own orders" ON public.reseller_orders
FOR ALL USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own commissions v2" ON public.reseller_commissions
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers manage commissions v2" ON public.reseller_commissions
FOR ALL USING (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own payouts v2" ON public.reseller_payouts
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers insert own payouts v2" ON public.reseller_payouts
FOR INSERT WITH CHECK (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers manage payouts v2" ON public.reseller_payouts
FOR ALL USING (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own notifications v2" ON public.reseller_notifications
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers update own notifications v2" ON public.reseller_notifications
FOR UPDATE USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers insert notifications v2" ON public.reseller_notifications
FOR INSERT WITH CHECK (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own activity logs" ON public.reseller_activity_logs
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "System inserts activity logs" ON public.reseller_activity_logs
FOR INSERT WITH CHECK (true);

CREATE POLICY "Resellers view own kyc" ON public.kyc_verifications
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers manage kyc" ON public.kyc_verifications
FOR ALL USING (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own agreements" ON public.agreements
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers manage agreements" ON public.agreements
FOR ALL USING (can_manage_reseller_system(auth.uid()));

CREATE POLICY "Resellers view own territories" ON public.territory_mapping
FOR SELECT USING (reseller_id = get_reseller_system_id(auth.uid()) OR can_manage_reseller_system(auth.uid()));

CREATE POLICY "Managers manage territories v2" ON public.territory_mapping
FOR ALL USING (can_manage_reseller_system(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.reseller_notifications;

DROP TRIGGER IF EXISTS update_resellers_updated_at ON public.resellers;
CREATE TRIGGER update_resellers_updated_at BEFORE UPDATE ON public.resellers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_reseller_profiles_updated_at ON public.reseller_profiles;
CREATE TRIGGER update_reseller_profiles_updated_at BEFORE UPDATE ON public.reseller_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_reseller_wallets_updated_at ON public.reseller_wallets;
CREATE TRIGGER update_reseller_wallets_updated_at BEFORE UPDATE ON public.reseller_wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_reseller_clients_updated_at ON public.reseller_clients;
CREATE TRIGGER update_reseller_clients_updated_at BEFORE UPDATE ON public.reseller_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_reseller_products_map_updated_at ON public.reseller_products_map;
CREATE TRIGGER update_reseller_products_map_updated_at BEFORE UPDATE ON public.reseller_products_map FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_reseller_orders_updated_at ON public.reseller_orders;
CREATE TRIGGER update_reseller_orders_updated_at BEFORE UPDATE ON public.reseller_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_reseller_commissions_updated_at ON public.reseller_commissions;
CREATE TRIGGER update_reseller_commissions_updated_at BEFORE UPDATE ON public.reseller_commissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_reseller_payouts_updated_at ON public.reseller_payouts;
CREATE TRIGGER update_reseller_payouts_updated_at BEFORE UPDATE ON public.reseller_payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_kyc_verifications_updated_at ON public.kyc_verifications;
CREATE TRIGGER update_kyc_verifications_updated_at BEFORE UPDATE ON public.kyc_verifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_agreements_updated_at ON public.agreements;
CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON public.agreements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_territory_mapping_updated_at ON public.territory_mapping;
CREATE TRIGGER update_territory_mapping_updated_at BEFORE UPDATE ON public.territory_mapping FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
    IF to_regclass('public.reseller_accounts') IS NOT NULL THEN
        INSERT INTO public.resellers (
            id,
            tenant_id,
            user_id,
            franchise_id,
            reseller_code,
            status,
            onboarding_stage,
            default_commission_rate,
            kyc_status,
            source,
            created_at,
            updated_at
        )
        SELECT
            ra.id,
            COALESCE(ra.franchise_id, ra.user_id),
            ra.user_id,
            ra.franchise_id,
            COALESCE(ra.reseller_code, public.generate_reseller_code()),
            CASE WHEN ra.status = 'inactive' THEN 'inactive' ELSE COALESCE(ra.status, 'pending') END,
            CASE WHEN ra.status = 'active' THEN 'live' ELSE 'application' END,
            COALESCE(ra.commission_rate, 15),
            CASE WHEN ra.kyc_status = 'verified' THEN 'verified' ELSE COALESCE(ra.kyc_status, 'pending') END,
            'legacy_backfill',
            COALESCE(ra.created_at, now()),
            COALESCE(ra.updated_at, now())
        FROM public.reseller_accounts ra
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.reseller_profiles (
            tenant_id,
            reseller_id,
            business_name,
            legal_name,
            owner_name,
            email,
            phone,
            company_name,
            city,
            state,
            country,
            postal_code,
            created_at,
            updated_at
        )
        SELECT
            COALESCE(ra.franchise_id, ra.user_id),
            ra.id,
            COALESCE(ra.full_name, 'Legacy Reseller'),
            ra.full_name,
            ra.full_name,
            ra.email,
            ra.phone,
            ra.full_name,
            ra.city,
            ra.state,
            COALESCE(ra.country, 'India'),
            ra.pincode,
            COALESCE(ra.created_at, now()),
            COALESCE(ra.updated_at, now())
        FROM public.reseller_accounts ra
        ON CONFLICT (reseller_id) DO NOTHING;
    END IF;

    IF to_regclass('public.reseller_wallet') IS NOT NULL THEN
        INSERT INTO public.reseller_wallets (
            id,
            tenant_id,
            reseller_id,
            available_balance,
            pending_balance,
            total_credited,
            total_debited,
            total_commission,
            total_payout,
            created_at,
            updated_at
        )
        SELECT
            rw.id,
            r.tenant_id,
            rw.reseller_id,
            COALESCE(rw.available_balance, 0),
            COALESCE(rw.pending_balance, 0),
            COALESCE(rw.total_earned, 0),
            COALESCE(rw.total_withdrawn, 0),
            COALESCE(rw.total_earned, 0),
            COALESCE(rw.total_withdrawn, 0),
            COALESCE(rw.created_at, now()),
            COALESCE(rw.updated_at, now())
        FROM public.reseller_wallet rw
        JOIN public.resellers r ON r.id = rw.reseller_id
        ON CONFLICT (reseller_id) DO NOTHING;
    END IF;

    IF to_regclass('public.reseller_territory_map') IS NOT NULL THEN
        INSERT INTO public.territory_mapping (
            tenant_id,
            reseller_id,
            franchise_id,
            territory_type,
            territory_code,
            territory_name,
            is_primary,
            effective_from,
            created_at,
            updated_at
        )
        SELECT
            r.tenant_id,
            rtm.reseller_id,
            rtm.franchise_id,
            rtm.territory_type,
            rtm.territory_code,
            rtm.territory_name,
            COALESCE(rtm.is_primary, false),
            COALESCE(rtm.assigned_at, now()),
            COALESCE(rtm.created_at, now()),
            COALESCE(rtm.created_at, now())
        FROM public.reseller_territory_map rtm
        JOIN public.resellers r ON r.id = rtm.reseller_id
        ON CONFLICT DO NOTHING;
    END IF;
END $$;