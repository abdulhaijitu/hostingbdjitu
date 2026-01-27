-- =====================================================
-- DOMAIN AUTOMATION SYSTEM - COMPLETE SCHEMA
-- =====================================================

-- Domain status enum for lifecycle management
CREATE TYPE public.domain_status AS ENUM (
  'pending_registration',
  'active',
  'pending_renewal',
  'expired',
  'grace_period',
  'redemption',
  'cancelled',
  'transfer_in',
  'transfer_out'
);

-- Main domains table for lifecycle tracking
CREATE TABLE public.domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  domain_name TEXT NOT NULL,
  extension TEXT NOT NULL,
  status domain_status NOT NULL DEFAULT 'pending_registration',
  
  -- Registration details
  registration_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  last_renewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Auto-renew settings
  auto_renew BOOLEAN DEFAULT true,
  auto_renew_failed_at TIMESTAMP WITH TIME ZONE,
  auto_renew_failure_reason TEXT,
  
  -- Nameservers (JSON array)
  nameservers JSONB DEFAULT '["ns1.chost.com.bd", "ns2.chost.com.bd"]'::jsonb,
  nameserver_status TEXT DEFAULT 'active', -- active, pending, propagating
  
  -- DNS settings
  dns_records JSONB DEFAULT '[]'::jsonb,
  
  -- Registrar info
  registrar_domain_id TEXT,
  registrar_name TEXT DEFAULT 'CHost Domains',
  auth_code TEXT,
  
  -- Grace period tracking
  grace_period_ends_at TIMESTAMP WITH TIME ZONE,
  redemption_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Sync tracking
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending', -- pending, synced, failed
  sync_error TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_domain_name UNIQUE (domain_name)
);

-- Domain provisioning queue
CREATE TABLE public.domain_provisioning_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID REFERENCES public.domains(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  action TEXT NOT NULL, -- register, renew, transfer_in, update_nameservers, cancel
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  priority INTEGER DEFAULT 5, -- 1-10, lower = higher priority
  
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  
  request_data JSONB DEFAULT '{}'::jsonb,
  response_data JSONB,
  error_message TEXT,
  
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Domain renewal history
CREATE TABLE public.domain_renewals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  renewal_type TEXT NOT NULL, -- manual, auto
  renewal_period INTEGER DEFAULT 1, -- years
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BDT',
  
  previous_expiry_date TIMESTAMP WITH TIME ZONE,
  new_expiry_date TIMESTAMP WITH TIME ZONE,
  
  payment_id UUID REFERENCES public.payments(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  
  failure_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Domain sync logs
CREATE TABLE public.domain_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID REFERENCES public.domains(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- status_check, full_sync, nameserver_sync
  
  status TEXT NOT NULL, -- success, failed, mismatch_detected
  
  local_data JSONB,
  registrar_data JSONB,
  
  mismatches JSONB,
  
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Domain expiry notifications tracking
CREATE TABLE public.domain_expiry_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain_id UUID NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  notification_type TEXT NOT NULL, -- 30_day, 15_day, 7_day, 1_day, expired
  days_before_expiry INTEGER,
  
  sent_at TIMESTAMP WITH TIME ZONE,
  email_log_id UUID REFERENCES public.email_logs(id),
  
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_notification_per_domain UNIQUE (domain_id, notification_type)
);

-- Enable RLS on all tables
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_provisioning_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_renewals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_expiry_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for domains
CREATE POLICY "Users can view their own domains"
  ON public.domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all domains"
  ON public.domains FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all domains"
  ON public.domains FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own domains (limited)"
  ON public.domains FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for provisioning queue (admin only)
CREATE POLICY "Admins can manage provisioning queue"
  ON public.domain_provisioning_queue FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for renewals
CREATE POLICY "Users can view their own renewals"
  ON public.domain_renewals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all renewals"
  ON public.domain_renewals FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for sync logs (admin only)
CREATE POLICY "Admins can view sync logs"
  ON public.domain_sync_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for expiry notifications
CREATE POLICY "Users can view their own notifications"
  ON public.domain_expiry_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications"
  ON public.domain_expiry_notifications FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes for performance
CREATE INDEX idx_domains_user_id ON public.domains(user_id);
CREATE INDEX idx_domains_status ON public.domains(status);
CREATE INDEX idx_domains_expiry_date ON public.domains(expiry_date);
CREATE INDEX idx_domains_domain_name ON public.domains(domain_name);
CREATE INDEX idx_domain_queue_status ON public.domain_provisioning_queue(status);
CREATE INDEX idx_domain_queue_next_retry ON public.domain_provisioning_queue(next_retry_at);
CREATE INDEX idx_domain_renewals_domain ON public.domain_renewals(domain_id);
CREATE INDEX idx_domain_sync_logs_domain ON public.domain_sync_logs(domain_id);

-- Updated at trigger for domains
CREATE TRIGGER update_domains_updated_at
  BEFORE UPDATE ON public.domains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domain_queue_updated_at
  BEFORE UPDATE ON public.domain_provisioning_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check domains expiring soon
CREATE OR REPLACE FUNCTION public.get_domains_expiring_soon(days_threshold INTEGER DEFAULT 30)
RETURNS TABLE (
  domain_id UUID,
  domain_name TEXT,
  user_id UUID,
  expiry_date TIMESTAMP WITH TIME ZONE,
  days_until_expiry INTEGER,
  auto_renew BOOLEAN,
  status domain_status
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    d.id as domain_id,
    d.domain_name,
    d.user_id,
    d.expiry_date,
    EXTRACT(DAY FROM d.expiry_date - now())::INTEGER as days_until_expiry,
    d.auto_renew,
    d.status
  FROM public.domains d
  WHERE d.status IN ('active', 'pending_renewal')
    AND d.expiry_date IS NOT NULL
    AND d.expiry_date <= now() + (days_threshold || ' days')::INTERVAL
    AND d.expiry_date > now()
  ORDER BY d.expiry_date ASC;
$$;

-- Function to transition domain status based on expiry
CREATE OR REPLACE FUNCTION public.update_domain_expiry_status()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count INTEGER := 0;
BEGIN
  -- Move active domains to expired if past expiry date
  UPDATE public.domains
  SET 
    status = 'expired',
    updated_at = now()
  WHERE status = 'active'
    AND expiry_date IS NOT NULL
    AND expiry_date < now();
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Move expired domains to grace_period after 1 day
  UPDATE public.domains
  SET 
    status = 'grace_period',
    grace_period_ends_at = expiry_date + INTERVAL '30 days',
    updated_at = now()
  WHERE status = 'expired'
    AND expiry_date IS NOT NULL
    AND expiry_date < now() - INTERVAL '1 day'
    AND grace_period_ends_at IS NULL;
  
  -- Move grace_period to redemption after grace ends
  UPDATE public.domains
  SET 
    status = 'redemption',
    redemption_ends_at = grace_period_ends_at + INTERVAL '30 days',
    updated_at = now()
  WHERE status = 'grace_period'
    AND grace_period_ends_at IS NOT NULL
    AND grace_period_ends_at < now();
  
  -- Move redemption to cancelled after redemption ends
  UPDATE public.domains
  SET 
    status = 'cancelled',
    updated_at = now()
  WHERE status = 'redemption'
    AND redemption_ends_at IS NOT NULL
    AND redemption_ends_at < now();
  
  RETURN updated_count;
END;
$$;