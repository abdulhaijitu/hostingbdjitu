import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, Mail, Lock, Database, Server, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  const floatingFeatures = [
    { icon: Mail, label: 'Email', color: 'text-emerald-500' },
    { icon: Lock, label: 'SSL', color: 'text-primary' },
    { icon: Database, label: 'Database', color: 'text-accent' },
    { icon: FileText, label: 'WordPress', color: 'text-blue-500' },
    { icon: Server, label: 'cPanel', color: 'text-orange-500' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container-wide relative">
        <div className="py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
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
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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

            {/* Right Side - Floating Dashboard Style */}
            <div className="relative hidden lg:block">
              {/* Main Dashboard Card */}
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-2xl">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <span className="text-lg font-semibold text-primary/80">My Dashboard</span>
                  <span className="text-xl font-bold text-orange-500">cPanel</span>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {floatingFeatures.slice(0, 3).map((feature, index) => (
                    <div
                      key={feature.label}
                      className="bg-background/50 rounded-xl p-4 text-center border border-border/50 hover:border-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted mb-2 group-hover:scale-110 transition-transform ${feature.color}`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{feature.label}</p>
                    </div>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-2 gap-4">
                  {floatingFeatures.slice(3, 5).map((feature, index) => (
                    <div
                      key={feature.label}
                      className="bg-background/50 rounded-xl p-4 flex items-center gap-3 border border-border/50 hover:border-accent/50 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted group-hover:scale-110 transition-transform ${feature.color}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{feature.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge - Top Right */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-4 py-3 shadow-lg animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-accent">8+ Years</p>
                    <p className="text-[10px] text-muted-foreground">Reliable Service</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Bottom Left */}
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-4 py-3 shadow-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Server className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-emerald-500">99.9%</p>
                    <p className="text-[10px] text-muted-foreground">Server Uptime</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-accent/5 via-transparent to-primary/5 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
