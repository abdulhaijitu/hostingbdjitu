import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { RefreshCw, LogIn, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleGateProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
  /** Render admin shell while loading (instead of minimal loader) */
  renderShellWhileLoading?: boolean;
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

// Access denied state
const AccessDeniedState = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="text-center p-8 max-w-md">
      <div className="h-16 w-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
        <ShieldAlert className="h-8 w-8 text-destructive" />
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

// Role error state with retry
const RoleErrorState = ({ onRetry, error }: { onRetry: () => void; error?: string }) => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="text-center p-8 max-w-md">
      <div className="h-16 w-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
        <ShieldAlert className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold mb-2">অনুমতি লোড করতে সমস্যা</h2>
      <p className="text-muted-foreground mb-4">
        আপনার ইউজার রোল লোড করা সম্ভব হয়নি। আবার চেষ্টা করুন।
      </p>
      {error && (
        <p className="text-xs text-destructive/70 mb-4 font-mono bg-destructive/5 p-2 rounded">
          {error}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRetry} variant="default">
          <RefreshCw className="h-4 w-4 mr-2" />
          আবার চেষ্টা করুন
        </Button>
        <Button onClick={() => window.location.href = '/auth/login'} variant="outline">
          <LogIn className="h-4 w-4 mr-2" />
          পুনরায় লগইন
        </Button>
      </div>
    </div>
  </div>
);

// Timeout constant (8 seconds max)
const ROLE_LOADING_TIMEOUT = 8000;

/**
 * RoleGate - Level 2 authorization wrapper
 * 
 * Responsibilities:
 * - Check role AFTER auth is resolved
 * - Never throw errors for loading states
 * - Render shell immediately, show content loader
 * 
 * CRITICAL: This component assumes auth is ALREADY resolved.
 * It should be used inside AuthGate.
 */
const RoleGate: React.FC<RoleGateProps> = ({
  children,
  requiredRole = 'admin',
  renderShellWhileLoading = true,
  loadingShell,
}) => {
  const { 
    user, 
    role, 
    roleLoading, 
    roleError, 
    retryRoleFetch,
    authReady 
  } = useAuth();
  
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debug logging (temporary)
  useEffect(() => {
    console.log('[RoleGate] State:', {
      authReady,
      userId: user?.id?.slice(0, 8),
      role,
      roleLoading,
      roleError,
      requiredRole,
      path: window.location.pathname
    });
  }, [authReady, user?.id, role, roleLoading, roleError, requiredRole]);

  // Timeout failsafe
  useEffect(() => {
    if (roleLoading && !timedOut) {
      timeoutRef.current = setTimeout(() => {
        console.warn('[RoleGate] Role loading timed out');
        setTimedOut(true);
      }, ROLE_LOADING_TIMEOUT);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [roleLoading, timedOut]);
  
  // Reset timeout on successful load
  useEffect(() => {
    if (!roleLoading && timedOut) {
      setTimedOut(false);
    }
  }, [roleLoading, timedOut]);

  const handleRetry = useCallback(() => {
    setTimedOut(false);
    retryRoleFetch();
  }, [retryRoleFetch]);

  // PHASE 1: Role is loading - show loading indicator (NOT error, NOT full page loader)
  if (roleLoading && !timedOut) {
    if (loadingShell) {
      return <>{loadingShell}</>;
    }
    return <RoleLoadingIndicator />;
  }

  // PHASE 2: Timed out - show retry UI
  if (timedOut) {
    return <RoleErrorState onRetry={handleRetry} error="টাইমআউট: রোল লোড করতে অনেক সময় লাগছে" />;
  }

  // PHASE 3: Error occurred - show error with retry
  if (roleError) {
    return <RoleErrorState onRetry={handleRetry} error={roleError} />;
  }

  // PHASE 4: Role resolved, check access
  const hasRequiredRole = requiredRole === 'admin' ? role === 'admin' : true;
  
  if (!hasRequiredRole) {
    return <AccessDeniedState />;
  }

  // PHASE 5: Authorized - render children
  return <>{children}</>;
};

export default RoleGate;
