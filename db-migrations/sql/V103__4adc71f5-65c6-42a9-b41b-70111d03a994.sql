-- =====================================================
-- SECURITY FIX: Tighten remaining sensitive tables RLS (Part 2)
-- =====================================================

-- 10. client_projects - Only assigned and admins (use assigned_to not assigned_developer)
DROP POLICY IF EXISTS "Anyone can view client projects" ON public.client_projects;
DROP POLICY IF EXISTS "Client projects visible to all" ON public.client_projects;

CREATE POLICY "client_projects_select_restricted" 
ON public.client_projects FOR SELECT 
USING (
  auth.uid() = assigned_to
  OR public.has_role(auth.uid(), 'client_success'::app_role)
  OR public.has_privileged_role(auth.uid())
);

-- 11. user_support_tickets - Only owner and support staff
DROP POLICY IF EXISTS "Anyone can view support tickets" ON public.user_support_tickets;
DROP POLICY IF EXISTS "Support tickets visible to all" ON public.user_support_tickets;

CREATE POLICY "support_tickets_select_restricted" 
ON public.user_support_tickets FOR SELECT 
USING (
  auth.uid() = user_id 
  OR auth.uid() = assigned_to
  OR public.has_role(auth.uid(), 'support'::app_role)
  OR public.has_role(auth.uid(), 'client_success'::app_role)
  OR public.has_privileged_role(auth.uid())
);