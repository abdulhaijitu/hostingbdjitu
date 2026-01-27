-- Create storage bucket for invoices
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('invoices', 'invoices', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for admin reports
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('admin-reports', 'admin-reports', false, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for invoices bucket
CREATE POLICY "Users can view their own invoices"
ON storage.objects FOR SELECT
USING (bucket_id = 'invoices' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all invoices"
ON storage.objects FOR SELECT
USING (bucket_id = 'invoices' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "System can upload invoices"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'invoices');

-- RLS policies for admin-reports bucket
CREATE POLICY "Admins can view all reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'admin-reports' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "System can upload reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'admin-reports');

-- Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  resend_id TEXT,
  related_id TEXT,
  related_type TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_logs
CREATE POLICY "Admins can view all email logs"
ON public.email_logs FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own email logs"
ON public.email_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert email logs"
ON public.email_logs FOR INSERT
WITH CHECK (true);

-- Create scheduled_jobs table for cron tracking
CREATE TABLE IF NOT EXISTS public.scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on scheduled_jobs
ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policy for scheduled_jobs
CREATE POLICY "Admins can view scheduled jobs"
ON public.scheduled_jobs FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage scheduled jobs"
ON public.scheduled_jobs FOR ALL
USING (true)
WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_job_type ON public.scheduled_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_scheduled_jobs_status ON public.scheduled_jobs(status);