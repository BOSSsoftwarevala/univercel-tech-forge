-- =====================================================
-- INFLUENCER MANAGEMENT MODULE - Tables & RLS
-- =====================================================

-- 1. INFLUENCER ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.influencer_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    masked_email TEXT,
    masked_phone TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'frozen', 'rejected')),
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    kyc_documents JSONB DEFAULT '[]',
    social_platforms JSONB DEFAULT '[]',
    commission_tier TEXT DEFAULT 'bronze' CHECK (commission_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    cpc_rate NUMERIC DEFAULT 0.50,
    cpl_rate NUMERIC DEFAULT 5.00,
    cpa_rate NUMERIC DEFAULT 50.00,
    country TEXT DEFAULT 'India',
    region TEXT,
    city TEXT,
    fraud_score NUMERIC DEFAULT 0,
    is_suspended BOOLEAN DEFAULT false,
    suspension_reason TEXT,
    suspended_at TIMESTAMPTZ,
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_earned NUMERIC DEFAULT 0,
    joined_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. INFLUENCER CAMPAIGN MAP
CREATE TABLE IF NOT EXISTS public.influencer_campaign_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    campaign_type TEXT DEFAULT 'promotion',
    product_category TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    target_clicks INTEGER DEFAULT 0,
    target_conversions INTEGER DEFAULT 0,
    achieved_clicks INTEGER DEFAULT 0,
    achieved_conversions INTEGER DEFAULT 0,
    bonus_amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active',
    assigned_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INFLUENCER CLICK LOGS
CREATE TABLE IF NOT EXISTS public.influencer_click_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.influencer_campaign_map(id),
    tracking_link TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    browser TEXT,
    country TEXT,
    city TEXT,
    is_unique BOOLEAN DEFAULT true,
    is_bot BOOLEAN DEFAULT false,
    is_fraud BOOLEAN DEFAULT false,
    fraud_reason TEXT,
    fraud_score NUMERIC DEFAULT 0,
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INFLUENCER CONVERSION LOGS
CREATE TABLE IF NOT EXISTS public.influencer_conversion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.influencer_campaign_map(id),
    click_id UUID REFERENCES public.influencer_click_logs(id),
    conversion_type TEXT DEFAULT 'sale',
    product_category TEXT,
    sale_amount NUMERIC DEFAULT 0,
    commission_type TEXT DEFAULT 'cpa',
    commission_rate NUMERIC NOT NULL,
    commission_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    credited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. INFLUENCER WALLET
CREATE TABLE IF NOT EXISTS public.influencer_wallet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL UNIQUE REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    available_balance NUMERIC DEFAULT 0,
    pending_balance NUMERIC DEFAULT 0,
    total_earned NUMERIC DEFAULT 0,
    total_withdrawn NUMERIC DEFAULT 0,
    total_penalties NUMERIC DEFAULT 0,
    last_payout_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. INFLUENCER WALLET LEDGER
CREATE TABLE IF NOT EXISTS public.influencer_wallet_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. INFLUENCER PAYOUT REQUESTS
CREATE TABLE IF NOT EXISTS public.influencer_payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'bank_transfer',
    bank_details JSONB,
    status TEXT DEFAULT 'pending',
    requested_at TIMESTAMPTZ DEFAULT now(),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    transaction_ref TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. INFLUENCER PERFORMANCE METRICS
CREATE TABLE IF NOT EXISTS public.influencer_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    bot_clicks INTEGER DEFAULT 0,
    fraud_clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate NUMERIC DEFAULT 0,
    earnings NUMERIC DEFAULT 0,
    platform_breakdown JSONB DEFAULT '{}',
    country_breakdown JSONB DEFAULT '{}',
    fraud_score NUMERIC DEFAULT 0,
    tier_progress NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(influencer_id, metric_date)
);

-- 9. INFLUENCER SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.influencer_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    ticket_number TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    assigned_to UUID,
    escalated_to UUID,
    escalation_level INTEGER DEFAULT 0,
    attachments JSONB DEFAULT '[]',
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. INFLUENCER AUDIT TRAIL
CREATE TABLE IF NOT EXISTS public.influencer_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    metadata JSONB,
    performed_by UUID,
    performer_role app_role,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. INFLUENCER REFERRAL LINKS
CREATE TABLE IF NOT EXISTS public.influencer_referral_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES public.influencer_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.influencer_campaign_map(id),
    original_url TEXT NOT NULL,
    short_code TEXT NOT NULL UNIQUE,
    tracking_url TEXT NOT NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    product_category TEXT,
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.get_influencer_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT id FROM public.influencer_accounts WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_influencer(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role = 'influencer'
) 
$$;

CREATE OR REPLACE FUNCTION public.can_manage_influencers(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'marketing_manager')
) 
$$;

CREATE OR REPLACE FUNCTION public.mask_influencer_contact()
RETURNS TRIGGER
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

DROP TRIGGER IF EXISTS mask_influencer_contact_trigger ON public.influencer_accounts;
CREATE TRIGGER mask_influencer_contact_trigger
    BEFORE INSERT OR UPDATE ON public.influencer_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.mask_influencer_contact();

-- ENABLE RLS
ALTER TABLE public.influencer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_campaign_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_click_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_conversion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_wallet_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_referral_links ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY "Admins manage influencer accounts" ON public.influencer_accounts FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers view own account" ON public.influencer_accounts FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Influencers update own account" ON public.influencer_accounts FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins manage campaigns" ON public.influencer_campaign_map FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers view own campaigns" ON public.influencer_campaign_map FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Admins manage click logs" ON public.influencer_click_logs FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers view own clicks" ON public.influencer_click_logs FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Admins manage conversions" ON public.influencer_conversion_logs FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers view own conversions" ON public.influencer_conversion_logs FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Finance manage influencer wallets" ON public.influencer_wallet FOR ALL USING (can_access_finance(auth.uid()));
CREATE POLICY "Influencers view own wallet" ON public.influencer_wallet FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Finance manage wallet ledger" ON public.influencer_wallet_ledger FOR ALL USING (can_access_finance(auth.uid()));
CREATE POLICY "Influencers view own ledger" ON public.influencer_wallet_ledger FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Finance manage payouts" ON public.influencer_payout_requests FOR ALL USING (can_access_finance(auth.uid()));
CREATE POLICY "Influencers request payouts" ON public.influencer_payout_requests FOR INSERT WITH CHECK (influencer_id = get_influencer_id(auth.uid()));
CREATE POLICY "Influencers view own payouts" ON public.influencer_payout_requests FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Admins manage metrics" ON public.influencer_performance_metrics FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers view own metrics" ON public.influencer_performance_metrics FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Admins manage tickets" ON public.influencer_support_tickets FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers manage own tickets" ON public.influencer_support_tickets FOR ALL USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Admins view audit trail" ON public.influencer_audit_trail FOR SELECT USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers view own audit" ON public.influencer_audit_trail FOR SELECT USING (influencer_id = get_influencer_id(auth.uid()));

CREATE POLICY "Admins manage referral links" ON public.influencer_referral_links FOR ALL USING (can_manage_influencers(auth.uid()));
CREATE POLICY "Influencers manage own links" ON public.influencer_referral_links FOR ALL USING (influencer_id = get_influencer_id(auth.uid()));

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_influencer_accounts_user_id ON public.influencer_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_influencer_click_logs_influencer_id ON public.influencer_click_logs(influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_referral_links_short_code ON public.influencer_referral_links(short_code);