ALTER TABLE public.vala_factory_projects
ADD COLUMN IF NOT EXISTS input_source TEXT NOT NULL DEFAULT 'prompt' CHECK (input_source IN ('prompt', 'template', 'clone')),
ADD COLUMN IF NOT EXISTS template_key TEXT,
ADD COLUMN IF NOT EXISTS cloned_from_project_id UUID REFERENCES public.vala_factory_projects(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS raw_input_saved JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS project_blueprint JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS pipeline_status TEXT NOT NULL DEFAULT 'draft' CHECK (pipeline_status IN ('draft', 'running', 'paused', 'stopped', 'retrying', 'force_build', 'stable', 'failed')),
ADD COLUMN IF NOT EXISTS current_stage TEXT NOT NULL DEFAULT 'input' CHECK (current_stage IN ('input', 'understanding', 'planning', 'modules', 'ui', 'api', 'database', 'flow', 'auth', 'payment', 'build', 'test', 'fix', 'approval', 'deploy', 'sell', 'manage')),
ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'developer', 'qa', 'admin', 'deploy_ready', 'override', 'approved')),
ADD COLUMN IF NOT EXISTS stable BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS theme_lock TEXT NOT NULL DEFAULT 'system-design',
ADD COLUMN IF NOT EXISTS auth_config JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS payment_config JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS scaling_config JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS backup_config JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS monitoring_config JSONB NOT NULL DEFAULT '{}'::JSONB;

CREATE TABLE IF NOT EXISTS public.modules_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key TEXT NOT NULL UNIQUE,
  module_name TEXT NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('core', 'optional', 'role_based')),
  description TEXT,
  default_config JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_project_inputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('prompt', 'template', 'clone')),
  template_key TEXT,
  clone_project_id UUID REFERENCES public.vala_factory_projects(id) ON DELETE SET NULL,
  raw_input_saved JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  understanding JSONB NOT NULL DEFAULT '{}'::JSONB,
  requirement_breakdown JSONB NOT NULL DEFAULT '[]'::JSONB,
  feature_mapping JSONB NOT NULL DEFAULT '[]'::JSONB,
  role_detection JSONB NOT NULL DEFAULT '[]'::JSONB,
  business_logic JSONB NOT NULL DEFAULT '[]'::JSONB,
  blueprint_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_project_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL,
  module_name TEXT NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('core', 'optional', 'role_based')),
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'generated', 'connected', 'active', 'disabled')),
  source TEXT NOT NULL DEFAULT 'system',
  config JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, module_key)
);

CREATE TABLE IF NOT EXISTS public.vala_factory_api_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  spec_type TEXT NOT NULL CHECK (spec_type IN ('auth', 'crud', 'payment', 'admin', 'system')),
  route_path TEXT NOT NULL,
  http_method TEXT NOT NULL,
  auth_required BOOLEAN NOT NULL DEFAULT true,
  rate_limited BOOLEAN NOT NULL DEFAULT true,
  validation_schema JSONB NOT NULL DEFAULT '{}'::JSONB,
  spec_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_db_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  columns_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  relations_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  indexes_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  audit_logs_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, table_name)
);

CREATE TABLE IF NOT EXISTS public.vala_factory_flow_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  flow_name TEXT NOT NULL,
  routes_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  state_logic JSONB NOT NULL DEFAULT '{}'::JSONB,
  role_access JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, flow_name)
);

CREATE TABLE IF NOT EXISTS public.vala_factory_mobile_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  build_type TEXT NOT NULL CHECK (build_type IN ('apk-debug', 'apk-release', 'aab', 'pwa')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'pending_configuration', 'running', 'paused', 'stopped', 'retrying', 'failed', 'signed', 'completed')),
  version_code INTEGER NOT NULL DEFAULT 1,
  version_name TEXT NOT NULL DEFAULT '1.0.0',
  signing_status TEXT NOT NULL DEFAULT 'pending' CHECK (signing_status IN ('pending', 'signed', 'failed')),
  artifact_url TEXT,
  output_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  stable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  suite_name TEXT NOT NULL CHECK (suite_name IN ('login', 'api', 'database', 'flows', 'crash', 'full_regression')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'passed', 'failed')),
  summary JSONB NOT NULL DEFAULT '{}'::JSONB,
  failure_logs JSONB NOT NULL DEFAULT '[]'::JSONB,
  stable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_stage_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL CHECK (stage_name IN ('developer', 'qa', 'admin', 'deploy')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'override')),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note TEXT,
  override_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, stage_name)
);

