-- ============================================================
-- Migration: Advanced DB Architecture – Module → Category → Subcategory
-- Description: Structured, isolated, scalable DB layer with FK, RLS and indexes
-- ============================================================

-- ============================================================
-- 1. MODULE DEFINITIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.module_definitions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key      TEXT NOT NULL UNIQUE,          -- slug identifier, e.g. 'crm', 'billing'
  name            TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,                          -- icon name or URL
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'maintenance', 'disabled')),
  is_critical     BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  config          JSONB NOT NULL DEFAULT '{}',
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. MODULE CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.module_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id       UUID NOT NULL REFERENCES public.module_definitions(id) ON DELETE CASCADE,
  category_key    TEXT NOT NULL,                 -- slug within module, e.g. 'contacts'
  name            TEXT NOT NULL,
  description     TEXT,
  icon            TEXT,
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'maintenance', 'disabled')),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  config          JSONB NOT NULL DEFAULT '{}',
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module_id, category_key)
);

-- ============================================================
-- 3. MODULE SUBCATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.module_subcategories (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID NOT NULL REFERENCES public.module_categories(id) ON DELETE CASCADE,
  module_id         UUID NOT NULL REFERENCES public.module_definitions(id) ON DELETE CASCADE,
  subcategory_key   TEXT NOT NULL,               -- slug within category
  name              TEXT NOT NULL,
  description       TEXT,
  icon              TEXT,
  status            TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'maintenance', 'disabled')),
  sort_order        INTEGER NOT NULL DEFAULT 0,
  config            JSONB NOT NULL DEFAULT '{}',
  metadata          JSONB NOT NULL DEFAULT '{}',
  created_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, subcategory_key)
);

-- ============================================================
-- 4. MODULE ACCESS ROLES – per-module role assignments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.module_access_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID NOT NULL REFERENCES public.module_definitions(id) ON DELETE CASCADE,
  role        TEXT NOT NULL,
  can_read    BOOLEAN NOT NULL DEFAULT true,
  can_write   BOOLEAN NOT NULL DEFAULT false,
  can_delete  BOOLEAN NOT NULL DEFAULT false,
  can_admin   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module_id, role)
);

-- ============================================================
-- 5. CATEGORY ACCESS ROLES – per-category role assignments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.category_access_roles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID NOT NULL REFERENCES public.module_categories(id) ON DELETE CASCADE,
  module_id    UUID NOT NULL REFERENCES public.module_definitions(id) ON DELETE CASCADE,
  role         TEXT NOT NULL,
  can_read     BOOLEAN NOT NULL DEFAULT true,
  can_write    BOOLEAN NOT NULL DEFAULT false,
  can_delete   BOOLEAN NOT NULL DEFAULT false,
  can_admin    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, role)
);

-- ============================================================
-- 6. UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_module_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_module_definitions_updated_at') THEN
    CREATE TRIGGER trg_module_definitions_updated_at
      BEFORE UPDATE ON public.module_definitions
      FOR EACH ROW EXECUTE FUNCTION public.set_module_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_module_categories_updated_at') THEN
    CREATE TRIGGER trg_module_categories_updated_at
      BEFORE UPDATE ON public.module_categories
      FOR EACH ROW EXECUTE FUNCTION public.set_module_updated_at();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_module_subcategories_updated_at') THEN
    CREATE TRIGGER trg_module_subcategories_updated_at
      BEFORE UPDATE ON public.module_subcategories
      FOR EACH ROW EXECUTE FUNCTION public.set_module_updated_at();
  END IF;
END $$;

-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.module_definitions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_subcategories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_access_roles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_access_roles ENABLE ROW LEVEL SECURITY;

-- Helper: check if user has an admin-level role
CREATE OR REPLACE FUNCTION public.is_platform_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'super_admin', 'boss_owner', 'master', 'ceo')
  );
$$;

-- Helper: check if user has read access to a module via module_access_roles
CREATE OR REPLACE FUNCTION public.can_read_module(_user_id uuid, _module_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.module_access_roles mar
    JOIN public.user_roles ur ON ur.role = mar.role
    WHERE ur.user_id = _user_id
      AND mar.module_id = _module_id
      AND mar.can_read = true
  ) OR public.is_platform_admin(_user_id);
$$;

