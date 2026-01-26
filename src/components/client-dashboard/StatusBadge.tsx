import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'active' | 'suspended' | 'pending' | 'expired' | 'cancelled' | 'paid' | 'unpaid' | 'failed' | 'completed' | 'open' | 'closed' | 'in-progress';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { 
    label: 'Active', 
    className: 'bg-success/10 text-success border-success/20' 
  },
  completed: { 
    label: 'Completed', 
    className: 'bg-success/10 text-success border-success/20' 
  },
  paid: { 
    label: 'Paid', 
    className: 'bg-success/10 text-success border-success/20' 
  },
  pending: { 
    label: 'Pending', 
    className: 'bg-warning/10 text-warning border-warning/20' 
  },
  'in-progress': { 
    label: 'In Progress', 
    className: 'bg-primary/10 text-primary border-primary/20' 
  },
  open: { 
    label: 'Open', 
    className: 'bg-primary/10 text-primary border-primary/20' 
  },
  suspended: { 
    label: 'Suspended', 
    className: 'bg-destructive/10 text-destructive border-destructive/20' 
  },
  expired: { 
    label: 'Expired', 
    className: 'bg-destructive/10 text-destructive border-destructive/20' 
  },
  cancelled: { 
    label: 'Cancelled', 
    className: 'bg-muted text-muted-foreground border-muted' 
  },
  closed: { 
    label: 'Closed', 
    className: 'bg-muted text-muted-foreground border-muted' 
  },
  unpaid: { 
    label: 'Unpaid', 
    className: 'bg-destructive/10 text-destructive border-destructive/20' 
  },
  failed: { 
    label: 'Failed', 
    className: 'bg-destructive/10 text-destructive border-destructive/20' 
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status.toLowerCase()] || {
    label: status,
    className: 'bg-muted text-muted-foreground border-muted',
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium text-xs",
        config.className,
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === 'active' || status === 'completed' || status === 'paid' ? 'bg-success' :
        status === 'pending' || status === 'in-progress' || status === 'open' ? 'bg-warning animate-pulse' :
        'bg-current'
      )} />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
