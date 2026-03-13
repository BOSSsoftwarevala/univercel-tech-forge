
CREATE OR REPLACE FUNCTION public.search_products(search_query TEXT, result_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  product_id TEXT,
  product_name TEXT,
  description TEXT,
  category TEXT,
  monthly_price NUMERIC,
  lifetime_price NUMERIC,
  tech_stack TEXT,
  rank REAL
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.product_id,
    p.product_name,
    p.description,
    p.category,
    p.monthly_price,
    p.lifetime_price,
    p.tech_stack,
    ts_rank(p.search_vector, to_tsquery('english', search_query)) AS rank
  FROM public.products p
  WHERE p.is_active = true
    AND p.search_vector @@ to_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT result_limit;
$$;
