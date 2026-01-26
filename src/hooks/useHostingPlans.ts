import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type HostingPlan = Tables<'hosting_plans'>;
export type HostingPlanInsert = TablesInsert<'hosting_plans'>;
export type HostingPlanUpdate = TablesUpdate<'hosting_plans'>;

export const useHostingPlans = (activeOnly = false) => {
  return useQuery({
    queryKey: ['hosting_plans', activeOnly],
    queryFn: async () => {
      let query = supabase
        .from('hosting_plans')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (activeOnly) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as HostingPlan[];
    },
  });
};

export const useCreateHostingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: HostingPlanInsert) => {
      const { data, error } = await supabase
        .from('hosting_plans')
        .insert(plan)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting_plans'] });
    },
  });
};

export const useUpdateHostingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: HostingPlanUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('hosting_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting_plans'] });
    },
  });
};

export const useDeleteHostingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hosting_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hosting_plans'] });
    },
  });
};
