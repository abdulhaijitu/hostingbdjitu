import React from 'react';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy: React.FC = () => (
  <Layout>
    <section className="bg-gradient-hero section-padding"><div className="container-wide text-center"><h1 className="text-4xl font-bold font-display mb-4">Privacy Policy</h1></div></section>
    <section className="section-padding"><div className="container-wide max-w-3xl"><div className="prose prose-lg"><h2 className="text-2xl font-bold mb-4">Information We Collect</h2><p className="text-muted-foreground mb-4">We collect information you provide directly, including name, email, and payment details to provide our services.</p><h2 className="text-2xl font-bold mb-4 mt-8">How We Use Your Information</h2><p className="text-muted-foreground">Your data is used to provide services, process payments, and communicate with you about your account.</p></div></div></section>
  </Layout>
);
export default PrivacyPolicy;
