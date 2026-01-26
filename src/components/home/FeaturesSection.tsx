import React from 'react';
import { Shield, Zap, Headphones, Server, Clock, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Feature {
  icon: React.ElementType;
  titleKey: string;
  descKey: string;
}

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features: Feature[] = [
    {
      icon: Shield,
      titleKey: 'features.security.title',
      descKey: 'features.security.desc',
    },
    {
      icon: Zap,
      titleKey: 'features.speed.title',
      descKey: 'features.speed.desc',
    },
    {
      icon: Headphones,
      titleKey: 'features.support.title',
      descKey: 'features.support.desc',
    },
    {
      icon: Server,
      titleKey: 'features.uptime.title',
      descKey: 'features.uptime.desc',
    },
  ];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className="feature-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/5 text-primary mb-5 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold font-display mb-3">
                {t(feature.titleKey)}
              </h3>
              <p className="text-muted-foreground">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
