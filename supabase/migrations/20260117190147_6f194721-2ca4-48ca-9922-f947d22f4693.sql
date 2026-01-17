-- ====================================================
-- UNIFIED PLATFORM DATABASE SCHEMA - FINAL (CORRECTED)
-- ====================================================

-- Helper function to check if user is boss/super_admin
CREATE OR REPLACE FUNCTION public.is_platform_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1
    AND role IN ('super_admin', 'boss_owner', 'ceo', 'master')
  )
$$;

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS public.platform_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name TEXT NOT NULL UNIQUE,
    permission_json JSONB DEFAULT '{}',
    approval_required BOOLEAN DEFAULT false,
    hierarchy_level INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.platform_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES public.platform_roles(id) ON DELETE CASCADE,
    module TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('add', 'edit', 'delete', 'run', 'stop', 'pay', 'view')),
    allowed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(role_id, module, action)
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.platform_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0.0',
    demo_status TEXT DEFAULT 'draft' CHECK (demo_status IN ('draft', 'active', 'error', 'archived')),
    live_status TEXT DEFAULT 'offline' CHECK (live_status IN ('offline', 'online', 'maintenance')),
    created_by UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. DEMOS TABLE
CREATE TABLE IF NOT EXISTS public.platform_demos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.platform_products(id) ON DELETE CASCADE,
    server_id UUID,
    name TEXT NOT NULL,
    version TEXT DEFAULT '1.0.0',
    url TEXT,
    health_status TEXT DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'warning', 'error', 'unknown')),
    auto_repair BOOLEAN DEFAULT true,
    last_health_check TIMESTAMPTZ,
    error_log TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.platform_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL CHECK (source IN ('web', 'facebook', 'google', 'whatsapp', 'api', 'manual', 'seo', 'instagram')),
    nano_category TEXT,
    micro_category TEXT,
    sub_category TEXT,
    main_category TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost', 'idle')),
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    notes TEXT,
    score INTEGER DEFAULT 0,
    assigned_to UUID,
    product_interest UUID REFERENCES public.platform_products(id),
    metadata JSONB DEFAULT '{}',
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. SEO TASKS TABLE
CREATE TABLE IF NOT EXISTS public.platform_seo_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    domain TEXT,
    keyword TEXT,
    issue TEXT,
    issue_type TEXT CHECK (issue_type IN ('technical', 'content', 'backlink', 'speed', 'mobile', 'other')),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    auto_fix BOOLEAN DEFAULT true,
    fix_status TEXT DEFAULT 'pending' CHECK (fix_status IN ('pending', 'in_progress', 'fixed', 'failed', 'ignored')),
    seo_score INTEGER,
    traffic INTEGER DEFAULT 0,
    fixed_at TIMESTAMPTZ,
    fixed_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. AI SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.platform_ai_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video', 'voice', 'multimodal', 'custom')),
    provider TEXT,
    api_key_ref TEXT,
    model TEXT,
    status TEXT DEFAULT 'stopped' CHECK (status IN ('running', 'stopped', 'error', 'pending')),
    paid_status TEXT DEFAULT 'unpaid' CHECK (paid_status IN ('paid', 'unpaid', 'trial', 'overdue')),
    usage_today INTEGER DEFAULT 0,
    usage_month INTEGER DEFAULT 0,
    cost_today DECIMAL(10,2) DEFAULT 0,
    cost_month DECIMAL(10,2) DEFAULT 0,
    risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    auto_stop_on_unpaid BOOLEAN DEFAULT true,
    linked_module TEXT,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. API SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.platform_api_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider TEXT,
    type TEXT CHECK (type IN ('auth', 'payment', 'messaging', 'crm', 'seo', 'ai', 'server', 'analytics', 'storage', 'other')),
    linked_module TEXT,
    linked_ai_id UUID REFERENCES public.platform_ai_services(id),
    api_key_ref TEXT,
    endpoint TEXT,
    status TEXT DEFAULT 'stopped' CHECK (status IN ('running', 'stopped', 'error', 'pending')),
    billing_status TEXT DEFAULT 'unpaid' CHECK (billing_status IN ('paid', 'unpaid', 'trial', 'overdue')),
    usage_count INTEGER DEFAULT 0,
    last_call_at TIMESTAMPTZ,
    cost_per_call DECIMAL(10,4) DEFAULT 0,
    monthly_cost DECIMAL(10,2) DEFAULT 0,
    auto_stop_on_unpaid BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SERVERS TABLE
