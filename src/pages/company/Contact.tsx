import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, MessageSquare, Globe, Shield, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Headphones } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Name is too short" }).max(100),
  email: z.string().trim().email({ message: "Invalid email" }).max(255),
  phone: z.string().optional(),
  subject: z.string().trim().min(3, { message: "Subject is too short" }).max(200),
  message: z.string().trim().min(10, { message: "Message is too short" }).max(1000),
});

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'bn' ? 'আমাদের ঠিকানা' : 'Our Address',
      content: 'House#71, Road#27',
      subContent: 'Gulshan-01, Dhaka, Bangladesh',
      color: 'bg-blue-500'
    },
    {
      icon: Mail,
      title: language === 'bn' ? 'ইমেইল' : 'Email',
      content: 'support@chostbd.com',
      subContent: 'sales@chostbd.com',
      color: 'bg-green-500'
    },
    {
      icon: Phone,
      title: language === 'bn' ? 'ফোন' : 'Phone',
      content: '+880 1234-567890',
      subContent: '+880 9876-543210',
      color: 'bg-purple-500'
    },
    {
      icon: Clock,
      title: language === 'bn' ? 'অফিস সময়' : 'Office Hours',
      content: language === 'bn' ? 'শনি - বৃহস্পতি: সকাল ৯টা - রাত ১০টা' : 'Sat - Thu: 9AM - 10PM',
      subContent: language === 'bn' ? 'শুক্রবার: সকাল ১০টা - রাত ৮টা' : 'Friday: 10AM - 8PM',
      color: 'bg-orange-500'
    },
  ];

  const supportChannels = [
    { 
      icon: MessageSquare, 
      title: language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat', 
      desc: language === 'bn' ? '২৪/৭ অনলাইন সাপোর্ট' : '24/7 Online Support',
      response: language === 'bn' ? '< ১ মিনিট' : '< 1 min'
    },
    { 
      icon: Headphones, 
      title: language === 'bn' ? 'ফোন সাপোর্ট' : 'Phone Support', 
      desc: language === 'bn' ? 'সরাসরি কথা বলুন' : 'Talk Directly',
      response: language === 'bn' ? 'তাৎক্ষণিক' : 'Instant'
    },
    { 
      icon: Mail, 
      title: language === 'bn' ? 'টিকেট সিস্টেম' : 'Ticket System', 
      desc: language === 'bn' ? 'বিস্তারিত সমস্যার জন্য' : 'For Detailed Issues',
      response: language === 'bn' ? '২-৪ ঘণ্টা' : '2-4 hours'
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="text-white font-medium">
              {language === 'bn' ? 'আমরা সাহায্য করতে এখানে' : "We're Here to Help"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-4">
            {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get In Touch'}
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের টিমের সাথে যোগাযোগ করুন। আমরা ২৪/৭ আপনার সেবায় প্রস্তুত।'
              : 'Contact our team for any questions or assistance. We are available 24/7 to help you.'}
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-8 bg-muted/50 border-b border-border">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-4">
            {supportChannels.map((channel) => (
              <div key={channel.title} className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <channel.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-medium block">{channel.title}</span>
                  <span className="text-muted-foreground text-sm">{channel.desc}</span>
                </div>
                <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                  {channel.response}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-display mb-6">
                  {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group">
                      <div className={`w-12 h-12 rounded-xl ${info.color} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <info.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground mb-1">{info.title}</p>
                        <p className="text-muted-foreground">{info.content}</p>
                        <p className="text-muted-foreground text-sm">{info.subContent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-4">
                  {language === 'bn' ? 'সোশ্যাল মিডিয়ায় ফলো করুন' : 'Follow Us on Social Media'}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.label}
                      href={social.href}
                      className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground ${social.color} hover:text-white transition-all`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0234567890123!2d90.41234567890123!3d23.78234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzU2LjQiTiA5MMKwMjQnNDQuNCJF!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CHost Office Location"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Trust Badge */}
              <div className="p-6 rounded-2xl bg-primary text-primary-foreground">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-6 w-6 text-accent" />
                  <span className="font-semibold">{language === 'bn' ? 'আপনার তথ্য নিরাপদ' : 'Your Data is Safe'}</span>
                </div>
                <p className="text-sm text-primary-foreground/80">
                  {language === 'bn' 
                    ? 'আমরা আপনার ব্যক্তিগত তথ্য সম্পূর্ণ গোপনীয় রাখি এবং কখনো তৃতীয় পক্ষের সাথে শেয়ার করি না।'
                    : 'We keep your personal information completely confidential and never share with third parties.'}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border p-8 lg:p-10">
                {!isSubmitted ? (
                  <>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Send className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold font-display">
                          {language === 'bn' ? 'মেসেজ পাঠান' : 'Send us a Message'}
                        </h3>
                        <p className="text-muted-foreground">
                          {language === 'bn' ? 'ফর্মটি পূরণ করুন, আমরা শীঘ্রই যোগাযোগ করব।' : 'Fill out the form and we will get back to you soon.'}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'আপনার নাম' : 'Your Name'} *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter your name'}
                            className={`w-full h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.name ? 'border-destructive' : 'border-border'}`}
                            maxLength={100}
                          />
                          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'ইমেইল' : 'Email'} *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={language === 'bn' ? 'ইমেইল লিখুন' : 'Enter your email'}
                            className={`w-full h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.email ? 'border-destructive' : 'border-border'}`}
                            maxLength={255}
                          />
                          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder={language === 'bn' ? '+880 1XXX-XXXXXX' : '+880 1XXX-XXXXXX'}
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'বিষয়' : 'Subject'} *</label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full h-12 px-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors.subject ? 'border-destructive' : 'border-border'}`}
                          >
                            <option value="">{language === 'bn' ? 'বিষয় নির্বাচন করুন' : 'Select a subject'}</option>
                            <option value="sales">{language === 'bn' ? 'সেলস সম্পর্কে জানতে চাই' : 'Sales Inquiry'}</option>
                            <option value="support">{language === 'bn' ? 'টেকনিক্যাল সাপোর্ট' : 'Technical Support'}</option>
                            <option value="billing">{language === 'bn' ? 'বিলিং প্রশ্ন' : 'Billing Question'}</option>
                            <option value="partnership">{language === 'bn' ? 'পার্টনারশিপ' : 'Partnership'}</option>
                            <option value="other">{language === 'bn' ? 'অন্যান্য' : 'Other'}</option>
                          </select>
                          {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'মেসেজ' : 'Message'} *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={language === 'bn' ? 'আপনার মেসেজ লিখুন...' : 'Write your message...'}
                          rows={5}
                          className={`w-full p-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${errors.message ? 'border-destructive' : 'border-border'}`}
                          maxLength={1000}
                        />
                        {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                        <p className="text-xs text-muted-foreground mt-1 text-right">{formData.message.length}/1000</p>
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        <Send className="mr-2 h-5 w-5" />
                        {language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold font-display mb-3">
                      {language === 'bn' ? 'ধন্যবাদ!' : 'Thank You!'}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {language === 'bn' 
                        ? 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা ২-৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।'
                        : 'Your message has been sent successfully. We will contact you within 2-4 hours.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}>
                        {language === 'bn' ? 'আরেকটি মেসেজ পাঠান' : 'Send Another Message'}
                      </Button>
                      <Button asChild>
                        <a href="/">{language === 'bn' ? 'হোমে যান' : 'Go Home'}</a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action CTA */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {language === 'bn' ? 'এখনই কথা বলতে চান?' : 'Want to Talk Now?'}
                </h3>
                <p className="text-primary-foreground/70">
                  {language === 'bn' ? 'আমাদের সাপোর্ট টিম অনলাইনে আছে' : 'Our support team is online'}
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
                <MessageSquare className="w-5 h-5 mr-2" />
                {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
