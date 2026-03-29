
CREATE TABLE public.client_deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  subdomain TEXT NOT NULL UNIQUE,
  deploy_url TEXT,
  github_repo_url TEXT,
  source_code_hash TEXT,
  client_username TEXT NOT NULL,
  client_password_hash TEXT NOT NULL,
  client_password_plain TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  deploy_started_at TIMESTAMPTZ,
  deploy_completed_at TIMESTAMPTZ,
  deploy_error TEXT,
  vps_path TEXT,
  vps_port INTEGER,
  is_active BOOLEAN DEFAULT true,
  deployed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.client_deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Privileged roles manage deployments"
  ON public.client_deployments
  FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'master') OR
    public.has_role(auth.uid(), 'boss_owner') OR
    public.has_role(auth.uid(), 'product_demo_manager')
  );

CREATE INDEX idx_client_deployments_subdomain ON public.client_deployments(subdomain);
CREATE INDEX idx_client_deployments_status ON public.client_deployments(status);
