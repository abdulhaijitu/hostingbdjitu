import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Database {
  name: string;
  size: string;
  tables?: number;
}

interface DatabaseUser {
  username: string;
  databases: string[];
}

// Cache config for cPanel API calls
const CPANEL_QUERY_CONFIG = {
  staleTime: 60 * 1000, // Data is fresh for 60 seconds
  gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  refetchOnWindowFocus: false,
  retry: 1, // cPanel can be slow, limit retries
};

export const useCPanelDatabases = (accountId: string | undefined) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['cpanel_databases', accountId],
    queryFn: async () => {
      if (!accountId) return { databases: [], users: [] };

      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: { action: 'listDatabases', accountId }
      });

      if (error) throw error;
      return data as { databases: Database[]; users: DatabaseUser[] };
    },
    enabled: !!accountId,
    ...CPANEL_QUERY_CONFIG,
  });
};

export const useCreateDatabase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ accountId, name }: { accountId: string; name: string }) => {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: { action: 'createDatabase', accountId, name }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cpanel_databases', variables.accountId] });
      toast({
        title: 'ডাটাবেস তৈরি হয়েছে',
        description: 'নতুন MySQL ডাটাবেস সফলভাবে তৈরি হয়েছে',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'ডাটাবেস তৈরি করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteDatabase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ accountId, name }: { accountId: string; name: string }) => {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: { action: 'deleteDatabase', accountId, name }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cpanel_databases', variables.accountId] });
      toast({
        title: 'ডাটাবেস ডিলিট হয়েছে',
        description: 'ডাটাবেস সফলভাবে মুছে ফেলা হয়েছে',
        variant: 'destructive',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'ডাটাবেস ডিলিট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateDatabaseUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ accountId, username, password }: { accountId: string; username: string; password: string }) => {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: { action: 'createDatabaseUser', accountId, username, password }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cpanel_databases', variables.accountId] });
      toast({
        title: 'ইউজার তৈরি হয়েছে',
        description: 'নতুন ডাটাবেস ইউজার সফলভাবে তৈরি হয়েছে',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'ইউজার তৈরি করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteDatabaseUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ accountId, username }: { accountId: string; username: string }) => {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: { action: 'deleteDatabaseUser', accountId, username }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cpanel_databases', variables.accountId] });
      toast({
        title: 'ইউজার ডিলিট হয়েছে',
        description: 'ডাটাবেস ইউজার মুছে ফেলা হয়েছে',
        variant: 'destructive',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'ইউজার ডিলিট করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    },
  });
};

export const useAssignUserToDatabase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ accountId, username, database }: { accountId: string; username: string; database: string }) => {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: { action: 'assignUserToDatabase', accountId, username, database }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cpanel_databases', variables.accountId] });
      toast({
        title: 'ইউজার অ্যাসাইন হয়েছে',
        description: 'ইউজারকে ডাটাবেসে অ্যাক্সেস দেওয়া হয়েছে',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message || 'ইউজার অ্যাসাইন করতে সমস্যা হয়েছে',
        variant: 'destructive',
      });
    },
  });
};
