-- =============================================
-- SECURITY FIX: Add RLS to sensitive tables
-- =============================================

-- 1. PERMISSIONS table - only authenticated users can read
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view permissions" ON public.permissions;
CREATE POLICY "Authenticated users can view permissions" 
ON public.permissions FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only super admin can manage permissions" ON public.permissions;
CREATE POLICY "Only super admin can manage permissions" 
ON public.permissions FOR ALL 
TO authenticated
USING (public.is_super_admin());

-- 2. ROLE_PERMISSIONS table - only authenticated users can read
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view role permissions" ON public.role_permissions;
CREATE POLICY "Authenticated users can view role permissions" 
ON public.role_permissions FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only super admin can manage role permissions" ON public.role_permissions;
CREATE POLICY "Only super admin can manage role permissions" 
ON public.role_permissions FOR ALL 
TO authenticated
USING (public.is_super_admin());

-- 3. ROLES table - only authenticated users can read
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.roles;
CREATE POLICY "Authenticated users can view roles" 
ON public.roles FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only super admin can manage roles" ON public.roles;
CREATE POLICY "Only super admin can manage roles" 
ON public.roles FOR ALL 
TO authenticated
USING (public.is_super_admin());

-- 4. SAFE_ASSIST_MASK_PATTERNS - security sensitive, restrict to admins only
ALTER TABLE public.safe_assist_mask_patterns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can view mask patterns" ON public.safe_assist_mask_patterns;
CREATE POLICY "Only admins can view mask patterns" 
ON public.safe_assist_mask_patterns FOR SELECT 
TO authenticated
USING (public.is_super_admin());

DROP POLICY IF EXISTS "Only super admin can manage mask patterns" ON public.safe_assist_mask_patterns;
CREATE POLICY "Only super admin can manage mask patterns" 
ON public.safe_assist_mask_patterns FOR ALL 
TO authenticated
USING (public.is_super_admin());

-- 5. SERVER_PLANS - pricing info, require auth
ALTER TABLE public.server_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view server plans" ON public.server_plans;
CREATE POLICY "Authenticated users can view server plans" 
ON public.server_plans FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only super admin can manage server plans" ON public.server_plans;
CREATE POLICY "Only super admin can manage server plans" 
ON public.server_plans FOR ALL 
TO authenticated
USING (public.is_super_admin());

-- 6. REGIONAL_TAX_RULES - financial config, require auth
ALTER TABLE public.regional_tax_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view tax rules" ON public.regional_tax_rules;
CREATE POLICY "Authenticated users can view tax rules" 
ON public.regional_tax_rules FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only super admin can manage tax rules" ON public.regional_tax_rules;
CREATE POLICY "Only super admin can manage tax rules" 
ON public.regional_tax_rules FOR ALL 
TO authenticated
USING (public.is_super_admin());

-- 7. DATA_RESIDENCY_CONFIG - governance data, require auth
ALTER TABLE public.data_residency_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view data residency" ON public.data_residency_config;
CREATE POLICY "Authenticated users can view data residency" 
ON public.data_residency_config FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only super admin can manage data residency" ON public.data_residency_config;
CREATE POLICY "Only super admin can manage data residency" 
ON public.data_residency_config FOR ALL 
TO authenticated
USING (public.is_super_admin());

-- 8. REGIONAL_COMPLIANCE_REQUIREMENTS - compliance data, require auth
ALTER TABLE public.regional_compliance_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view compliance requirements" ON public.regional_compliance_requirements;
CREATE POLICY "Authenticated users can view compliance requirements" 
ON public.regional_compliance_requirements FOR SELECT 
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only super admin can manage compliance" ON public.regional_compliance_requirements;
CREATE POLICY "Only super admin can manage compliance" 
ON public.regional_compliance_requirements FOR ALL 
TO authenticated
USING (public.is_super_admin());