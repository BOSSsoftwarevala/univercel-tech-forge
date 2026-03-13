-- Create single source of truth for frontend → boss event pipeline
CREATE TABLE IF NOT EXISTS public.system_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  source_role text,
  source_user_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_system_events_status_created_at ON public.system_events (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_events_source_user_id ON public.system_events (source_user_id);

-- Enable RLS
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can INSERT (public site events), only Boss/Owner + Admin can SELECT/UPDATE
DROP POLICY IF EXISTS "Anyone can insert system events" ON public.system_events;
DROP POLICY IF EXISTS "Boss can read system events" ON public.system_events;
DROP POLICY IF EXISTS "Boss can update system events" ON public.system_events;

CREATE POLICY "Anyone can insert system events"
ON public.system_events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Boss can read system events"
ON public.system_events
FOR SELECT
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Boss can update system events"
ON public.system_events
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  public.has_role(auth.uid(), 'boss_owner'::public.app_role)
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Timestamp trigger function (create if missing)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_system_events_updated_at ON public.system_events;
CREATE TRIGGER update_system_events_updated_at
BEFORE UPDATE ON public.system_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
