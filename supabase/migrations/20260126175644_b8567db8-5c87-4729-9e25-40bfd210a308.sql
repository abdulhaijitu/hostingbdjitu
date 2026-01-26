-- Create login_attempts table to track failed login attempts
CREATE TABLE public.login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email or IP address
  attempt_type TEXT NOT NULL DEFAULT 'email', -- 'email' or 'ip'
  attempts_count INTEGER NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX idx_login_attempts_identifier ON public.login_attempts(identifier);
CREATE INDEX idx_login_attempts_locked_until ON public.login_attempts(locked_until);

-- Enable RLS
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage this table (edge functions)
-- No client-side access allowed for security

-- Create function to check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_lockout_minutes INTEGER DEFAULT 15,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS TABLE (
  is_locked BOOLEAN,
  attempts_remaining INTEGER,
  locked_until TIMESTAMP WITH TIME ZONE,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record login_attempts%ROWTYPE;
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_is_locked BOOLEAN := FALSE;
  v_attempts_remaining INTEGER;
  v_locked_until TIMESTAMP WITH TIME ZONE := NULL;
  v_message TEXT := 'OK';
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get existing record
  SELECT * INTO v_record
  FROM login_attempts
  WHERE identifier = p_identifier
  LIMIT 1;
  
  -- Check if currently locked
  IF v_record.locked_until IS NOT NULL AND v_record.locked_until > now() THEN
    v_is_locked := TRUE;
    v_attempts_remaining := 0;
    v_locked_until := v_record.locked_until;
    v_message := 'Account temporarily locked due to too many failed attempts';
  ELSIF v_record.id IS NOT NULL THEN
    -- Check if attempts are within window
    IF v_record.first_attempt_at > v_window_start THEN
      v_attempts_remaining := GREATEST(0, p_max_attempts - v_record.attempts_count);
      
      IF v_record.attempts_count >= p_max_attempts THEN
        v_is_locked := TRUE;
        v_attempts_remaining := 0;
        v_locked_until := v_record.last_attempt_at + (p_lockout_minutes || ' minutes')::INTERVAL;
        v_message := 'Too many failed attempts. Please try again later';
      END IF;
    ELSE
      -- Window expired, reset
      v_attempts_remaining := p_max_attempts;
    END IF;
  ELSE
    v_attempts_remaining := p_max_attempts;
  END IF;
  
  RETURN QUERY SELECT v_is_locked, v_attempts_remaining, v_locked_until, v_message;
END;
$$;

-- Create function to record login attempt
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  p_identifier TEXT,
  p_success BOOLEAN DEFAULT FALSE,
  p_max_attempts INTEGER DEFAULT 5,
  p_lockout_minutes INTEGER DEFAULT 15
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record login_attempts%ROWTYPE;
BEGIN
  IF p_success THEN
    -- On successful login, delete the record
    DELETE FROM login_attempts WHERE identifier = p_identifier;
  ELSE
    -- Get existing record
    SELECT * INTO v_record
    FROM login_attempts
    WHERE identifier = p_identifier
    LIMIT 1;
    
    IF v_record.id IS NULL THEN
      -- First attempt, create record
      INSERT INTO login_attempts (identifier, attempts_count, first_attempt_at, last_attempt_at)
      VALUES (p_identifier, 1, now(), now());
    ELSE
      -- Update existing record
      UPDATE login_attempts
      SET 
        attempts_count = attempts_count + 1,
        last_attempt_at = now(),
        locked_until = CASE 
          WHEN attempts_count + 1 >= p_max_attempts 
          THEN now() + (p_lockout_minutes || ' minutes')::INTERVAL 
          ELSE locked_until 
        END
      WHERE identifier = p_identifier;
    END IF;
  END IF;
END;
$$;

-- Cleanup old records (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_old_login_attempts()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM login_attempts
  WHERE last_attempt_at < now() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;