-- Prime User Management Tables

-- Prime User Profiles
CREATE TABLE IF NOT EXISTS public.prime_user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    masked_email TEXT,
    masked_phone TEXT,
    subscription_tier TEXT DEFAULT 'monthly' CHECK (subscription_tier IN ('monthly', 'yearly', 'lifetime', 'trial')),
    subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'expired', 'suspended', 'cancelled', 'trial')),
    subscription_start_date TIMESTAMPTZ DEFAULT now(),
    subscription_end_date TIMESTAMPTZ,
    auto_renewal BOOLEAN DEFAULT true,
    region TEXT DEFAULT 'India',
    vip_badge_enabled BOOLEAN DEFAULT true,
    priority_level INTEGER DEFAULT 1,
    dedicated_developer_id UUID,
    grace_period_days INTEGER DEFAULT 7,
    downgrade_reason TEXT,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Prime Upgrade History
CREATE TABLE IF NOT EXISTS public.prime_upgrade_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    previous_tier TEXT,
    new_tier TEXT NOT NULL,
    upgrade_type TEXT CHECK (upgrade_type IN ('upgrade', 'downgrade', 'renewal', 'trial_start', 'trial_end')),
    amount NUMERIC DEFAULT 0,
    payment_method TEXT,
    transaction_ref TEXT,
    processed_by UUID,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Priority Ticket Logs
CREATE TABLE IF NOT EXISTS public.priority_ticket_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    ticket_type TEXT NOT NULL CHECK (ticket_type IN ('urgent', 'bug_fix', 'feature_request', 'support', 'hosting', 'general')),
    subject TEXT NOT NULL,
    description TEXT,
    priority_level INTEGER DEFAULT 1,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'escalated', 'resolved', 'closed')),
    assigned_developer_id UUID,
    escalated_to UUID,
    escalation_reason TEXT,
    sla_target_hours NUMERIC DEFAULT 2,
    sla_deadline TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    satisfaction_rating INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SLA Monitoring
CREATE TABLE IF NOT EXISTS public.sla_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES public.priority_ticket_logs(id) ON DELETE SET NULL,
    task_id UUID,
    sla_type TEXT NOT NULL CHECK (sla_type IN ('response', 'resolution', 'delivery', 'bug_fix')),
    target_hours NUMERIC NOT NULL DEFAULT 2,
    actual_hours NUMERIC,
    sla_met BOOLEAN,
    compensation_amount NUMERIC DEFAULT 0,
    compensation_credited BOOLEAN DEFAULT false,
    breach_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Developer Assignment Priority
CREATE TABLE IF NOT EXISTS public.developer_assignment_priority (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    developer_id UUID REFERENCES public.developers(id) ON DELETE SET NULL,
    assignment_type TEXT DEFAULT 'dedicated' CHECK (assignment_type IN ('dedicated', 'priority', 'backup')),
    is_active BOOLEAN DEFAULT true,
    assigned_by UUID,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dedicated Support Threads
CREATE TABLE IF NOT EXISTS public.dedicated_support_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    thread_type TEXT DEFAULT 'support' CHECK (thread_type IN ('support', 'developer_chat', 'urgent', 'feature_discussion')),
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
    participant_developer_id UUID,
    participant_masked_name TEXT,
    is_urgent BOOLEAN DEFAULT false,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    closed_at TIMESTAMPTZ,
    closed_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dedicated Support Messages
CREATE TABLE IF NOT EXISTS public.dedicated_support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES public.dedicated_support_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_role app_role NOT NULL,
    sender_masked_name TEXT,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    is_system_message BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prime Wallet Usage
CREATE TABLE IF NOT EXISTS public.prime_wallet_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('subscription', 'refund', 'compensation', 'addon', 'credit')),
    amount NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    description TEXT,
    reference_id UUID,
    reference_type TEXT,
    payment_method TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prime Performance Reports
CREATE TABLE IF NOT EXISTS public.prime_performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    report_period_start DATE NOT NULL,
    report_period_end DATE NOT NULL,
    total_tickets INTEGER DEFAULT 0,
    tickets_resolved INTEGER DEFAULT 0,
    avg_resolution_hours NUMERIC,
    sla_compliance_rate NUMERIC,
    compensations_received NUMERIC DEFAULT 0,
    developer_assignments INTEGER DEFAULT 0,
    support_threads INTEGER DEFAULT 0,
    satisfaction_avg NUMERIC,
    generated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prime Feature Access
CREATE TABLE IF NOT EXISTS public.prime_feature_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    feature_type TEXT DEFAULT 'beta' CHECK (feature_type IN ('beta', 'exclusive', 'early_access', 'premium')),
    granted_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    granted_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(prime_user_id, feature_name)
);

