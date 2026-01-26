import React from 'react';
import { ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const DomainTransfer: React.FC = () => {
  const steps = [
    { num: '1', title: 'Unlock Domain', desc: 'Unlock your domain at your current registrar' },
    { num: '2', title: 'Get Auth Code', desc: 'Request the authorization/EPP code' },
    { num: '3', title: 'Start Transfer', desc: 'Enter your domain and auth code below' },
    { num: '4', title: 'Confirm Transfer', desc: 'Approve the transfer via email' },
  ];

  const benefits = [
    '1 Year Free Extension',
    'Free WHOIS Privacy',
    'Free DNS Management',
    'No Downtime',
    '24/7 Support',
    'Easy Management',
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <RefreshCw className="h-4 w-4" />
            <span>Easy Transfer Process</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Domain</span> Transfer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Transfer your domain to CHost and get 1 year free extension plus free WHOIS privacy.
          </p>
          <Button variant="hero" size="xl">Transfer Domain <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">How It Works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="feature-card text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold font-display mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Transfer Benefits</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 p-4 rounded-lg bg-card">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomainTransfer;
