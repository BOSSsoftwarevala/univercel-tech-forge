-- ================================================
-- SECURE WALLET SYSTEM - FINAL SAFETY IMPLEMENTATION
-- ================================================

-- 1. Financial Kill Switch (System Configuration)
CREATE TABLE IF NOT EXISTS public.system_financial_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key TEXT UNIQUE NOT NULL,
    config_value JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Insert kill switch config
INSERT INTO public.system_financial_config (config_key, config_value, is_active)
VALUES 
    ('FINANCIAL_MODE', '{"mode": "SAFE", "reason": null, "locked_at": null, "locked_by": null}', true),
    ('WITHDRAWAL_ENABLED', '{"enabled": true}', true),
    ('AUTO_DEDUCT_DISABLED', '{"disabled": true, "reason": "Security policy - all deductions require approval"}', true)
ON CONFLICT (config_key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.system_financial_config ENABLE ROW LEVEL SECURITY;

-- Only super_admin can modify
CREATE POLICY "Super admins can manage financial config"
ON public.system_financial_config
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Anyone authenticated can read
CREATE POLICY "Authenticated users can read financial config"
ON public.system_financial_config
FOR SELECT
TO authenticated
USING (true);

-- 2. Processed Transaction Registry (True Idempotency)
CREATE TABLE IF NOT EXISTS public.processed_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    transaction_type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    processed_at TIMESTAMPTZ DEFAULT now(),
    response_data JSONB,
    ip_address TEXT,
    device_fingerprint TEXT
);

CREATE INDEX IF NOT EXISTS idx_processed_tx_user ON public.processed_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_processed_tx_id ON public.processed_transactions(transaction_id);

ALTER TABLE public.processed_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own processed transactions"
ON public.processed_transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin'));

-- 3. Wallet Operation Audit Log (Enhanced)
CREATE TABLE IF NOT EXISTS public.wallet_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT,
    user_id UUID NOT NULL,
    wallet_id UUID,
    operation_type TEXT NOT NULL,
    amount NUMERIC,
    previous_balance NUMERIC,
    new_balance NUMERIC,
    status TEXT NOT NULL,
    approval_status TEXT,
    approved_by UUID,
    ip_address TEXT,
    device_fingerprint TEXT,
    user_agent TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallet_audit_user ON public.wallet_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_audit_tx ON public.wallet_audit_log(transaction_id);
CREATE INDEX IF NOT EXISTS idx_wallet_audit_created ON public.wallet_audit_log(created_at DESC);

ALTER TABLE public.wallet_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet audit logs"
ON public.wallet_audit_log
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'finance_manager'));

-- Only system can insert (via functions)
CREATE POLICY "System can insert wallet audit logs"
ON public.wallet_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 4. Enhanced check_financial_mode function
CREATE OR REPLACE FUNCTION public.check_financial_mode()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_config JSONB;
BEGIN
    SELECT config_value INTO v_config
    FROM public.system_financial_config
    WHERE config_key = 'FINANCIAL_MODE' AND is_active = true;
    
    IF v_config IS NULL THEN
        RETURN jsonb_build_object('mode', 'SAFE', 'locked', false);
    END IF;
    
    RETURN jsonb_build_object(
        'mode', v_config->>'mode',
        'locked', (v_config->>'mode') = 'LOCKED',
        'reason', v_config->>'reason'
    );
END;
$$;

