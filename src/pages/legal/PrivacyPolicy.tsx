import React from 'react';
import Layout from '@/components/layout/Layout';
import { Shield, Eye, Lock, Database, Bell, UserCheck, Globe, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();

  const sections = [
    {
      icon: Database,
      title: language === 'bn' ? 'আমরা যে তথ্য সংগ্রহ করি' : 'Information We Collect',
      content: language === 'bn' 
        ? 'আমরা আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর, বিলিং ঠিকানা এবং পেমেন্ট তথ্য সংগ্রহ করি। এছাড়াও আমরা স্বয়ংক্রিয়ভাবে IP ঠিকানা, ব্রাউজার তথ্য এবং কুকি ডেটা সংগ্রহ করি।'
        : 'We collect your name, email address, phone number, billing address, and payment information. We also automatically collect IP addresses, browser information, and cookie data.',
      items: language === 'bn' 
        ? ['ব্যক্তিগত শনাক্তকরণ তথ্য', 'বিলিং এবং পেমেন্ট তথ্য', 'প্রযুক্তিগত ডেটা (IP, ব্রাউজার)', 'ব্যবহার এবং অ্যানালিটিক্স ডেটা']
        : ['Personal identification information', 'Billing and payment data', 'Technical data (IP, browser)', 'Usage and analytics data']
    },
    {
      icon: Eye,
      title: language === 'bn' ? 'আমরা কীভাবে তথ্য ব্যবহার করি' : 'How We Use Information',
      content: language === 'bn'
        ? 'আপনার তথ্য আমাদের সেবা প্রদান, অ্যাকাউন্ট পরিচালনা, পেমেন্ট প্রক্রিয়াকরণ এবং আপনার সাথে যোগাযোগের জন্য ব্যবহৃত হয়।'
        : 'Your information is used to provide services, manage accounts, process payments, and communicate with you about your account and services.',
      items: language === 'bn'
        ? ['সেবা প্রদান ও পরিচালনা', 'পেমেন্ট প্রক্রিয়াকরণ', 'গ্রাহক সহায়তা', 'সার্ভিস আপডেট পাঠানো']
        : ['Service delivery and management', 'Payment processing', 'Customer support', 'Sending service updates']
    },
    {
      icon: Lock,
      title: language === 'bn' ? 'ডেটা সুরক্ষা' : 'Data Protection',
      content: language === 'bn'
        ? 'আমরা শিল্প-মানের নিরাপত্তা ব্যবস্থা ব্যবহার করি যার মধ্যে SSL এনক্রিপশন, ফায়ারওয়াল এবং নিয়মিত নিরাপত্তা অডিট অন্তর্ভুক্ত।'
        : 'We employ industry-standard security measures including SSL encryption, firewalls, and regular security audits to protect your data.',
      items: language === 'bn'
        ? ['256-bit SSL এনক্রিপশন', 'এন্টারপ্রাইজ ফায়ারওয়াল', 'নিয়মিত নিরাপত্তা অডিট', 'সুরক্ষিত ডেটা সেন্টার']
        : ['256-bit SSL encryption', 'Enterprise firewalls', 'Regular security audits', 'Secure data centers']
    },
    {
      icon: UserCheck,
      title: language === 'bn' ? 'আপনার অধিকার' : 'Your Rights',
      content: language === 'bn'
        ? 'আপনার ডেটা অ্যাক্সেস, সংশোধন, মুছে ফেলা এবং ডেটা পোর্টেবিলিটির অধিকার রয়েছে। যেকোনো সময় আমাদের সাথে যোগাযোগ করুন।'
        : 'You have the right to access, correct, delete, and port your data. Contact us anytime to exercise these rights.',
      items: language === 'bn'
        ? ['ডেটা অ্যাক্সেসের অধিকার', 'সংশোধনের অধিকার', 'মুছে ফেলার অধিকার', 'ডেটা পোর্টেবিলিটি']
        : ['Right to access', 'Right to correction', 'Right to deletion', 'Data portability']
    },
    {
      icon: Bell,
      title: language === 'bn' ? 'কুকি নীতি' : 'Cookie Policy',
      content: language === 'bn'
        ? 'আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি। আপনি ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ করতে পারেন।'
        : 'We use cookies to enhance your browsing experience. You can control cookies through your browser settings.',
      items: language === 'bn'
        ? ['প্রয়োজনীয় কুকি', 'অ্যানালিটিক্স কুকি', 'মার্কেটিং কুকি', 'তৃতীয় পক্ষের কুকি']
        : ['Essential cookies', 'Analytics cookies', 'Marketing cookies', 'Third-party cookies']
    },
    {
      icon: Globe,
      title: language === 'bn' ? 'তৃতীয় পক্ষের সেবা' : 'Third-Party Services',
      content: language === 'bn'
        ? 'আমরা পেমেন্ট প্রসেসিং এবং অ্যানালিটিক্সের জন্য বিশ্বস্ত তৃতীয় পক্ষের সেবা ব্যবহার করি। তারা আমাদের মতোই কঠোর গোপনীয়তা মান অনুসরণ করে।'
        : 'We use trusted third-party services for payment processing and analytics. They follow strict privacy standards similar to ours.',
      items: language === 'bn'
        ? ['পেমেন্ট গেটওয়ে', 'অ্যানালিটিক্স সেবা', 'CDN প্রদানকারী', 'ইমেইল সেবা']
        : ['Payment gateways', 'Analytics services', 'CDN providers', 'Email services']
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-white font-medium">
              {language === 'bn' ? 'আপনার গোপনীয়তা আমাদের অগ্রাধিকার' : 'Your Privacy is Our Priority'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'CHost-এ আমরা আপনার ব্যক্তিগত তথ্যের সুরক্ষায় প্রতিশ্রুতিবদ্ধ। এই নীতি ব্যাখ্যা করে আমরা কীভাবে আপনার ডেটা সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি।'
              : 'At CHost, we are committed to protecting your personal information. This policy explains how we collect, use, and protect your data.'}
          </p>
          <p className="text-white/60 mt-4">
            {language === 'bn' ? 'সর্বশেষ আপডেট: জানুয়ারি ২০২৬' : 'Last Updated: January 2026'}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container-wide max-w-5xl">
          <div className="grid gap-8">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <section.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-3">{section.title}</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{section.content}</p>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/50">
        <div className="container-wide max-w-3xl text-center">
          <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            {language === 'bn' ? 'প্রশ্ন আছে?' : 'Have Questions?'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === 'bn'
              ? 'গোপনীয়তা সম্পর্কিত যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন।'
              : 'Contact us for any privacy-related questions or concerns.'}
          </p>
          <a 
            href="mailto:support@chostbd.com" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Mail className="w-5 h-5" />
            support@chostbd.com
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
