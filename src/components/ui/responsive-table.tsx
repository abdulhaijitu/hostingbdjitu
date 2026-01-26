import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive table wrapper that converts to card layout on mobile
 * Use with regular Table component for desktop, Card layout for mobile
 */
export const ResponsiveTableWrapper: React.FC<ResponsiveTableProps> = ({ 
  children, 
  className 
}) => (
  <div className={cn(
    "w-full overflow-x-auto rounded-xl border border-border bg-card",
    // Hide scrollbar on mobile but allow scroll
    "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
    className
  )}>
    {children}
  </div>
);

/**
 * Mobile-first card layout for table rows
 */
export const ResponsiveTableCard: React.FC<ResponsiveTableCardProps> = ({ 
  children, 
  className 
}) => (
  <div className={cn(
    "p-4 space-y-3 border-b border-border last:border-b-0",
    "hover:bg-muted/50 transition-colors duration-150",
    className
  )}>
    {children}
  </div>
);

interface TableCellMobileProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile table cell with label-value pair
 */
export const TableCellMobile: React.FC<TableCellMobileProps> = ({ 
  label, 
  children, 
  className 
}) => (
  <div className={cn("flex items-center justify-between gap-4", className)}>
    <span className="text-sm text-muted-foreground font-medium shrink-0">
      {label}
    </span>
    <span className="text-sm font-medium text-right truncate">
      {children}
    </span>
  </div>
);

interface StickyTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Sticky table header for desktop
 */
export const StickyTableHeader: React.FC<StickyTableHeaderProps> = ({ 
  children, 
  className 
}) => (
  <thead className={cn(
    "bg-muted/50 sticky top-0 z-10 backdrop-blur-sm",
    "[&_tr]:border-b [&_th]:px-4 [&_th]:py-3 [&_th]:text-left",
    "[&_th]:text-xs [&_th]:font-semibold [&_th]:text-muted-foreground",
    "[&_th]:uppercase [&_th]:tracking-wider",
    className
  )}>
    {children}
  </thead>
);

/**
 * Table body with consistent styling
 */
export const StyledTableBody: React.FC<ResponsiveTableProps> = ({ 
  children, 
  className 
}) => (
  <tbody className={cn(
    "[&_tr]:border-b [&_tr:last-child]:border-0",
    "[&_tr]:transition-colors [&_tr:hover]:bg-muted/30",
    "[&_td]:px-4 [&_td]:py-3 [&_td]:text-sm",
    className
  )}>
    {children}
  </tbody>
);

/**
 * Action buttons container for mobile bottom sheet style
 */
export const MobileActionSheet: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn(
    // Mobile: fixed bottom sheet
    "fixed bottom-0 left-0 right-0 z-50 md:hidden",
    "bg-card/95 backdrop-blur-xl border-t border-border",
    "p-4 shadow-lg shadow-black/10",
    "animate-slide-in-right",
    className
  )}>
    <div className="flex gap-3 max-w-md mx-auto">
      {children}
    </div>
  </div>
);

/**
 * Wrapper to hide content on mobile (md and below)
 */
export const DesktopOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="hidden md:block">{children}</div>
);

/**
 * Wrapper to show content only on mobile (below md)
 */
export const MobileOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="md:hidden">{children}</div>
);

/**
 * Empty table state with consistent styling
 */
export const TableEmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="p-4 rounded-2xl bg-muted/50 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    {description && (
      <p className="text-muted-foreground text-sm max-w-sm mb-4">{description}</p>
    )}
    {action}
  </div>
);
