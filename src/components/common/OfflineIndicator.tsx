import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

/**
 * OfflineIndicator - Shows a banner when the user is offline
 * Automatically hides when back online
 */
const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[9999]',
        'bg-destructive text-destructive-foreground',
        'px-4 py-3 flex items-center justify-center gap-3',
        'animate-slide-up safe-area-bottom'
      )}
      role="alert"
      aria-live="assertive"
    >
      <WifiOff className="h-5 w-5 flex-shrink-0" />
      <span className="text-sm font-medium">
        আপনি অফলাইন আছেন। কিছু ফিচার কাজ নাও করতে পারে।
      </span>
      <button
        onClick={() => window.location.reload()}
        className={cn(
          'ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md',
          'bg-destructive-foreground/20 hover:bg-destructive-foreground/30',
          'text-sm font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-destructive-foreground/50'
        )}
      >
        <RefreshCw className="h-4 w-4" />
        রিট্রাই
      </button>
    </div>
  );
};

export default OfflineIndicator;
