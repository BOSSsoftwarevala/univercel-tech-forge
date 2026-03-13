-- Developer Violations tracking
CREATE TABLE public.developer_violations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.developer_tasks(id),
    violation_type TEXT NOT NULL, -- 'missed_deadline', 'quality_issue', 'idle_timeout', 'sla_breach', 'behavior'
    severity TEXT NOT NULL DEFAULT 'warning', -- 'warning', 'strike', 'critical'
    description TEXT,
    penalty_amount NUMERIC DEFAULT 0,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMPTZ,
    auto_generated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by UUID
);

-- Developer Timer Logs for detailed tracking
CREATE TABLE public.developer_timer_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'start', 'pause', 'resume', 'stop', 'checkpoint'
    checkpoint_type TEXT, -- 'started', 'coding', 'testing', 'ready'
    pause_reason TEXT,
    elapsed_minutes INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    metadata JSONB
);

-- Developer Activity Logs
CREATE TABLE public.developer_activity_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'login', 'logout', 'task_view', 'file_upload', 'chat_message', 'status_change'
    description TEXT,
    ip_address TEXT,
    device_info TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Developer Wallet for tracking earnings
CREATE TABLE public.developer_wallet (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE UNIQUE,
    available_balance NUMERIC NOT NULL DEFAULT 0,
    pending_balance NUMERIC NOT NULL DEFAULT 0,
    total_earned NUMERIC NOT NULL DEFAULT 0,
    total_withdrawn NUMERIC NOT NULL DEFAULT 0,
    total_penalties NUMERIC NOT NULL DEFAULT 0,
    last_payout_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Developer Wallet Transactions
CREATE TABLE public.developer_wallet_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    wallet_id UUID NOT NULL REFERENCES public.developer_wallet(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- 'credit', 'debit', 'penalty', 'bonus', 'withdrawal'
    amount NUMERIC NOT NULL,
    balance_after NUMERIC NOT NULL,
    task_id UUID REFERENCES public.developer_tasks(id),
    reference_type TEXT,
    reference_id UUID,
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Developer Code Submissions
CREATE TABLE public.developer_code_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id UUID NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
    submission_type TEXT NOT NULL DEFAULT 'final', -- 'draft', 'review', 'final'
    file_urls JSONB DEFAULT '[]'::jsonb,
    commit_message TEXT,
    notes TEXT,
    ai_review_score INTEGER,
    ai_review_feedback TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMPTZ,
    review_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'revision_needed'
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.developer_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_timer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_code_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for developer_violations
CREATE POLICY "Developers view own violations" ON public.developer_violations
    FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Managers can manage violations" ON public.developer_violations
    FOR ALL USING (can_manage_developers(auth.uid()));

-- RLS Policies for developer_timer_logs
CREATE POLICY "Developers view own timer logs" ON public.developer_timer_logs
    FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Developers insert own timer logs" ON public.developer_timer_logs
    FOR INSERT WITH CHECK (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Managers can manage timer logs" ON public.developer_timer_logs
    FOR ALL USING (can_manage_developers(auth.uid()));

-- RLS Policies for developer_activity_logs
CREATE POLICY "Developers insert own activity logs" ON public.developer_activity_logs
    FOR INSERT WITH CHECK (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Managers can view activity logs" ON public.developer_activity_logs
    FOR SELECT USING (can_manage_developers(auth.uid()));

-- RLS Policies for developer_wallet
CREATE POLICY "Developers view own wallet" ON public.developer_wallet
    FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Finance can manage wallets" ON public.developer_wallet
    FOR ALL USING (can_access_finance(auth.uid()));

-- RLS Policies for developer_wallet_transactions
CREATE POLICY "Developers view own transactions" ON public.developer_wallet_transactions
    FOR SELECT USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Finance can manage transactions" ON public.developer_wallet_transactions
    FOR ALL USING (can_access_finance(auth.uid()));

-- RLS Policies for developer_code_submissions
CREATE POLICY "Developers manage own submissions" ON public.developer_code_submissions
    FOR ALL USING (developer_id = get_developer_id(auth.uid()));

CREATE POLICY "Managers can manage all submissions" ON public.developer_code_submissions
    FOR ALL USING (can_manage_developers(auth.uid()));

-- Add new columns to developers table for enhanced tracking
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS skill_test_status TEXT DEFAULT 'pending';
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS skill_test_score INTEGER;
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS is_frozen BOOLEAN DEFAULT false;
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS frozen_reason TEXT;
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS frozen_at TIMESTAMPTZ;
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS total_strikes INTEGER DEFAULT 0;
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';
ALTER TABLE public.developers ADD COLUMN IF NOT EXISTS current_task_id UUID;

-- Add new columns to developer_tasks for enhanced workflow
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS sla_hours NUMERIC DEFAULT 2;
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS checkpoint_status TEXT DEFAULT 'pending';
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS promised_delivery_at TIMESTAMPTZ;
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS actual_delivery_at TIMESTAMPTZ;
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS quality_score INTEGER;
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS client_rating INTEGER;
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS task_amount NUMERIC DEFAULT 0;
ALTER TABLE public.developer_tasks ADD COLUMN IF NOT EXISTS penalty_amount NUMERIC DEFAULT 0;