-- Fix infinite recursion in cms_admin_roles RLS policies
DROP POLICY IF EXISTS "Super admins can manage CMS roles" ON public.cms_admin_roles;
DROP POLICY IF EXISTS "Users can view their own CMS role" ON public.cms_admin_roles;

-- Create a helper function to check if user is CMS super admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_cms_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cms_admin_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
  )
$$;

-- Recreate policies using the function
CREATE POLICY "Users can view their own CMS role" 
ON public.cms_admin_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all CMS roles" 
ON public.cms_admin_roles 
FOR ALL 
USING (public.is_cms_super_admin(auth.uid()));

-- Insert default WHMCS global settings
INSERT INTO public.cms_global_settings (setting_key, setting_value, setting_type, category, description, is_editable) VALUES
-- WHMCS Redirect URLs
('whmcs_base_url', 'https://billing.chost.com.bd', 'text', 'whmcs', 'WHMCS বেস URL', true),
('whmcs_cart_url', 'https://billing.chost.com.bd/cart.php', 'text', 'whmcs', 'WHMCS কার্ট URL', true),
('whmcs_login_url', 'https://billing.chost.com.bd/clientarea.php', 'text', 'whmcs', 'WHMCS ক্লায়েন্ট লগইন URL', true),
('whmcs_register_url', 'https://billing.chost.com.bd/register.php', 'text', 'whmcs', 'WHMCS রেজিস্ট্রেশন URL', true),
('whmcs_knowledgebase_url', 'https://billing.chost.com.bd/knowledgebase', 'text', 'whmcs', 'WHMCS নলেজবেস URL', true),
('whmcs_support_url', 'https://billing.chost.com.bd/submitticket.php', 'text', 'whmcs', 'WHMCS সাপোর্ট টিকেট URL', true),
('whmcs_affiliate_url', 'https://billing.chost.com.bd/affiliates.php', 'text', 'whmcs', 'WHMCS অ্যাফিলিয়েট URL', true),

-- Branding
('site_name', 'CHostBD', 'text', 'branding', 'সাইটের নাম', true),
('site_name_bn', 'সিহোস্ট বিডি', 'text', 'branding', 'সাইটের নাম (বাংলা)', true),
('site_tagline', 'Bangladesh Premium Web Hosting', 'text', 'branding', 'সাইট ট্যাগলাইন', true),
('site_tagline_bn', 'বাংলাদেশের প্রিমিয়াম ওয়েব হোস্টিং', 'text', 'branding', 'সাইট ট্যাগলাইন (বাংলা)', true),
('logo_url', '/chost-logo.png', 'text', 'branding', 'লোগো URL', true),
('favicon_url', '/favicon.ico', 'text', 'branding', 'ফেভিকন URL', true),

-- Contact Info
('contact_email', 'support@chost.com.bd', 'text', 'contact', 'সাপোর্ট ইমেইল', true),
('contact_phone', '+880 1700-000000', 'text', 'contact', 'ফোন নম্বর', true),
('contact_address', 'Dhaka, Bangladesh', 'text', 'contact', 'অফিসের ঠিকানা', true),

-- Footer
('footer_copyright', '© 2025 CHostBD. All rights reserved.', 'text', 'footer', 'কপিরাইট টেক্সট', true),
('footer_copyright_bn', '© ২০২৫ সিহোস্ট বিডি। সর্বস্বত্ব সংরক্ষিত।', 'text', 'footer', 'কপিরাইট টেক্সট (বাংলা)', true)

ON CONFLICT (setting_key) DO NOTHING;

-- Insert sample pricing display data
INSERT INTO public.cms_pricing_display (plan_name, plan_name_bn, category, display_price, display_price_bn, billing_cycle_label, original_price, discount_label, features, features_bn, whmcs_pid, whmcs_redirect_url, is_featured, is_active, sort_order) VALUES
-- Web Hosting
('Starter', 'স্টার্টার', 'web-hosting', '৳99/mo', '৳৯৯/মাস', 'monthly', '৳149', '33% OFF', 
 '["1 Website", "5GB SSD Storage", "Unlimited Bandwidth", "Free SSL", "cPanel Access"]',
 '["১টি ওয়েবসাইট", "৫জিবি SSD স্টোরেজ", "আনলিমিটেড ব্যান্ডউইথ", "ফ্রি SSL", "cPanel অ্যাক্সেস"]',
 '1', 'https://billing.chost.com.bd/cart.php?a=add&pid=1', false, true, 1),
 
