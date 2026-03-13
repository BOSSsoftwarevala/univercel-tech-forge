```sql name=db-migrations/sql/V110__create_missing_app_tables.sql
-- V110: Create missing application tables referenced by code
-- This file creates:
-- transaction_security_locks,
-- finance_security_alerts,
-- audit_logs,
-- master_roles, master_permissions, master_role_permissions,
-- master_users, user_roles,
-- user_licenses, device_bindings,
-- blackbox_events, super_admin_sessions, super_admin_scope_assignments,
-- password_verifications

-- Ensure UUID extension present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Transaction security locks
CREATE TABLE IF NOT EXISTS public.transaction_security_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  lock_type VARCHAR(100),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(12,2),
  lock_status VARCHAR(50) DEFAULT 'locked',
  otp_verified BOOLEAN DEFAULT FALSE,
  gateway_verified BOOLEAN DEFAULT FALSE,
  boss_approved BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transaction_security_locks_txn ON public.transaction_security_locks (transaction_id);

-- Finance security alerts
CREATE TABLE IF NOT EXISTS public.finance_security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(200),
  severity VARCHAR(50),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_finance_security_alerts_user ON public.finance_security_alerts (user_id);

-- Audit logs (immutable finance/audit events)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(200),
  module VARCHAR(100),
  meta_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs (user_id);

-- Master admin RBAC tables
CREATE TABLE IF NOT EXISTS public.master_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_code VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.master_roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.master_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.master_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE, -- reference to auth.users.id
  email VARCHAR(200),
  full_name VARCHAR(255),
  last_login_at TIMESTAMPTZ,
  login_count INT DEFAULT 0,
  failed_login_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles (user_id);

-- Licensing tables
CREATE TABLE IF NOT EXISTS public.user_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID, -- application/user id
  license_key VARCHAR(255) UNIQUE NOT NULL,
  license_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'inactive',
  max_installations INT DEFAULT 1,
  current_installations INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  product_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.device_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id UUID REFERENCES public.user_licenses(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(255) NOT NULL,
  device_name VARCHAR(255),
  device_type VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  bound_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_bindings_license ON public.device_bindings (license_id);

-- Blackbox / security events
CREATE TABLE IF NOT EXISTS public.blackbox_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(200),
  module_name VARCHAR(200),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address VARCHAR(100),
  device_fingerprint VARCHAR(255),
  geo_location VARCHAR(255),
  user_agent TEXT,
  is_sealed BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blackbox_user ON public.blackbox_events (user_id);

-- Super-admin sessions and scope assignments
CREATE TABLE IF NOT EXISTS public.super_admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_token UUID,
  device_fingerprint VARCHAR(255),
  ip_address VARCHAR(100),
  geo_location VARCHAR(255),
  user_agent TEXT,
  assigned_scope JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  login_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.super_admin_scope_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  scope JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Password verification log
CREATE TABLE IF NOT EXISTS public.password_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_verifications_user ON public.password_verifications (user_id);

-- Optional: ensure search indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_master_users_auth_user ON public.master_users (auth_user_id);
```
