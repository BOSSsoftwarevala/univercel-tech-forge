-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  payment_gateway TEXT DEFAULT 'payu',
  payment_id TEXT UNIQUE,
  transaction_id TEXT UNIQUE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by UUID,
  license_id UUID,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  license_type TEXT,
  is_lifetime BOOLEAN DEFAULT false,
  activation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'boss_owner')
));

CREATE POLICY "System can insert orders" ON public.orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE USING (EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'boss_owner')
));

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_product_id ON public.orders(product_id);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_payment_id ON public.orders(payment_id);

-- Create licenses table
CREATE TABLE IF NOT EXISTS public.licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(product_id) ON DELETE CASCADE,
  license_key TEXT UNIQUE NOT NULL,
  license_type TEXT DEFAULT 'standard',
  is_lifetime BOOLEAN DEFAULT false,
  activation_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  expiry_date TIMESTAMPTZ,
  max_devices INTEGER DEFAULT 1,
  active_devices INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  is_revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,
  usage_stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their licenses" ON public.licenses
FOR SELECT USING (user_id = auth.uid() OR EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('master', 'super_admin', 'boss_owner')
));

CREATE POLICY "System can insert licenses" ON public.licenses
FOR INSERT WITH CHECK (true);

CREATE INDEX idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX idx_licenses_license_key ON public.licenses(license_key);
CREATE INDEX idx_licenses_status ON public.licenses(status);
CREATE INDEX idx_licenses_expiry_date ON public.licenses(expiry_date);

-- Extend user_notifications with title and action_id fields for order notifications
ALTER TABLE public.user_notifications
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS action_id UUID;
