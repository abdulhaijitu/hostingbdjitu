import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export interface SupportTicket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  description: string | null;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_staff_reply: boolean;
  attachments: any[];
  created_at: string;
}

export const useSupportTickets = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('support-tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_tickets',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['support-tickets', user?.id, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute - realtime handles updates
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Use cached data if available
    retry: 2,
  });
};

export const useTicketMessages = (ticketId: string | null) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Subscribe to realtime updates for messages
  useEffect(() => {
    if (!user || !ticketId) return;

    const channel = supabase
      .channel(`ticket-messages-${ticketId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ticket_messages',
          filter: `ticket_id=eq.${ticketId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['ticket-messages', ticketId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, ticketId, queryClient]);

  return useQuery({
    queryKey: ['ticket-messages', ticketId],
    queryFn: async () => {
      if (!ticketId) return [];
      
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TicketMessage[];
    },
    enabled: !!user && !!ticketId,
    staleTime: 30 * 1000, // 30 seconds - realtime handles updates
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (ticketData: {
      subject: string;
      description: string;
      priority: string;
      category: string;
    }) => {
      // Generate ticket number
      const { data: ticketNumber } = await supabase.rpc('generate_ticket_number');

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user!.id,
          ticket_number: ticketNumber,
          subject: ticketData.subject,
          description: ticketData.description,
          priority: ticketData.priority,
          category: ticketData.category,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (messageData: {
      ticket_id: string;
      message: string;
      attachments?: any[];
    }) => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: messageData.ticket_id,
          user_id: user!.id,
          message: messageData.message,
          is_staff_reply: false,
          attachments: messageData.attachments || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', variables.ticket_id] });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
      const updateData: any = { status };
      
      if (status === 'resolved') {
        updateData.resolved_at = new Date().toISOString();
      } else if (status === 'closed') {
        updateData.closed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
    },
  });
};
