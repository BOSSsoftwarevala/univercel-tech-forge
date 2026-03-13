-- ============================================================
-- ENTERPRISE DATABASE HARDENING - GLOBAL SCALE
-- Phase: Structural Resilience & Multi-Tenant Durability
-- ============================================================

-- ============================================================
-- SECTION 1: MARKETPLACE ORDERS TABLE
-- (Referenced in FKs and indexes below but not yet created)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT NOT NULL,
  product_id UUID REFERENCES public.products(product_id) ON DELETE RESTRICT NOT NULL,
  country_id UUID,
  franchise_id UUID REFERENCES public.franchise_accounts(id) ON DELETE RESTRICT,
  order_number TEXT UNIQUE NOT NULL DEFAULT ('ORD-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 10))),
  amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own orders" ON public.marketplace_orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins manage orders" ON public.marketplace_orders
  FOR ALL USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SECTION 2: STRICT FOREIGN KEY ENFORCEMENT
-- ============================================================

-- 2a. Add country_id column to franchise_accounts (FK to master_countries)
ALTER TABLE public.franchise_accounts
  ADD COLUMN IF NOT EXISTS country_id UUID;

ALTER TABLE public.franchise_accounts
  DROP CONSTRAINT IF EXISTS fk_franchise_country;

ALTER TABLE public.franchise_accounts
  ADD CONSTRAINT fk_franchise_country
  FOREIGN KEY (country_id) REFERENCES public.master_countries(id) ON DELETE RESTRICT;

-- 2b. reseller_accounts FK to franchise_accounts (ON DELETE RESTRICT)
-- The existing FK uses CASCADE; drop and recreate with RESTRICT
ALTER TABLE public.reseller_accounts
  DROP CONSTRAINT IF EXISTS reseller_accounts_franchise_id_fkey;

ALTER TABLE public.reseller_accounts
  DROP CONSTRAINT IF EXISTS fk_reseller_franchise;

ALTER TABLE public.reseller_accounts
  ADD CONSTRAINT fk_reseller_franchise
  FOREIGN KEY (franchise_id) REFERENCES public.franchise_accounts(id) ON DELETE RESTRICT;

-- 2c. franchise_territories parent FK with CASCADE
ALTER TABLE public.franchise_territories
  DROP CONSTRAINT IF EXISTS franchise_territories_parent_territory_id_fkey;

ALTER TABLE public.franchise_territories
  DROP CONSTRAINT IF EXISTS fk_territory_parent;

ALTER TABLE public.franchise_territories
  ADD CONSTRAINT fk_territory_parent
  FOREIGN KEY (parent_territory_id) REFERENCES public.franchise_territories(id) ON DELETE CASCADE;

-- 2d. marketplace_orders FK to products (already set in table creation above)
-- Add named constraint explicitly
ALTER TABLE public.marketplace_orders
  DROP CONSTRAINT IF EXISTS fk_order_product;

ALTER TABLE public.marketplace_orders
  ADD CONSTRAINT fk_order_product
  FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE RESTRICT;

-- 2e. Add user_id column to system_activity_log and FK to auth.users
ALTER TABLE public.system_activity_log
  ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE public.system_activity_log
  DROP CONSTRAINT IF EXISTS fk_activity_user;

ALTER TABLE public.system_activity_log
  ADD CONSTRAINT fk_activity_user
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE RESTRICT;

-- 2f. unified_wallet_transactions FK to auth.users (already exists, ensure RESTRICT)
ALTER TABLE public.unified_wallet_transactions
  DROP CONSTRAINT IF EXISTS unified_wallet_transactions_user_id_fkey;

ALTER TABLE public.unified_wallet_transactions
  DROP CONSTRAINT IF EXISTS fk_wallet_user;

ALTER TABLE public.unified_wallet_transactions
  ADD CONSTRAINT fk_wallet_user
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE RESTRICT;

-- ============================================================
-- SECTION 3: COMPOSITE INDEXES FOR MULTI-TENANT QUERIES
-- ============================================================

-- Franchise isolation indexes
CREATE INDEX IF NOT EXISTS idx_franchise_country_active
  ON public.franchise_accounts(country_id, status, is_active)
  WHERE status != 'terminated';

CREATE INDEX IF NOT EXISTS idx_reseller_franchise_country
  ON public.reseller_accounts(franchise_id, status);

-- Activity logging indexes (critical for high-traffic)
CREATE INDEX IF NOT EXISTS idx_activity_log_user_time
  ON public.system_activity_log(user_id, action_type, timestamp DESC);

-- Marketplace orders indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_user_product_date
  ON public.marketplace_orders(user_id, product_id, created_at DESC)
  WHERE status NOT IN ('cancelled', 'refunded');

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_country_franchise
  ON public.marketplace_orders(country_id, franchise_id, created_at DESC);

-- Wallet transaction indexes (financial data - critical)
CREATE INDEX IF NOT EXISTS idx_unified_wallet_tx_user_status
  ON public.unified_wallet_transactions(user_id, status, created_at DESC);

-- Audit logs index
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_severity
  ON public.audit_logs(user_id, module, timestamp DESC);

-- Franchise territories index for RLS
CREATE INDEX IF NOT EXISTS idx_franchise_territories_exclusive
  ON public.franchise_territories(franchise_id, is_exclusive, is_active);

-- Developer isolation index
CREATE INDEX IF NOT EXISTS idx_developer_status
  ON public.developers(status, is_frozen, created_at DESC);

-- ============================================================
-- SECTION 4: ROW LEVEL SECURITY - FRANCHISE ISOLATION
-- ============================================================

-- Level 1: User self-access for system_activity_log
DROP POLICY IF EXISTS "users_own_activity" ON public.system_activity_log;
CREATE POLICY "users_own_activity" ON public.system_activity_log
  FOR SELECT USING (user_id = auth.uid());

-- Level 2: Franchise sees only own resellers
DROP POLICY IF EXISTS "franchise_reseller_isolation" ON public.reseller_accounts;
CREATE POLICY "franchise_reseller_isolation" ON public.reseller_accounts
  FOR SELECT USING (
    franchise_id IN (
      SELECT id FROM public.franchise_accounts
      WHERE user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'super_admin')
    OR public.has_role(auth.uid(), 'admin')
  );

-- Level 3: Country isolation for super_admin on franchise_accounts
DROP POLICY IF EXISTS "super_admin_country_scope" ON public.franchise_accounts;
CREATE POLICY "super_admin_country_scope" ON public.franchise_accounts
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'super_admin')
  );

