-- Add approval tracking columns to payout_requests
ALTER TABLE public.payout_requests 
ADD COLUMN IF NOT EXISTS requested_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS user_role TEXT,
ADD COLUMN IF NOT EXISTS wallet_debited BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS wallet_debited_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;

-- Create index for preventing duplicates
CREATE INDEX IF NOT EXISTS idx_payout_requests_user_status 
ON public.payout_requests(user_id, status, amount);

-- Create index for idempotency
CREATE INDEX IF NOT EXISTS idx_payout_requests_idempotency 
ON public.payout_requests(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Update status check constraint
ALTER TABLE public.payout_requests DROP CONSTRAINT IF EXISTS payout_requests_status_check;
ALTER TABLE public.payout_requests ADD CONSTRAINT payout_requests_status_check 
CHECK (status IN ('requested', 'pending', 'approved', 'rejected', 'processing', 'completed', 'failed'));

-- Set existing 'pending' records to 'requested' (new flow)
UPDATE public.payout_requests SET status = 'requested' WHERE status = 'pending';

-- Create function to approve payout (Super Admin/Master only)
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
BEGIN
    -- Check if approver is Super Admin or Master
    SELECT role INTO v_approver_role 
    FROM public.user_roles 
    WHERE user_id = p_approver_id;
    
    IF v_approver_role NOT IN ('super_admin', 'master') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Only Super Admin or Master can approve payouts'
        );
    END IF;
    
    -- Get payout request with row lock
    SELECT * INTO v_payout 
    FROM public.payout_requests 
    WHERE payout_id = p_payout_id 
    FOR UPDATE;
    
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
    
    -- Check if wallet already debited (prevent double debit)
    IF v_payout.wallet_debited = true THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Wallet already debited for this payout'
        );
    END IF;
    
    -- Get wallet with row lock
    SELECT * INTO v_wallet 
    FROM public.wallets 
    WHERE user_id = v_payout.user_id 
    FOR UPDATE;
    
    IF v_wallet IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Wallet not found');
    END IF;
    
    -- Check sufficient balance
    IF v_wallet.balance < v_payout.amount THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Insufficient balance. Available: ' || v_wallet.balance || ', Required: ' || v_payout.amount
        );
    END IF;
    
    -- Debit wallet
    v_new_balance := v_wallet.balance - v_payout.amount;
    
    UPDATE public.wallets 
    SET balance = v_new_balance, 
        updated_at = now() 
    WHERE wallet_id = v_wallet.wallet_id;
    
    -- Update payout status
    UPDATE public.payout_requests 
    SET status = 'approved',
        approved_at = now(),
        approved_by = p_approver_id,
        wallet_debited = true,
        wallet_debited_at = now()
    WHERE payout_id = p_payout_id;
    
    -- Log transaction
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
    
    -- Audit log
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
            'new_balance', v_new_balance
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'payout_id', p_payout_id,
        'amount', v_payout.amount,
        'new_balance', v_new_balance
    );
END;
$$;

-- Create function to reject payout (Super Admin/Master only)
CREATE OR REPLACE FUNCTION public.reject_payout(
    p_payout_id UUID,
    p_rejector_id UUID,
    p_reason TEXT DEFAULT 'Rejected by admin'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_payout RECORD;
    v_wallet RECORD;
    v_rejector_role TEXT;
BEGIN
    -- Check if rejector is Super Admin or Master
    SELECT role INTO v_rejector_role 
    FROM public.user_roles 
    WHERE user_id = p_rejector_id;
    
    IF v_rejector_role NOT IN ('super_admin', 'master') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'error', 'Only Super Admin or Master can reject payouts'
        );
    END IF;
    
    -- Get payout request with row lock
    SELECT * INTO v_payout 
    FROM public.payout_requests 
    WHERE payout_id = p_payout_id 
    FOR UPDATE;
    
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
    
    -- If wallet was somehow debited, restore funds
    IF v_payout.wallet_debited = true THEN
        SELECT * INTO v_wallet 
        FROM public.wallets 
        WHERE user_id = v_payout.user_id 
        FOR UPDATE;
        
        IF v_wallet IS NOT NULL THEN
            UPDATE public.wallets 
            SET balance = v_wallet.balance + v_payout.amount, 
                updated_at = now() 
            WHERE wallet_id = v_wallet.wallet_id;
            
            -- Log refund transaction
            INSERT INTO public.transactions (
                wallet_id, type, amount, reference, related_user, related_role, status
            ) VALUES (
                v_wallet.wallet_id, 
                'refund', 
                v_payout.amount, 
                'Rejected payout refund: ' || p_payout_id::text,
                p_rejector_id,
                v_rejector_role,
                'completed'
            );
        END IF;
    END IF;
    
    -- Update payout status
    UPDATE public.payout_requests 
    SET status = 'rejected',
        rejected_at = now(),
        rejected_by = p_rejector_id,
        rejection_reason = p_reason
    WHERE payout_id = p_payout_id;
    
    -- Audit log
    INSERT INTO public.audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        p_rejector_id,
        'payout_rejected',
        'wallet',
        v_rejector_role::app_role,
        jsonb_build_object(
            'payout_id', p_payout_id,
            'user_id', v_payout.user_id,
            'amount', v_payout.amount,
            'reason', p_reason,
            'wallet_restored', v_payout.wallet_debited
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'payout_id', p_payout_id,
        'amount', v_payout.amount,
        'reason', p_reason
    );
END;
$$;

-- Create function to check for duplicate withdrawal requests
CREATE OR REPLACE FUNCTION public.has_pending_withdrawal(
    p_user_id UUID,
    p_amount NUMERIC
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.payout_requests
        WHERE user_id = p_user_id
        AND amount = p_amount
        AND status IN ('requested', 'pending')
        AND timestamp > now() - interval '24 hours'
    )
$$;

-- RLS policies for payout_requests
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own payout requests
CREATE POLICY "Users can view own payouts" ON public.payout_requests
FOR SELECT USING (auth.uid() = user_id);

-- Super Admin/Master can view all payouts
CREATE POLICY "Admins can view all payouts" ON public.payout_requests
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'master', 'finance_manager')
    )
);

-- Users can insert their own payout requests
CREATE POLICY "Users can request payouts" ON public.payout_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only Super Admin/Master can update payouts (approve/reject)
CREATE POLICY "Only admins can update payouts" ON public.payout_requests
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('super_admin', 'master')
    )
);