('Business', 'বিজনেস', 'web-hosting', '৳199/mo', '৳১৯৯/মাস', 'monthly', '৳299', '33% OFF',
 '["5 Websites", "25GB SSD Storage", "Unlimited Bandwidth", "Free SSL", "cPanel Access", "Daily Backups"]',
 '["৫টি ওয়েবসাইট", "২৫জিবি SSD স্টোরেজ", "আনলিমিটেড ব্যান্ডউইথ", "ফ্রি SSL", "cPanel অ্যাক্সেস", "দৈনিক ব্যাকআপ"]',
 '2', 'https://billing.chost.com.bd/cart.php?a=add&pid=2', true, true, 2),
 
('Professional', 'প্রফেশনাল', 'web-hosting', '৳399/mo', '৳৩৯৯/মাস', 'monthly', '৳599', '33% OFF',
 '["Unlimited Websites", "50GB SSD Storage", "Unlimited Bandwidth", "Free SSL", "cPanel Access", "Daily Backups", "Priority Support"]',
 '["আনলিমিটেড ওয়েবসাইট", "৫০জিবি SSD স্টোরেজ", "আনলিমিটেড ব্যান্ডউইথ", "ফ্রি SSL", "cPanel অ্যাক্সেস", "দৈনিক ব্যাকআপ", "প্রায়োরিটি সাপোর্ট"]',
 '3', 'https://billing.chost.com.bd/cart.php?a=add&pid=3', false, true, 3),

-- WordPress Hosting
('WP Starter', 'ওয়ার্ডপ্রেস স্টার্টার', 'wordpress-hosting', '৳149/mo', '৳১৪৯/মাস', 'monthly', '৳199', '25% OFF',
 '["1 WordPress Site", "10GB SSD", "Auto Updates", "Free SSL", "LiteSpeed Cache"]',
 '["১টি ওয়ার্ডপ্রেস সাইট", "১০জিবি SSD", "অটো আপডেট", "ফ্রি SSL", "LiteSpeed ক্যাশ"]',
 '10', 'https://billing.chost.com.bd/cart.php?a=add&pid=10', false, true, 1),
 
('WP Business', 'ওয়ার্ডপ্রেস বিজনেস', 'wordpress-hosting', '৳299/mo', '৳২৯৯/মাস', 'monthly', '৳399', '25% OFF',
 '["3 WordPress Sites", "30GB SSD", "Auto Updates", "Free SSL", "LiteSpeed Cache", "Staging Environment"]',
 '["৩টি ওয়ার্ডপ্রেস সাইট", "৩০জিবি SSD", "অটো আপডেট", "ফ্রি SSL", "LiteSpeed ক্যাশ", "স্টেজিং এনভায়রনমেন্ট"]',
 '11', 'https://billing.chost.com.bd/cart.php?a=add&pid=11', true, true, 2)

ON CONFLICT DO NOTHING;

-- Insert sample FAQs
INSERT INTO public.cms_faqs (question, question_bn, answer, answer_bn, category, page_slug, is_active, sort_order) VALUES
('What is web hosting?', 'ওয়েব হোস্টিং কি?', 
 'Web hosting is a service that allows you to publish your website on the internet. When you purchase hosting, you rent space on a server where your website files are stored.',
 'ওয়েব হোস্টিং হলো এমন একটি সার্ভিস যা আপনাকে ইন্টারনেটে আপনার ওয়েবসাইট প্রকাশ করতে দেয়। হোস্টিং কেনার সময়, আপনি একটি সার্ভারে স্পেস ভাড়া নেন যেখানে আপনার ওয়েবসাইটের ফাইলগুলো সংরক্ষিত থাকে।',
 'general', 'web-hosting', true, 1),
 
