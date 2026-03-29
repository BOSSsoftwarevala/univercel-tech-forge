ALTER TABLE IF EXISTS public.ai_memory
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.vala_factory_projects(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS memory_scope TEXT NOT NULL DEFAULT 'system' CHECK (memory_scope IN ('user', 'project', 'action', 'conversation', 'system')),
  ADD COLUMN IF NOT EXISTS memory_type TEXT NOT NULL DEFAULT 'generic',
  ADD COLUMN IF NOT EXISTS memory_key TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ NOT NULL DEFAULT now();

UPDATE public.ai_memory
SET
  memory_scope = COALESCE(NULLIF(memory_scope, ''), 'system'),
  memory_type = COALESCE(NULLIF(memory_type, ''), 'generic'),
  memory_key = COALESCE(NULLIF(memory_key, ''), key),
  summary = COALESCE(summary, LEFT(value::text, 280)),
  last_used_at = COALESCE(last_used_at, updated_at, created_at, now())
WHERE
  memory_key IS NULL
  OR summary IS NULL
  OR last_used_at IS NULL
  OR memory_scope IS NULL
  OR memory_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_ai_memory_user_scope_updated
  ON public.ai_memory(user_id, memory_scope, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_memory_project_scope_updated
  ON public.ai_memory(project_id, memory_scope, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_memory_type_updated
  ON public.ai_memory(memory_type, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_memory_key_lookup
  ON public.ai_memory(memory_key);