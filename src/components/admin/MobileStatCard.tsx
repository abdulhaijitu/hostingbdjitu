import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileStatCardProps {
  title: string;
  titleBn?: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  language?: 'en' | 'bn';
  onClick?: () => void;
  className?: string;
}

const MobileStatCard: React.FC<MobileStatCardProps> = ({
  title,
  titleBn,
  value,
  icon,
  trend,
  isLoading,
  variant = 'default',
  language = 'en',
  onClick,
  className,
}) => {
  const isMobile = useIsMobile();
  const displayTitle = language === 'bn' && titleBn ? titleBn : title;

  const variantStyles = {
    default: 'bg-card border-border',
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
    success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
    danger: 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20',
  };

  const iconStyles = {
    default: 'text-muted-foreground bg-muted',
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-destructive bg-destructive/10',
  };

  if (isLoading) {
    return (
      <div className={cn(
        "border rounded-xl p-4",
        variantStyles[variant],
        className
      )}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "border rounded-xl transition-all duration-200",
        variantStyles[variant],
        onClick && "cursor-pointer active:scale-[0.98] hover:shadow-md",
        isMobile ? "p-3" : "p-4",
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center gap-3",
        isMobile ? "flex-row" : "flex-col lg:flex-row lg:justify-between"
      )}>
        {/* Icon */}
        <div className={cn(
          "rounded-xl flex items-center justify-center shrink-0",
          iconStyles[variant],
          isMobile ? "h-10 w-10 p-2" : "h-12 w-12 p-3"
        )}>
          {icon}
        </div>

        {/* Content */}
        <div className={cn(
          "flex-1 min-w-0",
          !isMobile && "lg:text-right"
        )}>
          <p className={cn(
            "text-muted-foreground truncate",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {displayTitle}
          </p>
          <div className="flex items-baseline gap-2">
            <p className={cn(
              "font-bold",
              isMobile ? "text-xl" : "text-2xl lg:text-3xl"
            )}>
              {value}
            </p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileStatCard;
