import React from 'react';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CardField {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}

interface CardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface MobileAdminCardProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  };
  fields: CardField[];
  actions?: CardAction[];
  expandable?: boolean;
  defaultExpanded?: boolean;
  onClick?: () => void;
  className?: string;
}

const getBadgeClasses = (variant: string) => {
  switch (variant) {
    case 'success':
      return 'bg-success/10 text-success border-success/20';
    case 'warning':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'destructive':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return '';
  }
};

const MobileAdminCard: React.FC<MobileAdminCardProps> = ({
  title,
  subtitle,
  badge,
  fields,
  actions,
  expandable = false,
  defaultExpanded = false,
  onClick,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const mainFields = fields.slice(0, 2);
  const expandableFields = fields.slice(2);
  const hasExpandableContent = expandable && expandableFields.length > 0;

  const cardContent = (
    <div className={cn(
      "bg-card border border-border rounded-xl overflow-hidden",
      "transition-all duration-200",
      "active:scale-[0.99]",
      onClick && "cursor-pointer hover:border-primary/30",
      className
    )}>
      {/* Header */}
      <div 
        className="p-4 space-y-3"
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {badge && (
              <Badge 
                variant={badge.variant as any}
                className={cn("text-[10px] px-2", getBadgeClasses(badge.variant))}
              >
                {badge.text}
              </Badge>
            )}
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {actions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                      className={cn(
                        action.variant === 'destructive' && 'text-destructive focus:text-destructive'
                      )}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Main Fields */}
        <div className="grid grid-cols-2 gap-3">
          {mainFields.map((field, index) => (
            <div key={index} className="space-y-0.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {field.label}
              </p>
              <p className={cn(
                "text-sm font-medium truncate",
                field.highlight && "text-primary"
              )}>
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Content */}
      {hasExpandableContent && (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <button className="w-full px-4 py-2 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t border-border">
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show More ({expandableFields.length})
                </>
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-2 space-y-2 border-t border-border bg-muted/30">
              {expandableFields.map((field, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{field.label}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    field.highlight && "text-primary"
                  )}>
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );

  return cardContent;
};

export default MobileAdminCard;
