-- V138__add_product_images_table.sql
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    image_type VARCHAR(50) NOT NULL DEFAULT 'product',
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    storage_path VARCHAR(500) NOT NULL,
    storage_bucket VARCHAR(100) DEFAULT 'product-images',
    upload_status VARCHAR(50) DEFAULT 'completed',
    upload_error TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_product_image FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_uploader FOREIGN KEY (created_by) REFERENCES public.users(id)
);
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_url') THEN
        ALTER TABLE public.products ADD COLUMN image_url VARCHAR(500);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE public.products ADD COLUMN thumbnail_url VARCHAR(500);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'publish_status') THEN
        ALTER TABLE public.products ADD COLUMN publish_status VARCHAR(50) DEFAULT 'draft';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'marketplace_id') THEN
        ALTER TABLE public.products ADD COLUMN marketplace_id VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'last_published_at') THEN
        ALTER TABLE public.products ADD COLUMN last_published_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_featured') THEN
        ALTER TABLE public.products ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_type ON public.product_images(image_type);
CREATE INDEX IF NOT EXISTS idx_product_images_status ON public.product_images(upload_status);
CREATE INDEX IF NOT EXISTS idx_product_images_created ON public.product_images(created_at DESC);
