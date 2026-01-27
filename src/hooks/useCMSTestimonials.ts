import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CMSTestimonial = Tables<'cms_testimonials'>;
export type CMSTestimonialInsert = TablesInsert<'cms_testimonials'>;

export const useCMSTestimonials = () => {
  return useQuery({
    queryKey: ['cms-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCMSTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (testimonial: CMSTestimonialInsert) => {
      const { data, error } = await supabase
        .from('cms_testimonials')
        .insert(testimonial)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-testimonials'] });
      toast.success('টেস্টিমোনিয়াল যোগ হয়েছে');
    },
    onError: (error) => {
      toast.error('টেস্টিমোনিয়াল যোগ করতে সমস্যা হয়েছে');
      console.error('Create testimonial error:', error);
    },
  });
};

export const useUpdateCMSTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CMSTestimonial> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_testimonials')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-testimonials'] });
      toast.success('টেস্টিমোনিয়াল আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('টেস্টিমোনিয়াল আপডেট করতে সমস্যা হয়েছে');
      console.error('Update testimonial error:', error);
    },
  });
};

export const useDeleteCMSTestimonial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-testimonials'] });
      toast.success('টেস্টিমোনিয়াল মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('টেস্টিমোনিয়াল মুছতে সমস্যা হয়েছে');
      console.error('Delete testimonial error:', error);
    },
  });
};
