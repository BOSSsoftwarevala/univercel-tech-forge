
-- =====================================================
-- COMPLIANCE SYSTEM DATABASE SCHEMA
-- Role Clauses, Verification & Penalty System
-- =====================================================

-- 1. ROLE CLAUSE AGREEMENTS TABLE
-- Tracks when users accept role-specific clauses
CREATE TABLE public.role_clause_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  clause_version TEXT NOT NULL,
  clause_id TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  is_valid BOOLEAN DEFAULT true,
  invalidated_at TIMESTAMPTZ,
  invalidated_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role, clause_version)
);

-- 2. VERIFICATION RECORDS TABLE
-- Tracks the complete verification flow for each user-role
CREATE TABLE public.verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  current_step TEXT NOT NULL DEFAULT 'agreement',
  
  -- Step statuses (JSONB for flexibility)
  step_statuses JSONB NOT NULL DEFAULT '{
    "agreement": "pending",
    "identity": "pending",
    "risk_scoring": "pending",
    "legal_review": "pending",
    "activation": "pending"
  }'::jsonb,
  
  -- Agreement step data
  agreement_accepted_at TIMESTAMPTZ,
  agreement_version TEXT,
  agreement_ip_address TEXT,
  
  -- Identity step data
  id_document_front_url TEXT,
  id_document_back_url TEXT,
  liveness_photo_url TEXT,
  full_name TEXT,
  date_of_birth DATE,
  identity_verified_at TIMESTAMPTZ,
  identity_verified_by UUID,
  
  -- Risk scoring data
  risk_score INTEGER,
  risk_factors JSONB,
  ip_reputation_score INTEGER,
  device_fingerprint TEXT,
  device_score INTEGER,
  country_code TEXT,
  country_risk_score INTEGER,
  asn_info JSONB,
  asn_score INTEGER,
  violation_history_score INTEGER,
  risk_assessed_at TIMESTAMPTZ,
  
  -- Legal review data
  legal_review_status TEXT DEFAULT 'pending',
  legal_reviewer_id UUID,
  legal_review_notes TEXT,
  legal_reviewed_at TIMESTAMPTZ,
  
  -- Activation data
  is_activated BOOLEAN DEFAULT false,
  activated_at TIMESTAMPTZ,
  activated_by UUID,
  
  -- Metadata
  rejection_reason TEXT,
  requires_resubmission BOOLEAN DEFAULT false,
  resubmission_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, role)
);

-- 3. PENALTY RECORDS TABLE
-- Tracks all penalties issued to users
CREATE TABLE public.penalty_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_role public.app_role NOT NULL,
  penalty_level INTEGER NOT NULL CHECK (penalty_level BETWEEN 1 AND 5),
  
  -- Violation details
  reason TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  evidence TEXT,
  evidence_urls JSONB,
  
  -- Issuer info
  issued_by UUID REFERENCES auth.users(id),
  issued_by_role public.app_role,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  lifted_at TIMESTAMPTZ,
  lifted_by UUID,
  lift_reason TEXT,
  
  -- Appeal
  can_appeal BOOLEAN DEFAULT true,
  appeal_status TEXT,
  appeal_submitted_at TIMESTAMPTZ,
  appeal_text TEXT,
  appeal_reviewed_at TIMESTAMPTZ,
  appeal_reviewed_by UUID,
  appeal_decision_notes TEXT,
  
  -- Actions taken (auto-enforced)
  actions_taken JSONB,
  
  -- Audit
  audit_trail_id UUID,
  is_auto_triggered BOOLEAN DEFAULT false,
  trigger_rule_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. LEGAL REVIEW CASES TABLE
-- Tracks all cases requiring legal/compliance review
CREATE TABLE public.legal_review_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  user_role public.app_role NOT NULL,
  
  -- Case type
  review_type TEXT NOT NULL, -- 'verification', 'penalty_appeal', 'escalation'
  reference_id UUID, -- ID of verification or penalty record
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_review', 'approved', 'rejected'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ,
  
  -- Documents
  documents JSONB DEFAULT '[]'::jsonb,
  
  -- Risk info
  risk_score INTEGER,
  risk_factors JSONB,
  
  -- Review data
  reviewer_notes TEXT,
  internal_notes TEXT,
  decision_reason TEXT,
  
  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. COMPLIANCE VIOLATION TYPES TABLE
