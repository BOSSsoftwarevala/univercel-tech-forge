-- Promise Accountability System: Rewards & Penalties

-- Add reward/penalty tracking columns if not exist
ALTER TABLE public.promise_logs ADD COLUMN IF NOT EXISTS confirmed_by_developer BOOLEAN DEFAULT FALSE;
ALTER TABLE public.promise_logs ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.promise_logs ADD COLUMN IF NOT EXISTS reward_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.promise_logs ADD COLUMN IF NOT EXISTS penalty_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.promise_logs ADD COLUMN IF NOT EXISTS on_time_bonus BOOLEAN DEFAULT FALSE;

-- Create function to confirm developer commitment
CREATE OR REPLACE FUNCTION public.confirm_developer_commitment(p_promise_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_developer_id UUID;
BEGIN
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.confirmed_by_developer THEN
        RETURN jsonb_build_object('success', false, 'error', 'Commitment already confirmed');
    END IF;
    
    -- Update promise with confirmation
    UPDATE promise_logs
    SET confirmed_by_developer = TRUE,
        confirmed_at = now(),
        status = 'in_progress',
        updated_at = now()
    WHERE id = p_promise_id;
    
    -- Log to audit
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        auth.uid(),
        'promise_commitment_confirmed',
        'promise',
        (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1),
        jsonb_build_object(
            'promise_id', p_promise_id,
            'deadline', v_promise.deadline,
            'confirmed_at', now()
        )
    );
    
    RETURN jsonb_build_object('success', true, 'message', 'Commitment confirmed');
END;
$$;

