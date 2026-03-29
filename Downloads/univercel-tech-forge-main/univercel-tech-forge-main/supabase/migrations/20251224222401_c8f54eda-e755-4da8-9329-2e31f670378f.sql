-- Drop existing policies if any
DROP POLICY IF EXISTS "kyc_owner_only" ON kyc_documents;
DROP POLICY IF EXISTS "Users can view own kyc documents" ON kyc_documents;
DROP POLICY IF EXISTS "Users can insert own kyc documents" ON kyc_documents;

-- Enable RLS
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- Create comprehensive KYC policies
-- SELECT: Owner or authorized roles
CREATE POLICY "kyc_select_owner_or_authorized"
ON kyc_documents
FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('legal_compliance', 'super_admin', 'master')
  )
);

-- INSERT: Users can insert their own KYC documents
CREATE POLICY "kyc_insert_own"
ON kyc_documents
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- UPDATE: Only authorized roles can update (verify/reject)
CREATE POLICY "kyc_update_authorized"
ON kyc_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('legal_compliance', 'super_admin', 'master', 'admin')
  )
);

-- DELETE: Only super_admin/master can delete
CREATE POLICY "kyc_delete_admin"
ON kyc_documents
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('super_admin', 'master')
  )
);