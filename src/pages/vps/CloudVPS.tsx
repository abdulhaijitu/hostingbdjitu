import React, { useState } from 'react';
import { Check, X, ArrowRight, Cloud, Cpu, HardDrive, Globe, Shield, Zap, Clock, Headphones, Award, Server, MemoryStick } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import SEOHead from '@/components/common/SEOHead';
import { ProductSchema, FAQSchema, BreadcrumbSchema } from '@/components/common/SchemaMarkup';
import { WHMCS_URLS, redirectToWHMCS } from '@/lib/whmcsConfig';

const CloudVPS: React.FC = () => {
  const { language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    { icon: Cpu, title: language === 'bn' ? 'ডেডিকেটেড রিসোর্স' : 'Dedicated Resources', desc: language === 'bn' ? 'গ্যারান্টিড CPU ও RAM' : 'Guaranteed CPU & RAM' },
    { icon: HardDrive, title: language === 'bn' ? 'NVMe SSD স্টোরেজ' : 'NVMe SSD Storage', desc: language === 'bn' ? 'আলট্রা-ফাস্ট পারফরম্যান্স' : 'Ultra-fast performance' },
    { icon: Globe, title: language === 'bn' ? 'গ্লোবাল লোকেশন' : 'Global Locations', desc: language === 'bn' ? 'ইউজারের কাছে ডিপ্লয়' : 'Deploy close to users' },
    { icon: Cloud, title: language === 'bn' ? 'ইনস্ট্যান্ট স্কেলিং' : 'Instant Scaling', desc: language === 'bn' ? 'অন-ডিমান্ড রিসোর্স' : 'Scale on demand' },
  ];

  const plans = [
    {
      name: 'VPS 1',
      monthlyPrice: '৳999',
      yearlyPrice: '৳799',
      cpu: language === 'bn' ? '১ vCPU' : '1 vCPU',
      ram: language === 'bn' ? '২ GB RAM' : '2 GB RAM',
      storage: language === 'bn' ? '৪০ GB NVMe' : '40 GB NVMe',
      bandwidth: '2 TB',
      ipv4: '1',
      description: language === 'bn' ? 'ছোট প্রজেক্টের জন্য' : 'For small projects',
      features: { rootAccess: true, ddos: true, snapshot: false, backup: 'weekly', monitoring: false, prioritySupport: false },
    },
    {
      name: 'VPS 2',
      monthlyPrice: '৳1,999',
      yearlyPrice: '৳1,599',
      cpu: language === 'bn' ? '২ vCPU' : '2 vCPU',
      ram: language === 'bn' ? '৪ GB RAM' : '4 GB RAM',
      storage: language === 'bn' ? '৮০ GB NVMe' : '80 GB NVMe',
      bandwidth: '4 TB',
      ipv4: '1',
      description: language === 'bn' ? 'ক্রমবর্ধমান অ্যাপের জন্য' : 'For growing apps',
      featured: true,
      features: { rootAccess: true, ddos: true, snapshot: true, backup: 'daily', monitoring: true, prioritySupport: false },
    },
    {
      name: 'VPS 4',
      monthlyPrice: '৳3,999',
      yearlyPrice: '৳3,199',
      cpu: language === 'bn' ? '৪ vCPU' : '4 vCPU',
      ram: language === 'bn' ? '৮ GB RAM' : '8 GB RAM',
      storage: language === 'bn' ? '১৬০ GB NVMe' : '160 GB NVMe',
      bandwidth: '6 TB',
      ipv4: '2',
      description: language === 'bn' ? 'প্রোডাকশন ওয়ার্কলোডের জন্য' : 'For production workloads',
      features: { rootAccess: true, ddos: true, snapshot: true, backup: 'daily', monitoring: true, prioritySupport: false },
    },
    {
      name: 'VPS 8',
      monthlyPrice: '৳7,999',
      yearlyPrice: '৳6,399',
      cpu: language === 'bn' ? '৮ vCPU' : '8 vCPU',
      ram: language === 'bn' ? '১৬ GB RAM' : '16 GB RAM',
      storage: language === 'bn' ? '৩২০ GB NVMe' : '320 GB NVMe',
      bandwidth: '8 TB',
      ipv4: '2',
      description: language === 'bn' ? 'হাই-ট্রাফিক অ্যাপের জন্য' : 'For high-traffic apps',
      features: { rootAccess: true, ddos: true, snapshot: true, backup: 'realtime', monitoring: true, prioritySupport: true },
    },
  ];

  const comparisonFeatures = [
    { key: 'cpu', label: 'vCPU', icon: Cpu },
    { key: 'ram', label: 'RAM', icon: MemoryStick },
    { key: 'storage', label: language === 'bn' ? 'স্টোরেজ' : 'Storage', icon: HardDrive },
    { key: 'bandwidth', label: language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth', icon: Zap },
    { key: 'ipv4', label: 'IPv4', icon: Globe },
    { key: 'rootAccess', label: language === 'bn' ? 'রুট অ্যাক্সেস' : 'Root Access', icon: Server },
    { key: 'ddos', label: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', icon: Shield },
    { key: 'snapshot', label: language === 'bn' ? 'স্ন্যাপশট' : 'Snapshots', icon: HardDrive },
    { key: 'backup', label: language === 'bn' ? 'ব্যাকআপ' : 'Backups', icon: Server },
    { key: 'monitoring', label: language === 'bn' ? 'মনিটরিং' : 'Monitoring', icon: Clock },
    { key: 'prioritySupport', label: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', icon: Headphones },
  ];

  const getFeatureValue = (plan: typeof plans[0], key: string) => {
    if (key === 'cpu') return plan.cpu;
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
      <SEOHead
        title={language === 'bn' ? 'ক্লাউড VPS' : 'Cloud VPS'}
        description={language === 'bn' ? 'ফুল রুট অ্যাক্সেস, NVMe SSD স্টোরেজ এবং এন্টারপ্রাইজ-গ্রেড পারফরম্যান্স সহ শক্তিশালী ক্লাউড VPS।' : 'Powerful cloud VPS with full root access, NVMe SSD storage, and enterprise-grade performance.'}
        keywords="cloud VPS, virtual server, VPS hosting, Bangladesh VPS"
        canonicalUrl="/vps/cloud"
      />
      <ProductSchema 
        name="Cloud VPS"
        description="Powerful cloud VPS with full root access, NVMe SSD storage, and enterprise-grade performance."
        price="999"
        url="/vps/cloud"
        category="VPS Hosting"
      />
      <FAQSchema faqs={[
        { question: "What is Cloud VPS?", answer: "Cloud VPS is a virtual private server hosted on cloud infrastructure with dedicated resources and full root access." },
        { question: "Do I get full root access?", answer: "Yes, all VPS plans include full root access so you can install any software you need." },
        { question: "Can I scale resources?", answer: "Yes, you can easily upgrade your VPS resources anytime without downtime." }
      ]} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'VPS', url: '/vps' },
        { name: 'Cloud VPS', url: '/vps/cloud' }
      ]} />
      {/* Hero */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Cloud className="h-4 w-4" />
            <span>{language === 'bn' ? 'হাই পারফরম্যান্স ক্লাউড' : 'High Performance Cloud'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in-up">
            <span className="text-gradient-primary">Cloud VPS</span> {language === 'bn' ? 'হোস্টিং' : 'Hosting'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {language === 'bn' 
              ? 'ফুল রুট অ্যাক্সেস, NVMe SSD স্টোরেজ এবং এন্টারপ্রাইজ-গ্রেড পারফরম্যান্স সহ শক্তিশালী ভার্চুয়াল সার্ভার।'
              : 'Deploy powerful virtual servers with full root access, NVMe SSD storage, and enterprise-grade performance.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#pricing">
                {language === 'bn' ? 'VPS কনফিগার করুন' : 'Configure VPS'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#comparison">{language === 'bn' ? 'প্ল্যান তুলনা' : 'Compare Plans'}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="feature-card text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
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
              {language === 'bn' ? 'Cloud VPS প্ল্যান' : 'Cloud VPS Plans'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'সব প্ল্যানে DDoS প্রোটেকশন, রুট অ্যাক্সেস এবং ২৪/৭ সাপোর্ট' : 'All plans include DDoS protection, full root access, and 24/7 support'}
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={cn('relative rounded-2xl transition-all', plan.featured ? 'pricing-card-featured' : 'pricing-card')}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                      <Award className="h-3 w-3" /> {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <h3 className={cn('text-lg font-semibold font-display mb-1', plan.featured ? 'text-primary-foreground' : '')}>{plan.name}</h3>
                  <p className={cn('text-xs mb-4', plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={cn('text-3xl font-bold', plan.featured ? 'text-primary-foreground' : '')}>{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                    <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Cpu className="h-4 w-4 text-accent" /> {plan.cpu}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><MemoryStick className="h-4 w-4 text-accent" /> {plan.ram}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><HardDrive className="h-4 w-4 text-accent" /> {plan.storage}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Zap className="h-4 w-4 text-accent" /> {plan.bandwidth}</li>
                  </ul>
                  <Button 
                    variant={plan.featured ? 'accent' : 'hero'} 
                    className="w-full"
                    onClick={() => redirectToWHMCS(WHMCS_URLS.vps.cloud)}
                  >
                    {language === 'bn' ? 'ডিপ্লয় করুন' : 'Deploy Now'}
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
              {language === 'bn' ? 'ফিচার তুলনা' : 'Feature Comparison'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] bg-card rounded-2xl border border-border overflow-hidden">
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
    </Layout>
  );
};

export default CloudVPS;