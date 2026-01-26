import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Shield, Zap, Clock, Server } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const WebHosting: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$2.99',
      storage: '10 GB NVMe SSD',
      websites: '1 Website',
      bandwidth: '100 GB',
      email: '1 Email Account',
      features: ['Free SSL', 'Weekly Backups', 'cPanel Access', '99.9% Uptime'],
    },
    {
      name: 'Professional',
      price: '$7.99',
      storage: '50 GB NVMe SSD',
      websites: 'Unlimited Websites',
      bandwidth: 'Unlimited',
      email: 'Unlimited Email',
      features: ['Free SSL', 'Daily Backups', 'cPanel Access', '99.99% Uptime', 'DDoS Protection', 'Free Domain'],
      featured: true,
    },
    {
      name: 'Business',
      price: '$14.99',
      storage: '100 GB NVMe SSD',
      websites: 'Unlimited Websites',
      bandwidth: 'Unlimited',
      email: 'Unlimited Email',
      features: ['Free SSL', 'Real-time Backups', 'cPanel Access', '99.99% Uptime', 'Advanced DDoS', 'Free Domain', 'Priority Support'],
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Starting from $2.99/month</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            Fast & Reliable <span className="text-gradient-primary">Web Hosting</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Power your website with our high-performance hosting. NVMe SSD storage, free SSL, and 24/7 expert support included.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Compare Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {[
              { icon: Shield, text: 'Free SSL Certificate' },
              { icon: Zap, text: 'NVMe SSD Storage' },
              { icon: Clock, text: '99.99% Uptime' },
              { icon: Server, text: '24/7 Support' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-accent" />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              Choose Your Hosting Plan
            </h2>
            <p className="text-muted-foreground text-lg">
              All plans include 30-day money-back guarantee
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={`text-xl font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    {plan.price}
                  </span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" />
                    {plan.storage}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" />
                    {plan.websites}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" />
                    {plan.bandwidth} Bandwidth
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" />
                    {plan.email}
                  </li>
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                      <Check className="h-5 w-5 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.featured ? 'accent' : 'hero'}
                  size="lg"
                  className="w-full"
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebHosting;