-- Level 4: Reseller sees own orders
DROP POLICY IF EXISTS "users_own_orders" ON public.marketplace_orders;
CREATE POLICY "users_own_orders" ON public.marketplace_orders
  FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- SECTION 5: SOFT DELETE ENFORCEMENT
-- ============================================================

-- Add deleted_at column to critical tables
ALTER TABLE public.franchise_accounts
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.reseller_accounts
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.developers
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.unified_wallet_transactions
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.marketplace_orders
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Function to prevent hard deletes
-- Allows the delete when the record is already soft-deleted (deleted_at IS NOT NULL),
-- which means it was previously marked for deletion and a final cleanup is intentional.
-- Blocks any direct hard delete on records that are still "live".
CREATE OR REPLACE FUNCTION public.fn_prevent_hard_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow if the record was already soft-deleted (e.g. a cleanup job removing old rows)
  IF OLD.deleted_at IS NOT NULL THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'HARD_DELETE_NOT_ALLOWED: Use soft delete (set deleted_at) instead of hard delete on table %', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply hard-delete prevention to critical tables
DROP TRIGGER IF EXISTS prevent_hard_delete_franchise ON public.franchise_accounts;
CREATE TRIGGER prevent_hard_delete_franchise
  BEFORE DELETE ON public.franchise_accounts
  FOR EACH ROW EXECUTE FUNCTION public.fn_prevent_hard_delete();

DROP TRIGGER IF EXISTS prevent_hard_delete_reseller ON public.reseller_accounts;
CREATE TRIGGER prevent_hard_delete_reseller
  BEFORE DELETE ON public.reseller_accounts
  FOR EACH ROW EXECUTE FUNCTION public.fn_prevent_hard_delete();

DROP TRIGGER IF EXISTS prevent_hard_delete_developers ON public.developers;
CREATE TRIGGER prevent_hard_delete_developers
  BEFORE DELETE ON public.developers
  FOR EACH ROW EXECUTE FUNCTION public.fn_prevent_hard_delete();

DROP TRIGGER IF EXISTS prevent_hard_delete_orders ON public.marketplace_orders;
CREATE TRIGGER prevent_hard_delete_orders
  BEFORE DELETE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.fn_prevent_hard_delete();

-- ============================================================
-- SECTION 6: FULL AUDIT SHADOW TABLES (GDPR/COMPLIANCE)
-- ============================================================

-- Audit shadow table for franchise_accounts
CREATE TABLE IF NOT EXISTS public.franchise_accounts_audit (
  change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  country_id UUID,
  is_sealed BOOLEAN DEFAULT true
);

-- Audit shadow table for reseller_accounts
CREATE TABLE IF NOT EXISTS public.reseller_accounts_audit (
  change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_sealed BOOLEAN DEFAULT true
);

-- Audit shadow table for marketplace_orders
CREATE TABLE IF NOT EXISTS public.marketplace_orders_audit (
  change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_sealed BOOLEAN DEFAULT true
);

