import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, Users, Server, Globe, FileText, 
  AlertTriangle, TrendingUp, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { KPIData } from '@/hooks/useAnalyticsDashboard';

interface AnalyticsKPICardsProps {
  data: KPIData | null;
  isLoading: boolean;
  language: 'en' | 'bn';
  isMobile?: boolean;
}

const KPICard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  href?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
  isLoading?: boolean;
  subtitle?: string;
  isMobile?: boolean;
}> = ({ title, value, icon, href, variant = 'default', isLoading, subtitle, isMobile }) => {
  const variantStyles = {
    default: 'bg-card border-border',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
    danger: 'bg-destructive/5 border-destructive/20',
    primary: 'bg-primary/5 border-primary/20',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
    primary: 'text-primary',
  };

  const content = (
    <Card className={cn(
      variantStyles[variant],
      'transition-all duration-200 hover:shadow-md',
      href && 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]'
    )}>
      <CardContent className={cn(isMobile ? 'p-3' : 'p-4')}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={cn(
              'font-medium text-muted-foreground truncate',
              isMobile ? 'text-[10px]' : 'text-xs'
            )}>
              {title}
            </p>
            {isLoading ? (
              <Skeleton className={cn(isMobile ? 'h-6 w-16 mt-1' : 'h-8 w-20 mt-1')} />
            ) : (
              <>
                <p className={cn(
                  'font-bold truncate',
                  isMobile ? 'text-lg mt-0.5' : 'text-2xl mt-1'
                )}>
                  {value}
                </p>
                {subtitle && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>
          <div className={cn(
            'rounded-lg shrink-0',
            isMobile ? 'p-1.5' : 'p-2',
            `bg-${variant === 'default' ? 'muted' : variant}/10`
          )}>
            <div className={cn(iconStyles[variant], isMobile ? '[&>svg]:h-3.5 [&>svg]:w-3.5' : '[&>svg]:h-4 [&>svg]:w-4')}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link to={href}>{content}</Link> : content;
};

const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({
  data,
  isLoading,
  language,
  isMobile = false,
}) => {
  const kpiCards = [
    {
      title: language === 'bn' ? 'আজকের রেভিনিউ' : "Today's Revenue",
      value: `৳${(data?.todayRevenue || 0).toLocaleString()}`,
      icon: <DollarSign />,
      variant: 'primary' as const,
      href: '/admin/payments',
    },
    {
      title: language === 'bn' ? 'মাসিক রেভিনিউ' : 'Monthly Revenue',
      value: `৳${(data?.monthRevenue || 0).toLocaleString()}`,
      icon: <Calendar />,
      variant: 'success' as const,
      href: '/admin/analytics',
    },
    {
      title: language === 'bn' ? 'সক্রিয় গ্রাহক' : 'Active Customers',
      value: data?.activeCustomers || 0,
      icon: <Users />,
      variant: 'default' as const,
      href: '/admin/users',
    },
    {
      title: language === 'bn' ? 'সক্রিয় হোস্টিং' : 'Active Hosting',
      value: data?.activeHostingAccounts || 0,
      icon: <Server />,
      variant: 'default' as const,
      href: '/admin/hosting-accounts',
    },
    {
      title: language === 'bn' ? 'সক্রিয় ডোমেইন' : 'Active Domains',
      value: data?.activeDomains || 0,
      icon: <Globe />,
      variant: 'default' as const,
      href: '/admin/orders',
    },
    {
      title: language === 'bn' ? 'পেন্ডিং ইনভয়েস' : 'Pending Invoices',
      value: data?.pendingInvoices || 0,
      subtitle: `৳${(data?.pendingInvoicesAmount || 0).toLocaleString()}`,
      icon: <FileText />,
      variant: 'warning' as const,
      href: '/admin/invoices',
    },
    {
      title: language === 'bn' ? 'ব্যর্থ পেমেন্ট' : 'Failed Payments',
      value: data?.failedPayments || 0,
      subtitle: `৳${(data?.failedPaymentsAmount || 0).toLocaleString()}`,
      icon: <AlertTriangle />,
      variant: 'danger' as const,
      href: '/admin/payments',
    },
  ];

  // On mobile, show only top 4 most important KPIs
  const displayedCards = isMobile ? kpiCards.slice(0, 4) : kpiCards;

  return (
    <div className={cn(
      'grid gap-3',
      isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'
    )}>
      {displayedCards.map((card, index) => (
        <KPICard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          variant={card.variant}
          href={card.href}
          isLoading={isLoading}
          subtitle={card.subtitle}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};

export default AnalyticsKPICards;
