-- =====================================================
-- USER ROLE SYSTEM - Safe, Simple, Fast
-- Revenue source with zero admin access
-- =====================================================

-- 1. Create user profiles table for customer data
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    wallet_balance NUMERIC(12,2) DEFAULT 0,
    total_purchases INTEGER DEFAULT 0,
    total_spent NUMERIC(12,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.user_profiles(id),
    last_active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create user purchases table
CREATE TABLE IF NOT EXISTS public.user_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    demo_id UUID REFERENCES public.demos(id),
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    payment_method TEXT,
    transaction_id TEXT,
    access_granted_at TIMESTAMPTZ,
    access_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create user demo history (view tracking)
CREATE TABLE IF NOT EXISTS public.user_demo_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    demo_id UUID REFERENCES public.demos(id),
    viewed_at TIMESTAMPTZ DEFAULT now(),
    duration_seconds INTEGER DEFAULT 0,
    interaction_count INTEGER DEFAULT 0
);

-- 4. Create user support tickets table
CREATE TABLE IF NOT EXISTS public.user_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ticket_number TEXT NOT NULL UNIQUE DEFAULT ('TKT-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8))),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'billing', 'technical', 'product', 'refund', 'other')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_response', 'resolved', 'closed')),
    assigned_to UUID,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 5. Create user wallet transactions (view-only for users)
CREATE TABLE IF NOT EXISTS public.user_wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'refund', 'bonus', 'cashback')),
    amount NUMERIC(12,2) NOT NULL,
    balance_after NUMERIC(12,2) NOT NULL,
    description TEXT,
    reference_id TEXT,
    reference_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enable RLS on all user tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_demo_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallet_transactions ENABLE ROW LEVEL SECURITY;

-- 7. User Profile RLS Policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 8. User Purchases RLS Policies
CREATE POLICY "Users can view their own purchases"
    ON public.user_purchases FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
    ON public.user_purchases FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 9. User Demo History RLS Policies
CREATE POLICY "Users can view their own demo history"
    ON public.user_demo_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own demo history"
    ON public.user_demo_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 10. User Support Tickets RLS Policies
CREATE POLICY "Users can view their own tickets"
    ON public.user_support_tickets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets"
    ON public.user_support_tickets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own open tickets"
    ON public.user_support_tickets FOR UPDATE
    USING (auth.uid() = user_id AND status IN ('open', 'waiting_response'));

-- 11. User Wallet Transactions RLS - VIEW ONLY (no INSERT/UPDATE/DELETE for users)
CREATE POLICY "Users can only view their own wallet transactions"
    ON public.user_wallet_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- 12. Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_user_role_signup()
RETURNS TRIGGER AS $$
DECLARE
    v_role TEXT;
    v_ref_code TEXT;
BEGIN
    -- Get role from metadata, default to 'user'
    v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
    
    -- Only handle 'user' role here
    IF v_role = 'user' THEN
        -- Generate unique referral code
        v_ref_code := 'USR-' || UPPER(SUBSTRING(NEW.id::text, 1, 8));
        
        -- Create user profile
        INSERT INTO public.user_profiles (user_id, email, full_name, referral_code)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            v_ref_code
        )
        ON CONFLICT (user_id) DO NOTHING;
        
        -- Create user role entry with auto-approval
        INSERT INTO public.user_roles (user_id, role, approval_status)
        VALUES (NEW.id, 'user', 'approved')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 13. Create trigger for auto user signup (safe drop first)
DROP TRIGGER IF EXISTS on_user_role_created ON auth.users;
CREATE TRIGGER on_user_role_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_role_signup();

-- 14. Function to block user from admin routes
CREATE OR REPLACE FUNCTION public.validate_user_route_access(
    p_user_id UUID,
    p_route TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
    v_forbidden_patterns TEXT[] := ARRAY[
        '^/admin',
        '^/super-admin',
        '^/master',
        '^/finance',
        '^/promise-management',
        '^/developer',
        '^/franchise',
        '^/reseller',
        '^/influencer',
        '^/security-command',
        '^/server-manager',
        '^/api-manager',
        '^/marketing-manager',
        '^/seo-manager',
        '^/legal-manager',
        '^/area-manager',
        '^/continent-super-admin'
    ];
    v_pattern TEXT;
BEGIN
    -- Get user role
    SELECT role INTO v_role 
    FROM public.user_roles 
    WHERE user_id = p_user_id;
    
    -- If not a 'user' role, allow (other roles have their own restrictions)
    IF v_role IS NULL OR v_role != 'user' THEN
        RETURN true;
    END IF;
    
    -- Check against forbidden patterns
    FOREACH v_pattern IN ARRAY v_forbidden_patterns
    LOOP
        IF p_route ~ v_pattern THEN
            -- Log the blocked attempt
            INSERT INTO public.audit_logs (user_id, action, module, meta_json, role)
            VALUES (
                p_user_id,
                'BLOCKED_ROUTE_ACCESS',
                'user_security',
                jsonb_build_object('route', p_route, 'pattern', v_pattern),
                'user'
            );
            RETURN false;
        END IF;
    END LOOP;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 15. Function to safely end Safe Assist on logout
CREATE OR REPLACE FUNCTION public.end_user_safe_assist_on_logout(p_user_id UUID)
RETURNS void AS $$
BEGIN
    -- End any active safe assist sessions
    UPDATE public.safe_assist_sessions
    SET 
        status = 'ended',
        ended_at = now(),
        end_reason = 'user_logout'
    WHERE 
        user_id = p_user_id 
        AND status IN ('active', 'pending', 'connected');
        
    -- Log the action
    INSERT INTO public.audit_logs (user_id, action, module, role)
    VALUES (p_user_id, 'SAFE_ASSIST_AUTO_END_LOGOUT', 'safe_assist', 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 16. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON public.user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_demo_id ON public.user_purchases(demo_id);
CREATE INDEX IF NOT EXISTS idx_user_demo_history_user_id ON public.user_demo_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_support_tickets_user_id ON public.user_support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_support_tickets_status ON public.user_support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_user_wallet_transactions_user_id ON public.user_wallet_transactions(user_id);