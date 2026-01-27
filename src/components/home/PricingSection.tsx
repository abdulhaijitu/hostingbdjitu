import React, { useState } from 'react';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { WHMCS_URLS, redirectToWHMCS } from '@/lib/whmcsConfig';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  period: string;
  description: string;
  features: PlanFeature[];
  featured?: boolean;
  href: string;
  savings?: string;
  whmcsUrl: string;
}

const PricingSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const plans: Plan[] = [
    {
      name: t('pricing.starter'),
      monthlyPrice: '৳299',
      yearlyPrice: '৳199',
      period: isYearly ? (language === 'bn' ? '/মাস' : '/mo') : t('pricing.perMonth'),
      description: language === 'bn' ? 'ব্যক্তিগত ওয়েবসাইট ও ব্লগের জন্য' : 'Perfect for personal websites and blogs',
      savings: language === 'bn' ? '৩৩% সেভ করুন' : 'Save 33%',
      features: [
        { text: language === 'bn' ? '১টি ওয়েবসাইট' : '1 Website', included: true },
        { text: language === 'bn' ? '১০ GB NVMe SSD' : '10 GB NVMe SSD', included: true },
        { text: language === 'bn' ? 'ফ্রি SSL সার্টিফিকেট' : 'Free SSL Certificate', included: true },
        { text: language === 'bn' ? 'সাপ্তাহিক ব্যাকআপ' : 'Weekly Backups', included: true },
        { text: language === 'bn' ? '১টি ইমেইল একাউন্ট' : '1 Email Account', included: true },
        { text: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', included: false },
        { text: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', included: false },
      ],
      href: '/hosting/web',
      whmcsUrl: WHMCS_URLS.hosting.web,
    },
    {
      name: t('pricing.professional'),
      monthlyPrice: '৳799',
      yearlyPrice: '৳599',
      period: isYearly ? (language === 'bn' ? '/মাস' : '/mo') : t('pricing.perMonth'),
      description: language === 'bn' ? 'ক্রমবর্ধমান ব্যবসার জন্য আদর্শ' : 'Ideal for growing businesses',
      savings: language === 'bn' ? '২৫% সেভ করুন' : 'Save 25%',
      features: [
        { text: language === 'bn' ? 'আনলিমিটেড ওয়েবসাইট' : 'Unlimited Websites', included: true },
        { text: language === 'bn' ? '৫০ GB NVMe SSD' : '50 GB NVMe SSD', included: true },
        { text: language === 'bn' ? 'ফ্রি SSL সার্টিফিকেট' : 'Free SSL Certificate', included: true },
        { text: language === 'bn' ? 'দৈনিক ব্যাকআপ' : 'Daily Backups', included: true },
        { text: language === 'bn' ? 'আনলিমিটেড ইমেইল' : 'Unlimited Email', included: true },
        { text: language === 'bn' ? 'DDoS প্রোটেকশন' : 'DDoS Protection', included: true },
        { text: language === 'bn' ? 'প্রায়োরিটি সাপোর্ট' : 'Priority Support', included: false },
      ],
      featured: true,
      href: '/hosting/premium',
      whmcsUrl: WHMCS_URLS.hosting.premium,
    },
    {
      name: t('pricing.business'),
      monthlyPrice: '৳1,499',
      yearlyPrice: '৳1,199',
      period: isYearly ? (language === 'bn' ? '/মাস' : '/mo') : t('pricing.perMonth'),
      description: language === 'bn' ? 'হাই-ট্রাফিক এন্টারপ্রাইজ সাইটের জন্য' : 'For high-traffic enterprise sites',
      savings: language === 'bn' ? '২০% সেভ করুন' : 'Save 20%',
      features: [
        { text: language === 'bn' ? 'আনলিমিটেড ওয়েবসাইট' : 'Unlimited Websites', included: true },
        { text: language === 'bn' ? '১০০ GB NVMe SSD' : '100 GB NVMe SSD', included: true },
        { text: language === 'bn' ? 'ফ্রি SSL সার্টিফিকেট' : 'Free SSL Certificate', included: true },
        { text: language === 'bn' ? 'রিয়েল-টাইম ব্যাকআপ' : 'Real-time Backups', included: true },
        { text: language === 'bn' ? 'আনলিমিটেড ইমেইল' : 'Unlimited Email', included: true },
        { text: language === 'bn' ? 'অ্যাডভান্সড DDoS প্রোটেকশন' : 'Advanced DDoS Protection', included: true },
        { text: language === 'bn' ? '২৪/৭ প্রায়োরিটি সাপোর্ট' : 'Priority 24/7 Support', included: true },
      ],
      href: '/hosting/premium',
      whmcsUrl: WHMCS_URLS.hosting.premium,
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            {t('pricing.subtitle')}
          </p>

          {/* Monthly/Yearly Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-muted rounded-full">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                !isYearly 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {language === 'bn' ? 'মাসিক' : 'Monthly'}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative",
                isYearly 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {language === 'bn' ? 'বার্ষিক' : 'Yearly'}
              {!isYearly && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full animate-pulse">
                  {language === 'bn' ? 'সেভ' : 'Save'}
                </span>
              )}
            </button>
          </div>

          {isYearly && (
            <p className="mt-4 text-sm text-accent font-medium animate-fade-in">
              🎉 {language === 'bn' ? 'বার্ষিক প্ল্যানে ২ মাস ফ্রি!' : '2 months free with yearly plans!'}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl transition-all duration-300',
                plan.featured
                  ? 'pricing-card-featured scale-105 z-10'
                  : 'pricing-card'
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    {t('pricing.mostPopular')}
                  </span>
                </div>
              )}

              <div className="p-6 lg:p-8">
                <h3 className={cn(
                  'text-xl font-semibold font-display mb-2',
                  plan.featured ? 'text-primary-foreground' : 'text-foreground'
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  'text-sm mb-6',
                  plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn(
                      'text-4xl lg:text-5xl font-bold font-display transition-all duration-300',
                      plan.featured ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className={cn(
                      'text-sm',
                      plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {plan.period}
                    </span>
                  </div>
                  {isYearly && (
                    <div className="mt-2">
                      <span className={cn(
                        'text-xs line-through mr-2',
                        plan.featured ? 'text-primary-foreground/50' : 'text-muted-foreground'
                      )}>
                        {plan.monthlyPrice}
                      </span>
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        plan.featured ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent'
                      )}>
                        {plan.savings}
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className={cn(
                        'flex items-center gap-3 text-sm',
                        !feature.included && 'opacity-50'
                      )}
                    >
                      <Check className={cn(
                        'h-5 w-5 shrink-0',
                        plan.featured
                          ? feature.included ? 'text-accent' : 'text-primary-foreground/50'
                          : feature.included ? 'text-success' : 'text-muted-foreground'
                      )} />
                      <span className={plan.featured ? 'text-primary-foreground' : 'text-foreground'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.featured ? 'accent' : 'hero'}
                  size="lg"
                  className="w-full"
                  onClick={() => redirectToWHMCS(plan.whmcsUrl)}
                >
                  {t('pricing.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;