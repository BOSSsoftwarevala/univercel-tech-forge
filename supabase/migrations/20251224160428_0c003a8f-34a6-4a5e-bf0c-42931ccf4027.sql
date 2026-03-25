-- Add pending_approval status to promise_status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'pending_approval' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'promise_status')) THEN
        ALTER TYPE public.promise_status ADD VALUE 'pending_approval' BEFORE 'assigned';
    END IF;
END$$;

-- Add approval columns to promise_logs
ALTER TABLE public.promise_logs 
ADD COLUMN IF NOT EXISTS approval_required BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejected_by UUID,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS promise_type TEXT DEFAULT 'delivery', -- delivery, support, payment, demo, sla
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal', -- low, normal, high, critical
ADD COLUMN IF NOT EXISTS linked_order_id UUID,
ADD COLUMN IF NOT EXISTS linked_demo_id UUID,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS escalation_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS escalated_to UUID[];

-- Create promise_escalation_logs table for tracking escalations
CREATE TABLE IF NOT EXISTS public.promise_escalation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promise_id UUID REFERENCES public.promise_logs(id) ON DELETE CASCADE NOT NULL,
    from_level INTEGER NOT NULL DEFAULT 0,
    to_level INTEGER NOT NULL DEFAULT 1,
    escalated_by UUID,
    escalated_to UUID[] NOT NULL,
    reason TEXT,
    auto_triggered BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promise_escalation_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for escalation logs
CREATE POLICY "Managers view escalation logs" ON public.promise_escalation_logs
    FOR SELECT USING (can_manage_developers(auth.uid()) OR has_role(auth.uid(), 'promise_tracker') OR has_role(auth.uid(), 'promise_management'));

CREATE POLICY "System creates escalation logs" ON public.promise_escalation_logs
    FOR INSERT WITH CHECK (true);

-- Create function to approve promise
CREATE OR REPLACE FUNCTION public.approve_promise(
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
BEGIN
    -- Get approver role
    SELECT role INTO v_approver_role FROM user_roles WHERE user_id = p_approver_id;
    
    -- Only super_admin, master, or pro_manager can approve
    IF v_approver_role NOT IN ('super_admin', 'master', 'promise_management', 'task_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only authorized managers can approve promises');
    END IF;
    
    -- Get promise
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.status != 'pending_approval' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise is not pending approval');
    END IF;
    
    -- Approve the promise
    UPDATE promise_logs
    SET status = 'assigned',
        approved_by = p_approver_id,
        approved_at = now(),
        updated_at = now()
    WHERE id = p_promise_id;
    
    -- Log to audit
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        p_approver_id,
        'promise_approved',
        'promise',
        v_approver_role::app_role,
        jsonb_build_object('promise_id', p_promise_id, 'developer_id', v_promise.developer_id)
    );
    
    RETURN jsonb_build_object('success', true, 'promise_id', p_promise_id);
END;
$$;

-- Create function to reject promise
CREATE OR REPLACE FUNCTION public.reject_promise(
    p_promise_id UUID,
    p_rejector_id UUID,
    p_reason TEXT DEFAULT 'Rejected by manager'
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
    SELECT role INTO v_rejector_role FROM user_roles WHERE user_id = p_rejector_id;
    
    IF v_rejector_role NOT IN ('super_admin', 'master', 'promise_management', 'task_manager') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Only authorized managers can reject promises');
    END IF;
    
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.status NOT IN ('pending_approval', 'assigned', 'promised') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Cannot reject promise in current status');
    END IF;
    
    UPDATE promise_logs
    SET status = 'breached',
        rejected_by = p_rejector_id,
        rejected_at = now(),
        rejection_reason = p_reason,
        breach_reason = 'Rejected: ' || p_reason,
        is_locked = true,
        updated_at = now()
    WHERE id = p_promise_id;
    
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        p_rejector_id,
        'promise_rejected',
        'promise',
        v_rejector_role::app_role,
        jsonb_build_object('promise_id', p_promise_id, 'reason', p_reason)
    );
    
    RETURN jsonb_build_object('success', true, 'promise_id', p_promise_id);