-- Configurable violation types with auto-penalty rules
CREATE TABLE public.compliance_violation_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'code', 'billing', 'security', 'policy', 'legal'
  default_penalty_level INTEGER NOT NULL CHECK (default_penalty_level BETWEEN 1 AND 5),
  applicable_roles public.app_role[],
  auto_trigger_enabled BOOLEAN DEFAULT false,
  escalation_threshold INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. USER COMPLIANCE STATUS VIEW
-- Quick view of user compliance status
CREATE OR REPLACE VIEW public.user_compliance_status AS
SELECT 
  ur.user_id,
  ur.role,
  vr.is_activated as is_verified,
  vr.current_step as verification_step,
  vr.risk_score,
  (SELECT COUNT(*) FROM penalty_records pr WHERE pr.user_id = ur.user_id AND pr.is_active = true) as active_penalties,
  (SELECT MAX(penalty_level) FROM penalty_records pr WHERE pr.user_id = ur.user_id AND pr.is_active = true) as highest_penalty_level,
  (SELECT agreement_accepted_at FROM role_clause_agreements rca WHERE rca.user_id = ur.user_id AND rca.role = ur.role ORDER BY accepted_at DESC LIMIT 1) as last_agreement_date
FROM public.user_roles ur
LEFT JOIN public.verification_records vr ON ur.user_id = vr.user_id AND ur.role = vr.role;

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.role_clause_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penalty_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_review_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_violation_types ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Role Clause Agreements: Users can view their own, Super Admin can view all
CREATE POLICY "Users can view own agreements" ON public.role_clause_agreements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agreements" ON public.role_clause_agreements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super Admin can view all agreements" ON public.role_clause_agreements
  FOR SELECT USING (public.is_super_admin());

-- Verification Records: Users can view their own, Super Admin can manage all
CREATE POLICY "Users can view own verification" ON public.verification_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification" ON public.verification_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verification" ON public.verification_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Super Admin can view all verifications" ON public.verification_records
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Super Admin can update all verifications" ON public.verification_records
  FOR UPDATE USING (public.is_super_admin());

-- Penalty Records: Users can view their own, Super Admin can manage all
CREATE POLICY "Users can view own penalties" ON public.penalty_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super Admin can view all penalties" ON public.penalty_records
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Super Admin can insert penalties" ON public.penalty_records
  FOR INSERT WITH CHECK (public.is_super_admin());

CREATE POLICY "Super Admin can update penalties" ON public.penalty_records
  FOR UPDATE USING (public.is_super_admin());

-- Legal Review Cases: Users can view their own, Legal/Super Admin can manage all
CREATE POLICY "Users can view own legal cases" ON public.legal_review_cases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super Admin can view all legal cases" ON public.legal_review_cases
  FOR SELECT USING (public.is_super_admin());

CREATE POLICY "Super Admin can manage legal cases" ON public.legal_review_cases
  FOR ALL USING (public.is_super_admin());

-- Violation Types: Read-only for authenticated users, Super Admin can manage
CREATE POLICY "Authenticated can view violation types" ON public.compliance_violation_types
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Super Admin can manage violation types" ON public.compliance_violation_types
  FOR ALL USING (public.is_super_admin());

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Check if user is verified for their role
CREATE OR REPLACE FUNCTION public.is_user_verified(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.verification_records
    WHERE user_id = _user_id
    AND role = _role
    AND is_activated = true
  )
$$;

-- Check if user has active penalties above threshold
CREATE OR REPLACE FUNCTION public.has_active_penalty(_user_id uuid, _min_level integer DEFAULT 1)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.penalty_records
    WHERE user_id = _user_id
    AND is_active = true
    AND penalty_level >= _min_level
  )
$$;

