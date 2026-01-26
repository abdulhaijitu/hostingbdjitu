-- Add RLS policy for login_attempts table
-- Only service role can access this table (via edge functions)
-- This is intentional - no client-side access for security

CREATE POLICY "Service role only access"
ON public.login_attempts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);