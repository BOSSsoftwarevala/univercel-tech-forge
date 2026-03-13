-- AI Services Management Schema
-- Centralized AI Orchestration & API Manager

-- Table: api_services
CREATE TABLE IF NOT EXISTS api_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR(255) UNIQUE NOT NULL,
  base_url VARCHAR(512) NOT NULL,
  api_key TEXT NOT NULL, -- encrypted with AES-256
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'maintenance')),
  rate_limit VARCHAR(50),
  usage_cost_tracking BOOLEAN DEFAULT true,
  fallback_service_id UUID REFERENCES api_services(id),
  max_monthly_cost DECIMAL(12, 2),
  created_by UUID,
  updated_by UUID,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: api_service_usage
CREATE TABLE IF NOT EXISTS api_service_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES api_services(id),
  tenant_id UUID,
  user_id UUID,
  endpoint VARCHAR(255),
  request_tokens INT,
  response_tokens INT,
  cost_amount DECIMAL(10, 4),
  status VARCHAR(20) CHECK (status IN ('success', 'failed', 'rate_limited', 'fallback_used')),
  fallback_service_id UUID REFERENCES api_services(id),
  error_message TEXT,
  response_time_ms INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_tenant_date ON api_service_usage(tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_service_date ON api_service_usage(service_id, created_at);

-- Table: api_service_audit_log
CREATE TABLE IF NOT EXISTS api_service_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES api_services(id),
  user_id UUID,
  action VARCHAR(100), -- 'create', 'update', 'rotate_key', 'disable', 'test'
  details JSONB,
  ip_address INET,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_service ON api_service_audit_log(service_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON api_service_audit_log(user_id, timestamp);

-- Enable Row Level Security
ALTER TABLE api_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_service_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_service_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies: service_role (backend) can fully manage api_services
-- Authenticated super_admin users can also manage services via the admin UI
CREATE POLICY "Service role manages api_services"
  ON api_services FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Super admin manages api_services"
  ON api_services FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE raw_user_meta_data->>'role' = 'super_admin'
    )
  );

CREATE POLICY "Authenticated users read api_service_usage"
  ON api_service_usage FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role manages api_service_usage"
  ON api_service_usage FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role manages audit_log"
  ON api_service_audit_log FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated users read audit_log"
  ON api_service_audit_log FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Auto-update updated_at trigger for api_services
CREATE OR REPLACE FUNCTION update_api_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_api_services_updated_at
  BEFORE UPDATE ON api_services
  FOR EACH ROW EXECUTE FUNCTION update_api_services_updated_at();
