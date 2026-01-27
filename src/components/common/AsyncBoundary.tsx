/**
 * AsyncBoundary Component
 * Unified error + loading boundary with retry support
 */

import React, { Component, ReactNode, useCallback, useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, WifiOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════
// ERROR BOUNDARY CLASS COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  showRetry?: boolean;
}

export class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AsyncBoundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={this.props.showRetry !== false ? this.handleRetry : undefined}
        />
      );
    }

    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════
// ERROR FALLBACK COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ErrorFallbackProps {
  error?: Error | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'default' | 'inline' | 'minimal';
  className?: string;
}

export function ErrorFallback({
  error,
  title = 'কিছু সমস্যা হয়েছে',
  message,
  onRetry,
  variant = 'default',
  className,
}: ErrorFallbackProps) {
  const errorMessage = message || error?.message || 'অপ্রত্যাশিত ত্রুটি ঘটেছে';

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2 text-destructive text-sm', className)}>
        <AlertCircle className="h-4 w-4" />
        <span>{errorMessage}</span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('p-4 border border-destructive/20 rounded-lg bg-destructive/5', className)}>
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-destructive">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="shrink-0">
              <RefreshCw className="h-4 w-4 mr-1" />
              আবার চেষ্টা
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex-1 flex items-center justify-center min-h-[300px] p-4', className)}>
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            আবার চেষ্টা করুন
          </Button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TIMEOUT FALLBACK
// ═══════════════════════════════════════════════════════════════

interface TimeoutFallbackProps {
  onRetry?: () => void;
  className?: string;
}

export function TimeoutFallback({ onRetry, className }: TimeoutFallbackProps) {
  return (
    <div className={cn('flex-1 flex items-center justify-center min-h-[300px] p-4', className)}>
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-warning/10 mx-auto mb-4 flex items-center justify-center">
          <Clock className="h-8 w-8 text-warning" />
        </div>
        <h3 className="text-lg font-semibold mb-2">লোড করতে সময় লাগছে</h3>
        <p className="text-muted-foreground mb-4">
          সার্ভার থেকে ডেটা আসতে বিলম্ব হচ্ছে। নেটওয়ার্ক চেক করে আবার চেষ্টা করুন।
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            আবার চেষ্টা করুন
          </Button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OFFLINE FALLBACK
// ═══════════════════════════════════════════════════════════════

interface OfflineFallbackProps {
  className?: string;
}

export function OfflineFallback({ className }: OfflineFallbackProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className={cn('flex-1 flex items-center justify-center min-h-[300px] p-4', className)}>
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <WifiOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">ইন্টারনেট সংযোগ নেই</h3>
        <p className="text-muted-foreground">
          আপনার ইন্টারনেট সংযোগ পুনরায় স্থাপিত হলে পেজ স্বয়ংক্রিয়ভাবে রিফ্রেশ হবে।
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOADING SKELETON VARIANTS
// ═══════════════════════════════════════════════════════════════

interface ContentSkeletonProps {
  variant?: 'cards' | 'table' | 'list' | 'stats';
  count?: number;
  className?: string;
}

export function ContentSkeleton({
  variant = 'cards',
  count = 3,
  className,
}: ContentSkeletonProps) {
  if (variant === 'stats') {
    return (
      <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border bg-card">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('border rounded-lg overflow-hidden', className)}>
        <div className="bg-muted/30 p-3 border-b">
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-3 border-b last:border-0">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border bg-card">
            <Skeleton className="h-5 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Cards variant (default)
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-lg border bg-card">
          <Skeleton className="h-6 w-1/2 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMBINED ASYNC BOUNDARY HOOK
// ═══════════════════════════════════════════════════════════════

interface AsyncStateProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isTimeout?: boolean;
  isEmpty?: boolean;
  children: ReactNode;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  onRetry?: () => void;
}

export function AsyncState({
  isLoading,
  isError,
  error,
  isTimeout,
  isEmpty,
  children,
  loadingComponent,
  emptyComponent,
  onRetry,
}: AsyncStateProps) {
  if (isLoading) {
    return <>{loadingComponent || <ContentSkeleton />}</>;
  }

  if (isTimeout) {
    return <TimeoutFallback onRetry={onRetry} />;
  }

  if (isError) {
    return <ErrorFallback error={error} onRetry={onRetry} variant="inline" />;
  }

  if (isEmpty && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return <>{children}</>;
}
