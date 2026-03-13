-- =====================================================
-- SECURITY FIX: Tighten profiles table RLS
-- =====================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Create restrictive policy - users can only view their own profile OR admins can view all
CREATE POLICY "profiles_select_restricted" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() = user_id 
  OR public.has_privileged_role(auth.uid())
);