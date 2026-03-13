-- Update auto-approval trigger to include prime users for instant access
CREATE OR REPLACE FUNCTION public.auto_approve_privileged_roles()
RETURNS TRIGGER AS $$
BEGIN
  -- Master, super_admin, and prime users get auto-approved
  IF NEW.role IN ('master', 'super_admin', 'prime') THEN
    NEW.approval_status := 'approved';
    NEW.approved_at := NOW();
  ELSE
    -- All other roles require manual approval
    NEW.approval_status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;