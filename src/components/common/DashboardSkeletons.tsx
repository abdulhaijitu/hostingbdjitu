import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonPulseProps {
  className?: string;
  style?: React.CSSProperties;
}

// Base skeleton with proper animation
const SkeletonPulse: React.FC<SkeletonPulseProps> = ({ className, style }) => (
  <div 
    className={cn(
      "bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] animate-shimmer rounded",
      className
    )}
    style={style}
  />
);

// Stat Card Skeleton
export const StatCardSkeleton: React.FC = () => (
  <div className="bg-card rounded-xl border border-border p-6">
    <div className="flex items-center justify-between mb-4">
      <SkeletonPulse className="h-4 w-24" />
      <SkeletonPulse className="h-5 w-5 rounded" />
    </div>
    <SkeletonPulse className="h-9 w-20 mb-2" />
    <SkeletonPulse className="h-3 w-16" />
  </div>
);

// Sidebar Skeleton - renders instantly with menu placeholder
export const SidebarSkeleton: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => (
  <div className={cn(
    "h-screen flex flex-col bg-sidebar border-r border-sidebar-border",
    collapsed ? "w-[68px]" : "w-64"
  )}>
    {/* Brand */}
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 w-10 rounded-xl" />
        {!collapsed && (
          <div className="space-y-1.5">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
        )}
      </div>
    </div>
    
    {/* Menu Items */}
    <div className="flex-1 p-3 space-y-6">
      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="space-y-2">
          {!collapsed && <SkeletonPulse className="h-3 w-12 ml-3 mb-2" />}
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                collapsed && "justify-center"
              )}
            >
              <SkeletonPulse className="h-[18px] w-[18px] rounded" />
              {!collapsed && <SkeletonPulse className="h-4 w-24" />}
            </div>
          ))}
        </div>
      ))}
    </div>
    
    {/* Profile */}
    <div className="p-4 border-t border-sidebar-border">
      <div className="flex items-center gap-3">
        <SkeletonPulse className="h-10 w-10 rounded-full" />
        {!collapsed && (
          <div className="flex-1 space-y-1.5">
            <SkeletonPulse className="h-4 w-20" />
            <SkeletonPulse className="h-3 w-28" />
          </div>
        )}
      </div>
    </div>
  </div>
);

// Admin Dashboard Layout Skeleton
export const AdminDashboardSkeleton: React.FC = () => (
  <div className="min-h-screen flex">
    <SidebarSkeleton />
    <div className="flex-1 p-6 lg:p-8 bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <SkeletonPulse className="h-8 w-48" />
          <SkeletonPulse className="h-4 w-32" />
        </div>
        <SkeletonPulse className="h-10 w-10 rounded-lg" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Quick Access */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex flex-col items-center gap-2">
              <SkeletonPulse className="h-12 w-12 rounded-xl" />
              <SkeletonPulse className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <SkeletonPulse className="h-5 w-32 mb-2" />
              <SkeletonPulse className="h-4 w-24" />
            </div>
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1.5">
                    <SkeletonPulse className="h-4 w-24" />
                    <SkeletonPulse className="h-3 w-16" />
                  </div>
                  <div className="text-right space-y-1.5">
                    <SkeletonPulse className="h-4 w-16" />
                    <SkeletonPulse className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Client Dashboard Layout Skeleton
export const ClientDashboardSkeleton: React.FC = () => (
  <div className="min-h-screen flex">
    <SidebarSkeleton />
    <div className="flex-1 p-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <SkeletonPulse className="h-7 w-40" />
          <SkeletonPulse className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-3">
          <SkeletonPulse className="h-10 w-10 rounded-lg" />
          <SkeletonPulse className="h-10 w-10 rounded-full" />
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <SkeletonPulse className="h-5 w-28 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
                  <SkeletonPulse className="h-10 w-10 rounded-lg" />
                  <SkeletonPulse className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Resource Usage */}
          <div className="bg-card rounded-xl border border-border p-6">
            <SkeletonPulse className="h-5 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <SkeletonPulse className="h-4 w-20" />
                    <SkeletonPulse className="h-4 w-16" />
                  </div>
                  <SkeletonPulse className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <SkeletonPulse className="h-5 w-28 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <SkeletonPulse className="h-8 w-8 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <SkeletonPulse className="h-4 w-24" />
                    <SkeletonPulse className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Table Skeleton with proper rows
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 5 
}) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    {/* Header */}
    <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/30">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonPulse key={i} className={cn("h-4", i === 0 ? "w-32" : "w-24")} />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonPulse 
            key={colIndex} 
            className={cn("h-4", colIndex === 0 ? "w-32" : "w-24")} 
          />
        ))}
      </div>
    ))}
  </div>
);

