import React from 'react';
import AuthGate from './AuthGate';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute - Wrapper for authenticated routes
 * 
 * Uses AuthGate for fast authentication resolution.
 * Layout renders immediately after auth - no full-page skeletons.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  return (
    <AuthGate requireAdmin={requireAdmin}>
      {children}
    </AuthGate>
  );
};

export default ProtectedRoute;
