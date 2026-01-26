import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
  className?: string;
}

const StatCardSkeleton = () => (
  <Card className="relative overflow-hidden">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-muted rounded-xl animate-pulse shrink-0" />
      </div>
    </CardContent>
  </Card>
);

const StatCard: React.FC<StatCardProps> = memo(({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = 'default',
  isLoading = false,
  className,
}) => {
  const variantStyles = {
    default: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-destructive bg-destructive/10',
  };

  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200",
      "hover:shadow-md hover:-translate-y-0.5",
      "active:translate-y-0 active:scale-[0.99]",
      className
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold font-display truncate">
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "p-2.5 sm:p-3 rounded-xl shrink-0",
            variantStyles[variant]
          )}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
        
        {trend && (
          <div className={cn(
            "mt-3 text-xs font-medium flex items-center gap-1",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            <span>{trend.isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
