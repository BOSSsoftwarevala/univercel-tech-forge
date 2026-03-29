
-- Trust system columns for software_catalog
ALTER TABLE public.software_catalog 
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS demo_domain text,
  ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_ratings integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avg_rating numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- AIRA client conversations
CREATE TABLE IF NOT EXISTS public.aira_client_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid,
  client_email text,
  product_id text,
  conversation_type text DEFAULT 'general',
  status text DEFAULT 'active',
  messages jsonb DEFAULT '[]'::jsonb,
  last_message_at timestamptz DEFAULT now(),
  follow_up_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Product auto-build pipeline
CREATE TABLE IF NOT EXISTS public.product_build_pipeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  boss_command text NOT NULL,
  product_name text,
  status text DEFAULT 'queued',
  stage text DEFAULT 'command_received',
  vala_task_id uuid,
  build_result jsonb,
  demo_url text,
  marketplace_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Product ratings
CREATE TABLE IF NOT EXISTS public.product_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  user_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_verified_purchase boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.aira_client_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_build_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated access client convos" ON public.aira_client_conversations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access build pipeline" ON public.product_build_pipeline FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can read ratings" ON public.product_ratings FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert ratings" ON public.product_ratings FOR INSERT TO authenticated WITH CHECK (true);
