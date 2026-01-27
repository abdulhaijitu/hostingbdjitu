-- =========================================
-- CMS CONTENT MANAGEMENT SYSTEM TABLES
-- For frontend content only - NO billing/auth
-- =========================================

-- 1. CMS Pages - Static page content
CREATE TABLE public.cms_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  slug TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL DEFAULT 'static', -- static, hosting, domain, legal
  sections JSONB DEFAULT '[]'::jsonb, -- Page content blocks
  seo_title TEXT,
  seo_title_bn TEXT,
  seo_description TEXT,
  seo_description_bn TEXT,
  seo_keywords TEXT,
  is_published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Pricing Display - Informational only, not authoritative
CREATE TABLE public.cms_pricing_display (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_name TEXT NOT NULL,
  plan_name_bn TEXT,
  category TEXT NOT NULL, -- web, premium, wordpress, reseller, vps, dedicated
  display_price TEXT NOT NULL, -- String like "৳299/mo"
  display_price_bn TEXT,
  billing_cycle_label TEXT DEFAULT 'monthly', -- monthly, yearly, etc.
  original_price TEXT, -- For showing discounts
  discount_label TEXT,
  features JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  features_bn JSONB DEFAULT '[]'::jsonb,
  whmcs_pid TEXT, -- WHMCS product ID for redirect
  whmcs_redirect_url TEXT, -- Direct order URL
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Blog Posts
CREATE TABLE public.cms_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  excerpt_bn TEXT,
  content TEXT NOT NULL, -- Rich text/markdown
  content_bn TEXT,
  featured_image_url TEXT,
  category TEXT DEFAULT 'general', -- hosting, domain, security, tutorial, news
  author_name TEXT DEFAULT 'Admin',
  read_time_minutes INTEGER DEFAULT 5,
  seo_title TEXT,
  seo_description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Announcements (Marketing/Promo Only)
CREATE TABLE public.cms_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  short_description TEXT,
  short_description_bn TEXT,
  announcement_type TEXT DEFAULT 'promo', -- promo, notice, campaign, maintenance
  cta_label TEXT,
  cta_label_bn TEXT,
  cta_url TEXT,
  background_color TEXT DEFAULT '#3b82f6',
  text_color TEXT DEFAULT '#ffffff',
  icon TEXT, -- Lucide icon name
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  is_dismissible BOOLEAN DEFAULT true,
  display_location TEXT DEFAULT 'banner', -- banner, popup, inline
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. FAQs
CREATE TABLE public.cms_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  question_bn TEXT,
  answer TEXT NOT NULL,
  answer_bn TEXT,
  category TEXT DEFAULT 'general', -- general, billing, hosting, domain, support
  page_slug TEXT, -- Optional: link to specific page
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Testimonials
CREATE TABLE public.cms_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_name_bn TEXT,
  company_name TEXT,
  feedback TEXT NOT NULL,
  feedback_bn TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Global Settings (WHMCS URLs & Branding)
CREATE TABLE public.cms_global_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_value_json JSONB,
  setting_type TEXT DEFAULT 'text', -- text, json, url, boolean
  category TEXT DEFAULT 'general', -- general, whmcs, branding, social
  description TEXT,
  is_editable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================
-- ROW LEVEL SECURITY POLICIES
-- =========================================

-- Enable RLS on all CMS tables
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pricing_display ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_global_settings ENABLE ROW LEVEL SECURITY;

-- CMS Pages policies
CREATE POLICY "Public can view published pages" ON public.cms_pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all pages" ON public.cms_pages
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Pricing Display policies  
CREATE POLICY "Public can view active pricing" ON public.cms_pricing_display
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage pricing display" ON public.cms_pricing_display
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Blog Posts policies
CREATE POLICY "Public can view published posts" ON public.cms_blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blog posts" ON public.cms_blog_posts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Announcements policies
CREATE POLICY "Public can view active announcements" ON public.cms_announcements
  FOR SELECT USING (is_active = true AND (end_date IS NULL OR end_date > now()));

CREATE POLICY "Admins can manage announcements" ON public.cms_announcements
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- FAQs policies
CREATE POLICY "Public can view active FAQs" ON public.cms_faqs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage FAQs" ON public.cms_faqs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Testimonials policies
CREATE POLICY "Public can view active testimonials" ON public.cms_testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" ON public.cms_testimonials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Global Settings policies
CREATE POLICY "Public can view settings" ON public.cms_global_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.cms_global_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- TRIGGERS FOR updated_at
-- =========================================

CREATE TRIGGER update_cms_pages_updated_at
  BEFORE UPDATE ON public.cms_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_pricing_display_updated_at
  BEFORE UPDATE ON public.cms_pricing_display
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_blog_posts_updated_at
  BEFORE UPDATE ON public.cms_blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_announcements_updated_at
  BEFORE UPDATE ON public.cms_announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_faqs_updated_at
  BEFORE UPDATE ON public.cms_faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_testimonials_updated_at
  BEFORE UPDATE ON public.cms_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_global_settings_updated_at
  BEFORE UPDATE ON public.cms_global_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================

CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_cms_pages_type ON public.cms_pages(page_type);
CREATE INDEX idx_cms_pricing_category ON public.cms_pricing_display(category);
CREATE INDEX idx_cms_blog_slug ON public.cms_blog_posts(slug);
CREATE INDEX idx_cms_blog_status ON public.cms_blog_posts(status);
CREATE INDEX idx_cms_blog_category ON public.cms_blog_posts(category);
CREATE INDEX idx_cms_announcements_active ON public.cms_announcements(is_active, start_date, end_date);
CREATE INDEX idx_cms_faqs_category ON public.cms_faqs(category);
CREATE INDEX idx_cms_settings_key ON public.cms_global_settings(setting_key);