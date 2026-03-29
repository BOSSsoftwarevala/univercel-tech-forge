-- Client Projects table for tracking client orders
CREATE TABLE public.client_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  domain_name TEXT NOT NULL,
  logo_url TEXT,
  company_name TEXT,
  
  -- Project details
  project_type TEXT NOT NULL DEFAULT 'demo',
  demo_id UUID,
  requirements TEXT,
  
  -- Pricing
  quoted_amount DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  balance_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  
  -- Payment tracking
  deposit_paid BOOLEAN DEFAULT false,
  deposit_paid_at TIMESTAMPTZ,
  deposit_payment_method TEXT,
  deposit_transaction_id TEXT,
  balance_paid BOOLEAN DEFAULT false,
  balance_paid_at TIMESTAMPTZ,
  balance_payment_method TEXT,
  balance_transaction_id TEXT,
  
  -- Status workflow
  status TEXT DEFAULT 'pending_review',
  status_message TEXT DEFAULT 'Your request has been received. Our team is reviewing your requirements.',
  
  -- IP/DNS Configuration
  assigned_ip TEXT,
  dns_configured BOOLEAN DEFAULT false,
  
  -- Admin workflow
  admin_notes TEXT,
  assigned_to UUID,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert projects" 
ON public.client_projects 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all projects" 
ON public.client_projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'master')
  )
);

CREATE POLICY "Admins can update projects" 
ON public.client_projects 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'master')
  )
);

CREATE TABLE public.project_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  status_message TEXT,
  changed_by UUID,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage status history" 
ON public.project_status_history 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'master')
  )
);

CREATE TRIGGER update_client_projects_updated_at
BEFORE UPDATE ON public.client_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_client_projects_email ON public.client_projects(client_email);
CREATE INDEX idx_client_projects_status ON public.client_projects(status);