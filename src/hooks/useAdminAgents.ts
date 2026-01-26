import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminAgent {
  user_id: string;
  full_name: string | null;
  email: string;
  role: string;
}

export function useAdminAgents() {
  return useQuery({
    queryKey: ['admin-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_agents')
        .select('*');
      
      if (error) throw error;
      return data as AdminAgent[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, agentId }: { ticketId: string; agentId: string | null }) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ assigned_to: agentId })
        .eq('id', ticketId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast({
        title: variables.agentId ? 'এজেন্ট অ্যাসাইন হয়েছে' : 'অ্যাসাইনমেন্ট সরানো হয়েছে',
        description: variables.agentId 
          ? 'টিকেটটি এজেন্টের কাছে অ্যাসাইন করা হয়েছে'
          : 'টিকেটের অ্যাসাইনমেন্ট সরানো হয়েছে',
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
