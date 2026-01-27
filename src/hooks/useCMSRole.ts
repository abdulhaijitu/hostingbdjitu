import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export type CMSRole = 'super_admin' | 'editor' | 'viewer';

export interface CMSAdminRole {
  id: string;
  user_id: string;
  role: CMSRole;
  created_at: string;
  updated_at: string;
}

// Get current user's CMS role
export const useCMSRole = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['cms-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('cms_admin_roles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as CMSAdminRole | null;
    },
    enabled: !!user?.id,
  });
};

// Get all CMS admins (for super admin management)
export const useCMSAdmins = () => {
  return useQuery({
    queryKey: ['cms-admins'],
    queryFn: async () => {
      // First get all CMS admin roles
      const { data: roles, error: rolesError } = await supabase
        .from('cms_admin_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (rolesError) throw rolesError;
      if (!roles || roles.length === 0) return [];
      
      // Then get profiles for those users
      const userIds = roles.map(r => r.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, full_name')
        .in('user_id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Combine the data
      return roles.map(role => ({
        ...role,
        profiles: profiles?.find(p => p.user_id === role.user_id) || { email: 'Unknown', full_name: 'Unknown' }
      }));
    },
  });
};

// Assign CMS role to user
export const useAssignCMSRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: CMSRole }) => {
      // Upsert - insert or update
      const { data, error } = await supabase
        .from('cms_admin_roles')
        .upsert(
          { user_id: userId, role, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        )
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-admins'] });
      queryClient.invalidateQueries({ queryKey: ['cms-role'] });
      toast.success('CMS রোল আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('CMS রোল আপডেট করতে সমস্যা হয়েছে');
      console.error('Assign CMS role error:', error);
    },
  });
};

// Remove CMS role from user
export const useRemoveCMSRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('cms_admin_roles')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-admins'] });
      queryClient.invalidateQueries({ queryKey: ['cms-role'] });
      toast.success('CMS অ্যাক্সেস মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('CMS অ্যাক্সেস মুছতে সমস্যা হয়েছে');
      console.error('Remove CMS role error:', error);
    },
  });
};

// Permission check helper
export const hasCMSPermission = (userRole: CMSRole | null | undefined, requiredRole: CMSRole): boolean => {
  if (!userRole) return false;
  
  // super_admin has all permissions
  if (userRole === 'super_admin') return true;
  
  // editor can do editor and viewer tasks
  if (userRole === 'editor' && (requiredRole === 'editor' || requiredRole === 'viewer')) return true;
  
  // viewer can only do viewer tasks
  if (userRole === 'viewer' && requiredRole === 'viewer') return true;
  
  return false;
};

// Permission matrix
export const CMS_PERMISSIONS = {
  pages: 'editor',
  pricing: 'editor',
  blog: 'editor',
  announcements: 'editor',
  faqs: 'editor',
  testimonials: 'editor',
  global_settings: 'super_admin',
  admin_users: 'super_admin',
  contact_messages: 'viewer',
} as const;