-- Get user's current penalty level
CREATE OR REPLACE FUNCTION public.get_user_penalty_level(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(MAX(penalty_level), 0)
  FROM public.penalty_records
  WHERE user_id = _user_id
  AND is_active = true
$$;

-- Issue penalty (with auto-enforcement)
CREATE OR REPLACE FUNCTION public.issue_penalty(
  _user_id uuid,
  _user_role app_role,
  _penalty_level integer,
  _reason text,
  _violation_type text,
  _evidence text DEFAULT NULL,
  _auto_triggered boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  penalty_id UUID;
  actions_list JSONB;
BEGIN
  -- Define actions based on penalty level
  CASE _penalty_level
    WHEN 1 THEN actions_list := '["System warning issued", "Logged in audit trail"]'::jsonb;
    WHEN 2 THEN actions_list := '["Feature access limited", "Earnings/actions paused", "Manager notified"]'::jsonb;
    WHEN 3 THEN actions_list := '["Role suspended", "Server/code/API access blocked", "Investigation required"]'::jsonb;
    WHEN 4 THEN actions_list := '["Account terminated", "Earnings frozen", "Data access revoked", "Legal record created"]'::jsonb;
    WHEN 5 THEN actions_list := '["Evidence package generated", "Legal team notified", "Permanent blacklist"]'::jsonb;
    ELSE actions_list := '[]'::jsonb;
  END CASE;

  -- Insert penalty record
  INSERT INTO public.penalty_records (
    user_id, user_role, penalty_level, reason, violation_type, 
    evidence, issued_by, is_auto_triggered, actions_taken, can_appeal
  ) VALUES (
    _user_id, _user_role, _penalty_level, _reason, _violation_type,
    _evidence, auth.uid(), _auto_triggered, actions_list, (_penalty_level < 5)
  ) RETURNING id INTO penalty_id;

  -- Create legal review case for level 3+
  IF _penalty_level >= 3 THEN
    INSERT INTO public.legal_review_cases (
      user_id, user_role, review_type, reference_id, priority, status
    ) VALUES (
      _user_id, _user_role, 'escalation', penalty_id,
      CASE WHEN _penalty_level >= 4 THEN 'critical' ELSE 'high' END,
      'pending'
    );
  END IF;

  -- Log to audit trail
  INSERT INTO public.compliance_audit_trail (
    entity_type, entity_id, action, actor_id, actor_role,
    new_values, compliance_tags
  ) VALUES (
    'penalty', penalty_id, 'penalty_issued', auth.uid(), 
    (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1),
    jsonb_build_object('level', _penalty_level, 'reason', _reason, 'violation_type', _violation_type),
    ARRAY['penalty', 'compliance']
  );

  RETURN penalty_id;
END;
$$;

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_verification_records_updated_at
  BEFORE UPDATE ON public.verification_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_penalty_records_updated_at
  BEFORE UPDATE ON public.penalty_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legal_review_cases_updated_at
  BEFORE UPDATE ON public.legal_review_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SEED DEFAULT VIOLATION TYPES
-- =====================================================

INSERT INTO public.compliance_violation_types (code, name, description, category, default_penalty_level, applicable_roles, auto_trigger_enabled) VALUES
('CODE_COPY', 'Unauthorized Code Copying', 'Copying or redistributing source code without authorization', 'code', 4, ARRAY['developer']::app_role[], true),
('HIDDEN_BACKDOOR', 'Hidden Backdoor', 'Creating hidden assets, APIs, or backdoors', 'security', 5, ARRAY['developer']::app_role[], true),
('HARDCODED_KEYS', 'Hardcoded Credentials', 'Hardcoding API keys or secrets in code', 'security', 3, ARRAY['developer']::app_role[], true),
('UNAUTHORIZED_ACCESS', 'Unauthorized Access', 'Accessing data or systems without permission', 'security', 4, NULL, true),
('BILLING_FRAUD', 'Billing Fraud', 'Unauthorized discounts or billing manipulation', 'billing', 4, ARRAY['reseller', 'franchise']::app_role[], true),
('SPAM_CAMPAIGN', 'Spam Campaign', 'Sending spam or misleading marketing', 'policy', 3, ARRAY['influencer', 'marketing_manager']::app_role[], true),
('BRAND_MISUSE', 'Brand Misuse', 'Impersonation or brand misuse', 'policy', 3, ARRAY['influencer', 'marketing_manager', 'reseller']::app_role[], true),
('POLICY_VIOLATION', 'General Policy Violation', 'Minor policy violation', 'policy', 1, NULL, false),
('DATA_LEAK', 'Data Leakage', 'Exposing or leaking sensitive data', 'security', 5, NULL, true),
('RESOURCE_ABUSE', 'Resource Abuse', 'Abuse of system resources', 'policy', 2, ARRAY['prime', 'client']::app_role[], true);
