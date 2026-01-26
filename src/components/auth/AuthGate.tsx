import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AuthGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

// Role resolution timeout - wait up to 3 seconds for role
const ROLE_TIMEOUT_MS = 3000;

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
        {type === 'admin' ? 'Verifying access...' : 'Loading...'}
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
 * - Role loading has explicit timeout with access denied fallback
 * 
 * Flow:
 * 1. Wait for auth to be ready
 * 2. Check if user is logged in (redirect to login if not)
 * 3. For admin routes: wait for role resolution
 * 4. Only redirect based on role AFTER role is confirmed
 */
const AuthGate: React.FC<AuthGateProps> = ({ 
  children, 
  requireAdmin = false,
  fallback 
}) => {
  const { user, loading, authReady, isAdmin, role } = useAuth();
  const location = useLocation();
  
  // Track if we're waiting for role resolution
  const [roleLoading, setRoleLoading] = useState(requireAdmin);
  const [roleTimeout, setRoleTimeout] = useState(false);
  const roleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Determine route type for loader styling
  const routeType = location.pathname.startsWith('/admin') ? 'admin' : 'client';

  // Handle role resolution timeout
  useEffect(() => {
    // Only care about role resolution for admin routes
    if (!requireAdmin) {
      setRoleLoading(false);
      return;
    }

    // If we have the role already, stop loading
    if (role !== null) {
      setRoleLoading(false);
      if (roleTimeoutRef.current) {
        clearTimeout(roleTimeoutRef.current);
      }
      return;
    }

    // If auth is ready and user exists but role is still null, set timeout
    if (authReady && user && role === null) {
      roleTimeoutRef.current = setTimeout(() => {
        setRoleLoading(false);
        setRoleTimeout(true);
      }, ROLE_TIMEOUT_MS);
    }

    return () => {
      if (roleTimeoutRef.current) {
        clearTimeout(roleTimeoutRef.current);
      }
    };
  }, [requireAdmin, authReady, user, role]);

  // Phase 1: Wait for authentication to resolve
  if (loading || !authReady) {
    return fallback || <MinimalLoader type={routeType} />;
  }

  // Phase 2: Check authentication (is user logged in?)
  if (!user) {
    // User is not logged in - redirect to login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Phase 3: For admin routes, check authorization (does user have admin role?)
  if (requireAdmin) {
    // Still waiting for role to resolve - show loader
    if (roleLoading && role === null && !roleTimeout) {
      return fallback || <MinimalLoader type="admin" />;
    }

    // Role timeout occurred - show access denied
    if (roleTimeout && role === null) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <div className="h-16 w-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
              <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">অ্যাক্সেস সমস্যা</h2>
            <p className="text-muted-foreground mb-4">
              আপনার ইউজার রোল যাচাই করা সম্ভব হয়নি। দয়া করে পুনরায় লগইন করুন।
            </p>
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              লগইন পেজে যান
            </button>
          </div>
        </div>
      );
    }

    // Role is resolved but user is not admin
    if (!isAdmin) {
      // Non-admin user trying to access admin route - redirect to client dashboard
      return <Navigate to="/client" replace />;
    }
    
    // User is admin - allow access to admin routes
  }

  // For client routes (/client/*), ensure non-admin users can access
  // Admin users CAN also access client routes if they want
  
  // All checks passed - render children
  return <>{children}</>;
};

export default AuthGate;
