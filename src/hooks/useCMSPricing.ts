import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CMSPricingPlan = Tables<'cms_pricing_display'>;
export type CMSPricingPlanInsert = TablesInsert<'cms_pricing_display'>;

export const useCMSPricing = (category?: string) => {
  return useQuery({
    queryKey: ['cms-pricing', category],
    queryFn: async () => {
      let query = supabase
        .from('cms_pricing_display')
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

export const useCreateCMSPricing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (plan: CMSPricingPlanInsert) => {
      const { data, error } = await supabase
        .from('cms_pricing_display')
        .insert(plan)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pricing'] });
      toast.success('প্রাইসিং প্ল্যান যোগ হয়েছে');
    },
    onError: (error) => {
      toast.error('প্রাইসিং প্ল্যান যোগ করতে সমস্যা হয়েছে');
      console.error('Create pricing error:', error);
    },
  });
};

export const useUpdateCMSPricing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CMSPricingPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_pricing_display')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pricing'] });
      toast.success('প্রাইসিং প্ল্যান আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('প্রাইসিং প্ল্যান আপডেট করতে সমস্যা হয়েছে');
      console.error('Update pricing error:', error);
    },
  });
};

export const useDeleteCMSPricing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_pricing_display')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-pricing'] });
      toast.success('প্রাইসিং প্ল্যান মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('প্রাইসিং প্ল্যান মুছতে সমস্যা হয়েছে');
      console.error('Delete pricing error:', error);
    },
  });
};
