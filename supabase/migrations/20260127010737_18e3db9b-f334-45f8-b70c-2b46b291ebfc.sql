-- Create audit_logs table for tracking all critical actions
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role text NOT NULL DEFAULT 'system',
  action_type text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for common queries
CREATE INDEX idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action_type ON public.audit_logs(action_type);
CREATE INDEX idx_audit_logs_target_type ON public.audit_logs(target_type);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (read-only)
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- No UPDATE or DELETE policies - append only
-- System inserts via service role

-- Create error_logs table for tracking frontend and backend errors
CREATE TABLE public.error_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_code text NOT NULL,
  message text NOT NULL,
  stack_trace text,
  context jsonb DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  url text,
  source text NOT NULL DEFAULT 'frontend',
  severity text NOT NULL DEFAULT 'error',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_error_logs_error_code ON public.error_logs(error_code);
CREATE INDEX idx_error_logs_source ON public.error_logs(source);
CREATE INDEX idx_error_logs_created_at ON public.error_logs(created_at DESC);
CREATE INDEX idx_error_logs_user_id ON public.error_logs(user_id);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view error logs
CREATE POLICY "Admins can view error logs"
ON public.error_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create function to log audit events (called from edge functions)
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_actor_id uuid,
  p_actor_role text,
  p_action_type text,
  p_target_type text DEFAULT NULL,
  p_target_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}',
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.audit_logs (
    actor_id,
    actor_role,
    action_type,
    target_type,
    target_id,
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    p_actor_id,
    COALESCE(p_actor_role, 'system'),
    p_action_type,
    p_target_type,
    p_target_id,
    COALESCE(p_metadata, '{}'),
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Create function to log errors
CREATE OR REPLACE FUNCTION public.log_error(
  p_error_code text,
  p_message text,
  p_stack_trace text DEFAULT NULL,
  p_context jsonb DEFAULT '{}',
  p_user_id uuid DEFAULT NULL,
  p_session_id text DEFAULT NULL,
  p_url text DEFAULT NULL,
  p_source text DEFAULT 'frontend',
  p_severity text DEFAULT 'error'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.error_logs (
    error_code,
    message,
    stack_trace,
    context,
    user_id,
    session_id,
    url,
    source,
    severity
  ) VALUES (
    p_error_code,
    p_message,
    p_stack_trace,
    COALESCE(p_context, '{}'),
    p_user_id,
    p_session_id,
    p_url,
    COALESCE(p_source, 'frontend'),
    COALESCE(p_severity, 'error')
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;