-- ════════════════════════════════════════════════════════════════
-- TABLE: contact_messages
-- Purpose: General contact form submissions (not support tickets)
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public can submit, only admins can read
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all contact messages"
  ON public.contact_messages
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- ════════════════════════════════════════════════════════════════
-- TABLE: cms_activity_logs
-- Purpose: Track CMS content changes by admins
-- ════════════════════════════════════════════════════════════════
CREATE TABLE public.cms_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.cms_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only admins can read/write
CREATE POLICY "Admins can view activity logs"
  ON public.cms_activity_logs
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert activity logs"
  ON public.cms_activity_logs
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));