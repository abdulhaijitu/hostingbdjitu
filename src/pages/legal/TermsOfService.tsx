import React from 'react';
import Layout from '@/components/layout/Layout';

const TermsOfService: React.FC = () => (
  <Layout>
    <section className="bg-gradient-hero section-padding"><div className="container-wide text-center"><h1 className="text-4xl font-bold font-display mb-4">Terms of Service</h1></div></section>
    <section className="section-padding"><div className="container-wide max-w-3xl"><div className="prose prose-lg"><h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2><p className="text-muted-foreground mb-4">By using CHost services, you agree to be bound by these terms and conditions.</p><h2 className="text-2xl font-bold mb-4 mt-8">Service Usage</h2><p className="text-muted-foreground">You agree to use our services only for lawful purposes and in accordance with these terms.</p></div></div></section>
  </Layout>
);
export default TermsOfService;
