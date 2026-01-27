import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { auditHosting } from '@/lib/auditLogger';

export type HostingAccountWithDetails = Tables<'hosting_accounts'> & {
  hosting_servers?: { id: string; name: string; hostname: string } | null;
  orders?: { id: string; order_number: string; item_name: string } | null;
  profiles?: { user_id: string; full_name: string | null; email: string } | null;
};

// Extended type for query results
type HostingAccountQueryResult = Tables<'hosting_accounts'> & {
  hosting_servers: { id: string; name: string; hostname: string } | null;
  orders: { id: string; order_number: string; item_name: string } | null;
};

export const useAllHostingAccounts = () => {
  return useQuery({
    queryKey: ['all_hosting_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_accounts')
        .select(`
          *,
          hosting_servers:server_id (id, name, hostname),
          orders:order_id (id, order_number, item_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch profiles separately since it's a different table
      const userIds = [...new Set(data?.map(a => a.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return data?.map(account => ({
        ...account,
        profiles: profileMap.get(account.user_id) || null
      })) as HostingAccountWithDetails[];
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSuspendAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, reason }: { accountId: string; reason: string }) => {
      const { data, error } = await supabase.functions.invoke('whm-api', {
        body: { action: 'suspendAccount', accountId, reason }
      });

      if (error) throw error;
      
      // Log audit event
      auditHosting.suspend(accountId, reason);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_hosting_accounts'] });
      queryClient.invalidateQueries({ queryKey: ['hosting_accounts'] });
    },
  });
};

export const useUnsuspendAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId }: { accountId: string }) => {
      const { data, error } = await supabase.functions.invoke('whm-api', {
        body: { action: 'unsuspendAccount', accountId }
      });

      if (error) throw error;
      
      // Log audit event
      auditHosting.unsuspend(accountId);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_hosting_accounts'] });
      queryClient.invalidateQueries({ queryKey: ['hosting_accounts'] });
    },
  });
};

export const useTerminateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId }: { accountId: string }) => {
      const { data, error } = await supabase.functions.invoke('whm-api', {
        body: { action: 'terminateAccount', accountId }
      });

      if (error) throw error;
      
      // Log audit event
      auditHosting.terminate(accountId, 'Admin terminated');
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_hosting_accounts'] });
      queryClient.invalidateQueries({ queryKey: ['hosting_accounts'] });
    },
  });
};

export const useSyncAccountUsage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId }: { accountId: string }) => {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: { action: 'getUsage', accountId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all_hosting_accounts'] });
      queryClient.invalidateQueries({ queryKey: ['hosting_accounts'] });
    },
  });
};
