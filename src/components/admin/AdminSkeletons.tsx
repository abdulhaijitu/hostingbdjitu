import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Stat Card with Loading State
interface AdminStatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  isLoading?: boolean;
  iconBgClass?: string;
  cardClassName?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  icon,
  value,
  label,
  isLoading = false,
  iconBgClass = 'bg-primary/10',
  cardClassName,
}) => (
  <Card className={cardClassName}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', iconBgClass)}>
          {icon}
        </div>
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </>
          ) : (
            <>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Table Skeleton
interface AdminTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const AdminTableSkeleton: React.FC<AdminTableSkeletonProps> = ({
  rows = 5,
  columns = 5,
}) => (
  <div className="space-y-3">
    {/* Header skeleton */}
    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-t-lg border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className={cn('h-4', i === 0 ? 'w-32' : 'w-20')} />
      ))}
    </div>
    {/* Row skeletons */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex items-center gap-4 p-4 border-b last:border-0">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton 
            key={colIndex} 
            className={cn('h-4', colIndex === 0 ? 'w-32' : 'w-20')} 
          />
        ))}
      </div>
    ))}
  </div>
);

// Stats Grid Skeleton
interface AdminStatsGridSkeletonProps {
  count?: number;
}

export const AdminStatsGridSkeleton: React.FC<AdminStatsGridSkeletonProps> = ({
  count = 4,
}) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Card Content Skeleton
export const AdminCardSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </CardContent>
  </Card>
);

// Ticket List Skeleton
export const AdminTicketListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-4 rounded-lg border bg-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Chat Messages Skeleton
export const AdminMessagesSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-4 p-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
        <div className={cn('max-w-[70%] space-y-2', i % 2 === 0 ? '' : 'items-end')}>
          <Skeleton className="h-4 w-24" />
          <Skeleton className={cn('h-16 rounded-lg', i % 2 === 0 ? 'w-64' : 'w-48')} />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

// Filter Bar Skeleton
export const AdminFilterSkeleton: React.FC = () => (
  <Card className="mb-6">
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Page Header Skeleton
export const AdminPageHeaderSkeleton: React.FC = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <div>
      <Skeleton className="h-5 w-24 mb-2" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-9 w-48" />
      </div>
    </div>
    <Skeleton className="h-10 w-32" />
  </div>
);

// Full Page Loading State
interface AdminPageLoadingProps {
  statsCount?: number;
  tableRows?: number;
}

export const AdminPageLoading: React.FC<AdminPageLoadingProps> = ({
  statsCount = 4,
  tableRows = 5,
}) => (
  <div className="p-6 lg:p-8">
    <AdminPageHeaderSkeleton />
    <AdminStatsGridSkeleton count={statsCount} />
    <AdminFilterSkeleton />
    <AdminCardSkeleton rows={tableRows} />
  </div>
);
