import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

/**
 * Full page loading spinner for lazy-loaded routes
 */
const PageLoader: React.FC<PageLoaderProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated loader */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-muted"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">
            {message || 'Loading...'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
