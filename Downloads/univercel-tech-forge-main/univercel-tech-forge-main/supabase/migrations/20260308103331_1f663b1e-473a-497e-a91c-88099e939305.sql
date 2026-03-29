-- Allow authenticated users to update job applications (for boss approve/reject/hold)
CREATE POLICY "Authenticated users can update job applications"
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
