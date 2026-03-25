-- Create reseller-specific tables for the Reseller Management module

-- Reseller accounts table
CREATE TABLE IF NOT EXISTS public.reseller_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    franchise_id UUID REFERENCES public.franchise_accounts(id),
    reseller_code TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    masked_email TEXT,
    masked_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    pincode TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'inactive')),
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    kyc_documents JSONB,
    commission_rate NUMERIC DEFAULT 10.00,
    training_completed BOOLEAN DEFAULT false,
    certification_score INTEGER,
    certification_date TIMESTAMPTZ,
    joined_at TIMESTAMPTZ DEFAULT now(),
    last_active_at TIMESTAMPTZ DEFAULT now(),
    sales_target_monthly NUMERIC DEFAULT 0,
    total_sales NUMERIC DEFAULT 0,
    total_leads_converted INTEGER DEFAULT 0,
    language_preference TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller training records
CREATE TABLE IF NOT EXISTS public.reseller_training (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    module_name TEXT NOT NULL,
    module_type TEXT DEFAULT 'sales',
    score NUMERIC NOT NULL,
    max_score NUMERIC DEFAULT 100,
    passed BOOLEAN DEFAULT false,
    attempts INTEGER DEFAULT 1,
    completed_at TIMESTAMPTZ DEFAULT now(),
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    ai_feedback TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller leads
CREATE TABLE IF NOT EXISTS public.reseller_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    franchise_id UUID REFERENCES public.franchise_accounts(id),
    original_lead_id UUID REFERENCES public.leads(id),
    lead_name TEXT NOT NULL,
    masked_contact TEXT,
    industry TEXT,
    city TEXT,
    region TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'demo_scheduled', 'negotiating', 'converted', 'lost', 'escalated')),
    lead_score INTEGER DEFAULT 50,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    demo_requested BOOLEAN DEFAULT false,
    demo_link_id UUID,
    demo_clicked_at TIMESTAMPTZ,
    last_follow_up TIMESTAMPTZ,
    next_follow_up TIMESTAMPTZ,
    follow_up_count INTEGER DEFAULT 0,
    conversion_probability NUMERIC DEFAULT 50.00,
    sale_value NUMERIC,
    commission_earned NUMERIC,
    ai_notes TEXT,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller commissions
CREATE TABLE IF NOT EXISTS public.reseller_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.reseller_leads(id),
    commission_type TEXT NOT NULL CHECK (commission_type IN ('sale', 'bonus', 'target_achievement', 'referral')),
    sale_amount NUMERIC NOT NULL,
    commission_rate NUMERIC NOT NULL,
    commission_amount NUMERIC NOT NULL,
    bonus_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'credited', 'rejected')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    credited_at TIMESTAMPTZ,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller payouts
CREATE TABLE IF NOT EXISTS public.reseller_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    payout_type TEXT NOT NULL CHECK (payout_type IN ('withdrawal', 'bonus', 'refund')),
    amount NUMERIC NOT NULL,
    payment_method TEXT,
    bank_details JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processing', 'completed', 'rejected')),
    requested_at TIMESTAMPTZ DEFAULT now(),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    transaction_ref TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller activity logs
CREATE TABLE IF NOT EXISTS public.reseller_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    ip_address TEXT,
    device_info TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller demo clicks tracking
CREATE TABLE IF NOT EXISTS public.reseller_demo_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    demo_id UUID REFERENCES public.demos(id),
    lead_id UUID REFERENCES public.reseller_leads(id),
    tracking_id TEXT NOT NULL,
    clicked_at TIMESTAMPTZ DEFAULT now(),
    ip_address TEXT,
    device_type TEXT,
    browser TEXT,
    country TEXT,
    city TEXT,
    referrer TEXT,
    session_duration INTEGER,
    converted BOOLEAN DEFAULT false,
    is_fake_click BOOLEAN DEFAULT false,
    ai_fraud_score NUMERIC DEFAULT 0
);

-- Reseller escalations
CREATE TABLE IF NOT EXISTS public.reseller_escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.reseller_leads(id),
    escalation_type TEXT NOT NULL CHECK (escalation_type IN ('lead_issue', 'payment_dispute', 'technical', 'customer_complaint', 'other')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    escalated_to UUID,
    escalated_to_role TEXT,
    attachments JSONB,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller territory mapping
CREATE TABLE IF NOT EXISTS public.reseller_territory_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    franchise_id UUID REFERENCES public.franchise_accounts(id),
    territory_type TEXT NOT NULL CHECK (territory_type IN ('city', 'district', 'state', 'region')),
    territory_name TEXT NOT NULL,
    territory_code TEXT,
    is_primary BOOLEAN DEFAULT false,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    assigned_by UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller wallet
CREATE TABLE IF NOT EXISTS public.reseller_wallet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID NOT NULL UNIQUE REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    available_balance NUMERIC NOT NULL DEFAULT 0,
    pending_balance NUMERIC NOT NULL DEFAULT 0,
    total_earned NUMERIC NOT NULL DEFAULT 0,
    total_withdrawn NUMERIC NOT NULL DEFAULT 0,
    total_bonus NUMERIC NOT NULL DEFAULT 0,
    last_payout_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reseller wallet transactions
CREATE TABLE IF NOT EXISTS public.reseller_wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.reseller_wallet(id) ON DELETE CASCADE,
    reseller_id UUID NOT NULL REFERENCES public.reseller_accounts(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'commission', 'bonus', 'withdrawal', 'refund')),
    amount NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    description TEXT,
    reference_type TEXT,
    reference_id UUID,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all reseller tables
