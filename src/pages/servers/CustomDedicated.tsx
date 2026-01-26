import React from 'react';
import { ArrowRight, Settings } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const CustomDedicated: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Settings className="h-4 w-4" />
            <span>Enterprise Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">Custom</span> Dedicated Servers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Need specific hardware configurations? Our team will build a custom dedicated server solution for your enterprise needs.
          </p>
          <Button variant="hero" size="xl">Contact Sales <ArrowRight className="ml-2 h-5 w-5" /></Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold font-display mb-4">Custom Server Options</h2>
            <p className="text-muted-foreground mb-8">
              Choose from AMD EPYC or Intel Xeon processors, up to 2TB RAM, multiple NVMe drives in RAID configurations, and dedicated bandwidth options.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Dual CPU</div>
                <div className="text-muted-foreground">Xeon / EPYC</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Up to 2TB</div>
                <div className="text-muted-foreground">DDR4 RAM</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">NVMe RAID</div>
                <div className="text-muted-foreground">Storage Arrays</div>
              </div>
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <div className="text-3xl font-bold text-primary mb-2">10 Gbps</div>
                <div className="text-muted-foreground">Network</div>
              </div>
            </div>
            <Button variant="hero" size="xl">Request Custom Quote</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CustomDedicated;
