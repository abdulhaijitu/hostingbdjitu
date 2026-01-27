-- ════════════════════════════════════════════════════════════════════════════
-- SECURITY HARDENING: Session Tracking & Security Logs
-- ════════════════════════════════════════════════════════════════════════════

-- Create user_sessions table for tracking active sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_info TEXT,
  ip_address TEXT,
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID
);

-- Create security_events table for monitoring
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_action_logs table for high-risk action tracking
CREATE TABLE public.admin_action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  requires_reauth BOOLEAN DEFAULT false,
  reauth_verified BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  cooldown_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rate_limit_rules table for configurable rate limits
CREATE TABLE public.rate_limit_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL UNIQUE,
  endpoint_pattern TEXT NOT NULL,
  max_requests INTEGER NOT NULL DEFAULT 100,
  window_seconds INTEGER NOT NULL DEFAULT 60,
  lockout_seconds INTEGER NOT NULL DEFAULT 300,
  applies_to TEXT NOT NULL DEFAULT 'all', -- 'all', 'authenticated', 'admin', 'anonymous'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limit_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
ON public.user_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can revoke their own sessions"
ON public.user_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all sessions"
ON public.user_sessions FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for security_events
CREATE POLICY "Admins can manage security events"
ON public.security_events FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for admin_action_logs
CREATE POLICY "Admins can view all action logs"
ON public.admin_action_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert action logs"
ON public.admin_action_logs FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for rate_limit_rules
CREATE POLICY "Admins can manage rate limit rules"
ON public.rate_limit_rules FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_is_active ON public.user_sessions(is_active);
CREATE INDEX idx_user_sessions_expires_at ON public.user_sessions(expires_at);
CREATE INDEX idx_security_events_event_type ON public.security_events(event_type);
CREATE INDEX idx_security_events_severity ON public.security_events(severity);
CREATE INDEX idx_security_events_created_at ON public.security_events(created_at DESC);
CREATE INDEX idx_security_events_user_id ON public.security_events(user_id);
CREATE INDEX idx_admin_action_logs_admin_user_id ON public.admin_action_logs(admin_user_id);
CREATE INDEX idx_admin_action_logs_action_type ON public.admin_action_logs(action_type);
CREATE INDEX idx_admin_action_logs_created_at ON public.admin_action_logs(created_at DESC);

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_severity TEXT DEFAULT 'info',
  p_user_id UUID DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    event_type,
    severity,
    user_id,
    ip_address,
    user_agent,
    details
  ) VALUES (
    p_event_type,
    COALESCE(p_severity, 'info'),
    p_user_id,
    p_ip_address,
    p_user_agent,
    COALESCE(p_details, '{}')
  )
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$;

-- Function to check admin action cooldown
CREATE OR REPLACE FUNCTION public.check_admin_action_cooldown(
  p_admin_user_id UUID,
  p_action_type TEXT,
  p_cooldown_seconds INTEGER DEFAULT 60
)
RETURNS TABLE (
  is_in_cooldown BOOLEAN,
  cooldown_remaining_seconds INTEGER,
  last_action_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_action admin_action_logs%ROWTYPE;
  v_cooldown_end TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the most recent action of this type by this admin
  SELECT * INTO v_last_action
  FROM admin_action_logs
  WHERE admin_user_id = p_admin_user_id
    AND action_type = p_action_type
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_last_action IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, NULL::TIMESTAMP WITH TIME ZONE;
    RETURN;
  END IF;
  
  v_cooldown_end := v_last_action.created_at + (p_cooldown_seconds || ' seconds')::INTERVAL;
  
  IF now() < v_cooldown_end THEN
    RETURN QUERY SELECT 
      TRUE,
      EXTRACT(EPOCH FROM (v_cooldown_end - now()))::INTEGER,
      v_last_action.created_at;
  ELSE
    RETURN QUERY SELECT FALSE, 0, v_last_action.created_at;
  END IF;
END;
$$;

-- Function to record admin action
CREATE OR REPLACE FUNCTION public.record_admin_action(
  p_admin_user_id UUID,
  p_action_type TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_requires_reauth BOOLEAN DEFAULT FALSE,
  p_reauth_verified BOOLEAN DEFAULT FALSE,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action_id UUID;
BEGIN
  INSERT INTO public.admin_action_logs (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    requires_reauth,
    reauth_verified,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_admin_user_id,
    p_action_type,
    p_target_type,
    p_target_id,
    COALESCE(p_requires_reauth, FALSE),
    COALESCE(p_reauth_verified, FALSE),
    p_ip_address,
    p_user_agent,
    COALESCE(p_metadata, '{}')
  )
  RETURNING id INTO v_action_id;
  
  -- Also log as security event if high-risk action
  IF p_action_type IN ('refund_approval', 'hosting_termination', 'role_change', 'settings_update', 'user_deletion') THEN
    PERFORM log_security_event(
      'admin_high_risk_action',
      'warn',
      p_admin_user_id,
      p_ip_address,
      p_user_agent,
      jsonb_build_object('action_type', p_action_type, 'target_type', p_target_type, 'target_id', p_target_id)
    );
  END IF;
  
  RETURN v_action_id;
END;
$$;

-- Insert default rate limit rules
INSERT INTO public.rate_limit_rules (rule_name, endpoint_pattern, max_requests, window_seconds, lockout_seconds, applies_to) VALUES
('login', '/auth/login', 5, 900, 900, 'all'),
('password_reset', '/auth/reset-password', 3, 3600, 3600, 'all'),
('admin_refund', '/admin/refund', 10, 3600, 300, 'admin'),
('admin_suspend', '/admin/suspend', 20, 3600, 300, 'admin'),
('admin_terminate', '/admin/terminate', 5, 3600, 600, 'admin'),
('api_public', '/api/*', 100, 60, 300, 'all'),
('webhook', '/webhook/*', 500, 60, 60, 'all')
ON CONFLICT (rule_name) DO NOTHING;

-- Trigger to auto-expire sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE user_sessions
  SET is_active = FALSE, revoked_at = now()
  WHERE is_active = TRUE AND expires_at < now();
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;