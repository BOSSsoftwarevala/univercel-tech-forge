CREATE TABLE IF NOT EXISTS public.task_manager_god_mode_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_key TEXT NOT NULL UNIQUE DEFAULT 'global',
  zero_click_enabled BOOLEAN NOT NULL DEFAULT false,
  auto_assign_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_heal_enabled BOOLEAN NOT NULL DEFAULT true,
  sla_guard_enabled BOOLEAN NOT NULL DEFAULT true,
  self_repair_enabled BOOLEAN NOT NULL DEFAULT true,
  human_override_required BOOLEAN NOT NULL DEFAULT false,
  confidence_threshold INTEGER NOT NULL DEFAULT 78,
  max_auto_retries INTEGER NOT NULL DEFAULT 2,
  command_cooldown_seconds INTEGER NOT NULL DEFAULT 120,
  daily_ai_budget NUMERIC NOT NULL DEFAULT 2500,
  updated_by UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT task_manager_god_mode_settings_confidence_check CHECK (confidence_threshold BETWEEN 50 AND 100),
  CONSTRAINT task_manager_god_mode_settings_retries_check CHECK (max_auto_retries BETWEEN 0 AND 10),
  CONSTRAINT task_manager_god_mode_settings_cooldown_check CHECK (command_cooldown_seconds BETWEEN 30 AND 3600)
);

