import React from 'react';
import { Check, ArrowRight, Crown, Zap, Shield, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const PremiumHosting: React.FC = () => {
  const features = [
    { icon: Zap, title: 'LiteSpeed Web Server', desc: 'Up to 10x faster than Apache' },
    { icon: Shield, title: 'Advanced Security', desc: 'Imunify360 & DDoS protection' },
    { icon: Clock, title: '99.99% Uptime SLA', desc: 'Enterprise-grade reliability' },
    { icon: Crown, title: 'Priority Support', desc: 'Average response under 5 minutes' },
  ];

  const plans = [
    {
      name: 'Premium Basic',
      price: '$9.99',
      storage: '50 GB NVMe',
      sites: '5 Websites',
      features: ['LiteSpeed', 'Daily Backups', 'Free SSL', 'Staging Environment'],
    },
    {
      name: 'Premium Plus',
      price: '$19.99',
      storage: '100 GB NVMe',
      sites: 'Unlimited',
      features: ['LiteSpeed', 'Real-time Backups', 'Free SSL', 'Staging', 'Priority Support', 'Free Domain'],
      featured: true,
    },
    {
      name: 'Premium Pro',
      price: '$39.99',
      storage: '200 GB NVMe',
      sites: 'Unlimited',
      features: ['LiteSpeed', 'Real-time Backups', 'Wildcard SSL', 'Staging', 'Dedicated Support', 'Free Domain', 'CDN Included'],
    },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Crown className="h-4 w-4" />
            <span>Enterprise Performance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Premium</span> Web Hosting
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience unparalleled performance with LiteSpeed servers, advanced security, and priority support.
          </p>
          <Button variant="hero" size="xl">
            View Plans <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/5 text-primary mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Premium Hosting Plans</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">Recommended</span>
                  </div>
                )}
                <h3 className={`text-xl font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.price}</span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.storage}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.sites}
                  </li>
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                      <Check className="h-5 w-5 text-accent" /> {f}
                    </li>
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

export default PremiumHosting;
