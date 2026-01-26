import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  featured?: boolean;
  href: string;
}

const PricingSection: React.FC = () => {
  const { t } = useLanguage();

  const plans: Plan[] = [
    {
      name: t('pricing.starter'),
      price: '$2.99',
      period: t('pricing.perMonth'),
      description: 'Perfect for personal websites and blogs',
      features: [
        { text: '1 Website', included: true },
        { text: '10 GB NVMe SSD', included: true },
        { text: 'Free SSL Certificate', included: true },
        { text: 'Weekly Backups', included: true },
        { text: '1 Email Account', included: true },
        { text: 'DDoS Protection', included: false },
        { text: 'Priority Support', included: false },
      ],
      href: '/hosting/web',
    },
    {
      name: t('pricing.professional'),
      price: '$7.99',
      period: t('pricing.perMonth'),
      description: 'Ideal for growing businesses',
      features: [
        { text: 'Unlimited Websites', included: true },
        { text: '50 GB NVMe SSD', included: true },
        { text: 'Free SSL Certificate', included: true },
        { text: 'Daily Backups', included: true },
        { text: 'Unlimited Email', included: true },
        { text: 'DDoS Protection', included: true },
        { text: 'Priority Support', included: false },
      ],
      featured: true,
      href: '/hosting/premium',
    },
    {
      name: t('pricing.business'),
      price: '$14.99',
      period: t('pricing.perMonth'),
      description: 'For high-traffic enterprise sites',
      features: [
        { text: 'Unlimited Websites', included: true },
        { text: '100 GB NVMe SSD', included: true },
        { text: 'Free SSL Certificate', included: true },
        { text: 'Real-time Backups', included: true },
        { text: 'Unlimited Email', included: true },
        { text: 'Advanced DDoS Protection', included: true },
        { text: 'Priority 24/7 Support', included: true },
      ],
      href: '/hosting/premium',
    },
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('pricing.subtitle')}
          </p>
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

                <div className="flex items-baseline gap-1 mb-6">
                  <span className={cn(
                    'text-4xl lg:text-5xl font-bold font-display',
                    plan.featured ? 'text-primary-foreground' : 'text-foreground'
                  )}>
                    {plan.price}
                  </span>
                  <span className={cn(
                    'text-sm',
                    plan.featured ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {plan.period}
                  </span>
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
                  asChild
                >
                  <Link to={plan.href}>
                    {t('pricing.getStarted')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
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
