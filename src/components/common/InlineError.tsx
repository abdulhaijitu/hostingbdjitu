import React from 'react';
import { AlertCircle, RefreshCw, Wifi, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InlineErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  variant?: 'default' | 'minimal' | 'warning' | 'timeout';
  className?: string;
}

/**
 * Inline error component for section-level errors
 * Does not block the entire page - only the affected section
 */
export const InlineError: React.FC<InlineErrorProps> = ({
  title = 'কিছু ভুল হয়েছে',
  description = 'ডেটা লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
  onRetry,
  isRetrying = false,
  variant = 'default',
  className,
}) => {
  const icons = {
    default: AlertCircle,
    minimal: AlertCircle,
    warning: Clock,
    timeout: Wifi,
  };
  
  const Icon = icons[variant];
  
  const colors = {
    default: 'bg-destructive/10 text-destructive border-destructive/20',
    minimal: 'bg-muted/50 text-muted-foreground border-border',
    warning: 'bg-warning/10 text-warning border-warning/20',
    timeout: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  };

  if (variant === 'minimal') {
    return (
      <div className={cn(
        "flex items-center justify-between gap-4 p-4 rounded-lg border",
        colors[variant],
        className
      )}>
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 shrink-0" />
          <p className="text-sm">{title}</p>
        </div>
        {onRetry && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRetry}
            disabled={isRetrying}
            className="shrink-0"
          >
            <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border p-6 text-center",
      colors[variant],
      className
    )}>
      <div className="inline-flex p-3 rounded-full bg-current/10 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm opacity-90 mb-4 max-w-sm mx-auto">{description}</p>
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          disabled={isRetrying}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
          {isRetrying ? 'চেষ্টা করা হচ্ছে...' : 'আবার চেষ্টা করুন'}
        </Button>
      )}
    </div>
  );
};

/**
 * Toast-style error notification
 * For non-blocking errors that don't require immediate action
 */
export const ErrorToast: React.FC<{
  message: string;
  onDismiss?: () => void;
  className?: string;
}> = ({ message, onDismiss, className }) => (
  <div className={cn(
    "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50",
    "bg-destructive/95 text-destructive-foreground rounded-xl shadow-lg",
    "p-4 flex items-center gap-3 animate-slide-in-right",
    className
  )}>
    <AlertCircle className="h-5 w-5 shrink-0" />
    <p className="text-sm flex-1">{message}</p>
    {onDismiss && (
      <button 
        onClick={onDismiss}
        className="shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
      >
        <span className="sr-only">বাতিল করুন</span>
        ✕
      </button>
    )}
  </div>
);

/**
 * Page-level error with navigation options
 * For when an entire page fails to load
 */
export const PageError: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  showBackButton?: boolean;
  showHomeButton?: boolean;
}> = ({
  title = 'পেজ লোড করতে সমস্যা হয়েছে',
  description = 'দুঃখিত, এই পেজটি লোড করা সম্ভব হয়নি। আপনার ইন্টারনেট সংযোগ চেক করুন এবং আবার চেষ্টা করুন।',
  onRetry,
  showBackButton = true,
  showHomeButton = true,
}) => (
  <div className="flex-1 flex items-center justify-center min-h-[400px] p-4">
    <div className="text-center max-w-md">
      <div className="inline-flex p-4 rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <Button onClick={onRetry} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            আবার চেষ্টা করুন
          </Button>
        )}
        {showBackButton && (
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            পিছনে যান
          </Button>
        )}
        {showHomeButton && (
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
          >
            হোম পেজে যান
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default InlineError;
