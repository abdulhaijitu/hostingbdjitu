import React from 'react';
import { ArrowRight, Award, HardDrive, Globe, Zap, Mail, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHostingPlans, HostingPlan } from '@/hooks/useHostingPlans';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getHostingStoreUrl, redirectToWHMCS } from '@/lib/whmcsConfig';

interface PricingCardsProps {
  category?: string;
  isYearly: boolean;
}

const PricingCards: React.FC<PricingCardsProps> = ({ category = 'web', isYearly }) => {
  const { language } = useLanguage();
  const { data: plans, isLoading } = useHostingPlans(true);

  const filteredPlans = plans?.filter(p => p.category === category) || [];

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[500px] w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (filteredPlans.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        {language === 'bn' ? 'কোন প্ল্যান পাওয়া যায়নি' : 'No plans available'}
      </p>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {filteredPlans.map((plan) => (
        <PlanCard 
          key={plan.id} 
          plan={plan} 
          isYearly={isYearly} 
          language={language}
          category={category}
        />
      ))}
    </div>
  );
};

interface PlanCardProps {
  plan: HostingPlan;
  isYearly: boolean;
  language: string;
  category: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isYearly, language, category }) => {
  const monthlyEquivalent = isYearly ? Math.round(plan.yearly_price / 12) : plan.monthly_price;

  const handleOrderClick = () => {
    const whmcsUrl = getHostingStoreUrl(category);
    redirectToWHMCS(whmcsUrl);
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl transition-all duration-300',
        plan.is_featured ? 'pricing-card-featured scale-105 z-10' : 'pricing-card'
      )}
    >
      {plan.is_featured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
            <Award className="h-4 w-4" />
            {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
          </span>
        </div>
      )}

      <div className="p-6 lg:p-8">
        <h3 className={cn(
          'text-xl font-semibold font-display mb-2',
          plan.is_featured ? 'text-primary-foreground' : 'text-foreground'
        )}>
          {language === 'bn' && plan.name_bn ? plan.name_bn : plan.name}
        </h3>
        <p className={cn(
          'text-sm mb-4',
          plan.is_featured ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {language === 'bn' && plan.description_bn ? plan.description_bn : plan.description}
        </p>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-4xl lg:text-5xl font-bold font-display transition-all',
              plan.is_featured ? 'text-primary-foreground' : 'text-foreground'
            )}>
              ৳{monthlyEquivalent}
            </span>
            <span className={plan.is_featured ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
              /{language === 'bn' ? 'মাস' : 'mo'}
            </span>
          </div>
          {isYearly && (
            <p className="text-sm mt-1 text-accent">
              {language === 'bn' ? 'বার্ষিক বিল' : 'Billed annually'}: ৳{plan.yearly_price}
            </p>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {plan.storage && (
            <li className={cn('flex items-center gap-2', plan.is_featured ? 'text-primary-foreground' : '')}>
              <HardDrive className="h-4 w-4 text-accent" />
              {plan.storage}
            </li>
          )}
          {plan.websites && (
            <li className={cn('flex items-center gap-2', plan.is_featured ? 'text-primary-foreground' : '')}>
              <Globe className="h-4 w-4 text-accent" />
              {plan.websites} {language === 'bn' ? 'ওয়েবসাইট' : 'Website(s)'}
            </li>
          )}
          {plan.bandwidth && (
            <li className={cn('flex items-center gap-2', plan.is_featured ? 'text-primary-foreground' : '')}>
              <Zap className="h-4 w-4 text-accent" />
              {plan.bandwidth} {language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
            </li>
          )}
          {plan.email_accounts && (
            <li className={cn('flex items-center gap-2', plan.is_featured ? 'text-primary-foreground' : '')}>
              <Mail className="h-4 w-4 text-accent" />
              {plan.email_accounts} {language === 'bn' ? 'ইমেইল' : 'Email'}
            </li>
          )}
          <li className={cn('flex items-center gap-2', plan.is_featured ? 'text-primary-foreground' : '')}>
            <Shield className="h-4 w-4 text-accent" />
            {language === 'bn' ? 'ফ্রি SSL' : 'Free SSL'}
          </li>
          <li className={cn('flex items-center gap-2', plan.is_featured ? 'text-primary-foreground' : '')}>
            <Clock className="h-4 w-4 text-accent" />
            99.9% {language === 'bn' ? 'আপটাইম' : 'Uptime'}
          </li>
        </ul>

        <Button
          variant={plan.is_featured ? 'accent' : 'hero'}
          size="lg"
          className="w-full"
          onClick={handleOrderClick}
        >
          {language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PricingCards;
