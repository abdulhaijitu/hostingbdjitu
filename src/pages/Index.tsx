import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import DomainSearch from '@/components/home/DomainSearch';
import PricingSection from '@/components/home/PricingSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesSection from '@/components/home/ServicesSection';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FAQSection from '@/components/home/FAQSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import CTASection from '@/components/home/CTASection';
import SEOHead from '@/components/common/SEOHead';
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema } from '@/components/common/SchemaMarkup';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <SEOHead 
        title="Home"
        description={language === 'bn' 
          ? 'বাংলাদেশের সেরা ওয়েব হোস্টিং সেবা। ৯৯.৯৯% আপটাইম গ্যারান্টি, ২৪/৭ সাপোর্ট, NVMe SSD স্টোরেজ। ওয়েব হোস্টিং, VPS, ডেডিকেটেড সার্ভার এবং ডোমেইন রেজিস্ট্রেশন।'
          : 'Best web hosting service in Bangladesh. 99.99% uptime guarantee, 24/7 support, NVMe SSD storage. Web hosting, VPS, dedicated servers, and domain registration.'}
        keywords="web hosting, domain registration, VPS, dedicated server, cloud hosting, Bangladesh hosting, cPanel hosting, WordPress hosting, cheap hosting"
        canonicalUrl="/"
      />
      {/* JSON-LD Schema Markup */}
      <OrganizationSchema />
      <WebSiteSchema />
      <LocalBusinessSchema />
      
      <HeroSection />
      <DomainSearch />
      <PricingSection />
      <FeaturesSection />
      <ServicesSection />
      <TrustSection />
      <TestimonialsSection />
      <FAQSection />
      <NewsletterSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
