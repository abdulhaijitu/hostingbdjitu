import React, { useState } from 'react';
import { ArrowRight, Settings, Cpu, HardDrive, Wifi, Server, Shield, Zap, Check, Send, Network } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { ProductSchema, FAQSchema, BreadcrumbSchema } from '@/components/common/SchemaMarkup';
import { WHMCS_URLS, redirectToWHMCS, getServerStoreUrl } from '@/lib/whmcsConfig';

const CustomDedicated: React.FC = () => {
  const { language } = useLanguage();
  const [config, setConfig] = useState({
    processor: 'xeon-e5',
    ram: 64,
    storage: 2,
    raid: 'raid1',
    network: '1gbps'
  });

  const processors = [
    { id: 'xeon-e3', name: 'Intel Xeon E3', cores: '4C/8T', price: 5000 },
    { id: 'xeon-e5', name: 'Intel Xeon E5', cores: '8C/16T', price: 10000 },
    { id: 'xeon-silver', name: 'Intel Xeon Silver', cores: '10C/20T', price: 15000 },
    { id: 'xeon-gold', name: 'Intel Xeon Gold', cores: '16C/32T', price: 25000 },
    { id: 'epyc-7302', name: 'AMD EPYC 7302', cores: '16C/32T', price: 30000 },
    { id: 'epyc-7502', name: 'AMD EPYC 7502', cores: '32C/64T', price: 50000 },
  ];

  const ramOptions = [32, 64, 128, 256, 512, 1024, 2048];
  const storageOptions = [1, 2, 4, 8, 16, 32];
  const raidOptions = [
    { id: 'none', name: language === 'bn' ? 'কোন RAID নেই' : 'No RAID', price: 0 },
    { id: 'raid1', name: 'RAID 1', price: 2000 },
    { id: 'raid5', name: 'RAID 5', price: 3000 },
    { id: 'raid10', name: 'RAID 10', price: 5000 },
  ];
  const networkOptions = [
    { id: '1gbps', name: '1 Gbps', price: 0 },
    { id: '10gbps', name: '10 Gbps', price: 10000 },
  ];

  const calculatePrice = () => {
    const processorPrice = processors.find(p => p.id === config.processor)?.price || 0;
    const ramPrice = config.ram * 50;
    const storagePrice = config.storage * 1000;
    const raidPrice = raidOptions.find(r => r.id === config.raid)?.price || 0;
    const networkPrice = networkOptions.find(n => n.id === config.network)?.price || 0;
    return processorPrice + ramPrice + storagePrice + raidPrice + networkPrice + 5000; // Base price
  };

  const features = [
    { icon: Cpu, title: language === 'bn' ? 'ডুয়াল CPU সাপোর্ট' : 'Dual CPU Support', desc: language === 'bn' ? 'Xeon বা EPYC প্রসেসর' : 'Xeon or EPYC processors' },
    { icon: Server, title: language === 'bn' ? '2TB RAM পর্যন্ত' : 'Up to 2TB RAM', desc: language === 'bn' ? 'DDR4 ECC মেমোরি' : 'DDR4 ECC memory' },
    { icon: HardDrive, title: language === 'bn' ? 'NVMe RAID' : 'NVMe RAID', desc: language === 'bn' ? 'এন্টারপ্রাইজ স্টোরেজ' : 'Enterprise storage' },
    { icon: Network, title: language === 'bn' ? '10Gbps নেটওয়ার্ক' : '10Gbps Network', desc: language === 'bn' ? 'আলট্রা-ফাস্ট কানেক্টিভিটি' : 'Ultra-fast connectivity' },
    { icon: Shield, title: language === 'bn' ? 'এন্টারপ্রাইজ সিকিউরিটি' : 'Enterprise Security', desc: language === 'bn' ? 'হার্ডওয়্যার ফায়ারওয়াল' : 'Hardware firewall' },
    { icon: Zap, title: language === 'bn' ? '99.99% আপটাইম' : '99.99% Uptime', desc: language === 'bn' ? 'SLA গ্যারান্টিড' : 'SLA guaranteed' },
  ];

  const includedFeatures = [
    language === 'bn' ? 'ফুল রুট অ্যাক্সেস' : 'Full Root Access',
    language === 'bn' ? 'IPMI/KVM অ্যাক্সেস' : 'IPMI/KVM Access',
    language === 'bn' ? 'ডেডিকেটেড IP' : 'Dedicated IPs',
    language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection',
    language === 'bn' ? 'হার্ডওয়্যার রিপ্লেসমেন্ট' : 'Hardware Replacement',
    language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support',
    language === 'bn' ? 'ফ্রি OS ইনস্টল' : 'Free OS Install',
    language === 'bn' ? 'ফ্রি মাইগ্রেশন' : 'Free Migration',
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'কাস্টম ডেডিকেটেড সার্ভার' : 'Custom Dedicated Servers'}
        description={language === 'bn' ? 'আপনার এন্টারপ্রাইজের জন্য কাস্টম হার্ডওয়্যার কনফিগারেশন। আমাদের টিম আপনার চাহিদা অনুযায়ী সার্ভার তৈরি করবে।' : 'Custom hardware configurations for your enterprise. Our team will build servers according to your needs.'}
        keywords="custom dedicated server, enterprise server, server configuration, Bangladesh"
        canonicalUrl="/servers/custom"
      />
      <ProductSchema 
        name="Custom Dedicated Server"
        description="Custom hardware configurations with dual CPU support, up to 2TB RAM, and enterprise NVMe storage."
        price="20000"
        url="/servers/custom"
        category="Dedicated Servers"
      />
      <FAQSchema faqs={[
        { question: "Can I choose my own hardware?", answer: "Yes, you can select processor, RAM, storage, RAID configuration, and network options." },
        { question: "What processors are available?", answer: "We offer Intel Xeon and AMD EPYC processors up to 32 cores/64 threads." },
        { question: "How long does provisioning take?", answer: "Custom servers are typically provisioned within 48-72 hours after order confirmation." }
      ]} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Servers', url: '/servers' },
        { name: 'Custom Dedicated', url: '/servers/custom' }
      ]} />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Settings className="h-4 w-4" />
            <span>{language === 'bn' ? 'এন্টারপ্রাইজ সল্যুশন' : 'Enterprise Solutions'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'কাস্টম' : 'Custom'}</span> {language === 'bn' ? 'ডেডিকেটেড সার্ভার' : 'Dedicated Servers'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আপনার এন্টারপ্রাইজের জন্য কাস্টম হার্ডওয়্যার কনফিগারেশন। আমাদের টিম আপনার চাহিদা অনুযায়ী সার্ভার তৈরি করবে।'
              : 'Custom hardware configurations for your enterprise. Our team will build servers according to your needs.'}
          </p>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 bg-primary/5 border-y border-border">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'ডুয়াল CPU' : 'Dual CPU'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '2TB RAM পর্যন্ত' : 'Up to 2TB RAM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'NVMe RAID' : 'NVMe RAID'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '10Gbps নেটওয়ার্ক' : '10Gbps Network'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Configurator */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold font-display mb-6">
                {language === 'bn' ? 'আপনার সার্ভার কনফিগার করুন' : 'Configure Your Server'}
              </h2>
              
              <div className="space-y-8">
                {/* Processor Selection */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'bn' ? 'প্রসেসর' : 'Processor'}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'CPU নির্বাচন করুন' : 'Select CPU'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {processors.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setConfig({ ...config, processor: p.id })}
                        className={`p-4 rounded-lg text-left transition-colors ${config.processor === p.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className={`text-xs ${config.processor === p.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{p.cores}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RAM Selection */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'bn' ? 'RAM (GB)' : 'RAM (GB)'}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'DDR4 ECC মেমোরি' : 'DDR4 ECC Memory'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {ramOptions.map((ram) => (
                      <button
                        key={ram}
                        onClick={() => setConfig({ ...config, ram })}
                        className={`p-3 rounded-lg text-center font-medium transition-colors ${config.ram === ram ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        {ram >= 1024 ? `${ram / 1024}T` : ram}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Storage Selection */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HardDrive className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'bn' ? 'NVMe স্টোরেজ (TB)' : 'NVMe Storage (TB)'}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'এন্টারপ্রাইজ NVMe' : 'Enterprise NVMe'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setConfig({ ...config, storage })}
                        className={`p-3 rounded-lg text-center font-medium transition-colors ${config.storage === storage ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        {storage}TB
                      </button>
                    ))}
                  </div>
                </div>

                {/* RAID Selection */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'bn' ? 'RAID কনফিগারেশন' : 'RAID Configuration'}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ডাটা রিডান্ডেন্সি' : 'Data redundancy'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {raidOptions.map((raid) => (
                      <button
                        key={raid.id}
                        onClick={() => setConfig({ ...config, raid: raid.id })}
                        className={`p-3 rounded-lg text-center font-medium transition-colors ${config.raid === raid.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        {raid.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Network Selection */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Network className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'bn' ? 'নেটওয়ার্ক' : 'Network'}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ডেডিকেটেড ব্যান্ডউইথ' : 'Dedicated bandwidth'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {networkOptions.map((net) => (
                      <button
                        key={net.id}
                        onClick={() => setConfig({ ...config, network: net.id })}
                        className={`p-3 rounded-lg text-center font-medium transition-colors ${config.network === net.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        {net.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h3 className="text-xl font-semibold font-display mb-6">
                  {language === 'bn' ? 'আপনার কনফিগারেশন' : 'Your Configuration'}
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">{language === 'bn' ? 'প্রসেসর' : 'Processor'}</span>
                    <span className="font-semibold text-sm">{processors.find(p => p.id === config.processor)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">RAM</span>
                    <span className="font-semibold">{config.ram >= 1024 ? `${config.ram / 1024} TB` : `${config.ram} GB`}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">{language === 'bn' ? 'স্টোরেজ' : 'Storage'}</span>
                    <span className="font-semibold">{config.storage} TB NVMe</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">RAID</span>
                    <span className="font-semibold">{raidOptions.find(r => r.id === config.raid)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">{language === 'bn' ? 'নেটওয়ার্ক' : 'Network'}</span>
                    <span className="font-semibold">{networkOptions.find(n => n.id === config.network)?.name}</span>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <div className="text-sm text-muted-foreground mb-1">{language === 'bn' ? 'আনুমানিক মূল্য' : 'Estimated Price'}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">{formatPrice(calculatePrice())}</span>
                    <span className="text-muted-foreground">/{language === 'bn' ? 'মাস' : 'mo'}</span>
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full mb-4" onClick={() => redirectToWHMCS(getServerStoreUrl('custom'))}>
                  <Send className="mr-2 h-5 w-5" />
                  {language === 'bn' ? 'কোট রিকোয়েস্ট করুন' : 'Request Quote'}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  {language === 'bn' 
                    ? 'আমাদের সেলস টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে'
                    : 'Our sales team will contact you within 24 hours'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Included Features */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'সব সার্ভারে অন্তর্ভুক্ত' : 'Included with All Servers'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {includedFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                <Check className="h-5 w-5 text-success shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'এন্টারপ্রাইজ ফিচার' : 'Enterprise Features'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-hover p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'এন্টারপ্রাইজ সল্যুশন দরকার?' : 'Need Enterprise Solutions?'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'বড় প্রজেক্টের জন্য আমাদের এন্টারপ্রাইজ টিমের সাথে যোগাযোগ করুন। কাস্টম SLA এবং ডেডিকেটেড সাপোর্ট পান।'
                : 'Contact our enterprise team for large projects. Get custom SLA and dedicated support.'}
            </p>
            <Button variant="hero" size="xl" onClick={() => redirectToWHMCS(WHMCS_URLS.submitTicket)}>
              {language === 'bn' ? 'এন্টারপ্রাইজ টিমে যোগাযোগ' : 'Contact Enterprise Team'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CustomDedicated;
