ALTER TABLE public.vala_factory_projects
DROP CONSTRAINT IF EXISTS vala_factory_projects_input_source_check;

ALTER TABLE public.vala_factory_projects
ADD CONSTRAINT vala_factory_projects_input_source_check
CHECK (input_source IN ('prompt', 'template', 'clone', 'github_import', 'workspace_import', 'zip_import', 'multi_file_import'));

ALTER TABLE public.vala_factory_project_inputs
DROP CONSTRAINT IF EXISTS vala_factory_project_inputs_source_type_check;

ALTER TABLE public.vala_factory_project_inputs
ADD CONSTRAINT vala_factory_project_inputs_source_type_check
CHECK (source_type IN ('prompt', 'template', 'clone', 'github_import', 'workspace_import', 'zip_import', 'multi_file_import'));

CREATE TABLE IF NOT EXISTS public.vala_factory_workspace_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_ext TEXT,
  mime_type TEXT,
  language TEXT NOT NULL DEFAULT 'text',
  size_bytes BIGINT NOT NULL DEFAULT 0,
  content_excerpt TEXT,
  content_text TEXT,
  is_binary BOOLEAN NOT NULL DEFAULT false,
  is_truncated BOOLEAN NOT NULL DEFAULT false,
  checksum TEXT,
  import_source TEXT NOT NULL DEFAULT 'workspace' CHECK (import_source IN ('zip', 'multi_file', 'github', 'workspace')),
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, file_path)
);

CREATE TABLE IF NOT EXISTS public.vala_factory_workspace_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'fixed', 'ignored', 'retrying', 'manual_review')),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  line_hint INTEGER,
  fix_command TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vala_factory_workspace_files_project ON public.vala_factory_workspace_files(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_workspace_files_path ON public.vala_factory_workspace_files(project_id, file_path);
CREATE INDEX IF NOT EXISTS idx_vala_factory_workspace_issues_project ON public.vala_factory_workspace_issues(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_workspace_issues_status ON public.vala_factory_workspace_issues(project_id, status, severity);

ALTER TABLE public.vala_factory_workspace_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_workspace_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vala_factory_workspace_files_project_access" ON public.vala_factory_workspace_files;
CREATE POLICY "vala_factory_workspace_files_project_access"
ON public.vala_factory_workspace_files
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_workspace_files.project_id
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
    WHERE p.id = vala_factory_workspace_files.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "vala_factory_workspace_issues_project_access" ON public.vala_factory_workspace_issues;
CREATE POLICY "vala_factory_workspace_issues_project_access"
ON public.vala_factory_workspace_issues
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.vala_factory_projects p
    WHERE p.id = vala_factory_workspace_issues.project_id
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
    WHERE p.id = vala_factory_workspace_issues.project_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP TRIGGER IF EXISTS update_vala_factory_workspace_files_updated_at ON public.vala_factory_workspace_files;
CREATE TRIGGER update_vala_factory_workspace_files_updated_at
BEFORE UPDATE ON public.vala_factory_workspace_files
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vala_factory_workspace_issues_updated_at ON public.vala_factory_workspace_issues;
CREATE TRIGGER update_vala_factory_workspace_issues_updated_at
BEFORE UPDATE ON public.vala_factory_workspace_issues
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();