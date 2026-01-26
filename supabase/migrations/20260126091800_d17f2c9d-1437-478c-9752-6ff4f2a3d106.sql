-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('customer', 'admin');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing_cycles enum
CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'yearly', 'lifetime');

-- Create order_status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'refunded');

-- Create payment_status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'refunded');

-- Create hosting_plans table
CREATE TABLE public.hosting_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_bn TEXT,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  description_bn TEXT,
  category TEXT NOT NULL, -- web, premium, wordpress, reseller, vps, dedicated
  monthly_price DECIMAL(10,2) NOT NULL,
  yearly_price DECIMAL(10,2) NOT NULL,
  storage TEXT,
  bandwidth TEXT,
  websites TEXT,
  email_accounts TEXT,
  databases TEXT,
  features JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create domain_pricing table
CREATE TABLE public.domain_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extension TEXT NOT NULL UNIQUE,
  registration_price DECIMAL(10,2) NOT NULL,
  renewal_price DECIMAL(10,2) NOT NULL,
  transfer_price DECIMAL(10,2) NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  order_type TEXT NOT NULL, -- hosting, domain, renewal
  item_name TEXT NOT NULL,
  item_details JSONB,
  billing_cycle billing_cycle NOT NULL DEFAULT 'yearly',
  amount DECIMAL(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  domain_name TEXT,
  hosting_plan_id UUID REFERENCES public.hosting_plans(id),
  start_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id TEXT UNIQUE,
  invoice_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  fee DECIMAL(10,2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BDT',
  payment_method TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  metadata JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid, paid, cancelled
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook_logs table for UddoktaPay webhooks
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'uddoktapay',
  event_type TEXT,
  invoice_id TEXT,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'received', -- received, processed, failed
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domain_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for hosting_plans (public read, admin write)
CREATE POLICY "Anyone can view active hosting plans"
  ON public.hosting_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all hosting plans"
  ON public.hosting_plans FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage hosting plans"
  ON public.hosting_plans FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for domain_pricing (public read, admin write)
CREATE POLICY "Anyone can view active domain pricing"
  ON public.domain_pricing FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all domain pricing"
  ON public.domain_pricing FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage domain pricing"
  ON public.domain_pricing FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all orders"
  ON public.orders FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON public.payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all invoices"
  ON public.invoices FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all invoices"
  ON public.invoices FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for webhook_logs (admin only)
CREATE POLICY "Admins can view webhook logs"
  ON public.webhook_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage webhook logs"
  ON public.webhook_logs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Assign default customer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hosting_plans_updated_at
  BEFORE UPDATE ON public.hosting_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_domain_pricing_updated_at
  BEFORE UPDATE ON public.domain_pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate order number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.orders;
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

-- Generate invoice number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM public.invoices;
  new_number := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

-- Enable realtime for orders and payments
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;