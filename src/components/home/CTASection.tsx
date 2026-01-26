import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const CTASection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 sm:p-12 lg:p-16">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>30-Day Money-Back Guarantee</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-primary-foreground mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              {t('cta.subtitle')}
            </p>

            <Button variant="accent" size="xl" asChild>
              <Link to="/hosting/web">
                {t('cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
