-- ════════════════════════════════════════════════════════════════
-- CMS Role System (Separate from main app roles)
-- ════════════════════════════════════════════════════════════════

-- Create CMS role enum
CREATE TYPE public.cms_role AS ENUM ('super_admin', 'editor', 'viewer');

-- TABLE: cms_admin_roles
-- Purpose: CMS-specific roles for admin users
CREATE TABLE public.cms_admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role cms_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.cms_admin_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Super admins can manage CMS roles"
  ON public.cms_admin_roles
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_admin_roles car 
      WHERE car.user_id = auth.uid() AND car.role = 'super_admin'
    )
  );

CREATE POLICY "Users can view their own CMS role"
  ON public.cms_admin_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check CMS role
CREATE OR REPLACE FUNCTION public.get_cms_role(_user_id uuid)
RETURNS cms_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.cms_admin_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Check if user has specific CMS role or higher
CREATE OR REPLACE FUNCTION public.has_cms_permission(_user_id uuid, _required_role cms_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role cms_role;
BEGIN
  SELECT role INTO v_role FROM public.cms_admin_roles WHERE user_id = _user_id;
  
  IF v_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- super_admin has all permissions
  IF v_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;
  
  -- editor can do editor and viewer tasks
  IF v_role = 'editor' AND _required_role IN ('editor', 'viewer') THEN
    RETURN TRUE;
  END IF;
  
  -- viewer can only do viewer tasks
  IF v_role = 'viewer' AND _required_role = 'viewer' THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_cms_admin_roles_updated_at
  BEFORE UPDATE ON public.cms_admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();