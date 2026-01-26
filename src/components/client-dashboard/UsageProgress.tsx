import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UsageProgressProps {
  label: string;
  used: number;
  total: number;
  unit?: string;
  className?: string;
}

const UsageProgress: React.FC<UsageProgressProps> = ({
  label,
  used,
  total,
  unit = 'GB',
  className,
}) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}${unit === 'GB' ? 'TB' : 'K'}`;
    }
    return `${value}${unit}`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {formatValue(used)} / {formatValue(total)}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-2"
        />
        <div 
          className={cn("absolute top-0 left-0 h-full rounded-full transition-all", getProgressColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">
        {percentage.toFixed(1)}% used
      </p>
    </div>
  );
};

export default UsageProgress;
