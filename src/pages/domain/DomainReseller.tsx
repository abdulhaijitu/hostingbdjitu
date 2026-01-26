import React from 'react';
import { Check, ArrowRight, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const DomainReseller: React.FC = () => {
  const plans = [
    { name: 'Reseller Basic', price: '$49.99', domains: '50 Domains', features: ['API Access', 'White-label', 'WHOIS Privacy'] },
    { name: 'Reseller Pro', price: '$99.99', domains: '200 Domains', features: ['API Access', 'White-label', 'WHOIS Privacy', 'Priority Support'], featured: true },
    { name: 'Reseller Enterprise', price: '$199.99', domains: 'Unlimited', features: ['API Access', 'White-label', 'WHOIS Privacy', 'Priority Support', 'Custom Pricing'] },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            <span>Start Your Domain Business</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Domain</span> Reseller
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Become a domain reseller and offer domain registration services to your customers with our white-label solution.
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
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/yr</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.domains}</li>
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

export default DomainReseller;
