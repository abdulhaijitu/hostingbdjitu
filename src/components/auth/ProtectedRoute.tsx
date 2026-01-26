import React from 'react';
import AuthGate from './AuthGate';
import RoleGate from './RoleGate';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute - Combined auth + role protection
 * 
 * Flow:
 * 1. AuthGate checks if user is logged in
 * 2. If requireAdmin, RoleGate checks admin role
 * 3. Children render only after all checks pass
 * 
 * This is the simple wrapper used in App.tsx routes.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  return (
    <AuthGate>
      {requireAdmin ? (
        <RoleGate requiredRole="admin">
          {children}
        </RoleGate>
      ) : (
        children
      )}
    </AuthGate>
  );
};

export default ProtectedRoute;