-- Helper: check if user has write access to a module
CREATE OR REPLACE FUNCTION public.can_write_module(_user_id uuid, _module_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.module_access_roles mar
    JOIN public.user_roles ur ON ur.role = mar.role
    WHERE ur.user_id = _user_id
      AND mar.module_id = _module_id
      AND mar.can_write = true
  ) OR public.is_platform_admin(_user_id);
$$;

-- ---- module_definitions policies ----
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'module_definitions_read' AND tablename = 'module_definitions') THEN
    CREATE POLICY "module_definitions_read" ON public.module_definitions
      FOR SELECT TO authenticated
      USING (public.can_read_module(auth.uid(), id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'module_definitions_write' AND tablename = 'module_definitions') THEN
    CREATE POLICY "module_definitions_write" ON public.module_definitions
      FOR ALL TO authenticated
      USING (public.is_platform_admin(auth.uid()))
      WITH CHECK (public.is_platform_admin(auth.uid()));
  END IF;
END $$;

-- ---- module_categories policies ----
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'module_categories_read' AND tablename = 'module_categories') THEN
    CREATE POLICY "module_categories_read" ON public.module_categories
      FOR SELECT TO authenticated
      USING (public.can_read_module(auth.uid(), module_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'module_categories_write' AND tablename = 'module_categories') THEN
    CREATE POLICY "module_categories_write" ON public.module_categories
      FOR ALL TO authenticated
      USING (public.is_platform_admin(auth.uid()))
      WITH CHECK (public.is_platform_admin(auth.uid()));
  END IF;
END $$;

-- ---- module_subcategories policies ----
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'module_subcategories_read' AND tablename = 'module_subcategories') THEN
    CREATE POLICY "module_subcategories_read" ON public.module_subcategories
      FOR SELECT TO authenticated
      USING (public.can_read_module(auth.uid(), module_id));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'module_subcategories_write' AND tablename = 'module_subcategories') THEN
    CREATE POLICY "module_subcategories_write" ON public.module_subcategories
      FOR ALL TO authenticated
      USING (public.is_platform_admin(auth.uid()))
      WITH CHECK (public.is_platform_admin(auth.uid()));
  END IF;
END $$;

-- ---- module_access_roles policies ----
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'module_access_roles_admin' AND tablename = 'module_access_roles') THEN
    CREATE POLICY "module_access_roles_admin" ON public.module_access_roles
      FOR ALL TO authenticated
      USING (public.is_platform_admin(auth.uid()))
      WITH CHECK (public.is_platform_admin(auth.uid()));
  END IF;
END $$;

-- ---- category_access_roles policies ----
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'category_access_roles_admin' AND tablename = 'category_access_roles') THEN
    CREATE POLICY "category_access_roles_admin" ON public.category_access_roles
      FOR ALL TO authenticated
      USING (public.is_platform_admin(auth.uid()))
      WITH CHECK (public.is_platform_admin(auth.uid()));
  END IF;
END $$;

-- ============================================================
-- 8. PERFORMANCE INDEXES
-- ============================================================

-- module_definitions
CREATE INDEX IF NOT EXISTS idx_module_defs_status       ON public.module_definitions(status);
CREATE INDEX IF NOT EXISTS idx_module_defs_key          ON public.module_definitions(module_key);
CREATE INDEX IF NOT EXISTS idx_module_defs_sort         ON public.module_definitions(sort_order);

-- module_categories
CREATE INDEX IF NOT EXISTS idx_module_cats_module_id    ON public.module_categories(module_id);
CREATE INDEX IF NOT EXISTS idx_module_cats_status       ON public.module_categories(status);
CREATE INDEX IF NOT EXISTS idx_module_cats_key          ON public.module_categories(module_id, category_key);
CREATE INDEX IF NOT EXISTS idx_module_cats_sort         ON public.module_categories(module_id, sort_order);

-- module_subcategories
CREATE INDEX IF NOT EXISTS idx_module_subcats_cat_id    ON public.module_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_module_subcats_module_id ON public.module_subcategories(module_id);
CREATE INDEX IF NOT EXISTS idx_module_subcats_status    ON public.module_subcategories(status);
CREATE INDEX IF NOT EXISTS idx_module_subcats_key       ON public.module_subcategories(category_id, subcategory_key);
CREATE INDEX IF NOT EXISTS idx_module_subcats_sort      ON public.module_subcategories(category_id, sort_order);

