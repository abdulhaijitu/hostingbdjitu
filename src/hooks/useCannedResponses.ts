import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CannedResponse {
  id: string;
  title: string;
  title_bn: string | null;
  content: string;
  content_bn: string | null;
  category: string;
  shortcut: string | null;
  sort_order: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CannedResponseInput {
  title: string;
  title_bn?: string | null;
  content: string;
  content_bn?: string | null;
  category: string;
  shortcut?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export function useCannedResponses() {
  return useQuery({
    queryKey: ['canned-responses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canned_responses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as CannedResponse[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

export function useAllCannedResponses() {
  return useQuery({
    queryKey: ['canned-responses', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('canned_responses')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as CannedResponse[];
    },
    staleTime: 60 * 1000, // 1 minute cache for admin
  });
}

export function useCreateCannedResponse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CannedResponseInput) => {
      const { data, error } = await supabase
        .from('canned_responses')
        .insert([input])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canned-responses'] });
      toast({
        title: 'সফল',
        description: 'ক্যানড রেসপন্স তৈরি হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateCannedResponse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CannedResponse> & { id: string }) => {
      const { data, error } = await supabase
        .from('canned_responses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canned-responses'] });
      toast({
        title: 'সফল',
        description: 'ক্যানড রেসপন্স আপডেট হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteCannedResponse() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('canned_responses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canned-responses'] });
      toast({
        title: 'সফল',
        description: 'ক্যানড রেসপন্স মুছে ফেলা হয়েছে',
      });
    },
    onError: (error) => {
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
