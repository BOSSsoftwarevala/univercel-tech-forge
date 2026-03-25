-- Fix remaining function search path security warning
CREATE OR REPLACE FUNCTION public.prevent_direct_promise_modification()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            RAISE EXCEPTION 'Direct status modification not allowed. Use process_promise_action function.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;