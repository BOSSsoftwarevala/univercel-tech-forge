-- Add read-only SELECT policy for promise_tracker role
CREATE POLICY "Promise tracker can view all promises" ON public.promise_logs
    FOR SELECT USING (has_role(auth.uid(), 'promise_tracker'));

-- Add read-only SELECT policy for promise_fines 
CREATE POLICY "Promise tracker can view all fines" ON public.promise_fines
    FOR SELECT USING (has_role(auth.uid(), 'promise_tracker'));