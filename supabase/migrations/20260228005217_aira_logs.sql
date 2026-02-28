-- Create aira_logs table for AIRA audit trail
-- All AIRA command executions (success/rejected/error) are logged here
CREATE TABLE IF NOT EXISTS public.aira_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  command text NOT NULL,
  action_type text NOT NULL DEFAULT 'execute',
  result text,
  timestamp timestamptz NOT NULL DEFAULT now(),
  risk_level text NOT NULL DEFAULT 'low'
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_aira_logs_user_id ON public.aira_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_aira_logs_timestamp ON public.aira_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_aira_logs_action_type ON public.aira_logs (action_type);

-- Enable RLS
ALTER TABLE public.aira_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can insert their own log entries
DROP POLICY IF EXISTS "Users can insert own aira logs" ON public.aira_logs;
CREATE POLICY "Users can insert own aira logs"
ON public.aira_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only boss_owner can read all logs
DROP POLICY IF EXISTS "Boss can read all aira logs" ON public.aira_logs;
CREATE POLICY "Boss can read all aira logs"
ON public.aira_logs
FOR SELECT
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'master'::public.app_role)
  OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
);

-- Boss_owner can delete logs (cleanup)
DROP POLICY IF EXISTS "Boss can delete aira logs" ON public.aira_logs;
CREATE POLICY "Boss can delete aira logs"
ON public.aira_logs
FOR DELETE
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'master'::public.app_role)
  OR public.has_role(auth.uid(), 'super_admin'::public.app_role)
);
