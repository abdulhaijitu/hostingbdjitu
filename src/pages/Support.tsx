import React, { useState } from 'react';
import { ArrowRight, Headphones, MessageCircle, FileText, Clock, Send, Phone, Mail, CheckCircle, AlertCircle, Search, Book, Video, Download, ChevronRight, HelpCircle, LifeBuoy, Ticket, Zap } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const ticketSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  department: z.string().min(1, 'Please select a department'),
  priority: z.string().min(1, 'Please select a priority'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

const Support: React.FC = () => {
  const { language } = useLanguage();
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    department: '',
    priority: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      ticketSchema.parse(formData);
      setTicketSubmitted(true);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const supportOptions = [
    { 
      icon: MessageCircle, 
      title: language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat', 
      desc: language === 'bn' ? 'রিয়েল-টাইমে আমাদের সাপোর্ট টিমের সাথে চ্যাট করুন' : 'Chat with our support team in real-time', 
      available: '24/7',
      action: language === 'bn' ? 'চ্যাট শুরু করুন' : 'Start Chat',
      color: 'bg-green-500',
      responseTime: language === 'bn' ? '< ১ মিনিট' : '< 1 min'
    },
    { 
      icon: Phone, 
      title: language === 'bn' ? 'ফোন সাপোর্ট' : 'Phone Support', 
      desc: language === 'bn' ? 'সরাসরি আমাদের টিমের সাথে কথা বলুন' : 'Speak directly with our team', 
      available: language === 'bn' ? '৯AM - ১০PM' : '9AM - 10PM',
      action: language === 'bn' ? 'কল করুন' : 'Call Now',
      color: 'bg-blue-500',
      responseTime: language === 'bn' ? 'তাৎক্ষণিক' : 'Instant'
    },
    { 
      icon: Ticket, 
      title: language === 'bn' ? 'টিকেট সাবমিট' : 'Submit Ticket', 
      desc: language === 'bn' ? 'জটিল সমস্যার জন্য সাপোর্ট টিকেট জমা দিন' : 'Submit a support ticket for complex issues', 
      available: '24/7',
      action: language === 'bn' ? 'টিকেট খুলুন' : 'Open Ticket',
      color: 'bg-purple-500',
      responseTime: language === 'bn' ? '২-৪ ঘণ্টা' : '2-4 hours'
    },
    { 
      icon: Mail, 
      title: language === 'bn' ? 'ইমেইল সাপোর্ট' : 'Email Support', 
      desc: language === 'bn' ? 'বিস্তারিত সমস্যার জন্য ইমেইল করুন' : 'Email us for detailed issues', 
      available: '24/7',
      action: language === 'bn' ? 'ইমেইল করুন' : 'Send Email',
      color: 'bg-orange-500',
      responseTime: language === 'bn' ? '৪-৮ ঘণ্টা' : '4-8 hours'
    },
  ];

  const quickLinks = [
    { icon: Book, title: language === 'bn' ? 'নলেজ বেস' : 'Knowledge Base', desc: language === 'bn' ? '৫০০+ আর্টিকেল' : '500+ Articles', href: '#' },
    { icon: Video, title: language === 'bn' ? 'ভিডিও টিউটোরিয়াল' : 'Video Tutorials', desc: language === 'bn' ? '১০০+ ভিডিও' : '100+ Videos', href: '#' },
    { icon: Download, title: language === 'bn' ? 'সফটওয়্যার ডাউনলোড' : 'Downloads', desc: language === 'bn' ? 'টুলস ও ক্লায়েন্ট' : 'Tools & Clients', href: '#' },
    { icon: LifeBuoy, title: language === 'bn' ? 'সার্ভার স্ট্যাটাস' : 'Server Status', desc: language === 'bn' ? 'লাইভ স্ট্যাটাস' : 'Live Status', href: '#' },
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
      category: 'hosting',
      q: language === 'bn' ? 'কিভাবে আমার প্ল্যান আপগ্রেড করব?' : 'How do I upgrade my plan?', 
      a: language === 'bn' ? 'আপনি যেকোনো সময় আপনার ক্লায়েন্ট এরিয়া থেকে প্ল্যান আপগ্রেড করতে পারবেন। আপগ্রেড তাৎক্ষণিক এবং প্রোরেটেড - অর্থাৎ আপনি শুধু পার্থক্য পেমেন্ট করবেন।' : 'You can upgrade your plan anytime from your client area. The upgrade is instant and prorated - you only pay the difference.' 
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
    { 
      category: 'technical',
      q: language === 'bn' ? 'PHP ভার্সন কিভাবে পরিবর্তন করব?' : 'How to change PHP version?', 
      a: language === 'bn' ? 'cPanel-এ লগইন করুন → Select PHP Version → আপনার পছন্দের ভার্সন সিলেক্ট করুন → Apply।' : 'Login to cPanel → Select PHP Version → Choose your preferred version → Apply.' 
    },
    { 
      category: 'technical',
      q: language === 'bn' ? 'ইমেইল সেটআপ কিভাবে করব?' : 'How to setup email?', 
      a: language === 'bn' ? 'cPanel থেকে Email Accounts-এ যান, নতুন অ্যাকাউন্ট তৈরি করুন। আমরা IMAP, POP3 এবং Webmail সাপোর্ট করি।' : 'Go to Email Accounts in cPanel, create a new account. We support IMAP, POP3, and Webmail.' 
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

  const departments = [
    { value: 'sales', label: language === 'bn' ? 'সেলস' : 'Sales' },
    { value: 'technical', label: language === 'bn' ? 'টেকনিক্যাল সাপোর্ট' : 'Technical Support' },
    { value: 'billing', label: language === 'bn' ? 'বিলিং' : 'Billing' },
    { value: 'general', label: language === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'General Inquiry' },
  ];

  const priorities = [
    { value: 'low', label: language === 'bn' ? 'কম' : 'Low', color: 'bg-gray-500' },
    { value: 'medium', label: language === 'bn' ? 'মাঝারি' : 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: language === 'bn' ? 'উচ্চ' : 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: language === 'bn' ? 'জরুরি' : 'Urgent', color: 'bg-red-500' },
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
                className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <link.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{link.title}</p>
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
              <div key={option.title} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${option.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <option.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{option.desc}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">{option.available}</span>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {option.responseTime}
                  </span>
                </div>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {option.action}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Tabs */}
      <section className="py-16 bg-muted/30">
        <div className="container-wide">
          <Tabs defaultValue="faq" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14 bg-background">
              <TabsTrigger value="faq" className="text-base gap-2">
                <HelpCircle className="w-4 h-4" />
                {language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'FAQ'}
              </TabsTrigger>
              <TabsTrigger value="ticket" className="text-base gap-2">
                <Ticket className="w-4 h-4" />
                {language === 'bn' ? 'টিকেট সাবমিট' : 'Submit Ticket'}
              </TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-8">
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background border border-border hover:border-primary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="max-w-3xl mx-auto">
                {searchedFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-4">
                    {searchedFaqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`faq-${index}`}
                        className="bg-background rounded-xl border border-border px-6 data-[state=open]:border-primary data-[state=open]:shadow-md transition-all"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-5">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <HelpCircle className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{faq.q}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 pl-11">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12 bg-background rounded-xl border border-border">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">
                      {language === 'bn' ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No results found'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'অন্য কিছু সার্চ করুন অথবা সাপোর্ট টিকেট খুলুন' : 'Try searching for something else or open a support ticket'}
                    </p>
                  </div>
                )}

                <div className="text-center mt-8">
                  <p className="text-muted-foreground mb-4">
                    {language === 'bn' ? 'আপনার প্রশ্নের উত্তর পাননি?' : "Didn't find your answer?"}
                  </p>
                  <Button asChild>
                    <a href="#ticket">
                      {language === 'bn' ? 'সাপোর্ট টিকেট খুলুন' : 'Open Support Ticket'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Ticket Tab */}
            <TabsContent value="ticket" id="ticket">
              <div className="max-w-2xl mx-auto">
                <div className="bg-background rounded-2xl border border-border p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {language === 'bn' ? 'সাপোর্ট টিকেট' : 'Support Ticket'}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === 'bn' 
                        ? 'আপনার সমস্যার বিস্তারিত বিবরণ দিন, আমরা যত দ্রুত সম্ভব সাহায্য করব।'
                        : 'Describe your issue in detail and we\'ll help you as soon as possible.'}
                    </p>
                  </div>

                  {ticketSubmitted ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'bn' ? 'টিকেট সাবমিট হয়েছে!' : 'Ticket Submitted!'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {language === 'bn' 
                          ? 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
                          : 'We\'ll get back to you shortly.'}
                      </p>
                      <div className="bg-background rounded-lg p-4 mb-6">
                        <p className="text-sm text-muted-foreground mb-1">
                          {language === 'bn' ? 'টিকেট আইডি' : 'Ticket ID'}
                        </p>
                        <p className="text-xl font-mono font-bold text-primary">
                          #CHT{Math.random().toString(36).substr(2, 8).toUpperCase()}
                        </p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setTicketSubmitted(false);
                            setFormData({ name: '', email: '', subject: '', department: '', priority: '', message: '' });
                          }}
                        >
                          {language === 'bn' ? 'নতুন টিকেট' : 'New Ticket'}
                        </Button>
                        <Button asChild>
                          <Link to="/">{language === 'bn' ? 'হোমে যান' : 'Go Home'}</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {language === 'bn' ? 'আপনার নাম' : 'Your Name'} *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.name ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
                            placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                          />
                          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {language === 'bn' ? 'ইমেইল' : 'Email'} *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.email ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
                            placeholder="you@example.com"
                          />
                          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {language === 'bn' ? 'বিষয়' : 'Subject'} *
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.subject ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder={language === 'bn' ? 'আপনার সমস্যার সংক্ষিপ্ত বিবরণ' : 'Brief description of your issue'}
                        />
                        {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {language === 'bn' ? 'বিভাগ' : 'Department'} *
                          </label>
                          <select
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.department ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
                          >
                            <option value="">{language === 'bn' ? 'বিভাগ নির্বাচন করুন' : 'Select department'}</option>
                            {departments.map((dept) => (
                              <option key={dept.value} value={dept.value}>{dept.label}</option>
                            ))}
                          </select>
                          {errors.department && <p className="text-destructive text-xs mt-1">{errors.department}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {language === 'bn' ? 'অগ্রাধিকার' : 'Priority'} *
                          </label>
                          <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.priority ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary`}
                          >
                            <option value="">{language === 'bn' ? 'অগ্রাধিকার নির্বাচন করুন' : 'Select priority'}</option>
                            {priorities.map((p) => (
                              <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                          </select>
                          {errors.priority && <p className="text-destructive text-xs mt-1">{errors.priority}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Description'} *
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className={`w-full min-h-[150px] px-4 py-3 rounded-lg bg-background text-foreground border ${errors.message ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary resize-none`}
                          placeholder={language === 'bn' ? 'আপনার সমস্যার বিস্তারিত বিবরণ লিখুন...' : 'Describe your issue in detail...'}
                        />
                        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        {language === 'bn' ? 'টিকেট সাবমিট করুন' : 'Submit Ticket'}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {language === 'bn' ? 'জরুরি সাপোর্ট প্রয়োজন?' : 'Need Urgent Support?'}
                </h3>
                <p className="text-primary-foreground/70">
                  {language === 'bn' ? 'সার্ভার ডাউন বা ক্রিটিক্যাল সমস্যার জন্য এখনই কল করুন' : 'Call now for server down or critical issues'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <a 
                href="tel:+8801234567890" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +880 1234-567890
              </a>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5 mr-2" />
                {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
