-- Schema validation migration for system_activity_log
-- Non-destructive: uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS
-- Ensures the table exists with all required columns for Boss Dashboard visibility

-- Ensure table exists (idempotent)
CREATE TABLE IF NOT EXISTS public.system_activity_log (
  log_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_role    TEXT NOT NULL,
  actor_id      UUID,
  action_type   TEXT NOT NULL,
  target        TEXT,
  target_id     UUID,
  risk_level    TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  metadata      JSONB DEFAULT '{}',
  timestamp     TIMESTAMPTZ DEFAULT now(),
  hash_signature TEXT
);

-- Add module_name column if not present (non-destructive)
ALTER TABLE public.system_activity_log
  ADD COLUMN IF NOT EXISTS module_name TEXT GENERATED ALWAYS AS (
    COALESCE(
      metadata->>'module_name',
      target
    )
  ) STORED;

-- Add status column if not present (non-destructive)
ALTER TABLE public.system_activity_log
  ADD COLUMN IF NOT EXISTS status TEXT GENERATED ALWAYS AS (
    COALESCE(metadata->>'status', 'success')
  ) STORED;

-- Index for Boss Dashboard queries (module + time range)
CREATE INDEX IF NOT EXISTS idx_sal_target_timestamp
  ON public.system_activity_log (target, timestamp DESC);

-- Index for filtering by risk level
CREATE INDEX IF NOT EXISTS idx_sal_risk_timestamp
  ON public.system_activity_log (risk_level, timestamp DESC);

-- Index for filtering by actor role
CREATE INDEX IF NOT EXISTS idx_sal_actor_role_timestamp
  ON public.system_activity_log (actor_role, timestamp DESC);

-- Ensure RLS is enabled
ALTER TABLE public.system_activity_log ENABLE ROW LEVEL SECURITY;

-- Ensure the read policy for boss exists (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'system_activity_log'
      AND policyname = 'Boss can view all activity logs'
  ) THEN
    CREATE POLICY "Boss can view all activity logs" ON public.system_activity_log
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.boss_accounts WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- Ensure the insert policy exists (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'system_activity_log'
      AND policyname = 'System can insert activity logs'
  ) THEN
    CREATE POLICY "System can insert activity logs" ON public.system_activity_log
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Ensure realtime publication includes the table (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname   = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename  = 'system_activity_log'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.system_activity_log;
  END IF;
END $$;
