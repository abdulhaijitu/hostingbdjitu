import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CMSBlogPost = Tables<'cms_blog_posts'>;
export type CMSBlogPostInsert = TablesInsert<'cms_blog_posts'>;

export const useCMSBlogPosts = (status?: string) => {
  return useQuery({
    queryKey: ['cms-blog', status],
    queryFn: async () => {
      let query = supabase
        .from('cms_blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCMSBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['cms-blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
};

export const useCreateCMSBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: CMSBlogPostInsert) => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .insert(post)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog'] });
      toast.success('ব্লগ পোস্ট তৈরি হয়েছে');
    },
    onError: (error) => {
      toast.error('ব্লগ পোস্ট তৈরি করতে সমস্যা হয়েছে');
      console.error('Create blog post error:', error);
    },
  });
};

export const useUpdateCMSBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CMSBlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog'] });
      toast.success('ব্লগ পোস্ট আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('ব্লগ পোস্ট আপডেট করতে সমস্যা হয়েছে');
      console.error('Update blog post error:', error);
    },
  });
};

export const useDeleteCMSBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-blog'] });
      toast.success('ব্লগ পোস্ট মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('ব্লগ পোস্ট মুছতে সমস্যা হয়েছে');
      console.error('Delete blog post error:', error);
    },
  });
};
