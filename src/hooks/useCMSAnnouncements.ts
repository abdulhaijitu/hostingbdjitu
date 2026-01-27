import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CMSAnnouncement = Tables<'cms_announcements'>;
export type CMSAnnouncementInsert = TablesInsert<'cms_announcements'>;

export const useCMSAnnouncements = () => {
  return useQuery({
    queryKey: ['cms-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_announcements')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as CMSAnnouncement[];
    },
  });
};

export const useActiveAnnouncements = () => {
  return useQuery({
    queryKey: ['cms-announcements-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cms_announcements')
        .select('*')
        .eq('is_active', true)
        .or('end_date.is.null,end_date.gt.now()')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as CMSAnnouncement[];
    },
  });
};

export const useCreateCMSAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (announcement: CMSAnnouncementInsert) => {
      const { data, error } = await supabase
        .from('cms_announcements')
        .insert(announcement)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-announcements'] });
      toast.success('অ্যানাউন্সমেন্ট যোগ হয়েছে');
    },
    onError: (error) => {
      toast.error('অ্যানাউন্সমেন্ট যোগ করতে সমস্যা হয়েছে');
      console.error('Create announcement error:', error);
    },
  });
};

export const useUpdateCMSAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CMSAnnouncement> & { id: string }) => {
      const { data, error } = await supabase
        .from('cms_announcements')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-announcements'] });
      toast.success('অ্যানাউন্সমেন্ট আপডেট হয়েছে');
    },
    onError: (error) => {
      toast.error('অ্যানাউন্সমেন্ট আপডেট করতে সমস্যা হয়েছে');
      console.error('Update announcement error:', error);
    },
  });
};

export const useDeleteCMSAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cms_announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cms-announcements'] });
      toast.success('অ্যানাউন্সমেন্ট মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('অ্যানাউন্সমেন্ট মুছতে সমস্যা হয়েছে');
      console.error('Delete announcement error:', error);
    },
  });
};
