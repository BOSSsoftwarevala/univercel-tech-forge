-- SOFTWARE VALA SCHEMA - Core Tables Only
-- Simplified migration

-- UNIFIED WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.unified_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_role app_role NOT NULL,
  available_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  pending_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_earned NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_withdrawn NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  is_frozen BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, user_role)
);

ALTER TABLE public.unified_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wallet" ON public.unified_wallets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Finance manages wallets" ON public.unified_wallets FOR ALL USING (can_access_finance(auth.uid()));

-- UNIFIED WALLET TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.unified_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.unified_wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  balance_after NUMERIC(15,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.unified_wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own txn" ON public.unified_wallet_transactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Finance manages txn" ON public.unified_wallet_transactions FOR ALL USING (can_access_finance(auth.uid()));

-- SEO MANAGER
CREATE TABLE IF NOT EXISTS public.seo_manager (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_target TEXT NOT NULL,
  keyword TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  region TEXT,
  rank_position INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_manager ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SEO view" ON public.seo_manager FOR SELECT USING (true);
CREATE POLICY "SEO manage" ON public.seo_manager FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- R&D SUGGESTIONS
CREATE TABLE IF NOT EXISTS public.rnd_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggested_by UUID REFERENCES auth.users(id) NOT NULL,
  feature_title TEXT NOT NULL,
  feature_description TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'submitted',
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rnd_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RND submit" ON public.rnd_suggestions FOR INSERT WITH CHECK (suggested_by = auth.uid());
CREATE POLICY "RND view" ON public.rnd_suggestions FOR SELECT USING (true);
CREATE POLICY "RND manage" ON public.rnd_suggestions FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- CLIENT SUCCESS CASES
CREATE TABLE IF NOT EXISTS public.client_success_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID REFERENCES auth.users(id) NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  description TEXT,
  resolution_notes TEXT,
  status TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id),
  satisfaction_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_success_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "CS manage" ON public.client_success_cases FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "CS own" ON public.client_success_cases FOR SELECT USING (client_user_id = auth.uid());

-- LEGAL LOGS
CREATE TABLE IF NOT EXISTS public.legal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  contract_url TEXT,
  suspension_flag BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.legal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Legal manage" ON public.legal_logs FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Legal own" ON public.legal_logs FOR SELECT USING (user_id = auth.uid());

-- API KEYS
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_key_hash TEXT NOT NULL,
  api_key_prefix TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "API own" ON public.api_keys FOR ALL USING (user_id = auth.uid());
CREATE POLICY "API admin" ON public.api_keys FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- BRANCH MAP
CREATE TABLE IF NOT EXISTS public.branch_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_code TEXT NOT NULL UNIQUE,
  branch_name TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  city TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  franchise_user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.branch_map ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Branch view" ON public.branch_map FOR SELECT USING (true);
CREATE POLICY "Branch manage" ON public.branch_map FOR ALL USING (has_role(auth.uid(), 'super_admin'));

-- SECURITY LOGS
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  ip_address TEXT,
  threat_level TEXT DEFAULT 'none',
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Security admin" ON public.security_logs FOR ALL USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Security own" ON public.security_logs FOR SELECT USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_unified_wallets_user ON public.unified_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_user ON public.security_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_branch_map_geo ON public.branch_map(latitude, longitude);