import React from 'react';
import { Users, Award, Globe, Headphones, Target, Eye, Heart, Lightbulb, Shield, Zap, Clock, MapPin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    },
    {
      year: '2018',
      title: language === 'bn' ? 'ক্লাউড সার্ভিস' : 'Cloud Services',
      description: language === 'bn'
        ? 'ক্লাউড VPS এবং ডেডিকেটেড সার্ভার সার্ভিস চালু। গ্রাহক সংখ্যা ১,০০০ ছাড়ায়।'
        : 'Launched Cloud VPS and Dedicated Server services. Customer base exceeded 1,000.',
    },
    {
      year: '2020',
      title: language === 'bn' ? 'আন্তর্জাতিক সম্প্রসারণ' : 'Global Expansion',
      description: language === 'bn'
        ? 'সিঙ্গাপুর ও ইউএসএ ডেটা সেন্টারে সার্ভিস সম্প্রসারণ। ৫০+ দেশে গ্রাহক।'
        : 'Expanded services to Singapore and USA data centers. Customers in 50+ countries.',
    },
    {
      year: '2022',
      title: language === 'bn' ? 'এন্টারপ্রাইজ সলিউশন' : 'Enterprise Solutions',
      description: language === 'bn'
        ? 'বড় প্রতিষ্ঠানের জন্য কাস্টম সলিউশন ও ম্যানেজড সার্ভিস চালু।'
        : 'Launched custom solutions and managed services for large enterprises.',
    },
    {
      year: '2024',
      title: language === 'bn' ? '১০,০০০+ গ্রাহক' : '10,000+ Customers',
      description: language === 'bn'
        ? 'বাংলাদেশের অন্যতম বিশ্বস্ত হোস্টিং প্রদানকারী হিসেবে স্বীকৃতি। ১০,০০০+ সন্তুষ্ট গ্রাহক।'
        : 'Recognized as one of the most trusted hosting providers in Bangladesh with 10,000+ happy customers.',
    },
  ];

  const team = [
    {
      name: language === 'bn' ? 'রফিকুল ইসলাম' : 'Rafikul Islam',
      role: language === 'bn' ? 'প্রতিষ্ঠাতা ও সিইও' : 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      initials: 'RI',
    },
    {
      name: language === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed',
      role: language === 'bn' ? 'চিফ টেকনোলজি অফিসার' : 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      initials: 'TA',
    },
    {
      name: language === 'bn' ? 'সাবরিনা খান' : 'Sabrina Khan',
      role: language === 'bn' ? 'হেড অফ অপারেশনস' : 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
      initials: 'SK',
    },
    {
      name: language === 'bn' ? 'মাহমুদুল হাসান' : 'Mahmudul Hasan',
      role: language === 'bn' ? 'সিনিয়র সিস্টেম আর্কিটেক্ট' : 'Senior System Architect',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      initials: 'MH',
    },
    {
      name: language === 'bn' ? 'ফারহানা আক্তার' : 'Farhana Akter',
      role: language === 'bn' ? 'কাস্টমার সাকসেস ম্যানেজার' : 'Customer Success Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      initials: 'FA',
    },
    {
      name: language === 'bn' ? 'আরিফ রহমান' : 'Arif Rahman',
      role: language === 'bn' ? 'সিকিউরিটি স্পেশালিস্ট' : 'Security Specialist',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
      initials: 'AR',
    },
  ];

  const values = [
    {
      icon: Shield,
      title: language === 'bn' ? 'নিরাপত্তা' : 'Security',
      description: language === 'bn' 
        ? 'গ্রাহকদের ডেটার নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার।'
        : "Customer data security is our top priority.",
    },
    {
      icon: Zap,
      title: language === 'bn' ? 'গতি' : 'Speed',
      description: language === 'bn'
        ? 'সর্বোচ্চ পারফরম্যান্স নিশ্চিত করতে সর্বাধুনিক প্রযুক্তি ব্যবহার।'
        : 'Cutting-edge technology for maximum performance.',
    },
    {
      icon: Heart,
      title: language === 'bn' ? 'গ্রাহক সেবা' : 'Customer Care',
      description: language === 'bn'
        ? '২৪/৭ বিশেষজ্ঞ সাপোর্ট টিম সবসময় আপনার পাশে।'
        : 'Our 24/7 expert support team is always by your side.',
    },
    {
      icon: Lightbulb,
      title: language === 'bn' ? 'উদ্ভাবন' : 'Innovation',
      description: language === 'bn'
        ? 'প্রতিনিয়ত নতুন প্রযুক্তি ও সেবা নিয়ে আসছি।'
        : 'Continuously bringing new technologies and services.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <Award className="h-4 w-4" />
            <span>{language === 'bn' ? '২০১৬ সাল থেকে বিশ্বস্ত' : 'Trusted Since 2016'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 animate-fade-in">
            {language === 'bn' ? 'আমাদের' : 'About'} <span className="text-gradient-primary">CHost</span> {language === 'bn' ? 'সম্পর্কে' : ''}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? '২০১৬ সাল থেকে বিশ্বস্ত, নিরাপদ এবং দ্রুত ওয়েব হোস্টিং সলিউশনের জন্য আপনার নির্ভরযোগ্য পার্টনার।'
              : 'Your trusted partner for reliable, secure, and lightning-fast web hosting solutions since 2016.'}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-foreground/10 text-accent mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold font-display mb-1">{stat.value}</div>
                <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-6">
                {language === 'bn' ? 'আমাদের গল্প' : 'Our Story'}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === 'bn' 
                  ? 'CHost ২০১৬ সালে একটি সহজ লক্ষ্য নিয়ে যাত্রা শুরু করে: বাংলাদেশ এবং বিশ্বের সকল আকারের ব্যবসার জন্য নির্ভরযোগ্য, সাশ্রয়ী এবং নিরাপদ ওয়েব হোস্টিং সেবা প্রদান করা।'
                  : 'CHost was founded in 2016 with a simple mission: to provide reliable, affordable, and secure web hosting services to businesses of all sizes in Bangladesh and beyond.'}
              </p>
              <p className="text-muted-foreground mb-4">
                {language === 'bn'
                  ? 'যা শুরু হয়েছিল কিছু উৎসাহী প্রযুক্তিবিদদের ছোট টিম হিসেবে, তা এখন একটি শীর্ষস্থানীয় হোস্টিং প্রদানকারী যা ৫০টিরও বেশি দেশের হাজার হাজার গ্রাহককে সেবা দিচ্ছে।'
                  : 'What started as a small team of passionate technologists has grown into a leading hosting provider serving thousands of customers across more than 50 countries.'}
              </p>
              <p className="text-muted-foreground">
                {language === 'bn'
                  ? 'উৎকর্ষের প্রতি আমাদের প্রতিশ্রুতি, ২৪/৭ গ্রাহক সহায়তা এবং অত্যাধুনিক প্রযুক্তি আমাদেরকে নির্ভরযোগ্য হোস্টিং পার্টনার খুঁজছে এমন ব্যবসাগুলির বিশ্বস্ত পছন্দে পরিণত করেছে।'
                  : 'Our commitment to excellence, 24/7 customer support, and cutting-edge technology has made us the trusted choice for businesses looking for a reliable hosting partner.'}
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="feature-card text-center">
                    <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="font-semibold">Gulshan-01</div>
                    <div className="text-sm text-muted-foreground">Dhaka, Bangladesh</div>
                  </div>
                  <div className="feature-card text-center">
                    <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="font-semibold">3 Data Centers</div>
                    <div className="text-sm text-muted-foreground">BD, SG, USA</div>
                  </div>
                  <div className="feature-card text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="font-semibold">50+</div>
                    <div className="text-sm text-muted-foreground">{language === 'bn' ? 'টিম মেম্বার' : 'Team Members'}</div>
                  </div>
                  <div className="feature-card text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="font-semibold">99.99%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'আমাদের ইতিহাস' : 'Our Journey'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? '২০১৬ থেকে আজ পর্যন্ত আমাদের অগ্রযাত্রা' : 'Our progress from 2016 to today'}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border hidden lg:block" />
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={item.year} className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="feature-card inline-block max-w-md">
                      <div className="text-2xl font-bold text-primary mb-2">{item.year}</div>
                      <h3 className="text-lg font-semibold font-display mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background hidden lg:block" />
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-2xl transform transition-transform group-hover:scale-[1.02]" />
              <div className="relative p-8 lg:p-10 text-primary-foreground">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 mb-6">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">
                  {language === 'bn' ? 'আমাদের মিশন' : 'Our Mission'}
                </h3>
                <p className="text-primary-foreground/90 text-lg">
                  {language === 'bn'
                    ? 'নির্ভরযোগ্য, নিরাপদ এবং দ্রুত হোস্টিং সলিউশন দিয়ে ব্যবসাগুলিকে শক্তিশালী করা, পাশাপাশি তাদের যাত্রার প্রতিটি পদক্ষেপে অসাধারণ গ্রাহক সেবা প্রদান করা।'
                    : 'To empower businesses with reliable, secure, and fast hosting solutions while providing exceptional customer support at every step of their journey.'}
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 rounded-2xl transform transition-transform group-hover:scale-[1.02]" />
              <div className="relative p-8 lg:p-10 text-accent-foreground">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-foreground/10 mb-6">
                  <Eye className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">
                  {language === 'bn' ? 'আমাদের ভিশন' : 'Our Vision'}
                </h3>
                <p className="text-accent-foreground/90 text-lg">
                  {language === 'bn'
                    ? 'বাংলাদেশ এবং এশিয়ায় সবচেয়ে বিশ্বস্ত এবং গ্রাহক-কেন্দ্রিক হোস্টিং প্রদানকারী হয়ে উঠা, উদ্ভাবন এবং গুণমানের মাধ্যমে শিল্পের মান নির্ধারণ করা।'
                    : 'To become the most trusted and customer-centric hosting provider in Bangladesh and Asia, setting industry standards through innovation and quality.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'আমাদের মূল্যবোধ' : 'Our Core Values'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'এই মূল্যবোধগুলি আমাদের প্রতিটি সিদ্ধান্ত এবং কাজকে পরিচালিত করে।'
                : 'These values guide every decision we make and every action we take.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={value.title} className="feature-card text-center" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
              {language === 'bn' ? 'আমাদের টিম' : 'Our Team'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'আমাদের অভিজ্ঞ এবং নিবেদিতপ্রাণ টিম আপনার সাফল্যের জন্য কাজ করে।'
                : 'Our experienced and dedicated team works for your success.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={member.name} className="feature-card text-center group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative mb-4 inline-block">
                  <Avatar className="w-24 h-24 mx-auto ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h3 className="font-semibold font-display text-lg mb-1">{member.name}</h3>
                <p className="text-primary text-sm font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-primary text-primary-foreground text-center">
        <div className="container-wide">
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
            {language === 'bn' ? 'আমাদের সাথে যুক্ত হন' : 'Join Our Journey'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {language === 'bn' 
              ? '১০,০০০+ সন্তুষ্ট গ্রাহকের সাথে যোগ দিন এবং আপনার অনলাইন উপস্থিতিকে পরবর্তী স্তরে নিয়ে যান।'
              : 'Join 10,000+ satisfied customers and take your online presence to the next level.'}
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default About;
