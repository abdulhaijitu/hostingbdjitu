import React, { useState } from 'react';
import { Check, ArrowRight, Server, Shield, Zap, Headphones, Clock, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const WHMcPanelVPS: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { language } = useLanguage();

  const plans = [
    { 
      name: 'WHM VPS 1', 
      monthlyPrice: 2999,
      yearlyPrice: 29990,
      cpu: '2 vCPU', 
      ram: '4 GB RAM', 
      storage: '80 GB NVMe', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? '১০ cPanel অ্যাকাউন্ট' : '10 cPanel Accounts'
    },
    { 
      name: 'WHM VPS 2', 
      monthlyPrice: 4999,
      yearlyPrice: 49990,
      cpu: '4 vCPU', 
      ram: '8 GB RAM', 
      storage: '160 GB NVMe', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? '৩০ cPanel অ্যাকাউন্ট' : '30 cPanel Accounts',
      featured: true 
    },
    { 
      name: 'WHM VPS 4', 
      monthlyPrice: 9999,
      yearlyPrice: 99990,
      cpu: '8 vCPU', 
      ram: '16 GB RAM', 
      storage: '320 GB NVMe', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited'
    },
  ];

  const comparisonFeatures = [
    { feature: language === 'bn' ? 'vCPU কোর' : 'vCPU Cores', vps1: '2', vps2: '4', vps4: '8' },
    { feature: language === 'bn' ? 'RAM' : 'RAM', vps1: '4 GB', vps2: '8 GB', vps4: '16 GB' },
    { feature: language === 'bn' ? 'NVMe স্টোরেজ' : 'NVMe Storage', vps1: '80 GB', vps2: '160 GB', vps4: '320 GB' },
    { feature: language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth', vps1: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', vps2: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', vps4: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' },
    { feature: language === 'bn' ? 'cPanel অ্যাকাউন্ট' : 'cPanel Accounts', vps1: '10', vps2: '30', vps4: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' },
    { feature: language === 'bn' ? 'WHM কন্ট্রোল প্যানেল' : 'WHM Control Panel', vps1: true, vps2: true, vps4: true },
    { feature: language === 'bn' ? 'cPanel লাইসেন্স' : 'cPanel License', vps1: true, vps2: true, vps4: true },
    { feature: language === 'bn' ? 'ফ্রি মাইগ্রেশন' : 'Free Migration', vps1: true, vps2: true, vps4: true },
    { feature: language === 'bn' ? 'ডেডিকেটেড IP' : 'Dedicated IP', vps1: '1', vps2: '2', vps4: '3' },
    { feature: language === 'bn' ? 'ফুল রুট অ্যাক্সেস' : 'Full Root Access', vps1: true, vps2: true, vps4: true },
    { feature: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', vps1: true, vps2: true, vps4: true },
    { feature: language === 'bn' ? 'সাপ্তাহিক ব্যাকআপ' : 'Weekly Backups', vps1: true, vps2: true, vps4: true },
    { feature: language === 'bn' ? 'দৈনিক ব্যাকআপ' : 'Daily Backups', vps1: false, vps2: true, vps4: true },
    { feature: language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support', vps1: false, vps2: true, vps4: true },
  ];

  const features = [
    { icon: Server, title: language === 'bn' ? 'WHM + cPanel' : 'WHM + cPanel', desc: language === 'bn' ? 'প্রি-ইনস্টলড এবং সম্পূর্ণ ম্যানেজড' : 'Pre-installed and fully managed' },
    { icon: Shield, title: language === 'bn' ? 'সম্পূর্ণ সুরক্ষা' : 'Full Security', desc: language === 'bn' ? 'DDoS প্রোটেকশন ও ফায়ারওয়াল' : 'DDoS protection & firewall' },
    { icon: Zap, title: language === 'bn' ? 'NVMe স্টোরেজ' : 'NVMe Storage', desc: language === 'bn' ? 'অতি দ্রুত পারফরম্যান্স' : 'Ultra-fast performance' },
    { icon: Headphones, title: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support', desc: language === 'bn' ? 'এক্সপার্ট সহায়তা সর্বদা' : 'Expert help always available' },
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'WHM/cPanel VPS' : 'WHM/cPanel VPS'}
        description={language === 'bn' ? 'WHM এবং cPanel প্রি-ইনস্টলড ম্যানেজড VPS। একাধিক ওয়েবসাইট এবং ক্লায়েন্ট হোস্টিংয়ের জন্য পারফেক্ট।' : 'Managed VPS with WHM and cPanel pre-installed. Perfect for hosting multiple websites and clients.'}
        keywords="WHM VPS, cPanel VPS, managed VPS, Bangladesh"
        canonicalUrl="/vps/whm-cpanel"
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Server className="h-4 w-4" />
            <span>{language === 'bn' ? 'ম্যানেজড VPS সল্যুশন' : 'Managed VPS Solution'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">WHM & cPanel</span> VPS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'WHM এবং cPanel প্রি-ইনস্টলড ম্যানেজড VPS। একাধিক ওয়েবসাইট এবং ক্লায়েন্ট হোস্টিংয়ের জন্য পারফেক্ট।'
              : 'Managed VPS with WHM and cPanel pre-installed. Perfect for hosting multiple websites and clients.'}
          </p>
          <Button variant="hero" size="xl">
            {language === 'bn' ? 'শুরু করুন' : 'Get Started'} <ArrowRight className="ml-2 h-5 w-5" />
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
              {language === 'bn' ? 'WHM VPS প্ল্যান' : 'WHM VPS Plans'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন' : 'Choose the plan that fits your needs'}
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
                <div className="flex items-baseline gap-1 mb-4">
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
                    <Check className="h-5 w-5 text-accent" /> {plan.ram}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.storage}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.bandwidth} {language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.accounts}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> cPanel/WHM {language === 'bn' ? 'অন্তর্ভুক্ত' : 'Included'}
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
                    <th className="text-center p-4 font-medium">WHM VPS 1</th>
                    <th className="text-center p-4 font-medium text-primary">WHM VPS 2</th>
                    <th className="text-center p-4 font-medium">WHM VPS 4</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="p-4 font-medium">{item.feature}</td>
                      <td className="p-4 text-center">
                        {typeof item.vps1 === 'boolean' ? (
                          item.vps1 ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{item.vps1}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {typeof item.vps2 === 'boolean' ? (
                          item.vps2 ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="font-medium text-primary">{item.vps2}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof item.vps4 === 'boolean' ? (
                          item.vps4 ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{item.vps4}</span>
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
              {language === 'bn' ? 'আজই শুরু করুন' : 'Get Started Today'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'WHM/cPanel সহ ম্যানেজড VPS দিয়ে আপনার হোস্টিং বিজনেস বা ওয়েবসাইট পরিচালনা করুন।'
                : 'Manage your hosting business or websites with managed VPS including WHM/cPanel.'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'প্ল্যান বেছে নিন' : 'Choose a Plan'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WHMcPanelVPS;
