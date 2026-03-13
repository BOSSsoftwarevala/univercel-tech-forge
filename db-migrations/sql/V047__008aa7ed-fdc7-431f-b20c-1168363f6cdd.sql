-- Add fine_amount column to promise_logs
ALTER TABLE public.promise_logs 
ADD COLUMN IF NOT EXISTS fine_amount NUMERIC DEFAULT 0;

-- Create promise_fines table to track all fines
CREATE TABLE IF NOT EXISTS public.promise_fines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promise_id UUID REFERENCES public.promise_logs(id) ON DELETE CASCADE NOT NULL,
    developer_id UUID NOT NULL,
    fine_amount NUMERIC NOT NULL DEFAULT 0,
    fine_reason TEXT NOT NULL,
    fine_type TEXT NOT NULL DEFAULT 'breach', -- breach, late, quality
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    paid_at TIMESTAMP WITH TIME ZONE,
    waived_at TIMESTAMP WITH TIME ZONE,
    waived_by UUID,
    waiver_reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, waived, disputed
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promise_fines ENABLE ROW LEVEL SECURITY;

-- RLS policies for promise_fines
CREATE POLICY "Super admins can manage all fines"
ON public.promise_fines
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('super_admin', 'master', 'admin', 'finance_manager')
    )
);

CREATE POLICY "Developers can view their own fines"
ON public.promise_fines
FOR SELECT
USING (
    developer_id IN (
        SELECT id FROM public.developers WHERE user_id = auth.uid()
    )
);

-- Create function to auto-apply fine on breach
CREATE OR REPLACE FUNCTION public.apply_promise_breach_fine()
RETURNS TRIGGER AS $$
DECLARE
    fine_amt NUMERIC := 50; -- Default fine amount
BEGIN
    -- Only apply if status changed to breached
    IF NEW.status = 'breached' AND OLD.status != 'breached' THEN
        -- Update fine amount on promise
        NEW.fine_amount := fine_amt;
        
        -- Insert fine record
        INSERT INTO public.promise_fines (
            promise_id,
            developer_id,
            fine_amount,
            fine_reason,
            fine_type,
            status
        ) VALUES (
            NEW.id,
            NEW.developer_id,
            fine_amt,
            COALESCE(NEW.breach_reason, 'Promise deadline exceeded'),
            'breach',
            'pending'
        );
        
        -- Update developer wallet penalties
        UPDATE public.developer_wallet
        SET total_penalties = total_penalties + fine_amt,
            available_balance = available_balance - fine_amt
        WHERE developer_id = NEW.developer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-fine on breach
DROP TRIGGER IF EXISTS promise_breach_fine_trigger ON public.promise_logs;
CREATE TRIGGER promise_breach_fine_trigger
    BEFORE UPDATE ON public.promise_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.apply_promise_breach_fine();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_promise_fines_developer ON public.promise_fines(developer_id);
CREATE INDEX IF NOT EXISTS idx_promise_fines_status ON public.promise_fines(status);
CREATE INDEX IF NOT EXISTS idx_promise_logs_status ON public.promise_logs(status);