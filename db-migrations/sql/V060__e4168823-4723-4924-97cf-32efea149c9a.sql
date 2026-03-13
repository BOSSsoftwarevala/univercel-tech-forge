-- =============================================
-- SECURITY FIXES PART 2: LEADS & TASKS
-- =============================================

-- 1. FIX: reseller_leads - Add reseller_id filter to prevent cross-reseller access
DROP POLICY IF EXISTS "Franchises view their reseller leads" ON reseller_leads;

CREATE POLICY "Strict reseller leads isolation"
ON reseller_leads
FOR SELECT
USING (
  reseller_id = get_reseller_id(auth.uid())
  OR franchise_id = get_franchise_id(auth.uid())
  OR can_manage_resellers(auth.uid())
);

-- 2. FIX: developer_tasks - Strengthen to assigned developer only
DROP POLICY IF EXISTS "Developers view own tasks" ON developer_tasks;
DROP POLICY IF EXISTS "Developers update own tasks" ON developer_tasks;

CREATE POLICY "Developers view only assigned tasks"
ON developer_tasks
FOR SELECT
USING (
  developer_id = get_developer_id(auth.uid())
  OR can_manage_developers(auth.uid())
);

CREATE POLICY "Developers update only assigned tasks"
ON developer_tasks
FOR UPDATE
USING (
  developer_id = get_developer_id(auth.uid())
  OR can_manage_developers(auth.uid())
);

-- 3. FIX: tasks - Strengthen task isolation
DROP POLICY IF EXISTS "devs_own_tasks" ON tasks;

CREATE POLICY "Task assignee and creator access"
ON tasks
FOR SELECT
USING (
  assigned_to_dev = get_developer_id(auth.uid())
  OR created_by = auth.uid()
  OR can_manage_developers(auth.uid())
);

-- 4. FIX: leads - Strengthen cross-role access prevention
DROP POLICY IF EXISTS "Users view assigned leads" ON leads;

CREATE POLICY "Users view own assigned leads only"
ON leads
FOR SELECT
USING (
  assigned_to = auth.uid()
  OR created_by = auth.uid()
  OR can_manage_leads(auth.uid())
);

-- 5. FIX: franchise_leads - Strengthen franchise isolation
DROP POLICY IF EXISTS "Franchises manage own leads" ON franchise_leads;

CREATE POLICY "Franchises manage strictly own leads"
ON franchise_leads
FOR ALL
USING (
  franchise_id = get_franchise_id(auth.uid())
)
WITH CHECK (
  franchise_id = get_franchise_id(auth.uid())
);