END;
$$;

-- Create trigger to lock completed/breached promises
CREATE OR REPLACE FUNCTION public.lock_closed_promise()
RETURNS TRIGGER AS $$
BEGIN
    -- If status changes to completed or breached, lock the promise
    IF NEW.status IN ('completed', 'breached') AND OLD.status NOT IN ('completed', 'breached') THEN
        NEW.is_locked := true;
        NEW.finished_time := COALESCE(NEW.finished_time, now());
    END IF;
    
    -- Prevent updates to locked promises (except by system)
    IF OLD.is_locked = true AND NEW.is_locked = true THEN
        -- Only allow escalation updates
        IF (OLD.escalation_level != NEW.escalation_level) OR 
           (OLD.escalated_at IS DISTINCT FROM NEW.escalated_at) THEN
            RETURN NEW;
        END IF;
        
        -- Block other updates
        RAISE EXCEPTION 'Cannot modify locked promise';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS lock_closed_promise_trigger ON public.promise_logs;
CREATE TRIGGER lock_closed_promise_trigger
    BEFORE UPDATE ON public.promise_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.lock_closed_promise();

-- Create function to escalate overdue promises
CREATE OR REPLACE FUNCTION public.escalate_overdue_promises()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER := 0;
    v_promise RECORD;
    v_escalate_to UUID[];
BEGIN
    FOR v_promise IN 
        SELECT * FROM promise_logs 
        WHERE status IN ('promised', 'in_progress')
        AND deadline < now()
        AND is_locked = false
        AND (escalated_at IS NULL OR escalated_at < now() - interval '1 hour')
    LOOP
        -- Get managers to escalate to
        SELECT ARRAY_AGG(user_id) INTO v_escalate_to
        FROM user_roles
        WHERE role IN ('task_manager', 'promise_tracker', 'super_admin');
        
        -- Update promise
        UPDATE promise_logs
        SET escalation_level = escalation_level + 1,
            escalated_at = now(),
            escalated_to = v_escalate_to
        WHERE id = v_promise.id;
        
        -- Log escalation
        INSERT INTO promise_escalation_logs (
            promise_id, from_level, to_level, escalated_to, reason, auto_triggered
        ) VALUES (
            v_promise.id,
            v_promise.escalation_level,
            v_promise.escalation_level + 1,
            v_escalate_to,
            'Auto-escalation: deadline exceeded',
            true
        );
        
        v_count := v_count + 1;
    END LOOP;
    
    RETURN v_count;
END;
$$;

-- Create comprehensive audit trigger for promises
CREATE OR REPLACE FUNCTION public.log_promise_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        auth.uid(),
        CASE 
            WHEN TG_OP = 'INSERT' THEN 'promise_created'
            WHEN TG_OP = 'UPDATE' THEN 
                CASE 
                    WHEN OLD.status != NEW.status THEN 'promise_status_changed'
                    WHEN OLD.deadline != NEW.deadline THEN 'promise_deadline_changed'
                    ELSE 'promise_updated'
                END
            WHEN TG_OP = 'DELETE' THEN 'promise_deleted'
        END,
        'promise',
        (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1),
        jsonb_build_object(
            'promise_id', COALESCE(NEW.id, OLD.id),
            'operation', TG_OP,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'old_deadline', OLD.deadline,
            'new_deadline', NEW.deadline,
            'developer_id', COALESCE(NEW.developer_id, OLD.developer_id),
            'task_id', COALESCE(NEW.task_id, OLD.task_id)
        )
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS promise_audit_trigger ON public.promise_logs;
CREATE TRIGGER promise_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.promise_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.log_promise_audit();

-- Add RLS policy to prevent deleting promises
DROP POLICY IF EXISTS "No delete promises" ON public.promise_logs;
CREATE POLICY "No delete promises" ON public.promise_logs
    FOR DELETE USING (false);

-- Enable realtime for promise tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.promise_escalation_logs;