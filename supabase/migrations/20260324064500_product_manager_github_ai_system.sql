CREATE TABLE IF NOT EXISTS public.github_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'personal' CHECK (account_type IN ('personal', 'organization')),
  token_encrypted TEXT NOT NULL,
  token_hint TEXT,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'invalid', 'revoked')),
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_user_id, username)
);

CREATE TABLE IF NOT EXISTS public.github_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.github_accounts(id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.vala_factory_products(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.vala_factory_projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  tech_stack TEXT NOT NULL DEFAULT 'Unknown',
  branch TEXT NOT NULL DEFAULT 'main',
  last_commit TEXT,
  size INTEGER NOT NULL DEFAULT 0,
  import_status TEXT NOT NULL DEFAULT 'imported' CHECK (import_status IN ('imported', 'synced', 'failed', 'archived')),
  repo_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(repo_url)
);

CREATE TABLE IF NOT EXISTS public.ai_apis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'claude', 'gemini', 'custom')),
  api_key_encrypted TEXT NOT NULL,
  balance NUMERIC(14,4) NOT NULL DEFAULT 0,
  cost_per_token NUMERIC(14,8) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'low_balance', 'disabled')),
  priority INTEGER NOT NULL DEFAULT 1,
  model TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.vala_factory_products(id) ON DELETE CASCADE,
  ai_api_id UUID REFERENCES public.ai_apis(id) ON DELETE SET NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost NUMERIC(14,6) NOT NULL DEFAULT 0,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.vala_factory_products(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'fixed', 'retrying', 'manual_review')),
  title TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_attempted_provider UUID REFERENCES public.ai_apis(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.vala_factory_products(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  ai_api_id UUID REFERENCES public.ai_apis(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  file_changed TEXT,
  status TEXT NOT NULL CHECK (status IN ('queued', 'completed', 'failed', 'skipped')),
  error TEXT,
  log_json JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.code_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  tech_stack TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::JSONB,
  repo_url TEXT,
  file_path TEXT,
  usage_count INTEGER NOT NULL DEFAULT 0,
  success_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_template BOOLEAN NOT NULL DEFAULT false,
  read_only BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.code_library_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.vala_factory_products(id) ON DELETE CASCADE,
  code_library_id UUID NOT NULL REFERENCES public.code_library(id) ON DELETE CASCADE,
  similarity_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  recommendation_rank INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, code_library_id)
);

CREATE TABLE IF NOT EXISTS public.product_manager_sync_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.github_accounts(id) ON DELETE SET NULL,
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('manual', 'cron', 'import_all')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  summary JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_github_accounts_owner ON public.github_accounts(owner_user_id, connected_at DESC);
CREATE INDEX IF NOT EXISTS idx_github_repos_owner ON public.github_repos(owner_user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_github_repos_product ON public.github_repos(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_apis_owner ON public.ai_apis(owner_user_id, priority ASC, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_product ON public.ai_usage(product_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_product_issues_product ON public.product_issues(product_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_product ON public.ai_logs(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_code_library_lookup ON public.code_library(category, tech_stack, success_rate DESC);
CREATE INDEX IF NOT EXISTS idx_sync_runs_owner ON public.product_manager_sync_runs(owner_user_id, created_at DESC);

ALTER TABLE public.github_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_library_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_manager_sync_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "github_accounts_owner_access" ON public.github_accounts;
CREATE POLICY "github_accounts_owner_access" ON public.github_accounts FOR ALL
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

DROP POLICY IF EXISTS "github_repos_owner_access" ON public.github_repos;
CREATE POLICY "github_repos_owner_access" ON public.github_repos FOR ALL
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

DROP POLICY IF EXISTS "ai_apis_owner_access" ON public.ai_apis;
CREATE POLICY "ai_apis_owner_access" ON public.ai_apis FOR ALL
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

DROP POLICY IF EXISTS "ai_usage_product_access" ON public.ai_usage;
CREATE POLICY "ai_usage_product_access" ON public.ai_usage FOR ALL
USING (
  product_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = ai_usage.product_id
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
  product_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = ai_usage.product_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "product_issues_product_access" ON public.product_issues;
CREATE POLICY "product_issues_product_access" ON public.product_issues FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = product_issues.product_id
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
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = product_issues.product_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "ai_logs_product_access" ON public.ai_logs;
CREATE POLICY "ai_logs_product_access" ON public.ai_logs FOR ALL
USING (
  product_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = ai_logs.product_id
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
  product_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = ai_logs.product_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "code_library_owner_access" ON public.code_library;
CREATE POLICY "code_library_owner_access" ON public.code_library FOR ALL
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

DROP POLICY IF EXISTS "code_library_matches_product_access" ON public.code_library_matches;
CREATE POLICY "code_library_matches_product_access" ON public.code_library_matches FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = code_library_matches.product_id
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
    SELECT 1 FROM public.vala_factory_products p
    WHERE p.id = code_library_matches.product_id
      AND (
        p.owner_user_id = auth.uid()
        OR public.has_role(auth.uid(), 'boss_owner')
        OR public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'ai_manager')
        OR public.has_role(auth.uid(), 'ceo')
      )
  )
);

DROP POLICY IF EXISTS "product_manager_sync_runs_owner_access" ON public.product_manager_sync_runs;
CREATE POLICY "product_manager_sync_runs_owner_access" ON public.product_manager_sync_runs FOR ALL
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

DROP TRIGGER IF EXISTS update_github_accounts_updated_at ON public.github_accounts;
CREATE TRIGGER update_github_accounts_updated_at BEFORE UPDATE ON public.github_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_github_repos_updated_at ON public.github_repos;
CREATE TRIGGER update_github_repos_updated_at BEFORE UPDATE ON public.github_repos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_apis_updated_at ON public.ai_apis;
CREATE TRIGGER update_ai_apis_updated_at BEFORE UPDATE ON public.ai_apis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_issues_updated_at ON public.product_issues;
CREATE TRIGGER update_product_issues_updated_at BEFORE UPDATE ON public.product_issues FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_code_library_updated_at ON public.code_library;
CREATE TRIGGER update_code_library_updated_at BEFORE UPDATE ON public.code_library FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_manager_sync_runs_updated_at ON public.product_manager_sync_runs;
CREATE TRIGGER update_product_manager_sync_runs_updated_at BEFORE UPDATE ON public.product_manager_sync_runs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();