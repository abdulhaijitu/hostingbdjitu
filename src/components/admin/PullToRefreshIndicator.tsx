import React from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  threshold = 80,
}) => {
  const progress = Math.min(pullDistance / threshold, 1);
  const shouldShow = pullDistance > 10 || isRefreshing;
  
  if (!shouldShow) return null;

  return (
    <div 
      className={cn(
        "absolute left-1/2 -translate-x-1/2 z-50",
        "flex items-center justify-center",
        "w-10 h-10 rounded-full",
        "bg-background border border-border shadow-lg",
        "transition-all duration-200"
      )}
      style={{
        top: Math.max(pullDistance - 40, 8),
        opacity: Math.min(progress * 2, 1),
        transform: `translateX(-50%) scale(${0.5 + progress * 0.5})`,
      }}
    >
      {isRefreshing ? (
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
      ) : (
        <RefreshCw 
          className={cn(
            "h-5 w-5 transition-all duration-200",
            progress >= 1 ? "text-primary" : "text-muted-foreground"
          )}
          style={{
            transform: `rotate(${progress * 180}deg)`,
          }}
        />
      )}
    </div>
  );
};

export default PullToRefreshIndicator;
