import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Shield, Zap, Clock, Server, HardDrive, Globe, Mail, Database, Headphones, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const WebHosting: React.FC = () => {
  const { language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: language === 'bn' ? 'স্টার্টার' : 'Starter',
      monthlyPrice: '৳299',
      yearlyPrice: '৳199',
      storage: language === 'bn' ? '১০ GB NVMe SSD' : '10 GB NVMe SSD',
      websites: language === 'bn' ? '১টি ওয়েবসাইট' : '1 Website',
      bandwidth: '100 GB',
      email: language === 'bn' ? '১টি ইমেইল' : '1 Email',
      databases: language === 'bn' ? '২টি ডেটাবেস' : '2 Databases',
      description: language === 'bn' ? 'ব্যক্তিগত ওয়েবসাইটের জন্য' : 'For personal websites',
      features: {
        ssl: true,
        backups: 'weekly',
        cpanel: true,
        uptime: '99.9%',
        ddos: false,
        domain: false,
        priority: false,
        staging: false,
      },
    },
    {
      name: language === 'bn' ? 'প্রফেশনাল' : 'Professional',
      monthlyPrice: '৳799',
      yearlyPrice: '৳599',
      storage: language === 'bn' ? '৫০ GB NVMe SSD' : '50 GB NVMe SSD',
      websites: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      email: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      databases: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      description: language === 'bn' ? 'ক্রমবর্ধমান ব্যবসার জন্য' : 'For growing businesses',
      featured: true,
      features: {
        ssl: true,
        backups: 'daily',
        cpanel: true,
        uptime: '99.99%',
        ddos: true,
        domain: true,
        priority: false,
        staging: true,
      },
    },
    {
      name: language === 'bn' ? 'বিজনেস' : 'Business',
      monthlyPrice: '৳1,499',
      yearlyPrice: '৳1,199',
      storage: language === 'bn' ? '১০০ GB NVMe SSD' : '100 GB NVMe SSD',
      websites: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      email: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      databases: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      description: language === 'bn' ? 'এন্টারপ্রাইজ সাইটের জন্য' : 'For enterprise sites',
      features: {
        ssl: true,
        backups: 'realtime',
        cpanel: true,
        uptime: '99.99%',
        ddos: true,
        domain: true,
        priority: true,
        staging: true,
      },
    },
  ];

  const comparisonFeatures = [
    { key: 'storage', label: language === 'bn' ? 'স্টোরেজ' : 'Storage', icon: HardDrive },
    { key: 'websites', label: language === 'bn' ? 'ওয়েবসাইট' : 'Websites', icon: Globe },
    { key: 'bandwidth', label: language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth', icon: Zap },
    { key: 'email', label: language === 'bn' ? 'ইমেইল একাউন্ট' : 'Email Accounts', icon: Mail },
    { key: 'databases', label: language === 'bn' ? 'ডেটাবেস' : 'Databases', icon: Database },
    { key: 'ssl', label: language === 'bn' ? 'ফ্রি SSL' : 'Free SSL', icon: Shield },
    { key: 'backups', label: language === 'bn' ? 'ব্যাকআপ' : 'Backups', icon: Server },
    { key: 'uptime', label: language === 'bn' ? 'আপটাইম গ্যারান্টি' : 'Uptime Guarantee', icon: Clock },
    { key: 'ddos', label: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', icon: Shield },
    { key: 'domain', label: language === 'bn' ? 'ফ্রি ডোমেইন' : 'Free Domain', icon: Globe },
    { key: 'priority', label: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', icon: Headphones },
    { key: 'staging', label: language === 'bn' ? 'স্টেজিং এনভায়রনমেন্ট' : 'Staging Environment', icon: Server },
  ];

  const getFeatureValue = (plan: typeof plans[0], key: string) => {
    if (key === 'storage') return plan.storage;
    if (key === 'websites') return plan.websites;
    if (key === 'bandwidth') return plan.bandwidth;
    if (key === 'email') return plan.email;
    if (key === 'databases') return plan.databases;
    if (key === 'uptime') return plan.features.uptime;
    if (key === 'backups') {
      const val = plan.features.backups;
      if (val === 'weekly') return language === 'bn' ? 'সাপ্তাহিক' : 'Weekly';
      if (val === 'daily') return language === 'bn' ? 'দৈনিক' : 'Daily';
      if (val === 'realtime') return language === 'bn' ? 'রিয়েল-টাইম' : 'Real-time';
    }
    const val = plan.features[key as keyof typeof plan.features];
    return typeof val === 'boolean' ? val : val;
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span>{language === 'bn' ? 'মাত্র ৳১৯৯/মাস থেকে শুরু' : 'Starting from ৳199/month'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in-up">
            {language === 'bn' ? 'দ্রুত ও নির্ভরযোগ্য' : 'Fast & Reliable'}{' '}
            <span className="text-gradient-primary">{language === 'bn' ? 'ওয়েব হোস্টিং' : 'Web Hosting'}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {language === 'bn' 
              ? 'আপনার ওয়েবসাইটকে শক্তিশালী করুন আমাদের হাই-পারফরম্যান্স হোস্টিং দিয়ে। NVMe SSD, ফ্রি SSL, এবং ২৪/৭ সাপোর্ট।'
              : 'Power your website with our high-performance hosting. NVMe SSD storage, free SSL, and 24/7 expert support included.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#pricing">
                {language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started Now'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <a href="#comparison">
                {language === 'bn' ? 'প্ল্যান তুলনা করুন' : 'Compare Plans'}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {[
              { icon: Shield, text: language === 'bn' ? 'ফ্রি SSL সার্টিফিকেট' : 'Free SSL Certificate' },
              { icon: Zap, text: language === 'bn' ? 'NVMe SSD স্টোরেজ' : 'NVMe SSD Storage' },
              { icon: Clock, text: language === 'bn' ? '৯৯.৯৯% আপটাইম' : '99.99% Uptime' },
              { icon: Headphones, text: language === 'bn' ? '২৪/৭ সাপোর্ট' : '24/7 Support' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-accent" />
                <span className="font-medium">{item.text}</span>
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
              {language === 'bn' ? 'আপনার প্ল্যান বেছে নিন' : 'Choose Your Hosting Plan'}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {language === 'bn' ? 'সব প্ল্যানে ৩০ দিনের মানি-ব্যাক গ্যারান্টি' : 'All plans include 30-day money-back guarantee'}
            </p>

            {/* Monthly/Yearly Toggle */}
            <div className="inline-flex items-center gap-4 p-1.5 bg-muted rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  !isYearly 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {language === 'bn' ? 'মাসিক' : 'Monthly'}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative",
                  isYearly 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {language === 'bn' ? 'বার্ষিক' : 'Yearly'}
                {!isYearly && (
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full animate-pulse">
                    -33%
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl transition-all duration-300',
                  plan.featured ? 'pricing-card-featured scale-105 z-10' : 'pricing-card'
                )}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      <Award className="h-4 w-4" />
                      {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                    </span>
                  </div>
                )}

                <div className="p-6 lg:p-8">
                  <h3 className={cn(
                    'text-xl font-semibold font-display mb-2',
                    plan.featured ? 'text-primary-foreground' : 'text-foreground'
                  )}>
                    {plan.name}
                  </h3>
                  <p className={cn(
                    'text-sm mb-4',
                    plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        'text-4xl lg:text-5xl font-bold font-display transition-all',
                        plan.featured ? 'text-primary-foreground' : 'text-foreground'
                      )}>
                        {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                        /{language === 'bn' ? 'মাস' : 'mo'}
                      </span>
                    </div>
                    {isYearly && (
                      <p className={cn(
                        'text-sm mt-1',
                        plan.featured ? 'text-accent' : 'text-accent'
                      )}>
                        {language === 'bn' ? '২ মাস ফ্রি!' : '2 months free!'}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}>
                      <HardDrive className="h-4 w-4 text-accent" />
                      {plan.storage}
                    </li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}>
                      <Globe className="h-4 w-4 text-accent" />
                      {plan.websites}
                    </li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}>
                      <Zap className="h-4 w-4 text-accent" />
                      {plan.bandwidth} {language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
                    </li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}>
                      <Mail className="h-4 w-4 text-accent" />
                      {plan.email}
                    </li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}>
                      <Shield className="h-4 w-4 text-accent" />
                      {language === 'bn' ? 'ফ্রি SSL' : 'Free SSL'}
                    </li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}>
                      <Clock className="h-4 w-4 text-accent" />
                      {plan.features.uptime} {language === 'bn' ? 'আপটাইম' : 'Uptime'}
                    </li>
                  </ul>

                  <Button
                    variant={plan.featured ? 'accent' : 'hero'}
                    size="lg"
                    className="w-full"
                  >
                    {language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section id="comparison" className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'বিস্তারিত ফিচার তুলনা' : 'Detailed Feature Comparison'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'bn' ? 'প্রতিটি প্ল্যানে কী কী আছে দেখুন' : 'See what is included in each plan'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] bg-card rounded-2xl border border-border overflow-hidden">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 font-semibold text-foreground">
                    {language === 'bn' ? 'ফিচার' : 'Features'}
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.name} className={cn(
                      'p-4 text-center font-semibold',
                      plan.featured ? 'bg-primary text-primary-foreground' : 'text-foreground'
                    )}>
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
                  <tr key={feature.key} className={cn(
                    'border-t border-border',
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  )}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <feature.icon className="h-4 w-4 text-accent" />
                        <span className="font-medium text-foreground">{feature.label}</span>
                      </div>
                    </td>
                    {plans.map((plan) => {
                      const value = getFeatureValue(plan, feature.key);
                      return (
                        <td key={plan.name} className={cn(
                          'p-4 text-center',
                          plan.featured ? 'bg-primary/5' : ''
                        )}>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="h-5 w-5 text-success mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                            )
                          ) : (
                            <span className="text-foreground font-medium">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {/* Price Row */}
                <tr className="border-t-2 border-accent/30 bg-accent/5">
                  <td className="p-4 font-semibold text-foreground">
                    {language === 'bn' ? 'মাসিক মূল্য' : 'Monthly Price'}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.name} className={cn(
                      'p-4 text-center',
                      plan.featured ? 'bg-primary/10' : ''
                    )}>
                      <div className="font-bold text-xl text-foreground">
                        {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </div>
                      <Button 
                        variant={plan.featured ? 'hero' : 'outline'} 
                        size="sm" 
                        className="mt-2"
                      >
                        {language === 'bn' ? 'বেছে নিন' : 'Select'}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-primary text-primary-foreground text-center">
        <div className="container-wide">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            {language === 'bn' ? 'আজই শুরু করুন!' : 'Start Today!'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {language === 'bn' 
              ? '৩০ দিনের মানি-ব্যাক গ্যারান্টি সহ ঝুঁকিমুক্ত হোস্টিং ট্রাই করুন।'
              : 'Try our hosting risk-free with 30-day money-back guarantee.'}
          </p>
          <Button variant="accent" size="xl">
            {language === 'bn' ? 'এখনই অর্ডার করুন' : 'Order Now'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default WebHosting;