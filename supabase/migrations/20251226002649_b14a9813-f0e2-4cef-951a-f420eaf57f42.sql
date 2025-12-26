-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Super admins can manage approvals" ON public.sa_approval_queue;
DROP POLICY IF EXISTS "Super admins can view approval queue" ON public.sa_approval_queue;
DROP POLICY IF EXISTS "Users can create approval requests" ON public.sa_approval_queue;

-- Create proper RLS policies for sa_approval_queue

-- Super admins can view all approval requests
CREATE POLICY "Super admins can view approval queue"
ON public.sa_approval_queue
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin'::app_role) OR 
  public.has_role(auth.uid(), 'master'::app_role)
);

-- Super admins can update approval requests (approve/reject)
CREATE POLICY "Super admins can update approvals"
ON public.sa_approval_queue
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin'::app_role) OR 
  public.has_role(auth.uid(), 'master'::app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin'::app_role) OR 
  public.has_role(auth.uid(), 'master'::app_role)
);

-- Super admins can delete approval requests
CREATE POLICY "Super admins can delete approvals"
ON public.sa_approval_queue
FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'super_admin'::app_role) OR 
  public.has_role(auth.uid(), 'master'::app_role)
);

-- Authenticated users can create approval requests
CREATE POLICY "Authenticated users can create approval requests"
ON public.sa_approval_queue
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also fix the user_roles UPDATE policy if missing with_check
DROP POLICY IF EXISTS "super_admin_can_update_roles" ON public.user_roles;

CREATE POLICY "super_admin_can_update_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());