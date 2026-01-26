import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import DomainSearch from '@/components/home/DomainSearch';
import PricingSection from '@/components/home/PricingSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ServicesSection from '@/components/home/ServicesSection';
import TrustSection from '@/components/home/TrustSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <DomainSearch />
      <PricingSection />
      <FeaturesSection />
      <ServicesSection />
      <TrustSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
