import React, { useState } from 'react';
import { Search, ArrowRight, Globe, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const DomainRegistration: React.FC = () => {
  const [domain, setDomain] = useState('');

  const extensions = [
    { ext: '.com', price: '$12.99', renewal: '$14.99' },
    { ext: '.net', price: '$14.99', renewal: '$16.99' },
    { ext: '.org', price: '$13.99', renewal: '$15.99' },
    { ext: '.io', price: '$39.99', renewal: '$44.99' },
    { ext: '.com.bd', price: '৳999', renewal: '৳1199' },
    { ext: '.co', price: '$29.99', renewal: '$34.99' },
    { ext: '.xyz', price: '$2.99', renewal: '$12.99' },
    { ext: '.online', price: '$4.99', renewal: '$29.99' },
  ];

  const features = [
    'Free WHOIS Privacy Protection',
    'Free DNS Management',
    'Easy Domain Transfer',
    'Domain Forwarding',
    'Email Forwarding',
    '24/7 Support',
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Globe className="h-4 w-4" />
            <span>Find Your Perfect Domain</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Domain</span> Registration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Register your domain name with free WHOIS privacy, DNS management, and 24/7 support.
          </p>

          <form className="max-w-3xl mx-auto mb-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Search for your domain name..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-lg border border-border"
                />
              </div>
              <Button variant="hero" size="xl" type="submit">
                Search <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">Domain Pricing</h2>
            <p className="text-muted-foreground">All prices are for the first year</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {extensions.map((item) => (
              <div key={item.ext} className="card-hover p-6 text-center">
                <div className="text-2xl font-bold font-display text-primary mb-2">{item.ext}</div>
                <div className="text-xl font-semibold mb-1">{item.price}</div>
                <div className="text-sm text-muted-foreground">Renews at {item.renewal}/yr</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">What's Included</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 rounded-lg bg-card">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomainRegistration;
