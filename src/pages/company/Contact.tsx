import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, MessageSquare, Globe, Shield } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Name is too short" }).max(100),
  email: z.string().trim().email({ message: "Invalid email" }).max(255),
  subject: z.string().trim().min(3, { message: "Subject is too short" }).max(200),
  message: z.string().trim().min(10, { message: "Message is too short" }).max(1000),
});

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
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
      content: 'House#71, Road#27, Gulshan-01, Dhaka',
      subContent: 'Bangladesh',
    },
    {
      icon: Mail,
      title: language === 'bn' ? 'ইমেইল' : 'Email',
      content: 'support@chostbd.com',
      subContent: 'sales@chostbd.com',
    },
    {
      icon: Phone,
      title: language === 'bn' ? 'ফোন' : 'Phone',
      content: '+880 1234-567890',
      subContent: '+880 9876-543210',
    },
    {
      icon: Clock,
      title: language === 'bn' ? 'অফিস সময়' : 'Office Hours',
      content: language === 'bn' ? 'শনি - বৃহস্পতি: সকাল ৯টা - রাত ১০টা' : 'Sat - Thu: 9AM - 10PM',
      subContent: language === 'bn' ? 'শুক্রবার: সকাল ১০টা - রাত ৮টা' : 'Friday: 10AM - 8PM',
    },
  ];

  const supportChannels = [
    { icon: MessageSquare, title: language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat', desc: language === 'bn' ? '২৪/৭ অনলাইন সাপোর্ট' : '24/7 Online Support' },
    { icon: Mail, title: language === 'bn' ? 'টিকেট সিস্টেম' : 'Ticket System', desc: language === 'bn' ? '২-৪ ঘণ্টায় রেসপন্স' : '2-4 Hour Response' },
    { icon: Globe, title: language === 'bn' ? 'নলেজ বেস' : 'Knowledge Base', desc: language === 'bn' ? 'সেলফ-হেল্প গাইড' : 'Self-help Guides' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <MessageSquare className="h-4 w-4" />
            <span>{language === 'bn' ? 'আমরা সাহায্য করতে এখানে' : "We're Here to Help"}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in-up">
            {language === 'bn' ? 'আমাদের সাথে' : 'Contact'}{' '}
            <span className="text-gradient-primary">{language === 'bn' ? 'যোগাযোগ করুন' : 'Us'}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {language === 'bn' 
              ? 'যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের টিমের সাথে যোগাযোগ করুন। আমরা ২৪/৭ আপনার সেবায় প্রস্তুত।'
              : 'Get in touch with our team for any questions or assistance. We are available 24/7 to help you.'}
          </p>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {supportChannels.map((channel) => (
              <div key={channel.title} className="flex items-center gap-3">
                <channel.icon className="h-5 w-5 text-accent" />
                <div>
                  <span className="font-medium">{channel.title}</span>
                  <span className="text-primary-foreground/70 text-sm ml-2">{channel.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold font-display mb-6">
                  {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div key={info.title} className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{info.title}</p>
                        <p className="text-muted-foreground">{info.content}</p>
                        <p className="text-muted-foreground text-sm">{info.subContent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.0234567890123!2d90.41234567890123!3d23.78234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ2JzU2LjQiTiA5MMKwMjQnNDQuNCJF!5e0!3m2!1sen!2sbd!4v1234567890"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CHost Office Location"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Trust Badge */}
              <div className="p-6 rounded-2xl bg-gradient-primary text-primary-foreground">
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
                    <h3 className="text-2xl font-bold font-display mb-2">
                      {language === 'bn' ? 'মেসেজ পাঠান' : 'Send us a Message'}
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      {language === 'bn' ? 'ফর্মটি পূরণ করুন, আমরা শীঘ্রই যোগাযোগ করব।' : 'Fill out the form and we will get back to you soon.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'আপনার নাম' : 'Your Name'} *</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter your name'}
                            className={`w-full p-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.name ? 'border-destructive' : 'border-border'}`}
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
                            className={`w-full p-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.email ? 'border-destructive' : 'border-border'}`}
                            maxLength={255}
                          />
                          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'বিষয়' : 'Subject'} *</label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className={`w-full p-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.subject ? 'border-destructive' : 'border-border'}`}
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

                      <div>
                        <label className="block text-sm font-medium mb-2">{language === 'bn' ? 'মেসেজ' : 'Message'} *</label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={language === 'bn' ? 'আপনার মেসেজ লিখুন...' : 'Write your message...'}
                          rows={5}
                          className={`w-full p-4 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none ${errors.message ? 'border-destructive' : 'border-border'}`}
                          maxLength={1000}
                        />
                        {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                        <p className="text-xs text-muted-foreground mt-1 text-right">{formData.message.length}/1000</p>
                      </div>

                      <Button type="submit" variant="hero" size="xl" className="w-full">
                        <Send className="mr-2 h-5 w-5" />
                        {language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12 animate-scale-in">
                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-success" />
                    </div>
                    <h3 className="text-2xl font-bold font-display mb-3">
                      {language === 'bn' ? 'ধন্যবাদ!' : 'Thank You!'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === 'bn' 
                        ? 'আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
                        : 'Your message has been sent successfully. We will contact you soon.'}
                    </p>
                    <Button variant="outline" onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}>
                      {language === 'bn' ? 'আরেকটি মেসেজ পাঠান' : 'Send Another Message'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;