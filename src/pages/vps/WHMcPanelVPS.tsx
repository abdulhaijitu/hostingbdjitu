import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const WHMcPanelVPS: React.FC = () => {
  const plans = [
    { name: 'WHM VPS 1', price: '$29.99', cpu: '2 vCPU', ram: '4 GB RAM', storage: '80 GB', accounts: '10 cPanel' },
    { name: 'WHM VPS 2', price: '$49.99', cpu: '4 vCPU', ram: '8 GB RAM', storage: '160 GB', accounts: '30 cPanel', featured: true },
    { name: 'WHM VPS 4', price: '$99.99', cpu: '8 vCPU', ram: '16 GB RAM', storage: '320 GB', accounts: 'Unlimited' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">WHM & cPanel</span> VPS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Managed VPS with WHM and cPanel pre-installed. Perfect for hosting multiple websites and clients.
          </p>
          <Button variant="hero" size="xl">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}>
                {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">Popular</span></div>}
                <h3 className={`text-xl font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.price}</span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.cpu}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.ram}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.storage} NVMe</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.accounts} Accounts</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> cPanel/WHM Included</li>
                </ul>
                <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full">Order Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WHMcPanelVPS;