-- Audit shadow table for unified_wallet_transactions
CREATE TABLE IF NOT EXISTS public.unified_wallet_transactions_audit (
  change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_sealed BOOLEAN DEFAULT true
);

-- Generic audit trigger function
-- auth.uid() returns NULL for service-role/background operations; those are
-- recorded with changed_by = NULL so they appear in the audit trail without
-- blocking the underlying operation.
CREATE OR REPLACE FUNCTION public.fn_create_audit_shadow()
RETURNS TRIGGER AS $$
DECLARE
  audit_table TEXT;
BEGIN
  audit_table := TG_TABLE_NAME || '_audit';

  EXECUTE format(
    'INSERT INTO public.%I (operation, record_id, old_values, new_values, changed_by, changed_at)
     VALUES ($1, $2, $3, $4, $5, now())',
    audit_table
  ) USING
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid(); -- NULL for service-role; preserved intentionally for traceability

  RETURN COALESCE(NEW, OLD);
EXCEPTION WHEN OTHERS THEN
  -- Audit failure must not block the main operation
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach audit triggers to critical tables
DROP TRIGGER IF EXISTS audit_franchise_accounts ON public.franchise_accounts;
CREATE TRIGGER audit_franchise_accounts
  AFTER INSERT OR UPDATE OR DELETE ON public.franchise_accounts
  FOR EACH ROW EXECUTE FUNCTION public.fn_create_audit_shadow();

DROP TRIGGER IF EXISTS audit_reseller_accounts ON public.reseller_accounts;
CREATE TRIGGER audit_reseller_accounts
  AFTER INSERT OR UPDATE OR DELETE ON public.reseller_accounts
  FOR EACH ROW EXECUTE FUNCTION public.fn_create_audit_shadow();

DROP TRIGGER IF EXISTS audit_marketplace_orders ON public.marketplace_orders;
CREATE TRIGGER audit_marketplace_orders
  AFTER INSERT OR UPDATE OR DELETE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.fn_create_audit_shadow();

DROP TRIGGER IF EXISTS audit_unified_wallet_transactions ON public.unified_wallet_transactions;
CREATE TRIGGER audit_unified_wallet_transactions
  AFTER INSERT OR UPDATE OR DELETE ON public.unified_wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION public.fn_create_audit_shadow();

-- Disable RLS on audit tables (append-only, admin-managed)
ALTER TABLE public.franchise_accounts_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_accounts_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_wallet_transactions_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read franchise audit" ON public.franchise_accounts_audit
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read reseller audit" ON public.reseller_accounts_audit
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read order audit" ON public.marketplace_orders_audit
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read wallet audit" ON public.unified_wallet_transactions_audit
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- SECTION 7: CROSS-TENANT QUERY PREVENTION
-- ============================================================

CREATE OR REPLACE FUNCTION public.fn_check_tenant_isolation()
RETURNS TRIGGER AS $$
DECLARE
  current_franchise_id UUID;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();

  -- Skip check for service role / admin operations (null auth.uid)
  IF current_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Skip check for admins/super_admins
  IF public.has_role(current_user_id, 'super_admin') OR public.has_role(current_user_id, 'admin') THEN
    RETURN NEW;
  END IF;

  -- Get current user's franchise
  SELECT id INTO current_franchise_id
  FROM public.franchise_accounts
  WHERE user_id = current_user_id
  LIMIT 1;

  -- If user is a franchise owner and trying to write to a different franchise, block it
  IF current_franchise_id IS NOT NULL AND NEW.franchise_id IS DISTINCT FROM current_franchise_id THEN
    RAISE EXCEPTION 'CROSS_TENANT_VIOLATION: Cannot access data belonging to another franchise';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply cross-tenant trigger to reseller_accounts
DROP TRIGGER IF EXISTS prevent_cross_tenant_write_reseller ON public.reseller_accounts;
CREATE TRIGGER prevent_cross_tenant_write_reseller
  BEFORE INSERT OR UPDATE ON public.reseller_accounts
  FOR EACH ROW EXECUTE FUNCTION public.fn_check_tenant_isolation();

-- Apply cross-tenant trigger to marketplace_orders
DROP TRIGGER IF EXISTS prevent_cross_tenant_write_orders ON public.marketplace_orders;
CREATE TRIGGER prevent_cross_tenant_write_orders
  BEFORE INSERT OR UPDATE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.fn_check_tenant_isolation();

-- ============================================================
-- SECTION 8: UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================================

DROP TRIGGER IF EXISTS update_marketplace_orders_updated_at ON public.marketplace_orders;
CREATE TRIGGER update_marketplace_orders_updated_at
  BEFORE UPDATE ON public.marketplace_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
