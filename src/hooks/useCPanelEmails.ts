import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmailAccount {
  email: string;
  domain: string;
  user: string;
  diskquota: string;
  diskused: string;
  diskusedpercent: number;
  humandiskquota: string;
  humandiskused: string;
}

interface CreateEmailParams {
  accountId: string;
  email: string;
  password: string;
  quota?: number;
}

interface DeleteEmailParams {
  accountId: string;
  email: string;
}

interface ChangePasswordParams {
  accountId: string;
  email: string;
  password: string;
}

// Fetch email accounts from cPanel
export const useCPanelEmails = (accountId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['cpanel-emails', accountId],
    queryFn: async () => {
      if (!accountId) return [];

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
          body: JSON.stringify({
            action: 'listEmails',
            accountId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch emails');
      }

      const result = await response.json();
      return result.data as EmailAccount[];
    },
    enabled: !!accountId && !!user,
  });
};

// Create new email account
export const useCreateEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, email, password, quota = 1024 }: CreateEmailParams) => {
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
          body: JSON.stringify({
            action: 'createEmail',
            accountId,
            params: { email, password, quota },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create email');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cpanel-emails', variables.accountId] });
    },
  });
};

// Delete email account
export const useDeleteEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, email }: DeleteEmailParams) => {
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
          body: JSON.stringify({
            action: 'deleteEmail',
            accountId,
            params: { email },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete email');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cpanel-emails', variables.accountId] });
    },
  });
};

// Change email password
export const useChangeEmailPassword = () => {
  return useMutation({
    mutationFn: async ({ accountId, email, password }: ChangePasswordParams) => {
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
          body: JSON.stringify({
            action: 'changeEmailPassword',
            accountId,
            params: { email, password },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to change password');
      }

      return response.json();
    },
  });
};
