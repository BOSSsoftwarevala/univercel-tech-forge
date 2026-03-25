ALTER TABLE public.franchise_accounts
ADD COLUMN IF NOT EXISTS role_alias TEXT NOT NULL DEFAULT 'franchise_owner',
ADD COLUMN IF NOT EXISTS display_role_label TEXT NOT NULL DEFAULT 'Franchise Manager';

CREATE TABLE IF NOT EXISTS public.franchise_manager_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.franchise_stores(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('manager', 'sales', 'support', 'operations', 'marketing')),
  performance_score NUMERIC(5,2) NOT NULL DEFAULT 72,
  activity_status TEXT NOT NULL DEFAULT 'active' CHECK (activity_status IN ('active', 'inactive', 'watch')),
  last_activity_at TIMESTAMPTZ,
  reward_status TEXT NOT NULL DEFAULT 'standard' CHECK (reward_status IN ('standard', 'reward')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (franchise_id, full_name, role)
);

CREATE TABLE IF NOT EXISTS public.franchise_customer_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  city TEXT NOT NULL,
  new_customers INTEGER NOT NULL DEFAULT 0,
  repeat_customers INTEGER NOT NULL DEFAULT 0,
  churn_customers INTEGER NOT NULL DEFAULT 0,
  predicted_churn_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  traffic_density NUMERIC(8,2) NOT NULL DEFAULT 0,
  revenue_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (franchise_id, activity_date, city)
);

CREATE TABLE IF NOT EXISTS public.franchise_manager_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES public.franchise_accounts(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('equipment_purchase', 'staff_hiring', 'marketing_budget')),
  request_title TEXT NOT NULL,
  request_description TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  requested_by_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed')),
  execution_blocked BOOLEAN NOT NULL DEFAULT true,
  approved_by UUID,
  approved_role TEXT NOT NULL DEFAULT 'franchise_owner',
  approval_note TEXT,
  approved_at TIMESTAMPTZ,
  request_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_franchise_manager_staff_franchise_activity
ON public.franchise_manager_staff(franchise_id, activity_status, performance_score DESC);

CREATE INDEX IF NOT EXISTS idx_franchise_customer_activity_franchise_date
ON public.franchise_customer_activity(franchise_id, activity_date DESC, city);

CREATE INDEX IF NOT EXISTS idx_franchise_manager_approvals_franchise_status
ON public.franchise_manager_approvals(franchise_id, status, request_type, created_at DESC);

ALTER TABLE public.franchise_manager_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_customer_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_manager_approvals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage manager staff" ON public.franchise_manager_staff;
CREATE POLICY "Admins can manage manager staff"
ON public.franchise_manager_staff
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own manager staff" ON public.franchise_manager_staff;
CREATE POLICY "Franchises view own manager staff"
ON public.franchise_manager_staff
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage customer activity" ON public.franchise_customer_activity;
CREATE POLICY "Admins can manage customer activity"
ON public.franchise_customer_activity
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises view own customer activity" ON public.franchise_customer_activity;
CREATE POLICY "Franchises view own customer activity"
ON public.franchise_customer_activity
FOR SELECT USING (franchise_id = public.get_franchise_id(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage manager approvals" ON public.franchise_manager_approvals;
CREATE POLICY "Admins can manage manager approvals"
ON public.franchise_manager_approvals
FOR ALL USING (public.can_manage_franchises(auth.uid()));

DROP POLICY IF EXISTS "Franchises manage own manager approvals" ON public.franchise_manager_approvals;
CREATE POLICY "Franchises manage own manager approvals"
ON public.franchise_manager_approvals
FOR ALL USING (franchise_id = public.get_franchise_id(auth.uid()))
WITH CHECK (franchise_id = public.get_franchise_id(auth.uid()));

DROP TRIGGER IF EXISTS update_franchise_manager_staff_updated_at ON public.franchise_manager_staff;
CREATE TRIGGER update_franchise_manager_staff_updated_at
BEFORE UPDATE ON public.franchise_manager_staff
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_franchise_manager_approvals_updated_at ON public.franchise_manager_approvals;
CREATE TRIGGER update_franchise_manager_approvals_updated_at
BEFORE UPDATE ON public.franchise_manager_approvals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.franchise_manager_staff (
  franchise_id,
  store_id,
  full_name,
  role,
  performance_score,
  activity_status,
  last_activity_at,
  reward_status,
  metadata
)
SELECT
  fa.id,
  fs.id,
  seed.full_name,
  seed.role,
  seed.performance_score,
  seed.activity_status,
  now() - seed.last_seen_interval,
  seed.reward_status,
  seed.metadata
FROM public.franchise_accounts fa
LEFT JOIN LATERAL (
  SELECT id
  FROM public.franchise_stores
  WHERE franchise_id = fa.id
  ORDER BY performance_score DESC NULLS LAST, created_at ASC
  LIMIT 1
) fs ON true
CROSS JOIN (
  VALUES
    ('Aarav Kulkarni', 'manager', 92.4, 'active', interval '45 minutes', 'reward', '{"activity":"top_closer"}'::jsonb),
    ('Meera Shah', 'sales', 88.1, 'active', interval '2 hours', 'reward', '{"activity":"lead_speed"}'::jsonb),
    ('Rohit Naik', 'operations', 41.7, 'inactive', interval '4 days', 'standard', '{"activity":"needs_followup"}'::jsonb),
    ('Isha Verma', 'marketing', 79.3, 'watch', interval '14 hours', 'standard', '{"activity":"campaign_monitor"}'::jsonb)
) AS seed(full_name, role, performance_score, activity_status, last_seen_interval, reward_status, metadata)
ON CONFLICT (franchise_id, full_name, role) DO NOTHING;

INSERT INTO public.franchise_customer_activity (
  franchise_id,
  activity_date,
  city,
  new_customers,
  repeat_customers,
  churn_customers,
  predicted_churn_rate,
  traffic_density,
  revenue_amount,
  metadata
)
SELECT
  fa.id,
  CURRENT_DATE,
  fa.city,
  18,
  42,
  5,
  12.6,
  84.5,
  248500,
  jsonb_build_object('source', 'seed', 'demand_signal', 'high')
FROM public.franchise_accounts fa
ON CONFLICT (franchise_id, activity_date, city) DO NOTHING;

INSERT INTO public.franchise_manager_approvals (
  franchise_id,
  request_type,
  request_title,
  request_description,
  amount,
  requested_by_name,
  status,
  execution_blocked,
  request_data
)
SELECT
  fa.id,
  seed.request_type,
  seed.request_title,
  seed.request_description,
  seed.amount,
  seed.requested_by_name,
  seed.status,
  seed.execution_blocked,
  seed.request_data
FROM public.franchise_accounts fa
CROSS JOIN (
  VALUES
    ('equipment_purchase', 'POS terminal refresh', 'Replace damaged billing terminal before peak traffic.', 65000, 'Ops Desk', 'pending', true, '{"priority":"high"}'::jsonb),
    ('staff_hiring', 'Hire evening sales executive', 'Approve one additional closer for evening traffic.', 28000, 'Store Manager', 'pending', true, '{"shift":"evening"}'::jsonb),
    ('marketing_budget', 'Festival burst budget', 'Approve Diwali regional acquisition campaign.', 120000, 'Marketing Lead', 'approved', false, '{"campaign":"festival-burst"}'::jsonb)
) AS seed(request_type, request_title, request_description, amount, requested_by_name, status, execution_blocked, request_data)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.franchise_manager_approvals existing
  WHERE existing.franchise_id = fa.id
    AND existing.request_title = seed.request_title
);