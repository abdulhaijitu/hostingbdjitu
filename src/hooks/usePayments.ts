import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  transaction_id: string | null;
  invoice_id: string | null;
  amount: number;
  fee: number | null;
  currency: string;
  payment_method: string | null;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  metadata: Record<string, unknown> | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

// Cache durations for optimized performance
const QUERY_CONFIG = {
  staleTime: 30 * 1000, // Data is fresh for 30 seconds
  gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  refetchOnWindowFocus: false,
  retry: 2,
};

export const usePayments = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['payments', user?.id, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, orders(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    ...QUERY_CONFIG,
  });
};
