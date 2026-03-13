-- Create software catalog table for the 5000+ software list
CREATE TABLE public.software_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    base_price DECIMAL(10,2) DEFAULT 0,
    type TEXT NOT NULL CHECK (type IN ('Offline', 'Desktop', 'SaaS', 'Mobile', 'Hybrid')),
    vendor TEXT DEFAULT 'Software Vala',
    category TEXT,
    demo_url TEXT,
    demo_id UUID REFERENCES public.demos(id) ON DELETE SET NULL,
    is_demo_registered BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for fast searching
CREATE INDEX idx_software_catalog_name ON public.software_catalog USING gin(to_tsvector('english', name));
CREATE INDEX idx_software_catalog_type ON public.software_catalog(type);
CREATE INDEX idx_software_catalog_category ON public.software_catalog(category);

-- Enable RLS
ALTER TABLE public.software_catalog ENABLE ROW LEVEL SECURITY;

-- Policies - Demo Manager and Master Admin can manage
CREATE POLICY "Demo managers can manage software catalog"
ON public.software_catalog
FOR ALL
TO authenticated
USING (
    public.has_role(auth.uid(), 'demo_manager') OR 
    public.has_role(auth.uid(), 'master') OR
    public.has_role(auth.uid(), 'super_admin')
)
WITH CHECK (
    public.has_role(auth.uid(), 'demo_manager') OR 
    public.has_role(auth.uid(), 'master') OR
    public.has_role(auth.uid(), 'super_admin')
);

-- Anyone authenticated can read for suggestions/autocomplete
CREATE POLICY "Authenticated users can view software catalog"
ON public.software_catalog
FOR SELECT
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_software_catalog_updated_at
BEFORE UPDATE ON public.software_catalog
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();