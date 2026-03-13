
-- GitHub Repository Sync Tracking Table
CREATE TABLE public.github_repo_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.software_catalog(id) ON DELETE SET NULL,
  repo_full_name text NOT NULL,
  repo_url text NOT NULL,
  default_branch text DEFAULT 'main',
  category text,
  last_commit_sha text,
  last_commit_at timestamp with time zone,
  last_commit_message text,
  last_sync_at timestamp with time zone,
  demo_url text,
  demo_build_status text DEFAULT 'pending',
  is_active boolean DEFAULT true,
  repo_visibility text DEFAULT 'private',
  stars_count integer DEFAULT 0,
  language text,
  topics text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(repo_full_name)
);

ALTER TABLE public.github_repo_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Boss and admins can manage repo sync"
  ON public.github_repo_sync FOR ALL
  TO authenticated USING (
    public.has_role(auth.uid(), 'boss_owner') OR 
    public.has_role(auth.uid(), 'master') OR
    public.has_role(auth.uid(), 'product_demo_manager')
  );

CREATE POLICY "Authenticated users can view repo sync"
  ON public.github_repo_sync FOR SELECT
  TO authenticated USING (true);

-- Add demo_build_status to software_catalog if not exists
ALTER TABLE public.software_catalog ADD COLUMN IF NOT EXISTS demo_build_status text DEFAULT 'pending';
ALTER TABLE public.software_catalog ADD COLUMN IF NOT EXISTS last_repo_sync_at timestamp with time zone;
ALTER TABLE public.software_catalog ADD COLUMN IF NOT EXISTS repo_last_commit_sha text;
ALTER TABLE public.software_catalog ADD COLUMN IF NOT EXISTS repo_language text;
