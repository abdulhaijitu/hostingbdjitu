import React, { useState, useEffect } from 'react';
import { ArrowRight, Headphones, MessageCircle, Phone, Mail, Search, Book, Video, Download, LifeBuoy, Ticket, ExternalLink } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { WHMCS_URLS } from '@/lib/whmcsConfig';

const Support: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const supportOptions = [
    { 
      icon: MessageCircle, 
      title: language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat', 
      desc: language === 'bn' ? 'রিয়েল-টাইমে আমাদের সাপোর্ট টিমের সাথে চ্যাট করুন' : 'Chat with our support team in real-time', 
      available: '24/7',
      action: language === 'bn' ? 'চ্যাট শুরু করুন' : 'Start Chat',
      color: 'bg-green-500',
      responseTime: language === 'bn' ? '< ১ মিনিট' : '< 1 min',
      href: WHMCS_URLS.clientArea,
    },
    { 
      icon: Phone, 
      title: language === 'bn' ? 'ফোন সাপোর্ট' : 'Phone Support', 
      desc: language === 'bn' ? 'সরাসরি আমাদের টিমের সাথে কথা বলুন' : 'Speak directly with our team', 
      available: language === 'bn' ? '৯AM - ১০PM' : '9AM - 10PM',
      action: language === 'bn' ? 'কল করুন' : 'Call Now',
      color: 'bg-blue-500',
      responseTime: language === 'bn' ? 'তাৎক্ষণিক' : 'Instant',
      href: 'tel:+8801833876434',
    },
    { 
      icon: Ticket, 
      title: language === 'bn' ? 'টিকেট সাবমিট' : 'Submit Ticket', 
      desc: language === 'bn' ? 'জটিল সমস্যার জন্য সাপোর্ট টিকেট জমা দিন' : 'Submit a support ticket for complex issues', 
      available: '24/7',
      action: language === 'bn' ? 'টিকেট খুলুন' : 'Open Ticket',
      color: 'bg-purple-500',
      responseTime: language === 'bn' ? '২-৪ ঘণ্টা' : '2-4 hours',
      href: WHMCS_URLS.submitTicket,
    },
    { 
      icon: Mail, 
      title: language === 'bn' ? 'ইমেইল সাপোর্ট' : 'Email Support', 
      desc: language === 'bn' ? 'বিস্তারিত সমস্যার জন্য ইমেইল করুন' : 'Email us for detailed issues', 
      available: '24/7',
      action: language === 'bn' ? 'ইমেইল করুন' : 'Send Email',
      color: 'bg-orange-500',
      responseTime: language === 'bn' ? '৪-৮ ঘণ্টা' : '4-8 hours',
      href: 'mailto:support@chostbd.com',
    },
  ];

  const quickLinks = [
    { icon: Book, title: language === 'bn' ? 'নলেজ বেস' : 'Knowledge Base', desc: language === 'bn' ? '৫০০+ আর্টিকেল' : '500+ Articles', href: WHMCS_URLS.knowledgeBase },
    { icon: Video, title: language === 'bn' ? 'ভিডিও টিউটোরিয়াল' : 'Video Tutorials', desc: language === 'bn' ? '১০০+ ভিডিও' : '100+ Videos', href: WHMCS_URLS.knowledgeBase },
    { icon: Download, title: language === 'bn' ? 'সফটওয়্যার ডাউনলোড' : 'Downloads', desc: language === 'bn' ? 'টুলস ও ক্লায়েন্ট' : 'Tools & Clients', href: WHMCS_URLS.clientArea },
    { icon: LifeBuoy, title: language === 'bn' ? 'ক্লায়েন্ট এরিয়া' : 'Client Area', desc: language === 'bn' ? 'সার্ভিস ম্যানেজ করুন' : 'Manage Services', href: WHMCS_URLS.clientArea },
  ];

  const faqCategories = [
    { id: 'all', label: language === 'bn' ? 'সকল' : 'All' },
    { id: 'hosting', label: language === 'bn' ? 'হোস্টিং' : 'Hosting' },
    { id: 'domain', label: language === 'bn' ? 'ডোমেইন' : 'Domain' },
    { id: 'billing', label: language === 'bn' ? 'বিলিং' : 'Billing' },
    { id: 'technical', label: language === 'bn' ? 'টেকনিক্যাল' : 'Technical' },
  ];

  const faqs = [
    { 
      category: 'hosting',
      q: language === 'bn' ? 'হোস্টিং কিভাবে শুরু করব?' : 'How do I get started with hosting?', 
      a: language === 'bn' ? 'একটি হোস্টিং প্ল্যান বেছে নিন, চেকআউট সম্পন্ন করুন এবং মিনিটের মধ্যে আপনার cPanel লগইন ডিটেইলস পাবেন। আমাদের সেটআপ উইজার্ড আপনাকে পুরো প্রক্রিয়ায় গাইড করবে।' : 'Simply choose a hosting plan, complete the checkout, and you\'ll receive login details to your cPanel within minutes. Our setup wizard will guide you through the entire process.' 
    },
    { 
      category: 'hosting',
      q: language === 'bn' ? 'আপনারা কি ফ্রি মাইগ্রেশন অফার করেন?' : 'Do you offer free migration?', 
      a: language === 'bn' ? 'হ্যাঁ! আমরা সব হোস্টিং প্ল্যানের জন্য ফ্রি ওয়েবসাইট মাইগ্রেশন অফার করি। আমাদের এক্সপার্ট টিম পুরো প্রক্রিয়া শূন্য ডাউনটাইমে পরিচালনা করবে।' : 'Yes! We offer free website migration for all hosting plans. Our expert team will handle the entire process with zero downtime.' 
    },
    { 
      category: 'hosting',
      q: language === 'bn' ? 'আপনাদের আপটাইম গ্যারান্টি কত?' : 'What is your uptime guarantee?', 
      a: language === 'bn' ? 'আমরা আমাদের সব হোস্টিং সার্ভিসের জন্য ৯৯.৯৯% আপটাইম গ্যারান্টি দিই, যা আমাদের SLA দ্বারা সমর্থিত। আপটাইম গ্যারান্টি পূরণ না হলে সার্ভিস ক্রেডিট পাবেন।' : 'We guarantee 99.99% uptime for all our hosting services, backed by our SLA. You\'ll receive service credits if we fail to meet this guarantee.' 
    },
    { 
      category: 'domain',
      q: language === 'bn' ? 'ডোমেইন ট্রান্সফার করতে কতদিন লাগে?' : 'How long does domain transfer take?', 
      a: language === 'bn' ? 'সাধারণত ডোমেইন ট্রান্সফার ৫-৭ দিন সময় নেয়। তবে কিছু ক্ষেত্রে এটি দ্রুত হতে পারে।' : 'Domain transfers typically take 5-7 days. However, in some cases it may be faster.' 
    },
    { 
      category: 'domain',
      q: language === 'bn' ? 'ডোমেইন প্রাইভেসি কি?' : 'What is domain privacy?', 
      a: language === 'bn' ? 'ডোমেইন প্রাইভেসি আপনার ব্যক্তিগত তথ্য (নাম, ঠিকানা, ফোন) WHOIS ডাটাবেস থেকে লুকিয়ে রাখে।' : 'Domain privacy hides your personal information (name, address, phone) from the WHOIS database.' 
    },
    { 
      category: 'billing',
      q: language === 'bn' ? 'আপনারা কি কি পেমেন্ট মেথড গ্রহণ করেন?' : 'What payment methods do you accept?', 
      a: language === 'bn' ? 'আমরা ক্রেডিট/ডেবিট কার্ড, PayPal, বিকাশ, নগদ, রকেট এবং ব্যাংক ট্রান্সফার গ্রহণ করি। বাংলাদেশি গ্রাহকদের জন্য মোবাইল ব্যাংকিং সবচেয়ে সহজ।' : 'We accept credit/debit cards, PayPal, bKash, Nagad, Rocket, and bank transfer. Mobile banking is easiest for Bangladeshi customers.' 
    },
    { 
      category: 'billing',
      q: language === 'bn' ? 'রিফান্ড পলিসি কি?' : 'What is your refund policy?', 
      a: language === 'bn' ? 'আমরা শেয়ার্ড হোস্টিংয়ে ৩০ দিন, VPS-এ ৭ দিন মানি ব্যাক গ্যারান্টি অফার করি। ডোমেইন এবং ডেডিকেটেড সার্ভার ফেরতযোগ্য নয়।' : 'We offer 30-day money-back guarantee on shared hosting, 7 days on VPS. Domains and dedicated servers are non-refundable.' 
    },
    { 
      category: 'technical',
      q: language === 'bn' ? 'SSL সার্টিফিকেট কি ফ্রি?' : 'Is SSL certificate free?', 
      a: language === 'bn' ? 'হ্যাঁ, সব হোস্টিং প্ল্যানের সাথে Let\'s Encrypt ফ্রি SSL সার্টিফিকেট অন্তর্ভুক্ত। প্রিমিয়াম SSL সার্টিফিকেটও আলাদাভাবে কেনা যায়।' : 'Yes, free Let\'s Encrypt SSL certificate is included with all hosting plans. Premium SSL certificates are also available for purchase.' 
    },
    { 
      category: 'technical',
      q: language === 'bn' ? 'ব্যাকআপ কিভাবে কাজ করে?' : 'How do backups work?', 
      a: language === 'bn' ? 'আমরা দৈনিক অটোমেটিক ব্যাকআপ করি এবং ৩০ দিন পর্যন্ত সংরক্ষণ করি। আপনি cPanel থেকে এক-ক্লিকে রিস্টোর করতে পারবেন।' : 'We perform daily automatic backups and retain them for up to 30 days. You can restore with one-click from cPanel.' 
    },
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const searchedFaqs = searchQuery 
    ? filteredFaqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'সাপোর্ট' : 'Support'}
        description={language === 'bn' ? 'CHost সাপোর্ট - 24/7 এক্সপার্ট সাপোর্ট টিম' : 'CHost Support - 24/7 Expert Support Team'}
        canonicalUrl="/support"
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Headphones className="w-5 h-5 text-white" />
            <span className="text-white font-medium">
              {language === 'bn' ? '24/7 এক্সপার্ট সাপোর্ট' : '24/7 Expert Support'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4">
            {language === 'bn' ? 'কিভাবে সাহায্য করতে পারি?' : 'How Can We Help?'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আমাদের এক্সপার্ট সাপোর্ট টিম আপনাকে 24/7 সাহায্য করতে প্রস্তুত।'
              : 'Our expert support team is ready to help you 24/7.'}
          </p>

          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={language === 'bn' ? 'আপনার প্রশ্ন সার্চ করুন...' : 'Search for your question...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-foreground border-0 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-6 bg-muted/50 border-b border-border">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <a 
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    {link.title}
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </p>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'bn' ? 'যোগাযোগের মাধ্যম' : 'Contact Channels'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? 'আপনার সুবিধামতো যেকোনো মাধ্যমে যোগাযোগ করুন' : 'Contact us through any channel of your choice'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option) => (
              <div 
                key={option.title}
                className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
              >
                <div className={`w-14 h-14 ${option.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{option.desc}</p>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-muted-foreground">{language === 'bn' ? 'সময়:' : 'Available:'}</span>
                  <span className="font-medium text-green-600">{option.available}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-6">
                  <span className="text-muted-foreground">{language === 'bn' ? 'রেসপন্স:' : 'Response:'}</span>
                  <span className="font-medium">{option.responseTime}</span>
                </div>

                <a href={option.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {option.action}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main CTA - Open Ticket */}
      <section className="py-12 bg-primary/5">
        <div className="container-wide text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'bn' ? 'সাপোর্ট টিকেট খুলুন' : 'Open a Support Ticket'}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {language === 'bn' 
              ? 'জটিল সমস্যার জন্য আমাদের বিলিং সিস্টেমে সাপোর্ট টিকেট জমা দিন।'
              : 'For complex issues, submit a support ticket through our billing system.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={WHMCS_URLS.submitTicket} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="lg" className="group">
                {language === 'bn' ? 'টিকেট খুলুন' : 'Open Ticket'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href={WHMCS_URLS.clientArea} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                {language === 'bn' ? 'ক্লায়েন্ট এরিয়া' : 'Client Area'}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? 'আপনার প্রশ্নের উত্তর খুঁজুন' : 'Find answers to your questions'}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {searchedFaqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {searchedFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
                </p>
              </div>
            )}
          </div>

          {/* Still need help? */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              {language === 'bn' ? 'আপনার প্রশ্নের উত্তর পাননি?' : "Didn't find your answer?"}
            </p>
            <a href={WHMCS_URLS.submitTicket} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                {language === 'bn' ? 'সাপোর্টে যোগাযোগ করুন' : 'Contact Support'}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
