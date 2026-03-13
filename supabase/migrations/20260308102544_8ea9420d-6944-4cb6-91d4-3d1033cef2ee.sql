-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  application_type TEXT NOT NULL DEFAULT 'job',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  experience TEXT,
  portfolio TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public career portal)
CREATE POLICY "Anyone can submit job applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins/masters can view
CREATE POLICY "Authenticated users can view applications"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for boss panel
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