CREATE TABLE IF NOT EXISTS public.vala_factory_pipeline_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'stopped', 'retrying', 'force_build', 'stable', 'failed')),
  last_action TEXT NOT NULL DEFAULT 'start',
  auto_fix_enabled BOOLEAN NOT NULL DEFAULT true,
  stable BOOLEAN NOT NULL DEFAULT false,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  control_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_runtime_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  log_type TEXT NOT NULL CHECK (log_type IN ('pipeline', 'build', 'test', 'deploy', 'security', 'approval', 'backup', 'monitoring')),
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('usage', 'success_rate', 'failure_logs', 'export')),
  report_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  export_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  source_run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  version_label TEXT NOT NULL,
  change_summary TEXT,
  rollback_available BOOLEAN NOT NULL DEFAULT true,
  version_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('database', 'artifacts', 'full')),
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'restored', 'failed')),
  storage_ref TEXT,
  snapshot_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  restored_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.vala_factory_deployments(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.vala_factory_products(id) ON DELETE SET NULL,
  license_key TEXT NOT NULL UNIQUE DEFAULT public.generate_vala_factory_license_key(),
  domain_lock TEXT,
  expires_at TIMESTAMPTZ,
  abuse_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'expired')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vala_factory_project_inputs_project ON public.vala_factory_project_inputs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_project_modules_project ON public.vala_factory_project_modules(project_id, module_type);
CREATE INDEX IF NOT EXISTS idx_vala_factory_mobile_builds_project ON public.vala_factory_mobile_builds(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_test_runs_project ON public.vala_factory_test_runs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_runtime_logs_project ON public.vala_factory_runtime_logs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_reports_project ON public.vala_factory_reports(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_versions_project ON public.vala_factory_versions(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_backups_project ON public.vala_factory_backups(project_id, created_at DESC);

ALTER TABLE public.modules_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_project_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_project_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_api_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_db_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_flow_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_mobile_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_stage_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_pipeline_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_runtime_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vala_factory_modules_master_admin_access" ON public.modules_master;
CREATE POLICY "vala_factory_modules_master_admin_access"
ON public.modules_master FOR ALL
USING (
  public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')
);

DROP POLICY IF EXISTS "vala_factory_inputs_project_access" ON public.vala_factory_project_inputs;
CREATE POLICY "vala_factory_inputs_project_access"
ON public.vala_factory_project_inputs FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_project_inputs.project_id
      AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_project_inputs.project_id
      AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
  )
);

DROP POLICY IF EXISTS "vala_factory_blueprints_project_access" ON public.vala_factory_blueprints;
CREATE POLICY "vala_factory_blueprints_project_access"
ON public.vala_factory_blueprints FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_blueprints.project_id
      AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_blueprints.project_id
      AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
  )
);

DROP POLICY IF EXISTS "vala_factory_project_modules_access" ON public.vala_factory_project_modules;
CREATE POLICY "vala_factory_project_modules_access"
ON public.vala_factory_project_modules FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_project_modules.project_id
      AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_project_modules.project_id
      AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
  )
);

