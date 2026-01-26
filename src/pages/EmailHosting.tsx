import React, { useState } from 'react';
import { Check, ArrowRight, Mail, Shield, Globe, Inbox, Calendar, Users, Lock, X, Zap, Headphones } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const EmailHosting: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { language } = useLanguage();

  const features = [
    { icon: Shield, title: language === 'bn' ? 'অ্যাডভান্সড স্প্যাম ফিল্টার' : 'Advanced Spam Filter', desc: language === 'bn' ? '৯৯.৯% স্প্যাম ব্লক' : '99.9% spam blocked' },
    { icon: Globe, title: language === 'bn' ? 'ওয়েবমেইল অ্যাক্সেস' : 'Webmail Access', desc: language === 'bn' ? 'যেকোনো জায়গা থেকে অ্যাক্সেস' : 'Access from anywhere' },
    { icon: Lock, title: language === 'bn' ? 'SSL এনক্রিপশন' : 'SSL Encryption', desc: language === 'bn' ? 'সম্পূর্ণ সুরক্ষিত' : 'Fully secured' },
    { icon: Inbox, title: language === 'bn' ? 'কাস্টম ডোমেইন' : 'Custom Domain', desc: language === 'bn' ? 'প্রফেশনাল ইমেইল অ্যাড্রেস' : 'Professional email addresses' },
    { icon: Calendar, title: language === 'bn' ? 'ক্যালেন্ডার ও কন্ট্যাক্টস' : 'Calendar & Contacts', desc: language === 'bn' ? 'সিঙ্ক করা থাকে' : 'Keep synced' },
    { icon: Users, title: language === 'bn' ? 'টিম কোলাবোরেশন' : 'Team Collaboration', desc: language === 'bn' ? 'শেয়ার্ড মেইলবক্স' : 'Shared mailboxes' },
  ];

  const plans = [
    { 
      name: language === 'bn' ? 'বেসিক' : 'Basic', 
      monthlyPrice: 199,
      yearlyPrice: 1990,
      storage: '5 GB', 
      accounts: language === 'bn' ? '৫ অ্যাকাউন্ট' : '5 Accounts', 
      features: [
        language === 'bn' ? 'ওয়েবমেইল' : 'Webmail', 
        'POP3/IMAP', 
        language === 'bn' ? 'স্প্যাম ফিল্টার' : 'Spam Filter'
      ] 
    },
    { 
      name: language === 'bn' ? 'প্রফেশনাল' : 'Professional', 
      monthlyPrice: 399,
      yearlyPrice: 3990,
      storage: '25 GB', 
      accounts: language === 'bn' ? '২৫ অ্যাকাউন্ট' : '25 Accounts', 
      features: [
        language === 'bn' ? 'ওয়েবমেইল' : 'Webmail', 
        'POP3/IMAP', 
        language === 'bn' ? 'অ্যাডভান্সড স্প্যাম' : 'Advanced Spam', 
        language === 'bn' ? 'ক্যালেন্ডার' : 'Calendar'
      ], 
      featured: true 
    },
    { 
      name: language === 'bn' ? 'এন্টারপ্রাইজ' : 'Enterprise', 
      monthlyPrice: 799,
      yearlyPrice: 7990,
      storage: '50 GB', 
      accounts: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', 
      features: [
        language === 'bn' ? 'ওয়েবমেইল' : 'Webmail', 
        'POP3/IMAP', 
        language === 'bn' ? 'অ্যাডভান্সড স্প্যাম' : 'Advanced Spam', 
        language === 'bn' ? 'ক্যালেন্ডার' : 'Calendar', 
        language === 'bn' ? 'কন্ট্যাক্টস' : 'Contacts', 
        language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support'
      ] 
    },
  ];

  const comparisonFeatures = [
    { feature: language === 'bn' ? 'স্টোরেজ/অ্যাকাউন্ট' : 'Storage/Account', basic: '5 GB', pro: '25 GB', enterprise: '50 GB' },
    { feature: language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Accounts', basic: '5', pro: '25', enterprise: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' },
    { feature: language === 'bn' ? 'ওয়েবমেইল অ্যাক্সেস' : 'Webmail Access', basic: true, pro: true, enterprise: true },
    { feature: 'POP3/IMAP/SMTP', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'SSL এনক্রিপশন' : 'SSL Encryption', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'স্প্যাম ফিল্টার' : 'Spam Filter', basic: language === 'bn' ? 'বেসিক' : 'Basic', pro: language === 'bn' ? 'অ্যাডভান্সড' : 'Advanced', enterprise: language === 'bn' ? 'প্রিমিয়াম' : 'Premium' },
    { feature: language === 'bn' ? 'ক্যালেন্ডার' : 'Calendar', basic: false, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'কন্ট্যাক্ট সিঙ্ক' : 'Contact Sync', basic: false, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'শেয়ার্ড মেইলবক্স' : 'Shared Mailboxes', basic: false, pro: false, enterprise: true },
    { feature: language === 'bn' ? 'ইমেইল আর্কাইভিং' : 'Email Archiving', basic: false, pro: false, enterprise: true },
    { feature: language === 'bn' ? 'মোবাইল সিঙ্ক' : 'Mobile Sync', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'অটো রেসপন্ডার' : 'Auto Responders', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'ফরওয়ার্ডিং' : 'Forwarding', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support', basic: false, pro: true, enterprise: true },
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'ইমেইল হোস্টিং' : 'Email Hosting'}
        description={language === 'bn' ? 'আপনার নিজের ডোমেইনে প্রফেশনাল ইমেইল হোস্টিং। সুরক্ষিত, নির্ভরযোগ্য এবং সহজে ম্যানেজ করুন।' : 'Professional email hosting with your own domain. Secure, reliable, and easy to manage.'}
        keywords="email hosting, business email, professional email, Bangladesh"
        canonicalUrl="/email"
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Mail className="h-4 w-4" />
            <span>{language === 'bn' ? 'প্রফেশনাল ইমেইল' : 'Professional Email'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'ইমেইল' : 'Email'}</span> {language === 'bn' ? 'হোস্টিং' : 'Hosting'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আপনার নিজের ডোমেইনে প্রফেশনাল ইমেইল হোস্টিং। সুরক্ষিত, নির্ভরযোগ্য এবং সহজে ম্যানেজ করুন।'
              : 'Professional email hosting with your own domain. Secure, reliable, and easy to manage.'}
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
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'স্প্যাম প্রোটেকশন' : 'Spam Protection'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'SSL সিকিউরড' : 'SSL Secured'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'ইমেইল হোস্টিং ফিচার' : 'Email Hosting Features'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card-hover p-6 text-center">
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

      {/* Pricing Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'ইমেইল হোস্টিং প্ল্যান' : 'Email Hosting Plans'}
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
                    <Check className="h-5 w-5 text-accent" /> {plan.storage} {language === 'bn' ? 'স্টোরেজ' : 'Storage'}
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
                    <th className="text-center p-4 font-medium text-primary">{language === 'bn' ? 'প্রফেশনাল' : 'Professional'}</th>
                    <th className="text-center p-4 font-medium">{language === 'bn' ? 'এন্টারপ্রাইজ' : 'Enterprise'}</th>
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
                        {typeof item.enterprise === 'boolean' ? (
                          item.enterprise ? <Check className="h-5 w-5 text-success mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span>{item.enterprise}</span>
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

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'প্রফেশনাল ইমেইল শুরু করুন' : 'Start with Professional Email'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আপনার ব্র্যান্ডের জন্য প্রফেশনাল ইমেইল অ্যাড্রেস সেটআপ করুন আজই।'
                : 'Set up professional email addresses for your brand today.'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started Now'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EmailHosting;
