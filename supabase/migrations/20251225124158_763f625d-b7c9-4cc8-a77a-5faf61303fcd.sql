-- Step 2: Update all existing references from 'admin' to 'area_manager' in user_roles
UPDATE public.user_roles SET role = 'area_manager' WHERE role = 'admin';

-- Step 3: Update any other tables that reference the admin role
UPDATE public.ai_insights SET related_role = 'area_manager' WHERE related_role = 'admin';
UPDATE public.ai_qr_scan_logs SET scanner_role = 'area_manager' WHERE scanner_role = 'admin';
UPDATE public.ai_usage_logs SET user_role = 'area_manager' WHERE user_role = 'admin';
UPDATE public.assist_eligibility_settings SET role = 'area_manager' WHERE role = 'admin';
UPDATE public.assist_force_end_logs SET ended_by_role = 'area_manager' WHERE ended_by_role = 'admin';
UPDATE public.assist_request_queue SET requesting_user_role = 'area_manager' WHERE requesting_user_role = 'admin';
UPDATE public.audit_logs SET role = 'area_manager' WHERE role = 'admin';
UPDATE public.buzzer_queue SET role_target = 'area_manager' WHERE role_target = 'admin';
UPDATE public.chat_threads SET related_role = 'area_manager' WHERE related_role = 'admin';
UPDATE public.commission_fraud_detection SET user_role = 'area_manager' WHERE user_role = 'admin';
UPDATE public.compliance_audit_trail SET actor_role = 'area_manager' WHERE actor_role = 'admin';

-- Step 4: Rename admin_area_manager table to area_manager_accounts for clarity
ALTER TABLE IF EXISTS public.admin_area_manager RENAME TO area_manager_accounts;

-- Step 5: Add region column to area_manager_accounts if not exists
ALTER TABLE public.area_manager_accounts 
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS assigned_countries TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS can_export_data BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_access_other_regions BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS daily_report_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS weekly_report_enabled BOOLEAN DEFAULT true;

-- Step 6: Create reporting function for Area Manager
CREATE OR REPLACE FUNCTION public.get_area_manager_region(_user_id uuid)
RETURNS TEXT
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT country FROM public.area_manager_accounts WHERE user_id = _user_id LIMIT 1
$$;

-- Step 7: Create function to check if user is in Area Manager's region
CREATE OR REPLACE FUNCTION public.is_in_area_manager_region(_area_manager_id uuid, _target_user_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_region TEXT;
BEGIN
  -- Get area manager's assigned countries
  SELECT country INTO v_region FROM public.area_manager_accounts WHERE user_id = _area_manager_id;
  
  -- Check if target user is in the same region
  IF EXISTS (
    SELECT 1 FROM public.franchise_accounts WHERE user_id = _target_user_id AND country = v_region
  ) OR EXISTS (
    SELECT 1 FROM public.reseller_accounts WHERE user_id = _target_user_id AND country = v_region  
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Step 8: Add RLS policy for area_manager_accounts
ALTER TABLE public.area_manager_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Area managers can view their own record" ON public.area_manager_accounts;
DROP POLICY IF EXISTS "Super admins can manage area managers" ON public.area_manager_accounts;

CREATE POLICY "Area managers can view their own record"
ON public.area_manager_accounts
FOR SELECT
USING (
  auth.uid() = user_id 
  OR public.has_role(auth.uid(), 'super_admin')
  OR public.has_role(auth.uid(), 'master')
);

CREATE POLICY "Super admins can manage area managers"
ON public.area_manager_accounts
FOR ALL
USING (
  public.has_role(auth.uid(), 'super_admin')
  OR public.has_role(auth.uid(), 'master')
);