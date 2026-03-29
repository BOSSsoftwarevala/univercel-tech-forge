CREATE TABLE IF NOT EXISTS public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  project_id UUID REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  source_language TEXT NOT NULL DEFAULT 'auto',
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  provider TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  version_name TEXT NOT NULL,
  changes JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('web', 'apk')),
  status TEXT NOT NULL DEFAULT 'queued',
  download_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_translations_user_created_at ON public.translations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_translations_project_created_at ON public.translations(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_translations_target_language ON public.translations(target_language, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_versions_project_created_at ON public.ai_versions(project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_builds_project_created_at ON public.builds(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_builds_type_status ON public.builds(type, status, created_at DESC);

ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vala_translations_select" ON public.translations;
CREATE POLICY "vala_translations_select" ON public.translations FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'ai_manager') OR has_role(auth.uid(), 'ceo')
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_projects project
    WHERE project.id = translations.project_id AND project.owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "vala_translations_manage" ON public.translations;
CREATE POLICY "vala_translations_manage" ON public.translations FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'ai_manager') OR has_role(auth.uid(), 'ceo')
  OR user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_projects project
    WHERE project.id = translations.project_id AND project.owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "vala_ai_versions_select" ON public.ai_versions;
CREATE POLICY "vala_ai_versions_select" ON public.ai_versions FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'ai_manager') OR has_role(auth.uid(), 'ceo')
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_projects project
    WHERE project.id = ai_versions.project_id AND project.owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "vala_ai_versions_manage" ON public.ai_versions;
CREATE POLICY "vala_ai_versions_manage" ON public.ai_versions FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'ai_manager') OR has_role(auth.uid(), 'ceo')
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_projects project
    WHERE project.id = ai_versions.project_id AND project.owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "vala_builds_select" ON public.builds;
CREATE POLICY "vala_builds_select" ON public.builds FOR SELECT USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'ai_manager') OR has_role(auth.uid(), 'ceo')
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_projects project
    WHERE project.id = builds.project_id AND project.owner_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "vala_builds_manage" ON public.builds;
CREATE POLICY "vala_builds_manage" ON public.builds FOR ALL USING (
  has_role(auth.uid(), 'boss_owner') OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'ai_manager') OR has_role(auth.uid(), 'ceo')
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_projects project
    WHERE project.id = builds.project_id AND project.owner_user_id = auth.uid()
  )
);

DROP TRIGGER IF EXISTS update_builds_updated_at ON public.builds;
CREATE TRIGGER update_builds_updated_at BEFORE UPDATE ON public.builds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();