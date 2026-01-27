import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CMSSetting = Tables<'cms_global_settings'>;
export type CMSSettingInsert = TablesInsert<'cms_global_settings'>;

export const useCMSSettings = (category?: string) => {
  return useQuery({
    queryKey: ['cms-settings', category],
    queryFn: async () => {
      let query = supabase
        .from('cms_global_settings')
        .select('*')
        .order('category', { ascending: true });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateCMSSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, setting_value }: { id: string; setting_value: string }) => {
      const { data, error } = await supabase
        .from('cms_global_settings')
        .update({ setting_value, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-settings'] });
      toast.success('সেটিং আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('সেটিং আপডেট করতে সমস্যা হয়েছে');
      console.error('Update setting error:', error);
    },
  });
};

export const useCreateCMSSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (setting: CMSSettingInsert) => {
      const { data, error } = await supabase
        .from('cms_global_settings')
        .insert(setting)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-settings'] });
      toast.success('নতুন সেটিং যোগ হয়েছে');
    },
    onError: (error) => {
      toast.error('সেটিং যোগ করতে সমস্যা হয়েছে');
      console.error('Create setting error:', error);
    },
  });
};

export const useDeleteCMSSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_global_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-settings'] });
      toast.success('সেটিং মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('সেটিং মুছতে সমস্যা হয়েছে');
      console.error('Delete setting error:', error);
    },
  });
};
