-- Allow public (unauthenticated) users to view active demos
CREATE POLICY "Public can view active demos" 
ON public.demos 
FOR SELECT 
TO anon
USING (status = 'active');