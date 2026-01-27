import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Shield, Zap, Headphones, ExternalLink } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import { WHMCS_URLS } from '@/lib/whmcsConfig';
import chostLogo from '@/assets/chost-logo.png';
import OptimizedImage from '@/components/common/OptimizedImage';

/**
 * Login Page - WHMCS Redirect Only
 * 
 * This page does NOT have a login form.
 * It displays branding and redirects to WHMCS Client Area.
 */
const Login: React.FC = () => {
  const { language } = useLanguage();

  // Auto-redirect after 3 seconds (optional - can be removed)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = WHMCS_URLS.clientArea;
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    { icon: Shield, text: language === 'bn' ? 'সিকিউর লগইন' : 'Secure Login' },
    { icon: Zap, text: language === 'bn' ? 'তাৎক্ষণিক অ্যাক্সেস' : 'Instant Access' },
    { icon: Headphones, text: language === 'bn' ? '24/7 সাপোর্ট' : '24/7 Support' },
  ];

  const handleRedirect = () => {
    window.location.href = WHMCS_URLS.clientArea;
  };

  return (
    <Layout>
      <SEOHead
        title={language === 'bn' ? 'লগইন' : 'Login'}
        description={language === 'bn' ? 'CHost ক্লায়েন্ট এরিয়ায় লগইন করুন।' : 'Login to CHost Client Area.'}
        canonicalUrl="/login"
        noIndex={true}
      />
      <section className="min-h-[80vh] flex items-center section-padding bg-gradient-hero">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8">
              <OptimizedImage 
                src={chostLogo} 
                alt="CHost" 
                className="h-16 w-auto mx-auto"
                priority={true}
              />
            </div>

            {/* Card */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-lg">
              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl font-bold font-display mb-4">
                {language === 'bn' ? 'ক্লায়েন্ট এরিয়া' : 'Client Area'}
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {language === 'bn' 
                  ? 'আপনাকে ক্লায়েন্ট এরিয়ায় রিডাইরেক্ট করা হচ্ছে। দয়া করে অপেক্ষা করুন...'
                  : 'You will be redirected to the Client Area. Please wait...'}
              </p>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {features.map((f) => (
                  <div key={f.text} className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleRedirect}
                className="group"
              >
                {language === 'bn' ? 'ক্লায়েন্ট এরিয়ায় যান' : 'Go to Client Area'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* External link indicator */}
              <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-1">
                <ExternalLink className="h-4 w-4" />
                billing.chostbd.com
              </p>
            </div>

            {/* Help text */}
            <p className="mt-6 text-sm text-muted-foreground">
              {language === 'bn' 
                ? 'সমস্যা হচ্ছে? '
                : 'Having trouble? '}
              <a 
                href={WHMCS_URLS.submitTicket}
                className="text-accent hover:underline"
              >
                {language === 'bn' ? 'সাপোর্টে যোগাযোগ করুন' : 'Contact Support'}
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
