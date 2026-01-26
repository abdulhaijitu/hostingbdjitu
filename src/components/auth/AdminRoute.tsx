import React from 'react';
import AuthGate from './AuthGate';
import RoleGate from './RoleGate';
import AdminLayout from '@/components/admin/AdminLayout';

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
 * 
 * Key Principle: Layout renders first, role check shows loader INSIDE layout
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <AuthGate>
      <AdminLayout>
        <RoleGate requiredRole="admin">
          {children}
        </RoleGate>
      </AdminLayout>
    </AuthGate>
  );
};

export default AdminRoute;
