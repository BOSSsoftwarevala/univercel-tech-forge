-- Step 1: Add reseller_manager role to enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'reseller_manager';

-- Step 2: Create reseller_applications table
CREATE TABLE IF NOT EXISTS public.reseller_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  application_type TEXT NOT NULL DEFAULT 'reseller',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  id_proof_uploaded BOOLEAN NOT NULL DEFAULT false,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  promise_acknowledged BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewer_id UUID NULL,
  reviewer_notes TEXT NULL,
  rejection_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reseller_applications_user_id ON public.reseller_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_reseller_applications_status_created_at ON public.reseller_applications(status, created_at DESC);

-- Step 3: Enable RLS
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Applicants can insert their own application
DROP POLICY IF EXISTS "Reseller applications insert own" ON public.reseller_applications;
CREATE POLICY "Reseller applications insert own"
ON public.reseller_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Applicants can view their own applications
DROP POLICY IF EXISTS "Reseller applications select own" ON public.reseller_applications;
CREATE POLICY "Reseller applications select own"
ON public.reseller_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Privileged roles can view all applications
DROP POLICY IF EXISTS "Reseller applications reviewers select" ON public.reseller_applications;
CREATE POLICY "Reseller applications reviewers select"
ON public.reseller_applications
FOR SELECT
TO authenticated
USING (
  public.has_privileged_role(auth.uid())
);

-- Policy: Privileged roles can update (approve/reject)
DROP POLICY IF EXISTS "Reseller applications reviewers update" ON public.reseller_applications;
CREATE POLICY "Reseller applications reviewers update"
ON public.reseller_applications
FOR UPDATE
TO authenticated
USING (public.has_privileged_role(auth.uid()))
WITH CHECK (public.has_privileged_role(auth.uid()));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_reseller_applications_updated_at ON public.reseller_applications;
CREATE TRIGGER update_reseller_applications_updated_at
BEFORE UPDATE ON public.reseller_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();