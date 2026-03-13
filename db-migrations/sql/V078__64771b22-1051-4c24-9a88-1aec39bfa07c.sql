-- ==============================================
-- ZERO-LOOPHOLE PROMISE MANAGEMENT SYSTEM
-- Role: Promise Management (Control Role)
-- Purpose: Control, validate, track, enforce, close promises
-- ==============================================

-- Add promise_manager role validation columns
ALTER TABLE public.promise_logs 
ADD COLUMN IF NOT EXISTS assigned_role TEXT,
ADD COLUMN IF NOT EXISTS responsible_user_id UUID,
ADD COLUMN IF NOT EXISTS linked_task_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fulfillment_verified_by UUID,
ADD COLUMN IF NOT EXISTS fulfillment_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS final_audit_log_id UUID,
ADD COLUMN IF NOT EXISTS auto_escalation_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_status_change_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS status_change_count INTEGER DEFAULT 0;

-- Create immutable promise audit log table
CREATE TABLE IF NOT EXISTS public.promise_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promise_id UUID REFERENCES public.promise_logs(id) ON DELETE RESTRICT NOT NULL,
    action_type TEXT NOT NULL, -- creation, approval, rejection, status_change, escalation, fulfillment, closure
    action_by UUID NOT NULL,
    action_by_role TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    previous_data JSONB,
    new_data JSONB,
    reason TEXT,
    ip_address TEXT,
    user_agent TEXT,
    server_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_system_action BOOLEAN DEFAULT false,
    signature TEXT -- hash for tamper detection
);

-- Make audit logs immutable - no updates, no deletes
ALTER TABLE public.promise_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promise audit logs are append-only insert" ON public.promise_audit_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Promise audit logs read by authorized roles" ON public.promise_audit_logs
    FOR SELECT USING (
        has_role(auth.uid(), 'super_admin') OR
        has_role(auth.uid(), 'master') OR
        has_role(auth.uid(), 'promise_management') OR
        has_role(auth.uid(), 'promise_tracker')
    );

-- Block all updates and deletes on audit logs
CREATE POLICY "No updates on audit logs" ON public.promise_audit_logs
    FOR UPDATE USING (false);

CREATE POLICY "No deletes on audit logs" ON public.promise_audit_logs
    FOR DELETE USING (false);

