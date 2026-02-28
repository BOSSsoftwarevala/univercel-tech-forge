-- Fix demos table RLS - remove overly permissive policies and add proper authenticated access

-- Drop the permissive public policies
DROP POLICY IF EXISTS "Anyone can view demos" ON demos;
DROP POLICY IF EXISTS "Public can view active demos" ON demos;

-- Create proper authenticated-only policies
-- Authenticated users can view active demos only
CREATE POLICY "authenticated_view_active_demos" ON demos
FOR SELECT TO authenticated
USING (status = 'active');

-- Admin/super_admin/master can view ALL demos (including inactive)
CREATE POLICY "admins_view_all_demos" ON demos
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'master')
  )
);

-- Admin/super_admin/master can insert demos
CREATE POLICY "admins_insert_demos" ON demos
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'master')
  )
);

-- Admin/super_admin/master can update demos
CREATE POLICY "admins_update_demos" ON demos
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'master')
  )
);

-- Admin/super_admin/master can delete demos
CREATE POLICY "admins_delete_demos" ON demos
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'super_admin', 'master')
  )
);