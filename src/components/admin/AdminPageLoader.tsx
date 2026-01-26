import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AdminPageLoader - Skeleton loader for lazy-loaded admin pages
 * Shows while the page chunk is being downloaded
 */
const AdminPageLoader: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-muted/60 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'p-6 rounded-xl border border-border bg-card',
              'space-y-3'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted/60 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-4 bg-muted rounded animate-pulse"
                style={{ width: `${60 + i * 20}px` }}
              />
            ))}
          </div>
        </div>
        
        {/* Table rows */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="border-b border-border last:border-0 px-6 py-4"
          >
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((col) => (
                <div
                  key={col}
                  className="h-4 bg-muted/60 rounded animate-pulse"
                  style={{ 
                    width: `${40 + col * 15 + (row % 3) * 10}px`,
                    animationDelay: `${row * 50 + col * 25}ms`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
        <span className="ml-2 text-sm text-muted-foreground">লোড হচ্ছে...</span>
      </div>
    </div>
  );
};

export default AdminPageLoader;
