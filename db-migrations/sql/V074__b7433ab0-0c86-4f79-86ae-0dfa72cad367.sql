-- Daily Demo ID tracking
CREATE TABLE public.demo_daily_ids (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    demo_id UUID REFERENCES public.demos(id) ON DELETE CASCADE,
    daily_id VARCHAR(20) NOT NULL UNIQUE,
    generated_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sequence_number INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Demo Orders linked to demos
CREATE TABLE public.demo_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number VARCHAR(30) NOT NULL UNIQUE,
    demo_id UUID REFERENCES public.demos(id) ON DELETE SET NULL,
    daily_demo_id VARCHAR(20) NOT NULL,
    client_name VARCHAR(255),
    client_email VARCHAR(255),
    client_domain VARCHAR(255),
    requirements JSONB DEFAULT '{}',
    order_status VARCHAR(50) DEFAULT 'generated',
    status_flow JSONB DEFAULT '["generated"]',
    software_package_id UUID,
    auto_detected BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    is_promoted BOOLEAN DEFAULT false,
    promoted_by UUID REFERENCES auth.users(id),
    promoted_at TIMESTAMPTZ,
    is_live BOOLEAN DEFAULT false,
    deployed_by UUID REFERENCES auth.users(id),
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Demo Deployments with license keys
CREATE TABLE public.demo_deployments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.demo_orders(id) ON DELETE CASCADE,
    demo_id UUID REFERENCES public.demos(id) ON DELETE SET NULL,
    daily_demo_id VARCHAR(20) NOT NULL,
    license_key VARCHAR(64) NOT NULL UNIQUE,
    license_key_hash VARCHAR(128),
    approved_domain VARCHAR(255) NOT NULL,
    approved_ips TEXT[],
    deployment_status VARCHAR(50) DEFAULT 'pending',
    is_domain_locked BOOLEAN DEFAULT true,
    is_encrypted BOOLEAN DEFAULT true,
    is_obfuscated BOOLEAN DEFAULT true,
    encryption_key_ref VARCHAR(64),
    last_verification_at TIMESTAMPTZ,
    verification_count INTEGER DEFAULT 0,
    blocked_attempts INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Security Lock Logs
CREATE TABLE public.demo_security_locks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    deployment_id UUID REFERENCES public.demo_deployments(id) ON DELETE CASCADE,
    license_key VARCHAR(64),
    request_domain VARCHAR(255),
    request_ip VARCHAR(50),
    request_user_agent TEXT,
    is_authorized BOOLEAN DEFAULT false,
    block_reason VARCHAR(255),
    was_auto_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Software Packages
CREATE TABLE public.demo_software_packages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.demo_orders(id) ON DELETE CASCADE,
    demo_id UUID REFERENCES public.demos(id) ON DELETE SET NULL,
    package_name VARCHAR(255),
    package_status VARCHAR(50) DEFAULT 'preparing',
    source_demo_snapshot JSONB,
    client_requirements JSONB,
    is_tested BOOLEAN DEFAULT false,
    tested_at TIMESTAMPTZ,
    tested_by UUID REFERENCES auth.users(id),
    test_results JSONB,
    is_ready BOOLEAN DEFAULT false,
    ready_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_daily_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_security_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_software_packages ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only master/super_admin/demo_manager can access
CREATE POLICY "Admin access demo_daily_ids" ON public.demo_daily_ids
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

CREATE POLICY "Admin access demo_orders" ON public.demo_orders
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

CREATE POLICY "Admin access demo_deployments" ON public.demo_deployments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

CREATE POLICY "Admin access demo_security_locks" ON public.demo_security_locks
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

CREATE POLICY "Admin access demo_software_packages" ON public.demo_software_packages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'demo_manager'))
    );

-- Function to generate daily demo ID
CREATE OR REPLACE FUNCTION public.generate_daily_demo_id(p_demo_id UUID)
RETURNS VARCHAR(20)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_date_str VARCHAR(8);
    v_sequence INTEGER;
    v_daily_id VARCHAR(20);
BEGIN
    v_date_str := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    
    -- Get next sequence for today
    SELECT COALESCE(MAX(sequence_number), 0) + 1 INTO v_sequence
    FROM demo_daily_ids
    WHERE generated_date = CURRENT_DATE;
    
    -- Format: DEMO-YYYYMMDD-XXX
    v_daily_id := 'DEMO-' || v_date_str || '-' || LPAD(v_sequence::TEXT, 3, '0');
    
    -- Insert record
    INSERT INTO demo_daily_ids (demo_id, daily_id, generated_date, sequence_number, created_by)
    VALUES (p_demo_id, v_daily_id, CURRENT_DATE, v_sequence, auth.uid());
    
    RETURN v_daily_id;
END;
$$;

-- Function to generate license key
CREATE OR REPLACE FUNCTION public.generate_deployment_license()
RETURNS VARCHAR(64)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_license VARCHAR(64);
BEGIN
    v_license := encode(gen_random_bytes(32), 'hex');
    RETURN v_license;
END;
$$;

