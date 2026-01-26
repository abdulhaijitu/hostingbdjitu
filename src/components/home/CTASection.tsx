import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Headphones, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection: React.FC = () => {
  const { t, language } = useLanguage();

  const benefits = [
    { icon: Shield, text: language === 'bn' ? '৩০ দিন মানি ব্যাক গ্যারান্টি' : '30-Day Money Back Guarantee' },
    { icon: Zap, text: language === 'bn' ? 'ইনস্ট্যান্ট সেটআপ' : 'Instant Setup' },
    { icon: Headphones, text: language === 'bn' ? '২৪/৭ এক্সপার্ট সাপোর্ট' : '24/7 Expert Support' },
  ];

  return (
    <section className="py-16 lg:py-20">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-primary/90">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:30px_30px]" />

          <div className="relative px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 text-accent" />
                <span>{language === 'bn' ? 'আজই শুরু করুন' : 'Start Today'}</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight">
                {t('cta.title')}
              </h2>
              
              {/* Subtitle */}
              <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                  >
                    <benefit.icon className="w-4 h-4 text-accent" />
                    <span className="text-white text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="accent" size="xl" asChild className="group">
                  <Link to="/hosting/web">
                    {t('cta.button')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/contact">
                    {language === 'bn' ? 'আমাদের সাথে কথা বলুন' : 'Talk to Sales'}
                  </Link>
                </Button>
              </div>

              {/* Trust Text */}
              <p className="mt-8 text-white/60 text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {language === 'bn' 
                  ? 'কোনো ক্রেডিট কার্ড প্রয়োজন নেই • ইনস্ট্যান্ট সেটআপ'
                  : 'No credit card required • Instant setup'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
