-- Create storage bucket for ticket attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ticket-attachments', 
  'ticket-attachments', 
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
);

-- RLS policies for ticket attachments bucket
-- Users can upload files to their own folder
CREATE POLICY "Users can upload ticket attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ticket-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own attachments
CREATE POLICY "Users can view their own attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ticket-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ticket-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can view all attachments
CREATE POLICY "Admins can view all ticket attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ticket-attachments' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can delete any attachment
CREATE POLICY "Admins can delete any ticket attachment"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ticket-attachments' 
  AND public.has_role(auth.uid(), 'admin')
);