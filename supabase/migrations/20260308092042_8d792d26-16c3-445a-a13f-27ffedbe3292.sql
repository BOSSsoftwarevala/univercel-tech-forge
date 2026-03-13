
-- ============================================
-- 1. DEVICE BINDINGS (License Engine)
-- ============================================
CREATE TABLE IF NOT EXISTS public.device_bindings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID NOT NULL REFERENCES public.user_licenses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    device_fingerprint TEXT NOT NULL,
    device_name TEXT,
    device_type TEXT DEFAULT 'desktop',
    os_info TEXT,
    ip_address TEXT,
    is_active BOOLEAN DEFAULT true,
    bound_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    unbound_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.device_bindings ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_device_binding_unique 
  ON public.device_bindings(license_id, device_fingerprint) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_device_bindings_user ON public.device_bindings(user_id);
CREATE INDEX IF NOT EXISTS idx_device_bindings_license ON public.device_bindings(license_id);

CREATE POLICY "Users can view own device bindings"
  ON public.device_bindings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own device bindings"
  ON public.device_bindings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own device bindings"
  ON public.device_bindings FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admin full access device bindings"
  ON public.device_bindings FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'boss_owner'));

-- ============================================
-- 2. ORDER PROCESSING QUEUE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_processing_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.marketplace_orders(id) ON DELETE CASCADE,
    step_name TEXT NOT NULL,
    step_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.order_processing_queue ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_opq_order ON public.order_processing_queue(order_id);
CREATE INDEX IF NOT EXISTS idx_opq_status ON public.order_processing_queue(status);

CREATE POLICY "Admin can manage order queue"
  ON public.order_processing_queue FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'boss_owner'));

CREATE POLICY "Users can view own order queue"
  ON public.order_processing_queue FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.marketplace_orders mo 
    WHERE mo.id = order_processing_queue.order_id 
    AND mo.user_id = auth.uid()
  ));

-- ============================================
-- 3. MARKETPLACE WEBHOOKS
-- ============================================
CREATE TABLE IF NOT EXISTS public.marketplace_webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    target_url TEXT NOT NULL,
    secret_hash TEXT,
    is_active BOOLEAN DEFAULT true,
    retry_policy JSONB DEFAULT '{"max_retries": 3, "backoff_ms": 1000}',
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.marketplace_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage webhooks"
  ON public.marketplace_webhooks FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'boss_owner'));

-- ============================================
-- 4. WEBHOOK DELIVERY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS public.webhook_delivery_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_id UUID REFERENCES public.marketplace_webhooks(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    response_status INTEGER,
    response_body TEXT,
    attempt_number INTEGER DEFAULT 1,
    delivered_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.webhook_delivery_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_wdl_webhook ON public.webhook_delivery_log(webhook_id);
CREATE INDEX IF NOT EXISTS idx_wdl_status ON public.webhook_delivery_log(status);

CREATE POLICY "Admin view webhook logs"
  ON public.webhook_delivery_log FOR ALL
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'boss_owner'));

-- ============================================
-- 5. FULL-TEXT SEARCH on products
-- ============================================
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS idx_products_fts ON public.products USING gin(search_vector);

CREATE OR REPLACE FUNCTION public.update_product_search_vector()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.product_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.tech_stack, '')), 'D');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_product_search_vector ON public.products;
CREATE TRIGGER trg_product_search_vector
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_search_vector();

-- Backfill existing products
UPDATE public.products SET search_vector = 
  setweight(to_tsvector('english', COALESCE(product_name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(tech_stack, '')), 'D');

-- ============================================
-- 6. LICENSE KEY GENERATION FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_license_key(p_prefix TEXT DEFAULT 'SV')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_key := p_prefix || '-' || 
      upper(substr(md5(gen_random_uuid()::text), 1, 4)) || '-' ||
      upper(substr(md5(gen_random_uuid()::text), 1, 4)) || '-' ||
      upper(substr(md5(gen_random_uuid()::text), 1, 4)) || '-' ||
      upper(substr(md5(gen_random_uuid()::text), 1, 4));
    SELECT EXISTS(SELECT 1 FROM public.user_licenses WHERE license_key = v_key) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_key;
END;
$$;

-- ============================================
-- 7. AUTO LICENSE + QUEUE ON ORDER COMPLETION
-- ============================================
CREATE OR REPLACE FUNCTION public.process_order_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_license_key TEXT;
  v_product_id UUID;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    -- Get product_id from order metadata
    v_product_id := (NEW.metadata->>'product_id')::UUID;
    
    IF v_product_id IS NOT NULL THEN
      -- Generate license
      v_license_key := public.generate_license_key('SV');
      
      INSERT INTO public.user_licenses (user_id, product_id, license_key, license_type, status, max_installations)
      VALUES (NEW.user_id, v_product_id, v_license_key, 'standard', 'active', 3);
      
      -- Queue processing steps
      INSERT INTO public.order_processing_queue (order_id, step_name, step_order, status) VALUES
        (NEW.id, 'payment_confirmed', 1, 'completed'),
        (NEW.id, 'license_generated', 2, 'completed'),
        (NEW.id, 'product_provisioning', 3, 'pending'),
        (NEW.id, 'deployment_setup', 4, 'pending'),
        (NEW.id, 'notification_sent', 5, 'pending');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_order_completion ON public.marketplace_orders;
CREATE TRIGGER trg_order_completion
  AFTER UPDATE ON public.marketplace_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.process_order_completion();
