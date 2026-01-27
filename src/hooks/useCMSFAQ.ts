import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CMSFAQ = Tables<'cms_faqs'>;
export type CMSFAQInsert = TablesInsert<'cms_faqs'>;

export const useCMSFAQs = (category?: string) => {
  return useQuery({
    queryKey: ['cms-faqs', category],
    queryFn: async () => {
      let query = supabase
        .from('cms_faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCMSFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (faq: CMSFAQInsert) => {
      const { data, error } = await supabase
        .from('cms_faqs')
        .insert(faq)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-faqs'] });
      toast.success('FAQ যোগ হয়েছে');
    },
    onError: (error) => {
      toast.error('FAQ যোগ করতে সমস্যা হয়েছে');
      console.error('Create FAQ error:', error);
    },
  });
};

export const useUpdateCMSFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CMSFAQ> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_faqs')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-faqs'] });
      toast.success('FAQ আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('FAQ আপডেট করতে সমস্যা হয়েছে');
      console.error('Update FAQ error:', error);
    },
  });
};

export const useDeleteCMSFAQ = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-faqs'] });
      toast.success('FAQ মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('FAQ মুছতে সমস্যা হয়েছে');
      console.error('Delete FAQ error:', error);
    },
  });
};
