import React, { useState } from 'react';
import { ArrowRight, RefreshCw, CheckCircle, Shield, Gift, Clock, Headphones, Search, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const DomainTransfer: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [authCode, setAuthCode] = useState('');
  const { language } = useLanguage();

  const steps = [
    { 
      num: '1', 
      title: language === 'bn' ? 'ডোমেইন আনলক করুন' : 'Unlock Domain', 
      desc: language === 'bn' ? 'আপনার বর্তমান রেজিস্ট্রারে ডোমেইন আনলক করুন' : 'Unlock your domain at your current registrar' 
    },
    { 
      num: '2', 
      title: language === 'bn' ? 'Auth কোড নিন' : 'Get Auth Code', 
      desc: language === 'bn' ? 'অথোরাইজেশন/EPP কোড রিকোয়েস্ট করুন' : 'Request the authorization/EPP code' 
    },
    { 
      num: '3', 
      title: language === 'bn' ? 'ট্রান্সফার শুরু করুন' : 'Start Transfer', 
      desc: language === 'bn' ? 'নীচে আপনার ডোমেইন এবং auth কোড দিন' : 'Enter your domain and auth code below' 
    },
    { 
      num: '4', 
      title: language === 'bn' ? 'ট্রান্সফার নিশ্চিত করুন' : 'Confirm Transfer', 
      desc: language === 'bn' ? 'ইমেইলের মাধ্যমে ট্রান্সফার অনুমোদন করুন' : 'Approve the transfer via email' 
    },
  ];

  const benefits = [
    { 
      icon: Gift, 
      title: language === 'bn' ? '১ বছর বিনামূল্যে এক্সটেনশন' : '1 Year Free Extension',
      desc: language === 'bn' ? 'ট্রান্সফারের সাথে ১ বছর যোগ হবে' : 'Get 1 year added with transfer'
    },
    { 
      icon: Shield, 
      title: language === 'bn' ? 'বিনামূল্যে WHOIS প্রাইভেসি' : 'Free WHOIS Privacy',
      desc: language === 'bn' ? 'আপনার তথ্য সুরক্ষিত' : 'Keep your info protected'
    },
    { 
      icon: Clock, 
      title: language === 'bn' ? 'কোন ডাউনটাইম নেই' : 'No Downtime',
      desc: language === 'bn' ? 'আপনার সাইট সবসময় লাইভ থাকবে' : 'Your site stays live always'
    },
    { 
      icon: Headphones, 
      title: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support',
      desc: language === 'bn' ? 'ট্রান্সফারে সাহায্য' : 'Help with your transfer'
    },
  ];

  const transferPricing = [
    { ext: '.com', price: '৳1,299', includes: language === 'bn' ? '+১ বছর বিনামূল্যে' : '+1 Year Free' },
    { ext: '.net', price: '৳1,499', includes: language === 'bn' ? '+১ বছর বিনামূল্যে' : '+1 Year Free' },
    { ext: '.org', price: '৳1,399', includes: language === 'bn' ? '+১ বছর বিনামূল্যে' : '+1 Year Free' },
    { ext: '.io', price: '৳3,999', includes: language === 'bn' ? '+১ বছর বিনামূল্যে' : '+1 Year Free' },
    { ext: '.co', price: '৳2,999', includes: language === 'bn' ? '+১ বছর বিনামূল্যে' : '+1 Year Free' },
    { ext: '.xyz', price: '৳999', includes: language === 'bn' ? '+১ বছর বিনামূল্যে' : '+1 Year Free' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <RefreshCw className="h-4 w-4" />
            <span>{language === 'bn' ? 'সহজ ট্রান্সফার প্রক্রিয়া' : 'Easy Transfer Process'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'ডোমেইন' : 'Domain'}</span> {language === 'bn' ? 'ট্রান্সফার' : 'Transfer'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'CHost-এ আপনার ডোমেইন ট্রান্সফার করুন এবং ১ বছর বিনামূল্যে এক্সটেনশন ও WHOIS প্রাইভেসি পান।'
              : 'Transfer your domain to CHost and get 1 year free extension plus free WHOIS privacy.'}
          </p>
        </div>
      </section>

      {/* Transfer Form Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold font-display text-center mb-6">
                {language === 'bn' ? 'ডোমেইন ট্রান্সফার শুরু করুন' : 'Start Domain Transfer'}
              </h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'bn' ? 'ডোমেইন নাম' : 'Domain Name'}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="example.com"
                      className="w-full h-12 pl-12 pr-4 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent border border-border"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'bn' ? 'অথোরাইজেশন কোড (EPP)' : 'Authorization Code (EPP)'}
                  </label>
                  <input
                    type="text"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার auth কোড দিন' : 'Enter your auth code'}
                    className="w-full h-12 px-4 rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent border border-border"
                  />
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 text-sm">
                  <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">
                    {language === 'bn' 
                      ? 'ট্রান্সফার শুরু করার আগে আপনার বর্তমান রেজিস্ট্রারে ডোমেইন আনলক করা আছে কিনা নিশ্চিত করুন।'
                      : 'Make sure your domain is unlocked at your current registrar before starting the transfer.'}
                  </p>
                </div>
                <Button variant="hero" size="xl" className="w-full">
                  {language === 'bn' ? 'ট্রান্সফার শুরু করুন' : 'Start Transfer'} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'কিভাবে কাজ করে' : 'How It Works'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={step.num} className="relative">
                <div className="feature-card text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-semibold font-display mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-3 z-10">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transfer Pricing */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'ট্রান্সফার প্রাইসিং' : 'Transfer Pricing'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? 'ট্রান্সফার ফি + ১ বছর বিনামূল্যে রিনিউয়াল' : 'Transfer fee + 1 year free renewal'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {transferPricing.map((item) => (
              <div key={item.ext} className="card-hover p-6 text-center">
                <div className="text-2xl font-bold font-display text-primary mb-2">{item.ext}</div>
                <div className="text-xl font-semibold mb-1">{item.price}</div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                  <Gift className="h-3 w-3" />
                  {item.includes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'ট্রান্সফার সুবিধাসমূহ' : 'Transfer Benefits'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card-hover p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display mb-4">
                {language === 'bn' ? 'সাধারণ প্রশ্নাবলী' : 'Frequently Asked Questions'}
              </h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: language === 'bn' ? 'ট্রান্সফার কতদিন সময় নেয়?' : 'How long does the transfer take?',
                  a: language === 'bn' ? 'সাধারণত ৫-৭ দিন সময় লাগে, তবে কখনো কখনো ২৪ ঘণ্টার মধ্যেও সম্পন্ন হতে পারে।' : 'Usually 5-7 days, but can sometimes complete within 24 hours.'
                },
                {
                  q: language === 'bn' ? 'ট্রান্সফারের সময় আমার সাইট কি ডাউন থাকবে?' : 'Will my site go down during transfer?',
                  a: language === 'bn' ? 'না, আপনার ওয়েবসাইট পুরো ট্রান্সফার প্রক্রিয়ায় সম্পূর্ণ অনলাইন থাকবে।' : 'No, your website remains fully online throughout the transfer process.'
                },
                {
                  q: language === 'bn' ? 'Auth কোড কোথায় পাব?' : 'Where do I get the auth code?',
                  a: language === 'bn' ? 'আপনার বর্তমান ডোমেইন রেজিস্ট্রারের ড্যাশবোর্ড থেকে অথোরাইজেশন কোড রিকোয়েস্ট করতে পারবেন।' : 'Request it from your current domain registrar\'s dashboard.'
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-card rounded-lg border border-border p-6">
                  <h4 className="font-semibold mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আজই আপনার ডোমেইন ট্রান্সফার করুন' : 'Transfer Your Domain Today'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? '১ বছর বিনামূল্যে এক্সটেনশন এবং WHOIS প্রাইভেসি সহ CHost-এ আসুন।'
                : 'Get 1 year free extension and WHOIS privacy when you transfer to CHost.'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'ট্রান্সফার শুরু করুন' : 'Start Transfer'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DomainTransfer;
