import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const useContactMessages = () => {
  return useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactMessage[];
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
    onError: (error) => {
      toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
      console.error('Mark as read error:', error);
    },
  });
};

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast.success('মেসেজ মুছে ফেলা হয়েছে');
    },
    onError: (error) => {
      toast.error('মেসেজ মুছতে সমস্যা হয়েছে');
      console.error('Delete message error:', error);
    },
  });
};

// Submit contact form (public)
export const useSubmitContactMessage = () => {
  return useMutation({
    mutationFn: async (message: { name: string; email: string; subject?: string; message: string }) => {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(message)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('আপনার মেসেজ পাঠানো হয়েছে');
    },
    onError: (error) => {
      toast.error('মেসেজ পাঠাতে সমস্যা হয়েছে');
      console.error('Submit message error:', error);
    },
  });
};
