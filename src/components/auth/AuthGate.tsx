import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AuthGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

// Minimal loading indicator
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

/**
 * AuthGate - Authentication and Authorization wrapper
 * 
 * CRITICAL PRINCIPLES:
 * - Authentication (login check) ≠ Authorization (role check)
 * - Never redirect before role is resolved
 * - Admin users must be able to access /admin routes
 * - Use roleLoading from AuthContext directly
 * 
 * Flow:
 * 1. Wait for auth to be ready
 * 2. Check if user is logged in (redirect to login if not)
 * 3. For admin routes: wait for role resolution (use AuthContext's roleLoading)
 * 4. Only redirect based on role AFTER role is confirmed
 */
const AuthGate: React.FC<AuthGateProps> = ({ 
  children, 
  requireAdmin = false,
  fallback 
}) => {
  const { user, loading, authReady, isAdmin, role, roleLoading } = useAuth();
  const location = useLocation();
  
  // Determine route type for loader styling
  const routeType = location.pathname.startsWith('/admin') ? 'admin' : 'client';

  // Debug logging
  console.log('[AuthGate] State:', { 
    loading, 
    authReady, 
    user: !!user, 
    role, 
    roleLoading, 
    isAdmin, 
    requireAdmin,
    path: location.pathname 
  });

  // Phase 1: Wait for authentication to resolve
  if (loading || !authReady) {
    console.log('[AuthGate] Phase 1: Auth loading...');
    return fallback || <MinimalLoader type={routeType} />;
  }

  // Phase 2: Check authentication (is user logged in?)
  if (!user) {
    console.log('[AuthGate] Phase 2: No user, redirecting to login');
    // User is not logged in - redirect to login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Phase 3: For admin routes, check authorization (does user have admin role?)
  if (requireAdmin) {
    // CRITICAL: Wait for role to resolve - use AuthContext's roleLoading directly
    // Never make authorization decisions while role is loading
    if (roleLoading) {
      console.log('[AuthGate] Phase 3: Role loading, showing loader...');
      return fallback || <MinimalLoader type="admin" />;
    }

    // Role is fully resolved - now we can make authorization decision
    console.log('[AuthGate] Phase 3: Role resolved:', { role, isAdmin });

    // Role is resolved but user is not admin
    if (!isAdmin) {
      console.log('[AuthGate] Phase 3: Not admin, redirecting to /client');
      // Non-admin user trying to access admin route - redirect to client dashboard
      return <Navigate to="/client" replace />;
    }
    
    // User is admin - allow access to admin routes
    console.log('[AuthGate] Phase 3: Admin access granted');
  }

  // For client routes (/client/*), ensure non-admin users can access
  // Admin users CAN also access client routes if they want
  
  // All checks passed - render children
  console.log('[AuthGate] Access granted, rendering children');
  return <>{children}</>;
};

export default AuthGate;