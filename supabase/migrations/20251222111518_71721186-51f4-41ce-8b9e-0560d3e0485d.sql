-- Function to force logout all non-master users
CREATE OR REPLACE FUNCTION public.force_logout_all_except_master(admin_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  -- Verify the admin is a master
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = admin_user_id AND role = 'master'
  ) THEN
    RAISE EXCEPTION 'Only Master Admin can force logout all users';
  END IF;
  
  -- Update all non-master users
  UPDATE public.user_roles 
  SET force_logged_out_at = NOW(),
      force_logged_out_by = admin_user_id
  WHERE role != 'master';
  
  GET DIAGNOSTICS affected_count = ROW_COUNT;
  
  RETURN affected_count;
END;
$$;