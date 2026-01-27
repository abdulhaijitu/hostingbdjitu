import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CMSPage = Tables<'cms_pages'>;
export type CMSPageInsert = TablesInsert<'cms_pages'>;

export const useCMSPages = () => {
  return useQuery({
    queryKey: ['cms-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCMSPage = (slug: string) => {
  return useQuery({
    queryKey: ['cms-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useCreateCMSPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (page: CMSPageInsert) => {
      const { data, error } = await supabase
        .from('cms_pages')
        .insert(page)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast.success('পেজ তৈরি হয়েছে');
    },
    onError: (error) => {
      toast.error('পেজ তৈরি করতে সমস্যা হয়েছে');
      console.error('Create page error:', error);
    },
  });
};

export const useUpdateCMSPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CMSPage> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_pages')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast.success('পেজ আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('পেজ আপডেট করতে সমস্যা হয়েছে');
      console.error('Update page error:', error);
    },
  });
};

export const useDeleteCMSPage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pages'] });
      toast.success('পেজ মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('পেজ মুছতে সমস্যা হয়েছে');
      console.error('Delete page error:', error);
    },
  });
};
