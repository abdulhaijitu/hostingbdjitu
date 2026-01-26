import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

const TestimonialsSection: React.FC = () => {
  const { language } = useLanguage();

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: language === 'bn' ? 'রাকিব হাসান' : 'Rakib Hassan',
      role: language === 'bn' ? 'সিইও' : 'CEO',
      company: 'TechBD Solutions',
      content: language === 'bn' 
        ? 'CHost এর সার্ভিস অসাধারণ! ৩ বছর ধরে ব্যবহার করছি, কখনো ডাউনটাইম হয়নি। সাপোর্ট টিম খুবই সহায়ক।'
        : 'CHost service is amazing! Been using for 3 years, never experienced downtime. Support team is very helpful.',
      rating: 5,
      avatar: 'RH',
    },
    {
      id: 2,
      name: language === 'bn' ? 'ফারহানা আক্তার' : 'Farhana Akter',
      role: language === 'bn' ? 'ওয়েব ডেভেলপার' : 'Web Developer',
      company: 'CreativeHub',
      content: language === 'bn'
        ? 'আমার সব ক্লায়েন্টের ওয়েবসাইট CHost এ হোস্ট করি। স্পিড এবং সিকিউরিটি দুটোই চমৎকার।'
        : 'I host all my clients websites on CHost. Both speed and security are excellent.',
      rating: 5,
      avatar: 'FA',
    },
    {
      id: 3,
      name: language === 'bn' ? 'মোহাম্মদ আলী' : 'Mohammad Ali',
      role: language === 'bn' ? 'ই-কমার্স মালিক' : 'E-commerce Owner',
      company: 'ShopBangla',
      content: language === 'bn'
        ? 'আমার অনলাইন শপের জন্য পারফেক্ট হোস্টিং। ট্রাফিক বেশি হলেও সাইট স্লো হয় না।'
        : 'Perfect hosting for my online shop. Site never slows down even with high traffic.',
      rating: 5,
      avatar: 'MA',
    },
    {
      id: 4,
      name: language === 'bn' ? 'তানভীর আহমেদ' : 'Tanvir Ahmed',
      role: language === 'bn' ? 'ব্লগার' : 'Blogger',
      company: 'TechTalk BD',
      content: language === 'bn'
        ? 'সাশ্রয়ী মূল্যে প্রিমিয়াম কোয়ালিটি। বাংলায় সাপোর্ট পাওয়া যায় বলে খুবই সুবিধা।'
        : 'Premium quality at affordable price. Getting support in Bangla is very convenient.',
      rating: 5,
      avatar: 'TA',
    },
    {
      id: 5,
      name: language === 'bn' ? 'নুসরাত জাহান' : 'Nusrat Jahan',
      role: language === 'bn' ? 'স্টার্টআপ ফাউন্ডার' : 'Startup Founder',
      company: 'EduTech BD',
      content: language === 'bn'
        ? 'স্টার্টআপের জন্য বেস্ট চয়েস। সহজ সেটআপ, দ্রুত সার্ভার, এবং নির্ভরযোগ্য সার্ভিস।'
        : 'Best choice for startups. Easy setup, fast servers, and reliable service.',
      rating: 5,
      avatar: 'NJ',
    },
    {
      id: 6,
      name: language === 'bn' ? 'কামরুল ইসলাম' : 'Kamrul Islam',
      role: language === 'bn' ? 'এজেন্সি মালিক' : 'Agency Owner',
      company: 'WebCraft Agency',
      content: language === 'bn'
        ? 'রিসেলার হোস্টিং প্ল্যান নিয়েছি। ক্লায়েন্ট ম্যানেজমেন্ট খুবই সহজ, প্রফিট মার্জিনও ভালো।'
        : 'Took reseller hosting plan. Client management is very easy, profit margin is also good.',
      rating: 5,
      avatar: 'KI',
    },
  ];

  return (
    <section className="section-padding bg-gradient-hero relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container-wide relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Star className="h-4 w-4 fill-current" />
            <span>{language === 'bn' ? 'গ্রাহকদের মতামত' : 'Customer Reviews'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            {language === 'bn' ? 'আমাদের সন্তুষ্ট' : 'Our Happy'}{' '}
            <span className="text-gradient-primary">{language === 'bn' ? 'গ্রাহকরা' : 'Customers'}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? '১০,০০০+ ওয়েবসাইট আমাদের উপর বিশ্বাস রাখে। দেখুন তারা কী বলছেন।'
              : '10,000+ websites trust us. See what they have to say.'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative bg-card rounded-2xl border border-border/50 p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-accent/10 group-hover:text-accent/20 transition-colors">
                <Quote className="h-10 w-10" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10,000+', label: language === 'bn' ? 'সক্রিয় ওয়েবসাইট' : 'Active Websites' },
            { value: '99.99%', label: language === 'bn' ? 'আপটাইম গ্যারান্টি' : 'Uptime Guarantee' },
            { value: '24/7', label: language === 'bn' ? 'সাপোর্ট সার্ভিস' : 'Support Service' },
            { value: '8+', label: language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-card border border-border/50"
            >
              <p className="text-3xl lg:text-4xl font-bold text-gradient-primary mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;