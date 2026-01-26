import React from 'react';
import Layout from '@/components/layout/Layout';

const RefundPolicy: React.FC = () => (
  <Layout>
    <section className="bg-gradient-hero section-padding"><div className="container-wide text-center"><h1 className="text-4xl font-bold font-display mb-4">Refund Policy</h1></div></section>
    <section className="section-padding"><div className="container-wide max-w-3xl"><div className="prose prose-lg"><h2 className="text-2xl font-bold mb-4">30-Day Money-Back Guarantee</h2><p className="text-muted-foreground mb-4">We offer a 30-day money-back guarantee on all shared hosting plans. If you're not satisfied, contact support within 30 days for a full refund.</p><h2 className="text-2xl font-bold mb-4 mt-8">Exclusions</h2><p className="text-muted-foreground">Domain registrations, dedicated servers, and add-on services are non-refundable. VPS plans have a 7-day refund window.</p></div></div></section>
  </Layout>
);
export default RefundPolicy;
