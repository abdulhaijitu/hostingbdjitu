import React, { useState } from 'react';
import { Check, ArrowRight, Server, Shield, Zap, Headphones, HardDrive, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const WHMcPanelDedicated: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { language } = useLanguage();

  const plans = [
    { 
      name: 'WHM DS-1', 
      monthlyPrice: 14999,
      yearlyPrice: 149990,
      cpu: 'Intel Xeon E3-1270',
      cores: '4 Cores / 8 Threads',
      ram: '32 GB DDR4', 
      storage: '1 TB SSD', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? '৫০ cPanel অ্যাকাউন্ট' : '50 cPanel Accounts'
    },
    { 
      name: 'WHM DS-2', 
      monthlyPrice: 24999,
      yearlyPrice: 249990,
      cpu: 'Intel Xeon E5-2650',
      cores: '8 Cores / 16 Threads',
      ram: '64 GB DDR4', 
      storage: '2x 1TB SSD RAID', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      featured: true 
    },
    { 
      name: 'WHM DS-4', 
      monthlyPrice: 39999,
      yearlyPrice: 399990,
      cpu: 'Intel Xeon Silver 4210',
      cores: '10 Cores / 20 Threads',
      ram: '128 GB DDR4', 
      storage: '4x 1TB NVMe RAID', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited'
    },
  ];

  const comparisonFeatures = [
    { feature: language === 'bn' ? 'প্রসেসর' : 'Processor', ds1: 'Xeon E3-1270', ds2: 'Xeon E5-2650', ds4: 'Xeon Silver 4210' },
    { feature: language === 'bn' ? 'কোর/থ্রেড' : 'Cores/Threads', ds1: '4/8', ds2: '8/16', ds4: '10/20' },
    { feature: 'RAM', ds1: '32 GB', ds2: '64 GB', ds4: '128 GB' },
    { feature: language === 'bn' ? 'স্টোরেজ' : 'Storage', ds1: '1 TB SSD', ds2: '2 TB RAID', ds4: '4 TB NVMe' },
    { feature: language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth', ds1: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', ds2: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', ds4: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' },
    { feature: language === 'bn' ? 'cPanel অ্যাকাউন্ট' : 'cPanel Accounts', ds1: '50', ds2: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', ds4: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' },
    { feature: language === 'bn' ? 'WHM লাইসেন্স' : 'WHM License', ds1: true, ds2: true, ds4: true },
    { feature: language === 'bn' ? 'cPanel লাইসেন্স' : 'cPanel License', ds1: true, ds2: true, ds4: true },
    { feature: language === 'bn' ? 'ফ্রি মাইগ্রেশন' : 'Free Migration', ds1: true, ds2: true, ds4: true },
    { feature: language === 'bn' ? 'ডেডিকেটেড IP' : 'Dedicated IPs', ds1: '1', ds2: '3', ds4: '5' },
    { feature: language === 'bn' ? 'IPMI অ্যাক্সেস' : 'IPMI Access', ds1: true, ds2: true, ds4: true },
    { feature: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', ds1: true, ds2: true, ds4: true },
    { feature: language === 'bn' ? 'দৈনিক ব্যাকআপ' : 'Daily Backups', ds1: false, ds2: true, ds4: true },
    { feature: language === 'bn' ? 'অফসাইট ব্যাকআপ' : 'Offsite Backups', ds1: false, ds2: false, ds4: true },
    { feature: language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support', ds1: false, ds2: true, ds4: true },
    { feature: language === 'bn' ? 'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার' : 'Dedicated Account Manager', ds1: false, ds2: false, ds4: true },
  ];

  const features = [
    { icon: Server, title: language === 'bn' ? 'WHM + cPanel' : 'WHM + cPanel', desc: language === 'bn' ? 'সম্পূর্ণ ম্যানেজড এবং লাইসেন্সড' : 'Fully managed and licensed' },
    { icon: Shield, title: language === 'bn' ? 'এন্টারপ্রাইজ সিকিউরিটি' : 'Enterprise Security', desc: language === 'bn' ? 'হার্ডওয়্যার ফায়ারওয়াল ও DDoS' : 'Hardware firewall & DDoS' },
    { icon: HardDrive, title: language === 'bn' ? 'RAID স্টোরেজ' : 'RAID Storage', desc: language === 'bn' ? 'ডাটা রিডান্ডেন্সি নিশ্চিত' : 'Data redundancy ensured' },
    { icon: Headphones, title: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support', desc: language === 'bn' ? 'এক্সপার্ট সহায়তা সর্বদা' : 'Expert help always available' },
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'WHM/cPanel ডেডিকেটেড' : 'WHM/cPanel Dedicated'}
        description={language === 'bn' ? 'WHM এবং cPanel সহ সম্পূর্ণ ম্যানেজড ডেডিকেটেড সার্ভার। হোস্টিং এজেন্সির জন্য পারফেক্ট।' : 'Fully managed dedicated servers with WHM and cPanel. Perfect for hosting agencies.'}
        keywords="WHM dedicated, cPanel dedicated, managed server, Bangladesh"
        canonicalUrl="/servers/whm-cpanel"
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Server className="h-4 w-4" />
            <span>{language === 'bn' ? 'এন্টারপ্রাইজ সল্যুশন' : 'Enterprise Solution'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">WHM & cPanel</span> {language === 'bn' ? 'ডেডিকেটেড' : 'Dedicated'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'WHM এবং cPanel সহ সম্পূর্ণ ম্যানেজড ডেডিকেটেড সার্ভার। হোস্টিং এজেন্সি এবং বড় ডিপ্লয়মেন্টের জন্য পারফেক্ট।'
              : 'Fully managed dedicated servers with WHM and cPanel. Perfect for hosting agencies and large-scale deployments.'}
          </p>
          <Button variant="hero" size="xl">
            {language === 'bn' ? 'প্ল্যান দেখুন' : 'View Plans'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 bg-primary/5 border-y border-border">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-2">
                <f.icon className="h-4 w-4 text-primary" />
                <span>{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'WHM ডেডিকেটেড প্ল্যান' : 'WHM Dedicated Plans'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'আপনার এন্টারপ্রাইজের জন্য সঠিক প্ল্যান বেছে নিন' : 'Choose the right plan for your enterprise'}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-muted">
              <button 
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${!isYearly ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {language === 'bn' ? 'মাসিক' : 'Monthly'}
              </button>
              <button 
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${isYearly ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {language === 'bn' ? 'বার্ষিক' : 'Yearly'}
                <span className="ml-2 text-xs text-accent">{language === 'bn' ? '১৭% সেভ' : 'Save 17%'}</span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                    </span>
                  </div>
                )}
                <h3 className={`text-xl font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    {formatPrice(isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice)}
                  </span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                    /{language === 'bn' ? 'মাস' : 'mo'}
                  </span>
                </div>
                {isYearly && (
                  <p className={`text-sm mb-4 ${plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {language === 'bn' ? 'বার্ষিক বিল' : 'Billed annually'}: {formatPrice(plan.yearlyPrice)}
                  </p>
                )}
                <ul className="space-y-3 mb-6">
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.cpu}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.cores}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.ram}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.storage}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.accounts}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> cPanel/WHM {language === 'bn' ? 'লাইসেন্স' : 'License'}
                  </li>
                </ul>
                <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full">
                  {language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}
                </Button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-2xl font-semibold font-display text-center">
                {language === 'bn' ? 'ফিচার তুলনা' : 'Feature Comparison'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium">{language === 'bn' ? 'ফিচার' : 'Feature'}</th>
                    <th className="text-center p-4 font-medium">WHM DS-1</th>
                    <th className="text-center p-4 font-medium text-primary">WHM DS-2</th>
                    <th className="text-center p-4 font-medium">WHM DS-4</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="p-4 font-medium">{item.feature}</td>
                      <td className="p-4 text-center">
                        {typeof item.ds1 === 'boolean' ? (
                          item.ds1 ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{item.ds1}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {typeof item.ds2 === 'boolean' ? (
                          item.ds2 ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="font-medium text-primary">{item.ds2}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof item.ds4 === 'boolean' ? (
                          item.ds4 ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{item.ds4}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'কাস্টম কনফিগারেশন দরকার?' : 'Need Custom Configuration?'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের সেলস টিমের সাথে যোগাযোগ করুন আপনার নির্দিষ্ট চাহিদা অনুযায়ী কাস্টম সার্ভার পেতে।'
                : 'Contact our sales team to get a custom server tailored to your specific needs.'}
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

export default WHMcPanelDedicated;
