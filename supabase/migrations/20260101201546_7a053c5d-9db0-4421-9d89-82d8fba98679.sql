-- Track payment attempts and abandonments for AI follow-up
CREATE TABLE IF NOT EXISTS public.payment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  email TEXT,
  phone TEXT,
  amount DECIMAL(12,2),
  currency TEXT DEFAULT 'INR',
  payment_type TEXT, -- 'subscription', 'one-time', 'deposit', 'balance'
  product_id TEXT,
  product_name TEXT,
  status TEXT DEFAULT 'initiated', -- 'initiated', 'pending', 'completed', 'failed', 'abandoned'
  failure_reason TEXT,
  ai_followed_up BOOLEAN DEFAULT false,
  ai_followup_count INTEGER DEFAULT 0,
  ai_followup_last_at TIMESTAMPTZ,
  ai_followup_response TEXT,
  user_issue_reported TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;

-- Users can see their own payment attempts
CREATE POLICY "Users view own payments"
ON public.payment_attempts FOR SELECT
USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- System can insert payment attempts
CREATE POLICY "Insert payment attempts"
ON public.payment_attempts FOR INSERT
WITH CHECK (true);

-- Quick support requests table
CREATE TABLE IF NOT EXISTS public.quick_support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_name TEXT,
  request_type TEXT, -- 'change', 'bug', 'feature', 'payment', 'urgent'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  assigned_to UUID,
  ai_suggested_solution TEXT,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  response_time_minutes INTEGER
);

-- Enable RLS
ALTER TABLE public.quick_support_requests ENABLE ROW LEVEL SECURITY;

-- Users can see their own requests
CREATE POLICY "Users view own support requests"
ON public.quick_support_requests FOR SELECT
USING (auth.uid() = user_id);

-- Users can create support requests
CREATE POLICY "Users create support requests"
ON public.quick_support_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_attempts_status ON public.payment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_payment_attempts_user ON public.payment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_support_status ON public.quick_support_requests(status);