-- Create function to complete promise with rewards
CREATE OR REPLACE FUNCTION public.complete_promise_with_reward(p_promise_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_is_on_time BOOLEAN;
    v_reward NUMERIC := 0;
    v_score_bonus INTEGER := 0;
    v_hours_early NUMERIC;
BEGIN
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.status = 'completed' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise already completed');
    END IF;
    
    -- Check if completed on time
    v_is_on_time := now() <= COALESCE(v_promise.extended_deadline, v_promise.deadline);
    
    IF v_is_on_time THEN
        -- Calculate hours early
        v_hours_early := EXTRACT(EPOCH FROM (COALESCE(v_promise.extended_deadline, v_promise.deadline) - now())) / 3600;
        
        -- Base reward for on-time completion
        v_reward := 100;
        v_score_bonus := 10;
        
        -- Bonus for early completion
        IF v_hours_early > 24 THEN
            v_reward := v_reward + 200;
            v_score_bonus := v_score_bonus + 15;
        ELSIF v_hours_early > 12 THEN
            v_reward := v_reward + 100;
            v_score_bonus := v_score_bonus + 10;
        ELSIF v_hours_early > 6 THEN
            v_reward := v_reward + 50;
            v_score_bonus := v_score_bonus + 5;
        END IF;
        
        -- Extra bonus if confirmed commitment
        IF v_promise.confirmed_by_developer THEN
            v_reward := v_reward + 50;
            v_score_bonus := v_score_bonus + 5;
        END IF;
    END IF;
    
    -- Update promise
    UPDATE promise_logs
    SET status = 'completed',
        finished_time = now(),
        reward_amount = v_reward,
        score_effect = v_score_bonus,
        on_time_bonus = v_is_on_time,
        updated_at = now()
    WHERE id = p_promise_id;
    
    -- Update developer wallet if reward earned
    IF v_reward > 0 THEN
        UPDATE developer_wallet
        SET available_balance = available_balance + v_reward,
            total_earned = total_earned + v_reward
        WHERE developer_id = v_promise.developer_id;
    END IF;
    
    -- Log to audit
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        auth.uid(),
        CASE WHEN v_is_on_time THEN 'promise_completed_on_time' ELSE 'promise_completed_late' END,
        'promise',
        (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1),
        jsonb_build_object(
            'promise_id', p_promise_id,
            'on_time', v_is_on_time,
            'reward', v_reward,
            'score_bonus', v_score_bonus
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'on_time', v_is_on_time,
        'reward', v_reward,
        'score_bonus', v_score_bonus
    );
END;
$$;

-- Enhanced breach function with penalties
CREATE OR REPLACE FUNCTION public.breach_promise_with_penalty(p_promise_id UUID, p_reason TEXT DEFAULT 'Deadline exceeded')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_promise RECORD;
    v_penalty NUMERIC := 50;
    v_score_penalty INTEGER := -15;
    v_hours_late NUMERIC;
    v_payment_cut_percent INTEGER := 10;
BEGIN
    SELECT * INTO v_promise FROM promise_logs WHERE id = p_promise_id FOR UPDATE;
    
    IF v_promise IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise not found');
    END IF;
    
    IF v_promise.status = 'breached' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Promise already breached');
    END IF;
    
    -- Calculate hours late
    v_hours_late := EXTRACT(EPOCH FROM (now() - COALESCE(v_promise.extended_deadline, v_promise.deadline))) / 3600;
    
    -- Escalate penalty based on lateness
    IF v_hours_late > 48 THEN
        v_penalty := 200;
        v_score_penalty := -40;
        v_payment_cut_percent := 30;
    ELSIF v_hours_late > 24 THEN
        v_penalty := 150;
        v_score_penalty := -30;
        v_payment_cut_percent := 25;
    ELSIF v_hours_late > 12 THEN
        v_penalty := 100;
        v_score_penalty := -20;
        v_payment_cut_percent := 20;
    ELSIF v_hours_late > 6 THEN
        v_penalty := 75;
        v_score_penalty := -15;
        v_payment_cut_percent := 15;
    END IF;
    
    -- Extra penalty if commitment was confirmed
    IF v_promise.confirmed_by_developer THEN
        v_penalty := v_penalty + 50;
        v_score_penalty := v_score_penalty - 10;
        v_payment_cut_percent := v_payment_cut_percent + 5;
    END IF;
    
    -- Update promise
    UPDATE promise_logs
    SET status = 'breached',
        breach_reason = p_reason,
        penalty_amount = v_penalty,
        score_effect = v_score_penalty,
        fine_amount = v_penalty,
        is_locked = TRUE,
        updated_at = now()
    WHERE id = p_promise_id;
    
    -- Deduct from developer wallet
    UPDATE developer_wallet
    SET available_balance = available_balance - v_penalty,
        total_penalties = total_penalties + v_penalty
    WHERE developer_id = v_promise.developer_id;
    
    -- Insert fine record
    INSERT INTO promise_fines (
        promise_id, developer_id, fine_amount, fine_reason, fine_type, status,
        payment_cut_percent
    ) VALUES (
        p_promise_id, v_promise.developer_id, v_penalty, p_reason, 'breach', 'pending',
        v_payment_cut_percent
    );
    
    -- Log to audit
    INSERT INTO audit_logs (user_id, action, module, role, meta_json)
    VALUES (
        COALESCE(auth.uid(), v_promise.developer_id),
        'promise_breached_with_penalty',
        'promise',
        (SELECT role FROM user_roles WHERE user_id = COALESCE(auth.uid(), v_promise.developer_id) LIMIT 1),
        jsonb_build_object(
            'promise_id', p_promise_id,
            'penalty', v_penalty,
            'score_penalty', v_score_penalty,
            'payment_cut_percent', v_payment_cut_percent,
            'hours_late', v_hours_late,
            'reason', p_reason
        )
    );
    
    RETURN jsonb_build_object(
        'success', true,
        'penalty', v_penalty,
        'score_penalty', v_score_penalty,
        'payment_cut_percent', v_payment_cut_percent
    );
END;
$$;

-- Add payment_cut_percent column to promise_fines if not exists
ALTER TABLE public.promise_fines ADD COLUMN IF NOT EXISTS payment_cut_percent INTEGER DEFAULT 10;