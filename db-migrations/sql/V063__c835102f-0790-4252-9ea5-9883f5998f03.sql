-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if any
DROP POLICY IF EXISTS "subscription_access" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;

-- SELECT: Owner or admin roles
CREATE POLICY "subscription_select_owner_or_admin"
ON subscriptions
FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'super_admin', 'master')
  )
);

-- INSERT: System can insert
CREATE POLICY "subscription_system_insert"
ON subscriptions
FOR INSERT
WITH CHECK (true);

-- UPDATE: Admin roles can update
CREATE POLICY "subscription_admin_update"
ON subscriptions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('super_admin', 'master')
  )
);