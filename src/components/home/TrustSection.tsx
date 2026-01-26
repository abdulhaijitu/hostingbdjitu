import React from 'react';
import { Globe, Clock, Users, Award, Shield, Zap, Server, Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TrustSection: React.FC = () => {
  const { t, language } = useLanguage();

  const stats = [
    {
      icon: Globe,
      value: '10,000+',
      label: t('trust.websites'),
      suffix: '',
    },
    {
      icon: Clock,
      value: '99.99',
      label: t('trust.uptime'),
      suffix: '%',
    },
    {
      icon: Headphones,
      value: '<5',
      label: t('trust.support'),
      suffix: language === 'bn' ? ' মিনিট' : ' min',
    },
    {
      icon: Award,
      value: '50+',
      label: t('trust.countries'),
      suffix: '',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection',
      desc: language === 'bn' ? 'সকল সার্ভারে বিল্ট-ইন' : 'Built-in on all servers'
    },
    {
      icon: Zap,
      title: language === 'bn' ? 'NVMe SSD' : 'NVMe SSD',
      desc: language === 'bn' ? '১০x দ্রুত স্টোরেজ' : '10x faster storage'
    },
    {
      icon: Server,
      title: language === 'bn' ? 'ফ্রি ব্যাকআপ' : 'Free Backups',
      desc: language === 'bn' ? 'দৈনিক অটো ব্যাকআপ' : 'Daily auto backups'
    },
    {
      icon: Globe,
      title: language === 'bn' ? 'গ্লোবাল CDN' : 'Global CDN',
      desc: language === 'bn' ? 'বিশ্বব্যাপী গতি' : 'Worldwide speed'
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none" />
      
      <div className="container-wide relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm mb-2 block">
            {language === 'bn' ? 'আমাদের বিশ্বাস করুন' : 'Trust Us'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            {t('trust.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'হাজার হাজার গ্রাহক কেন CHost-এ বিশ্বাস রাখেন তা দেখুন'
              : 'See why thousands of customers trust CHost'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative text-center p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold font-display text-foreground mb-2">
                {stat.value}<span className="text-primary">{stat.suffix}</span>
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features Strip */}
        <div className="bg-primary rounded-2xl p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="flex items-center gap-3 text-primary-foreground">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-primary-foreground/70 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
