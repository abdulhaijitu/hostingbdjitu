import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Globe, Shield, Zap, CheckCircle, Tag, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const DomainPricing: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: language === 'bn' ? 'সব' : 'All' },
    { id: 'popular', name: language === 'bn' ? 'জনপ্রিয়' : 'Popular' },
    { id: 'country', name: language === 'bn' ? 'দেশভিত্তিক' : 'Country' },
    { id: 'new', name: language === 'bn' ? 'নতুন' : 'New' },
  ];

  const domains = [
    { ext: '.com', register: 1299, renew: 1499, transfer: 1299, category: 'popular', popular: true },
    { ext: '.net', register: 1499, renew: 1699, transfer: 1499, category: 'popular', popular: true },
    { ext: '.org', register: 1399, renew: 1599, transfer: 1399, category: 'popular', popular: false },
    { ext: '.io', register: 3999, renew: 4499, transfer: 3999, category: 'popular', popular: true },
    { ext: '.co', register: 2999, renew: 3499, transfer: 2999, category: 'popular', popular: false },
    { ext: '.xyz', register: 299, renew: 1299, transfer: 999, category: 'new', popular: false, promo: true },
    { ext: '.online', register: 499, renew: 2999, transfer: 2499, category: 'new', popular: false, promo: true },
    { ext: '.store', register: 599, renew: 3499, transfer: 2999, category: 'new', popular: false },
    { ext: '.tech', register: 999, renew: 3999, transfer: 3499, category: 'new', popular: false },
    { ext: '.site', register: 399, renew: 2999, transfer: 2499, category: 'new', popular: false },
    { ext: '.com.bd', register: 999, renew: 1199, transfer: 999, category: 'country', popular: true },
    { ext: '.net.bd', register: 999, renew: 1199, transfer: 999, category: 'country', popular: false },
    { ext: '.org.bd', register: 999, renew: 1199, transfer: 999, category: 'country', popular: false },
    { ext: '.edu.bd', register: 499, renew: 599, transfer: 499, category: 'country', popular: false },
    { ext: '.info', register: 499, renew: 1499, transfer: 1299, category: 'popular', popular: false },
    { ext: '.me', register: 1999, renew: 2499, transfer: 1999, category: 'popular', popular: false },
    { ext: '.dev', register: 1499, renew: 1699, transfer: 1499, category: 'new', popular: false },
    { ext: '.app', register: 1599, renew: 1799, transfer: 1599, category: 'new', popular: false },
  ];

  const filteredDomains = domains.filter(domain => {
    const matchesCategory = activeCategory === 'all' || domain.category === activeCategory;
    const matchesSearch = domain.ext.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'ডোমেইন প্রাইসিং' : 'Domain Pricing'}
        description={language === 'bn' ? 'সব ডোমেইন এক্সটেনশনের জন্য স্বচ্ছ মূল্য। আত্মবিশ্বাসের সাথে রেজিস্টার, রিনিউ বা ট্রান্সফার করুন।' : 'Transparent pricing for all domain extensions. Register, renew, or transfer with confidence.'}
        keywords="domain pricing, domain cost, TLD prices, Bangladesh"
        canonicalUrl="/domain/pricing"
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Tag className="h-4 w-4" />
            <span>{language === 'bn' ? 'স্বচ্ছ মূল্য' : 'Transparent Pricing'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'ডোমেইন' : 'Domain'}</span> {language === 'bn' ? 'প্রাইসিং' : 'Pricing'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'সব ডোমেইন এক্সটেনশনের জন্য স্বচ্ছ মূল্য। আত্মবিশ্বাসের সাথে রেজিস্টার, রিনিউ বা ট্রান্সফার করুন।'
              : 'Transparent pricing for all domain extensions. Register, renew, or transfer with confidence.'}
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'এক্সটেনশন খুঁজুন (.com, .bd)...' : 'Search extension (.com, .bd)...'}
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-lg border border-border"
            />
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
              <Globe className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'বিনামূল্যে DNS' : 'Free DNS'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-muted/30 border-b border-border sticky top-16 z-10">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card border border-border hover:border-primary'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold">{language === 'bn' ? 'এক্সটেনশন' : 'Extension'}</th>
                    <th className="text-center p-4 font-semibold">{language === 'bn' ? 'রেজিস্টার' : 'Register'}</th>
                    <th className="text-center p-4 font-semibold">{language === 'bn' ? 'রিনিউ' : 'Renew'}</th>
                    <th className="text-center p-4 font-semibold">{language === 'bn' ? 'ট্রান্সফার' : 'Transfer'}</th>
                    <th className="text-center p-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDomains.map((domain, idx) => (
                    <tr key={domain.ext} className={`border-t border-border ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/30 transition-colors`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-primary">{domain.ext}</span>
                          {domain.popular && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 text-xs font-medium">
                              <Star className="h-3 w-3 fill-current" />
                              {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                            </span>
                          )}
                          {domain.promo && (
                            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                              {language === 'bn' ? 'প্রোমো' : 'Promo'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-semibold">{formatPrice(domain.register)}</div>
                        <div className="text-xs text-muted-foreground">/{language === 'bn' ? 'বছর' : 'yr'}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-semibold">{formatPrice(domain.renew)}</div>
                        <div className="text-xs text-muted-foreground">/{language === 'bn' ? 'বছর' : 'yr'}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="font-semibold">{formatPrice(domain.transfer)}</div>
                      </td>
                      <td className="p-4 text-center">
                        <Button variant="hero" size="sm" asChild>
                          <Link to="/domain/register">{language === 'bn' ? 'রেজিস্টার' : 'Register'}</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredDomains.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{language === 'bn' ? 'কোন ডোমেইন পাওয়া যায়নি।' : 'No domains found.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'সব ডোমেইনে অন্তর্ভুক্ত' : 'Included with All Domains'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              language === 'bn' ? 'বিনামূল্যে WHOIS প্রাইভেসি' : 'Free WHOIS Privacy',
              language === 'bn' ? 'বিনামূল্যে DNS ম্যানেজমেন্ট' : 'Free DNS Management',
              language === 'bn' ? 'ডোমেইন ফরওয়ার্ডিং' : 'Domain Forwarding',
              language === 'bn' ? 'ইমেইল ফরওয়ার্ডিং' : 'Email Forwarding',
              language === 'bn' ? 'ডোমেইন লক' : 'Domain Lock',
              language === 'bn' ? 'অটো রিনিউয়াল' : 'Auto Renewal',
              language === 'bn' ? 'তাৎক্ষণিক সক্রিয়করণ' : 'Instant Activation',
              language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                <CheckCircle className="h-5 w-5 text-success shrink-0" />
                <span>{feature}</span>
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
              {language === 'bn' ? 'আপনার পারফেক্ট ডোমেইন খুঁজুন' : 'Find Your Perfect Domain'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'বিনামূল্যে WHOIS প্রাইভেসি এবং DNS ম্যানেজমেন্ট সহ আজই আপনার ডোমেইন সুরক্ষিত করুন।'
                : 'Secure your domain today with free WHOIS privacy and DNS management.'}
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/domain/register">
                {language === 'bn' ? 'ডোমেইন সার্চ করুন' : 'Search Domains'} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomainPricing;
