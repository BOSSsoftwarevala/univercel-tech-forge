
-- Allow anonymous/public users to view active demos (fixes "No demos found" for unauthenticated visitors)
CREATE POLICY "public_view_active_demos" ON demos
FOR SELECT TO anon
USING (status = 'active');
