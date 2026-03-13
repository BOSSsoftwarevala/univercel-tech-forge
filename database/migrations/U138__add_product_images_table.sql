DROP TABLE IF EXISTS public.product_images CASCADE;
ALTER TABLE public.products DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.products DROP COLUMN IF EXISTS thumbnail_url;
ALTER TABLE public.products DROP COLUMN IF EXISTS publish_status;
ALTER TABLE public.products DROP COLUMN IF EXISTS marketplace_id;
ALTER TABLE public.products DROP COLUMN IF EXISTS last_published_at;
ALTER TABLE public.products DROP COLUMN IF EXISTS is_featured;
