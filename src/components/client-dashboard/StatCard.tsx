import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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

const StatCard: React.FC<StatCardProps> = ({
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

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <p className="text-2xl font-bold font-display">
                {value}
              </p>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-xl",
            variantStyles[variant]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        
        {trend && (
          <div className={cn(
            "mt-3 text-xs font-medium",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
