import React, { useState } from 'react';
import { Check, X, ArrowRight, Server, Shield, Zap, Headphones, Cpu, HardDrive, Globe, Clock, MemoryStick, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const DedicatedServer: React.FC = () => {
  const { language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    { icon: Server, title: language === 'bn' ? 'বেয়ার মেটাল' : 'Bare Metal', desc: language === 'bn' ? 'সম্পূর্ণ হার্ডওয়্যার অ্যাক্সেস' : 'Full hardware access' },
    { icon: Zap, title: 'Intel Xeon', desc: language === 'bn' ? 'এন্টারপ্রাইজ প্রসেসর' : 'Enterprise processors' },
    { icon: Shield, title: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', desc: language === 'bn' ? '১Tbps পর্যন্ত' : 'Up to 1Tbps' },
    { icon: Headphones, title: language === 'bn' ? '২৪/৭ সাপোর্ট' : '24/7 Support', desc: language === 'bn' ? 'এক্সপার্ট সহায়তা' : 'Expert assistance' },
  ];

  const plans = [
    {
      name: 'DS-1',
      monthlyPrice: '৳9,999',
      yearlyPrice: '৳7,999',
      cpu: 'Intel Xeon E3-1230',
      cores: language === 'bn' ? '৪ কোর / ৮ থ্রেড' : '4 Cores / 8 Threads',
      ram: language === 'bn' ? '১৬ GB DDR4' : '16 GB DDR4',
      storage: language === 'bn' ? '৫০০ GB SSD' : '500 GB SSD',
      bandwidth: '10 TB',
      ipv4: '1',
      description: language === 'bn' ? 'স্টার্টআপের জন্য' : 'For startups',
      features: { raid: false, ipmi: false, backup: 'weekly', ddos: true, managedService: false, prioritySupport: false },
    },
    {
      name: 'DS-2',
      monthlyPrice: '৳14,999',
      yearlyPrice: '৳11,999',
      cpu: 'Intel Xeon E5-2620',
      cores: language === 'bn' ? '৬ কোর / ১২ থ্রেড' : '6 Cores / 12 Threads',
      ram: language === 'bn' ? '৩২ GB DDR4' : '32 GB DDR4',
      storage: language === 'bn' ? '১ TB SSD' : '1 TB SSD',
      bandwidth: '20 TB',
      ipv4: '2',
      description: language === 'bn' ? 'ক্রমবর্ধমান ব্যবসার জন্য' : 'For growing business',
      featured: true,
      features: { raid: true, ipmi: true, backup: 'daily', ddos: true, managedService: false, prioritySupport: true },
    },
    {
      name: 'DS-4',
      monthlyPrice: '৳24,999',
      yearlyPrice: '৳19,999',
      cpu: 'Intel Xeon Silver 4110',
      cores: language === 'bn' ? '৮ কোর / ১৬ থ্রেড' : '8 Cores / 16 Threads',
      ram: language === 'bn' ? '৬৪ GB DDR4' : '64 GB DDR4',
      storage: language === 'bn' ? '২x ১TB NVMe' : '2x 1TB NVMe',
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      ipv4: '4',
      description: language === 'bn' ? 'এন্টারপ্রাইজের জন্য' : 'For enterprise',
      features: { raid: true, ipmi: true, backup: 'realtime', ddos: true, managedService: true, prioritySupport: true },
    },
  ];

  const comparisonFeatures = [
    { key: 'cpu', label: 'CPU', icon: Cpu },
    { key: 'cores', label: language === 'bn' ? 'কোর / থ্রেড' : 'Cores / Threads', icon: Cpu },
    { key: 'ram', label: 'RAM', icon: MemoryStick },
    { key: 'storage', label: language === 'bn' ? 'স্টোরেজ' : 'Storage', icon: HardDrive },
    { key: 'bandwidth', label: language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth', icon: Zap },
    { key: 'ipv4', label: 'IPv4', icon: Globe },
    { key: 'raid', label: 'RAID', icon: HardDrive },
    { key: 'ipmi', label: 'IPMI Access', icon: Server },
    { key: 'ddos', label: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', icon: Shield },
    { key: 'backup', label: language === 'bn' ? 'ব্যাকআপ' : 'Backups', icon: Server },
    { key: 'managedService', label: language === 'bn' ? 'ম্যানেজড সার্ভিস' : 'Managed Service', icon: Headphones },
    { key: 'prioritySupport', label: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', icon: Headphones },
  ];

  const getFeatureValue = (plan: typeof plans[0], key: string) => {
    if (key === 'cpu') return plan.cpu;
    if (key === 'cores') return plan.cores;
    if (key === 'ram') return plan.ram;
    if (key === 'storage') return plan.storage;
    if (key === 'bandwidth') return plan.bandwidth;
    if (key === 'ipv4') return plan.ipv4;
    if (key === 'backup') {
      const val = plan.features.backup;
      if (val === 'weekly') return language === 'bn' ? 'সাপ্তাহিক' : 'Weekly';
      if (val === 'daily') return language === 'bn' ? 'দৈনিক' : 'Daily';
      if (val === 'realtime') return language === 'bn' ? 'রিয়েল-টাইম' : 'Real-time';
    }
    return plan.features[key as keyof typeof plan.features];
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Server className="h-4 w-4" />
            <span>{language === 'bn' ? 'এন্টারপ্রাইজ পারফরম্যান্স' : 'Enterprise Performance'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in-up">
            <span className="text-gradient-primary">{language === 'bn' ? 'ডেডিকেটেড' : 'Dedicated'}</span> {language === 'bn' ? 'সার্ভার' : 'Servers'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {language === 'bn' 
              ? 'Intel Xeon প্রসেসর, এন্টারপ্রাইজ SSD এবং আনলিমিটেড DDoS প্রোটেকশন সহ শক্তিশালী বেয়ার-মেটাল সার্ভার।'
              : 'Powerful bare-metal servers with Intel Xeon processors, enterprise SSDs, and unmetered DDoS protection.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#pricing">
                {language === 'bn' ? 'সার্ভার দেখুন' : 'View Servers'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#comparison">{language === 'bn' ? 'তুলনা করুন' : 'Compare Plans'}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Bar */}
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

      {/* Pricing Cards */}
      <section id="pricing" className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'ডেডিকেটেড সার্ভার প্ল্যান' : 'Dedicated Server Plans'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'সব প্ল্যানে ১Gbps পোর্ট এবং ২৪/৭ হার্ডওয়্যার সাপোর্ট' : 'All plans include 1Gbps port and 24/7 hardware support'}
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-4 p-1.5 bg-muted rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all",
                  !isYearly ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {language === 'bn' ? 'মাসিক' : 'Monthly'}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all relative",
                  isYearly ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {language === 'bn' ? 'বার্ষিক' : 'Yearly'}
                {!isYearly && <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full">-20%</span>}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={cn('relative rounded-2xl transition-all', plan.featured ? 'pricing-card-featured scale-105 z-10' : 'pricing-card')}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      <Award className="h-4 w-4" /> {language === 'bn' ? 'বেস্ট ভ্যালু' : 'Best Value'}
                    </span>
                  </div>
                )}
                <div className="p-6 lg:p-8">
                  <h3 className={cn('text-xl font-semibold font-display mb-1', plan.featured ? 'text-primary-foreground' : '')}>{plan.name}</h3>
                  <p className={cn('text-sm mb-4', plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={cn('text-4xl font-bold', plan.featured ? 'text-primary-foreground' : '')}>{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                    <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Cpu className="h-4 w-4 text-accent" /> {plan.cpu}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Cpu className="h-4 w-4 text-accent" /> {plan.cores}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><MemoryStick className="h-4 w-4 text-accent" /> {plan.ram}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><HardDrive className="h-4 w-4 text-accent" /> {plan.storage}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Zap className="h-4 w-4 text-accent" /> {plan.bandwidth} Bandwidth</li>
                  </ul>
                  <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full">
                    {language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'বিস্তারিত ফিচার তুলনা' : 'Detailed Feature Comparison'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] bg-card rounded-2xl border border-border overflow-hidden">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-semibold">{language === 'bn' ? 'ফিচার' : 'Features'}</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className={cn('p-4 text-center font-semibold', plan.featured ? 'bg-primary text-primary-foreground' : '')}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={feature.key} className={cn('border-t border-border', index % 2 === 0 ? 'bg-background' : 'bg-muted/20')}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <feature.icon className="h-4 w-4 text-accent" />
                        <span className="font-medium">{feature.label}</span>
                      </div>
                    </td>
                    {plans.map((plan) => {
                      const value = getFeatureValue(plan, feature.key);
                      return (
                        <td key={plan.name} className={cn('p-4 text-center', plan.featured ? 'bg-primary/5' : '')}>
                          {typeof value === 'boolean' ? (
                            value ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                          ) : (
                            <span className="font-medium">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-primary text-primary-foreground text-center">
        <div className="container-wide">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            {language === 'bn' ? 'কাস্টম কনফিগারেশন দরকার?' : 'Need Custom Configuration?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আমাদের সাথে যোগাযোগ করুন। আপনার প্রয়োজন অনুযায়ী কাস্টম সার্ভার কনফিগার করে দেব।'
              : 'Contact us to configure a custom server based on your requirements.'}
          </p>
          <Button variant="accent" size="xl" asChild>
            <a href="/contact">
              {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default DedicatedServer;