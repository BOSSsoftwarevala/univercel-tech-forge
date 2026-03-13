-- Marketplace core schema (Postgres / Supabase-ready)
-- Date: 2026-03-13
-- Implements: users, products, orders, categories, product_categories, reviews
-- Notes: UUID primary keys, timestamps as timestamptz, updated_at trigger, full-text search index,
-- indexes for pagination/filters, basic RLS examples (adjust to your auth model).

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ========================================================================
-- 1. Users (local store) - If you use Supabase auth, consider using auth.users instead.
-- Keep local users table for marketplace profiles or fallback.
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(50) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (lower(username));
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (lower(email));

-- ========================================================================
-- 2. Products
-- - Designed for scale: indexes for pagination/filtering, GIN full-text search via tsvector,
-- - metadata jsonb for extensibility (tech stack, features, badges)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL REFERENCES public.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NULL,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Pagination / filter indexes
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products (price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);

-- Index for fast case-insensitive name searches and sorting
CREATE INDEX IF NOT EXISTS idx_products_name_lower ON public.products (lower(name) text_pattern_ops);

-- Full-text search column and index
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS search_tsv tsvector;
CREATE INDEX IF NOT EXISTS idx_products_search_tsv ON public.products USING gin(search_tsv);

-- Trigger to update search_tsv
CREATE OR REPLACE FUNCTION public.products_search_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce((NEW.metadata->>'tech_stack')::text, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'products_tsv_trigger'
  ) THEN
    CREATE TRIGGER products_tsv_trigger
    BEFORE INSERT OR UPDATE ON public.products
    FOR EACH ROW EXECUTE PROCEDURE public.products_search_tsv_trigger();
  END IF;
END$$;

-- ========================================================================
-- 3. Categories and product-category association
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_name_lower ON public.categories (lower(name));

CREATE TABLE IF NOT EXISTS public.product_categories (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON public.product_categories (category_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON public.product_categories (product_id);

-- ========================================================================
-- 4. Orders
-- - Supports high write throughput; index by created_at, status, user_id, product_id
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL REFERENCES public.users(id) ON DELETE SET NULL,
  product_id uuid NULL REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  amount numeric(14,2) NOT NULL DEFAULT 0, -- denormalized amount for quick reads
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed','refunded','cancelled')),
  gateway text NULL,
  gateway_order_id text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders (product_id);

-- ========================================================================
-- 5. Reviews
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL REFERENCES public.users(id) ON DELETE SET NULL,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Quick aggregate index
CREATE INDEX IF NOT EXISTS idx_reviews_product_id_rating ON public.reviews (product_id, rating);

-- Optional: ensure one review per user per product (uncomment if desired)
-- ALTER TABLE public.reviews ADD CONSTRAINT uniq_user_product_review UNIQUE (user_id, product_id);

-- ========================================================================
-- 6. Utility: trigger to update updated_at timestamp on row change
-- ========================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  -- products
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_products') THEN
    CREATE TRIGGER set_updated_products
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_column();
  END IF;
  -- categories
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_categories') THEN
    CREATE TRIGGER set_updated_categories
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_column();
  END IF;
  -- orders
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_orders') THEN
    CREATE TRIGGER set_updated_orders
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_column();
  END IF;
  -- reviews
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_reviews') THEN
    CREATE TRIGGER set_updated_reviews
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_column();
  END IF;
  -- users
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_users') THEN
    CREATE TRIGGER set_updated_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at_column();
  END IF;
END $$;

-- ========================================================================
-- 7. Materialized view (optional): product_aggregates for fast dashboard reads
-- - Refresh on schedule (cron) or via triggers after heavy writes (consider async)
-- ========================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.product_aggregates AS
SELECT
  p.id AS product_id,
  p.name,
  p.is_active,
  p.price,
  COALESCE(avg(r.rating), 0)::numeric(3,2) AS avg_rating,
  COUNT(r.id) AS review_count,
  COUNT(o.id) FILTER (WHERE o.status = 'completed') AS total_sales
FROM public.products p
LEFT JOIN public.reviews r ON r.product_id = p.id
LEFT JOIN public.orders o ON o.product_id = p.id
GROUP BY p.id, p.name, p.is_active, p.price;

CREATE INDEX IF NOT EXISTS idx_product_aggregates_product_id ON public.product_aggregates (product_id);

-- ========================================================================
-- 8. Basic RLS examples (adjust to your auth setup)
-- - NOTE: These are example policies to allow public read of active products.
-- - In production, tighten policies and prefer service-role for sensitive writes.
-- ========================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous/select access to active products (adjust role name as required)
CREATE POLICY "Public can select active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert orders (example)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can insert orders" ON public.orders
  FOR INSERT USING (true) WITH CHECK (true);

-- ========================================================================
-- 9. Performance & maintenance recommendations (DB-level)
-- - Use proper VACUUM / autovacuum tuning for high write loads.
-- - Use read replicas for analytics / heavy-read dashboards.
-- - Consider partitioning orders by created_at (monthly) if order volume grows extremely large.
-- - Materialized views and denormalized columns (orders.amount) used to accelerate reads.
-- ========================================================================
