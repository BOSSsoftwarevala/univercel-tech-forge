-- =====================================================
-- SECURITY FIX: Part 3 - More sensitive tables
-- =====================================================

-- 1. developers table - Only owner and HR/task managers
DROP POLICY IF EXISTS "Developers can view all developers" ON public.developers;
DROP POLICY IF EXISTS "Anyone can view developers" ON public.developers;
DROP POLICY IF EXISTS "developers_select_restricted" ON public.developers;

CREATE POLICY "developers_select_own_or_managers" 
ON public.developers FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'hr_manager'::app_role)
  OR public.has_role(auth.uid(), 'task_manager'::app_role)
  OR public.has_privileged_role(auth.uid())
);

-- 2. franchise_accounts - Only owner and admins
DROP POLICY IF EXISTS "Franchises view all" ON public.franchise_accounts;
DROP POLICY IF EXISTS "Anyone can view franchise accounts" ON public.franchise_accounts;
DROP POLICY IF EXISTS "franchise_accounts_select_restricted" ON public.franchise_accounts;

CREATE POLICY "franchise_accounts_select_own_or_admin" 
ON public.franchise_accounts FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_privileged_role(auth.uid())
);

-- 3. reseller_accounts - Only owner and managers
DROP POLICY IF EXISTS "Resellers view all" ON public.reseller_accounts;
DROP POLICY IF EXISTS "Anyone can view reseller accounts" ON public.reseller_accounts;
DROP POLICY IF EXISTS "reseller_accounts_select_restricted" ON public.reseller_accounts;

CREATE POLICY "reseller_accounts_select_own_or_managers" 
ON public.reseller_accounts FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.can_manage_resellers(auth.uid())
  OR public.has_privileged_role(auth.uid())
);

-- 4. influencer_accounts - Only owner and admins
DROP POLICY IF EXISTS "Influencers view all" ON public.influencer_accounts;
DROP POLICY IF EXISTS "Anyone can view influencer accounts" ON public.influencer_accounts;
DROP POLICY IF EXISTS "influencer_accounts_select_restricted" ON public.influencer_accounts;

CREATE POLICY "influencer_accounts_select_own_or_admin" 
ON public.influencer_accounts FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_privileged_role(auth.uid())
);

-- 5. prime_user_profiles - Only owner and support staff
DROP POLICY IF EXISTS "Prime users view all" ON public.prime_user_profiles;
DROP POLICY IF EXISTS "Anyone can view prime profiles" ON public.prime_user_profiles;
DROP POLICY IF EXISTS "prime_user_profiles_select_restricted" ON public.prime_user_profiles;

CREATE POLICY "prime_user_profiles_select_own_or_support" 
ON public.prime_user_profiles FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'client_success'::app_role)
  OR public.has_privileged_role(auth.uid())
);

-- 6. developer_registrations - Only owner and HR
DROP POLICY IF EXISTS "Anyone can view developer registrations" ON public.developer_registrations;
DROP POLICY IF EXISTS "developer_registrations_select_restricted" ON public.developer_registrations;

CREATE POLICY "developer_registrations_select_own_or_hr" 
ON public.developer_registrations FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'hr_manager'::app_role)
  OR public.has_privileged_role(auth.uid())
);

-- 7. kyc_documents - Only owner and legal/compliance
DROP POLICY IF EXISTS "Anyone can view KYC documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "kyc_documents_select_restricted" ON public.kyc_documents;

CREATE POLICY "kyc_documents_select_own_or_legal" 
ON public.kyc_documents FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'legal_compliance'::app_role)
  OR public.has_privileged_role(auth.uid())
);

-- 8. demo_login_credentials - Only demo managers
DROP POLICY IF EXISTS "Anyone can view demo credentials" ON public.demo_login_credentials;
DROP POLICY IF EXISTS "Public can view demo credentials" ON public.demo_login_credentials;
DROP POLICY IF EXISTS "demo_credentials_select_restricted" ON public.demo_login_credentials;

CREATE POLICY "demo_credentials_select_demo_managers" 
ON public.demo_login_credentials FOR SELECT 
USING (
  public.is_demo_manager(auth.uid())
  OR public.has_privileged_role(auth.uid())
);

-- 9. leads - Only assigned users and lead managers
DROP POLICY IF EXISTS "Anyone can view leads" ON public.leads;
DROP POLICY IF EXISTS "Leads visible to all authenticated" ON public.leads;
DROP POLICY IF EXISTS "leads_select_restricted" ON public.leads;

CREATE POLICY "leads_select_assigned_or_managers" 
ON public.leads FOR SELECT 
USING (
  auth.uid() = assigned_to 
  OR auth.uid() = created_by
  OR public.has_role(auth.uid(), 'lead_manager'::app_role)
  OR public.has_role(auth.uid(), 'franchise'::app_role)
  OR public.has_privileged_role(auth.uid())
);