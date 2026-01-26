import React from 'react';
import { Check, ArrowRight, Mail, Shield, Globe } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const EmailHosting: React.FC = () => {
  const features = [
    { icon: Shield, title: 'Spam Protection', desc: 'Advanced spam filtering' },
    { icon: Globe, title: 'Webmail Access', desc: 'Access from anywhere' },
    { icon: Mail, title: 'Custom Domain', desc: 'Professional email addresses' },
  ];

  const plans = [
    { name: 'Basic', price: '$1.99', storage: '5 GB', accounts: '5 Accounts', features: ['Webmail', 'POP3/IMAP', 'Spam Filter'] },
    { name: 'Professional', price: '$3.99', storage: '25 GB', accounts: '25 Accounts', features: ['Webmail', 'POP3/IMAP', 'Advanced Spam', 'Calendar'], featured: true },
    { name: 'Enterprise', price: '$7.99', storage: '50 GB', accounts: 'Unlimited', features: ['Webmail', 'POP3/IMAP', 'Advanced Spam', 'Calendar', 'Contacts', 'Priority Support'] },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Mail className="h-4 w-4" />
            <span>Professional Email</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Email</span> Hosting
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Professional email hosting with your own domain. Secure, reliable, and easy to manage.
          </p>
          <Button variant="hero" size="xl">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-6">
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Email Hosting Plans</h2>
          </div>
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
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.storage} Storage</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.accounts}</li>
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

export default EmailHosting;
