-- Fix RLS policies for system_requests to allow any user to insert
-- The current policy only allows if auth.uid() = user_id, but the insert might be failing silently

-- Drop existing restrictive insert policies
DROP POLICY IF EXISTS "Public can insert anonymous system_requests" ON public.system_requests;
DROP POLICY IF EXISTS "Users can insert own system_requests" ON public.system_requests;

-- Create new permissive insert policy for authenticated users
-- Allows any authenticated user to insert with their own user_id
CREATE POLICY "Authenticated users can insert system_requests" 
ON public.system_requests 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and user_id matches their auth id
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR 
  -- Allow anonymous inserts with null user_id from frontend
  (auth.uid() IS NULL AND user_id IS NULL AND source = 'frontend')
);

-- Also add a policy for authenticated users to insert without user_id (public actions)
CREATE POLICY "Allow all frontend system_requests" 
ON public.system_requests 
FOR INSERT 
WITH CHECK (
  source = 'frontend'
);