ALTER TABLE public.reseller_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_demo_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_territory_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.get_reseller_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT id FROM public.reseller_accounts WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_reseller(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role = 'reseller'
) 
$$;

CREATE OR REPLACE FUNCTION public.can_manage_resellers(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'franchise')
) 
$$;

-- Masking trigger for reseller contacts
CREATE OR REPLACE FUNCTION public.mask_reseller_contact()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.masked_email := CONCAT(LEFT(NEW.email, 2), '****@', SPLIT_PART(NEW.email, '@', 2));
    IF NEW.phone IS NOT NULL THEN
        NEW.masked_phone := CONCAT(LEFT(NEW.phone, 3), '****', RIGHT(NEW.phone, 2));
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER mask_reseller_contact_trigger
BEFORE INSERT OR UPDATE ON public.reseller_accounts
FOR EACH ROW EXECUTE FUNCTION public.mask_reseller_contact();

-- RLS Policies for reseller_accounts
CREATE POLICY "Resellers view own account" ON public.reseller_accounts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Resellers update own account" ON public.reseller_accounts
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage reseller accounts" ON public.reseller_accounts
FOR ALL USING (can_manage_resellers(auth.uid()));

CREATE POLICY "Franchises view their resellers" ON public.reseller_accounts
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for reseller_training
CREATE POLICY "Resellers view own training" ON public.reseller_training
FOR SELECT USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Admins can manage training" ON public.reseller_training
FOR ALL USING (can_manage_resellers(auth.uid()));

-- RLS Policies for reseller_leads
CREATE POLICY "Resellers manage own leads" ON public.reseller_leads
FOR ALL USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Admins can manage reseller leads" ON public.reseller_leads
FOR ALL USING (can_manage_resellers(auth.uid()));

CREATE POLICY "Franchises view their reseller leads" ON public.reseller_leads
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for reseller_commissions
CREATE POLICY "Resellers view own commissions" ON public.reseller_commissions
FOR SELECT USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Admins can manage commissions" ON public.reseller_commissions
FOR ALL USING (can_manage_resellers(auth.uid()) OR can_access_finance(auth.uid()));

-- RLS Policies for reseller_payouts
CREATE POLICY "Resellers view own payouts" ON public.reseller_payouts
FOR SELECT USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Resellers request payouts" ON public.reseller_payouts
FOR INSERT WITH CHECK (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Admins can manage payouts" ON public.reseller_payouts
FOR ALL USING (can_manage_resellers(auth.uid()) OR can_access_finance(auth.uid()));

-- RLS Policies for reseller_activity_logs
CREATE POLICY "Resellers insert own logs" ON public.reseller_activity_logs
FOR INSERT WITH CHECK (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Admins can view logs" ON public.reseller_activity_logs
FOR SELECT USING (can_manage_resellers(auth.uid()));

-- RLS Policies for reseller_demo_clicks
CREATE POLICY "Resellers view own clicks" ON public.reseller_demo_clicks
FOR SELECT USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Insert clicks" ON public.reseller_demo_clicks
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage clicks" ON public.reseller_demo_clicks
FOR ALL USING (can_manage_resellers(auth.uid()));

-- RLS Policies for reseller_escalations
CREATE POLICY "Resellers manage own escalations" ON public.reseller_escalations
FOR ALL USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Admins can manage escalations" ON public.reseller_escalations
FOR ALL USING (can_manage_resellers(auth.uid()));

-- RLS Policies for reseller_territory_map
CREATE POLICY "Resellers view own territories" ON public.reseller_territory_map
FOR SELECT USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Admins can manage territories" ON public.reseller_territory_map
FOR ALL USING (can_manage_resellers(auth.uid()));

-- RLS Policies for reseller_wallet
CREATE POLICY "Resellers view own wallet" ON public.reseller_wallet
FOR SELECT USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Finance can manage wallets" ON public.reseller_wallet
FOR ALL USING (can_access_finance(auth.uid()));

-- RLS Policies for reseller_wallet_transactions
CREATE POLICY "Resellers view own transactions" ON public.reseller_wallet_transactions
FOR SELECT USING (reseller_id = get_reseller_id(auth.uid()));

CREATE POLICY "Finance can manage transactions" ON public.reseller_wallet_transactions
FOR ALL USING (can_access_finance(auth.uid()));

-- Update triggers
CREATE TRIGGER update_reseller_accounts_updated_at
BEFORE UPDATE ON public.reseller_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reseller_wallet_updated_at
BEFORE UPDATE ON public.reseller_wallet
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();