CREATE TABLE IF NOT EXISTS public.platform_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    ip TEXT,
    domain TEXT,
    region TEXT CHECK (region IN ('india', 'asia', 'middle_east', 'africa', 'europe', 'usa', 'other')),
    provider TEXT,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
    cpu_usage INTEGER DEFAULT 0,
    ram_usage INTEGER DEFAULT 0,
    disk_usage INTEGER DEFAULT 0,
    cost_monthly DECIMAL(10,2) DEFAULT 0,
    auto_scale BOOLEAN DEFAULT true,
    ssl_enabled BOOLEAN DEFAULT false,
    ssl_expiry TIMESTAMPTZ,
    last_heartbeat TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. BILLING TABLE
CREATE TABLE IF NOT EXISTS public.platform_billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL,
    module_id UUID,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    paid BOOLEAN DEFAULT false,
    paid_at TIMESTAMPTZ,
    paid_by UUID,
    due_date TIMESTAMPTZ,
    invoice_number TEXT,
    payment_method TEXT,
    auto_deduct BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. PLATFORM APPROVALS TABLE
CREATE TABLE IF NOT EXISTS public.platform_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_type TEXT NOT NULL CHECK (request_type IN ('demo', 'product', 'client', 'billing', 'deploy', 'server', 'api', 'delete', 'other')),
    request_data JSONB NOT NULL DEFAULT '{}',
    requester_id UUID,
    requester_role TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. PLATFORM LOGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    actor_id UUID,
    actor_role TEXT,
    actor_type TEXT DEFAULT 'user' CHECK (actor_type IN ('user', 'system', 'ai', 'automation')),
    module TEXT,
    entity_type TEXT,
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    payload JSONB DEFAULT '{}',
    ip_address TEXT,
    user_agent TEXT,
    severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'success')),
    is_sealed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. FILES TABLE
CREATE TABLE IF NOT EXISTS public.platform_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('document', 'image', 'video', 'archive', 'source', 'other')),
    mime_type TEXT,
    size_bytes BIGINT,
    storage_path TEXT,
    linked_module TEXT,
    linked_id UUID,
    ai_processed BOOLEAN DEFAULT false,
    ai_analysis JSONB,
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.platform_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    title TEXT NOT NULL,
    message TEXT,
    module TEXT,
    action_url TEXT,
    seen BOOLEAN DEFAULT false,
    seen_at TIMESTAMPTZ,
    dismissed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. AUTOMATION RULES TABLE
CREATE TABLE IF NOT EXISTS public.platform_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trigger_condition TEXT NOT NULL,
    trigger_module TEXT,
    action_type TEXT NOT NULL,
    action_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    trigger_count INTEGER DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 16. APK BUILDS TABLE
CREATE TABLE IF NOT EXISTS public.platform_apk_builds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.platform_products(id),
    demo_id UUID REFERENCES public.platform_demos(id),
    app_name TEXT NOT NULL,
    version TEXT DEFAULT '1.0.0',
    build_type TEXT CHECK (build_type IN ('debug', 'release', 'aab')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'building', 'ready', 'failed')),
    progress INTEGER DEFAULT 0,
    file_size TEXT,
    download_url TEXT,
    download_count INTEGER DEFAULT 0,
    error_log TEXT,
    signed BOOLEAN DEFAULT false,
    license_locked BOOLEAN DEFAULT true,
    built_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 17. VOICE COMMANDS TABLE