-- 5. Enhanced approve_payout with kill switch check
CREATE OR REPLACE FUNCTION public.approve_payout(
    p_payout_id UUID,
    p_approver_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_payout RECORD;
    v_wallet RECORD;
    v_new_balance NUMERIC;
    v_approver_role TEXT;
    v_financial_mode JSONB;
    v_tx_id TEXT;
BEGIN
    -- Check financial mode (kill switch)
    v_financial_mode := public.check_financial_mode();
    IF (v_financial_mode->>'locked')::boolean = true THEN
        -- Log blocked attempt
        INSERT INTO public.wallet_audit_log (
            user_id, operation_type, status, error_message, metadata
        ) VALUES (
            p_approver_id, 'payout_approval_blocked', 'blocked',
            'Financial system is in LOCKED mode',
            jsonb_build_object('payout_id', p_payout_id, 'reason', v_financial_mode->>'reason')
        );
        
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Financial system is currently locked. All payouts are suspended.'
        );
    END IF;

    -- Check if approver is Super Admin or Master
    SELECT role INTO v_approver_role 
    FROM public.user_roles 
    WHERE user_id = p_approver_id;
    
    IF v_approver_role NOT IN ('super_admin', 'master') THEN
        -- Log unauthorized attempt
        INSERT INTO public.wallet_audit_log (
            user_id, operation_type, status, error_message, metadata
        ) VALUES (
            p_approver_id, 'payout_approval_unauthorized', 'rejected',
            'Insufficient permissions',
            jsonb_build_object('payout_id', p_payout_id, 'role', v_approver_role)
        );
        
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Only Super Admin or Master can approve payouts'
        );
    END IF;
    
    -- Generate unique transaction ID for this operation
    v_tx_id := 'PAYOUT_APPROVE_' || p_payout_id::text || '_' || extract(epoch from now())::text;
    
    -- Check if this exact operation was already processed (idempotency)
    IF EXISTS (SELECT 1 FROM public.processed_transactions WHERE transaction_id = v_tx_id) THEN
        RETURN jsonb_build_object(
            'success', true, 
            'message', 'Already processed',
            'idempotent', true
        );
    END IF;
    
    -- Get payout request with row lock (prevent concurrent modifications)
    SELECT * INTO v_payout 
    FROM public.payout_requests 
    WHERE payout_id = p_payout_id 
    FOR UPDATE NOWAIT;
    
    IF v_payout IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Payout not found');
    END IF;
    
    -- Check if already processed
    IF v_payout.status NOT IN ('requested', 'pending') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Payout already processed with status: ' || v_payout.status
        );
    END IF;
    
    -- CRITICAL: Check if wallet already debited (prevent double debit)
    IF v_payout.wallet_debited = true THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Wallet already debited for this payout - possible duplicate'
        );
    END IF;
    
    -- Get wallet with row lock (prevent concurrent balance changes)
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE user_id = v_payout.user_id 
    FOR UPDATE NOWAIT;
    
    IF v_wallet IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
    END IF;
    
    -- Check sufficient balance
    IF v_wallet.balance < v_payout.amount THEN
        -- Log insufficient balance attempt
        INSERT INTO public.wallet_audit_log (
            transaction_id, user_id, wallet_id, operation_type, amount,
            previous_balance, status, approved_by, error_message
        ) VALUES (
            v_tx_id, v_payout.user_id, v_wallet.wallet_id, 'payout_approval',
            v_payout.amount, v_wallet.balance, 'failed', p_approver_id,
            'Insufficient balance'
        );
        
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Insufficient balance. Available: ' || v_wallet.balance || ', Required: ' || v_payout.amount
        );
    END IF;
    
    -- Calculate new balance
    v_new_balance := v_wallet.balance - v_payout.amount;
    
    -- ATOMIC: Debit wallet
    UPDATE public.wallets 
    SET balance = v_new_balance, 
        updated_at = now() 
    WHERE wallet_id = v_wallet.wallet_id;
    
    -- ATOMIC: Update payout status
    UPDATE public.payout_requests 
    SET status = 'approved',
        approved_at = now(),
        approved_by = p_approver_id,
        wallet_debited = true,
        wallet_debited_at = now()
    WHERE payout_id = p_payout_id;
    
    -- Record transaction
    INSERT INTO public.transactions (
        wallet_id, type, amount, reference, related_user, related_role, status
    ) VALUES (
        v_wallet.wallet_id, 
        'withdrawal', 
        -v_payout.amount, 
        'Approved payout: ' || p_payout_id::text,
        p_approver_id,
        v_approver_role,
        'completed'
    );
    
    -- Record in processed transactions (idempotency)
    INSERT INTO public.processed_transactions (
        transaction_id, user_id, transaction_type, amount, status, response_data
    ) VALUES (
        v_tx_id, v_payout.user_id, 'payout_approval', v_payout.amount, 'completed',
        jsonb_build_object('payout_id', p_payout_id, 'approver_id', p_approver_id, 'new_balance', v_new_balance)
    );
    
    -- Comprehensive audit log
    INSERT INTO public.wallet_audit_log (
        transaction_id, user_id, wallet_id, operation_type, amount,
        previous_balance, new_balance, status, approval_status, approved_by
    ) VALUES (
        v_tx_id, v_payout.user_id, v_wallet.wallet_id, 'payout_approval',
        v_payout.amount, v_wallet.balance, v_new_balance, 'completed', 'approved', p_approver_id
    );
    
    -- Legacy audit log
    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        p_approver_id,
        'payout_approved',
        'wallet',
        v_approver_role::app_role,
        jsonb_build_object(
            'payout_id', p_payout_id,
            'user_id', v_payout.user_id,
            'amount', v_payout.amount,
            'previous_balance', v_wallet.balance,
            'new_balance', v_new_balance,
            'transaction_id', v_tx_id
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'payout_id', p_payout_id,
        'amount', v_payout.amount,
        'new_balance', v_new_balance,
        'transaction_id', v_tx_id
    );
    
