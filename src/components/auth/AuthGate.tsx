import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { RefreshCw, LogIn, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

// Minimal loading indicator - never throws errors
const MinimalLoader: React.FC<{ type?: 'admin' | 'client' }> = ({ type = 'client' }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className={cn(
          "h-10 w-10 rounded-xl animate-pulse",
          type === 'admin' ? 'bg-primary/20' : 'bg-primary/20'
        )} />
        <div className="absolute inset-0 h-10 w-10 rounded-xl border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <span className="text-sm text-muted-foreground animate-pulse">
        {type === 'admin' ? 'অনুমতি যাচাই করা হচ্ছে...' : 'লোড হচ্ছে...'}
      </span>
    </div>
  </div>
);

// Role error state - shown when role fetch fails
const RoleErrorState: React.FC<{ onRetry: () => void; error?: string }> = ({ onRetry, error }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
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

// Access denied state - shown when user doesn't have permission
const AccessDeniedState: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
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

/**
 * AuthGate - Authentication and Authorization wrapper
 * 
 * CRITICAL PRINCIPLES:
 * - Authentication (login check) ≠ Authorization (role check)
 * - NEVER throw errors for loading/undefined states
 * - NEVER redirect before role is resolved
 * - Use explicit state machine for role resolution
 * 
 * Flow:
 * 1. Wait for auth to be ready (show loader)
 * 2. Check if user is logged in (redirect to login if not)
 * 3. For admin routes: wait for role resolution (show loader)
 * 4. Handle role errors gracefully (show error state, not error boundary)
 * 5. Only deny access AFTER role is confirmed non-admin
 */
const AuthGate: React.FC<AuthGateProps> = ({ 
  children, 
  requireAdmin = false,
  fallback 
}) => {
  const { 
    user, 
    loading, 
    authReady, 
    isAdmin, 
    role, 
    roleLoading, 
    roleError,
    retryRoleFetch 
  } = useAuth();
  const location = useLocation();
  
  // Determine route type for loader styling
  const routeType = location.pathname.startsWith('/admin') ? 'admin' : 'client';

  // Debug logging (safe, never throws)
  console.log('[AuthGate] State:', { 
    loading, 
    authReady, 
    hasUser: !!user, 
    role, 
    roleLoading, 
    roleError,
    isAdmin, 
    requireAdmin,
    path: location.pathname 
  });

  // PHASE 1: Wait for authentication to resolve
  // Never throw here - just show loader
  if (loading || !authReady) {
    console.log('[AuthGate] Phase 1: Auth loading...');
    return fallback || <MinimalLoader type={routeType} />;
  }

  // PHASE 2: Check authentication (is user logged in?)
  if (!user) {
    console.log('[AuthGate] Phase 2: No user, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // PHASE 3: For admin routes, check authorization
  if (requireAdmin) {
    // 3a: Role is still loading - show loader (NEVER error boundary)
    if (roleLoading) {
      console.log('[AuthGate] Phase 3a: Role loading...');
      return fallback || <MinimalLoader type="admin" />;
    }

    // 3b: Role fetch had an error - show retry UI (not error boundary)
    if (roleError) {
      console.log('[AuthGate] Phase 3b: Role error:', roleError);
      return <RoleErrorState onRetry={retryRoleFetch} error={roleError} />;
    }

    // 3c: Role is resolved - check if admin
    console.log('[AuthGate] Phase 3c: Role resolved:', { role, isAdmin });

    if (!isAdmin) {
      console.log('[AuthGate] Phase 3c: Not admin, showing access denied');
      return <AccessDeniedState />;
    }
    
    console.log('[AuthGate] Phase 3c: Admin access granted');
  }

  // All checks passed - render children
  console.log('[AuthGate] Access granted, rendering children');
  return <>{children}</>;
};

export default AuthGate;