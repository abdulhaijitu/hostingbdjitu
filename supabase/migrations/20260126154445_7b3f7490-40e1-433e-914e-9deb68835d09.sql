-- Server Registry Table
CREATE TABLE public.hosting_servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  server_type TEXT NOT NULL CHECK (server_type IN ('shared', 'vps', 'dedicated')),
  hostname TEXT NOT NULL,
  ip_address TEXT,
  api_type TEXT NOT NULL CHECK (api_type IN ('whm', 'cpanel')),
  is_active BOOLEAN DEFAULT true,
  max_accounts INTEGER DEFAULT 500,
  current_accounts INTEGER DEFAULT 0,
  location TEXT DEFAULT 'Singapore',
  nameservers JSONB DEFAULT '["ns1.chost.com.bd", "ns2.chost.com.bd"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hosting Accounts Table (Links orders to actual cPanel accounts)
CREATE TABLE public.hosting_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES hosting_servers(id) ON DELETE RESTRICT,
  cpanel_username TEXT NOT NULL,
  domain TEXT NOT NULL,
  whm_package TEXT,
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated', 'provisioning_failed')),
  disk_used_mb BIGINT DEFAULT 0,
  disk_limit_mb BIGINT DEFAULT 10240,
  bandwidth_used_mb BIGINT DEFAULT 0,
  bandwidth_limit_mb BIGINT DEFAULT 102400,
  email_accounts_used INTEGER DEFAULT 0,
  email_accounts_limit INTEGER DEFAULT 10,
  databases_used INTEGER DEFAULT 0,
  databases_limit INTEGER DEFAULT 5,
  php_version TEXT DEFAULT '8.2',
  ssl_status TEXT DEFAULT 'none' CHECK (ssl_status IN ('none', 'pending', 'active', 'expired')),
  last_synced_at TIMESTAMPTZ,
  provisioned_at TIMESTAMPTZ,
  suspended_at TIMESTAMPTZ,
  suspension_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(server_id, cpanel_username)
);

-- Provisioning Queue Table (For async account creation)
CREATE TABLE public.provisioning_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  server_id UUID REFERENCES hosting_servers(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retry')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- WHM Package Mappings (Maps CHost plans to WHM packages)
CREATE TABLE public.whm_package_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hosting_plan_id UUID NOT NULL REFERENCES hosting_plans(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES hosting_servers(id) ON DELETE CASCADE,
  whm_package_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(hosting_plan_id, server_id)
);

-- API Activity Logs (For auditing WHM/cPanel API calls)
CREATE TABLE public.api_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  server_id UUID REFERENCES hosting_servers(id),
  action TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_data JSONB,
  response_status INTEGER,
  response_data JSONB,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hosting_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provisioning_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whm_package_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hosting_servers (Admin only)
CREATE POLICY "Admins can manage servers" ON public.hosting_servers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for hosting_accounts
CREATE POLICY "Users can view their own accounts" ON public.hosting_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all accounts" ON public.hosting_accounts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for provisioning_queue (Admin only)
CREATE POLICY "Admins can manage provisioning queue" ON public.provisioning_queue
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for whm_package_mappings (Admin only)
CREATE POLICY "Admins can manage package mappings" ON public.whm_package_mappings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for api_activity_logs
CREATE POLICY "Admins can view all logs" ON public.api_activity_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own logs" ON public.api_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_hosting_servers_updated_at
  BEFORE UPDATE ON public.hosting_servers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hosting_accounts_updated_at
  BEFORE UPDATE ON public.hosting_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provisioning_queue_updated_at
  BEFORE UPDATE ON public.provisioning_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whm_package_mappings_updated_at
  BEFORE UPDATE ON public.whm_package_mappings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate cPanel username
CREATE OR REPLACE FUNCTION public.generate_cpanel_username(domain_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_name TEXT;
  final_name TEXT;
  counter INTEGER := 0;
BEGIN
  -- Extract first part of domain and clean it
  base_name := regexp_replace(split_part(domain_name, '.', 1), '[^a-zA-Z0-9]', '', 'g');
  base_name := lower(substring(base_name, 1, 8));
  
  -- Ensure minimum length
  IF length(base_name) < 3 THEN
    base_name := base_name || 'user';
  END IF;
  
  final_name := base_name;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM hosting_accounts WHERE cpanel_username = final_name) LOOP
    counter := counter + 1;
    final_name := base_name || counter::text;
  END LOOP;
  
  RETURN final_name;
END;
$$;