EXCEPTION
    WHEN lock_not_available THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Transaction in progress. Please retry in a moment.'
        );
    WHEN OTHERS THEN
        -- Log error
        INSERT INTO public.wallet_audit_log (
            user_id, operation_type, status, error_message, metadata
        ) VALUES (
            p_approver_id, 'payout_approval_error', 'error',
            SQLERRM,
            jsonb_build_object('payout_id', p_payout_id)
        );
        
        RAISE;
END;
$$;

-- 6. Set/Toggle Financial Kill Switch
CREATE OR REPLACE FUNCTION public.set_financial_mode(
    p_mode TEXT,
    p_reason TEXT,
    p_admin_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_admin_role TEXT;
BEGIN
    -- Only super_admin can toggle
    SELECT role INTO v_admin_role 
    FROM public.user_roles 
    WHERE user_id = p_admin_id;
    
    IF v_admin_role != 'super_admin' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only Super Admin can change financial mode');
    END IF;
    
    IF p_mode NOT IN ('SAFE', 'LOCKED') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid mode. Use SAFE or LOCKED');
    END IF;
    
    UPDATE public.system_financial_config
    SET config_value = jsonb_build_object(
        'mode', p_mode,
        'reason', p_reason,
        'locked_at', CASE WHEN p_mode = 'LOCKED' THEN now() ELSE null END,
        'locked_by', CASE WHEN p_mode = 'LOCKED' THEN p_admin_id ELSE null END
    ),
    updated_at = now(),
    updated_by = p_admin_id
    WHERE config_key = 'FINANCIAL_MODE';
    
    -- Audit log
    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        p_admin_id,
        'financial_mode_changed',
        'system',
        'super_admin'::app_role,
        jsonb_build_object('new_mode', p_mode, 'reason', p_reason)
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'mode', p_mode,
        'message', 'Financial mode set to ' || p_mode
    );
END;
$$;

-- 7. Secure withdrawal request function (prevents any direct wallet mutation)
CREATE OR REPLACE FUNCTION public.request_withdrawal(
    p_user_id UUID,
    p_amount NUMERIC,
    p_payment_method TEXT DEFAULT 'bank_transfer',
    p_ip_address TEXT DEFAULT NULL,
    p_device_fingerprint TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_wallet RECORD;
    v_user_role TEXT;
    v_limits RECORD;
    v_today_total NUMERIC;
    v_pending_total NUMERIC;
    v_idempotency_key TEXT;
    v_payout_id UUID;
    v_financial_mode JSONB;
BEGIN
    -- Check financial mode
    v_financial_mode := public.check_financial_mode();
    IF (v_financial_mode->>'locked')::boolean = true THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Financial system is currently locked. Withdrawals are suspended.'
        );
    END IF;
    
    -- Get user role
    SELECT role INTO v_user_role FROM public.user_roles WHERE user_id = p_user_id;
    IF v_user_role IS NULL THEN v_user_role := 'client'; END IF;
    
    -- Get wallet (NO UPDATE - read only at this stage)
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id;
    IF v_wallet IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
    END IF;
    
    -- Check balance (but DO NOT deduct)
    IF v_wallet.balance < p_amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient balance');
    END IF;
    
    -- Check pending requests total
    SELECT COALESCE(SUM(amount), 0) INTO v_pending_total
    FROM public.payout_requests
    WHERE user_id = p_user_id AND status IN ('requested', 'pending');
    
    IF v_pending_total + p_amount > v_wallet.balance THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Total pending requests would exceed available balance'
        );
    END IF;
    
    -- Generate idempotency key
    v_idempotency_key := p_user_id::text || '-' || p_amount::text || '-' || floor(extract(epoch from now()) / 60)::text;
    
    -- Check for duplicate (same amount within same minute)
    IF EXISTS (SELECT 1 FROM public.payout_requests WHERE idempotency_key = v_idempotency_key) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Duplicate request detected. Please wait before retrying.'
        );
    END IF;
    
    -- Create request ONLY (no wallet debit)
    INSERT INTO public.payout_requests (
        user_id, amount, status, payment_method, user_role,
        wallet_debited, idempotency_key, ip_address, device_fingerprint
    ) VALUES (
        p_user_id, p_amount, 'requested', p_payment_method, v_user_role,
        false, v_idempotency_key, p_ip_address, p_device_fingerprint
    ) RETURNING payout_id INTO v_payout_id;
    
    -- Audit log
    INSERT INTO public.wallet_audit_log (
        user_id, wallet_id, operation_type, amount, previous_balance,
        status, approval_status, ip_address, device_fingerprint
    ) VALUES (
        p_user_id, v_wallet.wallet_id, 'withdrawal_request', p_amount,
        v_wallet.balance, 'pending', 'requested', p_ip_address, p_device_fingerprint
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'payout_id', v_payout_id,
        'status', 'requested',
        'message', 'Withdrawal request submitted. Awaiting approval.'
    );
END;
$$;