DROP POLICY IF EXISTS "vala_factory_api_specs_access" ON public.vala_factory_api_specs;
CREATE POLICY "vala_factory_api_specs_access" ON public.vala_factory_api_specs FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_api_specs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_api_specs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_db_specs_access" ON public.vala_factory_db_specs;
CREATE POLICY "vala_factory_db_specs_access" ON public.vala_factory_db_specs FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_db_specs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_db_specs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_flow_specs_access" ON public.vala_factory_flow_specs;
CREATE POLICY "vala_factory_flow_specs_access" ON public.vala_factory_flow_specs FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_flow_specs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_flow_specs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_mobile_builds_access" ON public.vala_factory_mobile_builds;
CREATE POLICY "vala_factory_mobile_builds_access" ON public.vala_factory_mobile_builds FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_mobile_builds.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_mobile_builds.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_test_runs_access" ON public.vala_factory_test_runs;
CREATE POLICY "vala_factory_test_runs_access" ON public.vala_factory_test_runs FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_test_runs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_test_runs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_stage_approvals_access" ON public.vala_factory_stage_approvals;
CREATE POLICY "vala_factory_stage_approvals_access" ON public.vala_factory_stage_approvals FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_stage_approvals.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_stage_approvals.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_pipeline_controls_access" ON public.vala_factory_pipeline_controls;
CREATE POLICY "vala_factory_pipeline_controls_access" ON public.vala_factory_pipeline_controls FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_pipeline_controls.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_pipeline_controls.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_runtime_logs_access" ON public.vala_factory_runtime_logs;
CREATE POLICY "vala_factory_runtime_logs_access" ON public.vala_factory_runtime_logs FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_runtime_logs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_runtime_logs.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_reports_access" ON public.vala_factory_reports;
CREATE POLICY "vala_factory_reports_access" ON public.vala_factory_reports FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_reports.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_reports.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_versions_access" ON public.vala_factory_versions;
CREATE POLICY "vala_factory_versions_access" ON public.vala_factory_versions FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_versions.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_versions.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_backups_access" ON public.vala_factory_backups;
CREATE POLICY "vala_factory_backups_access" ON public.vala_factory_backups FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_backups.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_backups.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));
DROP POLICY IF EXISTS "vala_factory_licenses_access" ON public.vala_factory_licenses;
CREATE POLICY "vala_factory_licenses_access" ON public.vala_factory_licenses FOR ALL USING (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_licenses.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo')))) WITH CHECK (EXISTS (SELECT 1 FROM public.vala_factory_projects p WHERE p.id = vala_factory_licenses.project_id AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))));

CREATE TRIGGER update_modules_master_updated_at BEFORE UPDATE ON public.modules_master FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_blueprints_updated_at BEFORE UPDATE ON public.vala_factory_blueprints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_project_modules_updated_at BEFORE UPDATE ON public.vala_factory_project_modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_api_specs_updated_at BEFORE UPDATE ON public.vala_factory_api_specs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_db_specs_updated_at BEFORE UPDATE ON public.vala_factory_db_specs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_flow_specs_updated_at BEFORE UPDATE ON public.vala_factory_flow_specs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_mobile_builds_updated_at BEFORE UPDATE ON public.vala_factory_mobile_builds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_test_runs_updated_at BEFORE UPDATE ON public.vala_factory_test_runs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_stage_approvals_updated_at BEFORE UPDATE ON public.vala_factory_stage_approvals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_pipeline_controls_updated_at BEFORE UPDATE ON public.vala_factory_pipeline_controls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_licenses_updated_at BEFORE UPDATE ON public.vala_factory_licenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.modules_master (module_key, module_name, module_type, description, default_config)
VALUES
  ('auth-core', 'Authentication Core', 'core', 'JWT, session, 2FA, biometric optional, auto logout', '{"jwt":true,"twoFactor":true,"biometric":true}'::jsonb),
  ('admin-core', 'Admin Control Panel', 'core', 'Admin panel, approval, reporting, access control', '{"approvals":true,"reporting":true}'::jsonb),
  ('payment-core', 'Payment Engine', 'core', 'UPI, bank, gateway and subscription billing', '{"upi":true,"bank":true,"gateway":true,"subscription":true}'::jsonb),
  ('mobile-apk', 'Mobile APK Builder', 'optional', 'APK or AAB build orchestration and signing', '{"apk":true,"aab":true,"signing":true}'::jsonb),
  ('qa-suite', 'QA Automation Suite', 'core', 'Login, API, DB, flow and crash tests', '{"login":true,"api":true,"database":true,"flows":true,"crash":true}'::jsonb),
  ('backup-core', 'Backup and Restore', 'optional', 'Backups, snapshots and restore history', '{"database":true,"artifacts":true,"full":true}'::jsonb),
  ('multi-tenant', 'Multi Tenant Scaling', 'role_based', 'Tenant separation and scaling guardrails', '{"tenantAware":true,"autoscaleReady":true}'::jsonb)
ON CONFLICT (module_key) DO UPDATE SET
  module_name = EXCLUDED.module_name,
  module_type = EXCLUDED.module_type,
  description = EXCLUDED.description,
  default_config = EXCLUDED.default_config,
  updated_at = now();
