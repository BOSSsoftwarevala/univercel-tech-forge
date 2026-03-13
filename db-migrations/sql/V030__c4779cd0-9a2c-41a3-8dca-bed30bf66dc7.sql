-- Add force_logged_out_at column to user_roles for force logout tracking
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS force_logged_out_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS force_logged_out_by UUID DEFAULT NULL;

-- Update auto-approval trigger to only auto-approve master and super_admin
CREATE OR REPLACE FUNCTION public.auto_approve_privileged_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Only master and super_admin get auto-approved
  IF NEW.role IN ('master', 'super_admin') THEN
    NEW.approval_status := 'approved';
    NEW.approved_at := NOW();
  ELSE
    -- All other roles require manual approval
    NEW.approval_status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop and recreate trigger to ensure it uses updated function
DROP TRIGGER IF EXISTS trigger_auto_approve_privileged ON public.user_roles;

CREATE TRIGGER trigger_auto_approve_privileged
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_approve_privileged_roles();

-- Function for Master Admin to force logout any user
CREATE OR REPLACE FUNCTION public.force_logout_user(target_user_id UUID, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  admin_role TEXT;
BEGIN
  -- Verify the admin is a master
  SELECT role INTO admin_role FROM public.user_roles WHERE user_id = admin_user_id;
  
  IF admin_role != 'master' THEN
    RAISE EXCEPTION 'Only Master Admin can force logout users';
  END IF;
  
  -- Update the target user's force logout timestamp
  UPDATE public.user_roles 
  SET force_logged_out_at = NOW(),
      force_logged_out_by = admin_user_id
  WHERE user_id = target_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check if user was force logged out
CREATE OR REPLACE FUNCTION public.check_force_logout(check_user_id UUID)
RETURNS TIMESTAMPTZ AS $$
DECLARE
  logout_time TIMESTAMPTZ;
BEGIN
  SELECT force_logged_out_at INTO logout_time 
  FROM public.user_roles 
  WHERE user_id = check_user_id;
  
  RETURN logout_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to clear force logout (when user logs back in)
CREATE OR REPLACE FUNCTION public.clear_force_logout(clear_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.user_roles 
  SET force_logged_out_at = NULL,
      force_logged_out_by = NULL
  WHERE user_id = clear_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get users for approval (excluding master from non-master views)
CREATE OR REPLACE FUNCTION public.get_users_for_approval(viewer_role TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  role TEXT,
  approval_status TEXT,
  created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID
) AS $$
BEGIN
  IF viewer_role = 'master' THEN
    -- Master can see all users
    RETURN QUERY SELECT 
      ur.id, ur.user_id, ur.role::TEXT, ur.approval_status, 
      ur.created_at, ur.approved_at, ur.approved_by
    FROM public.user_roles ur;
  ELSE
    -- Super Admin and others cannot see Master users
    RETURN QUERY SELECT 
      ur.id, ur.user_id, ur.role::TEXT, ur.approval_status, 
      ur.created_at, ur.approved_at, ur.approved_by
    FROM public.user_roles ur
    WHERE ur.role != 'master';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RLS policy update: Hide master users from non-master roles
DROP POLICY IF EXISTS "Users can view user roles" ON public.user_roles;

CREATE POLICY "Users can view user roles based on hierarchy"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  -- Users can always see their own role
  user_id = auth.uid()
  OR
  -- Master can see everyone
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'master')
  OR
  -- Super Admin can see everyone except master
  (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
   AND role != 'master')
);