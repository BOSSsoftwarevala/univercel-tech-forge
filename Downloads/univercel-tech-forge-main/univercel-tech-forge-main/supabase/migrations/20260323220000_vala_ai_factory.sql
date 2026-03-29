CREATE OR REPLACE FUNCTION public.generate_vala_factory_license_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  generated_key TEXT;
BEGIN
  generated_key := 'VALA-' || upper(substring(encode(gen_random_bytes(16), 'hex') from 1 for 24));
  RETURN generated_key;
END;
$$;

CREATE TABLE IF NOT EXISTS public.vala_factory_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  project_slug TEXT NOT NULL UNIQUE,
  prompt TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'web_app',
  status TEXT NOT NULL DEFAULT 'planning',
  stack_frontend TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  stack_backend TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  stack_database TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  architecture JSONB NOT NULL DEFAULT '{}'::JSONB,
  schema_plan JSONB NOT NULL DEFAULT '[]'::JSONB,
  api_plan JSONB NOT NULL DEFAULT '[]'::JSONB,
  ui_plan JSONB NOT NULL DEFAULT '[]'::JSONB,
  feature_matrix JSONB NOT NULL DEFAULT '{}'::JSONB,
  integrations JSONB NOT NULL DEFAULT '[]'::JSONB,
  preview_state JSONB NOT NULL DEFAULT '{}'::JSONB,
  deployment_state JSONB NOT NULL DEFAULT '{}'::JSONB,
  product_state JSONB NOT NULL DEFAULT '{}'::JSONB,
  current_run_id UUID,
  active_errors INTEGER NOT NULL DEFAULT 0,
  auto_fix_enabled BOOLEAN NOT NULL DEFAULT true,
  is_live_preview_ready BOOLEAN NOT NULL DEFAULT false,
  is_realtime_enabled BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL DEFAULT 'build',
  status TEXT NOT NULL DEFAULT 'queued',
  summary TEXT,
  build_output JSONB NOT NULL DEFAULT '{}'::JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  agent_name TEXT NOT NULL,
  responsibility TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  progress INTEGER NOT NULL DEFAULT 0,
  result_summary TEXT,
  output JSONB NOT NULL DEFAULT '{}'::JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_commands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  command_text TEXT NOT NULL,
  normalized_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  output TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  artifact_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'generated',
  content TEXT NOT NULL,
  checksum TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, file_path)
);

CREATE TABLE IF NOT EXISTS public.vala_factory_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'vercel',
  deployment_target TEXT NOT NULL DEFAULT 'preview',
  deployment_status TEXT NOT NULL DEFAULT 'queued',
  preview_url TEXT,
  live_url TEXT,
  domain TEXT,
  ssl_status TEXT NOT NULL DEFAULT 'pending',
  deployment_logs JSONB NOT NULL DEFAULT '[]'::JSONB,
  deployed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.vala_factory_deployments(id) ON DELETE SET NULL,
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  billing_model TEXT NOT NULL DEFAULT 'license',
  sale_status TEXT NOT NULL DEFAULT 'draft',
  pricing JSONB NOT NULL DEFAULT '{"amount":0,"currency":"INR"}'::JSONB,
  license_key TEXT NOT NULL DEFAULT public.generate_vala_factory_license_key(),
  sales_page_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(license_key)
);

CREATE INDEX IF NOT EXISTS idx_vala_factory_projects_owner ON public.vala_factory_projects(owner_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_projects_status ON public.vala_factory_projects(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_runs_project ON public.vala_factory_runs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_agent_tasks_project ON public.vala_factory_agent_tasks(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_commands_project ON public.vala_factory_commands(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_artifacts_project ON public.vala_factory_artifacts(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_deployments_project ON public.vala_factory_deployments(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_products_project ON public.vala_factory_products(project_id, created_at DESC);

ALTER TABLE public.vala_factory_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vala_factory_projects_owner_read" ON public.vala_factory_projects;
CREATE POLICY "vala_factory_projects_owner_read"
ON public.vala_factory_projects
FOR SELECT
USING (
  owner_user_id = auth.uid()
  OR public.has_role(auth.uid(), 'boss_owner')
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'ai_manager')
  OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "vala_factory_projects_owner_manage" ON public.vala_factory_projects;
CREATE POLICY "vala_factory_projects_owner_manage"
ON public.vala_factory_projects
FOR ALL
USING (
  owner_user_id = auth.uid()
  OR public.has_role(auth.uid(), 'boss_owner')
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'ai_manager')
  OR public.has_role(auth.uid(), 'ceo')
)
WITH CHECK (
  owner_user_id = auth.uid()
  OR public.has_role(auth.uid(), 'boss_owner')
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'ai_manager')
  OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "vala_factory_runs_project_access" ON public.vala_factory_runs;
CREATE POLICY "vala_factory_runs_project_access"
ON public.vala_factory_runs
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_runs.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_runs.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "vala_factory_agent_tasks_project_access" ON public.vala_factory_agent_tasks;
CREATE POLICY "vala_factory_agent_tasks_project_access"
ON public.vala_factory_agent_tasks
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_agent_tasks.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_agent_tasks.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "vala_factory_commands_project_access" ON public.vala_factory_commands;
CREATE POLICY "vala_factory_commands_project_access"
ON public.vala_factory_commands
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_commands.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_commands.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "vala_factory_artifacts_project_access" ON public.vala_factory_artifacts;
CREATE POLICY "vala_factory_artifacts_project_access"
ON public.vala_factory_artifacts
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_artifacts.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_artifacts.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "vala_factory_deployments_project_access" ON public.vala_factory_deployments;
CREATE POLICY "vala_factory_deployments_project_access"
ON public.vala_factory_deployments
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_deployments.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_deployments.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "vala_factory_products_project_access" ON public.vala_factory_products;
CREATE POLICY "vala_factory_products_project_access"
ON public.vala_factory_products
FOR ALL
USING (
  owner_user_id = auth.uid()
  OR public.has_role(auth.uid(), 'boss_owner')
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'ai_manager')
  OR public.has_role(auth.uid(), 'ceo')
)
WITH CHECK (
  owner_user_id = auth.uid()
  OR public.has_role(auth.uid(), 'boss_owner')
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'ai_manager')
  OR public.has_role(auth.uid(), 'ceo')
);

CREATE TRIGGER update_vala_factory_projects_updated_at
BEFORE UPDATE ON public.vala_factory_projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vala_factory_runs_updated_at
BEFORE UPDATE ON public.vala_factory_runs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vala_factory_agent_tasks_updated_at
BEFORE UPDATE ON public.vala_factory_agent_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vala_factory_artifacts_updated_at
BEFORE UPDATE ON public.vala_factory_artifacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vala_factory_deployments_updated_at
BEFORE UPDATE ON public.vala_factory_deployments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vala_factory_products_updated_at
BEFORE UPDATE ON public.vala_factory_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
