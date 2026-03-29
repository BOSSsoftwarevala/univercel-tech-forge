CREATE OR REPLACE FUNCTION public.generate_franchise_application_id()
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT 'FRA-' || to_char(timezone('utc', now()), 'YYYYMMDD') || '-' || upper(substr(md5(gen_random_uuid()::text), 1, 6));
$$;

CREATE OR REPLACE FUNCTION public.can_review_franchise_applications(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('franchise', 'super_admin', 'boss_owner', 'master', 'ceo', 'admin')
  );
$$;

CREATE TABLE IF NOT EXISTS public.franchise_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id TEXT NOT NULL UNIQUE DEFAULT public.generate_franchise_application_id(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  investment_budget NUMERIC(14,2) NOT NULL DEFAULT 0,
  business_type TEXT NOT NULL,
  experience TEXT NOT NULL,
  documents_url TEXT[] NOT NULL DEFAULT '{}',
  agree_terms BOOLEAN NOT NULL DEFAULT false,
  otp_verified BOOLEAN NOT NULL DEFAULT false,
  otp_verified_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'blocked')),
  approval_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  blocked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  blocked_at TIMESTAMPTZ,
  franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.franchise_application_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  verification_channel TEXT NOT NULL DEFAULT 'email' CHECK (verification_channel IN ('email', 'sms')),
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, phone)
);

CREATE TABLE IF NOT EXISTS public.franchises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID UNIQUE REFERENCES public.franchise_applications(id) ON DELETE SET NULL,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  franchise_account_id UUID UNIQUE REFERENCES public.franchise_accounts(id) ON DELETE SET NULL,
  franchise_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'blocked')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'danger', 'priority')),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT false,
  role_target TEXT[] NOT NULL DEFAULT '{}',
  action_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_franchise_applications_email_unique
  ON public.franchise_applications ((lower(email)));

CREATE UNIQUE INDEX IF NOT EXISTS idx_franchise_applications_phone_unique
  ON public.franchise_applications ((regexp_replace(phone, '\\D', '', 'g')));

CREATE UNIQUE INDEX IF NOT EXISTS idx_franchise_applications_user_unique
  ON public.franchise_applications (user_id);

CREATE INDEX IF NOT EXISTS idx_franchise_applications_status_created
  ON public.franchise_applications (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_franchise_application_otps_user_phone
  ON public.franchise_application_otps (user_id, phone);

CREATE INDEX IF NOT EXISTS idx_franchises_user_id
  ON public.franchises (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created
  ON public.notifications (user_id, created_at DESC);

ALTER TABLE public.franchise_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_application_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own franchise applications" ON public.franchise_applications;
CREATE POLICY "Users view own franchise applications"
ON public.franchise_applications
FOR SELECT
USING (auth.uid() = user_id OR public.can_review_franchise_applications(auth.uid()));

DROP POLICY IF EXISTS "Users submit own franchise applications" ON public.franchise_applications;
CREATE POLICY "Users submit own franchise applications"
ON public.franchise_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Reviewers manage franchise applications" ON public.franchise_applications;
CREATE POLICY "Reviewers manage franchise applications"
ON public.franchise_applications
FOR UPDATE
USING (public.can_review_franchise_applications(auth.uid()))
WITH CHECK (public.can_review_franchise_applications(auth.uid()));

DROP POLICY IF EXISTS "Users view own franchise application otps" ON public.franchise_application_otps;
CREATE POLICY "Users view own franchise application otps"
ON public.franchise_application_otps
FOR SELECT
USING (auth.uid() = user_id OR public.can_review_franchise_applications(auth.uid()));

DROP POLICY IF EXISTS "Users manage own franchise application otps" ON public.franchise_application_otps;
CREATE POLICY "Users manage own franchise application otps"
ON public.franchise_application_otps
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own franchise profile" ON public.franchises;
CREATE POLICY "Users view own franchise profile"
ON public.franchises
FOR SELECT
USING (auth.uid() = user_id OR public.can_review_franchise_applications(auth.uid()));

DROP POLICY IF EXISTS "Reviewers manage franchise profiles" ON public.franchises;
CREATE POLICY "Reviewers manage franchise profiles"
ON public.franchises
FOR ALL
USING (public.can_review_franchise_applications(auth.uid()))
WITH CHECK (public.can_review_franchise_applications(auth.uid()));

DROP POLICY IF EXISTS "Users view own notifications mirror" ON public.notifications;
CREATE POLICY "Users view own notifications mirror"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id OR public.can_review_franchise_applications(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users insert notifications mirror" ON public.notifications;
CREATE POLICY "Authenticated users insert notifications mirror"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users update own notifications mirror" ON public.notifications;
CREATE POLICY "Users update own notifications mirror"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id OR public.can_review_franchise_applications(auth.uid()))
WITH CHECK (auth.uid() = user_id OR public.can_review_franchise_applications(auth.uid()));

CREATE TRIGGER update_franchise_applications_updated_at
BEFORE UPDATE ON public.franchise_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchises_updated_at
BEFORE UPDATE ON public.franchises
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'franchise-documents',
  'franchise-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own franchise documents" ON storage.objects;
CREATE POLICY "Users can upload own franchise documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'franchise-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can view own franchise documents" ON storage.objects;
CREATE POLICY "Users can view own franchise documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'franchise-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.can_review_franchise_applications(auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can delete own franchise documents" ON storage.objects;
CREATE POLICY "Users can delete own franchise documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'franchise-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.can_review_franchise_applications(auth.uid())
  )
);

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.franchise_applications;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.franchises;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END
$$;