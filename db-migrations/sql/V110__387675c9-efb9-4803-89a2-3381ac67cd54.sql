
-- =============================================
-- CRITICAL SECURITY FIX: RLS Policies for Sensitive Tables
-- =============================================

-- 1. user_profiles RLS (has user_id)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile" 
ON public.user_profiles FOR SELECT 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 2. kyc_documents RLS (has user_id)
DROP POLICY IF EXISTS "Users can view own KYC" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can insert own KYC" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can update own KYC" ON public.kyc_documents;

CREATE POLICY "Users can view own KYC" 
ON public.kyc_documents FOR SELECT 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

CREATE POLICY "Users can insert own KYC" 
ON public.kyc_documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own KYC" 
ON public.kyc_documents FOR UPDATE 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

-- 3. wallets RLS (has user_id)
DROP POLICY IF EXISTS "Users can view own wallet" ON public.wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;

CREATE POLICY "Users can view own wallet" 
ON public.wallets FOR SELECT 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

CREATE POLICY "Users can update own wallet" 
ON public.wallets FOR UPDATE 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

-- 4. developer_registrations RLS (has user_id)
DROP POLICY IF EXISTS "Developers can view own registration" ON public.developer_registrations;
DROP POLICY IF EXISTS "Developers can insert own registration" ON public.developer_registrations;

CREATE POLICY "Developers can view own registration" 
ON public.developer_registrations FOR SELECT 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

CREATE POLICY "Developers can insert own registration" 
ON public.developer_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. leads RLS (has assigned_to, created_by)
DROP POLICY IF EXISTS "Users can view assigned leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update assigned leads" ON public.leads;

CREATE POLICY "Users can view assigned leads" 
ON public.leads FOR SELECT 
USING (
  auth.uid() = assigned_to 
  OR auth.uid() = created_by 
  OR public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'lead_manager')
  OR public.has_role(auth.uid(), 'franchise')
  OR public.has_role(auth.uid(), 'reseller')
);

CREATE POLICY "Users can insert leads" 
ON public.leads FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned leads" 
ON public.leads FOR UPDATE 
USING (
  auth.uid() = assigned_to 
  OR public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'lead_manager')
);

-- 6. franchise_accounts RLS (has user_id)
DROP POLICY IF EXISTS "Franchise owners can view own account" ON public.franchise_accounts;
DROP POLICY IF EXISTS "Franchise owners can update own account" ON public.franchise_accounts;

CREATE POLICY "Franchise owners can view own account" 
ON public.franchise_accounts FOR SELECT 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

CREATE POLICY "Franchise owners can update own account" 
ON public.franchise_accounts FOR UPDATE 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

-- 7. reseller_accounts RLS (has user_id)
DROP POLICY IF EXISTS "Resellers can view own account" ON public.reseller_accounts;
DROP POLICY IF EXISTS "Resellers can update own account" ON public.reseller_accounts;

CREATE POLICY "Resellers can view own account" 
ON public.reseller_accounts FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'franchise')
);

CREATE POLICY "Resellers can update own account" 
ON public.reseller_accounts FOR UPDATE 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

-- 8. influencer_accounts RLS (has user_id)
DROP POLICY IF EXISTS "Influencers can view own account" ON public.influencer_accounts;
DROP POLICY IF EXISTS "Influencers can update own account" ON public.influencer_accounts;

CREATE POLICY "Influencers can view own account" 
ON public.influencer_accounts FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'marketing_manager')
);

CREATE POLICY "Influencers can update own account" 
ON public.influencer_accounts FOR UPDATE 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

-- 9. payout_requests RLS (has user_id)
DROP POLICY IF EXISTS "Users can view own payouts" ON public.payout_requests;
DROP POLICY IF EXISTS "Users can insert own payout requests" ON public.payout_requests;
DROP POLICY IF EXISTS "Finance can update payouts" ON public.payout_requests;

CREATE POLICY "Users can view own payouts" 
ON public.payout_requests FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "Users can insert own payout requests" 
ON public.payout_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Finance can update payouts" 
ON public.payout_requests FOR UPDATE 
USING (
  public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'finance_manager')
);

-- 10. developers RLS (has user_id)
DROP POLICY IF EXISTS "Developers can view own record" ON public.developers;
DROP POLICY IF EXISTS "Developers can update own record" ON public.developers;

CREATE POLICY "Developers can view own record" 
ON public.developers FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'task_manager')
);

CREATE POLICY "Developers can update own record" 
ON public.developers FOR UPDATE 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

-- 11. transactions RLS (has related_user)
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;

CREATE POLICY "Users can view own transactions" 
ON public.transactions FOR SELECT 
USING (
  auth.uid() = related_user 
  OR public.has_privileged_role(auth.uid())
  OR public.has_role(auth.uid(), 'finance_manager')
);

-- 12. prime_user_profiles RLS (has user_id)
DROP POLICY IF EXISTS "Prime users can view own profile" ON public.prime_user_profiles;
DROP POLICY IF EXISTS "Prime users can update own profile" ON public.prime_user_profiles;
DROP POLICY IF EXISTS "Prime users can insert own profile" ON public.prime_user_profiles;

CREATE POLICY "Prime users can view own profile" 
ON public.prime_user_profiles FOR SELECT 
USING (auth.uid() = user_id OR public.has_privileged_role(auth.uid()));

CREATE POLICY "Prime users can update own profile" 
ON public.prime_user_profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Prime users can insert own profile" 
ON public.prime_user_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);
