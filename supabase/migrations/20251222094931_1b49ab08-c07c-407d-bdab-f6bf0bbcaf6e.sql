-- Fix function search_path for get_risk_level function
CREATE OR REPLACE FUNCTION public.get_risk_level(score integer)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
BEGIN
    RETURN CASE
        WHEN score <= 20 THEN 'normal'
        WHEN score <= 40 THEN 'caution'
        WHEN score <= 60 THEN 'watch'
        WHEN score <= 80 THEN 'high'
        ELSE 'critical'
    END;
END;
$function$;

-- Enable leaked password protection via auth config
-- Note: This is typically done via the Supabase dashboard auth settings