-- STEP 4: Button Execution Tracking Table
CREATE TABLE IF NOT EXISTS public.button_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  button_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  role_id TEXT,
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'success', 'failed', 'cancelled')),
  latency_ms INTEGER,
  error_code TEXT,
  error_message TEXT,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- STEP 6: Approval Engine Enhancement
CREATE TABLE IF NOT EXISTS public.approval_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id UUID REFERENCES public.approvals(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL DEFAULT 1,
  approver_role TEXT NOT NULL,
  approver_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'skipped')),
  decision_notes TEXT,
  decided_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- STEP 7: AI Job Pipeline Tables
CREATE TABLE IF NOT EXISTS public.ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  source_module TEXT NOT NULL,
  source_button_id TEXT,
  input_data JSONB,
  output_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  human_approved BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.ai_job_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.ai_jobs(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_type TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.button_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_job_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for button_executions
CREATE POLICY "Users can view own button executions" 
  ON public.button_executions FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Insert button executions" 
  ON public.button_executions FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Update own button executions" 
  ON public.button_executions FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for approval_steps
CREATE POLICY "View approval steps" 
  ON public.approval_steps FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Insert approval steps" 
  ON public.approval_steps FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Update approval steps" 
  ON public.approval_steps FOR UPDATE 
  TO authenticated 
  USING (true);

-- RLS Policies for ai_jobs
CREATE POLICY "View AI jobs" 
  ON public.ai_jobs FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Insert AI jobs" 
  ON public.ai_jobs FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Update AI jobs" 
  ON public.ai_jobs FOR UPDATE 
  TO authenticated 
  USING (true);

-- RLS Policies for ai_job_steps
CREATE POLICY "View AI job steps" 
  ON public.ai_job_steps FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Insert AI job steps" 
  ON public.ai_job_steps FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_button_executions_user ON public.button_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_button_executions_button ON public.button_executions(button_id);
CREATE INDEX IF NOT EXISTS idx_button_executions_created ON public.button_executions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_approval_steps_approval ON public.approval_steps(approval_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON public.ai_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created ON public.ai_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_job_steps_job ON public.ai_job_steps(job_id);