import React from 'react';
import { Check, ArrowRight, Cloud, Cpu, HardDrive, Globe } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const CloudVPS: React.FC = () => {
  const features = [
    { icon: Cpu, title: 'Dedicated Resources', desc: 'Guaranteed CPU & RAM allocation' },
    { icon: HardDrive, title: 'NVMe SSD Storage', desc: 'Ultra-fast storage performance' },
    { icon: Globe, title: 'Global Locations', desc: 'Deploy close to your users' },
    { icon: Cloud, title: 'Instant Scaling', desc: 'Scale resources on demand' },
  ];

  const plans = [
    { name: 'VPS 1', price: '$9.99', cpu: '1 vCPU', ram: '2 GB RAM', storage: '40 GB NVMe', bandwidth: '2 TB' },
    { name: 'VPS 2', price: '$19.99', cpu: '2 vCPU', ram: '4 GB RAM', storage: '80 GB NVMe', bandwidth: '4 TB', featured: true },
    { name: 'VPS 4', price: '$39.99', cpu: '4 vCPU', ram: '8 GB RAM', storage: '160 GB NVMe', bandwidth: '6 TB' },
    { name: 'VPS 8', price: '$79.99', cpu: '8 vCPU', ram: '16 GB RAM', storage: '320 GB NVMe', bandwidth: '8 TB' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Cloud className="h-4 w-4" />
            <span>High Performance Cloud</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Cloud VPS</span> Hosting
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Deploy powerful virtual servers with full root access, NVMe SSD storage, and enterprise-grade performance.
          </p>
          <Button variant="hero" size="xl">Configure VPS <ArrowRight className="ml-2 h-5 w-5" /></Button>
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
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Cloud VPS Plans</h2>
            <p className="text-muted-foreground">All plans include DDoS protection, full root access, and 24/7 support</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}>
                {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">Popular</span></div>}
                <h3 className={`text-lg font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-3xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.price}</span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-4 w-4 text-accent" /> {plan.cpu}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-4 w-4 text-accent" /> {plan.ram}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-4 w-4 text-accent" /> {plan.storage}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-4 w-4 text-accent" /> {plan.bandwidth}</li>
                </ul>
                <Button variant={plan.featured ? 'accent' : 'hero'} size="default" className="w-full">Deploy Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CloudVPS;
