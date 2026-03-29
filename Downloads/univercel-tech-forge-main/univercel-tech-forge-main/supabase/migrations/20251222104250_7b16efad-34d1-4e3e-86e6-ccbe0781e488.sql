-- Step 2: Add approval columns and functions

-- Add approval_status column to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';

-- Add constraint separately to handle existing data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'user_roles_approval_status_check'
  ) THEN
    ALTER TABLE public.user_roles 
    ADD CONSTRAINT user_roles_approval_status_check 
    CHECK (approval_status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Add approved_by and approved_at columns for audit
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Auto-approve existing SUPER_ADMIN users (master will be done separately)
UPDATE public.user_roles 
SET approval_status = 'approved', approved_at = now()
WHERE role = 'super_admin' AND approval_status = 'pending';

-- Create function to auto-approve privileged roles on insert
CREATE OR REPLACE FUNCTION public.auto_approve_privileged_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Auto-approve MASTER and SUPER_ADMIN roles
  IF NEW.role::text IN ('master', 'super_admin') THEN
    NEW.approval_status := 'approved';
    NEW.approved_at := now();
  ELSE
    -- All other roles start as pending
    NEW.approval_status := COALESCE(NEW.approval_status, 'pending');
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auto-approval
DROP TRIGGER IF EXISTS trigger_auto_approve_roles ON public.user_roles;
CREATE TRIGGER trigger_auto_approve_roles
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_approve_privileged_roles();

-- Drop old policy first
DROP POLICY IF EXISTS "Super admin manages roles" ON public.user_roles;

-- Update RLS policy to allow master role same access as super_admin
DROP POLICY IF EXISTS "Master and Super Admin manage roles" ON public.user_roles;
CREATE POLICY "Master and Super Admin manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role::text IN ('master', 'super_admin')
  )
);

-- Add helper function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
    AND approval_status = 'approved'
  )
$$;

-- Add helper function to check if user has privileged role (auto-access)
CREATE OR REPLACE FUNCTION public.has_privileged_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
    AND role::text IN ('master', 'super_admin')
  )
$$;

-- Function to approve a user (called by Master/Super Admin)
CREATE OR REPLACE FUNCTION public.approve_user(_target_user_id uuid, _approver_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if approver has privileged role
  IF NOT public.has_privileged_role(_approver_id) THEN
    RAISE EXCEPTION 'Only Master or Super Admin can approve users';
  END IF;
  
  UPDATE public.user_roles
  SET 
    approval_status = 'approved',
    approved_by = _approver_id,
    approved_at = now()
  WHERE user_id = _target_user_id;
  
  RETURN FOUND;
END;
$$;

-- Function to reject a user
CREATE OR REPLACE FUNCTION public.reject_user(_target_user_id uuid, _rejector_id uuid, _reason text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if rejector has privileged role
  IF NOT public.has_privileged_role(_rejector_id) THEN
    RAISE EXCEPTION 'Only Master or Super Admin can reject users';
  END IF;
  
  UPDATE public.user_roles
  SET 
    approval_status = 'rejected',
    approved_by = _rejector_id,
    approved_at = now(),
    rejection_reason = _reason
  WHERE user_id = _target_user_id;
  
  RETURN FOUND;
END;
$$;