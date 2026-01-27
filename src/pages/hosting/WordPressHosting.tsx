import React, { useState } from 'react';
import { Check, X, ArrowRight, Shield, Zap, Clock, Headphones, HardDrive, Globe, Server, Database, Award, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import SEOHead from '@/components/common/SEOHead';
import { ProductSchema, FAQSchema, BreadcrumbSchema } from '@/components/common/SchemaMarkup';
import { redirectToWHMCS, getHostingStoreUrl } from '@/lib/whmcsConfig';

const WordPressHosting: React.FC = () => {
  const { language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    { icon: Zap, title: language === 'bn' ? '১-ক্লিক ইনস্টল' : '1-Click Install', desc: language === 'bn' ? 'ওয়ার্ডপ্রেস সেকেন্ডে' : 'WordPress in seconds' },
    { icon: RefreshCw, title: language === 'bn' ? 'অটো আপডেট' : 'Auto Updates', desc: language === 'bn' ? 'সবসময় আপডেটেড' : 'Always up to date' },
    { icon: Shield, title: 'LiteSpeed Cache', desc: language === 'bn' ? 'সুপার ফাস্ট লোডিং' : 'Super fast loading' },
    { icon: Server, title: language === 'bn' ? 'স্টেজিং' : 'Staging', desc: language === 'bn' ? 'টেস্ট করে পাবলিশ' : 'Test before publish' },
  ];

  const plans = [
    {
      name: language === 'bn' ? 'WP স্টার্টার' : 'WP Starter',
      monthlyPrice: '৳499',
      yearlyPrice: '৳399',
      sites: language === 'bn' ? '১টি সাইট' : '1 Site',
      storage: language === 'bn' ? '১০ GB NVMe' : '10 GB NVMe',
      visits: language === 'bn' ? '২৫,০০০ ভিজিট/মাস' : '25,000 visits/mo',
      description: language === 'bn' ? 'ব্যক্তিগত ব্লগের জন্য' : 'For personal blogs',
      features: {
        autoUpdates: true,
        freeSSL: true,
        dailyBackups: true,
        staging: false,
        litespeed: true,
        woocommerce: false,
        cdn: false,
        malwareRemoval: false,
        prioritySupport: false,
      },
    },
    {
      name: language === 'bn' ? 'WP প্রো' : 'WP Pro',
      monthlyPrice: '৳999',
      yearlyPrice: '৳799',
      sites: language === 'bn' ? '৩টি সাইট' : '3 Sites',
      storage: language === 'bn' ? '৩০ GB NVMe' : '30 GB NVMe',
      visits: language === 'bn' ? '১,০০,০০০ ভিজিট/মাস' : '100,000 visits/mo',
      description: language === 'bn' ? 'ব্যবসায়িক সাইটের জন্য' : 'For business sites',
      featured: true,
      features: {
        autoUpdates: true,
        freeSSL: true,
        dailyBackups: true,
        staging: true,
        litespeed: true,
        woocommerce: true,
        cdn: true,
        malwareRemoval: false,
        prioritySupport: false,
      },
    },
    {
      name: language === 'bn' ? 'WP বিজনেস' : 'WP Business',
      monthlyPrice: '৳1,999',
      yearlyPrice: '৳1,599',
      sites: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      storage: language === 'bn' ? '১০০ GB NVMe' : '100 GB NVMe',
      visits: language === 'bn' ? '৪,০০,০০০ ভিজিট/মাস' : '400,000 visits/mo',
      description: language === 'bn' ? 'এজেন্সি ও এন্টারপ্রাইজ' : 'For agencies & enterprise',
      features: {
        autoUpdates: true,
        freeSSL: true,
        dailyBackups: true,
        staging: true,
        litespeed: true,
        woocommerce: true,
        cdn: true,
        malwareRemoval: true,
        prioritySupport: true,
      },
    },
  ];

  const comparisonFeatures = [
    { key: 'sites', label: language === 'bn' ? 'ওয়ার্ডপ্রেস সাইট' : 'WordPress Sites', icon: Globe },
    { key: 'storage', label: language === 'bn' ? 'স্টোরেজ' : 'Storage', icon: HardDrive },
    { key: 'visits', label: language === 'bn' ? 'মাসিক ভিজিট' : 'Monthly Visits', icon: Globe },
    { key: 'autoUpdates', label: language === 'bn' ? 'অটো আপডেট' : 'Auto Updates', icon: RefreshCw },
    { key: 'freeSSL', label: language === 'bn' ? 'ফ্রি SSL' : 'Free SSL', icon: Shield },
    { key: 'dailyBackups', label: language === 'bn' ? 'দৈনিক ব্যাকআপ' : 'Daily Backups', icon: Server },
    { key: 'staging', label: language === 'bn' ? 'স্টেজিং এনভায়রনমেন্ট' : 'Staging Environment', icon: Server },
    { key: 'litespeed', label: 'LiteSpeed Cache', icon: Zap },
    { key: 'woocommerce', label: language === 'bn' ? 'WooCommerce রেডি' : 'WooCommerce Ready', icon: Database },
    { key: 'cdn', label: 'CDN', icon: Globe },
    { key: 'malwareRemoval', label: language === 'bn' ? 'ম্যালওয়্যার রিমুভাল' : 'Malware Removal', icon: Shield },
    { key: 'prioritySupport', label: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', icon: Headphones },
  ];

  const getFeatureValue = (plan: typeof plans[0], key: string) => {
    if (key === 'sites') return plan.sites;
    if (key === 'storage') return plan.storage;
    if (key === 'visits') return plan.visits;
    return plan.features[key as keyof typeof plan.features];
  };

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'ওয়ার্ডপ্রেস হোস্টিং' : 'WordPress Hosting'}
        description={language === 'bn' ? 'ওয়ার্ডপ্রেসের জন্য বিশেষভাবে অপটিমাইজড হোস্টিং। ১-ক্লিক ইনস্টল, অটো আপডেট এবং LiteSpeed ক্যাশ।' : 'Optimized hosting for WordPress with 1-click install, auto updates, and LiteSpeed cache.'}
        keywords="WordPress hosting, managed WordPress, WP hosting, Bangladesh"
        canonicalUrl="/hosting/wordpress"
      />
      <ProductSchema 
        name="WordPress Hosting"
        description="Optimized hosting for WordPress with 1-click install, auto updates, and LiteSpeed cache."
        price="399"
        url="/hosting/wordpress"
        category="WordPress Hosting"
      />
      <FAQSchema faqs={[
        { question: "Is WordPress pre-installed?", answer: "Yes, WordPress is automatically installed with 1-click. You can start building your site immediately." },
        { question: "Are updates automatic?", answer: "Yes, WordPress core, themes, and plugins can be set to update automatically." },
        { question: "Is WooCommerce supported?", answer: "Yes, WooCommerce is fully supported on our WP Pro and WP Business plans." }
      ]} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Hosting', url: '/hosting' },
        { name: 'WordPress Hosting', url: '/hosting/wordpress' }
      ]} />
      {/* Hero */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span>{language === 'bn' ? 'ওয়ার্ডপ্রেস অপটিমাইজড' : 'WordPress Optimized'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in">
            <span className="text-gradient-primary">WordPress</span> {language === 'bn' ? 'হোস্টিং' : 'Hosting'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'ওয়ার্ডপ্রেসের জন্য বিশেষভাবে অপটিমাইজড হোস্টিং। ১-ক্লিক ইনস্টল, অটো আপডেট এবং LiteSpeed ক্যাশ।'
              : 'Optimized hosting built specifically for WordPress with 1-click install, auto updates, and LiteSpeed cache.'}
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
              {language === 'bn' ? 'ওয়ার্ডপ্রেস হোস্টিং প্ল্যান' : 'WordPress Hosting Plans'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'সব প্ল্যানে ১-ক্লিক ইনস্টল, ফ্রি SSL এবং ২৪/৭ সাপোর্ট' : 'All plans include 1-click install, Free SSL, and 24/7 support'}
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
                      <Award className="h-4 w-4" /> {language === 'bn' ? 'জনপ্রিয়' : 'Most Popular'}
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
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Globe className="h-4 w-4 text-accent" /> {plan.sites}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><HardDrive className="h-4 w-4 text-accent" /> {plan.storage}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Zap className="h-4 w-4 text-accent" /> {plan.visits}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><RefreshCw className="h-4 w-4 text-accent" /> {language === 'bn' ? 'অটো আপডেট' : 'Auto Updates'}</li>
                    <li className={cn('flex items-center gap-2', plan.featured ? 'text-primary-foreground' : '')}><Shield className="h-4 w-4 text-accent" /> LiteSpeed Cache</li>
                  </ul>
                  <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full" onClick={() => redirectToWHMCS(getHostingStoreUrl('wordpress'))}>
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
                            {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
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

      {/* Why WordPress Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'কেন আমাদের ওয়ার্ডপ্রেস হোস্টিং?' : 'Why Our WordPress Hosting?'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: language === 'bn' ? '১০x দ্রুত' : '10x Faster', desc: language === 'bn' ? 'LiteSpeed সার্ভার ও ক্যাশ' : 'LiteSpeed server & cache' },
              { icon: Shield, title: language === 'bn' ? 'সম্পূর্ণ নিরাপদ' : 'Fully Secure', desc: language === 'bn' ? 'Imunify360 প্রোটেকশন' : 'Imunify360 protection' },
              { icon: RefreshCw, title: language === 'bn' ? 'অটো ব্যাকআপ' : 'Auto Backups', desc: language === 'bn' ? 'দৈনিক ব্যাকআপ' : 'Daily backups' },
              { icon: Headphones, title: language === 'bn' ? 'WP এক্সপার্ট' : 'WP Experts', desc: language === 'bn' ? '২৪/৭ সাপোর্ট' : '24/7 support' },
            ].map((item, index) => (
              <div key={item.title} className="feature-card text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-primary text-primary-foreground text-center">
        <div className="container-wide">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            {language === 'bn' ? 'আজই আপনার ওয়ার্ডপ্রেস সাইট শুরু করুন' : 'Start Your WordPress Site Today'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {language === 'bn' 
              ? '১-ক্লিক ইনস্টল দিয়ে মাত্র কয়েক মিনিটে আপনার ওয়ার্ডপ্রেস সাইট চালু করুন।'
              : 'Launch your WordPress site in minutes with 1-click installation.'}
          </p>
          <Button variant="accent" size="xl" onClick={() => redirectToWHMCS(getHostingStoreUrl('wordpress'))}>
            {language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started Now'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default WordPressHosting;
