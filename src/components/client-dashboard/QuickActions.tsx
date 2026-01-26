import React from 'react';
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

const QuickActions: React.FC<QuickActionsProps> = ({
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-2", gridCols[columns])}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              className="h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={action.onClick}
              disabled={action.disabled}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
