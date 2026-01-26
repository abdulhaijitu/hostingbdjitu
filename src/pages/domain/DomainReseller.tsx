import React, { useState } from 'react';
import { Check, ArrowRight, Users, Globe, Shield, Zap, Code, Headphones, X, DollarSign, Server } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const DomainReseller: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);
  const { language } = useLanguage();

  const plans = [
    { 
      name: language === 'bn' ? 'রিসেলার বেসিক' : 'Reseller Basic', 
      monthlyPrice: 4999,
      yearlyPrice: 49990,
      domains: language === 'bn' ? '৫০ ডোমেইন' : '50 Domains', 
      features: [
        language === 'bn' ? 'API অ্যাক্সেস' : 'API Access', 
        language === 'bn' ? 'হোয়াইট-লেবেল' : 'White-label', 
        language === 'bn' ? 'WHOIS প্রাইভেসি' : 'WHOIS Privacy'
      ] 
    },
    { 
      name: language === 'bn' ? 'রিসেলার প্রো' : 'Reseller Pro', 
      monthlyPrice: 9999,
      yearlyPrice: 99990,
      domains: language === 'bn' ? '২০০ ডোমেইন' : '200 Domains', 
      features: [
        language === 'bn' ? 'API অ্যাক্সেস' : 'API Access', 
        language === 'bn' ? 'হোয়াইট-লেবেল' : 'White-label', 
        language === 'bn' ? 'WHOIS প্রাইভেসি' : 'WHOIS Privacy', 
        language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support'
      ], 
      featured: true 
    },
    { 
      name: language === 'bn' ? 'রিসেলার এন্টারপ্রাইজ' : 'Reseller Enterprise', 
      monthlyPrice: 19999,
      yearlyPrice: 199990,
      domains: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited', 
      features: [
        language === 'bn' ? 'API অ্যাক্সেস' : 'API Access', 
        language === 'bn' ? 'হোয়াইট-লেবেল' : 'White-label', 
        language === 'bn' ? 'WHOIS প্রাইভেসি' : 'WHOIS Privacy', 
        language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support', 
        language === 'bn' ? 'কাস্টম প্রাইসিং' : 'Custom Pricing'
      ] 
    },
  ];

  const comparisonFeatures = [
    { feature: language === 'bn' ? 'ডোমেইন সংখ্যা' : 'Domain Limit', basic: '50', pro: '200', enterprise: language === 'bn' ? 'আনলিমিটেড' : 'Unlimited' },
    { feature: language === 'bn' ? 'TLD সংখ্যা' : 'TLDs Available', basic: '100+', pro: '300+', enterprise: '500+' },
    { feature: language === 'bn' ? 'API অ্যাক্সেস' : 'API Access', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'হোয়াইট-লেবেল' : 'White-label', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'WHOIS প্রাইভেসি' : 'WHOIS Privacy', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'DNS ম্যানেজমেন্ট' : 'DNS Management', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'রিয়েল-টাইম ডোমেইন চেক' : 'Real-time Domain Check', basic: true, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'বাল্ক ডোমেইন সার্চ' : 'Bulk Domain Search', basic: false, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'কাস্টম প্রাইসিং' : 'Custom Pricing', basic: false, pro: false, enterprise: true },
    { feature: language === 'bn' ? 'ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার' : 'Dedicated Account Manager', basic: false, pro: false, enterprise: true },
    { feature: language === 'bn' ? 'অগ্রাধিকার সাপোর্ট' : 'Priority Support', basic: false, pro: true, enterprise: true },
    { feature: language === 'bn' ? 'SLA গ্যারান্টি' : 'SLA Guarantee', basic: false, pro: true, enterprise: true },
  ];

  const features = [
    { icon: Code, title: language === 'bn' ? 'শক্তিশালী API' : 'Powerful API', desc: language === 'bn' ? 'RESTful API দিয়ে ইন্টিগ্রেশন' : 'Integration with RESTful API' },
    { icon: Shield, title: language === 'bn' ? 'হোয়াইট-লেবেল' : 'White-label', desc: language === 'bn' ? 'আপনার ব্র্যান্ড দিয়ে বিক্রি করুন' : 'Sell under your own brand' },
    { icon: Globe, title: language === 'bn' ? '৫০০+ TLD' : '500+ TLDs', desc: language === 'bn' ? 'বিশ্বব্যাপী ডোমেইন এক্সটেনশন' : 'Worldwide domain extensions' },
    { icon: DollarSign, title: language === 'bn' ? 'ভলিউম ডিসকাউন্ট' : 'Volume Discounts', desc: language === 'bn' ? 'বেশি বিক্রি করলে বেশি সেভ' : 'More sales, more savings' },
    { icon: Server, title: language === 'bn' ? 'রিয়েল-টাইম' : 'Real-time', desc: language === 'bn' ? 'তাৎক্ষণিক ডোমেইন রেজিস্ট্রেশন' : 'Instant domain registration' },
    { icon: Headphones, title: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support', desc: language === 'bn' ? 'সর্বদা সাহায্যের জন্য প্রস্তুত' : 'Always ready to help' },
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'ডোমেইন রিসেলার' : 'Domain Reseller'}
        description={language === 'bn' ? 'ডোমেইন রিসেলার হয়ে আপনার গ্রাহকদের হোয়াইট-লেবেল সল্যুশন দিয়ে ডোমেইন রেজিস্ট্রেশন সার্ভিস অফার করুন।' : 'Become a domain reseller and offer domain registration services with our white-label solution.'}
        keywords="domain reseller, sell domains, domain business, Bangladesh"
        canonicalUrl="/domain/reseller"
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            <span>{language === 'bn' ? 'আপনার ডোমেইন বিজনেস শুরু করুন' : 'Start Your Domain Business'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'ডোমেইন' : 'Domain'}</span> {language === 'bn' ? 'রিসেলার' : 'Reseller'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'ডোমেইন রিসেলার হয়ে আপনার গ্রাহকদের হোয়াইট-লেবেল সল্যুশন দিয়ে ডোমেইন রেজিস্ট্রেশন সার্ভিস অফার করুন।'
              : 'Become a domain reseller and offer domain registration services to your customers with our white-label solution.'}
          </p>
          <Button variant="hero" size="xl">
            {language === 'bn' ? 'শুরু করুন' : 'Get Started'} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৫০০+</div>
              <div className="text-primary-foreground/70 text-sm">TLD {language === 'bn' ? 'সাপোর্ট' : 'Supported'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৫০০+</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'সক্রিয় রিসেলার' : 'Active Resellers'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৯৯.৯%</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'API আপটাইম' : 'API Uptime'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">24/7</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'সাপোর্ট' : 'Support'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 bg-muted/30 border-y border-border">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'শক্তিশালী API' : 'Powerful API'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'হোয়াইট-লেবেল' : 'White-label'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '৫০০+ TLD' : '500+ TLDs'}</span>
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
              {language === 'bn' ? 'রিসেলার প্ল্যান' : 'Reseller Plans'}
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
                    <Check className="h-5 w-5 text-accent" /> {plan.domains}
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

      {/* Features Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'কেন আমাদের রিসেলার প্রোগ্রাম?' : 'Why Our Reseller Program?'}
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
              {language === 'bn' ? 'আজই ডোমেইন রিসেলার হন' : 'Become a Domain Reseller Today'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের শক্তিশালী API এবং হোয়াইট-লেবেল সল্যুশন দিয়ে আপনার ডোমেইন বিজনেস শুরু করুন।'
                : 'Start your domain business with our powerful API and white-label solution.'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'রিসেলার হিসেবে যোগ দিন' : 'Join as Reseller'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomainReseller;
