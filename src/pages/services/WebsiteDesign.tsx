import React from 'react';
import { ArrowRight, Palette, Code, Smartphone, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const WebsiteDesign: React.FC = () => {
  const services = [
    { icon: Palette, title: 'Custom Design', desc: 'Unique designs tailored to your brand', price: 'From $499' },
    { icon: Code, title: 'Web Development', desc: 'Modern, fast, and secure websites', price: 'From $799' },
    { icon: Smartphone, title: 'Mobile Responsive', desc: 'Perfect on all devices', price: 'Included' },
    { icon: Search, title: 'SEO Optimization', desc: 'Rank higher on search engines', price: 'From $199' },
  ];

  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Palette className="h-4 w-4" />
            <span>Professional Design Services</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Website</span> Design
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Transform your online presence with our professional website design and development services.
          </p>
          <Button variant="hero" size="xl">Get a Quote <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">Our Services</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.title} className="card-hover p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/5 text-primary mb-4">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.desc}</p>
                <p className="text-accent font-semibold">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold font-display mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-foreground/70 mb-8">Contact us for a free consultation and quote.</p>
          <Button variant="accent" size="xl">Contact Us <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>
    </Layout>
  );
};

export default WebsiteDesign;
