import React from 'react';
import AuthGate from './AuthGate';
import RoleGate from './RoleGate';
import AdminLayout from '@/components/admin/AdminLayout';
import PageErrorBoundary from '@/components/common/PageErrorBoundary';

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
 * 4. PageErrorBoundary (Level 3): Catch runtime crashes in page content only
 * 
 * Key Principle: Layout renders first, role check shows loader INSIDE layout
 * Error in page content does NOT crash navigation
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <AuthGate>
      <AdminLayout>
        <RoleGate requiredRole="admin">
          <PageErrorBoundary>
            {children}
          </PageErrorBoundary>
        </RoleGate>
      </AdminLayout>
    </AuthGate>
  );
};

export default AdminRoute;
