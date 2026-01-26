import React, { useState } from 'react';
import { ArrowRight, DollarSign, Users, TrendingUp, Gift, Check, Star, Award, Zap, CreditCard, BarChart3, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { z } from 'zod';

const affiliateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  experience: z.string().min(1, 'Please select your experience'),
});

const Affiliate: React.FC = () => {
  const { language } = useLanguage();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    experience: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      affiliateSchema.parse(formData);
      setFormSubmitted(true);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  const benefits = [
    { icon: DollarSign, title: language === 'bn' ? '৫০% পর্যন্ত কমিশন' : 'Up to 50% Commission', desc: language === 'bn' ? 'প্রতিটি রেফারেলে উচ্চ কমিশন আয় করুন' : 'Earn generous commissions on every referral' },
    { icon: Users, title: language === 'bn' ? 'লাইফটাইম অ্যাট্রিবিউশন' : 'Lifetime Attribution', desc: language === 'bn' ? 'আপনার রেফার করা কাস্টমারদের জন্য সবসময় ক্রেডিট পান' : 'Get credit for customers you refer forever' },
    { icon: TrendingUp, title: language === 'bn' ? 'রিয়েল-টাইম ট্র্যাকিং' : 'Real-time Tracking', desc: language === 'bn' ? 'আপনার আয় রিয়েল-টাইমে দেখুন' : 'Monitor your earnings in real-time' },
    { icon: Gift, title: language === 'bn' ? 'মাসিক পেমেন্ট' : 'Monthly Payouts', desc: language === 'bn' ? 'PayPal বা ব্যাংক ট্রান্সফারে নির্ভরযোগ্য পেমেন্ট' : 'Reliable monthly payments via PayPal or bank' },
    { icon: BarChart3, title: language === 'bn' ? 'বিস্তারিত রিপোর্ট' : 'Detailed Reports', desc: language === 'bn' ? 'কমিশন ও কনভার্সন ট্র্যাক করুন' : 'Track commissions & conversions' },
    { icon: Zap, title: language === 'bn' ? 'মার্কেটিং ম্যাটেরিয়াল' : 'Marketing Materials', desc: language === 'bn' ? 'রেডি-টু-ইউজ ব্যানার ও লিংক' : 'Ready-to-use banners & links' },
  ];

  const commissionTiers = [
    { tier: language === 'bn' ? 'হোস্টিং প্ল্যান' : 'Hosting Plans', rate: '30%', color: 'bg-blue-500' },
    { tier: language === 'bn' ? 'VPS প্ল্যান' : 'VPS Plans', rate: '40%', color: 'bg-purple-500' },
    { tier: language === 'bn' ? 'ডেডিকেটেড সার্ভার' : 'Dedicated Servers', rate: '50%', color: 'bg-green-500' },
  ];

  const howItWorks = [
    { step: '1', title: language === 'bn' ? 'সাইন আপ করুন' : 'Sign Up', desc: language === 'bn' ? 'বিনামূল্যে অ্যাফিলিয়েট অ্যাকাউন্ট তৈরি করুন' : 'Create a free affiliate account' },
    { step: '2', title: language === 'bn' ? 'প্রোমোট করুন' : 'Promote', desc: language === 'bn' ? 'আপনার ইউনিক লিংক শেয়ার করুন' : 'Share your unique referral link' },
    { step: '3', title: language === 'bn' ? 'আয় করুন' : 'Earn', desc: language === 'bn' ? 'প্রতিটি সেলে কমিশন পান' : 'Get commission on every sale' },
    { step: '4', title: language === 'bn' ? 'পেমেন্ট পান' : 'Get Paid', desc: language === 'bn' ? 'প্রতি মাসে পেমেন্ট পান' : 'Receive payments monthly' },
  ];

  const testimonials = [
    {
      name: 'রাহুল আহমেদ',
      role: language === 'bn' ? 'ওয়েব ডেভেলপার' : 'Web Developer',
      content: language === 'bn' ? 'CHost অ্যাফিলিয়েট প্রোগ্রাম আমার জন্য দারুণ কাজ করেছে। প্রতি মাসে ভালো আয় হচ্ছে!' : 'CHost affiliate program has worked great for me. Good earnings every month!',
      earning: '৳৫০,০০০+/month'
    },
    {
      name: 'সাবরিনা খান',
      role: language === 'bn' ? 'ব্লগার' : 'Blogger',
      content: language === 'bn' ? 'রিয়েল-টাইম ট্র্যাকিং এবং সময়মতো পেমেন্ট। সেরা অ্যাফিলিয়েট প্রোগ্রাম!' : 'Real-time tracking and on-time payments. Best affiliate program!',
      earning: '৳৩০,০০০+/month'
    },
    {
      name: 'ফয়সাল করিম',
      role: language === 'bn' ? 'ইউটিউবার' : 'YouTuber',
      content: language === 'bn' ? '৫০% কমিশন রেট অন্য কোথাও পাইনি। CHost-কে সুপারিশ করি।' : "Haven't found 50% commission rate anywhere else. Recommend CHost.",
      earning: '৳১,০০,০০০+/month'
    },
  ];

  const experienceOptions = [
    { value: 'beginner', label: language === 'bn' ? 'নতুন (অভিজ্ঞতা নেই)' : 'Beginner (No experience)' },
    { value: 'intermediate', label: language === 'bn' ? 'মধ্যম (কিছু অভিজ্ঞতা)' : 'Intermediate (Some experience)' },
    { value: 'advanced', label: language === 'bn' ? 'অ্যাডভান্সড (অভিজ্ঞ)' : 'Advanced (Experienced)' },
    { value: 'expert', label: language === 'bn' ? 'এক্সপার্ট (প্রফেশনাল)' : 'Expert (Professional)' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-hero section-padding">
        <div className="container-wide text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <DollarSign className="h-4 w-4" />
            <span>{language === 'bn' ? 'প্রোমোট করে আয় করুন' : 'Earn While You Promote'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6">
            <span className="text-gradient-primary">{language === 'bn' ? 'অ্যাফিলিয়েট' : 'Affiliate'}</span> {language === 'bn' ? 'প্রোগ্রাম' : 'Program'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {language === 'bn' 
              ? 'আমাদের অ্যাফিলিয়েট প্রোগ্রামে যোগ দিন এবং প্রতিটি রেফারেলে ৫০% পর্যন্ত কমিশন আয় করুন। আয়ের কোন সীমা নেই!'
              : 'Join our affiliate program and earn up to 50% commission on every sale you refer. No limits on earnings!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'এখনই যোগ দিন' : 'Join Now'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="xl">
              {language === 'bn' ? 'আরও জানুন' : 'Learn More'}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৫০%</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'সর্বোচ্চ কমিশন' : 'Max Commission'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৫০০+</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'সক্রিয় অ্যাফিলিয়েট' : 'Active Affiliates'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৳১০L+</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'মাসিক পেআউট' : 'Monthly Payouts'}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">৯০ দিন</div>
              <div className="text-primary-foreground/70 text-sm">{language === 'bn' ? 'কুকি ডিউরেশন' : 'Cookie Duration'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'কেন আমাদের প্রোগ্রামে যোগ দেবেন?' : 'Why Join Our Program?'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card-hover p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold font-display mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'কমিশন স্ট্রাকচার' : 'Commission Structure'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'bn' ? 'প্রোডাক্ট অনুযায়ী আকর্ষণীয় কমিশন রেট' : 'Attractive commission rates by product'}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {commissionTiers.map((tier) => (
              <div key={tier.tier} className="bg-card rounded-2xl border border-border p-8 text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${tier.color}`}></div>
                <div className={`text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`}>
                  {tier.rate}
                </div>
                <div className="text-lg font-medium">{tier.tier}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'কিভাবে কাজ করে' : 'How It Works'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className="card-hover p-6 text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold font-display mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
                {idx < howItWorks.length - 1 && (
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
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'সফল অ্যাফিলিয়েটদের কথা' : 'Success Stories'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-success font-bold">{testimonial.earning}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-display mb-4">
                {language === 'bn' ? 'আজই যোগ দিন' : 'Join Today'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'bn' ? 'বিনামূল্যে অ্যাফিলিয়েট অ্যাকাউন্ট তৈরি করুন এবং আয় শুরু করুন' : 'Create a free affiliate account and start earning'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-success/10 border border-success/20 rounded-2xl p-8 text-center">
                <Check className="h-16 w-16 text-success mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {language === 'bn' ? 'আবেদন জমা হয়েছে!' : 'Application Submitted!'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'bn' 
                    ? 'আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।'
                    : "We'll get back to you soon."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 space-y-6">
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
                    {language === 'bn' ? 'ওয়েবসাইট (ঐচ্ছিক)' : 'Website (Optional)'}
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full h-12 px-4 rounded-lg bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'bn' ? 'অ্যাফিলিয়েট মার্কেটিং অভিজ্ঞতা' : 'Affiliate Marketing Experience'} *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className={`w-full h-12 px-4 rounded-lg bg-background text-foreground border ${errors.experience ? 'border-destructive' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-accent`}
                  >
                    <option value="">{language === 'bn' ? 'নির্বাচন করুন' : 'Select'}</option>
                    {experienceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.experience && <p className="text-destructive text-xs mt-1">{errors.experience}</p>}
                </div>

                <Button variant="hero" size="xl" type="submit" className="w-full">
                  {language === 'bn' ? 'অ্যাফিলিয়েট হিসেবে যোগ দিন' : 'Join as Affiliate'} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 text-center">
            <Award className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold font-display mb-4">
              {language === 'bn' ? 'আজই আয় শুরু করুন' : 'Start Earning Today'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {language === 'bn' 
                ? 'হাজার হাজার অ্যাফিলিয়েট ইতিমধ্যে আমাদের প্রোগ্রাম থেকে আয় করছে। আপনিও যোগ দিন!'
                : 'Thousands of affiliates are already earning from our program. Join them today!'}
            </p>
            <Button variant="hero" size="xl">
              {language === 'bn' ? 'বিনামূল্যে যোগ দিন' : 'Join for Free'} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Affiliate;
