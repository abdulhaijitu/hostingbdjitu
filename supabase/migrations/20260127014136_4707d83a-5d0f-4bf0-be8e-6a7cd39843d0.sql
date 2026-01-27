-- Fix overly permissive RLS policies

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "System can insert email logs" ON public.email_logs;
DROP POLICY IF EXISTS "System can manage scheduled jobs" ON public.scheduled_jobs;

-- The storage insert policies need to stay permissive for service role
-- but we need to add proper insert policy for email_logs and scheduled_jobs
-- These tables will be managed by edge functions using service role key