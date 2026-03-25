-- ============================================
-- SOFTWARE VALA AI PLATFORM - FULL ERD
-- ============================================

-- ============================================
-- CORE ENTITIES
-- ============================================

-- Roles Table
CREATE TABLE public.sv_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permissions Table
CREATE TABLE public.sv_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('read', 'write', 'edit', 'delete', 'manage')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(module, action)
);

-- Role_Permission Junction Table
CREATE TABLE public.sv_role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.sv_roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.sv_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- ============================================
-- AI MODELS
-- ============================================

-- AI_Model Table
CREATE TABLE public.sv_ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('LLM', 'STT', 'TTS', 'OCR', 'Vision', 'Embedding', 'Image')),
  provider TEXT NOT NULL,
  version TEXT NOT NULL,
  region TEXT DEFAULT 'global',
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'deprecated', 'testing')),
  cost_per_unit DECIMAL(10, 6) DEFAULT 0,
  unit_type TEXT DEFAULT 'token',
  api_endpoint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model_Config Table
CREATE TABLE public.sv_model_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.sv_ai_models(id) ON DELETE CASCADE,
  priority INTEGER DEFAULT 0,
  rate_limit INTEGER DEFAULT 100,
  rate_limit_window TEXT DEFAULT 'minute',
  quota INTEGER DEFAULT 10000,
  quota_period TEXT DEFAULT 'monthly',
  enabled BOOLEAN DEFAULT true,
  max_tokens INTEGER,
  temperature DECIMAL(3, 2) DEFAULT 0.7,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model_Routing Table
CREATE TABLE public.sv_model_routing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  request_type TEXT NOT NULL,
  primary_model_id UUID NOT NULL REFERENCES public.sv_ai_models(id),
  fallback_model_id UUID REFERENCES public.sv_ai_models(id),
  conditions JSONB DEFAULT '{}',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prompt Table
CREATE TABLE public.sv_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES public.sv_ai_models(id),
  name TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1.0',
  environment TEXT NOT NULL DEFAULT 'dev' CHECK (environment IN ('dev', 'staging', 'prod')),
  system_prompt TEXT,
  user_prompt_template TEXT,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- PRODUCT DEMO
-- ============================================

-- Demo Table
CREATE TABLE public.sv_demos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  product TEXT NOT NULL,
  demo_type TEXT NOT NULL DEFAULT 'live' CHECK (demo_type IN ('live', 'recorded', 'interactive', 'self-guided')),
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  join_url TEXT,
  recording_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Demo_Schedule Table
