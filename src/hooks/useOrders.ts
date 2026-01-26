import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Order = Tables<'orders'>;
export type OrderInsert = TablesInsert<'orders'>;

// Cache durations for optimized performance
const QUERY_CONFIG = {
  staleTime: 30 * 1000, // Data is fresh for 30 seconds
  gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  refetchOnWindowFocus: false,
  retry: 2,
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
