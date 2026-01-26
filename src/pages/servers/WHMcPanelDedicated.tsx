import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const WHMcPanelDedicated: React.FC = () => {
  const plans = [
    { name: 'WHM DS-1', price: '$149.99', cpu: 'Intel Xeon E3-1270', ram: '32 GB DDR4', storage: '1 TB SSD', accounts: '50 cPanel' },
    { name: 'WHM DS-2', price: '$249.99', cpu: 'Intel Xeon E5-2650', ram: '64 GB DDR4', storage: '2x 1TB SSD', accounts: 'Unlimited', featured: true },
    { name: 'WHM DS-4', price: '$399.99', cpu: 'Intel Xeon Silver 4210', ram: '128 GB DDR4', storage: '4x 1TB NVMe', accounts: 'Unlimited' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">WHM & cPanel</span> Dedicated
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Fully managed dedicated servers with WHM and cPanel. Perfect for hosting agencies and large-scale deployments.
          </p>
          <Button variant="hero" size="xl">View Plans <ArrowRight className="ml-2 h-5 w-5" /></Button>
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
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.storage}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.accounts} Accounts</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> cPanel/WHM License</li>
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

export default WHMcPanelDedicated;