CREATE TABLE public.sv_demo_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_id UUID NOT NULL REFERENCES public.sv_demos(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  host_user_id UUID REFERENCES auth.users(id),
  max_attendees INTEGER DEFAULT 50,
  reminder_sent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Demo_Attendance Table
CREATE TABLE public.sv_demo_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  demo_id UUID NOT NULL REFERENCES public.sv_demos(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES public.sv_demo_schedules(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id),
  guest_email TEXT,
  guest_name TEXT,
  country TEXT,
  attended BOOLEAN DEFAULT false,
  join_time TIMESTAMPTZ,
  leave_time TIMESTAMPTZ,
  feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
  feedback_text TEXT,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ANDROID PLATFORM
-- ============================================

-- Android_APK Table
CREATE TABLE public.sv_android_apks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  version_code INTEGER NOT NULL,
  channel TEXT NOT NULL DEFAULT 'prod' CHECK (channel IN ('prod', 'beta', 'alpha', 'internal')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'testing', 'released', 'deprecated')),
  download_url TEXT,
  file_size_mb DECIMAL(10, 2),
  min_sdk_version INTEGER DEFAULT 21,
  target_sdk_version INTEGER DEFAULT 34,
  release_notes TEXT,
  released_at TIMESTAMPTZ,
  released_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- APK_Config Table
CREATE TABLE public.sv_apk_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apk_id UUID NOT NULL REFERENCES public.sv_android_apks(id) ON DELETE CASCADE,
  ai_enabled BOOLEAN DEFAULT true,
  offline_mode BOOLEAN DEFAULT false,
  logging_enabled BOOLEAN DEFAULT true,
  analytics_enabled BOOLEAN DEFAULT true,
  crash_reporting BOOLEAN DEFAULT true,
  debug_mode BOOLEAN DEFAULT false,
  feature_flags JSONB DEFAULT '{}',
  allowed_models TEXT[] DEFAULT ARRAY['gemini-flash'],
  max_offline_cache_mb INTEGER DEFAULT 100,
  sync_interval_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ENABLE RLS
-- ============================================

ALTER TABLE public.sv_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_model_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_model_routing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_demo_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_demo_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_android_apks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sv_apk_configs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Roles policies
CREATE POLICY "Authenticated can view roles" ON public.sv_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage roles" ON public.sv_roles FOR ALL TO authenticated USING (true);

-- Permissions policies
CREATE POLICY "Authenticated can view permissions" ON public.sv_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage permissions" ON public.sv_permissions FOR ALL TO authenticated USING (true);

-- Role_Permissions policies
CREATE POLICY "Authenticated can view role_permissions" ON public.sv_role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage role_permissions" ON public.sv_role_permissions FOR ALL TO authenticated USING (true);

-- AI Models policies
CREATE POLICY "Authenticated can view ai_models" ON public.sv_ai_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage ai_models" ON public.sv_ai_models FOR ALL TO authenticated USING (true);

-- Model Config policies
CREATE POLICY "Authenticated can view model_configs" ON public.sv_model_configs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage model_configs" ON public.sv_model_configs FOR ALL TO authenticated USING (true);

-- Model Routing policies
CREATE POLICY "Authenticated can view model_routing" ON public.sv_model_routing FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage model_routing" ON public.sv_model_routing FOR ALL TO authenticated USING (true);

-- Prompts policies
CREATE POLICY "Authenticated can view prompts" ON public.sv_prompts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own prompts" ON public.sv_prompts FOR ALL TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Admins can manage all prompts" ON public.sv_prompts FOR ALL TO authenticated USING (true);

-- Demos policies
CREATE POLICY "Authenticated can view demos" ON public.sv_demos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own demos" ON public.sv_demos FOR ALL TO authenticated USING (created_by = auth.uid());

-- Demo Schedules policies
CREATE POLICY "Authenticated can view demo_schedules" ON public.sv_demo_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Hosts can manage schedules" ON public.sv_demo_schedules FOR ALL TO authenticated USING (host_user_id = auth.uid());

-- Demo Attendance policies
CREATE POLICY "Authenticated can view attendance" ON public.sv_demo_attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create attendance" ON public.sv_demo_attendance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own attendance" ON public.sv_demo_attendance FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Android APK policies
CREATE POLICY "Authenticated can view apks" ON public.sv_android_apks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage apks" ON public.sv_android_apks FOR ALL TO authenticated USING (true);

-- APK Config policies
CREATE POLICY "Authenticated can view apk_configs" ON public.sv_apk_configs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage apk_configs" ON public.sv_apk_configs FOR ALL TO authenticated USING (true);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_sv_role_permissions_role ON public.sv_role_permissions(role_id);
CREATE INDEX idx_sv_role_permissions_permission ON public.sv_role_permissions(permission_id);
CREATE INDEX idx_sv_ai_models_type ON public.sv_ai_models(type);
CREATE INDEX idx_sv_ai_models_provider ON public.sv_ai_models(provider);
CREATE INDEX idx_sv_ai_models_status ON public.sv_ai_models(status);
CREATE INDEX idx_sv_model_configs_model ON public.sv_model_configs(model_id);
CREATE INDEX idx_sv_model_routing_primary ON public.sv_model_routing(primary_model_id);
CREATE INDEX idx_sv_prompts_model ON public.sv_prompts(model_id);
CREATE INDEX idx_sv_prompts_environment ON public.sv_prompts(environment);
CREATE INDEX idx_sv_demos_status ON public.sv_demos(status);
CREATE INDEX idx_sv_demo_schedules_demo ON public.sv_demo_schedules(demo_id);
CREATE INDEX idx_sv_demo_schedules_date ON public.sv_demo_schedules(scheduled_date);
CREATE INDEX idx_sv_demo_attendance_demo ON public.sv_demo_attendance(demo_id);
CREATE INDEX idx_sv_android_apks_channel ON public.sv_android_apks(channel);
CREATE INDEX idx_sv_android_apks_status ON public.sv_android_apks(status);
CREATE INDEX idx_sv_apk_configs_apk ON public.sv_apk_configs(apk_id);

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_sv_roles_updated_at
  BEFORE UPDATE ON public.sv_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sv_ai_models_updated_at
  BEFORE UPDATE ON public.sv_ai_models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sv_model_configs_updated_at
  BEFORE UPDATE ON public.sv_model_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sv_model_routing_updated_at
  BEFORE UPDATE ON public.sv_model_routing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sv_prompts_updated_at
  BEFORE UPDATE ON public.sv_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sv_demos_updated_at
  BEFORE UPDATE ON public.sv_demos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sv_android_apks_updated_at
  BEFORE UPDATE ON public.sv_android_apks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sv_apk_configs_updated_at
  BEFORE UPDATE ON public.sv_apk_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED DEFAULT ROLES
-- ============================================

INSERT INTO public.sv_roles (role_name, description, is_system_role) VALUES
  ('super_admin', 'Full access - Billing, Compliance, All settings', true),
  ('platform_admin', 'AI Models, Prompt Studio, Routing, Logs', true),
  ('support_manager', 'Chatbots, Live Chats, Training, Analytics', true),
  ('demo_manager', 'Create demos, Schedule, Leads, Reports', true),
  ('developer', 'API keys, SDK access, Logs (read)', true),
  ('viewer', 'View dashboards, No edit rights', true);

-- ============================================
-- SEED DEFAULT PERMISSIONS
-- ============================================

INSERT INTO public.sv_permissions (module, action, description) VALUES
  ('ai_models', 'read', 'View AI models'),
  ('ai_models', 'write', 'Create AI models'),
  ('ai_models', 'edit', 'Edit AI models'),
  ('ai_models', 'delete', 'Delete AI models'),
  ('prompts', 'read', 'View prompts'),
  ('prompts', 'write', 'Create prompts'),
  ('prompts', 'edit', 'Edit prompts'),
  ('prompts', 'delete', 'Delete prompts'),
  ('chatbots', 'read', 'View chatbots'),
  ('chatbots', 'write', 'Create chatbots'),
  ('chatbots', 'manage', 'Full chatbot management'),
  ('demos', 'read', 'View demos'),
  ('demos', 'write', 'Create demos'),
  ('demos', 'manage', 'Full demo management'),
  ('android', 'read', 'View APK releases'),
  ('android', 'manage', 'Manage APK releases'),
  ('billing', 'read', 'View billing'),
  ('billing', 'manage', 'Manage billing'),
  ('settings', 'read', 'View settings'),
  ('settings', 'manage', 'Manage settings');