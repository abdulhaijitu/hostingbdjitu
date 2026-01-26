import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type DomainPrice = Tables<'domain_pricing'>;
export type DomainPriceInsert = TablesInsert<'domain_pricing'>;
export type DomainPriceUpdate = TablesUpdate<'domain_pricing'>;

export const useDomainPricing = (activeOnly = false) => {
  return useQuery({
    queryKey: ['domain_pricing', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('domain_pricing')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as DomainPrice[];
    },
  });
};

export const useCreateDomainPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (price: DomainPriceInsert) => {
      const { data, error } = await supabase
        .from('domain_pricing')
        .insert(price)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain_pricing'] });
    },
  });
};

export const useUpdateDomainPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: DomainPriceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('domain_pricing')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain_pricing'] });
    },
  });
};

export const useDeleteDomainPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('domain_pricing')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domain_pricing'] });
    },
  });
};
