import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AuthGateProps {
  children: React.ReactNode;
  /** Custom fallback while auth is loading */
  fallback?: React.ReactNode;
}

// Timeout constant (5 seconds max for auth)
const AUTH_LOADING_TIMEOUT = 5000;

// Minimal loading indicator - pure function, no ref issues
const MinimalAuthLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="h-10 w-10 rounded-xl bg-primary/20 animate-pulse" />
        <div className="absolute inset-0 h-10 w-10 rounded-xl border-2 border-primary border-t-transparent animate-spin" />
      </div>
      <span className="text-sm text-muted-foreground animate-pulse">
        লোড হচ্ছে...
      </span>
    </div>
  </div>
);

/**
 * AuthGate - Level 1 authentication wrapper
 * 
 * SINGLE RESPONSIBILITY:
 * - Resolve auth session only
 * - Set user or null
 * - Set authLoading = false ALWAYS
 * 
 * AuthGate MUST NOT:
 * - Fetch role
 * - Redirect based on role  
 * - Fetch page data
 * 
 * While authLoading = true:
 * → show minimal loader only
 */
const AuthGate: React.FC<AuthGateProps> = ({ children, fallback }) => {
  const { user, loading, authReady } = useAuth();
  const location = useLocation();
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  // Timeout failsafe - auth should never hang
  useEffect(() => {
    if (loading && !timedOut) {
      timeoutRef.current = setTimeout(() => {
        setTimedOut(true);
      }, AUTH_LOADING_TIMEOUT);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, timedOut]);

  // PHASE 1: Auth is loading and hasn't timed out
  if (loading && !authReady && !timedOut) {
    return fallback ? <>{fallback}</> : <MinimalAuthLoader />;
  }

  // PHASE 2: No user - redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // PHASE 3: User authenticated - render children (role check happens in RoleGate)
  return <>{children}</>;
};

export default AuthGate;
