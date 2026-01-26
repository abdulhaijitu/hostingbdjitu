import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface HostingAccount {
  id: string;
  user_id: string;
  order_id: string;
  server_id: string;
  cpanel_username: string;
  domain: string;
  whm_package: string | null;
  ip_address: string | null;
  status: 'pending' | 'active' | 'suspended' | 'terminated' | 'provisioning_failed';
  disk_used_mb: number;
  disk_limit_mb: number;
  bandwidth_used_mb: number;
  bandwidth_limit_mb: number;
  email_accounts_used: number;
  email_accounts_limit: number;
  databases_used: number;
  databases_limit: number;
  php_version: string;
  ssl_status: 'none' | 'pending' | 'active' | 'expired';
  last_synced_at: string | null;
  provisioned_at: string | null;
  suspended_at: string | null;
  suspension_reason: string | null;
  created_at: string;
  updated_at: string;
  hosting_servers?: HostingServer;
}

export interface HostingServer {
  id: string;
  name: string;
  server_type: 'shared' | 'vps' | 'dedicated';
  hostname: string;
  ip_address: string | null;
  api_type: 'whm' | 'cpanel';
  is_active: boolean;
  max_accounts: number;
  current_accounts: number;
  location: string;
  nameservers: string[];
}

// Fetch all hosting accounts for current user
export const useHostingAccounts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['hosting-accounts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_accounts')
        .select('*, hosting_servers(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HostingAccount[];
    },
    enabled: !!user,
  });
};

// Fetch single hosting account
export const useHostingAccount = (accountId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['hosting-account', accountId],
    queryFn: async () => {
      if (!accountId) return null;

      const { data, error } = await supabase
        .from('hosting_accounts')
        .select('*, hosting_servers(*)')
        .eq('id', accountId)
        .single();

      if (error) throw error;
      return data as HostingAccount;
    },
    enabled: !!user && !!accountId,
  });
};

// cPanel API hook
export const useCPanelAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      action, 
      hostingAccountId, 
      params 
    }: { 
      action: string; 
      hostingAccountId: string; 
      params?: Record<string, any>;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cpanel-api`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ action, hostingAccountId, params }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries based on action
      queryClient.invalidateQueries({ queryKey: ['hosting-account', variables.hostingAccountId] });
      
      if (variables.action.includes('Email')) {
        queryClient.invalidateQueries({ queryKey: ['emails', variables.hostingAccountId] });
      }
      if (variables.action.includes('Database')) {
        queryClient.invalidateQueries({ queryKey: ['databases', variables.hostingAccountId] });
      }
    },
  });
};

// Fetch emails for a hosting account
export const useHostingEmails = (hostingAccountId: string | undefined) => {
  const cpanelAction = useCPanelAction();

  return useQuery({
    queryKey: ['emails', hostingAccountId],
    queryFn: async () => {
      if (!hostingAccountId) return [];

      const result = await cpanelAction.mutateAsync({
        action: 'listEmails',
        hostingAccountId,
      });

      return result.data?.result?.data || [];
    },
    enabled: !!hostingAccountId,
    staleTime: 30000, // Cache for 30 seconds
  });
};

// Fetch databases for a hosting account
export const useHostingDatabases = (hostingAccountId: string | undefined) => {
  const cpanelAction = useCPanelAction();

  return useQuery({
    queryKey: ['databases', hostingAccountId],
    queryFn: async () => {
      if (!hostingAccountId) return [];

      const result = await cpanelAction.mutateAsync({
        action: 'listDatabases',
        hostingAccountId,
      });

      return result.data?.result?.data || [];
    },
    enabled: !!hostingAccountId,
    staleTime: 30000,
  });
};

// Fetch usage stats for a hosting account
export const useHostingUsage = (hostingAccountId: string | undefined) => {
  const cpanelAction = useCPanelAction();

  return useQuery({
    queryKey: ['usage', hostingAccountId],
    queryFn: async () => {
      if (!hostingAccountId) return null;

      const result = await cpanelAction.mutateAsync({
        action: 'getUsage',
        hostingAccountId,
      });

      return result.data;
    },
    enabled: !!hostingAccountId,
    staleTime: 60000, // Cache for 1 minute
  });
};

// Email mutations
export const useCreateEmail = () => {
  const cpanelAction = useCPanelAction();

  return useMutation({
    mutationFn: async ({ 
      hostingAccountId, 
      email, 
      password, 
      quota 
    }: { 
      hostingAccountId: string; 
      email: string; 
      password: string; 
      quota?: number;
    }) => {
      return cpanelAction.mutateAsync({
        action: 'createEmail',
        hostingAccountId,
        params: { email, password, quota },
      });
    },
  });
};

export const useDeleteEmail = () => {
  const cpanelAction = useCPanelAction();

  return useMutation({
    mutationFn: async ({ 
      hostingAccountId, 
      email 
    }: { 
      hostingAccountId: string; 
      email: string;
    }) => {
      return cpanelAction.mutateAsync({
        action: 'deleteEmail',
        hostingAccountId,
        params: { email },
      });
    },
  });
};

// Database mutations
export const useCreateDatabase = () => {
  const cpanelAction = useCPanelAction();

  return useMutation({
    mutationFn: async ({ 
      hostingAccountId, 
      name 
    }: { 
      hostingAccountId: string; 
      name: string;
    }) => {
      return cpanelAction.mutateAsync({
        action: 'createDatabase',
        hostingAccountId,
        params: { name },
      });
    },
  });
};

export const useDeleteDatabase = () => {
  const cpanelAction = useCPanelAction();

  return useMutation({
    mutationFn: async ({ 
      hostingAccountId, 
      name 
    }: { 
      hostingAccountId: string; 
      name: string;
    }) => {
      return cpanelAction.mutateAsync({
        action: 'deleteDatabase',
        hostingAccountId,
        params: { name },
      });
    },
  });
};
