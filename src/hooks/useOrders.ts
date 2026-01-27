import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Order = Tables<'orders'>;
export type OrderInsert = TablesInsert<'orders'>;

// ═══════════════════════════════════════════════════════════════
// OPTIMIZED CACHE CONFIGURATION
// Orders change frequently but we still cache to prevent re-fetches
// ═══════════════════════════════════════════════════════════════
const QUERY_CONFIG = {
  staleTime: 60 * 1000, // Data considered fresh for 1 minute
  gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false as const, // Use cached data if available
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
};

export const useOrders = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
    ...QUERY_CONFIG,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (order: Omit<OrderInsert, 'user_id' | 'order_number'>) => {
      // Generate order number
      const orderNumber = `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...order,
          user_id: user!.id,
          order_number: orderNumber,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
