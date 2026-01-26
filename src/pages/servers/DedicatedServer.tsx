import React from 'react';
import { Check, ArrowRight, Server, Shield, Zap, Headphones } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const DedicatedServer: React.FC = () => {
  const features = [
    { icon: Server, title: 'Bare Metal', desc: 'Full hardware access' },
    { icon: Zap, title: 'Intel Xeon', desc: 'Enterprise processors' },
    { icon: Shield, title: 'DDoS Protection', desc: 'Up to 1Tbps mitigation' },
    { icon: Headphones, title: '24/7 Support', desc: 'Expert assistance' },
  ];

  const plans = [
    { name: 'DS-1', price: '$99.99', cpu: 'Intel Xeon E3-1230', cores: '4 Cores / 8 Threads', ram: '16 GB DDR4', storage: '500 GB SSD', bandwidth: '10 TB' },
    { name: 'DS-2', price: '$149.99', cpu: 'Intel Xeon E5-2620', cores: '6 Cores / 12 Threads', ram: '32 GB DDR4', storage: '1 TB SSD', bandwidth: '20 TB', featured: true },
    { name: 'DS-4', price: '$249.99', cpu: 'Intel Xeon Silver 4110', cores: '8 Cores / 16 Threads', ram: '64 GB DDR4', storage: '2x 1TB NVMe', bandwidth: 'Unlimited' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Server className="h-4 w-4" />
            <span>Enterprise Performance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Dedicated</span> Servers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Powerful bare-metal servers with Intel Xeon processors, enterprise SSDs, and unmetered DDoS protection.
          </p>
          <Button variant="hero" size="xl">View Servers <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {features.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-accent" />
                <div>
                  <span className="font-medium">{item.title}</span>
                  <span className="text-primary-foreground/70 text-sm ml-2">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Dedicated Server Plans</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}>
                {plan.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">Best Value</span></div>}
                <h3 className={`text-xl font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>{plan.price}</span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.cpu}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.cores}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.ram}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.storage}</li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}><Check className="h-5 w-5 text-accent" /> {plan.bandwidth} Bandwidth</li>
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

export default DedicatedServer;
