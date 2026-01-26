import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileAdminCard from './MobileAdminCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface Column<T> {
  key: string;
  label: string;
  labelBn?: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  mobileLabel?: string;
  mobileLabelBn?: string;
  hideOnMobile?: boolean;
  highlight?: boolean;
}

interface Action<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'destructive';
}

interface ResponsiveAdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (item: T) => void;
  getTitle?: (item: T) => string;
  getSubtitle?: (item: T) => string;
  getBadge?: (item: T) => { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' } | undefined;
  language?: 'en' | 'bn';
  mobileExpandable?: boolean;
}

function ResponsiveAdminTable<T>({
  data,
  columns,
  actions,
  keyExtractor,
  isLoading,
  emptyState,
  onRowClick,
  getTitle,
  getSubtitle,
  getBadge,
  language = 'en',
  mobileExpandable = true,
}: ResponsiveAdminTableProps<T>) {
  const isMobile = useIsMobile();

  // Loading state
  if (isLoading) {
    if (isMobile) {
      return (
        <div className="space-y-3 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 px-4">
        {emptyState || (
          <p className="text-muted-foreground text-sm">
            {language === 'bn' ? 'কোন ডেটা নেই' : 'No data available'}
          </p>
        )}
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-3 p-4">
        {data.map((item) => {
          const mobileColumns = columns.filter(col => !col.hideOnMobile);
          const fields = mobileColumns.map(col => ({
            label: language === 'bn' && col.mobileLabelBn ? col.mobileLabelBn : (col.mobileLabel || col.label),
            value: col.render ? col.render(item) : (item as any)[col.key],
            highlight: col.highlight,
          }));

          const cardActions = actions?.map(action => ({
            label: action.label,
            icon: action.icon,
            onClick: () => action.onClick(item),
            variant: action.variant,
          }));

          return (
            <MobileAdminCard
              key={keyExtractor(item)}
              title={getTitle ? getTitle(item) : String((item as any).id)}
              subtitle={getSubtitle ? getSubtitle(item) : undefined}
              badge={getBadge ? getBadge(item) : undefined}
              fields={fields}
              actions={cardActions}
              expandable={mobileExpandable}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            />
          );
        })}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {language === 'bn' && col.labelBn ? col.labelBn : col.label}
              </TableHead>
            ))}
            {actions && actions.length > 0 && (
              <TableHead className="w-[100px]">
                {language === 'bn' ? 'অ্যাকশন' : 'Actions'}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow 
              key={keyExtractor(item)}
              className={cn(
                onRowClick && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <TableCell key={col.key} className={col.className}>
                  {col.render ? col.render(item) : (item as any)[col.key]}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {actions.slice(0, 2).map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onClick(item)}
                        className={cn(
                          "p-1.5 rounded-md transition-colors",
                          action.variant === 'destructive' 
                            ? "text-destructive hover:bg-destructive/10" 
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ResponsiveAdminTable;
