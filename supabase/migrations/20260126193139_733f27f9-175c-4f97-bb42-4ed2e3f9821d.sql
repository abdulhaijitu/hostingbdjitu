-- Fix the admin_agents view to use security_invoker
DROP VIEW IF EXISTS public.admin_agents;

CREATE OR REPLACE VIEW public.admin_agents
WITH (security_invoker = on) AS
SELECT 
  p.user_id,
  p.full_name,
  p.email,
  ur.role
FROM public.profiles p
INNER JOIN public.user_roles ur ON ur.user_id = p.user_id
WHERE ur.role = 'admin';