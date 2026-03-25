CREATE OR REPLACE FUNCTION public.can_manage_developers(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
    AND role IN ('super_admin', 'demo_manager', 'task_manager', 'performance_manager', 'admin', 'boss_owner', 'ceo')
    AND approval_status = 'approved'
)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_task_compensation(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
  SELECT 1
  FROM public.user_roles
  WHERE user_id = _user_id
    AND role IN ('super_admin', 'task_manager', 'performance_manager', 'admin', 'boss_owner', 'ceo')
    AND approval_status = 'approved'
)
$$;

CREATE TABLE IF NOT EXISTS public.ai_developer_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'busy', 'disabled')),
  skill_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  supported_modules TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  max_concurrent_tasks INTEGER NOT NULL DEFAULT 12,
  quality_bias INTEGER NOT NULL DEFAULT 88,
  deployment_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.developer_task_orchestration (
  task_id UUID PRIMARY KEY REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  complexity_source TEXT NOT NULL DEFAULT 'auto' CHECK (complexity_source IN ('auto', 'manual')),
  complexity_score INTEGER NOT NULL DEFAULT 0,
  complexity_label TEXT NOT NULL DEFAULT 'simple' CHECK (complexity_label IN ('simple', 'moderate', 'complex', 'critical')),
  assignment_target TEXT NOT NULL CHECK (assignment_target IN ('ai', 'human')),
  assignment_confidence INTEGER NOT NULL DEFAULT 0,
  assignment_reason TEXT,
  assigned_agent_id UUID REFERENCES public.ai_developer_agents(id) ON DELETE SET NULL,
  required_skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  quality_status TEXT NOT NULL DEFAULT 'pending' CHECK (quality_status IN ('pending', 'approved', 'rejected', 'override_approved')),
  quality_score INTEGER,
  quality_feedback TEXT,
  actual_minutes INTEGER NOT NULL DEFAULT 0,
  deadline_breached BOOLEAN NOT NULL DEFAULT false,
  auto_deploy_allowed BOOLEAN NOT NULL DEFAULT false,
  auto_deploy_status TEXT NOT NULL DEFAULT 'not_requested' CHECK (auto_deploy_status IN ('not_requested', 'queued', 'deployed', 'blocked')),
  reward_amount NUMERIC NOT NULL DEFAULT 0,
  penalty_amount NUMERIC NOT NULL DEFAULT 0,
  last_notification_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_developer_agents_status ON public.ai_developer_agents(status);
CREATE INDEX IF NOT EXISTS idx_developer_task_orchestration_assignment ON public.developer_task_orchestration(assignment_target, complexity_label, quality_status);
CREATE INDEX IF NOT EXISTS idx_developer_task_orchestration_module ON public.developer_task_orchestration(module, created_at DESC);

ALTER TABLE public.ai_developer_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_task_orchestration ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers can manage ai agents" ON public.ai_developer_agents;
CREATE POLICY "Managers can manage ai agents"
ON public.ai_developer_agents
FOR ALL
USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Managers can manage task orchestration" ON public.developer_task_orchestration;
CREATE POLICY "Managers can manage task orchestration"
ON public.developer_task_orchestration
FOR ALL
USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers view own orchestration" ON public.developer_task_orchestration;
CREATE POLICY "Developers view own orchestration"
ON public.developer_task_orchestration
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.developer_tasks dt
    WHERE dt.id = developer_task_orchestration.task_id
      AND dt.developer_id = public.get_developer_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Managers can manage wallets for task system" ON public.developer_wallet;
CREATE POLICY "Managers can manage wallets for task system"
ON public.developer_wallet
FOR ALL
USING (public.can_manage_task_compensation(auth.uid()))
WITH CHECK (public.can_manage_task_compensation(auth.uid()));

DROP POLICY IF EXISTS "Managers can manage wallet transactions for task system" ON public.developer_wallet_transactions;
CREATE POLICY "Managers can manage wallet transactions for task system"
ON public.developer_wallet_transactions
FOR ALL
USING (public.can_manage_task_compensation(auth.uid()))
WITH CHECK (public.can_manage_task_compensation(auth.uid()));

CREATE TRIGGER update_ai_developer_agents_updated_at
BEFORE UPDATE ON public.ai_developer_agents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_developer_task_orchestration_updated_at
BEFORE UPDATE ON public.developer_task_orchestration
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.ai_developer_agents (
  agent_key,
  display_name,
  status,
  skill_tags,
  supported_modules,
  max_concurrent_tasks,
  quality_bias,
  deployment_enabled
)
VALUES
  (
    'vala-autofix',
    'VALA AutoFix',
    'active',
    ARRAY['bugfix', 'typescript', 'react', 'auth', 'api'],
    ARRAY['auth', 'marketplace', 'dashboard', 'support'],
    18,
    91,
    true
  ),
  (
    'vala-builder',
    'VALA Builder',
    'active',
    ARRAY['feature', 'frontend', 'backend', 'database', 'automation'],
    ARRAY['server', 'marketplace', 'billing', 'admin', 'developer'],
    14,
    88,
    true
  ),
  (
    'vala-qa',
    'VALA Quality Gate',
    'active',
    ARRAY['quality', 'security', 'performance', 'review'],
    ARRAY['auth', 'server', 'marketplace', 'compliance'],
    20,
    94,
    false
  )
ON CONFLICT (agent_key) DO UPDATE
SET
  display_name = EXCLUDED.display_name,
  status = EXCLUDED.status,
  skill_tags = EXCLUDED.skill_tags,
  supported_modules = EXCLUDED.supported_modules,
  max_concurrent_tasks = EXCLUDED.max_concurrent_tasks,
  quality_bias = EXCLUDED.quality_bias,
  deployment_enabled = EXCLUDED.deployment_enabled,
  updated_at = now();