-- AI API Manager Schema
-- Comprehensive schema for multi-tenant AI API management platform

-- ============================================================
-- IDENTITY & TENANT TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS tenants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  plan        text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email       text NOT NULL,
  role        text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'developer', 'member', 'viewer')),
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        text NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS permissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text
);

-- ============================================================
-- API MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS api_services (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name            text NOT NULL,
  provider        text NOT NULL,
  encrypted_key   text NOT NULL DEFAULT '',
  is_active       boolean NOT NULL DEFAULT true,
  is_paused       boolean NOT NULL DEFAULT false,
  daily_limit     numeric NOT NULL DEFAULT 0,
  monthly_limit   numeric NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_service_health (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'unknown',
  latency_ms  int,
  error_count int NOT NULL DEFAULT 0,
  checked_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS provider_integrations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider    text NOT NULL,
  config      jsonb NOT NULL DEFAULT '{}',
  is_active   boolean NOT NULL DEFAULT true
);

-- ============================================================
-- ACCESS CONTROL
-- ============================================================

CREATE TABLE IF NOT EXISTS product_api_mapping (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL,
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS role_api_permissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role_name   text NOT NULL,
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  can_use     boolean NOT NULL DEFAULT false,
  daily_limit numeric NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ip_whitelist (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  ip_address  text NOT NULL,
  description text,
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS region_rules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  region      text NOT NULL,
  is_allowed  boolean NOT NULL DEFAULT true
);

-- ============================================================
-- FINANCIAL
-- ============================================================

CREATE TABLE IF NOT EXISTS wallets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  balance     numeric NOT NULL DEFAULT 0,
  hold_amount numeric NOT NULL DEFAULT 0,
  currency    text NOT NULL DEFAULT 'USD',
  is_locked   boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  wallet_id   uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('credit','debit','hold','release')),
  amount      numeric NOT NULL,
  description text,
  api_call_id uuid,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallet_ledger (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  wallet_id       uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  entry_type      text NOT NULL CHECK (entry_type IN ('debit','credit')),
  amount          numeric NOT NULL,
  running_balance numeric NOT NULL,
  reference_id    uuid,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS billing_records (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end   date NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  status       text NOT NULL DEFAULT 'pending',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  billing_record_id uuid NOT NULL REFERENCES billing_records(id) ON DELETE CASCADE,
  invoice_number    text NOT NULL,
  total_amount      numeric NOT NULL DEFAULT 0,
  status            text NOT NULL DEFAULT 'draft',
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- USAGE & TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS api_service_usage (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  tokens_used int NOT NULL DEFAULT 0,
  cost        numeric NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_api_usage (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL,
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  tokens_used int NOT NULL DEFAULT 0,
  cost        numeric NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_usage_tracking (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role_name   text NOT NULL,
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  usage_count int NOT NULL DEFAULT 0,
  total_cost  numeric NOT NULL DEFAULT 0,
  period      date NOT NULL
);

CREATE TABLE IF NOT EXISTS cost_tracking (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id     uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  estimated_cost numeric NOT NULL DEFAULT 0,
  actual_cost    numeric NOT NULL DEFAULT 0,
  model          text NOT NULL DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SAFETY & MONITORING
-- ============================================================

CREATE TABLE IF NOT EXISTS alert_rules (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        text NOT NULL,
  metric      text NOT NULL,
  threshold   numeric NOT NULL,
  action      text NOT NULL,
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  rule_id     uuid NOT NULL REFERENCES alert_rules(id) ON DELETE CASCADE,
  severity    text NOT NULL DEFAULT 'info',
  message     text NOT NULL DEFAULT '',
  status      text NOT NULL DEFAULT 'open',
  resolved_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS anomaly_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id   uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  anomaly_type text NOT NULL,
  risk_score   numeric NOT NULL DEFAULT 0,
  details      jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS api_failure_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id    uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  error_code    text,
  error_message text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS latency_metrics (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  latency_ms  int NOT NULL,
  measured_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rate_limit_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id   uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  limit_type   text NOT NULL,
  triggered_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SECURITY & AUDIT
-- ============================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key_hash        text NOT NULL,
  description     text,
  last_rotated_at timestamptz,
  expires_at      timestamptz,
  is_active       boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS api_access_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id  uuid NOT NULL REFERENCES api_services(id) ON DELETE CASCADE,
  user_id     uuid,
  endpoint    text,
  status_code int,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS abuse_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     uuid,
  event_type  text NOT NULL,
  details     jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     uuid,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   uuid,
  ip_address  text,
  details     jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_action_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  admin_id    uuid NOT NULL,
  action      text NOT NULL,
  target      text NOT NULL,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- EMERGENCY & CONFIG
-- ============================================================

CREATE TABLE IF NOT EXISTS system_state (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key        text NOT NULL,
  value      text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

CREATE TABLE IF NOT EXISTS incident_reports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type        text NOT NULL,
  severity    text NOT NULL,
  description text NOT NULL DEFAULT '',
  status      text NOT NULL DEFAULT 'open',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS default_limits (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  service_id    uuid,
  daily_limit   numeric NOT NULL DEFAULT 0,
  monthly_limit numeric NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS alert_thresholds (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id          uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric             text NOT NULL,
  warning_threshold  numeric NOT NULL DEFAULT 0,
  critical_threshold numeric NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notification_preferences (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  email       boolean NOT NULL DEFAULT true,
  sms         boolean NOT NULL DEFAULT false,
  webhook_url text
);

CREATE TABLE IF NOT EXISTS config_change_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  changed_by  uuid NOT NULL,
  key         text NOT NULL,
  old_value   text,
  new_value   text,
  changed_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_tenant_id              ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_roles_tenant_id              ON roles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_services_tenant_id       ON api_services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_services_provider        ON api_services(provider);
CREATE INDEX IF NOT EXISTS idx_api_service_health_service   ON api_service_health(service_id);
CREATE INDEX IF NOT EXISTS idx_api_service_health_checked   ON api_service_health(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_provider_integrations_tenant ON provider_integrations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_api_mapping_tenant   ON product_api_mapping(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_api_mapping_service  ON product_api_mapping(service_id);
CREATE INDEX IF NOT EXISTS idx_role_api_permissions_tenant  ON role_api_permissions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ip_whitelist_tenant          ON ip_whitelist(tenant_id);
CREATE INDEX IF NOT EXISTS idx_region_rules_tenant          ON region_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wallets_tenant_id            ON wallets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_tenant   ON wallet_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet   ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created  ON wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_tenant         ON wallet_ledger(tenant_id);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_wallet         ON wallet_ledger(wallet_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_tenant       ON billing_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant              ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_service_usage_tenant     ON api_service_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_service_usage_service    ON api_service_usage(service_id);
CREATE INDEX IF NOT EXISTS idx_api_service_usage_created    ON api_service_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_api_usage_tenant     ON product_api_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_role_usage_tracking_tenant   ON role_usage_tracking(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_tenant         ON cost_tracking(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_service        ON cost_tracking(service_id);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_created        ON cost_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_rules_tenant           ON alert_rules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_tenant                ON alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status                ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_anomaly_logs_tenant          ON anomaly_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_anomaly_logs_service         ON anomaly_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_anomaly_logs_created         ON anomaly_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_failure_logs_tenant      ON api_failure_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_failure_logs_service     ON api_failure_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_latency_metrics_tenant       ON latency_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_latency_metrics_service      ON latency_metrics(service_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_events_tenant     ON rate_limit_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant              ON api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_access_logs_tenant       ON api_access_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_access_logs_service      ON api_access_logs(service_id);
CREATE INDEX IF NOT EXISTS idx_api_access_logs_created      ON api_access_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_abuse_events_tenant          ON abuse_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant            ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user              ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity            ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created           ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_tenant     ON admin_action_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_system_state_tenant          ON system_state(tenant_id);
CREATE INDEX IF NOT EXISTS idx_system_state_key             ON system_state(tenant_id, key);
CREATE INDEX IF NOT EXISTS idx_incident_reports_tenant      ON incident_reports(tenant_id);
CREATE INDEX IF NOT EXISTS idx_default_limits_tenant        ON default_limits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alert_thresholds_tenant      ON alert_thresholds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notification_prefs_tenant    ON notification_preferences(tenant_id);
CREATE INDEX IF NOT EXISTS idx_config_change_logs_tenant    ON config_change_logs(tenant_id);

-- ============================================================
-- IMMUTABLE AUDIT LOGS TRIGGER
-- Prevents UPDATE and DELETE on audit_logs to ensure immutability
-- ============================================================

CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs records are immutable and cannot be modified or deleted';
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_immutable_update ON audit_logs;
CREATE TRIGGER audit_logs_immutable_update
  BEFORE UPDATE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();

DROP TRIGGER IF EXISTS audit_logs_immutable_delete ON audit_logs;
CREATE TRIGGER audit_logs_immutable_delete
  BEFORE DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();
