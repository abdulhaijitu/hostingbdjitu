import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type WHMPackageMapping = Tables<'whm_package_mappings'>;
export type WHMPackageMappingInsert = TablesInsert<'whm_package_mappings'>;
export type WHMPackageMappingUpdate = TablesUpdate<'whm_package_mappings'>;

export const useWHMPackageMappings = () => {
  return useQuery({
    queryKey: ['whm_package_mappings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('whm_package_mappings')
        .select(`
          *,
          hosting_plans:hosting_plan_id (id, name, slug, category),
          hosting_servers:server_id (id, name, hostname)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWHMPackageMapping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mapping: WHMPackageMappingInsert) => {
      const { data, error } = await supabase
        .from('whm_package_mappings')
        .insert(mapping)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whm_package_mappings'] });
    },
  });
};

export const useUpdateWHMPackageMapping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: WHMPackageMappingUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('whm_package_mappings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whm_package_mappings'] });
    },
  });
};

export const useDeleteWHMPackageMapping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('whm_package_mappings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whm_package_mappings'] });
    },
  });
};
