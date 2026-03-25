-- Franchise Management Module Tables

-- Franchise Accounts table
CREATE TABLE public.franchise_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    franchise_code TEXT UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    masked_email TEXT,
    masked_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    pincode TEXT,
    gst_number TEXT,
    pan_number TEXT,
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
    kyc_documents JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
    exclusive_rights BOOLEAN DEFAULT false,
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    sales_target_monthly DECIMAL(12,2) DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Franchise Territories table
CREATE TABLE public.franchise_territories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    territory_type TEXT NOT NULL CHECK (territory_type IN ('country', 'state', 'city', 'district', 'pincode')),
    territory_name TEXT NOT NULL,
    territory_code TEXT,
    parent_territory_id UUID REFERENCES public.franchise_territories(id),
    is_exclusive BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    assigned_by UUID,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    override_approved_by UUID,
    override_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Commissions table
CREATE TABLE public.franchise_commissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID,
    sale_amount DECIMAL(12,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    bonus_amount DECIMAL(12,2) DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('sale', 'bonus', 'referral', 'target_bonus', 'override')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'credited', 'disputed', 'cancelled')),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    credited_at TIMESTAMP WITH TIME ZONE,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Leads table (separate from main leads for franchise-specific tracking)
CREATE TABLE public.franchise_leads (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    original_lead_id UUID REFERENCES public.leads(id),
    assigned_to_reseller UUID,
    lead_name TEXT NOT NULL,
    masked_contact TEXT,
    industry TEXT,
    region TEXT,
    city TEXT,
    language_preference TEXT,
    lead_score INTEGER DEFAULT 50,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'contacted', 'demo_scheduled', 'negotiation', 'closed_won', 'closed_lost')),
    demo_requested BOOLEAN DEFAULT false,
    demo_assigned_id UUID,
    sale_value DECIMAL(12,2),
    commission_earned DECIMAL(12,2),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Payouts table
CREATE TABLE public.franchise_payouts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('commission', 'bonus', 'withdrawal', 'refund', 'adjustment')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    payment_method TEXT,
    transaction_ref TEXT,
    bank_details JSONB,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Contracts table
CREATE TABLE public.franchise_contracts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    contract_number TEXT UNIQUE NOT NULL,
    contract_type TEXT DEFAULT 'standard' CHECK (contract_type IN ('standard', 'exclusive', 'premium', 'custom')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    renewal_date DATE,
    auto_renew BOOLEAN DEFAULT false,
    terms JSONB,
    commission_terms JSONB,
    territory_terms JSONB,
    signed_at TIMESTAMP WITH TIME ZONE,
    signed_by UUID,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'active', 'expired', 'terminated', 'renewed')),
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Renewals table
CREATE TABLE public.franchise_renewals (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    contract_id UUID REFERENCES public.franchise_contracts(id) ON DELETE CASCADE NOT NULL,
    previous_end_date DATE NOT NULL,
    new_end_date DATE NOT NULL,
    renewal_fee DECIMAL(12,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Training Scores table
CREATE TABLE public.franchise_training_scores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    module_name TEXT NOT NULL,
    module_type TEXT CHECK (module_type IN ('sales', 'product', 'compliance', 'communication', 'ai_coaching')),
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) DEFAULT 100,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    ai_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Escalations table
CREATE TABLE public.franchise_escalations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    escalation_type TEXT NOT NULL CHECK (escalation_type IN ('territory_dispute', 'commission_dispute', 'lead_dispute', 'contract_issue', 'payment_issue', 'other')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed', 'escalated_to_admin')),
    escalated_to UUID,
    resolved_by UUID,
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    attachments JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Franchise Wallet Ledger table
CREATE TABLE public.franchise_wallet_ledger (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE CASCADE NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    category TEXT NOT NULL CHECK (category IN ('sale_commission', 'bonus', 'refund', 'withdrawal', 'adjustment', 'penalty')),
    amount DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.franchise_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_training_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_wallet_ledger ENABLE ROW LEVEL SECURITY;

-- Helper function for franchise access
CREATE OR REPLACE FUNCTION public.can_manage_franchises(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role IN ('super_admin')
) 
$$;

-- Helper function to get franchise_id from user_id
CREATE OR REPLACE FUNCTION public.get_franchise_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT id FROM public.franchise_accounts WHERE user_id = _user_id LIMIT 1
$$;

-- Helper function for franchise role check
CREATE OR REPLACE FUNCTION public.is_franchise(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role = 'franchise'
) 
$$;

-- RLS Policies for franchise_accounts
CREATE POLICY "Admins can manage franchise accounts" ON public.franchise_accounts
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own account" ON public.franchise_accounts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Franchises update own account" ON public.franchise_accounts
FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for franchise_territories
CREATE POLICY "Admins can manage territories" ON public.franchise_territories
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own territories" ON public.franchise_territories
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_commissions
CREATE POLICY "Admins can manage commissions" ON public.franchise_commissions
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own commissions" ON public.franchise_commissions
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_leads
CREATE POLICY "Admins can manage franchise leads" ON public.franchise_leads
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises manage own leads" ON public.franchise_leads
FOR ALL USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_payouts
CREATE POLICY "Admins can manage payouts" ON public.franchise_payouts
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own payouts" ON public.franchise_payouts
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

CREATE POLICY "Franchises request payouts" ON public.franchise_payouts
FOR INSERT WITH CHECK (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_contracts
CREATE POLICY "Admins can manage contracts" ON public.franchise_contracts
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own contracts" ON public.franchise_contracts
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_renewals
CREATE POLICY "Admins can manage renewals" ON public.franchise_renewals
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own renewals" ON public.franchise_renewals
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

CREATE POLICY "Franchises request renewals" ON public.franchise_renewals
FOR INSERT WITH CHECK (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_training_scores
CREATE POLICY "Admins can manage training scores" ON public.franchise_training_scores
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own training scores" ON public.franchise_training_scores
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_escalations
CREATE POLICY "Admins can manage escalations" ON public.franchise_escalations
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises manage own escalations" ON public.franchise_escalations
FOR ALL USING (franchise_id = get_franchise_id(auth.uid()));

-- RLS Policies for franchise_wallet_ledger (read-only for franchises)
CREATE POLICY "Admins can manage wallet ledger" ON public.franchise_wallet_ledger
FOR ALL USING (can_manage_franchises(auth.uid()));

CREATE POLICY "Franchises view own wallet ledger" ON public.franchise_wallet_ledger
FOR SELECT USING (franchise_id = get_franchise_id(auth.uid()));

-- Trigger for masking franchise contact info
CREATE OR REPLACE FUNCTION public.mask_franchise_contact()
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

CREATE TRIGGER mask_franchise_contact_trigger
BEFORE INSERT OR UPDATE ON public.franchise_accounts
FOR EACH ROW EXECUTE FUNCTION public.mask_franchise_contact();

-- Trigger to update timestamps
CREATE TRIGGER update_franchise_accounts_updated_at
BEFORE UPDATE ON public.franchise_accounts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_contracts_updated_at
BEFORE UPDATE ON public.franchise_contracts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();