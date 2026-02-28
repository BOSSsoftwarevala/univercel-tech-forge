-- Create function to check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  )
$$;

-- Allow super_admin to view all user_roles
CREATE POLICY "super_admin_can_view_all_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_super_admin());

-- Allow super_admin to update any user_roles (for approving/rejecting)
CREATE POLICY "super_admin_can_update_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Allow super_admin to insert user_roles
CREATE POLICY "super_admin_can_insert_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin());

-- Allow super_admin to delete user_roles
CREATE POLICY "super_admin_can_delete_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_super_admin());