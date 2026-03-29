ALTER TABLE public.marketplace_orders
ADD COLUMN IF NOT EXISTS payment_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_marketplace_orders_payment_id
ON public.marketplace_orders(payment_id)
WHERE payment_id IS NOT NULL;