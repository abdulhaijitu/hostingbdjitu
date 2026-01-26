import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AuthGateProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

// Minimal loading indicator - max 300ms visible
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
      <span className="text-sm text-muted-foreground animate-pulse">Loading...</span>
    </div>
  </div>
);

/**
 * AuthGate - Lightweight authentication wrapper
 * 
 * Responsibilities:
 * - Resolve user session
 * - Handle redirect if unauthenticated
 * - Show max 300ms skeleton fallback
 * 
 * Does NOT:
 * - Fetch page data
 * - Control page skeletons
 */
const AuthGate: React.FC<AuthGateProps> = ({ 
  children, 
  requireAdmin = false,
  fallback 
}) => {
  const { user, loading, authReady, isAdmin, role } = useAuth();
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(true);
  
  // Determine route type for minimal loader styling
  const routeType = location.pathname.startsWith('/admin') ? 'admin' : 'client';

  // Hide loader after 300ms max, or immediately when auth resolves
  useEffect(() => {
    if (authReady && !loading) {
      setShowLoader(false);
    } else {
      const timer = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timer);
    }
  }, [authReady, loading]);

  // Show minimal loader only during initial auth check (max 300ms)
  if ((loading || !authReady) && showLoader) {
    return fallback || <MinimalLoader type={routeType} />;
  }

  // After loader timeout, if still loading, continue to show children
  // This prevents infinite loading states
  if (!authReady) {
    // Auth taking too long - redirect to login as fallback
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // For admin routes, check role
  if (requireAdmin) {
    // If role is null but user exists, assume customer (safe default)
    // This prevents infinite role loading
    if (role === null) {
      // Wait a bit more for role, but not indefinitely
      if (loading) {
        return fallback || <MinimalLoader type="admin" />;
      }
      // Role not found after auth ready - redirect to dashboard
      return <Navigate to="/client" replace />;
    }
    
    // Role loaded but not admin
    if (!isAdmin) {
      return <Navigate to="/client" replace />;
    }
  }

  // Auth resolved - render children immediately
  return <>{children}</>;
};

export default AuthGate;
