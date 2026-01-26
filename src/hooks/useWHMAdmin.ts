import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProvisioningQueueItem {
  id: string;
  order_id: string;
  server_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'retry';
  attempts: number;
  max_attempts: number;
  last_error: string | null;
  scheduled_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  orders?: any;
  hosting_servers?: any;
}

// Admin: Fetch all servers
export const useHostingServers = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['hosting-servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_servers')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Admin: Fetch provisioning queue
export const useProvisioningQueue = () => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['provisioning-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provisioning_queue')
        .select('*, orders(*), hosting_servers(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProvisioningQueueItem[];
    },
    enabled: isAdmin,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Admin: WHM API hook
export const useWHMAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      action, 
      serverId, 
      params 
    }: { 
      action: string; 
      serverId: string; 
      params?: Record<string, any>;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whm-api`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ action, serverId, params }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'WHM API request failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting-servers'] });
      queryClient.invalidateQueries({ queryKey: ['hosting-accounts'] });
    },
  });
};

// Admin: Provision hosting
export const useProvisionHosting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/provision-hosting`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Provisioning failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['hosting-accounts'] });
      queryClient.invalidateQueries({ queryKey: ['provisioning-queue'] });
    },
  });
};

// Admin: Suspend hosting account
export const useSuspendAccount = () => {
  const whmAction = useWHMAction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      accountId, 
      serverId, 
      username, 
      reason 
    }: { 
      accountId: string;
      serverId: string; 
      username: string; 
      reason?: string;
    }) => {
      // Call WHM API
      await whmAction.mutateAsync({
        action: 'suspendAccount',
        serverId,
        params: { user: username, reason },
      });

      // Update local database
      const { error } = await supabase
        .from('hosting_accounts')
        .update({
          status: 'suspended',
          suspended_at: new Date().toISOString(),
          suspension_reason: reason,
        })
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting-accounts'] });
    },
  });
};

// Admin: Unsuspend hosting account
export const useUnsuspendAccount = () => {
  const whmAction = useWHMAction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      accountId, 
      serverId, 
      username 
    }: { 
      accountId: string;
      serverId: string; 
      username: string;
    }) => {
      // Call WHM API
      await whmAction.mutateAsync({
        action: 'unsuspendAccount',
        serverId,
        params: { user: username },
      });

      // Update local database
      const { error } = await supabase
        .from('hosting_accounts')
        .update({
          status: 'active',
          suspended_at: null,
          suspension_reason: null,
        })
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting-accounts'] });
    },
  });
};

// Admin: Terminate hosting account
export const useTerminateAccount = () => {
  const whmAction = useWHMAction();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      accountId, 
      serverId, 
      username 
    }: { 
      accountId: string;
      serverId: string; 
      username: string;
    }) => {
      // Call WHM API
      await whmAction.mutateAsync({
        action: 'terminateAccount',
        serverId,
        params: { user: username },
      });

      // Update local database
      const { error } = await supabase
        .from('hosting_accounts')
        .update({ status: 'terminated' })
        .eq('id', accountId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting-accounts'] });
    },
  });
};

// Admin: Create server
export const useCreateServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serverData: {
      name: string;
      server_type: 'shared' | 'vps' | 'dedicated';
      hostname: string;
      ip_address?: string;
      api_type: 'whm' | 'cpanel';
      location?: string;
      max_accounts?: number;
    }) => {
      const { data, error } = await supabase
        .from('hosting_servers')
        .insert(serverData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting-servers'] });
    },
  });
};

// Admin: Update server
export const useUpdateServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      ...updates 
    }: { 
      id: string;
      [key: string]: any;
    }) => {
      const { data, error } = await supabase
        .from('hosting_servers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting-servers'] });
    },
  });
};

// Admin: Delete server
export const useDeleteServer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hosting_servers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting-servers'] });
    },
  });
};