('How do I transfer my domain?', 'কিভাবে আমার ডোমেইন ট্রান্সফার করব?',
 'To transfer your domain, you need to unlock it at your current registrar, obtain the EPP/Auth code, and initiate the transfer from our domain transfer page. The process usually takes 5-7 days.',
 'আপনার ডোমেইন ট্রান্সফার করতে, আপনার বর্তমান রেজিস্ট্রার থেকে এটি আনলক করতে হবে, EPP/Auth কোড নিতে হবে এবং আমাদের ডোমেইন ট্রান্সফার পেজ থেকে ট্রান্সফার শুরু করতে হবে। প্রক্রিয়াটি সাধারণত ৫-৭ দিন সময় নেয়।',
 'domains', 'domain-transfer', true, 2),
 
('What payment methods do you accept?', 'আপনারা কোন পেমেন্ট মেথড গ্রহণ করেন?',
 'We accept bKash, Nagad, Rocket, bank transfer, and all major credit/debit cards through our secure payment gateway.',
 'আমরা bKash, নগদ, রকেট, ব্যাংক ট্রান্সফার এবং আমাদের সুরক্ষিত পেমেন্ট গেটওয়ের মাধ্যমে সকল প্রধান ক্রেডিট/ডেবিট কার্ড গ্রহণ করি।',
 'billing', NULL, true, 3),
 
('Do you provide 24/7 support?', 'আপনারা কি ২৪/৭ সাপোর্ট দেন?',
 'Yes! Our support team is available 24/7 via live chat and ticket system. We typically respond within 15 minutes.',
 'হ্যাঁ! আমাদের সাপোর্ট টিম লাইভ চ্যাট এবং টিকেট সিস্টেমের মাধ্যমে ২৪/৭ উপলব্ধ। আমরা সাধারণত ১৫ মিনিটের মধ্যে সাড়া দিই।',
 'support', NULL, true, 4)

ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.cms_testimonials (client_name, client_name_bn, company_name, feedback, feedback_bn, rating, avatar_url, is_featured, is_active, sort_order) VALUES
('Rahim Ahmed', 'রহিম আহমেদ', 'TechBD Solutions', 
 'CHostBD has been our hosting partner for 3 years. Their uptime is excellent and support is always helpful. Highly recommended!',
 'CHostBD ৩ বছর ধরে আমাদের হোস্টিং পার্টনার। তাদের আপটাইম চমৎকার এবং সাপোর্ট সবসময় সহায়ক। অত্যন্ত সুপারিশকৃত!',
 5, NULL, true, true, 1),
 
('Fatima Khan', 'ফাতিমা খান', 'BD E-Commerce', 
 'Migrated our e-commerce store to CHostBD and the performance improvement was immediate. Great value for money.',
 'আমাদের ই-কমার্স স্টোর CHostBD-তে মাইগ্রেট করেছি এবং পারফরম্যান্স উন্নতি তাৎক্ষণিক ছিল। দারুণ মূল্য।',
 5, NULL, true, true, 2),
 
('Karim Hossain', 'করিম হোসেন', 'Starter Blogs', 
 'As a beginner, I found their service very easy to use. The cPanel is intuitive and their tutorials helped me set up my blog quickly.',
 'একজন শিক্ষানবিশ হিসেবে, আমি তাদের সার্ভিস খুবই সহজ পেয়েছি। cPanel স্বজ্ঞাত এবং তাদের টিউটোরিয়াল আমাকে দ্রুত ব্লগ সেটআপ করতে সাহায্য করেছে।',
 4, NULL, false, true, 3)

ON CONFLICT DO NOTHING;

-- Insert sample announcement
INSERT INTO public.cms_announcements (title, title_bn, short_description, short_description_bn, announcement_type, display_location, cta_label, cta_label_bn, cta_url, background_color, text_color, is_active, is_dismissible, priority, start_date, end_date) VALUES
('🎉 New Year Sale - 50% OFF on Annual Plans!', '🎉 নববর্ষ সেল - বার্ষিক প্ল্যানে ৫০% ছাড়!',
 'Start the new year with premium hosting at half the price. Limited time offer!',
 'নতুন বছর শুরু করুন অর্ধেক মূল্যে প্রিমিয়াম হোস্টিং দিয়ে। সীমিত সময়ের অফার!',
 'promo', 'banner', 'Get Offer', 'অফার নিন', 'https://billing.chost.com.bd/cart.php',
 '#dc2626', '#ffffff', true, true, 10, now(), now() + interval '30 days')

ON CONFLICT DO NOTHING;