-- module_access_roles
CREATE INDEX IF NOT EXISTS idx_module_access_module     ON public.module_access_roles(module_id);
CREATE INDEX IF NOT EXISTS idx_module_access_role       ON public.module_access_roles(role);

-- category_access_roles
CREATE INDEX IF NOT EXISTS idx_cat_access_category      ON public.category_access_roles(category_id);
CREATE INDEX IF NOT EXISTS idx_cat_access_module        ON public.category_access_roles(module_id);
CREATE INDEX IF NOT EXISTS idx_cat_access_role          ON public.category_access_roles(role);

-- ============================================================
-- 9. SEED DATA – Core platform modules with categories & subcategories
-- ============================================================

-- Insert core modules
INSERT INTO public.module_definitions (module_key, name, description, status, is_critical, sort_order) VALUES
  ('crm',           'CRM',                  'Customer relationship management',          'active', true,  10),
  ('billing',       'Billing & Payments',   'Invoicing, subscriptions, payment gateway', 'active', true,  20),
  ('product',       'Product Management',   'Catalog, pricing, inventory',               'active', true,  30),
  ('leads',         'Leads Management',     'Lead capture, scoring, pipeline',           'active', false, 40),
  ('marketing',     'Marketing',            'Campaigns, SEO, social media',              'active', false, 50),
  ('analytics',     'Analytics',            'Reports, dashboards, BI',                   'active', false, 60),
  ('ai_engine',     'AI Engine',            'AI automation and assistants',              'active', false, 70),
  ('support',       'Support',              'Tickets, live chat, knowledge base',        'active', false, 80),
  ('compliance',    'Compliance',           'Security, audit trails, GDPR',              'active', true,  90),
  ('integrations',  'Integrations',         'Third-party API connections',               'active', false, 100)
ON CONFLICT (module_key) DO NOTHING;

-- CRM categories
WITH m AS (SELECT id FROM public.module_definitions WHERE module_key = 'crm')
INSERT INTO public.module_categories (module_id, category_key, name, description, sort_order)
SELECT m.id, cat.key, cat.name, cat.desc, cat.sort FROM m, (VALUES
  ('contacts',   'Contacts',    'Manage contacts and companies',      10),
  ('pipeline',   'Pipeline',    'Sales pipeline and deal stages',     20),
  ('activities', 'Activities',  'Calls, meetings, tasks',             30),
  ('reports',    'Reports',     'CRM analytics and reporting',        40)
) AS cat(key, name, desc, sort)
ON CONFLICT (module_id, category_key) DO NOTHING;

-- CRM → Contacts subcategories
WITH cat AS (
  SELECT mc.id, mc.module_id FROM public.module_categories mc
  JOIN public.module_definitions md ON md.id = mc.module_id
  WHERE md.module_key = 'crm' AND mc.category_key = 'contacts'
)
INSERT INTO public.module_subcategories (category_id, module_id, subcategory_key, name, description, sort_order)
SELECT cat.id, cat.module_id, s.key, s.name, s.desc, s.sort FROM cat, (VALUES
  ('people',    'People',    'Individual contact records',    10),
  ('companies', 'Companies', 'Organisation records',          20),
  ('tags',      'Tags',      'Contact tagging and segments',  30)
) AS s(key, name, desc, sort)
ON CONFLICT (category_id, subcategory_key) DO NOTHING;

-- CRM → Pipeline subcategories
WITH cat AS (
  SELECT mc.id, mc.module_id FROM public.module_categories mc
  JOIN public.module_definitions md ON md.id = mc.module_id
  WHERE md.module_key = 'crm' AND mc.category_key = 'pipeline'
)
INSERT INTO public.module_subcategories (category_id, module_id, subcategory_key, name, description, sort_order)
SELECT cat.id, cat.module_id, s.key, s.name, s.desc, s.sort FROM cat, (VALUES
  ('deals',    'Deals',    'Active deal tracking',          10),
  ('stages',   'Stages',   'Pipeline stage configuration',  20),
  ('forecast', 'Forecast', 'Revenue forecasting',           30)
) AS s(key, name, desc, sort)
ON CONFLICT (category_id, subcategory_key) DO NOTHING;

