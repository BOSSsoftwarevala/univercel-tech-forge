
-- Finance Security Policies Table
CREATE TABLE public.finance_security_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name text NOT NULL UNIQUE,
  policy_type text NOT NULL DEFAULT 'permanent',
  description text,
  is_active boolean NOT NULL DEFAULT true,
  enforced_at timestamp with time zone DEFAULT now(),
  enforced_by text DEFAULT 'system',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Transaction Security Locks Table  
CREATE TABLE public.transaction_security_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text NOT NULL,
  lock_type text NOT NULL DEFAULT 'validation_pending',
  locked_at timestamp with time zone DEFAULT now(),
  unlocked_at timestamp with time zone,
  otp_verified boolean DEFAULT false,
  gateway_verified boolean DEFAULT false,
  boss_approved boolean DEFAULT false,
  lock_status text NOT NULL DEFAULT 'locked',
  user_id uuid NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Finance Security Alerts Table
CREATE TABLE public.finance_security_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  severity text NOT NULL DEFAULT 'medium',
  user_id uuid,
  description text NOT NULL,
  is_resolved boolean DEFAULT false,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.finance_security_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_security_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_security_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "read_policies" ON public.finance_security_policies FOR SELECT TO authenticated USING (true);
CREATE POLICY "manage_policies" ON public.finance_security_policies FOR ALL TO authenticated USING (
  public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'master')
);

CREATE POLICY "view_own_locks" ON public.transaction_security_locks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "insert_own_locks" ON public.transaction_security_locks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "manage_locks" ON public.transaction_security_locks FOR ALL TO authenticated USING (
  public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'master') OR public.has_role(auth.uid(), 'finance_manager')
);

CREATE POLICY "view_own_alerts" ON public.finance_security_alerts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "manage_alerts" ON public.finance_security_alerts FOR ALL TO authenticated USING (
  public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'master') OR public.has_role(auth.uid(), 'finance_manager')
);

-- Insert permanent security policies
INSERT INTO public.finance_security_policies (policy_name, policy_type, description, metadata) VALUES
  ('no_return_no_exchange', 'permanent', 'All digital products are final sale. No return, no exchange, no refund after purchase.', '{"applies_to": "marketplace", "product_type": "digital"}'),
  ('one_time_sale', 'permanent', 'Product purchase is one-time. Once paid, product permanently unlocked and recorded.', '{"applies_to": "marketplace"}'),
  ('boss_approval_required', 'permanent', 'No financial transfer, payout, or refund without Boss/Admin approval.', '{"applies_to": "all_financial_actions"}'),
  ('otp_payment_security', 'permanent', 'Every critical payment action requires OTP verification.', '{"threshold_amount": 0, "applies_to": "withdrawals,payouts,refunds"}'),
  ('fraud_prevention', 'permanent', 'Block abnormal payment attempts, spam transactions, repeated failures.', '{"max_failed_attempts": 5, "block_duration_hours": 24}'),
  ('transaction_lock', 'permanent', 'All transactions locked until gateway verification, OTP validation, and approval.', '{"lock_stages": ["gateway","otp","approval"]}'),
  ('immutable_finance_logging', 'permanent', 'All financial activity permanently recorded.', '{"retention": "permanent"}');
