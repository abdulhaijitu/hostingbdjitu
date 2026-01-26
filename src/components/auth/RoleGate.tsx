import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, LogIn, Clock, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleGateProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
  /** Custom shell to render during role resolution */
  loadingShell?: React.ReactNode;
}

// Role-specific loading state (inline, no skeleton wrapper)
const RoleLoadingIndicator = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="h-8 w-8 rounded-lg bg-primary/20 animate-pulse" />
        <div className="absolute inset-0 h-8 w-8 rounded-lg border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <span className="text-sm text-muted-foreground">অনুমতি যাচাই করা হচ্ছে...</span>
    </div>
  </div>
);

// Access denied state - ONLY for confirmed non-admin users
const AccessDeniedState = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="text-center p-8 max-w-md">
      <div className="h-16 w-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
        <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2">অ্যাক্সেস অনুমোদিত নয়</h2>
      <p className="text-muted-foreground mb-4">
        এই পেজ দেখার অনুমতি আপনার নেই। শুধুমাত্র অ্যাডমিন ইউজাররা এই পেজ দেখতে পারেন।
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => window.location.href = '/client'} variant="default">
          ড্যাশবোর্ডে যান
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          হোম পেজে যান
        </Button>
      </div>
    </div>
  </div>
);

// Role loading error/timeout state - NOT access denied, just retry UI
const RoleRetryState = ({ 
  onRetry, 
  error, 
  isTimeout 
}: { 
  onRetry: () => void; 
  error?: string;
  isTimeout?: boolean;
}) => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="text-center p-8 max-w-md">
      <div className="h-16 w-16 rounded-full bg-warning/10 mx-auto mb-4 flex items-center justify-center">
        {isTimeout ? (
          <Clock className="h-8 w-8 text-warning" />
        ) : (
          <Wifi className="h-8 w-8 text-warning" />
        )}
      </div>
      <h2 className="text-xl font-bold mb-2">
        {isTimeout ? 'রোল লোড করতে সময় লাগছে' : 'রোল লোড করতে সমস্যা'}
      </h2>
      <p className="text-muted-foreground mb-4">
        {isTimeout 
          ? 'আপনার অনুমতি যাচাই করা সম্ভব হচ্ছে না। নেটওয়ার্ক চেক করে আবার চেষ্টা করুন।'
          : 'আপনার ইউজার রোল লোড করা সম্ভব হয়নি। আবার চেষ্টা করুন।'
        }
      </p>
      {error && !isTimeout && (
        <p className="text-xs text-muted-foreground mb-4 font-mono bg-muted/50 p-2 rounded">
          {error}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRetry} variant="default" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          আবার চেষ্টা করুন
        </Button>
        <Button 
          onClick={() => window.location.reload()} 
          variant="secondary"
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          পেজ রিফ্রেশ
        </Button>
        <Button 
          onClick={() => window.location.href = '/auth/login'} 
          variant="outline"
          className="gap-2"
        >
          <LogIn className="h-4 w-4" />
          পুনরায় লগইন
        </Button>
      </div>
    </div>
  </div>
);

// Timeout constant (8 seconds)
const ROLE_LOADING_TIMEOUT = 8000;

/**
 * RoleGate - Level 2 authorization wrapper
 * 
 * CRITICAL PRINCIPLE:
 * - Timeout ≠ Access Denied
 * - Timeout = Unknown state, show retry UI
 * - Only deny access when role is CONFIRMED as non-admin
 * 
 * Responsibilities:
 * - Check role AFTER auth is resolved
 * - Never deny access on timeout
 * - Show retry UI for timeouts and errors
 * 
 * CRITICAL: This component assumes auth is ALREADY resolved.
 * It should be used inside AuthGate.
 */
const RoleGate: React.FC<RoleGateProps> = ({
  children,
  requiredRole = 'admin',
  loadingShell,
}) => {
  const { 
    user, 
    role, 
    roleLoading, 
    roleError, 
    retryRoleFetch,
  } = useAuth();
  
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start/reset timeout when roleLoading starts
  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only set timeout if actively loading
    if (roleLoading) {
      setTimedOut(false); // Reset timeout state when loading starts
      timeoutRef.current = setTimeout(() => {
        setTimedOut(true);
      }, ROLE_LOADING_TIMEOUT);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [roleLoading]);
  
  // Reset timeout when role is successfully resolved
  useEffect(() => {
    if (role !== null && timedOut) {
      setTimedOut(false);
    }
  }, [role, timedOut]);

  const handleRetry = useCallback(() => {
    setTimedOut(false);
    retryRoleFetch();
  }, [retryRoleFetch]);

  // DECISION TREE:
  // 1. roleLoading && !timedOut → show loading
  // 2. timedOut (regardless of roleLoading) → show RETRY UI (NOT access denied)
  // 3. roleError → show RETRY UI (NOT access denied)
  // 4. role === 'admin' → allow access
  // 5. role !== null && role !== 'admin' → access denied (CONFIRMED non-admin)
  // 6. role === null && !roleLoading → show RETRY UI (unknown state)

  // PHASE 1: Still loading and not timed out - show loading indicator
  if (roleLoading && !timedOut) {
    if (loadingShell) {
      return <>{loadingShell}</>;
    }
    return <RoleLoadingIndicator />;
  }

  // PHASE 2: Timed out - show RETRY UI (NOT access denied)
  // CRITICAL: Timeout ≠ Unauthorized
  if (timedOut) {
    return <RoleRetryState onRetry={handleRetry} isTimeout={true} />;
  }

  // PHASE 3: Error occurred - show RETRY UI (NOT access denied)
  if (roleError) {
    return <RoleRetryState onRetry={handleRetry} error={roleError} />;
  }

  // PHASE 4: Role is confirmed as admin - allow access
  if (role === 'admin') {
    return <>{children}</>;
  }

  // PHASE 5: Role is null but not loading (unknown state) - show RETRY UI
  // This handles edge cases where role fetch completed but returned null
  if (role === null && !roleLoading) {
    return (
      <RoleRetryState 
        onRetry={handleRetry} 
        error="রোল তথ্য পাওয়া যায়নি। আবার চেষ্টা করুন।" 
      />
    );
  }

  // PHASE 6: Role is CONFIRMED as non-admin (customer) - access denied
  // Only show this when we are CERTAIN the user is not an admin
  if (requiredRole === 'admin' && role === 'customer') {
    return <AccessDeniedState />;
  }

  // Default: Allow access (for customer-required routes or other cases)
  return <>{children}</>;
};

export default RoleGate;
