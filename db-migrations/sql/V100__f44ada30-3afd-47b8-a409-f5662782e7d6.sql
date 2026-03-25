-- Add missing tables (demo_projects and demo_requests)
CREATE TABLE IF NOT EXISTS public.demo_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name VARCHAR(200) NOT NULL,
  project_url TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  tech_stack TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(200) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  company_name VARCHAR(200),
  phone VARCHAR(50),
  interested_category VARCHAR(100),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  responded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any and recreate
DROP POLICY IF EXISTS "Anyone can view active demos" ON public.demo_projects;
DROP POLICY IF EXISTS "Authenticated users can manage demos" ON public.demo_projects;
DROP POLICY IF EXISTS "Anyone can submit demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Authenticated users can view all requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Authenticated users can update requests" ON public.demo_requests;

-- Public read for demo_projects
CREATE POLICY "Anyone can view active demos"
ON public.demo_projects FOR SELECT
USING (is_active = true);

-- Authenticated users can manage demos
CREATE POLICY "Authenticated users can manage demos"
ON public.demo_projects FOR ALL
TO authenticated
USING (true);

-- Anyone can submit demo requests
CREATE POLICY "Anyone can submit demo requests"
ON public.demo_requests FOR INSERT
WITH CHECK (true);

-- Authenticated users can view and update requests
CREATE POLICY "Authenticated users can view all requests"
ON public.demo_requests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update requests"
ON public.demo_requests FOR UPDATE
TO authenticated
USING (true);