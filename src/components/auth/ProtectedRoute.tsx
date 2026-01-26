import React, { useMemo, forwardRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AuthLoadingSkeleton
} from '@/components/common/DashboardSkeletons';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = forwardRef<HTMLDivElement, ProtectedRouteProps>(
  ({ children, requireAdmin = false }, ref) => {
    const { user, loading, authReady, isAdmin, role } = useAuth();
    const location = useLocation();

    // Determine which skeleton to show based on route
    const skeletonType = useMemo(() => {
      return location.pathname.startsWith('/admin') ? 'admin' : 'client';
    }, [location.pathname]);

    // Show skeleton while auth is initializing
    if (loading || !authReady) {
      return <AuthLoadingSkeleton type={skeletonType} />;
    }

    // Redirect to login if not authenticated
    if (!user) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // For admin routes, check role
    if (requireAdmin) {
      // If role is still loading (null but user exists)
      if (role === null && user) {
        return <AuthLoadingSkeleton type="admin" />;
      }
      
      // Role loaded but not admin
      if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
      }
    }

    return <div ref={ref}>{children}</div>;
  }
);

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
