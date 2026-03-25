-- Developer Registration & Verification System

-- Create storage bucket for developer documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('developer-documents', 'developer-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for developer documents
CREATE POLICY "Developers can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'developer-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Developers can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'developer-documents' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all developer documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'developer-documents'
    AND EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('master', 'super_admin', 'admin', 'task_manager')
    )
);

-- Developer registration verification status enum
CREATE TYPE public.developer_verification_status AS ENUM (
    'submitted', 
    'under_review', 
    'verified', 
    'rejected',
    'pending_documents'
);

-- Developer registration table
CREATE TABLE public.developer_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Personal Info
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT,
    timezone TEXT,
    
    -- Verification Status
    status developer_verification_status NOT NULL DEFAULT 'pending_documents',
    
    -- NDA & Rules
    nda_accepted BOOLEAN DEFAULT FALSE,
    nda_accepted_at TIMESTAMP WITH TIME ZONE,
    rules_accepted BOOLEAN DEFAULT FALSE,
    rules_accepted_at TIMESTAMP WITH TIME ZONE,
    nda_document_url TEXT,
    
    -- Documents
    resume_url TEXT,
    resume_uploaded_at TIMESTAMP WITH TIME ZONE,
    photo_id_url TEXT,
    photo_id_uploaded_at TIMESTAMP WITH TIME ZONE,
    photo_id_verified BOOLEAN DEFAULT FALSE,
    
    -- Bank Details (encrypted references)
    bank_name TEXT,
    account_holder_name TEXT,
    account_number_masked TEXT,
    ifsc_code TEXT,
    bank_details_verified BOOLEAN DEFAULT FALSE,
    
    -- Skills & Tech Stack
    primary_skills TEXT[] DEFAULT '{}',
    secondary_skills TEXT[] DEFAULT '{}',
    programming_languages TEXT[] DEFAULT '{}',
    frameworks TEXT[] DEFAULT '{}',
    databases TEXT[] DEFAULT '{}',
    tools TEXT[] DEFAULT '{}',
    years_of_experience INTEGER DEFAULT 0,
    expertise_level TEXT DEFAULT 'junior',
    
    -- Review Info
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID,
    rejection_reason TEXT,
    verification_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Developer past projects table
CREATE TABLE public.developer_past_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES developer_registrations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    
    project_name TEXT NOT NULL,
    project_description TEXT,
    project_url TEXT,
    demo_url TEXT,
    demo_video_url TEXT,
    technologies_used TEXT[] DEFAULT '{}',
    role_in_project TEXT,
    duration_months INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.developer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_past_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for developer_registrations
CREATE POLICY "Developers can view own registration"
ON developer_registrations FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Developers can insert own registration"
ON developer_registrations FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Developers can update own registration before verification"
ON developer_registrations FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status NOT IN ('verified', 'rejected'));

CREATE POLICY "Admins can view all registrations"
ON developer_registrations FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('master', 'super_admin', 'admin', 'task_manager')
    )
);

CREATE POLICY "Admins can update registrations"
ON developer_registrations FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('master', 'super_admin', 'admin', 'task_manager')
    )
);

-- RLS Policies for developer_past_projects
CREATE POLICY "Developers can manage own projects"
ON developer_past_projects FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all projects"
ON developer_past_projects FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('master', 'super_admin', 'admin', 'task_manager')
    )
);

-- Function to submit registration for review
CREATE OR REPLACE FUNCTION public.submit_developer_registration(p_registration_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_reg RECORD;
BEGIN
    SELECT * INTO v_reg FROM developer_registrations WHERE id = p_registration_id AND user_id = auth.uid();
    
    IF v_reg IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Registration not found');
    END IF;
    
    -- Validate required fields
    IF NOT v_reg.nda_accepted THEN
        RETURN jsonb_build_object('success', false, 'error', 'NDA must be accepted');
    END IF;
    
    IF NOT v_reg.rules_accepted THEN
        RETURN jsonb_build_object('success', false, 'error', 'Rules must be accepted');
    END IF;
    
    IF v_reg.resume_url IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Resume is required');
    END IF;
    
    IF v_reg.photo_id_url IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Photo ID is required');
    END IF;
    
    IF v_reg.bank_name IS NULL OR v_reg.account_number_masked IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Bank details are required');
    END IF;
    
    IF array_length(v_reg.primary_skills, 1) IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'At least one skill is required');
    END IF;
    
    -- Update status
    UPDATE developer_registrations
    SET status = 'submitted',
        submitted_at = now(),
        updated_at = now()
    WHERE id = p_registration_id;
    
    -- Log to audit
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        auth.uid(),
        'developer_registration_submitted',
        'verification',
        'developer',
        jsonb_build_object('registration_id', p_registration_id)
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'Registration submitted for review');
END;
$$;

-- Function to verify/reject developer
CREATE OR REPLACE FUNCTION public.review_developer_registration(
    p_registration_id UUID,
    p_action TEXT,
    p_notes TEXT DEFAULT NULL,
    p_rejection_reason TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_reviewer_role TEXT;
    v_reg RECORD;
BEGIN
    -- Check reviewer permissions
    SELECT role INTO v_reviewer_role FROM user_roles WHERE user_id = auth.uid();
    
    IF v_reviewer_role NOT IN ('master', 'super_admin', 'admin', 'task_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Access denied');
    END IF;
    
    SELECT * INTO v_reg FROM developer_registrations WHERE id = p_registration_id;
    
    IF v_reg IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Registration not found');
    END IF;
    
    IF p_action = 'verify' THEN
        UPDATE developer_registrations
        SET status = 'verified',
            reviewed_at = now(),
            reviewed_by = auth.uid(),
            verification_notes = p_notes,
            updated_at = now()
        WHERE id = p_registration_id;
        
        -- Update user role approval if exists
        UPDATE user_roles
        SET approval_status = 'approved',
            approved_by = auth.uid(),
            approved_at = now()
        WHERE user_id = v_reg.user_id AND role = 'developer';
        
    ELSIF p_action = 'reject' THEN
        UPDATE developer_registrations
        SET status = 'rejected',
            reviewed_at = now(),
            reviewed_by = auth.uid(),
            rejection_reason = p_rejection_reason,
            verification_notes = p_notes,
            updated_at = now()
        WHERE id = p_registration_id;
        
    ELSIF p_action = 'review' THEN
        UPDATE developer_registrations
        SET status = 'under_review',
            verification_notes = p_notes,
            updated_at = now()
        WHERE id = p_registration_id;
    END IF;
    
    -- Log to audit
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        auth.uid(),
        'developer_registration_' || p_action,
        'verification',
        v_reviewer_role::app_role,
        jsonb_build_object(
            'registration_id', p_registration_id,
            'developer_user_id', v_reg.user_id,
            'action', p_action
        )
    );
    
    RETURN jsonb_build_object('success', true, 'action', p_action);
END;
$$;

-- Function to check if developer is verified (for task access)
CREATE OR REPLACE FUNCTION public.is_developer_verified(p_user_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM developer_registrations
        WHERE user_id = p_user_id
        AND status = 'verified'
    )
$$;