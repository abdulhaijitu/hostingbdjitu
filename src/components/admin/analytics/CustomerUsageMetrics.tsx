import React from 'react';
import { 
  UserPlus, UserCheck, UserX, TrendingDown, 
  Server, Clock, Globe, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CustomerMetrics, ExpiringServices } from '@/hooks/useAnalyticsDashboard';

interface CustomerUsageMetricsProps {
  customerMetrics: CustomerMetrics | null;
  expiringServices: ExpiringServices | null;
  hostingByPlan: { name: string; value: number }[];
  isLoading: boolean;
  language: 'en' | 'bn';
  isMobile?: boolean;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
}> = ({ title, value, subtitle, icon, variant = 'default', isLoading }) => {
  const variantStyles = {
    default: 'text-foreground',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className={cn(
        'p-2 rounded-lg bg-background',
        variantStyles[variant]
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        {isLoading ? (
          <Skeleton className="h-5 w-12 mt-0.5" />
        ) : (
          <>
            <p className={cn('text-lg font-bold', variantStyles[variant])}>{value}</p>
            {subtitle && (
              <p className="text-[10px] text-muted-foreground">{subtitle}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const CustomerUsageMetrics: React.FC<CustomerUsageMetricsProps> = ({
  customerMetrics,
  expiringServices,
  hostingByPlan,
  isLoading,
  language,
  isMobile = false,
}) => {
  const totalCustomers = (customerMetrics?.activeCustomers || 0) + (customerMetrics?.inactiveCustomers || 0);
  const activePercentage = totalCustomers > 0 
    ? ((customerMetrics?.activeCustomers || 0) / totalCustomers) * 100 
    : 0;

  return (
    <div className={cn('grid gap-4', isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3')}>
      {/* Customer Metrics */}
      <Card>
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'গ্রাহক মেট্রিক্স' : 'Customer Metrics'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'সাইনআপ এবং সক্রিয়তা' : 'Signups and activity'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <MetricCard
              title={language === 'bn' ? 'আজকে সাইনআপ' : 'Today Signups'}
              value={customerMetrics?.newSignupsToday || 0}
              icon={<UserPlus className="h-4 w-4" />}
              variant="success"
              isLoading={isLoading}
            />
            <MetricCard
              title={language === 'bn' ? 'মাসিক সাইনআপ' : 'Monthly Signups'}
              value={customerMetrics?.newSignupsMonth || 0}
              icon={<UserPlus className="h-4 w-4" />}
              variant="success"
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'bn' ? 'সক্রিয় বনাম নিষ্ক্রিয়' : 'Active vs Inactive'}
              </span>
              <span className="font-medium">
                {customerMetrics?.activeCustomers || 0} / {customerMetrics?.inactiveCustomers || 0}
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <Progress value={activePercentage} className="h-2" />
            )}
          </div>

          <MetricCard
            title={language === 'bn' ? 'চার্ন রেট' : 'Churn Rate'}
            value={`${(customerMetrics?.churnRate || 0).toFixed(1)}%`}
            subtitle={language === 'bn' ? 'গত ৩০ দিনে' : 'Last 30 days'}
            icon={<TrendingDown className="h-4 w-4" />}
            variant={(customerMetrics?.churnRate || 0) > 10 ? 'danger' : 'warning'}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Hosting by Plan */}
      <Card>
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'প্ল্যান অনুযায়ী হোস্টিং' : 'Hosting by Plan'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'সক্রিয় অ্যাকাউন্ট বিতরণ' : 'Active account distribution'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : hostingByPlan.length > 0 ? (
            <div className="space-y-3">
              {hostingByPlan.map((plan, index) => {
                const total = hostingByPlan.reduce((sum, p) => sum + p.value, 0);
                const percentage = total > 0 ? (plan.value / total) * 100 : 0;

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate">{plan.name}</span>
                      <Badge variant="secondary">{plan.value}</Badge>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
              {language === 'bn' ? 'কোন ডেটা নেই' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expiring Services */}
      <Card>
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'মেয়াদোত্তীর্ণ সেবা' : 'Expiring Services'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'আসন্ন মেয়াদ শেষ' : 'Upcoming expirations'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hosting Expiring */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Server className="h-4 w-4 text-primary" />
              {language === 'bn' ? 'হোস্টিং' : 'Hosting'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 7, value: expiringServices?.hosting7Days || 0 },
                { days: 15, value: expiringServices?.hosting15Days || 0 },
                { days: 30, value: expiringServices?.hosting30Days || 0 },
              ].map((item) => (
                <div 
                  key={item.days} 
                  className={cn(
                    'text-center p-2 rounded-lg',
                    item.value > 0 ? 'bg-warning/10 border border-warning/20' : 'bg-muted/50'
                  )}
                >
                  {isLoading ? (
                    <Skeleton className="h-5 w-6 mx-auto" />
                  ) : (
                    <p className={cn(
                      'text-lg font-bold',
                      item.value > 0 ? 'text-warning' : 'text-muted-foreground'
                    )}>
                      {item.value}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">{item.days}d</p>
                </div>
              ))}
            </div>
          </div>

          {/* Domains Expiring */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-4 w-4 text-accent" />
              {language === 'bn' ? 'ডোমেইন' : 'Domains'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 7, value: expiringServices?.domains7Days || 0 },
                { days: 15, value: expiringServices?.domains15Days || 0 },
                { days: 30, value: expiringServices?.domains30Days || 0 },
              ].map((item) => (
                <div 
                  key={item.days} 
                  className={cn(
                    'text-center p-2 rounded-lg',
                    item.value > 0 ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/50'
                  )}
                >
                  {isLoading ? (
                    <Skeleton className="h-5 w-6 mx-auto" />
                  ) : (
                    <p className={cn(
                      'text-lg font-bold',
                      item.value > 0 ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      {item.value}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">{item.days}d</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerUsageMetrics;
