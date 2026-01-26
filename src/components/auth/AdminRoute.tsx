import React from 'react';
import AuthGate from './AuthGate';
import RoleGate from './RoleGate';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute - Protected admin route with layout shell
 * 
 * Architecture:
 * 1. AuthGate (Level 1): Check user session
 * 2. AdminLayout: Render shell IMMEDIATELY
 * 3. RoleGate (Level 2): Check admin role inside layout
 * 4. AdminErrorBoundary (Level 3): Catch runtime crashes only
 * 
 * Key Principle: Layout renders first, role check shows loader INSIDE layout
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <AuthGate>
      <AdminLayout>
        <RoleGate requiredRole="admin">
          <AdminErrorBoundary>
            {children}
          </AdminErrorBoundary>
        </RoleGate>
      </AdminLayout>
    </AuthGate>
  );
};

export default AdminRoute;
