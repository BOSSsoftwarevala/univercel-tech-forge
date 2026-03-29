-- V139__add_product_publish_history_table.sql
CREATE TABLE IF NOT EXISTS public.product_publish_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    publish_action VARCHAR(100) NOT NULL,
    published_by UUID NOT NULL,
    published_at TIMESTAMPTZ DEFAULT now(),
    change_reason TEXT,
    metadata JSONB,
    CONSTRAINT fk_product_publish FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_publisher FOREIGN KEY (published_by) REFERENCES public.users(id)
);
CREATE TABLE IF NOT EXISTS public.marketplace_sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    marketplace_name VARCHAR(100) NOT NULL,
    sync_type VARCHAR(50) NOT NULL,
    sync_status VARCHAR(50) DEFAULT 'pending',
    marketplace_id VARCHAR(255),
    external_url VARCHAR(500),
    sync_payload JSONB,
    sync_response JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,
    synced_by UUID,
    initiated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT fk_product_marketplace FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_synced_user FOREIGN KEY (synced_by) REFERENCES public.users(id)
);
CREATE INDEX IF NOT EXISTS idx_publish_history_product ON public.product_publish_history(product_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_publish_history_status ON public.product_publish_history(new_status);
CREATE INDEX IF NOT EXISTS idx_marketplace_sync_product ON public.marketplace_sync_log(product_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_sync_status ON public.marketplace_sync_log(sync_status);
