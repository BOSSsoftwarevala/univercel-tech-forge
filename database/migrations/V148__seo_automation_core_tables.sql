-- Migration: V148__seo_automation_core_tables
-- Description: Add missing tables for SEO automation: rank_history, content_logs, and enhanced automation tracking
-- Date: 2026-03-25

-- Rank History Table: Track position changes over time for comprehensive ranking analytics
CREATE TABLE IF NOT EXISTS public.rank_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES public.seo_keywords(id) ON DELETE CASCADE,
  domain TEXT NOT NULL DEFAULT 'softwarewalanet.com',
  search_engine TEXT NOT NULL DEFAULT 'google',
  device_type TEXT DEFAULT 'desktop',
  location TEXT DEFAULT 'IN',
  position INTEGER NOT NULL,
  previous_position INTEGER,
  change_delta INTEGER DEFAULT 0,
  url TEXT,
  title TEXT,
  snippet TEXT,
  traffic INTEGER DEFAULT 0,
  ctr NUMERIC(5,4) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  cpc NUMERIC(10,2) DEFAULT 0,
  competition_level TEXT DEFAULT 'medium',
  serp_features JSONB DEFAULT '[]',
  checked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content Logs Table: Comprehensive logging for all content operations and automation
CREATE TABLE IF NOT EXISTS public.content_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'blog', 'landing_page', 'social_post', 'email', 'ad'
  content_id UUID,
  operation_type TEXT NOT NULL, -- 'created', 'updated', 'published', 'optimized', 'failed', 'retried'
  status TEXT DEFAULT 'success', -- 'success', 'failed', 'pending', 'retry'
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  execution_time_ms INTEGER,
  metadata JSONB DEFAULT '{}',
  triggered_by UUID REFERENCES auth.users(id),
  automation_run_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SEO Automation Runs Table: Track automated optimization runs
CREATE TABLE IF NOT EXISTS public.seo_automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL, -- 'rank_tracking', 'content_optimization', 'backlink_monitoring', 'full_audit'
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'failed', 'partial'
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  summary JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  triggered_by UUID REFERENCES auth.users(id),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Optimization Queue Table: Queue content for AI optimization
CREATE TABLE IF NOT EXISTS public.ai_optimization_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  priority INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high, 4=critical
  optimization_type TEXT NOT NULL, -- 'seo_score', 'readability', 'conversion', 'freshness'
  status TEXT DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
  queued_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ,
  results JSONB DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Multi-channel Distribution Queue: Queue content for distribution across channels
CREATE TABLE IF NOT EXISTS public.distribution_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  channel TEXT NOT NULL, -- 'social_linkedin', 'social_twitter', 'email_newsletter', 'ad_google', 'ad_facebook'
  status TEXT DEFAULT 'queued', -- 'queued', 'processing', 'published', 'failed'
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Failure Control Table: Track failures and retry strategies
CREATE TABLE IF NOT EXISTS public.failure_control (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL,
  operation_id UUID,
  failure_reason TEXT NOT NULL,
  failure_code TEXT,
  retry_strategy TEXT DEFAULT 'exponential_backoff', -- 'immediate', 'exponential_backoff', 'fixed_interval'
  max_retries INTEGER DEFAULT 3,
  current_retry_count INTEGER DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  last_attempted_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'resolved', 'abandoned'
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.rank_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_optimization_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failure_control ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rank_history
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'rank_history_access' AND tablename = 'rank_history') THEN
    CREATE POLICY "rank_history_access" ON public.rank_history FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

-- RLS Policies for content_logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'content_logs_access' AND tablename = 'content_logs') THEN
    CREATE POLICY "content_logs_access" ON public.content_logs FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager') OR triggered_by = auth.uid());
  END IF;
END $$;

-- RLS Policies for seo_automation_runs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'seo_automation_runs_access' AND tablename = 'seo_automation_runs') THEN
    CREATE POLICY "seo_automation_runs_access" ON public.seo_automation_runs FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager') OR triggered_by = auth.uid());
  END IF;
END $$;

-- RLS Policies for ai_optimization_queue
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ai_optimization_queue_access' AND tablename = 'ai_optimization_queue') THEN
    CREATE POLICY "ai_optimization_queue_access" ON public.ai_optimization_queue FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

-- RLS Policies for distribution_queue
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'distribution_queue_access' AND tablename = 'distribution_queue') THEN
    CREATE POLICY "distribution_queue_access" ON public.distribution_queue FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

-- RLS Policies for failure_control
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'failure_control_access' AND tablename = 'failure_control') THEN
    CREATE POLICY "failure_control_access" ON public.failure_control FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'boss_owner') OR public.has_role(auth.uid(), 'seo_manager'));
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_rank_history_keyword_checked ON public.rank_history(keyword_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_rank_history_domain ON public.rank_history(domain);
CREATE INDEX IF NOT EXISTS idx_rank_history_checked_at ON public.rank_history(checked_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_logs_content ON public.content_logs(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_logs_operation ON public.content_logs(operation_type, status);
CREATE INDEX IF NOT EXISTS idx_content_logs_created ON public.content_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_seo_automation_runs_type ON public.seo_automation_runs(run_type, status);
CREATE INDEX IF NOT EXISTS idx_seo_automation_runs_created ON public.seo_automation_runs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_optimization_queue_status ON public.ai_optimization_queue(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_ai_optimization_queue_content ON public.ai_optimization_queue(content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_distribution_queue_status ON public.distribution_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_distribution_queue_channel ON public.distribution_queue(channel, status);

CREATE INDEX IF NOT EXISTS idx_failure_control_status ON public.failure_control(status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_failure_control_operation ON public.failure_control(operation_type, operation_id);