-- Billing categories
WITH m AS (SELECT id FROM public.module_definitions WHERE module_key = 'billing')
INSERT INTO public.module_categories (module_id, category_key, name, description, sort_order)
SELECT m.id, cat.key, cat.name, cat.desc, cat.sort FROM m, (VALUES
  ('invoices',      'Invoices',      'Create and manage invoices',       10),
  ('subscriptions', 'Subscriptions', 'Recurring billing plans',          20),
  ('payments',      'Payments',      'Payment records and gateway logs',  30),
  ('refunds',       'Refunds',       'Refund processing and history',     40)
) AS cat(key, name, desc, sort)
ON CONFLICT (module_id, category_key) DO NOTHING;

-- Billing → Invoices subcategories
WITH cat AS (
  SELECT mc.id, mc.module_id FROM public.module_categories mc
  JOIN public.module_definitions md ON md.id = mc.module_id
  WHERE md.module_key = 'billing' AND mc.category_key = 'invoices'
)
INSERT INTO public.module_subcategories (category_id, module_id, subcategory_key, name, description, sort_order)
SELECT cat.id, cat.module_id, s.key, s.name, s.desc, s.sort FROM cat, (VALUES
  ('draft',    'Draft',    'Unpublished invoices',  10),
  ('sent',     'Sent',     'Sent invoices',         20),
  ('overdue',  'Overdue',  'Overdue invoices',      30),
  ('paid',     'Paid',     'Paid invoices',         40)
) AS s(key, name, desc, sort)
ON CONFLICT (category_id, subcategory_key) DO NOTHING;

-- Product categories
WITH m AS (SELECT id FROM public.module_definitions WHERE module_key = 'product')
INSERT INTO public.module_categories (module_id, category_key, name, description, sort_order)
SELECT m.id, cat.key, cat.name, cat.desc, cat.sort FROM m, (VALUES
  ('catalog',   'Catalog',   'Product listings and details',  10),
  ('inventory', 'Inventory', 'Stock and warehouse management', 20),
  ('pricing',   'Pricing',   'Price rules and tiers',         30),
  ('reviews',   'Reviews',   'Customer feedback',             40)
) AS cat(key, name, desc, sort)
ON CONFLICT (module_id, category_key) DO NOTHING;

-- Leads categories
WITH m AS (SELECT id FROM public.module_definitions WHERE module_key = 'leads')
INSERT INTO public.module_categories (module_id, category_key, name, description, sort_order)
SELECT m.id, cat.key, cat.name, cat.desc, cat.sort FROM m, (VALUES
  ('capture',   'Capture',    'Lead intake forms and sources',    10),
  ('scoring',   'Scoring',    'Lead quality scoring rules',       20),
  ('nurture',   'Nurture',    'Email and drip campaigns',         30),
  ('qualified', 'Qualified',  'Sales-qualified leads (SQL)',      40)
) AS cat(key, name, desc, sort)
ON CONFLICT (module_id, category_key) DO NOTHING;

-- Analytics categories
WITH m AS (SELECT id FROM public.module_definitions WHERE module_key = 'analytics')
INSERT INTO public.module_categories (module_id, category_key, name, description, sort_order)
SELECT m.id, cat.key, cat.name, cat.desc, cat.sort FROM m, (VALUES
  ('dashboards', 'Dashboards', 'Real-time overview panels',    10),
  ('reports',    'Reports',    'Scheduled and ad-hoc reports', 20),
  ('exports',    'Exports',    'Data export and download',     30)
) AS cat(key, name, desc, sort)
ON CONFLICT (module_id, category_key) DO NOTHING;

-- Default module access roles
INSERT INTO public.module_access_roles (module_id, role, can_read, can_write, can_delete, can_admin)
SELECT md.id, r.role, r.can_read, r.can_write, r.can_delete, r.can_admin
FROM public.module_definitions md,
(VALUES
  ('super_admin', true, true, true, true),
  ('boss_owner',  true, true, true, true),
  ('master',      true, true, true, true),
  ('admin',       true, true, false, false),
  ('ceo',         true, false, false, false),
  ('user',        true, false, false, false)
) AS r(role, can_read, can_write, can_delete, can_admin)
ON CONFLICT (module_id, role) DO NOTHING;
