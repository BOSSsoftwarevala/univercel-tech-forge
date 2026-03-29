-- =====================================================
-- SOFTWARE VALA: Missing Tables Only
-- =====================================================

-- 1. PRODUCTS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    pricing_model TEXT DEFAULT 'one-time',
    lifetime_price NUMERIC(12,2),
    monthly_price NUMERIC(12,2),
    features_json JSONB DEFAULT '[]'::jsonb,
    tech_stack TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PRODUCT_VERSIONS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.product_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID,
    version_number TEXT NOT NULL,
    changes_notes TEXT,
    release_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TASKS TABLE - generic tasks (missing)
CREATE TABLE IF NOT EXISTS public.tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID,
    lead_id UUID,
    assigned_to_dev UUID,
    created_by UUID,
    status TEXT DEFAULT 'pending',
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    promised_time TIMESTAMPTZ,
    difficulty TEXT DEFAULT 'medium',
    priority TEXT DEFAULT 'normal',
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. DEV_TIMER TABLE (missing)
CREATE TABLE IF NOT EXISTS public.dev_timer (
    timer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID,
    dev_id UUID,
    start_timestamp TIMESTAMPTZ,
    pause_timestamp TIMESTAMPTZ,
    stop_timestamp TIMESTAMPTZ,
    total_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. DEV_PERFORMANCE TABLE (missing)
CREATE TABLE IF NOT EXISTS public.dev_performance (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dev_id UUID,
    task_id UUID,
    score_delivery INTEGER DEFAULT 0,
    score_behavior INTEGER DEFAULT 0,
    score_speed INTEGER DEFAULT 0,
    final_score INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CHAT_THREADS TABLE (missing - different from internal_chat)
CREATE TABLE IF NOT EXISTS public.chat_threads (
    thread_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID,
    related_lead UUID,
    related_task UUID,
    related_role app_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CHAT_MESSAGES TABLE (missing - different from internal_chat)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID,
    sender_id UUID,
    masked_sender TEXT,
    message_text TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    translated_text TEXT,
    cannot_edit BOOLEAN DEFAULT true,
    cannot_delete BOOLEAN DEFAULT true,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. WALLETS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.wallets (
    wallet_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    balance NUMERIC(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. TRANSACTIONS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID,
    type TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    reference TEXT,
    related_user UUID,
    related_role app_role,
    related_sale UUID,
    status TEXT DEFAULT 'completed',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. PAYOUT_REQUESTS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.payout_requests (
    payout_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    processed_by UUID,
    payment_method TEXT,
    bank_details JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. SUBSCRIPTIONS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    sub_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    plan TEXT NOT NULL,
    amount NUMERIC(12,2),
    validity INTEGER DEFAULT 30,
    status TEXT DEFAULT 'active',
    activated_at TIMESTAMPTZ DEFAULT now(),
    expired_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. INVOICES TABLE (missing)
CREATE TABLE IF NOT EXISTS public.invoices (
    invoice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    invoice_number TEXT,
    amount NUMERIC(12,2) NOT NULL,
    tax NUMERIC(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    pdf_link TEXT,
    status TEXT DEFAULT 'generated',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. KYC_DOCUMENTS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.kyc_documents (
    kyc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    doc_type TEXT NOT NULL,
    doc_file TEXT,
    status TEXT DEFAULT 'pending',
    verified_by UUID,
    rejection_reason TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. SECURITY_LOGS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.security_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    event_type TEXT NOT NULL,
    event_details TEXT,
    ip TEXT,
    device TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. IP_LOCKS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.ip_locks (
    lock_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ip TEXT NOT NULL,
    device TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. AUDIT_LOGS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    user_id UUID,
    role app_role,
    meta_json JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. SYSTEM_HEALTH TABLE (missing)
CREATE TABLE IF NOT EXISTS public.system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric TEXT NOT NULL,
    value NUMERIC,
    unit TEXT,
    status TEXT DEFAULT 'normal',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. FRAUD_ALERTS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.fraud_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    flagged_by_ai BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'open',
    resolution_notes TEXT,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. INCIDENTS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.incidents (
    incident_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reported_by UUID,
    assigned_to UUID,
    severity TEXT DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT,
    resolution TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. RESEARCH_SUGGESTIONS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.research_suggestions (
    suggestion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submitted_by UUID,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'pending',
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. TRAINING_LOGS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.training_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    module TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    score INTEGER,
    certificate_url TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. LEAD_CONVERSIONS TABLE (missing)
CREATE TABLE IF NOT EXISTS public.lead_conversions (
    conversion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID,
    product_id UUID,
    revenue NUMERIC(12,2) DEFAULT 0,
    commission NUMERIC(12,2) DEFAULT 0,
    converted_by UUID,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 23. ROLES TABLE (missing - for UI management)
CREATE TABLE IF NOT EXISTS public.roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 24. ROLE_PERMISSIONS JUNCTION TABLE (missing)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT NOT NULL,
    permission_name TEXT NOT NULL,
    module_name TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(role_name, module_name, action)
);

-- =====================================================
-- ENABLE RLS ON ALL NEW TABLES
-- =====================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_timer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dev_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES FOR NEW TABLES
-- =====================================================

-- PRODUCTS
CREATE POLICY "admin_products" ON public.products FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "view_products" ON public.products FOR SELECT USING (true);

-- PRODUCT_VERSIONS
CREATE POLICY "admin_versions" ON public.product_versions FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "view_versions" ON public.product_versions FOR SELECT USING (true);

-- TASKS
CREATE POLICY "managers_tasks" ON public.tasks FOR ALL USING (can_manage_developers(auth.uid()));
CREATE POLICY "devs_own_tasks" ON public.tasks FOR SELECT USING (assigned_to_dev = get_developer_id(auth.uid()));

-- DEV_TIMER
CREATE POLICY "devs_own_timer" ON public.dev_timer FOR ALL USING (dev_id = get_developer_id(auth.uid()));
CREATE POLICY "managers_timer" ON public.dev_timer FOR SELECT USING (can_manage_developers(auth.uid()));

-- DEV_PERFORMANCE
CREATE POLICY "devs_own_perf" ON public.dev_performance FOR SELECT USING (dev_id = get_developer_id(auth.uid()));
CREATE POLICY "managers_perf" ON public.dev_performance FOR ALL USING (can_manage_developers(auth.uid()));

-- CHAT_THREADS
CREATE POLICY "users_threads" ON public.chat_threads FOR ALL USING (created_by = auth.uid());
CREATE POLICY "admin_threads" ON public.chat_threads FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

-- CHAT_MESSAGES
CREATE POLICY "users_send_msg" ON public.chat_messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "users_read_msg" ON public.chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_threads WHERE thread_id = chat_messages.thread_id AND created_by = auth.uid())
    OR has_role(auth.uid(), 'super_admin')
);

-- WALLETS
CREATE POLICY "users_own_wallet" ON public.wallets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "finance_wallets" ON public.wallets FOR ALL USING (can_access_finance(auth.uid()));

-- TRANSACTIONS
CREATE POLICY "users_own_tx" ON public.transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.wallets WHERE wallet_id = transactions.wallet_id AND user_id = auth.uid())
);
CREATE POLICY "finance_tx" ON public.transactions FOR ALL USING (can_access_finance(auth.uid()));

-- PAYOUT_REQUESTS
CREATE POLICY "users_own_payout" ON public.payout_requests FOR ALL USING (user_id = auth.uid());
CREATE POLICY "finance_payout" ON public.payout_requests FOR ALL USING (can_access_finance(auth.uid()));

-- SUBSCRIPTIONS
CREATE POLICY "users_own_subs" ON public.subscriptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admin_subs" ON public.subscriptions FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- INVOICES
CREATE POLICY "users_own_inv" ON public.invoices FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "finance_inv" ON public.invoices FOR ALL USING (can_access_finance(auth.uid()));

-- KYC_DOCUMENTS
CREATE POLICY "users_own_kyc" ON public.kyc_documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY "admin_kyc" ON public.kyc_documents FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- SECURITY_LOGS
CREATE POLICY "sys_sec_logs" ON public.security_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_sec_logs" ON public.security_logs FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

-- IP_LOCKS
CREATE POLICY "users_own_locks" ON public.ip_locks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admin_locks" ON public.ip_locks FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- AUDIT_LOGS
CREATE POLICY "sys_audit" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_audit" ON public.audit_logs FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

-- SYSTEM_HEALTH
CREATE POLICY "admin_health" ON public.system_health FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- FRAUD_ALERTS
CREATE POLICY "admin_fraud" ON public.fraud_alerts FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- INCIDENTS
CREATE POLICY "report_incident" ON public.incidents FOR INSERT WITH CHECK (reported_by = auth.uid());
CREATE POLICY "view_own_incident" ON public.incidents FOR SELECT USING (reported_by = auth.uid() OR assigned_to = auth.uid());
CREATE POLICY "admin_incident" ON public.incidents FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- RESEARCH_SUGGESTIONS
CREATE POLICY "submit_suggestion" ON public.research_suggestions FOR INSERT WITH CHECK (submitted_by = auth.uid());
CREATE POLICY "view_own_suggestion" ON public.research_suggestions FOR SELECT USING (submitted_by = auth.uid());
CREATE POLICY "admin_suggestion" ON public.research_suggestions FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- TRAINING_LOGS
CREATE POLICY "users_own_training" ON public.training_logs FOR ALL USING (user_id = auth.uid());
CREATE POLICY "admin_training" ON public.training_logs FOR SELECT USING (has_role(auth.uid(), 'super_admin'));

-- LEAD_CONVERSIONS
CREATE POLICY "finance_conversions" ON public.lead_conversions FOR ALL USING (can_access_finance(auth.uid()));

-- ROLES
CREATE POLICY "admin_roles" ON public.roles FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "view_roles" ON public.roles FOR SELECT USING (true);

-- ROLE_PERMISSIONS
CREATE POLICY "admin_role_perms" ON public.role_permissions FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "view_role_perms" ON public.role_permissions FOR SELECT USING (true);

-- =====================================================
-- INSERT DEFAULT ROLES
-- =====================================================
INSERT INTO public.roles (role_name, description) VALUES
    ('super_admin', 'Full system access and control'),
    ('franchise', 'Franchise partner access'),
    ('reseller', 'Reseller access'),
    ('developer', 'Developer access'),
    ('prime', 'Premium client access'),
    ('influencer', 'Affiliate and influencer access'),
    ('lead_manager', 'Lead management access'),
    ('task_manager', 'Task management access'),
    ('demo_manager', 'Demo management access'),
    ('finance_manager', 'Finance access'),
    ('support_agent', 'Support access'),
    ('sales_executive', 'Sales access'),
    ('seo_manager', 'SEO management access'),
    ('marketing_manager', 'Marketing access'),
    ('hr_manager', 'HR access'),
    ('legal_compliance', 'Legal and compliance access'),
    ('performance_manager', 'Performance tracking access'),
    ('client_success', 'Client success access'),
    ('rnd_manager', 'R&D access')
ON CONFLICT (role_name) DO NOTHING;