import React, { useState } from 'react';
import { Check, ArrowUpRight, Zap, Crown, Rocket, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHostingPlans } from '@/hooks/useHostingPlans';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PlanUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlanName: string;
  onUpgrade: (planId: string, planName: string) => void;
}

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  open,
  onOpenChange,
  currentPlanName,
  onUpgrade,
}) => {
  const { language } = useLanguage();
  const { data: plans, isLoading } = useHostingPlans();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Filter web hosting plans and sort by price
  const hostingPlans = plans
    ?.filter(p => p.category === 'web' && p.is_active)
    .sort((a, b) => a.monthly_price - b.monthly_price) || [];

  const planIcons: Record<string, React.ElementType> = {
    'Starter': Zap,
    'Standard': Crown,
    'Premium': Rocket,
    'Business': Rocket,
  };

  const getFeaturesList = (plan: any): string[] => {
    const features = plan.features as string[] | null;
    if (Array.isArray(features)) {
      return features.slice(0, 6);
    }
    return [
      `${plan.storage || 'Unlimited'} Storage`,
      `${plan.bandwidth || 'Unlimited'} Bandwidth`,
      `${plan.websites || '1'} Website(s)`,
      `${plan.email_accounts || 'Unlimited'} Email Accounts`,
      `${plan.databases || 'Unlimited'} Databases`,
      'Free SSL Certificate',
    ];
  };

  const isCurrentPlan = (planName: string) => {
    return planName.toLowerCase() === currentPlanName.toLowerCase();
  };

  const isUpgrade = (planPrice: number, currentPlanPrice: number) => {
    return planPrice > currentPlanPrice;
  };

  // Find current plan price for comparison
  const currentPlan = hostingPlans.find(p => 
    p.name.toLowerCase() === currentPlanName.toLowerCase()
  );
  const currentPlanPrice = currentPlan?.yearly_price || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">
            {language === 'bn' ? 'প্ল্যান আপগ্রেড করুন' : 'Upgrade Your Plan'}
          </DialogTitle>
          <DialogDescription>
            {language === 'bn' 
              ? 'আপনার বর্তমান প্ল্যান থেকে আরও ভালো প্ল্যানে আপগ্রেড করুন'
              : 'Choose a better plan to unlock more features and resources'}
          </DialogDescription>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 my-6">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors',
              billingCycle === 'monthly' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {language === 'bn' ? 'মাসিক' : 'Monthly'}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors flex items-center gap-2',
              billingCycle === 'yearly' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            )}
          >
            {language === 'bn' ? 'বাৎসরিক' : 'Yearly'}
            <Badge variant="secondary" className="bg-success/10 text-success">
              {language === 'bn' ? '২০% ছাড়' : '20% OFF'}
            </Badge>
          </button>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {hostingPlans.map((plan) => {
              const Icon = planIcons[plan.name] || Zap;
              const isCurrent = isCurrentPlan(plan.name);
              const canUpgrade = isUpgrade(plan.yearly_price, currentPlanPrice);
              const price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price;
              const isSelected = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-xl border-2 p-6 transition-all cursor-pointer',
                    isCurrent && 'border-muted bg-muted/30 cursor-not-allowed',
                    !isCurrent && isSelected && 'border-primary ring-2 ring-primary/20',
                    !isCurrent && !isSelected && 'border-border hover:border-primary/50',
                    plan.is_featured && !isCurrent && 'border-primary'
                  )}
                  onClick={() => !isCurrent && setSelectedPlan(plan.id)}
                >
                  {/* Current Plan Badge */}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-muted-foreground">
                        {language === 'bn' ? 'বর্তমান প্ল্যান' : 'Current Plan'}
                      </Badge>
                    </div>
                  )}

                  {/* Popular Badge */}
                  {plan.is_featured && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">
                        {language === 'bn' ? 'জনপ্রিয়' : 'Popular'}
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3',
                      isCurrent ? 'bg-muted' : 'bg-primary/10'
                    )}>
                      <Icon className={cn(
                        'h-6 w-6',
                        isCurrent ? 'text-muted-foreground' : 'text-primary'
                      )} />
                    </div>
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? plan.description_bn : plan.description}
                    </p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">৳{price}</span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'yearly' 
                          ? (language === 'bn' ? 'বছর' : 'year')
                          : (language === 'bn' ? 'মাস' : 'month')}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ৳{Math.round(price / 12)}/{language === 'bn' ? 'মাস' : 'mo'}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {getFeaturesList(plan).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className={cn(
                          'h-4 w-4 flex-shrink-0',
                          isCurrent ? 'text-muted-foreground' : 'text-success'
                        )} />
                        <span className={isCurrent ? 'text-muted-foreground' : ''}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {!isCurrent && canUpgrade && (
                    <Button 
                      className="w-full gap-2"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.id);
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-4 w-4" />
                          {language === 'bn' ? 'নির্বাচিত' : 'Selected'}
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="h-4 w-4" />
                          {language === 'bn' ? 'আপগ্রেড করুন' : 'Upgrade'}
                        </>
                      )}
                    </Button>
                  )}

                  {!isCurrent && !canUpgrade && (
                    <Button className="w-full" variant="ghost" disabled>
                      {language === 'bn' ? 'ডাউনগ্রেড' : 'Downgrade'}
                    </Button>
                  )}

                  {isCurrent && (
                    <Button className="w-full" variant="ghost" disabled>
                      {language === 'bn' ? 'সক্রিয়' : 'Active'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Confirm Upgrade Button */}
        {selectedPlan && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium">
                {language === 'bn' ? 'আপগ্রেড নিশ্চিত করুন' : 'Confirm your upgrade'}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' 
                  ? 'আপনার বর্তমান প্ল্যান প্রো-রেট করে চার্জ করা হবে'
                  : 'You will be charged a prorated amount for the upgrade'}
              </p>
            </div>
            <Button 
              variant="hero"
              className="gap-2"
              onClick={() => {
                const plan = hostingPlans.find(p => p.id === selectedPlan);
                if (plan) {
                  onUpgrade(plan.id, plan.name);
                }
              }}
            >
              <Rocket className="h-4 w-4" />
              {language === 'bn' ? 'এখনই আপগ্রেড করুন' : 'Upgrade Now'}
            </Button>
          </div>
        )}

        {/* Feature Comparison Table */}
        <div className="mt-8">
          <h4 className="font-semibold mb-4">
            {language === 'bn' ? 'ফিচার তুলনা' : 'Feature Comparison'}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    {language === 'bn' ? 'ফিচার' : 'Feature'}
                  </th>
                  {hostingPlans.map(plan => (
                    <th key={plan.id} className="text-center py-3 px-4">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Storage</td>
                  {hostingPlans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4 font-medium">
                      {plan.storage || 'Unlimited'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Bandwidth</td>
                  {hostingPlans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4 font-medium">
                      {plan.bandwidth || 'Unlimited'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Websites</td>
                  {hostingPlans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4 font-medium">
                      {plan.websites || '1'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Email Accounts</td>
                  {hostingPlans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4 font-medium">
                      {plan.email_accounts || 'Unlimited'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Databases</td>
                  {hostingPlans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4 font-medium">
                      {plan.databases || 'Unlimited'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">Free SSL</td>
                  {hostingPlans.map(plan => (
                    <td key={plan.id} className="text-center py-3 px-4">
                      <Check className="h-4 w-4 text-success mx-auto" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUpgradeModal;
