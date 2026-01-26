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
      
      {/* Animated Background Blobs */}
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl animate-float" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full animate-float"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="container-wide relative">
        <div className="py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in hover:bg-accent/20 transition-colors cursor-default">
                <Shield className="h-4 w-4 animate-pulse" />
                <span>বাংলাদেশের সেরা হোস্টিং সেবা</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-display leading-tight mb-5">
                <span className="inline-block animate-fade-in-up">{t('hero.title')}</span>{' '}
                <span className="inline-block text-gradient-primary animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <Button variant="hero" size="lg" asChild className="group relative overflow-hidden">
                  <Link to="/hosting/web">
                    <span className="relative z-10 flex items-center">
                      {t('hero.getStarted')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild className="group">
                  <Link to="/hosting">
                    <span className="group-hover:text-accent transition-colors">{t('hero.viewPlans')}</span>
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">99.99%</p>
                    <p className="text-xs text-muted-foreground">{t('hero.uptime')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground">{t('hero.support')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 group-hover:scale-110 transition-all duration-300">
                    <Globe className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">10+</p>
                    <p className="text-xs text-muted-foreground">{t('hero.servers')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Image with Animation */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Glow Effect Behind Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-slow" />
              </div>
              
              {/* Main Image */}
              <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <img 
                  src={heroDashboard} 
                  alt="CHost Dashboard - cPanel with Email, SSL, Database, WordPress features" 
                  className="w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-auto object-contain drop-shadow-2xl animate-float"
                  style={{ animationDuration: '6s' }}
                />
                
                {/* Floating Badge - Top */}
                <div className="absolute -top-4 right-10 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2 shadow-lg animate-float" style={{ animationDelay: '0.5s', animationDuration: '5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-success">SSL Secured</p>
                      <p className="text-[10px] text-muted-foreground">Free Forever</p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge - Bottom */}
                <div className="absolute -bottom-2 left-10 bg-card/90 backdrop-blur-sm border border-border rounded-xl px-4 py-2 shadow-lg animate-float" style={{ animationDelay: '1s', animationDuration: '5.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-accent">Ultra Fast</p>
                      <p className="text-[10px] text-muted-foreground">NVMe SSD</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;