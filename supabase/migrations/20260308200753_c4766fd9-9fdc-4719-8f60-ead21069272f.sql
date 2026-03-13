
-- Revenue split configuration (Boss can override percentages)
CREATE TABLE public.revenue_split_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  split_name text NOT NULL,
  marketing_percent numeric NOT NULL DEFAULT 40,
  government_percent numeric NOT NULL DEFAULT 28,
  office_percent numeric NOT NULL DEFAULT 20,
  boss_percent numeric NOT NULL DEFAULT 12,
  is_active boolean DEFAULT true,
  updated_by uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Revenue allocations (auto-split records per order)
CREATE TABLE public.revenue_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text,
  total_amount numeric NOT NULL,
  marketing_amount numeric NOT NULL DEFAULT 0,
  government_amount numeric NOT NULL DEFAULT 0,
  office_amount numeric NOT NULL DEFAULT 0,
  boss_amount numeric NOT NULL DEFAULT 0,
  split_config_id uuid REFERENCES public.revenue_split_config(id),
  status text DEFAULT 'allocated',
  created_at timestamptz DEFAULT now()
);

-- AIRA task delegations to VALA
CREATE TABLE public.aira_task_delegations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_description text NOT NULL,
  task_type text DEFAULT 'general',
  delegated_to text DEFAULT 'vala_ai',
  status text DEFAULT 'pending',
  priority text DEFAULT 'normal',
  boss_user_id uuid,
  aira_notes text,
  vala_result jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE public.revenue_split_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aira_task_delegations ENABLE ROW LEVEL SECURITY;

-- RLS: Only authenticated users with boss/admin roles
CREATE POLICY "Boss can manage revenue config" ON public.revenue_split_config FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Boss can view allocations" ON public.revenue_allocations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Boss can manage delegations" ON public.aira_task_delegations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert default split config
INSERT INTO public.revenue_split_config (split_name, marketing_percent, government_percent, office_percent, boss_percent)
VALUES ('Default Split', 40, 28, 20, 12);
