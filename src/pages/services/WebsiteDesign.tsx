import React, { useState } from 'react';
import { ArrowRight, Palette, Code, Smartphone, Search, Check, Star, ExternalLink, Zap, Shield, Headphones, Clock, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';

const WebsiteDesign: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const services = [
    { icon: Palette, title: language === 'bn' ? 'কাস্টম ডিজাইন' : 'Custom Design', desc: language === 'bn' ? 'আপনার ব্র্যান্ডের জন্য ইউনিক ডিজাইন' : 'Unique designs tailored to your brand' },
    { icon: Code, title: language === 'bn' ? 'ওয়েব ডেভেলপমেন্ট' : 'Web Development', desc: language === 'bn' ? 'মডার্ন, ফাস্ট এবং সিকিউর ওয়েবসাইট' : 'Modern, fast, and secure websites' },
    { icon: Smartphone, title: language === 'bn' ? 'মোবাইল রেসপন্সিভ' : 'Mobile Responsive', desc: language === 'bn' ? 'সব ডিভাইসে পারফেক্ট' : 'Perfect on all devices' },
    { icon: Search, title: language === 'bn' ? 'SEO অপ্টিমাইজেশন' : 'SEO Optimization', desc: language === 'bn' ? 'সার্চ ইঞ্জিনে উচ্চ র্যাংক' : 'Rank higher on search engines' },
    { icon: Zap, title: language === 'bn' ? 'দ্রুত লোডিং' : 'Fast Loading', desc: language === 'bn' ? 'অপ্টিমাইজড পারফরম্যান্স' : 'Optimized performance' },
    { icon: Shield, title: language === 'bn' ? 'সিকিউরিটি' : 'Security', desc: language === 'bn' ? 'SSL এবং সিকিউরিটি ফিচার' : 'SSL and security features' },
  ];

  const plans = [
    {
      name: language === 'bn' ? 'স্টার্টার' : 'Starter',
      price: 14999,
      desc: language === 'bn' ? 'ছোট ব্যবসার জন্য পারফেক্ট' : 'Perfect for small businesses',
      features: [
        language === 'bn' ? '৫ পেজ ওয়েবসাইট' : '5 Page Website',
        language === 'bn' ? 'মোবাইল রেসপন্সিভ' : 'Mobile Responsive',
        language === 'bn' ? 'কন্টাক্ট ফর্ম' : 'Contact Form',
        language === 'bn' ? 'বেসিক SEO' : 'Basic SEO',
        language === 'bn' ? 'সোশ্যাল মিডিয়া ইন্টিগ্রেশন' : 'Social Media Integration',
        language === 'bn' ? '১ মাস সাপোর্ট' : '1 Month Support',
      ],
      notIncluded: [
        language === 'bn' ? 'ই-কমার্স' : 'E-commerce',
        language === 'bn' ? 'কাস্টম ফাংশনালিটি' : 'Custom Functionality',
      ]
    },
    {
      name: language === 'bn' ? 'প্রফেশনাল' : 'Professional',
      price: 29999,
      desc: language === 'bn' ? 'বর্ধনশীল ব্যবসার জন্য' : 'For growing businesses',
      features: [
        language === 'bn' ? '১০ পেজ ওয়েবসাইট' : '10 Page Website',
        language === 'bn' ? 'মোবাইল রেসপন্সিভ' : 'Mobile Responsive',
        language === 'bn' ? 'কন্টাক্ট ফর্ম' : 'Contact Form',
        language === 'bn' ? 'অ্যাডভান্সড SEO' : 'Advanced SEO',
        language === 'bn' ? 'সোশ্যাল মিডিয়া ইন্টিগ্রেশন' : 'Social Media Integration',
        language === 'bn' ? 'ব্লগ সেটআপ' : 'Blog Setup',
        language === 'bn' ? 'Google Analytics' : 'Google Analytics',
        language === 'bn' ? '৩ মাস সাপোর্ট' : '3 Months Support',
      ],
      notIncluded: [
        language === 'bn' ? 'ই-কমার্স' : 'E-commerce',
      ],
      featured: true
    },
    {
      name: language === 'bn' ? 'ই-কমার্স' : 'E-commerce',
      price: 49999,
      desc: language === 'bn' ? 'অনলাইন স্টোরের জন্য' : 'For online stores',
      features: [
        language === 'bn' ? 'আনলিমিটেড পেজ' : 'Unlimited Pages',
        language === 'bn' ? 'মোবাইল রেসপন্সিভ' : 'Mobile Responsive',
        language === 'bn' ? 'পেমেন্ট গেটওয়ে' : 'Payment Gateway',
        language === 'bn' ? 'প্রোডাক্ট ম্যানেজমেন্ট' : 'Product Management',
        language === 'bn' ? 'অর্ডার ম্যানেজমেন্ট' : 'Order Management',
        language === 'bn' ? 'ইনভেন্টরি ট্র্যাকিং' : 'Inventory Tracking',
        language === 'bn' ? 'অ্যাডভান্সড SEO' : 'Advanced SEO',
        language === 'bn' ? '৬ মাস সাপোর্ট' : '6 Months Support',
      ],
      notIncluded: []
    },
  ];

  const portfolioCategories = [
    { id: 'all', name: language === 'bn' ? 'সব' : 'All' },
    { id: 'business', name: language === 'bn' ? 'বিজনেস' : 'Business' },
    { id: 'ecommerce', name: language === 'bn' ? 'ই-কমার্স' : 'E-commerce' },
    { id: 'portfolio', name: language === 'bn' ? 'পোর্টফোলিও' : 'Portfolio' },
  ];

  const portfolioItems = [
    { 
      title: language === 'bn' ? 'ফ্যাশন স্টোর' : 'Fashion Store', 
      category: 'ecommerce',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      tech: ['React', 'Node.js', 'MongoDB']
    },
    { 
      title: language === 'bn' ? 'টেক স্টার্টআপ' : 'Tech Startup', 
      category: 'business',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      tech: ['Next.js', 'Tailwind']
    },
    { 
      title: language === 'bn' ? 'ক্রিয়েটিভ এজেন্সি' : 'Creative Agency', 
      category: 'portfolio',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
      tech: ['React', 'GSAP']
    },
    { 
      title: language === 'bn' ? 'রেস্টুরেন্ট' : 'Restaurant', 
      category: 'business',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
      tech: ['WordPress', 'PHP']
    },
    { 
      title: language === 'bn' ? 'ইলেকট্রনিক্স শপ' : 'Electronics Shop', 
      category: 'ecommerce',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      tech: ['WooCommerce', 'PHP']
    },
    { 
      title: language === 'bn' ? 'ফটোগ্রাফার' : 'Photographer', 
      category: 'portfolio',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop',
      tech: ['React', 'Framer Motion']
    },
  ];

  const filteredPortfolio = portfolioItems.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  const process = [
    { step: '1', title: language === 'bn' ? 'আলোচনা' : 'Discovery', desc: language === 'bn' ? 'আপনার প্রয়োজন বুঝতে মিটিং' : 'Meeting to understand your needs' },
    { step: '2', title: language === 'bn' ? 'ডিজাইন' : 'Design', desc: language === 'bn' ? 'ওয়্যারফ্রেম এবং ডিজাইন মকআপ' : 'Wireframes and design mockups' },
    { step: '3', title: language === 'bn' ? 'ডেভেলপমেন্ট' : 'Development', desc: language === 'bn' ? 'কোডিং এবং ডেভেলপমেন্ট' : 'Coding and development' },
    { step: '4', title: language === 'bn' ? 'লঞ্চ' : 'Launch', desc: language === 'bn' ? 'টেস্টিং এবং ডিপ্লয়মেন্ট' : 'Testing and deployment' },
  ];

  const formatPrice = (price: number) => `৳${price.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'ওয়েবসাইট ডিজাইন' : 'Website Design'}
        description={language === 'bn' ? 'প্রফেশনাল ওয়েবসাইট ডিজাইন এবং ডেভেলপমেন্ট সার্ভিস দিয়ে আপনার অনলাইন উপস্থিতি রূপান্তর করুন।' : 'Transform your online presence with professional website design and development services.'}
        keywords="website design, web development, responsive design, Bangladesh"
        canonicalUrl="/services/website-design"
      />
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Palette className="h-4 w-4" />
            <span>{language === 'bn' ? 'প্রফেশনাল ডিজাইন সার্ভিস' : 'Professional Design Services'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'ওয়েবসাইট' : 'Website'}</span> {language === 'bn' ? 'ডিজাইন' : 'Design'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আমাদের প্রফেশনাল ওয়েবসাইট ডিজাইন এবং ডেভেলপমেন্ট সার্ভিস দিয়ে আপনার অনলাইন উপস্থিতি রূপান্তর করুন।'
              : 'Transform your online presence with our professional website design and development services.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'কোট পান' : 'Get a Quote'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl">
              {language === 'bn' ? 'পোর্টফোলিও দেখুন' : 'View Portfolio'}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">২০০+</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'সম্পন্ন প্রজেক্ট' : 'Projects Completed'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">১৫০+</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'সন্তুষ্ট ক্লায়েন্ট' : 'Happy Clients'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৫+</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">24/7</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'সাপোর্ট' : 'Support'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আমাদের সার্ভিস' : 'Our Services'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="card-hover p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                  <service.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'প্রাইসিং প্যাকেজ' : 'Pricing Packages'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? 'আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন' : 'Choose the package that fits your needs'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className={plan.featured ? 'pricing-card-featured' : 'pricing-card'}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                      {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                    </span>
                  </div>
                )}
                <h3 className={`text-xl font-semibold font-display mb-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {plan.desc}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold font-display ${plan.featured ? 'text-primary-foreground' : ''}`}>
                    {formatPrice(plan.price)}
                  </span>
                  <span className={plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                    {language === 'bn' ? 'থেকে' : 'from'}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground' : ''}`}>
                      <Check className="h-5 w-5 text-accent shrink-0" /> {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f) => (
                    <li key={f} className={`flex items-center gap-2 ${plan.featured ? 'text-primary-foreground/50' : 'text-muted-foreground'}`}>
                      <X className="h-5 w-5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.featured ? 'accent' : 'hero'} size="lg" className="w-full">
                  {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আমাদের পোর্টফোলিও' : 'Our Portfolio'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {language === 'bn' ? 'আমাদের সাম্প্রতিক কিছু কাজ দেখুন' : 'Check out some of our recent work'}
            </p>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {portfolioCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item) => (
              <div key={item.title} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="accent" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {language === 'bn' ? 'দেখুন' : 'View'}
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold font-display mb-2">{item.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আমাদের প্রক্রিয়া' : 'Our Process'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="card-hover p-6 text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold font-display mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
                {idx < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 -right-3 z-10">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'ক্লায়েন্টদের মতামত' : 'Client Testimonials'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'রাফি আহমেদ',
                role: language === 'bn' ? 'সিইও, টেকভিশন' : 'CEO, TechVision',
                content: language === 'bn' ? 'অসাধারণ কাজ! সময়মতো ডেলিভারি এবং দারুণ কমিউনিকেশন।' : 'Amazing work! On-time delivery and great communication.'
              },
              {
                name: 'সাবিনা খান',
                role: language === 'bn' ? 'মালিক, ফ্যাশন হাউস' : 'Owner, Fashion House',
                content: language === 'bn' ? 'আমার ই-কমার্স সাইট অসাধারণ হয়েছে। সেলস অনেক বেড়েছে!' : 'My e-commerce site turned out amazing. Sales have increased a lot!'
              },
              {
                name: 'করিম উদ্দিন',
                role: language === 'bn' ? 'ফ্রিল্যান্সার' : 'Freelancer',
                content: language === 'bn' ? 'প্রফেশনাল পোর্টফোলিও সাইট পেয়েছি। অনেক ক্লায়েন্ট পাচ্ছি এখন।' : 'Got a professional portfolio site. Getting many clients now.'
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <Clock className="h-12 w-12 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl font-bold font-display mb-4">
            {language === 'bn' ? 'আপনার প্রজেক্ট শুরু করতে প্রস্তুত?' : 'Ready to Start Your Project?'}
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'বিনামূল্যে কনসালটেশন এবং কোটের জন্য আমাদের সাথে যোগাযোগ করুন।'
              : 'Contact us for a free consultation and quote.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="xl">
              {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Headphones className="mr-2 h-5 w-5" />
              {language === 'bn' ? 'কল করুন' : 'Call Us'}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default WebsiteDesign;