CREATE TABLE IF NOT EXISTS public.task_execution_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL UNIQUE REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
  recommended_owner_type TEXT NOT NULL CHECK (recommended_owner_type IN ('ai', 'human', 'hybrid', 'monitor')),
  recommended_owner_id UUID,
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  delay_risk_score INTEGER NOT NULL DEFAULT 0,
  cost_score INTEGER NOT NULL DEFAULT 0,
  success_score INTEGER NOT NULL DEFAULT 0,
  next_best_action TEXT NOT NULL DEFAULT 'monitor',
  predicted_deadline_at TIMESTAMPTZ,
  rationale TEXT,
  snapshot JSONB NOT NULL DEFAULT '{}'::JSONB,
  computed_by UUID,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT task_execution_predictions_delay_risk_check CHECK (delay_risk_score BETWEEN 0 AND 100),
  CONSTRAINT task_execution_predictions_cost_check CHECK (cost_score BETWEEN 0 AND 100),
  CONSTRAINT task_execution_predictions_success_check CHECK (success_score BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS public.task_failure_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.developer_tasks(id) ON DELETE CASCADE,
  build_run_id UUID REFERENCES public.developer_build_runs(id) ON DELETE SET NULL,
  failure_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'retrying', 'resolved', 'ignored')),
  signature_hash TEXT NOT NULL,
  root_cause TEXT NOT NULL,
  fix_strategy TEXT,
  resolution_notes TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_manager_command_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command_key TEXT NOT NULL,
  trigger_mode TEXT NOT NULL DEFAULT 'manual' CHECK (trigger_mode IN ('manual', 'automatic', 'zero_click')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  summary TEXT,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  total_actions INTEGER NOT NULL DEFAULT 0,
  succeeded_actions INTEGER NOT NULL DEFAULT 0,
  failed_actions INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_manager_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  complexity_label TEXT NOT NULL DEFAULT 'moderate' CHECK (complexity_label IN ('simple', 'moderate', 'complex', 'critical')),
  assignment_target TEXT NOT NULL DEFAULT 'human' CHECK (assignment_target IN ('ai', 'human')),
  auto_deploy_allowed BOOLEAN NOT NULL DEFAULT false,
  usage_count INTEGER NOT NULL DEFAULT 0,
  source_task_id UUID REFERENCES public.developer_tasks(id) ON DELETE SET NULL,
  default_skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  template_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_execution_predictions_risk ON public.task_execution_predictions(risk_level, delay_risk_score DESC, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_failure_memory_task_status ON public.task_failure_memory(task_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_failure_memory_signature ON public.task_failure_memory(signature_hash, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_manager_command_runs_status ON public.task_manager_command_runs(status, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_manager_templates_module ON public.task_manager_templates(module, updated_at DESC);

ALTER TABLE public.task_manager_god_mode_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_execution_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_failure_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_manager_command_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_manager_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers can manage task manager god mode settings" ON public.task_manager_god_mode_settings;
CREATE POLICY "Managers can manage task manager god mode settings"
ON public.task_manager_god_mode_settings
FOR ALL
USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Managers can manage task execution predictions" ON public.task_execution_predictions;
CREATE POLICY "Managers can manage task execution predictions"
ON public.task_execution_predictions
FOR ALL
USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers can view own task execution predictions" ON public.task_execution_predictions;
CREATE POLICY "Developers can view own task execution predictions"
ON public.task_execution_predictions
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.developer_tasks dt
    WHERE dt.id = task_execution_predictions.task_id
      AND dt.developer_id = public.get_developer_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Managers can manage task failure memory" ON public.task_failure_memory;
CREATE POLICY "Managers can manage task failure memory"
ON public.task_failure_memory
FOR ALL
USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers can view own task failure memory" ON public.task_failure_memory;
CREATE POLICY "Developers can view own task failure memory"
ON public.task_failure_memory
FOR SELECT
USING (
  task_id IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.developer_tasks dt
    WHERE dt.id = task_failure_memory.task_id
      AND dt.developer_id = public.get_developer_id(auth.uid())
  )
);

DROP POLICY IF EXISTS "Managers can manage task manager command runs" ON public.task_manager_command_runs;
CREATE POLICY "Managers can manage task manager command runs"
ON public.task_manager_command_runs
FOR ALL
USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Managers can manage task manager templates" ON public.task_manager_templates;
CREATE POLICY "Managers can manage task manager templates"
ON public.task_manager_templates
FOR ALL
USING (public.can_manage_developers(auth.uid()))
WITH CHECK (public.can_manage_developers(auth.uid()));

DROP POLICY IF EXISTS "Developers can view task manager templates" ON public.task_manager_templates;
CREATE POLICY "Developers can view task manager templates"
ON public.task_manager_templates
FOR SELECT
USING (true);

CREATE TRIGGER update_task_manager_god_mode_settings_updated_at
BEFORE UPDATE ON public.task_manager_god_mode_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_execution_predictions_updated_at
BEFORE UPDATE ON public.task_execution_predictions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_failure_memory_updated_at
BEFORE UPDATE ON public.task_failure_memory
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_manager_command_runs_updated_at
BEFORE UPDATE ON public.task_manager_command_runs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_manager_templates_updated_at
BEFORE UPDATE ON public.task_manager_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.task_manager_god_mode_settings (
  manager_key,
  zero_click_enabled,
  auto_assign_enabled,
  auto_heal_enabled,
  sla_guard_enabled,
  self_repair_enabled,
  human_override_required,
  confidence_threshold,
  max_auto_retries,
  command_cooldown_seconds,
  daily_ai_budget,
  metadata
)
VALUES (
  'global',
  false,
  true,
  true,
  true,
  true,
  false,
  78,
  2,
  120,
  2500,
  jsonb_build_object('mode', 'god_level', 'created_by', 'migration')
)
ON CONFLICT (manager_key) DO UPDATE
SET
  auto_assign_enabled = EXCLUDED.auto_assign_enabled,
  auto_heal_enabled = EXCLUDED.auto_heal_enabled,
  sla_guard_enabled = EXCLUDED.sla_guard_enabled,
  self_repair_enabled = EXCLUDED.self_repair_enabled,
  confidence_threshold = EXCLUDED.confidence_threshold,
  max_auto_retries = EXCLUDED.max_auto_retries,
  command_cooldown_seconds = EXCLUDED.command_cooldown_seconds,
  daily_ai_budget = EXCLUDED.daily_ai_budget,
  metadata = task_manager_god_mode_settings.metadata || EXCLUDED.metadata,
  updated_at = now();