import React from 'react';
import { ArrowRight, Settings } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const CustomVPS: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Settings className="h-4 w-4" />
            <span>Build Your Own</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Custom</span> VPS Configuration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Need specific resources? Configure your VPS with exact specifications. Our team will build it for you.
          </p>
          <Button variant="hero" size="xl">Contact Sales <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-display mb-4">Custom VPS Options</h2>
            <p className="text-muted-foreground mb-8">
              Choose your CPU cores (1-64), RAM (2GB-256GB), storage (40GB-4TB NVMe), and bandwidth requirements.
              Contact our sales team for a custom quote.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Up to 64</div>
                <div className="text-muted-foreground">vCPU Cores</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Up to 256GB</div>
                <div className="text-muted-foreground">RAM</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Up to 4TB</div>
                <div className="text-muted-foreground">NVMe Storage</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Unlimited</div>
                <div className="text-muted-foreground">Bandwidth*</div>
              </div>
            </div>
            <Button variant="hero" size="xl">Request Custom Quote</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CustomVPS;
