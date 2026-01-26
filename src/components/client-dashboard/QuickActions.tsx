import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}

interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const QuickActions: React.FC<QuickActionsProps> = memo(({
  title = 'Quick Actions',
  actions,
  className,
  columns = 2,
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="text-sm sm:text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className={cn("grid gap-2 sm:gap-3", gridCols[columns])}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              className={cn(
                "h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4",
                "hover:bg-primary/5 hover:border-primary/30",
                "active:scale-[0.97] transition-all duration-150",
                "touch-target"
              )}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-[10px] sm:text-xs font-medium leading-tight text-center">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

QuickActions.displayName = 'QuickActions';

export default QuickActions;
