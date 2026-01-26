import React from 'react';
import { Users, Award, Globe, Headphones, Target, Eye, Heart, Lightbulb, Shield, Zap, Clock, MapPin, CheckCircle, Star, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { language } = useLanguage();

  const stats = [
    { icon: Users, value: '10,000+', label: language === 'bn' ? 'সন্তুষ্ট গ্রাহক' : 'Happy Customers' },
    { icon: Globe, value: '50+', label: language === 'bn' ? 'দেশে সেবা' : 'Countries Served' },
    { icon: Award, value: '10+', label: language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience' },
    { icon: Headphones, value: '24/7', label: language === 'bn' ? 'সাপোর্ট উপলব্ধ' : 'Support Available' },
  ];

  const timeline = [
    {
      year: '2016',
      title: language === 'bn' ? 'যাত্রা শুরু' : 'Journey Begins',
      description: language === 'bn' 
        ? 'ঢাকায় ৩ জনের ছোট টিম নিয়ে CHost এর যাত্রা শুরু। প্রথম বছরে ১০০+ গ্রাহকের বিশ্বাস অর্জন।'
        : 'CHost started with a small team of 3 in Dhaka. Gained trust of 100+ customers in the first year.',
      milestone: language === 'bn' ? '১০০+ গ্রাহক' : '100+ Customers'
    },
    {
      year: '2018',
      title: language === 'bn' ? 'ক্লাউড সার্ভিস' : 'Cloud Services',
      description: language === 'bn'
        ? 'ক্লাউড VPS এবং ডেডিকেটেড সার্ভার সার্ভিস চালু। গ্রাহক সংখ্যা ১,০০০ ছাড়ায়।'
        : 'Launched Cloud VPS and Dedicated Server services. Customer base exceeded 1,000.',
      milestone: language === 'bn' ? 'VPS লঞ্চ' : 'VPS Launch'
    },
    {
      year: '2020',
      title: language === 'bn' ? 'আন্তর্জাতিক সম্প্রসারণ' : 'Global Expansion',
      description: language === 'bn'
        ? 'সিঙ্গাপুর ও ইউএসএ ডেটা সেন্টারে সার্ভিস সম্প্রসারণ। ৫০+ দেশে গ্রাহক।'
        : 'Expanded services to Singapore and USA data centers. Customers in 50+ countries.',
      milestone: language === 'bn' ? '৫০+ দেশ' : '50+ Countries'
    },
    {
      year: '2022',
      title: language === 'bn' ? 'এন্টারপ্রাইজ সলিউশন' : 'Enterprise Solutions',
      description: language === 'bn'
        ? 'বড় প্রতিষ্ঠানের জন্য কাস্টম সলিউশন ও ম্যানেজড সার্ভিস চালু।'
        : 'Launched custom solutions and managed services for large enterprises.',
      milestone: language === 'bn' ? 'এন্টারপ্রাইজ' : 'Enterprise'
    },
    {
      year: '2024',
      title: language === 'bn' ? '১০,০০০+ গ্রাহক' : '10,000+ Customers',
      description: language === 'bn'
        ? 'বাংলাদেশের অন্যতম বিশ্বস্ত হোস্টিং প্রদানকারী হিসেবে স্বীকৃতি।'
        : 'Recognized as one of the most trusted hosting providers in Bangladesh.',
      milestone: language === 'bn' ? '#১ রেটেড' : '#1 Rated'
    },
  ];

  const team = [
    {
      name: language === 'bn' ? 'রফিকুল ইসলাম' : 'Rafikul Islam',
      role: language === 'bn' ? 'প্রতিষ্ঠাতা ও সিইও' : 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      initials: 'RI',
      bio: language === 'bn' ? '১৫+ বছরের টেক অভিজ্ঞতা' : '15+ years tech experience'
    },
    {
      name: language === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed',
      role: language === 'bn' ? 'চিফ টেকনোলজি অফিসার' : 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      initials: 'TA',
      bio: language === 'bn' ? 'ক্লাউড আর্কিটেক্ট' : 'Cloud Architect'
    },
    {
      name: language === 'bn' ? 'সাবরিনা খান' : 'Sabrina Khan',
      role: language === 'bn' ? 'হেড অফ অপারেশনস' : 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      initials: 'SK',
      bio: language === 'bn' ? 'অপারেশন এক্সপার্ট' : 'Operations Expert'
    },
    {
      name: language === 'bn' ? 'মাহমুদুল হাসান' : 'Mahmudul Hasan',
      role: language === 'bn' ? 'সিনিয়র সিস্টেম আর্কিটেক্ট' : 'Senior System Architect',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      initials: 'MH',
      bio: language === 'bn' ? 'ইনফ্রাস্ট্রাকচার লিড' : 'Infrastructure Lead'
    },
    {
      name: language === 'bn' ? 'ফারহানা আক্তার' : 'Farhana Akter',
      role: language === 'bn' ? 'কাস্টমার সাকসেস ম্যানেজার' : 'Customer Success Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      initials: 'FA',
      bio: language === 'bn' ? 'গ্রাহক সন্তুষ্টি বিশেষজ্ঞ' : 'Customer Satisfaction Expert'
    },
    {
      name: language === 'bn' ? 'আরিফ রহমান' : 'Arif Rahman',
      role: language === 'bn' ? 'সিকিউরিটি স্পেশালিস্ট' : 'Security Specialist',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      initials: 'AR',
      bio: language === 'bn' ? 'সাইবার সিকিউরিটি' : 'Cybersecurity'
    },
  ];

  const values = [
    {
      icon: Shield,
      title: language === 'bn' ? 'নিরাপত্তা প্রথম' : 'Security First',
      description: language === 'bn' 
        ? 'গ্রাহকদের ডেটার নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। সর্বাধুনিক নিরাপত্তা প্রযুক্তি ব্যবহার করি।'
        : "Customer data security is our top priority. We use cutting-edge security technologies.",
      color: 'bg-blue-500'
    },
    {
      icon: Zap,
      title: language === 'bn' ? 'অসাধারণ গতি' : 'Blazing Fast',
      description: language === 'bn'
        ? 'সর্বোচ্চ পারফরম্যান্স নিশ্চিত করতে NVMe SSD, LiteSpeed এবং উন্নত ক্যাশিং ব্যবহার।'
        : 'NVMe SSD, LiteSpeed, and advanced caching for maximum performance.',
      color: 'bg-yellow-500'
    },
    {
      icon: Heart,
      title: language === 'bn' ? 'গ্রাহক ভালোবাসা' : 'Customer Love',
      description: language === 'bn'
        ? '২৪/৭ বিশেষজ্ঞ সাপোর্ট টিম সবসময় আপনার পাশে। গ্রাহক সন্তুষ্টি আমাদের লক্ষ্য।'
        : 'Our 24/7 expert support team is always by your side. Customer satisfaction is our goal.',
      color: 'bg-red-500'
    },
    {
      icon: Lightbulb,
      title: language === 'bn' ? 'ধারাবাহিক উদ্ভাবন' : 'Continuous Innovation',
      description: language === 'bn'
        ? 'প্রতিনিয়ত নতুন প্রযুক্তি ও সেবা নিয়ে আসছি আপনার জন্য।'
        : 'Continuously bringing new technologies and services for you.',
      color: 'bg-purple-500'
    },
  ];

  const achievements = [
    { icon: Star, text: language === 'bn' ? '৪.৯/৫ গ্রাহক রেটিং' : '4.9/5 Customer Rating' },
    { icon: CheckCircle, text: language === 'bn' ? '৯৯.৯৯% আপটাইম' : '99.99% Uptime' },
    { icon: Users, text: language === 'bn' ? '১০,০০০+ সন্তুষ্ট গ্রাহক' : '10,000+ Happy Customers' },
    { icon: Globe, text: language === 'bn' ? '৩টি গ্লোবাল ডেটা সেন্টার' : '3 Global Data Centers' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Award className="w-5 h-5 text-white" />
                <span className="text-white font-medium">
                  {language === 'bn' ? '২০১৬ সাল থেকে বিশ্বস্ত' : 'Trusted Since 2016'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6">
                {language === 'bn' ? 'আমাদের' : 'About'} <span className="text-accent">CHost</span> {language === 'bn' ? 'সম্পর্কে' : ''}
              </h1>
              <p className="text-xl text-white/80 mb-8">
                {language === 'bn' 
                  ? 'বাংলাদেশ এবং বিশ্বের সকল আকারের ব্যবসার জন্য নির্ভরযোগ্য, সাশ্রয়ী এবং নিরাপদ ওয়েব হোস্টিং সেবা প্রদান করাই আমাদের লক্ষ্য।'
                  : 'Our goal is to provide reliable, affordable, and secure web hosting services to businesses of all sizes in Bangladesh and beyond.'}
              </p>
              <div className="flex flex-wrap gap-4">
                {achievements.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <item.icon className="w-4 h-4 text-accent" />
                    <span className="text-white text-sm font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="text-center p-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-accent mb-3">
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <p className="text-white/60 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium mb-2 block">
                {language === 'bn' ? 'আমাদের গল্প' : 'Our Story'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                {language === 'bn' ? 'একটি ছোট স্বপ্ন থেকে বড় যাত্রা' : 'From a Small Dream to a Big Journey'}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {language === 'bn' 
                    ? 'CHost ২০১৬ সালে একটি সহজ লক্ষ্য নিয়ে যাত্রা শুরু করে: বাংলাদেশে নির্ভরযোগ্য এবং সাশ্রয়ী হোস্টিং সেবা প্রদান করা। যা শুরু হয়েছিল মাত্র ৩ জনের ছোট টিম হিসেবে, তা এখন একটি শীর্ষস্থানীয় হোস্টিং প্রদানকারী।'
                    : 'CHost started in 2016 with a simple goal: to provide reliable and affordable hosting services in Bangladesh. What began as a small team of just 3 has now become a leading hosting provider.'}
                </p>
                <p>
                  {language === 'bn'
                    ? 'আজ আমরা ৫০টিরও বেশি দেশে ১০,০০০+ গ্রাহককে সেবা দিচ্ছি। আমাদের ৩টি গ্লোবাল ডেটা সেন্টার (বাংলাদেশ, সিঙ্গাপুর, ইউএসএ) থেকে ২৪/৭ নিরবচ্ছিন্ন সেবা প্রদান করছি।'
                    : 'Today we serve 10,000+ customers across more than 50 countries. We provide 24/7 uninterrupted service from our 3 global data centers (Bangladesh, Singapore, USA).'}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Gulshan-01</p>
                  <p className="text-xs text-muted-foreground">Dhaka, BD</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">3 DC</p>
                  <p className="text-xs text-muted-foreground">BD, SG, USA</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold">50+</p>
                  <p className="text-xs text-muted-foreground">{language === 'bn' ? 'টিম মেম্বার' : 'Team Members'}</p>
                </div>
              </div>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.year} className="relative flex gap-6 group">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10 group-hover:scale-110 transition-transform">
                      {item.year.slice(2)}
                    </div>
                    <div className="flex-1 bg-card rounded-xl border border-border p-4 group-hover:border-primary/30 group-hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{item.milestone}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted/30">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
              <div className="relative p-8 lg:p-10 text-primary-foreground">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">
                  {language === 'bn' ? 'আমাদের মিশন' : 'Our Mission'}
                </h3>
                <p className="text-primary-foreground/90 text-lg leading-relaxed">
                  {language === 'bn'
                    ? 'নির্ভরযোগ্য, নিরাপদ এবং দ্রুত হোস্টিং সলিউশন দিয়ে সকল আকারের ব্যবসাকে শক্তিশালী করা, পাশাপাশি তাদের ডিজিটাল যাত্রার প্রতিটি পদক্ষেপে অসাধারণ গ্রাহক সেবা প্রদান করা।'
                    : 'To empower businesses of all sizes with reliable, secure, and fast hosting solutions while providing exceptional customer support at every step of their digital journey.'}
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent/80" />
              <div className="relative p-8 lg:p-10 text-accent-foreground">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
                  <Eye className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">
                  {language === 'bn' ? 'আমাদের ভিশন' : 'Our Vision'}
                </h3>
                <p className="text-accent-foreground/90 text-lg leading-relaxed">
                  {language === 'bn'
                    ? 'বাংলাদেশ এবং দক্ষিণ এশিয়ায় সবচেয়ে বিশ্বস্ত এবং গ্রাহক-কেন্দ্রিক হোস্টিং প্রদানকারী হয়ে উঠা, উদ্ভাবন এবং গুণমানের মাধ্যমে শিল্পের মান নির্ধারণ করা।'
                    : 'To become the most trusted and customer-centric hosting provider in Bangladesh and South Asia, setting industry standards through innovation and quality.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-primary font-medium mb-2 block">
              {language === 'bn' ? 'আমাদের মূল্যবোধ' : 'Our Values'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'যা আমাদের চালিত করে' : 'What Drives Us'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'এই মূল্যবোধগুলো আমাদের প্রতিটি সিদ্ধান্ত এবং কাজকে গাইড করে।'
                : 'These values guide every decision we make and every action we take.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={value.title} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${value.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="text-primary font-medium mb-2 block">
              {language === 'bn' ? 'আমাদের টিম' : 'Our Team'}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'বিশেষজ্ঞদের সাথে পরিচিত হন' : 'Meet the Experts'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের অভিজ্ঞ টিম আপনার সফলতা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।'
                : 'Our experienced team is committed to ensuring your success.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all group">
                <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">{member.initials}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            {language === 'bn' ? 'আমাদের সাথে যোগ দিন' : 'Join Us Today'}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {language === 'bn' 
              ? '১০,০০০+ সন্তুষ্ট গ্রাহকের পরিবারে যোগ দিন এবং আপনার ওয়েবসাইটের জন্য সেরা হোস্টিং অভিজ্ঞতা পান।'
              : 'Join our family of 10,000+ happy customers and get the best hosting experience for your website.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="accent" size="lg" asChild>
              <Link to="/hosting">
                {language === 'bn' ? 'এখনই শুরু করুন' : 'Get Started Now'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/contact">
                {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