-- ==============================================
-- PROMISE VALIDATION FUNCTION
-- Ensures every promise has required links
-- ==============================================
CREATE OR REPLACE FUNCTION public.validate_promise_integrity(p_promise_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_task_exists BOOLEAN;
    v_developer_exists BOOLEAN;
    v_errors TEXT[] := ARRAY[]::TEXT[];
BEGIN
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('valid', false, 'errors', ARRAY['Promise not found']);
    END IF;
    
    -- Check task link
    SELECT EXISTS(SELECT 1 FROM developer_tasks WHERE id = v_promise.task_id) INTO v_task_exists;
    IF NOT v_task_exists THEN
        v_errors := array_append(v_errors, 'No linked task found');
    END IF;
    
    -- Check developer/responsible user
    SELECT EXISTS(SELECT 1 FROM developers WHERE id = v_promise.developer_id) INTO v_developer_exists;
    IF NOT v_developer_exists THEN
        v_errors := array_append(v_errors, 'No responsible developer found');
    END IF;
    
    -- Check deadline
    IF v_promise.deadline IS NULL THEN
        v_errors := array_append(v_errors, 'No deadline set');
    END IF;
    
    -- Check assigned role
    IF v_promise.assigned_role IS NULL OR v_promise.assigned_role = '' THEN
        v_errors := array_append(v_errors, 'No assigned role specified');
    END IF;
    
    RETURN jsonb_build_object(
        'valid', array_length(v_errors, 1) IS NULL,
        'errors', COALESCE(v_errors, ARRAY[]::TEXT[]),
        'promise_id', p_promise_id
    );
END;
$$;

-- ==============================================
-- PROMISE CREATION (Only by System or Approved Manager)
-- ==============================================
CREATE OR REPLACE FUNCTION public.create_promise_with_validation(
    p_task_id UUID,
    p_developer_id UUID,
    p_deadline TIMESTAMP WITH TIME ZONE,
    p_promise_type TEXT,
    p_priority TEXT,
    p_assigned_role TEXT,
    p_responsible_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_creator_role TEXT;
    v_new_promise_id UUID;
    v_task_exists BOOLEAN;
    v_developer_exists BOOLEAN;
BEGIN
    -- Get creator role
    SELECT role INTO v_creator_role FROM user_roles WHERE user_id = auth.uid();
    
    -- Only specific roles can create promises
    IF v_creator_role NOT IN ('super_admin', 'master', 'promise_management', 'task_manager', 'pro_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized: Only approved managers can create promises');
    END IF;
    
    -- Validate task exists
    SELECT EXISTS(SELECT 1 FROM developer_tasks WHERE id = p_task_id) INTO v_task_exists;
    IF NOT v_task_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid task_id: Task does not exist');
    END IF;
    
    -- Validate developer exists
    SELECT EXISTS(SELECT 1 FROM developers WHERE id = p_developer_id) INTO v_developer_exists;
    IF NOT v_developer_exists THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid developer_id: Developer does not exist');
    END IF;
    
    -- Validate deadline is in future
    IF p_deadline <= now() THEN
        RETURN jsonb_build_object('success', false, 'error', 'Deadline must be in the future');
    END IF;
    
    -- Create promise with pending_approval status
    INSERT INTO promise_logs (
        task_id,
        developer_id,
        deadline,
        promise_type,
        priority,
        assigned_role,
        responsible_user_id,
        status,
        approval_required,
        linked_task_verified
    ) VALUES (
        p_task_id,
        p_developer_id,
        p_deadline,
        p_promise_type,
        p_priority,
        p_assigned_role,
        COALESCE(p_responsible_user_id, p_developer_id),
        'pending_approval',
        true,
        true
    ) RETURNING id INTO v_new_promise_id;
    
    -- Create immutable audit log
    INSERT INTO promise_audit_logs (
        promise_id,
        action_type,
        action_by,
        action_by_role,
        previous_status,
        new_status,
        new_data,
        reason
    ) VALUES (
        v_new_promise_id,
        'creation',
        auth.uid(),
        v_creator_role,
        NULL,
        'pending_approval',
        jsonb_build_object(
            'task_id', p_task_id,
            'developer_id', p_developer_id,
            'deadline', p_deadline,
            'priority', p_priority,
            'assigned_role', p_assigned_role
        ),
        'Promise created via validated flow'
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'promise_id', v_new_promise_id,
        'status', 'pending_approval'
    );
END;
$$;

-- ==============================================
-- ENHANCED APPROVAL FLOW (Strict Role Validation)
-- ==============================================
CREATE OR REPLACE FUNCTION public.approve_promise_strict(
    p_promise_id UUID,
    p_approver_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_approver_role TEXT;
    v_validation JSONB;
BEGIN
    -- Get approver role
    SELECT role INTO v_approver_role FROM user_roles WHERE user_id = p_approver_id;
    
    -- STRICT: Only Super Admin, Master Admin, or Pro Manager can approve
    IF v_approver_role NOT IN ('super_admin', 'master', 'pro_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED: Only Super Admin, Master Admin, or Pro Manager can approve promises');
    END IF;
    
    -- Get promise with lock
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.is_locked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise is locked and cannot be modified');
    END IF;
    
    IF v_promise.status != 'pending_approval' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise is not pending approval. Current status: ' || v_promise.status);
    END IF;
    
    -- Validate promise integrity before approval
    v_validation := validate_promise_integrity(p_promise_id);
    IF NOT (v_validation->>'valid')::boolean THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise integrity check failed', 'details', v_validation->'errors');
    END IF;
    
    -- Approve promise - set to Active (assigned)
    UPDATE promise_logs
    SET status = 'assigned',
        approved_by = p_approver_id,
        approved_at = now(),
        last_status_change_at = now(),
        status_change_count = status_change_count + 1,
        updated_at = now()
    WHERE id = p_promise_id;
    
    -- Immutable audit log
    INSERT INTO promise_audit_logs (
        promise_id,
        action_type,
        action_by,
        action_by_role,
        previous_status,
        new_status,
        reason
    ) VALUES (
        p_promise_id,
        'approval',
        p_approver_id,
        v_approver_role,
        'pending_approval',
        'assigned',
        'Promise approved and activated'
    );
    
    RETURN jsonb_build_object('success', true, 'promise_id', p_promise_id, 'new_status', 'assigned');
END;
$$;

-- ==============================================
-- STRICT REJECTION FLOW
-- ==============================================
CREATE OR REPLACE FUNCTION public.reject_promise_strict(
    p_promise_id UUID,
    p_rejector_id UUID,
    p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_rejector_role TEXT;
BEGIN
    -- Reason is mandatory
    IF p_reason IS NULL OR trim(p_reason) = '' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Rejection reason is mandatory');
    END IF;
    
    SELECT role INTO v_rejector_role FROM user_roles WHERE user_id = p_rejector_id;
    
    IF v_rejector_role NOT IN ('super_admin', 'master', 'pro_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'UNAUTHORIZED: Only Super Admin, Master Admin, or Pro Manager can reject promises');
    END IF;
    
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.is_locked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise is locked and cannot be modified');
    END IF;
    
    -- Update to cancelled status
    UPDATE promise_logs
    SET status = 'breached',
        rejected_by = p_rejector_id,
        rejected_at = now(),
        rejection_reason = p_reason,
        breach_reason = 'Rejected: ' || p_reason,
        is_locked = true,
        last_status_change_at = now(),
        status_change_count = status_change_count + 1,
        updated_at = now()
    WHERE id = p_promise_id;
    
    -- Immutable audit log
    INSERT INTO promise_audit_logs (
        promise_id,
        action_type,
        action_by,
        action_by_role,
        previous_status,
        new_status,
        reason
    ) VALUES (
        p_promise_id,
        'rejection',
        p_rejector_id,
        v_rejector_role,
        v_promise.status,
        'cancelled',
        p_reason
    );
    
    RETURN jsonb_build_object('success', true, 'promise_id', p_promise_id, 'new_status', 'cancelled');
END;
$$;

-- ==============================================
-- AUTO ESCALATION FUNCTION
-- ==============================================
CREATE OR REPLACE FUNCTION public.escalate_overdue_promise(p_promise_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_new_level INTEGER;
    v_escalate_to UUID[];
BEGIN
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.is_locked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise is locked');
    END IF;
    
    IF NOT v_promise.auto_escalation_enabled THEN
        RETURN jsonb_build_object('success', false, 'error', 'Auto escalation is disabled for this promise');
    END IF;
    
    -- Calculate new escalation level
    v_new_level := COALESCE(v_promise.escalation_level, 0) + 1;
    
    -- Get escalation targets based on level
    SELECT ARRAY_AGG(user_id) INTO v_escalate_to
    FROM user_roles
    WHERE role IN (
        CASE 
            WHEN v_new_level = 1 THEN 'task_manager'
            WHEN v_new_level = 2 THEN 'pro_manager'
            ELSE 'super_admin'
        END
    );
    
    -- Update promise
    UPDATE promise_logs
    SET escalation_level = v_new_level,
        escalated_at = now(),
        escalated_to = v_escalate_to,
        status = CASE WHEN now() > deadline AND status NOT IN ('completed', 'breached') THEN 'breached' ELSE status END,
        updated_at = now()
    WHERE id = p_promise_id;
    
    -- Log escalation
    INSERT INTO promise_escalation_logs (
        promise_id,
        from_level,
        to_level,
        escalated_to,
        reason,
        auto_triggered
    ) VALUES (
        p_promise_id,
        COALESCE(v_promise.escalation_level, 0),
        v_new_level,
        v_escalate_to,
        'Deadline exceeded - auto escalation',
        true
    );
    
    -- Immutable audit log
    INSERT INTO promise_audit_logs (
        promise_id,
        action_type,
        action_by,
        action_by_role,
        previous_status,
        new_status,
        reason,
        is_system_action
    ) VALUES (
        p_promise_id,
        'escalation',
        auth.uid(),
        'system',
        v_promise.status,
        v_promise.status,
        'Auto-escalated to level ' || v_new_level,
        true
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'promise_id', p_promise_id,
        'new_level', v_new_level,
        'escalated_to', v_escalate_to
    );
END;
$$;

-- ==============================================
-- FULFILLMENT / CLOSURE FUNCTION
-- Only closes if linked task completed OR Super Admin approval
-- ==============================================
CREATE OR REPLACE FUNCTION public.fulfill_promise_strict(
    p_promise_id UUID,
    p_fulfiller_id UUID,
    p_force_close BOOLEAN DEFAULT false
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_fulfiller_role TEXT;
    v_task_completed BOOLEAN;
    v_final_audit_id UUID;
BEGIN
    SELECT role INTO v_fulfiller_role FROM user_roles WHERE user_id = p_fulfiller_id;
    
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.is_locked THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise is already closed and locked');
    END IF;
    
    -- Check if task is completed
    SELECT (status = 'completed') INTO v_task_completed 
    FROM developer_tasks 
    WHERE id = v_promise.task_id;
    
    -- Can close only if task completed OR super_admin force close
    IF NOT v_task_completed THEN
        IF p_force_close AND v_fulfiller_role = 'super_admin' THEN
            -- Allow super admin force close
            NULL;
        ELSE
            RETURN jsonb_build_object(
                'success', false, 
                'error', 'Cannot fulfill: Linked task is not completed. Only Super Admin can force close.'
            );
        END IF;
    END IF;
    
    -- Create final audit log
    INSERT INTO promise_audit_logs (
        promise_id,
        action_type,
        action_by,
        action_by_role,
        previous_status,
        new_status,
        previous_data,
        reason
    ) VALUES (
        p_promise_id,
        'closure',
        p_fulfiller_id,
        v_fulfiller_role,
        v_promise.status,
        'completed',
        to_jsonb(v_promise),
        CASE WHEN p_force_close THEN 'Force closed by Super Admin' ELSE 'Fulfilled - linked task completed' END
    ) RETURNING id INTO v_final_audit_id;
    
    -- Lock and close the promise permanently
    UPDATE promise_logs
    SET status = 'completed',
        finished_time = now(),
        is_locked = true,
        fulfillment_verified_by = p_fulfiller_id,
        fulfillment_verified_at = now(),
        final_audit_log_id = v_final_audit_id,
        last_status_change_at = now(),
        status_change_count = status_change_count + 1,
        updated_at = now()
    WHERE id = p_promise_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'promise_id', p_promise_id,
        'status', 'completed',
        'locked', true,
        'final_audit_id', v_final_audit_id
    );
END;
$$;

-- ==============================================
-- PROMISE MANAGER METRICS VIEW
-- ==============================================
CREATE OR REPLACE VIEW public.promise_manager_metrics AS
SELECT 
    COUNT(*) FILTER (WHERE status NOT IN ('completed', 'breached')) AS total_active,
    COUNT(*) FILTER (WHERE status = 'pending_approval') AS pending_approval,
    COUNT(*) FILTER (WHERE status IN ('promised', 'in_progress', 'assigned') AND deadline < now()) AS overdue,
    COUNT(*) FILTER (WHERE status = 'completed') AS fulfilled,
    COUNT(*) FILTER (WHERE status = 'breached') AS breached,
    COUNT(*) AS total_promises,
    ROUND(
        COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC / 
        NULLIF(COUNT(*) FILTER (WHERE status IN ('completed', 'breached')), 0) * 100, 2
    ) AS fulfillment_rate,
    COUNT(*) FILTER (WHERE escalation_level > 0 AND status NOT IN ('completed', 'breached')) AS active_escalations
FROM promise_logs;

-- ==============================================
-- SECURITY: Prevent direct status manipulation
-- ==============================================
CREATE OR REPLACE FUNCTION public.prevent_direct_promise_modification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_role TEXT;
BEGIN
    -- Allow system/triggers to modify
    IF current_setting('app.bypass_rls', true) = 'true' THEN
        RETURN NEW;
    END IF;
    
    -- Get user role
    SELECT role INTO v_user_role FROM user_roles WHERE user_id = auth.uid();
    
    -- Promise Manager cannot execute - only control
    IF v_user_role = 'promise_management' THEN
        -- Block direct status changes except through approved functions
        IF OLD.status != NEW.status THEN
            RAISE EXCEPTION 'Promise Manager cannot directly change promise status. Use approved workflow functions.';
        END IF;
        
        -- Block modification of locked promises
        IF OLD.is_locked THEN
            RAISE EXCEPTION 'Cannot modify locked/closed promises';
        END IF;
        
        -- Block deadline changes after activation
        IF OLD.status NOT IN ('pending_approval') AND OLD.deadline != NEW.deadline THEN
            RAISE EXCEPTION 'Cannot modify deadline after promise activation';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Apply trigger
DROP TRIGGER IF EXISTS trg_prevent_direct_promise_modification ON promise_logs;
CREATE TRIGGER trg_prevent_direct_promise_modification
    BEFORE UPDATE ON promise_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_direct_promise_modification();

-- ==============================================
-- RLS: Promise Manager can only READ, not write directly
-- ==============================================
CREATE POLICY "Promise manager read-only access" ON public.promise_logs
    FOR SELECT USING (has_role(auth.uid(), 'promise_management'));

-- Enable realtime for promise_audit_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.promise_audit_logs;