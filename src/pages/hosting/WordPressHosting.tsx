import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const WordPressHosting: React.FC = () => {
  const plans = [
    { name: 'WP Starter', price: '$4.99', sites: '1 Site', storage: '10 GB', features: ['Auto Updates', 'Free SSL', 'Daily Backups'] },
    { name: 'WP Pro', price: '$9.99', sites: '3 Sites', storage: '30 GB', features: ['Auto Updates', 'Free SSL', 'Staging', 'LiteSpeed Cache'], featured: true },
    { name: 'WP Business', price: '$19.99', sites: 'Unlimited', storage: '100 GB', features: ['Auto Updates', 'Free SSL', 'Staging', 'LiteSpeed Cache', 'Priority Support'] },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">WordPress</span> Hosting
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Optimized hosting built specifically for WordPress with 1-click install, auto updates, and LiteSpeed cache.
          </p>
          <Button variant="hero" size="xl">View Plans <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}>
                {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">Most Popular</span></div>}
                <h3 className={`text-xl font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.price}</span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.sites}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.storage} NVMe</li>
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {f}</li>
                  ))}
                </ul>
                <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full">Get Started</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WordPressHosting;