-- Function to verify deployment request
CREATE OR REPLACE FUNCTION public.verify_deployment_request(
    p_license_key VARCHAR(64),
    p_request_domain VARCHAR(255),
    p_request_ip VARCHAR(50),
    p_user_agent TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_deployment RECORD;
    v_is_authorized BOOLEAN := false;
    v_block_reason VARCHAR(255);
BEGIN
    -- Find deployment
    SELECT * INTO v_deployment 
    FROM demo_deployments 
    WHERE license_key = p_license_key AND is_active = true;
    
    IF v_deployment IS NULL THEN
        v_block_reason := 'Invalid or expired license key';
    ELSIF v_deployment.expires_at IS NOT NULL AND v_deployment.expires_at < now() THEN
        v_block_reason := 'License has expired';
    ELSIF v_deployment.is_domain_locked AND v_deployment.approved_domain != p_request_domain THEN
        v_block_reason := 'Unauthorized domain: ' || p_request_domain;
    ELSIF v_deployment.approved_ips IS NOT NULL AND array_length(v_deployment.approved_ips, 1) > 0 
          AND NOT (p_request_ip = ANY(v_deployment.approved_ips)) THEN
        v_block_reason := 'Unauthorized IP: ' || p_request_ip;
    ELSE
        v_is_authorized := true;
    END IF;
    
    -- Log the request
    INSERT INTO demo_security_locks (
        deployment_id, license_key, request_domain, request_ip, 
        request_user_agent, is_authorized, block_reason, was_auto_blocked
    ) VALUES (
        v_deployment.id, p_license_key, p_request_domain, p_request_ip,
        p_user_agent, v_is_authorized, v_block_reason, NOT v_is_authorized
    );
    
    -- Update deployment stats
    IF v_deployment.id IS NOT NULL THEN
        UPDATE demo_deployments
        SET last_verification_at = now(),
            verification_count = verification_count + 1,
            blocked_attempts = CASE WHEN v_is_authorized THEN blocked_attempts ELSE blocked_attempts + 1 END
        WHERE id = v_deployment.id;
    END IF;
    
    RETURN jsonb_build_object(
        'authorized', v_is_authorized,
        'reason', v_block_reason,
        'deployment_id', v_deployment.id
    );
END;
$$;

-- Function to create order from demo
CREATE OR REPLACE FUNCTION public.create_demo_order(
    p_demo_id UUID,
    p_client_name VARCHAR(255),
    p_client_email VARCHAR(255),
    p_client_domain VARCHAR(255),
    p_requirements JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_daily_id VARCHAR(20);
    v_order_id UUID;
    v_order_number VARCHAR(30);
    v_package_id UUID;
BEGIN
    -- Get or generate daily demo ID
    SELECT daily_id INTO v_daily_id 
    FROM demo_daily_ids 
    WHERE demo_id = p_demo_id AND generated_date = CURRENT_DATE
    LIMIT 1;
    
    IF v_daily_id IS NULL THEN
        v_daily_id := generate_daily_demo_id(p_demo_id);
    END IF;
    
    -- Generate order number
    v_order_number := 'ORD-' || TO_CHAR(now(), 'YYYYMMDD-HH24MISS') || '-' || LPAD((random() * 999)::INTEGER::TEXT, 3, '0');
    
    -- Create order
    INSERT INTO demo_orders (
        order_number, demo_id, daily_demo_id, client_name, client_email,
        client_domain, requirements, order_status, auto_detected
    ) VALUES (
        v_order_number, p_demo_id, v_daily_id, p_client_name, p_client_email,
        p_client_domain, p_requirements, 'generated', true
    ) RETURNING id INTO v_order_id;
    
    -- Create software package
    INSERT INTO demo_software_packages (order_id, demo_id, package_name, package_status, client_requirements)
    VALUES (v_order_id, p_demo_id, 'Package for ' || v_order_number, 'preparing', p_requirements)
    RETURNING id INTO v_package_id;
    
    -- Link package to order
    UPDATE demo_orders SET software_package_id = v_package_id WHERE id = v_order_id;
    
    -- Log action
    INSERT INTO audit_logs (user_id, action, module, meta_json)
    VALUES (auth.uid(), 'demo_order_created', 'demo', jsonb_build_object(
        'order_id', v_order_id,
        'demo_id', p_demo_id,
        'daily_demo_id', v_daily_id,
        'client_domain', p_client_domain
    ));
    
    RETURN v_order_id;
END;
$$;

-- Indexes for performance
CREATE INDEX idx_demo_daily_ids_date ON public.demo_daily_ids(generated_date);
CREATE INDEX idx_demo_daily_ids_demo ON public.demo_daily_ids(demo_id);
CREATE INDEX idx_demo_orders_demo ON public.demo_orders(demo_id);
CREATE INDEX idx_demo_orders_status ON public.demo_orders(order_status);
CREATE INDEX idx_demo_deployments_license ON public.demo_deployments(license_key);
CREATE INDEX idx_demo_deployments_domain ON public.demo_deployments(approved_domain);
CREATE INDEX idx_demo_security_locks_deployment ON public.demo_security_locks(deployment_id);
CREATE INDEX idx_demo_security_locks_domain ON public.demo_security_locks(request_domain);