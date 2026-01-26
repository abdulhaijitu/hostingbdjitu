import React, { useState } from 'react';
import { Search, ArrowRight, Globe, CheckCircle, Shield, Zap, Clock, Award, Star, BadgeCheck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const DomainRegistration: React.FC = () => {
  const [domain, setDomain] = useState('');
  const { language } = useLanguage();

  const extensions = [
    { ext: '.com', price: '৳1,299', renewal: '৳1,499', popular: true },
    { ext: '.net', price: '৳1,499', renewal: '৳1,699', popular: false },
    { ext: '.org', price: '৳1,399', renewal: '৳1,599', popular: false },
    { ext: '.io', price: '৳3,999', renewal: '৳4,499', popular: true },
    { ext: '.com.bd', price: '৳999', renewal: '৳1,199', popular: true },
    { ext: '.co', price: '৳2,999', renewal: '৳3,499', popular: false },
    { ext: '.xyz', price: '৳299', renewal: '৳1,299', popular: false },
    { ext: '.online', price: '৳499', renewal: '৳2,999', popular: false },
    { ext: '.store', price: '৳599', renewal: '৳3,499', popular: false },
    { ext: '.tech', price: '৳999', renewal: '৳3,999', popular: false },
    { ext: '.info', price: '৳499', renewal: '৳1,499', popular: false },
    { ext: '.me', price: '৳1,999', renewal: '৳2,499', popular: false },
  ];

  const features = [
    { 
      icon: Shield, 
      title: language === 'bn' ? 'বিনামূল্যে WHOIS প্রাইভেসি' : 'Free WHOIS Privacy',
      desc: language === 'bn' ? 'আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখুন' : 'Keep your personal information protected'
    },
    { 
      icon: Zap, 
      title: language === 'bn' ? 'বিনামূল্যে DNS ম্যানেজমেন্ট' : 'Free DNS Management',
      desc: language === 'bn' ? 'সম্পূর্ণ DNS নিয়ন্ত্রণ' : 'Full DNS control at your fingertips'
    },
    { 
      icon: Clock, 
      title: language === 'bn' ? 'তাৎক্ষণিক সক্রিয়করণ' : 'Instant Activation',
      desc: language === 'bn' ? 'মিনিটের মধ্যে ডোমেইন সক্রিয়' : 'Domain active within minutes'
    },
    { 
      icon: Award, 
      title: language === 'bn' ? 'ডোমেইন ফরওয়ার্ডিং' : 'Domain Forwarding',
      desc: language === 'bn' ? 'সহজে URL রিডাইরেক্ট' : 'Easy URL redirects'
    },
    { 
      icon: Star, 
      title: language === 'bn' ? 'ইমেইল ফরওয়ার্ডিং' : 'Email Forwarding',
      desc: language === 'bn' ? 'প্রফেশনাল ইমেইল সেটআপ' : 'Professional email setup'
    },
    { 
      icon: BadgeCheck, 
      title: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support',
      desc: language === 'bn' ? 'সর্বদা সাহায্যের জন্য প্রস্তুত' : 'Always ready to help'
    },
  ];

  const comparisonFeatures = [
    { 
      feature: language === 'bn' ? 'WHOIS প্রাইভেসি' : 'WHOIS Privacy', 
      chost: true, 
      others: false 
    },
    { 
      feature: language === 'bn' ? 'DNS ম্যানেজমেন্ট' : 'DNS Management', 
      chost: true, 
      others: true 
    },
    { 
      feature: language === 'bn' ? 'ডোমেইন লক' : 'Domain Lock', 
      chost: true, 
      others: true 
    },
    { 
      feature: language === 'bn' ? 'ইমেইল ফরওয়ার্ডিং' : 'Email Forwarding', 
      chost: true, 
      others: false 
    },
    { 
      feature: language === 'bn' ? 'URL ফরওয়ার্ডিং' : 'URL Forwarding', 
      chost: true, 
      others: true 
    },
    { 
      feature: language === 'bn' ? 'অটো রিনিউয়াল' : 'Auto Renewal', 
      chost: true, 
      others: true 
    },
    { 
      feature: language === 'bn' ? 'বাল্ক ম্যানেজমেন্ট' : 'Bulk Management', 
      chost: true, 
      others: false 
    },
    { 
      feature: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support', 
      chost: true, 
      others: false 
    },
  ];

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'ডোমেইন রেজিস্ট্রেশন' : 'Domain Registration'}
        description={language === 'bn' ? 'বিনামূল্যে WHOIS প্রাইভেসি, DNS ম্যানেজমেন্ট এবং 24/7 সাপোর্ট সহ আপনার ডোমেইন নাম রেজিস্টার করুন।' : 'Register your domain name with free WHOIS privacy, DNS management, and 24/7 support.'}
        keywords="domain registration, buy domain, .com domain, .bd domain, Bangladesh"
        canonicalUrl="/domain/register"
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Globe className="h-4 w-4" />
            <span>{language === 'bn' ? 'আপনার পারফেক্ট ডোমেইন খুঁজুন' : 'Find Your Perfect Domain'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'ডোমেইন' : 'Domain'}</span> {language === 'bn' ? 'রেজিস্ট্রেশন' : 'Registration'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'বিনামূল্যে WHOIS প্রাইভেসি, DNS ম্যানেজমেন্ট এবং 24/7 সাপোর্ট সহ আপনার ডোমেইন নাম রেজিস্টার করুন।'
              : 'Register your domain name with free WHOIS privacy, DNS management, and 24/7 support.'}
          </p>

          <form className="max-w-3xl mx-auto mb-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার ডোমেইন নাম খুঁজুন...' : 'Search for your domain name...'}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-lg border border-border"
                />
              </div>
              <Button variant="hero" size="xl" type="submit">
                {language === 'bn' ? 'সার্চ করুন' : 'Search'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Popular Extensions */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {extensions.filter(e => e.popular).map((item) => (
              <span key={item.ext} className="px-3 py-1.5 rounded-full bg-card border border-border">
                <span className="font-semibold text-primary">{item.ext}</span>
                <span className="text-muted-foreground ml-2">{item.price}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-6 bg-primary/5 border-y border-border">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'বিনামূল্যে WHOIS প্রাইভেসি' : 'Free WHOIS Privacy'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'তাৎক্ষণিক সক্রিয়করণ' : 'Instant Activation'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Pricing Table */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'ডোমেইন প্রাইসিং' : 'Domain Pricing'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? 'সব দাম প্রথম বছরের জন্য' : 'All prices are for the first year'}
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {extensions.map((item) => (
              <div key={item.ext} className={`card-hover p-6 text-center relative ${item.popular ? 'border-2 border-primary' : ''}`}>
                {item.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                    </span>
                  </div>
                )}
                <div className="text-2xl font-bold font-display text-primary mb-2">{item.ext}</div>
                <div className="text-xl font-semibold mb-1">{item.price}</div>
                <div className="text-sm text-muted-foreground mb-4">
                  {language === 'bn' ? 'রিনিউ' : 'Renews at'} {item.renewal}/{language === 'bn' ? 'বছর' : 'yr'}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {language === 'bn' ? 'রেজিস্টার করুন' : 'Register'}
                </Button>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-semibold font-display text-center">
                {language === 'bn' ? 'কেন CHost বেছে নেবেন?' : 'Why Choose CHost?'}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium">{language === 'bn' ? 'ফিচার' : 'Feature'}</th>
                    <th className="text-center p-4 font-medium text-primary">CHost</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">{language === 'bn' ? 'অন্যান্য' : 'Others'}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="p-4">{item.feature}</td>
                      <td className="p-4 text-center">
                        {item.chost ? (
                          <CheckCircle className="h-5 w-5 text-success mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {item.others ? (
                          <CheckCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
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
              {language === 'bn' ? 'কি কি অন্তর্ভুক্ত' : "What's Included"}
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

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আজই আপনার ডোমেইন সুরক্ষিত করুন' : 'Secure Your Domain Today'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'বিনামূল্যে WHOIS প্রাইভেসি এবং DNS ম্যানেজমেন্ট সহ আপনার পারফেক্ট ডোমেইন খুঁজুন।'
                : 'Find your perfect domain with free WHOIS privacy and DNS management.'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'ডোমেইন সার্চ করুন' : 'Search Domains'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomainRegistration;