// Chart Skeleton
export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = "h-64" }) => (
  <div className={cn("bg-card rounded-xl border border-border p-6", height)}>
    <div className="flex items-center justify-between mb-4">
      <SkeletonPulse className="h-5 w-32" />
      <SkeletonPulse className="h-8 w-24 rounded-lg" />
    </div>
    <div className="flex items-end justify-between h-[calc(100%-60px)] pt-4">
      {[40, 65, 35, 80, 50, 70, 45, 60].map((h, i) => (
        <SkeletonPulse 
          key={i} 
          className="w-8 rounded-t" 
          style={{ height: `${h}%` }} 
        />
      ))}
    </div>
  </div>
);

// Full Page Loading (minimal, fast)
export const PageLoadingSkeleton: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-xl bg-primary/20 animate-pulse" />
        <div className="absolute inset-0 h-12 w-12 rounded-xl border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <SkeletonPulse className="h-4 w-24" />
    </div>
  </div>
);

// Auth Loading Screen (skeleton dashboard preview) - DEPRECATED
// Use content-only skeletons instead
export const AuthLoadingSkeleton: React.FC<{ type?: 'admin' | 'client' }> = ({ type = 'client' }) => {
  // Return minimal loader instead of full dashboard skeleton
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-xl bg-primary/20 animate-pulse" />
          <div className="absolute inset-0 h-10 w-10 rounded-xl border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <span className="text-sm text-muted-foreground animate-pulse">Loading...</span>
      </div>
    </div>
  );
};

// Empty State Component
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {icon && (
      <div className="p-4 rounded-2xl bg-muted/50 mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    {description && (
      <p className="text-muted-foreground text-sm max-w-sm mb-4">{description}</p>
    )}
    {action}
  </div>
);

// Error State Component
export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  isTimeout?: boolean;
}> = ({ 
  title = "Something went wrong", 
  description = "Failed to load data. Please try again.",
  onRetry,
  isTimeout = false
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className={cn(
      "p-4 rounded-2xl mb-4",
      isTimeout ? "bg-warning/10" : "bg-destructive/10"
    )}>
      {isTimeout ? (
        <svg className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )}
    </div>
    <h3 className="text-lg font-semibold mb-1">
      {isTimeout ? "Request Timed Out" : title}
    </h3>
    <p className="text-muted-foreground text-sm max-w-sm mb-4">
      {isTimeout ? "The request took too long. Please check your connection and try again." : description}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

// Content-only skeleton for admin pages (no layout)
export const AdminContentSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Table */}
    <TableSkeleton rows={5} columns={5} />
  </div>
);

// Content-only skeleton for client pages (no layout)
export const ClientContentSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Content Cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <SkeletonPulse className="h-5 w-28 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonPulse key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Stats-only skeleton
export const StatsGridSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

// List skeleton
export const ListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
    ))}
  </div>
);

// Card content skeleton
export const CardContentSkeleton: React.FC = () => (
  <div className="space-y-4">
    <SkeletonPulse className="h-5 w-32" />
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <SkeletonPulse key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);
