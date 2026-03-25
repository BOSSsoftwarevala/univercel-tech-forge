ALTER TABLE public.vala_factory_products
ADD COLUMN IF NOT EXISTS product_status TEXT NOT NULL DEFAULT 'in_development' CHECK (product_status IN ('active', 'in_development', 'deployed', 'locked', 'archived')),
ADD COLUMN IF NOT EXISTS product_config JSONB NOT NULL DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS hero_summary TEXT,
ADD COLUMN IF NOT EXISTS home_category TEXT,
ADD COLUMN IF NOT EXISTS feature_binding JSONB NOT NULL DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS assigned_server_id TEXT,
ADD COLUMN IF NOT EXISTS env_type TEXT NOT NULL DEFAULT 'dev' CHECK (env_type IN ('dev', 'staging', 'production')),
ADD COLUMN IF NOT EXISTS assigned_client_id TEXT,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE public.vala_factory_project_modules
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS hidden_from_ui BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'override'));

ALTER TABLE public.vala_factory_licenses
ADD COLUMN IF NOT EXISTS device_id TEXT,
ADD COLUMN IF NOT EXISTS api_key_binding TEXT;

CREATE TABLE IF NOT EXISTS public.vala_factory_servers (
  id TEXT PRIMARY KEY,
  server_name TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online' CHECK (status IN ('online', 'maintenance', 'offline')),
  server_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.vala_factory_products(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.vala_factory_project_modules(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB NOT NULL DEFAULT '{"view":true,"copy":false,"download":false,"edit":false}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, module_id, role)
);

CREATE TABLE IF NOT EXISTS public.deploy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.vala_factory_products(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.vala_factory_deployments(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  error TEXT,
  message TEXT NOT NULL,
  env_type TEXT NOT NULL DEFAULT 'dev' CHECK (env_type IN ('dev', 'staging', 'production')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pipeline_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  run_id UUID REFERENCES public.vala_factory_runs(id) ON DELETE SET NULL,
  step TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  detail JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vala_factory_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.vala_factory_products(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('deployment', 'version', 'module')),
  target_id UUID,
  stage_name TEXT NOT NULL CHECK (stage_name IN ('developer', 'qa', 'admin', 'deploy')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'override')),
  note TEXT,
  requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, request_type, target_id, stage_name)
);

CREATE INDEX IF NOT EXISTS idx_vala_factory_products_status ON public.vala_factory_products(product_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_access_product ON public.product_access(product_id, role);
CREATE INDEX IF NOT EXISTS idx_deploy_logs_product ON public.deploy_logs(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_logs_project ON public.pipeline_logs(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vala_factory_approval_requests_project ON public.vala_factory_approval_requests(project_id, created_at DESC);

ALTER TABLE public.vala_factory_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deploy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vala_factory_approval_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "vala_factory_servers_admin_access" ON public.vala_factory_servers;
CREATE POLICY "vala_factory_servers_admin_access" ON public.vala_factory_servers FOR ALL
USING (public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
WITH CHECK (public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'));

DROP POLICY IF EXISTS "product_access_project_access" ON public.product_access;
CREATE POLICY "product_access_project_access" ON public.product_access FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.vala_factory_products fp
  JOIN public.vala_factory_projects p ON p.id = fp.project_id
  WHERE fp.id = product_access.product_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.vala_factory_products fp
  JOIN public.vala_factory_projects p ON p.id = fp.project_id
  WHERE fp.id = product_access.product_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
));

DROP POLICY IF EXISTS "deploy_logs_project_access" ON public.deploy_logs;
CREATE POLICY "deploy_logs_project_access" ON public.deploy_logs FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.vala_factory_products fp
  JOIN public.vala_factory_projects p ON p.id = fp.project_id
  WHERE fp.id = deploy_logs.product_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.vala_factory_products fp
  JOIN public.vala_factory_projects p ON p.id = fp.project_id
  WHERE fp.id = deploy_logs.product_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
));

DROP POLICY IF EXISTS "pipeline_logs_project_access" ON public.pipeline_logs;
CREATE POLICY "pipeline_logs_project_access" ON public.pipeline_logs FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.vala_factory_projects p
  WHERE p.id = pipeline_logs.project_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.vala_factory_projects p
  WHERE p.id = pipeline_logs.project_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
));

DROP POLICY IF EXISTS "vala_factory_approval_requests_access" ON public.vala_factory_approval_requests;
CREATE POLICY "vala_factory_approval_requests_access" ON public.vala_factory_approval_requests FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.vala_factory_projects p
  WHERE p.id = vala_factory_approval_requests.project_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.vala_factory_projects p
  WHERE p.id = vala_factory_approval_requests.project_id
    AND (p.owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ai_manager') OR public.has_role(auth.uid(), 'ceo'))
));

CREATE TRIGGER update_vala_factory_servers_updated_at BEFORE UPDATE ON public.vala_factory_servers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_access_updated_at BEFORE UPDATE ON public.product_access FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vala_factory_approval_requests_updated_at BEFORE UPDATE ON public.vala_factory_approval_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.vala_factory_servers (id, server_name, region, status, server_metadata)
VALUES
  ('srv-dev-india', 'DEV India', 'India', 'online', '{"capacity":25,"env":"dev"}'::jsonb),
  ('srv-stage-india', 'STAGING India', 'India', 'online', '{"capacity":40,"env":"staging"}'::jsonb),
  ('srv-prod-india', 'PROD India', 'India', 'online', '{"capacity":100,"env":"production"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  server_name = EXCLUDED.server_name,
  region = EXCLUDED.region,
  status = EXCLUDED.status,
  server_metadata = EXCLUDED.server_metadata,
  updated_at = now();