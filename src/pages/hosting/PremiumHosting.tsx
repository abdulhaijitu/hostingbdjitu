import React, { useState } from 'react';
import { Check, X, ArrowRight, Crown, Zap, Shield, Clock, Headphones, HardDrive, Globe, Server, Database, Mail, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import SEOHead from '@/components/common/SEOHead';
import { ProductSchema, FAQSchema } from '@/components/common/SchemaMarkup';

const PremiumHosting: React.FC = () => {
  const { language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    { icon: Zap, title: language === 'bn' ? 'LiteSpeed সার্ভার' : 'LiteSpeed Web Server', desc: language === 'bn' ? 'Apache থেকে ১০গুণ দ্রুত' : 'Up to 10x faster than Apache' },
    { icon: Shield, title: language === 'bn' ? 'অ্যাডভান্সড সিকিউরিটি' : 'Advanced Security', desc: language === 'bn' ? 'Imunify360 ও DDoS প্রোটেকশন' : 'Imunify360 & DDoS protection' },
    { icon: Clock, title: language === 'bn' ? '৯৯.৯৯% আপটাইম' : '99.99% Uptime SLA', desc: language === 'bn' ? 'এন্টারপ্রাইজ-গ্রেড নির্ভরযোগ্যতা' : 'Enterprise-grade reliability' },
    { icon: Crown, title: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', desc: language === 'bn' ? 'গড় ৫ মিনিটে রেসপন্স' : 'Average response under 5 minutes' },
  ];

  const plans = [
    {
      name: language === 'bn' ? 'প্রিমিয়াম বেসিক' : 'Premium Basic',
      monthlyPrice: '৳999',
      yearlyPrice: '৳799',
      storage: language === 'bn' ? '৫০ GB NVMe' : '50 GB NVMe',
      websites: language === 'bn' ? '৫টি ওয়েবসাইট' : '5 Websites',
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      email: language === 'bn' ? '১০টি ইমেইল' : '10 Emails',
      databases: '10',
      description: language === 'bn' ? 'ক্রমবর্ধমান সাইটের জন্য' : 'For growing sites',
      features: {
        litespeed: true,
        staging: true,
        dailyBackup: true,
        realtimeBackup: false,
        freeSSL: true,
        freeDomain: false,
        imunify360: true,
        ddos: true,
        prioritySupport: false,
        dedicatedIP: false,
        cdn: false,
      },
    },
    {
      name: language === 'bn' ? 'প্রিমিয়াম প্লাস' : 'Premium Plus',
      monthlyPrice: '৳1,999',
      yearlyPrice: '৳1,599',
      storage: language === 'bn' ? '১০০ GB NVMe' : '100 GB NVMe',
      websites: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      email: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      databases: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      description: language === 'bn' ? 'ব্যবসার জন্য আদর্শ' : 'Ideal for business',
      featured: true,
      features: {
        litespeed: true,
        staging: true,
        dailyBackup: true,
        realtimeBackup: true,
        freeSSL: true,
        freeDomain: true,
        imunify360: true,
        ddos: true,
        prioritySupport: true,
        dedicatedIP: false,
        cdn: true,
      },
    },
    {
      name: language === 'bn' ? 'প্রিমিয়াম প্রো' : 'Premium Pro',
      monthlyPrice: '৳3,999',
      yearlyPrice: '৳3,199',
      storage: language === 'bn' ? '২০০ GB NVMe' : '200 GB NVMe',
      websites: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      email: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      databases: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      description: language === 'bn' ? 'এন্টারপ্রাইজ সাইটের জন্য' : 'For enterprise sites',
      features: {
        litespeed: true,
        staging: true,
        dailyBackup: true,
        realtimeBackup: true,
        freeSSL: true,
        freeDomain: true,
        imunify360: true,
        ddos: true,
        prioritySupport: true,
        dedicatedIP: true,
        cdn: true,
      },
    },
  ];

  const comparisonFeatures = [
    { key: 'storage', label: language === 'bn' ? 'স্টোরেজ' : 'Storage', icon: HardDrive },
    { key: 'websites', label: language === 'bn' ? 'ওয়েবসাইট' : 'Websites', icon: Globe },
    { key: 'bandwidth', label: language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth', icon: Zap },
    { key: 'email', label: language === 'bn' ? 'ইমেইল একাউন্ট' : 'Email Accounts', icon: Mail },
    { key: 'databases', label: language === 'bn' ? 'ডেটাবেস' : 'Databases', icon: Database },
    { key: 'litespeed', label: 'LiteSpeed Cache', icon: Zap },
    { key: 'staging', label: language === 'bn' ? 'স্টেজিং এনভায়রনমেন্ট' : 'Staging Environment', icon: Server },
    { key: 'dailyBackup', label: language === 'bn' ? 'দৈনিক ব্যাকআপ' : 'Daily Backups', icon: Server },
    { key: 'realtimeBackup', label: language === 'bn' ? 'রিয়েল-টাইম ব্যাকআপ' : 'Real-time Backups', icon: Server },
    { key: 'freeSSL', label: language === 'bn' ? 'ফ্রি SSL' : 'Free SSL', icon: Shield },
    { key: 'freeDomain', label: language === 'bn' ? 'ফ্রি ডোমেইন' : 'Free Domain', icon: Globe },
    { key: 'imunify360', label: 'Imunify360', icon: Shield },
    { key: 'ddos', label: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', icon: Shield },
    { key: 'prioritySupport', label: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', icon: Headphones },
    { key: 'dedicatedIP', label: language === 'bn' ? 'ডেডিকেটেড IP' : 'Dedicated IP', icon: Globe },
    { key: 'cdn', label: 'CDN', icon: Globe },
  ];

  const getFeatureValue = (plan: typeof plans[0], key: string) => {
    if (key === 'storage') return plan.storage;
    if (key === 'websites') return plan.websites;
    if (key === 'bandwidth') return plan.bandwidth;
    if (key === 'email') return plan.email;
    if (key === 'databases') return plan.databases;
    return plan.features[key as keyof typeof plan.features];
  };

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'প্রিমিয়াম হোস্টিং' : 'Premium Hosting'}
        description={language === 'bn' ? 'LiteSpeed সার্ভার, অ্যাডভান্সড সিকিউরিটি এবং প্রায়োরিটি সাপোর্ট সহ প্রিমিয়াম ওয়েব হোস্টিং সার্ভিস।' : 'Premium web hosting with LiteSpeed servers, advanced security, and priority support for your business.'}
        keywords="premium hosting, LiteSpeed hosting, enterprise hosting, Bangladesh hosting"
        canonicalUrl="/hosting/premium"
      />
      <ProductSchema 
        name="Premium Hosting"
        description="Premium web hosting with LiteSpeed servers, advanced security, and priority support."
        price="799"
        url="/hosting/premium"
        category="Premium Hosting"
      />
      <FAQSchema faqs={[
        { question: "What makes Premium Hosting different?", answer: "Premium hosting includes LiteSpeed web server, Imunify360 security, real-time backups, and priority support with 5-minute response time." },
        { question: "Is LiteSpeed faster than Apache?", answer: "Yes, LiteSpeed is up to 10x faster than Apache for serving web content." },
        { question: "Do I get a dedicated IP?", answer: "Dedicated IP is included in the Premium Pro plan." }
      ]} />
      {/* Hero */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Crown className="h-4 w-4" />
            <span>{language === 'bn' ? 'এন্টারপ্রাইজ পারফরম্যান্স' : 'Enterprise Performance'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in">
            <span className="text-gradient-primary">Premium</span> {language === 'bn' ? 'ওয়েব হোস্টিং' : 'Web Hosting'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'LiteSpeed সার্ভার, অ্যাডভান্সড সিকিউরিটি এবং প্রায়োরিটি সাপোর্ট সহ অতুলনীয় পারফরম্যান্স অভিজ্ঞতা।'
              : 'Experience unparalleled performance with LiteSpeed servers, advanced security, and priority support.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <a href="#pricing">
                {language === 'bn' ? 'প্ল্যান দেখুন' : 'View Plans'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#comparison">{language === 'bn' ? 'ফিচার তুলনা' : 'Compare Features'}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <feature.icon className="h-5 w-5 text-accent" />
                <div>
                  <span className="font-medium">{feature.title}</span>
                  <span className="text-primary-foreground/70 text-sm ml-2 hidden sm:inline">{feature.desc}</span>
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
              {language === 'bn' ? 'প্রিমিয়াম হোস্টিং প্ল্যান' : 'Premium Hosting Plans'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'সব প্ল্যানে LiteSpeed, ফ্রি SSL এবং ২৪/৭ সাপোর্ট' : 'All plans include LiteSpeed, Free SSL, and 24/7 support'}
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
                      <Award className="h-4 w-4" /> {language === 'bn' ? 'সুপারিশকৃত' : 'Recommended'}
                    </span>
                  </div>
                )}
                <div className="p-6 lg:p-8">
                  <h3 className={cn('text-xl font-semibold font-display mb-1', plan.featured ? 'text-primary-foreground' : '')}>{plan.name}</h3>
                  <p className={cn('text-sm mb-4', plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={cn('text-4xl font-bold', plan.featured ? 'text-primary-foreground' : '')}>{isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                    <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>/{language === 'bn' ? 'মাস' : 'mo'}</span>
                  </div>
                  {isYearly && (
                    <p className={cn('text-sm mb-4', plan.featured ? 'text-accent' : 'text-accent')}>
                      {language === 'bn' ? '২ মাস ফ্রি!' : '2 months free!'}
                    </p>
                  )}
                  <ul className="space-y-3 mb-8">
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><HardDrive className="h-4 w-4 text-accent" /> {plan.storage}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Globe className="h-4 w-4 text-accent" /> {plan.websites}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Zap className="h-4 w-4 text-accent" /> {plan.bandwidth} {language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Mail className="h-4 w-4 text-accent" /> {plan.email}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Shield className="h-4 w-4 text-accent" /> {language === 'bn' ? 'ফ্রি SSL ও সিকিউরিটি' : 'Free SSL & Security'}</li>
                  </ul>
                  <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full">
                    {language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
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
                      <div>
                        {plan.name}
                        {plan.featured && (
                          <span className="block text-xs font-normal text-accent mt-1">
                            {language === 'bn' ? 'সুপারিশকৃত' : 'Recommended'}
                          </span>
                        )}
                      </div>
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
            {language === 'bn' ? 'এন্টারপ্রাইজ সলিউশন দরকার?' : 'Need Enterprise Solutions?'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'আমাদের সাথে যোগাযোগ করুন। আপনার প্রয়োজন অনুযায়ী কাস্টম সলিউশন তৈরি করে দেব।'
              : 'Contact us for custom solutions tailored to your specific requirements.'}
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

export default PremiumHosting;