-- Prime Hosting Status
CREATE TABLE IF NOT EXISTS public.prime_hosting_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prime_user_id UUID NOT NULL REFERENCES public.prime_user_profiles(id) ON DELETE CASCADE,
    hosting_tier TEXT DEFAULT 'premium' CHECK (hosting_tier IN ('standard', 'premium', 'enterprise')),
    uptime_percentage NUMERIC DEFAULT 99.9,
    last_check_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'degraded', 'down', 'maintenance')),
    allocated_resources JSONB DEFAULT '{"cpu": "high", "memory": "high", "storage": "unlimited"}'::jsonb,
    custom_domain TEXT,
    ssl_enabled BOOLEAN DEFAULT true,
    cdn_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prime_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prime_upgrade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.priority_ticket_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sla_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_assignment_priority ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dedicated_support_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dedicated_support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prime_wallet_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prime_performance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prime_feature_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prime_hosting_status ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.get_prime_user_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT id FROM public.prime_user_profiles WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_prime_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role = 'prime'
) 
$$;

CREATE OR REPLACE FUNCTION public.can_manage_prime_users(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$ 
SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'client_success')
) 
$$;

-- Masking trigger for prime users
CREATE OR REPLACE FUNCTION public.mask_prime_user_contact()
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

CREATE TRIGGER mask_prime_user_contact_trigger
    BEFORE INSERT OR UPDATE ON public.prime_user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.mask_prime_user_contact();

-- RLS Policies
CREATE POLICY "Prime users view own profile" ON public.prime_user_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Prime users update own profile" ON public.prime_user_profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins manage prime profiles" ON public.prime_user_profiles
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Prime users view own history" ON public.prime_upgrade_history
    FOR SELECT USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage upgrade history" ON public.prime_upgrade_history
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Finance manages upgrades" ON public.prime_upgrade_history
    FOR ALL USING (can_access_finance(auth.uid()));

CREATE POLICY "Prime users manage own tickets" ON public.priority_ticket_logs
    FOR ALL USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage all tickets" ON public.priority_ticket_logs
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Developers view assigned tickets" ON public.priority_ticket_logs
    FOR SELECT USING (assigned_developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Prime users view own SLA" ON public.sla_monitoring
    FOR SELECT USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage SLA" ON public.sla_monitoring
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Prime users view own assignments" ON public.developer_assignment_priority
    FOR SELECT USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage assignments" ON public.developer_assignment_priority
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Prime users manage own threads" ON public.dedicated_support_threads
    FOR ALL USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage all threads" ON public.dedicated_support_threads
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Thread participants view messages" ON public.dedicated_support_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM dedicated_support_threads t 
            WHERE t.id = thread_id 
            AND (t.prime_user_id = get_prime_user_id(auth.uid()) OR can_manage_prime_users(auth.uid()))
        )
    );

CREATE POLICY "Thread participants insert messages" ON public.dedicated_support_messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Prime users view own wallet" ON public.prime_wallet_usage
    FOR SELECT USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Finance manages wallets" ON public.prime_wallet_usage
    FOR ALL USING (can_access_finance(auth.uid()));

CREATE POLICY "Admins manage wallets" ON public.prime_wallet_usage
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Prime users view own reports" ON public.prime_performance_reports
    FOR SELECT USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage reports" ON public.prime_performance_reports
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Prime users view own features" ON public.prime_feature_access
    FOR SELECT USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage features" ON public.prime_feature_access
    FOR ALL USING (can_manage_prime_users(auth.uid()));

CREATE POLICY "Prime users view own hosting" ON public.prime_hosting_status
    FOR SELECT USING (prime_user_id = get_prime_user_id(auth.uid()));

CREATE POLICY "Admins manage hosting" ON public.prime_hosting_status
    FOR ALL USING (can_manage_prime_users(auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prime_user_profiles_user_id ON public.prime_user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_priority_ticket_logs_prime_user ON public.priority_ticket_logs(prime_user_id);
CREATE INDEX IF NOT EXISTS idx_priority_ticket_logs_status ON public.priority_ticket_logs(status);
CREATE INDEX IF NOT EXISTS idx_sla_monitoring_prime_user ON public.sla_monitoring(prime_user_id);
CREATE INDEX IF NOT EXISTS idx_dedicated_support_threads_prime_user ON public.dedicated_support_threads(prime_user_id);
CREATE INDEX IF NOT EXISTS idx_prime_wallet_usage_prime_user ON public.prime_wallet_usage(prime_user_id);