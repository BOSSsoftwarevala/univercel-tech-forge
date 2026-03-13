
-- 1. Tables
CREATE TABLE public.marketplace_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  section_type TEXT NOT NULL DEFAULT 'category',
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  icon TEXT,
  filter_criteria JSONB DEFAULT '{}',
  max_items INT DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.marketplace_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  cta_text TEXT DEFAULT 'Learn More',
  cta_link TEXT,
  product_id UUID REFERENCES public.products(product_id) ON DELETE SET NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.marketplace_featured (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.marketplace_sections(id) ON DELETE CASCADE,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(product_id, section_id)
);

CREATE TABLE public.product_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  franchise_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  final_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  requirements TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.marketplace_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  total_price NUMERIC(12,2) NOT NULL,
  license_key TEXT,
  deployed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE RESTRICT,
  order_item_id UUID REFERENCES public.marketplace_order_items(id) ON DELETE SET NULL,
  license_key TEXT NOT NULL UNIQUE,
  license_type TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'active',
  activated_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  max_installations INT DEFAULT 1,
  current_installations INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.marketplace_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.marketplace_order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. RLS
ALTER TABLE public.marketplace_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_featured ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_order_status_history ENABLE ROW LEVEL SECURITY;

-- Sections/Banners/Featured: public read
CREATE POLICY "sections_read" ON public.marketplace_sections FOR SELECT USING (true);
CREATE POLICY "sections_admin" ON public.marketplace_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'boss_owner'));
CREATE POLICY "banners_read" ON public.marketplace_banners FOR SELECT USING (true);
CREATE POLICY "banners_admin" ON public.marketplace_banners FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'boss_owner'));
CREATE POLICY "featured_read" ON public.marketplace_featured FOR SELECT USING (true);
CREATE POLICY "featured_admin" ON public.marketplace_featured FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'boss_owner'));

-- Favorites
CREATE POLICY "fav_select" ON public.product_favorites FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "fav_insert" ON public.product_favorites FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "fav_delete" ON public.product_favorites FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Orders
CREATE POLICY "mko_select" ON public.marketplace_orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner'));
CREATE POLICY "mko_insert" ON public.marketplace_orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "mko_update" ON public.marketplace_orders FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner'));

-- Order Items
CREATE POLICY "mkoi_select" ON public.marketplace_order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.marketplace_orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner')))
);
CREATE POLICY "mkoi_insert" ON public.marketplace_order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.marketplace_orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- Licenses
CREATE POLICY "lic_select" ON public.user_licenses FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner'));
CREATE POLICY "lic_admin" ON public.user_licenses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'boss_owner'));

-- Analytics
CREATE POLICY "ana_insert" ON public.marketplace_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "ana_read" ON public.marketplace_analytics FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'boss_owner'));

-- Order History
CREATE POLICY "osh_select" ON public.marketplace_order_status_history FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.marketplace_orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(), 'boss_owner')))
);
CREATE POLICY "osh_insert" ON public.marketplace_order_status_history FOR INSERT TO authenticated WITH CHECK (true);

-- 3. Indexes
CREATE INDEX idx_mkt_sections_active ON public.marketplace_sections(is_active, display_order);
CREATE INDEX idx_mkt_banners_active ON public.marketplace_banners(is_active, display_order);
CREATE INDEX idx_mkt_featured_section ON public.marketplace_featured(section_id, display_order);
CREATE INDEX idx_mkt_favorites_user ON public.product_favorites(user_id);
CREATE INDEX idx_mkt_orders_user ON public.marketplace_orders(user_id, status);
CREATE INDEX idx_mkt_order_items_order ON public.marketplace_order_items(order_id);
CREATE INDEX idx_mkt_licenses_user ON public.user_licenses(user_id, status);
CREATE INDEX idx_mkt_analytics_product ON public.marketplace_analytics(product_id, event_type, created_at);

-- 4. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_orders;

-- 5. Seed default sections
INSERT INTO public.marketplace_sections (title, slug, section_type, display_order, icon) VALUES
  ('Featured Software', 'featured', 'featured', 1, 'Star'),
  ('Trending Now', 'trending', 'trending', 2, 'TrendingUp'),
  ('New Releases', 'new-releases', 'new_releases', 3, 'Sparkles'),
  ('Recommended for You', 'recommended', 'recommended', 4, 'ThumbsUp'),
  ('CRM & Sales', 'crm-sales', 'category', 5, 'Users'),
  ('E-Commerce', 'ecommerce', 'category', 6, 'ShoppingCart'),
  ('Marketing Tools', 'marketing', 'category', 7, 'Megaphone'),
  ('Finance & Accounting', 'finance', 'category', 8, 'IndianRupee'),
  ('HR & Recruitment', 'hr', 'category', 9, 'UserPlus'),
  ('Education & LMS', 'education', 'category', 10, 'GraduationCap');
