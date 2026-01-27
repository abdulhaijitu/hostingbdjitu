import React from 'react';
import { useCMSRole, hasCMSPermission, CMSRole } from '@/hooks/useCMSRole';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CMSPermissionGateProps {
  requiredRole: CMSRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * CMSPermissionGate - Gates content based on CMS role
 * 
 * Permission Hierarchy:
 * - super_admin: Full access to everything
 * - editor: Can edit content (pages, pricing, blog, etc.)
 * - viewer: Read-only access
 */
const CMSPermissionGate: React.FC<CMSPermissionGateProps> = ({
  requiredRole,
  children,
  fallback,
}) => {
  const { data: cmsRole, isLoading, error } = useCMSRole();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-6 border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold text-destructive">Permission Check Failed</h3>
            <p className="text-sm text-muted-foreground">
              Unable to verify your CMS permissions. Please try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if user has required permission
  const hasPermission = hasCMSPermission(cmsRole?.role, requiredRole);

  if (!hasPermission) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <Card className="m-6 border-amber-500/50 bg-amber-500/5">
        <CardContent className="flex items-center gap-4 py-8">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">অ্যাক্সেস অনুমোদিত নয়</h3>
            <p className="text-sm text-muted-foreground mt-1">
              এই পেজ দেখতে আপনার{' '}
              <span className="font-medium text-amber-600">
                {requiredRole === 'super_admin' ? 'Super Admin' : 
                 requiredRole === 'editor' ? 'Editor' : 'Viewer'}
              </span>{' '}
              রোল প্রয়োজন।
            </p>
            {cmsRole?.role && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                আপনার বর্তমান রোল: <span className="font-medium">{cmsRole.role}</span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default CMSPermissionGate;

// Hook for conditional rendering based on permission
export const useCMSPermission = (requiredRole: CMSRole): boolean => {
  const { data: cmsRole } = useCMSRole();
  return hasCMSPermission(cmsRole?.role, requiredRole);
};
