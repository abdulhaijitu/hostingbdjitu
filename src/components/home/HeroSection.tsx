import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroDashboard from '@/assets/hero-dashboard.png';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-wide relative">
        <div className="py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
                <Shield className="h-4 w-4" />
                <span>বাংলাদেশের সেরা হোস্টিং সেবা</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-display leading-tight mb-5 animate-fade-in">
                {t('hero.title')}{' '}
                <span className="text-gradient-primary">{t('hero.titleHighlight')}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/hosting/web">
                    {t('hero.getStarted')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link to="/hosting">
                    {t('hero.viewPlans')}
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">99.99%</p>
                    <p className="text-xs text-muted-foreground">{t('hero.uptime')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground">{t('hero.support')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">10+</p>
                    <p className="text-xs text-muted-foreground">{t('hero.servers')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img 
                src={heroDashboard} 
                alt="CHost Dashboard - cPanel with Email, SSL, Database, WordPress features" 
                className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
