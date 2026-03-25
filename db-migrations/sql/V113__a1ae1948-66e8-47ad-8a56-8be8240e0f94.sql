-- =====================================================
-- NEXT-GENERATION SECURITY ARCHITECTURE
-- Blockchain-style Immutable Audit Chain with Merkle Trees
-- =====================================================

-- 1. Cryptographic Audit Chain (Blockchain-style)
CREATE TABLE IF NOT EXISTS public.crypto_audit_chain (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_number BIGINT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID,
  action_type TEXT NOT NULL,
  module TEXT NOT NULL,
  data_hash TEXT NOT NULL,
  previous_hash TEXT NOT NULL,
  block_hash TEXT NOT NULL,
  merkle_root TEXT,
  signature TEXT,
  nonce TEXT NOT NULL,
  is_genesis BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT unique_block_number UNIQUE (block_number)
);

CREATE INDEX IF NOT EXISTS idx_crypto_audit_chain_block ON public.crypto_audit_chain(block_number DESC);
CREATE INDEX IF NOT EXISTS idx_crypto_audit_chain_hash ON public.crypto_audit_chain(block_hash);
CREATE INDEX IF NOT EXISTS idx_crypto_audit_chain_user ON public.crypto_audit_chain(user_id);

-- 2. Security Tokens (for session binding)
CREATE TABLE IF NOT EXISTS public.security_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  token_type TEXT NOT NULL CHECK (token_type IN ('session', 'action', 'refresh', 'mfa')),
  device_fingerprint TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  usage_count INT DEFAULT 0,
  max_usage INT DEFAULT 1,
  parent_token_id UUID REFERENCES public.security_tokens(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_security_tokens_user ON public.security_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_security_tokens_not_revoked ON public.security_tokens(user_id) WHERE revoked_at IS NULL;

-- 3. Threat Intelligence Store
CREATE TABLE IF NOT EXISTS public.threat_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_type TEXT NOT NULL,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('critical', 'high', 'medium', 'low', 'info')),
  indicator_type TEXT NOT NULL,
  indicator_value TEXT NOT NULL,
  confidence_score DECIMAL(5,4) NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  occurrence_count INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  source TEXT NOT NULL,
  ai_analysis JSONB,
  mitigation_applied BOOLEAN DEFAULT false,
  mitigation_details TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_threat_intel_active ON public.threat_intelligence(indicator_type, indicator_value) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_threat_intel_level ON public.threat_intelligence(threat_level) WHERE is_active = true;

-- 4. Zero-Trust Verification Log
CREATE TABLE IF NOT EXISTS public.zero_trust_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  verification_type TEXT NOT NULL,
  verification_result BOOLEAN NOT NULL,
  risk_score DECIMAL(5,4) DEFAULT 0,
  device_fingerprint TEXT NOT NULL,
  ip_address INET,
  geolocation JSONB,
  session_token_hash TEXT,
  factors_verified JSONB DEFAULT '[]'::jsonb,
  anomalies_detected JSONB DEFAULT '[]'::jsonb,
  action_allowed BOOLEAN NOT NULL,
  denial_reason TEXT,
  verification_duration_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ztv_user ON public.zero_trust_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ztv_failed ON public.zero_trust_verifications(user_id) WHERE verification_result = false;

-- 5. Encrypted Data Vault
CREATE TABLE IF NOT EXISTS public.encrypted_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  data_type TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  encryption_key_hash TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT,
  access_level TEXT NOT NULL CHECK (access_level IN ('owner_only', 'role_based', 'shared')),
  allowed_roles TEXT[] DEFAULT ARRAY[]::TEXT[],
  access_count INT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  last_accessed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_vault_owner ON public.encrypted_vault(owner_id);

-- 6. Real-time Threat Alerts
CREATE TABLE IF NOT EXISTS public.realtime_threat_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id TEXT NOT NULL UNIQUE,
  threat_level TEXT NOT NULL CHECK (threat_level IN ('critical', 'high', 'medium', 'low')),
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_user_id UUID,
  affected_module TEXT,
  source_ip INET,
  device_fingerprint TEXT,
  ai_confidence DECIMAL(5,4),
  recommended_action TEXT,
  auto_mitigated BOOLEAN DEFAULT false,
  mitigation_action TEXT,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_active ON public.realtime_threat_alerts(threat_level) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alerts_user ON public.realtime_threat_alerts(affected_user_id);

-- Enable RLS on all new tables
ALTER TABLE public.crypto_audit_chain ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zero_trust_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encrypted_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_threat_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "crypto_audit_read_admin" ON public.crypto_audit_chain
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin'))
  );

CREATE POLICY "security_tokens_own" ON public.security_tokens
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "security_tokens_admin" ON public.security_tokens
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin'))
  );

CREATE POLICY "threat_intel_admin" ON public.threat_intelligence
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'admin'))
  );

CREATE POLICY "ztv_own" ON public.zero_trust_verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ztv_admin" ON public.zero_trust_verifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin'))
  );

CREATE POLICY "vault_owner" ON public.encrypted_vault
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "alerts_admin" ON public.realtime_threat_alerts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'admin'))
  );

-- Enable realtime for threat alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.realtime_threat_alerts;