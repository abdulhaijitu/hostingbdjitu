import React, { useState } from 'react';
import { Check, ArrowRight, Users, Shield, Zap, Globe, Headphones, Server, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ResellerHosting: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { language } = useLanguage();

  const plans = [
    { 
      name: language === 'bn' ? 'রিসেলার বেসিক' : 'Reseller Basic', 
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      storage: '50 GB NVMe', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? '২৫ cPanel অ্যাকাউন্ট' : '25 cPanel Accounts', 
      features: [
        language === 'bn' ? 'WHM অ্যাক্সেস' : 'WHM Access', 
        language === 'bn' ? 'প্রাইভেট DNS' : 'Private DNS', 
        language === 'bn' ? 'বিনামূল্যে মাইগ্রেশন' : 'Free Migration'
      ] 
    },
    { 
      name: language === 'bn' ? 'রিসেলার প্রো' : 'Reseller Pro', 
      monthlyPrice: 3999,
      yearlyPrice: 39990,
      storage: '100 GB NVMe', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? '৫০ cPanel অ্যাকাউন্ট' : '50 cPanel Accounts', 
      features: [
        language === 'bn' ? 'WHM অ্যাক্সেস' : 'WHM Access', 
        language === 'bn' ? 'প্রাইভেট DNS' : 'Private DNS', 
        language === 'bn' ? 'বিনামূল্যে মাইগ্রেশন' : 'Free Migration', 
        language === 'bn' ? 'WHMCS লাইসেন্স' : 'WHMCS License'
      ], 
      featured: true 
    },
    { 
      name: language === 'bn' ? 'রিসেলার বিজনেস' : 'Reseller Business', 
      monthlyPrice: 6999,
      yearlyPrice: 69990,
      storage: '200 GB NVMe', 
      bandwidth: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited',
      accounts: language === 'bn' ? 'আনলিমিটেড অ্যাকাউন্ট' : 'Unlimited Accounts', 
      features: [
        language === 'bn' ? 'WHM অ্যাক্সেস' : 'WHM Access', 
        language === 'bn' ? 'প্রাইভেট DNS' : 'Private DNS', 
        language === 'bn' ? 'বিনামূল্যে মাইগ্রেশন' : 'Free Migration', 
        language === 'bn' ? 'WHMCS লাইসেন্স' : 'WHMCS License', 
        language === 'bn' ? 'ডেডিকেটেড IP' : 'Dedicated IP'
      ] 
    },
  ];

  const comparisonFeatures = [
    { 
      feature: language === 'bn' ? 'NVMe স্টোরেজ' : 'NVMe Storage', 
      basic: '50 GB', 
      pro: '100 GB', 
      business: '200 GB' 
    },
    { 
      feature: language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth', 
      basic: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', 
      pro: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', 
      business: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' 
    },
    { 
      feature: language === 'bn' ? 'cPanel অ্যাকাউন্ট' : 'cPanel Accounts', 
      basic: '25', 
      pro: '50', 
      business: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' 
    },
    { 
      feature: language === 'bn' ? 'WHM অ্যাক্সেস' : 'WHM Access', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'প্রাইভেট নেমসার্ভার' : 'Private Nameservers', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'বিনামূল্যে SSL' : 'Free SSL', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'WHMCS লাইসেন্স' : 'WHMCS License', 
      basic: false, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'ডেডিকেটেড IP' : 'Dedicated IP', 
      basic: false, 
      pro: false, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'হোয়াইট লেবেল ব্র্যান্ডিং' : 'White Label Branding', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'ক্লাউডলিনাক্স' : 'CloudLinux', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'লাইটস্পিড ওয়েব সার্ভার' : 'LiteSpeed Web Server', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'দৈনিক ব্যাকআপ' : 'Daily Backups', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'বিনামূল্যে মাইগ্রেশন' : 'Free Migration', 
      basic: true, 
      pro: true, 
      business: true 
    },
    { 
      feature: language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support', 
      basic: false, 
      pro: true, 
      business: true 
    },
  ];

  const features = [
    { 
      icon: Server, 
      title: language === 'bn' ? 'সম্পূর্ণ WHM নিয়ন্ত্রণ' : 'Full WHM Control',
      desc: language === 'bn' ? 'আপনার ক্লায়েন্টদের জন্য cPanel অ্যাকাউন্ট তৈরি করুন' : 'Create cPanel accounts for your clients'
    },
    { 
      icon: Shield, 
      title: language === 'bn' ? 'হোয়াইট লেবেল' : 'White Label',
      desc: language === 'bn' ? 'আপনার নিজের ব্র্যান্ড দিয়ে বিক্রি করুন' : 'Sell under your own brand'
    },
    { 
      icon: Zap, 
      title: language === 'bn' ? 'লাইটস্পিড সার্ভার' : 'LiteSpeed Server',
      desc: language === 'bn' ? 'অতি দ্রুত ওয়েবসাইট পারফরম্যান্স' : 'Ultra-fast website performance'
    },
    { 
      icon: Globe, 
      title: language === 'bn' ? 'প্রাইভেট নেমসার্ভার' : 'Private Nameservers',
      desc: language === 'bn' ? 'ns1.yourdomain.com সেটআপ করুন' : 'Set up ns1.yourdomain.com'
    },
    { 
      icon: Users, 
      title: language === 'bn' ? 'WHMCS বিলিং' : 'WHMCS Billing',
      desc: language === 'bn' ? 'অটোমেটেড বিলিং ও সাপোর্ট' : 'Automated billing & support'
    },
    { 
      icon: Headphones, 
      title: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support',
      desc: language === 'bn' ? 'সর্বদা সাহায্যের জন্য প্রস্তুত' : 'Always ready to help'
    },
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            <span>{language === 'bn' ? 'আপনার হোস্টিং বিজনেস শুরু করুন' : 'Start Your Hosting Business'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'রিসেলার' : 'Reseller'}</span> {language === 'bn' ? 'হোস্টিং' : 'Hosting'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আমাদের হোয়াইট-লেবেল রিসেলার হোস্টিং সল্যুশন দিয়ে আপনার নিজের ওয়েব হোস্টিং ব্যবসা শুরু করুন।'
              : 'Start your own web hosting business with our white-label reseller hosting solutions.'}
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
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'WHM কন্ট্রোল প্যানেল' : 'WHM Control Panel'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'হোয়াইট লেবেল' : 'White Label'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'লাইটস্পিড সার্ভার' : 'LiteSpeed Server'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'রিসেলার হোস্টিং প্ল্যান' : 'Reseller Hosting Plans'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'আপনার ব্যবসার জন্য সঠিক প্ল্যান বেছে নিন' : 'Choose the right plan for your business'}
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
                      {language === 'bn' ? 'সেরা মূল্য' : 'Best Value'}
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
                    <Check className="h-5 w-5 text-accent" /> {plan.storage}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.bandwidth} {language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
                  </li>
                  <li className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    <Check className="h-5 w-5 text-accent" /> {plan.accounts}
                  </li>
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                      <Check className="h-5 w-5 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full">
                  {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
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
                    <th className="text-center p-4 font-medium">{language === 'bn' ? 'বেসিক' : 'Basic'}</th>
                    <th className="text-center p-4 font-medium text-primary">{language === 'bn' ? 'প্রো' : 'Pro'}</th>
                    <th className="text-center p-4 font-medium">{language === 'bn' ? 'বিজনেস' : 'Business'}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="p-4 font-medium">{item.feature}</td>
                      <td className="p-4 text-center">
                        {typeof item.basic === 'boolean' ? (
                          item.basic ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{item.basic}</span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/5">
                        {typeof item.pro === 'boolean' ? (
                          item.pro ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="font-medium text-primary">{item.pro}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof item.business === 'boolean' ? (
                          item.business ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{item.business}</span>
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

      {/* Features Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'কেন আমাদের রিসেলার হোস্টিং?' : 'Why Our Reseller Hosting?'}
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
      <section className="section-padding">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আজই আপনার হোস্টিং ব্যবসা শুরু করুন' : 'Start Your Hosting Business Today'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের সম্পূর্ণ টুলস এবং সাপোর্ট দিয়ে আপনার ওয়েব হোস্টিং ব্যবসা গড়ে তুলুন।'
                : 'Build your web hosting business with our complete tools and support.'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'শুরু করুন' : 'Get Started'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResellerHosting;
