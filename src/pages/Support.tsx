import React, { useState } from 'react';
import { ArrowRight, Headphones, MessageCircle, FileText, Clock, Send, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

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
      color: 'bg-green-500'
    },
    { 
      icon: Headphones, 
      title: language === 'bn' ? 'ফোন সাপোর্ট' : 'Phone Support', 
      desc: language === 'bn' ? 'সরাসরি আমাদের টিমের সাথে কথা বলুন' : 'Speak directly with our team', 
      available: language === 'bn' ? '৯AM - ১০PM' : '9AM - 10PM',
      action: language === 'bn' ? 'কল করুন' : 'Call Now',
      color: 'bg-blue-500'
    },
    { 
      icon: FileText, 
      title: language === 'bn' ? 'টিকেট সাবমিট' : 'Submit Ticket', 
      desc: language === 'bn' ? 'জটিল সমস্যার জন্য সাপোর্ট টিকেট জমা দিন' : 'Submit a support ticket for complex issues', 
      available: '24/7',
      action: language === 'bn' ? 'টিকেট খুলুন' : 'Open Ticket',
      color: 'bg-purple-500'
    },
  ];

  const faqs = [
    { 
      q: language === 'bn' ? 'হোস্টিং কিভাবে শুরু করব?' : 'How do I get started with hosting?', 
      a: language === 'bn' ? 'একটি হোস্টিং প্ল্যান বেছে নিন, চেকআউট সম্পন্ন করুন এবং মিনিটের মধ্যে আপনার cPanel লগইন ডিটেইলস পাবেন।' : 'Simply choose a hosting plan, complete the checkout, and you\'ll receive login details to your cPanel within minutes.' 
    },
    { 
      q: language === 'bn' ? 'আপনারা কি ফ্রি মাইগ্রেশন অফার করেন?' : 'Do you offer free migration?', 
      a: language === 'bn' ? 'হ্যাঁ! আমরা সব হোস্টিং প্ল্যানের জন্য ফ্রি ওয়েবসাইট মাইগ্রেশন অফার করি। আমাদের টিম পুরো প্রক্রিয়া পরিচালনা করবে।' : 'Yes! We offer free website migration for all hosting plans. Our team will handle the entire process.' 
    },
    { 
      q: language === 'bn' ? 'আপনাদের আপটাইম গ্যারান্টি কত?' : 'What is your uptime guarantee?', 
      a: language === 'bn' ? 'আমরা আমাদের সব হোস্টিং সার্ভিসের জন্য ৯৯.৯৯% আপটাইম গ্যারান্টি দিই, যা আমাদের SLA দ্বারা সমর্থিত।' : 'We guarantee 99.99% uptime for all our hosting services, backed by our SLA.' 
    },
    { 
      q: language === 'bn' ? 'কিভাবে আমার প্ল্যান আপগ্রেড করব?' : 'How do I upgrade my plan?', 
      a: language === 'bn' ? 'আপনি যেকোনো সময় আপনার ক্লায়েন্ট এরিয়া থেকে প্ল্যান আপগ্রেড করতে পারবেন। আপগ্রেড তাৎক্ষণিক এবং প্রোরেটেড।' : 'You can upgrade your plan anytime from your client area. The upgrade is instant and prorated.' 
    },
    { 
      q: language === 'bn' ? 'আপনারা কি কি পেমেন্ট মেথড গ্রহণ করেন?' : 'What payment methods do you accept?', 
      a: language === 'bn' ? 'আমরা ক্রেডিট কার্ড, PayPal, বিকাশ, নগদ এবং ব্যাংক ট্রান্সফার গ্রহণ করি।' : 'We accept credit cards, PayPal, bKash, Nagad, and bank transfer.' 
    },
    { 
      q: language === 'bn' ? 'SSL সার্টিফিকেট কি ফ্রি?' : 'Is SSL certificate free?', 
      a: language === 'bn' ? 'হ্যাঁ, সব হোস্টিং প্ল্যানের সাথে ফ্রি SSL সার্টিফিকেট অন্তর্ভুক্ত।' : 'Yes, free SSL certificate is included with all hosting plans.' 
    },
    { 
      q: language === 'bn' ? 'ব্যাকআপ কিভাবে কাজ করে?' : 'How do backups work?', 
      a: language === 'bn' ? 'আমরা দৈনিক অটোমেটিক ব্যাকআপ করি এবং ৩০ দিন পর্যন্ত সংরক্ষণ করি। আপনি cPanel থেকে রিস্টোর করতে পারবেন।' : 'We perform daily automatic backups and retain them for up to 30 days. You can restore from cPanel.' 
    },
    { 
      q: language === 'bn' ? 'রিফান্ড পলিসি কি?' : 'What is your refund policy?', 
      a: language === 'bn' ? 'আমরা ৩০ দিনের মানি ব্যাক গ্যারান্টি অফার করি। সন্তুষ্ট না হলে পুরো টাকা ফেরত পাবেন।' : 'We offer a 30-day money-back guarantee. Get a full refund if you\'re not satisfied.' 
    },
  ];

  const departments = [
    { value: 'sales', label: language === 'bn' ? 'সেলস' : 'Sales' },
    { value: 'technical', label: language === 'bn' ? 'টেকনিক্যাল সাপোর্ট' : 'Technical Support' },
    { value: 'billing', label: language === 'bn' ? 'বিলিং' : 'Billing' },
    { value: 'general', label: language === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'General Inquiry' },
  ];

  const priorities = [
    { value: 'low', label: language === 'bn' ? 'কম' : 'Low' },
    { value: 'medium', label: language === 'bn' ? 'মাঝারি' : 'Medium' },
    { value: 'high', label: language === 'bn' ? 'উচ্চ' : 'High' },
    { value: 'urgent', label: language === 'bn' ? 'জরুরি' : 'Urgent' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Clock className="h-4 w-4" />
            <span>{language === 'bn' ? '24/7 উপলব্ধ' : '24/7 Available'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'সাপোর্ট' : 'Support'}</span> {language === 'bn' ? 'সেন্টার' : 'Center'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আমাদের এক্সপার্ট সাপোর্ট টিম আপনাকে 24/7 সাহায্য করতে প্রস্তুত। আপনার প্রয়োজনে যখন চান সাহায্য পান।'
              : 'Our expert support team is here to help you 24/7. Get the assistance you need, when you need it.'}
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid sm:grid-cols-3 gap-6">
            {supportOptions.map((option) => (
              <div key={option.title} className="card-hover p-8 text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${option.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                  <option.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold font-display mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{option.desc}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  {option.available}
                </div>
                <Button variant="outline" className="w-full">
                  {option.action}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Bar */}
      <section className="py-6 bg-primary/5 border-y border-border">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8">
            <a href="tel:+8801234567890" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Phone className="h-4 w-4 text-primary" />
              <span>+880 1234-567890</span>
            </a>
            <a href="mailto:support@chost.com" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Mail className="h-4 w-4 text-primary" />
              <span>support@chost.com</span>
            </a>
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span>{language === 'bn' ? 'লাইভ চ্যাট উপলব্ধ' : 'Live Chat Available'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Submission Form */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold font-display mb-6">
                {language === 'bn' ? 'সাপোর্ট টিকেট জমা দিন' : 'Submit a Support Ticket'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === 'bn' 
                  ? 'আপনার সমস্যার বিস্তারিত বিবরণ দিন, আমরা যত দ্রুত সম্ভব সাহায্য করব।'
                  : 'Describe your issue in detail and we\'ll help you as soon as possible.'}
              </p>

              {ticketSubmitted ? (
                <div className="bg-success/10 border border-success/20 rounded-2xl p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {language === 'bn' ? 'টিকেট সাবমিট হয়েছে!' : 'Ticket Submitted!'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'bn' 
                      ? 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
                      : 'We\'ll get back to you shortly.'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'টিকেট আইডি: #' : 'Ticket ID: #'}CHT{Math.random().toString(36).substr(2, 8).toUpperCase()}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setTicketSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', department: '', priority: '', message: '' });
                    }}
                  >
                    {language === 'bn' ? 'নতুন টিকেট' : 'New Ticket'}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'bn' ? 'আপনার নাম' : 'Your Name'} *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.name ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent`}
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
                        className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.email ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent`}
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
                      className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.subject ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent`}
                      placeholder={language === 'bn' ? 'আপনার সমস্যার সংক্ষিপ্ত বিবরণ' : 'Brief description of your issue'}
                    />
                    {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'bn' ? 'বিভাগ' : 'Department'} *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.department ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent`}
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
                        className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.priority ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent`}
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
                      {language === 'bn' ? 'বার্তা' : 'Message'} *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className={`w-full p-4 rounded-lg bg-background text-foreground border ${errors.message ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent resize-none`}
                      placeholder={language === 'bn' ? 'আপনার সমস্যার বিস্তারিত বিবরণ দিন...' : 'Describe your issue in detail...'}
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 text-sm">
                    <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      {language === 'bn' 
                        ? 'জরুরি সমস্যার জন্য লাইভ চ্যাট বা ফোন সাপোর্ট ব্যবহার করুন। টিকেটের উত্তর সাধারণত ২-৪ ঘণ্টার মধ্যে দেওয়া হয়।'
                        : 'For urgent issues, please use live chat or phone support. Ticket responses are typically within 2-4 hours.'}
                    </p>
                  </div>

                  <Button variant="hero" size="xl" type="submit" className="w-full">
                    <Send className="mr-2 h-5 w-5" />
                    {language === 'bn' ? 'টিকেট জমা দিন' : 'Submit Ticket'}
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold font-display mb-6">
                {language === 'bn' ? 'সাধারণ প্রশ্নাবলী' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === 'bn' 
                  ? 'সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নের উত্তর এখানে পাবেন।'
                  : 'Find answers to the most commonly asked questions here.'}
              </p>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-card rounded-lg border px-6">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Floating Prompt */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 rounded-3xl p-8 md:p-12 text-center border border-green-500/20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-6">
              <MessageCircle className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'তাৎক্ষণিক সাহায্য প্রয়োজন?' : 'Need Instant Help?'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের লাইভ চ্যাট সাপোর্ট ২৪/৭ উপলব্ধ। এখনই চ্যাট শুরু করুন এবং মিনিটের মধ্যে সাহায্য পান।'
                : 'Our live chat support is available 24/7. Start a chat now and get help within minutes.'}
            </p>
            <Button variant="hero" size="xl" className="bg-green-500 hover:bg-green-600">
              <MessageCircle className="mr-2 h-5 w-5" />
              {language === 'bn' ? 'লাইভ চ্যাট শুরু করুন' : 'Start Live Chat'}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Support;
