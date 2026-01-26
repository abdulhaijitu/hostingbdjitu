import React, { useState } from 'react';
import { ArrowRight, Settings, Cpu, HardDrive, Wifi, Server, Shield, Zap, Check, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { ProductSchema, FAQSchema, BreadcrumbSchema } from '@/components/common/SchemaMarkup';

const CustomVPS: React.FC = () => {
  const { language } = useLanguage();
  const [config, setConfig] = useState({
    cpu: 4,
    ram: 8,
    storage: 100,
    bandwidth: 'unlimited'
  });

  const cpuOptions = [1, 2, 4, 8, 16, 32, 64];
  const ramOptions = [2, 4, 8, 16, 32, 64, 128, 256];
  const storageOptions = [40, 80, 160, 320, 500, 1000, 2000, 4000];

  const calculatePrice = () => {
    const cpuPrice = config.cpu * 500;
    const ramPrice = config.ram * 100;
    const storagePrice = config.storage * 2;
    return cpuPrice + ramPrice + storagePrice;
  };

  const features = [
    { icon: Cpu, title: language === 'bn' ? '৬৪ vCPU পর্যন্ত' : 'Up to 64 vCPU', desc: language === 'bn' ? 'শক্তিশালী প্রসেসিং পাওয়ার' : 'Powerful processing power' },
    { icon: Server, title: language === 'bn' ? '২৫৬GB RAM পর্যন্ত' : 'Up to 256GB RAM', desc: language === 'bn' ? 'বড় অ্যাপ্লিকেশনের জন্য' : 'For large applications' },
    { icon: HardDrive, title: language === 'bn' ? '4TB NVMe পর্যন্ত' : 'Up to 4TB NVMe', desc: language === 'bn' ? 'অতি দ্রুত স্টোরেজ' : 'Ultra-fast storage' },
    { icon: Wifi, title: language === 'bn' ? 'আনলিমিটেড ব্যান্ডউইথ' : 'Unlimited Bandwidth', desc: language === 'bn' ? 'কোন সীমা নেই' : 'No limits' },
    { icon: Shield, title: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', desc: language === 'bn' ? 'সম্পূর্ণ সুরক্ষা' : 'Complete protection' },
    { icon: Zap, title: language === 'bn' ? 'তাৎক্ষণিক সেটআপ' : 'Instant Setup', desc: language === 'bn' ? 'মিনিটের মধ্যে প্রস্তুত' : 'Ready in minutes' },
  ];

  const includedFeatures = [
    language === 'bn' ? 'ফুল রুট অ্যাক্সেস' : 'Full Root Access',
    language === 'bn' ? 'ডেডিকেটেড IP' : 'Dedicated IP',
    language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection',
    language === 'bn' ? 'সাপ্তাহিক ব্যাকআপ' : 'Weekly Backups',
    language === 'bn' ? 'রিবুট/রিইনস্টল অ্যাক্সেস' : 'Reboot/Reinstall Access',
    language === 'bn' ? '২৪/৭ সাপোর্ট' : '24/7 Support',
    language === 'bn' ? 'SSD RAID স্টোরেজ' : 'SSD RAID Storage',
    language === 'bn' ? 'বিনামূল্যে মাইগ্রেশন' : 'Free Migration',
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'কাস্টম VPS' : 'Custom VPS'}
        description={language === 'bn' ? 'নির্দিষ্ট রিসোর্স দরকার? সঠিক স্পেসিফিকেশন দিয়ে আপনার VPS কনফিগার করুন।' : 'Need specific resources? Configure your VPS with exact specifications.'}
        keywords="custom VPS, configurable VPS, VPS builder, Bangladesh"
        canonicalUrl="/vps/custom"
      />
      <ProductSchema 
        name="Custom VPS"
        description="Configure your VPS with exact specifications - up to 64 vCPU, 256GB RAM, and 4TB NVMe storage."
        price="1000"
        url="/vps/custom"
        category="VPS Hosting"
      />
      <FAQSchema faqs={[
        { question: "Can I configure my own VPS?", answer: "Yes, you can select CPU, RAM, storage, and bandwidth according to your specific needs." },
        { question: "What is the maximum configuration?", answer: "You can configure up to 64 vCPU, 256GB RAM, and 4TB NVMe storage." },
        { question: "How long does setup take?", answer: "Custom VPS is typically provisioned within 24 hours after quote approval." }
      ]} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'VPS', url: '/vps' },
        { name: 'Custom VPS', url: '/vps/custom' }
      ]} />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Settings className="h-4 w-4" />
            <span>{language === 'bn' ? 'নিজের মতো তৈরি করুন' : 'Build Your Own'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'কাস্টম' : 'Custom'}</span> VPS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'নির্দিষ্ট রিসোর্স দরকার? সঠিক স্পেসিফিকেশন দিয়ে আপনার VPS কনফিগার করুন।'
              : 'Need specific resources? Configure your VPS with exact specifications.'}
          </p>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 bg-primary/5 border-y border-border">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '৬৪ vCPU পর্যন্ত' : 'Up to 64 vCPU'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '২৫৬GB RAM পর্যন্ত' : 'Up to 256GB RAM'}</span>
            </div>
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '4TB NVMe পর্যন্ত' : 'Up to 4TB NVMe'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'আনলিমিটেড ব্যান্ডউইথ' : 'Unlimited Bandwidth'}</span>
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
                {language === 'bn' ? 'আপনার VPS কনফিগার করুন' : 'Configure Your VPS'}
              </h2>
              
              <div className="space-y-8">
                {/* CPU Selection */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'bn' ? 'CPU কোর' : 'CPU Cores'}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'প্রসেসিং পাওয়ার নির্বাচন করুন' : 'Select processing power'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {cpuOptions.map((cpu) => (
                      <button
                        key={cpu}
                        onClick={() => setConfig({ ...config, cpu })}
                        className={`p-3 rounded-lg text-center font-medium transition-colors ${config.cpu === cpu ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        {cpu}
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
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'মেমোরি নির্বাচন করুন' : 'Select memory'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {ramOptions.map((ram) => (
                      <button
                        key={ram}
                        onClick={() => setConfig({ ...config, ram })}
                        className={`p-3 rounded-lg text-center font-medium transition-colors ${config.ram === ram ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        {ram}
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
                      <h3 className="font-semibold">{language === 'bn' ? 'NVMe স্টোরেজ (GB)' : 'NVMe Storage (GB)'}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'স্টোরেজ নির্বাচন করুন' : 'Select storage'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setConfig({ ...config, storage })}
                        className={`p-3 rounded-lg text-center font-medium transition-colors ${config.storage === storage ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                      >
                        {storage >= 1000 ? `${storage / 1000}T` : storage}
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
                    <span className="text-muted-foreground">{language === 'bn' ? 'CPU কোর' : 'CPU Cores'}</span>
                    <span className="font-semibold">{config.cpu} vCPU</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">RAM</span>
                    <span className="font-semibold">{config.ram} GB</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">{language === 'bn' ? 'স্টোরেজ' : 'Storage'}</span>
                    <span className="font-semibold">{config.storage >= 1000 ? `${config.storage / 1000} TB` : `${config.storage} GB`} NVMe</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">{language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}</span>
                    <span className="font-semibold">{language === 'bn' ? 'আনলিমিটেড' : 'Unlimited'}</span>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <div className="text-sm text-muted-foreground mb-1">{language === 'bn' ? 'আনুমানিক মূল্য' : 'Estimated Price'}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">{formatPrice(calculatePrice())}</span>
                    <span className="text-muted-foreground">/{language === 'bn' ? 'মাস' : 'mo'}</span>
                  </div>
                </div>

                <Button variant="hero" size="lg" className="w-full mb-4">
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
              {language === 'bn' ? 'সব প্ল্যানে অন্তর্ভুক্ত' : 'Included in All Plans'}
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
              {language === 'bn' ? 'কাস্টম VPS ফিচার' : 'Custom VPS Features'}
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
              {language === 'bn' ? 'বিশেষ প্রয়োজন?' : 'Special Requirements?'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের সেলস টিমের সাথে যোগাযোগ করুন এবং আপনার নির্দিষ্ট প্রয়োজন অনুযায়ী কাস্টম কোট পান।'
                : 'Contact our sales team and get a custom quote tailored to your specific needs.'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'সেলস টিমে যোগাযোগ করুন' : 'Contact Sales'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CustomVPS;
