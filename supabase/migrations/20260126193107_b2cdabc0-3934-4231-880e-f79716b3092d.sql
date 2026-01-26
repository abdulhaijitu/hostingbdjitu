-- Create canned_responses table for admin templates
CREATE TABLE public.canned_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  content TEXT NOT NULL,
  content_bn TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  shortcut TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.canned_responses ENABLE ROW LEVEL SECURITY;

-- Only admins can manage canned responses
CREATE POLICY "Admins can manage canned responses" 
ON public.canned_responses 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_canned_responses_updated_at
BEFORE UPDATE ON public.canned_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default canned responses
INSERT INTO public.canned_responses (title, title_bn, content, content_bn, category, shortcut, sort_order) VALUES
('Greeting', 'অভিবাদন', 'Hello! Thank you for contacting CHost support. How can I assist you today?', 'হ্যালো! CHost সাপোর্টে যোগাযোগের জন্য ধন্যবাদ। আমি কীভাবে আপনাকে সাহায্য করতে পারি?', 'greeting', '/hello', 1),
('Closing - Resolved', 'সমাধান হয়েছে', 'I''m glad we could resolve your issue. Is there anything else I can help you with?', 'আপনার সমস্যা সমাধান করতে পেরে খুশি। আর কিছু সাহায্য করতে পারি?', 'closing', '/resolved', 2),
('Closing - Follow Up', 'ফলো আপ', 'Please don''t hesitate to reach out if you have any more questions. We''re here to help!', 'আরও কোনো প্রশ্ন থাকলে জানাবেন। আমরা সাহায্য করতে এখানে আছি!', 'closing', '/followup', 3),
('Request Details', 'বিস্তারিত চাই', 'To better assist you, could you please provide more details about your issue?', 'আপনাকে আরও ভালোভাবে সাহায্য করতে, আপনার সমস্যা সম্পর্কে আরও বিস্তারিত জানাবেন?', 'info', '/details', 4),
('Password Reset', 'পাসওয়ার্ড রিসেট', 'To reset your password, please go to the login page and click "Forgot Password". You''ll receive an email with reset instructions.', 'পাসওয়ার্ড রিসেট করতে, লগইন পেজে গিয়ে "পাসওয়ার্ড ভুলে গেছেন" এ ক্লিক করুন। রিসেট নির্দেশনা সহ একটি ইমেইল পাবেন।', 'technical', '/password', 5),
('DNS Update', 'DNS আপডেট', 'DNS changes can take 24-48 hours to propagate worldwide. Please wait and check again later.', 'DNS পরিবর্তন বিশ্বব্যাপী ছড়িয়ে পড়তে ২৪-৪৮ ঘণ্টা সময় নিতে পারে। অনুগ্রহ করে অপেক্ষা করুন।', 'technical', '/dns', 6),
('SSL Installation', 'SSL ইন্সটল', 'Free SSL certificates are automatically installed within 24 hours. If you need immediate SSL, please let us know.', 'ফ্রি SSL সার্টিফিকেট ২৪ ঘণ্টার মধ্যে স্বয়ংক্রিয়ভাবে ইন্সটল হয়। দ্রুত SSL প্রয়োজন হলে জানাবেন।', 'technical', '/ssl', 7),
('Billing Inquiry', 'বিলিং জিজ্ঞাসা', 'I''ll look into your billing inquiry right away. Can you please confirm your registered email or order number?', 'আপনার বিলিং জিজ্ঞাসা এখনই দেখছি। আপনার রেজিস্টার্ড ইমেইল বা অর্ডার নম্বর কনফার্ম করবেন?', 'billing', '/billing', 8),
('Refund Request', 'রিফান্ড অনুরোধ', 'I''ve forwarded your refund request to our billing team. You''ll receive an update within 24-48 hours.', 'আপনার রিফান্ড অনুরোধ বিলিং টিমে পাঠিয়েছি। ২৪-৪৮ ঘণ্টার মধ্যে আপডেট পাবেন।', 'billing', '/refund', 9),
('Wait Time', 'অপেক্ষা করুন', 'Thank you for your patience. I''m checking this for you and will update shortly.', 'ধৈর্য ধারণের জন্য ধন্যবাদ। এটি দেখছি এবং শীঘ্রই আপডেট দেব।', 'general', '/wait', 10);

-- Create admin_agents view for agent assignment
CREATE OR REPLACE VIEW public.admin_agents AS
SELECT 
  p.user_id,
  p.full_name,
  p.email,
  ur.role
FROM public.profiles p
INNER JOIN public.user_roles ur ON ur.user_id = p.user_id
WHERE ur.role = 'admin';