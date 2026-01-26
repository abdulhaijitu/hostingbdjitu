import React from 'react';
import { Globe, Clock, Users, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TrustSection: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Globe,
      value: '10,000+',
      label: t('trust.websites'),
    },
    {
      icon: Clock,
      value: '99.99%',
      label: t('trust.uptime'),
    },
    {
      icon: Users,
      value: '<5 min',
      label: t('trust.support'),
    },
    {
      icon: Award,
      value: '50+',
      label: t('trust.countries'),
    },
  ];

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />

      <div className="container-wide relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            {t('trust.title')}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 lg:p-8 rounded-2xl bg-card border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-4">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold font-display text-foreground mb-2">
                {stat.value}
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