CREATE TABLE IF NOT EXISTS public.platform_voice_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    command_text TEXT NOT NULL,
    command_type TEXT CHECK (command_type IN ('voice', 'text', 'file')),
    ai_interpretation JSONB,
    executed_action TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.platform_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_seo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_ai_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_api_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_apk_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_voice_commands ENABLE ROW LEVEL SECURITY;

-- RLS Policies for all tables (Admin full access)
CREATE POLICY "Admin access platform_roles" ON public.platform_roles FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_permissions" ON public.platform_permissions FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_products" ON public.platform_products FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_demos" ON public.platform_demos FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_leads" ON public.platform_leads FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_seo_tasks" ON public.platform_seo_tasks FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_ai_services" ON public.platform_ai_services FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_api_services" ON public.platform_api_services FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_servers" ON public.platform_servers FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_billing" ON public.platform_billing FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_approvals" ON public.platform_approvals FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin view platform_logs" ON public.platform_logs FOR SELECT TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Insert platform_logs" ON public.platform_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin access platform_files" ON public.platform_files FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "View own notifications" ON public.platform_notifications FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin manage notifications" ON public.platform_notifications FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_automation_rules" ON public.platform_automation_rules FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "Admin access platform_apk_builds" ON public.platform_apk_builds FOR ALL TO authenticated USING (public.is_platform_admin(auth.uid()));
CREATE POLICY "User access platform_voice_commands" ON public.platform_voice_commands FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_platform_admin(auth.uid()));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_platform_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER trg_platform_roles_updated BEFORE UPDATE ON public.platform_roles FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_products_updated BEFORE UPDATE ON public.platform_products FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_demos_updated BEFORE UPDATE ON public.platform_demos FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_leads_updated BEFORE UPDATE ON public.platform_leads FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_seo_updated BEFORE UPDATE ON public.platform_seo_tasks FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_ai_updated BEFORE UPDATE ON public.platform_ai_services FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_api_updated BEFORE UPDATE ON public.platform_api_services FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_servers_updated BEFORE UPDATE ON public.platform_servers FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_billing_updated BEFORE UPDATE ON public.platform_billing FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_approvals_updated BEFORE UPDATE ON public.platform_approvals FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_files_updated BEFORE UPDATE ON public.platform_files FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();
CREATE TRIGGER trg_platform_automation_updated BEFORE UPDATE ON public.platform_automation_rules FOR EACH ROW EXECUTE FUNCTION public.update_platform_timestamp();

-- Insert default roles
INSERT INTO public.platform_roles (role_name, permission_json, approval_required, hierarchy_level) VALUES
  ('super_admin', '{"all": true}', false, 1),
  ('boss_owner', '{"all": true}', false, 2),
  ('ceo', '{"all": true}', false, 3),
  ('admin', '{"view": true, "add": true, "edit": true}', true, 10),
  ('manager', '{"view": true, "add": true}', true, 20),
  ('staff', '{"view": true}', true, 50)
ON CONFLICT (role_name) DO NOTHING;

-- Insert default automation rules
INSERT INTO public.platform_automation_rules (name, trigger_condition, trigger_module, action_type, action_data, is_active) VALUES
  ('Auto Stop Unpaid AI', 'paid_status = unpaid', 'ai_services', 'stop_service', '{"notify": true}', true),
  ('Auto Stop Unpaid API', 'billing_status = unpaid', 'api_services', 'stop_service', '{"notify": true}', true),
  ('Auto Repair Broken Demo', 'health_status = error', 'demos', 'repair_demo', '{"auto_repair": true}', true),
  ('Auto Reassign Idle Lead', 'status = idle', 'leads', 'reassign_lead', '{}', true),
  ('Auto Fix SEO Issues', 'auto_fix = true', 'seo_tasks', 'run_seo_fix', '{}', true),
  ('Scale Server on High Load', 'cpu_usage > 80', 'servers', 'scale_server', '{"increment": 1}', true)
ON CONFLICT DO NOTHING;