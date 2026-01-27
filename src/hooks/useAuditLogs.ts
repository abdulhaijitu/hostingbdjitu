import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_role: string;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Joined fields
  actor_email?: string;
  actor_name?: string;
}

export interface AuditLogFilters {
  actionType?: string;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

interface UseAuditLogsOptions {
  page?: number;
  pageSize?: number;
  filters?: AuditLogFilters;
}

export const useAuditLogs = (options: UseAuditLogsOptions = {}) => {
  const { page = 1, pageSize = 25, filters = {} } = options;

  return useQuery({
    queryKey: ['audit-logs', page, pageSize, filters],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select(`
          id,
          actor_id,
          actor_role,
          action_type,
          target_type,
          target_id,
          metadata,
          ip_address,
          user_agent,
          created_at
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Apply filters
      if (filters.actionType) {
        query = query.eq('action_type', filters.actionType);
      }
      if (filters.actorId) {
        query = query.eq('actor_id', filters.actorId);
      }
      if (filters.targetType) {
        query = query.eq('target_type', filters.targetType);
      }
      if (filters.targetId) {
        query = query.ilike('target_id', `%${filters.targetId}%`);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo.toISOString());
      }
      if (filters.search) {
        query = query.or(`target_id.ilike.%${filters.search}%,action_type.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Fetch actor profiles for display names
      const actorIds = [...new Set((data || []).map(log => log.actor_id).filter(Boolean))];
      let actorProfiles: Record<string, { email: string; full_name: string | null }> = {};
      
      if (actorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, email, full_name')
          .in('user_id', actorIds);
        
        if (profiles) {
          actorProfiles = profiles.reduce((acc, p) => {
            acc[p.user_id] = { email: p.email, full_name: p.full_name };
            return acc;
          }, {} as Record<string, { email: string; full_name: string | null }>);
        }
      }

      // Enrich logs with actor info
      const enrichedLogs: AuditLog[] = (data || []).map(log => ({
        ...log,
        metadata: (log.metadata || {}) as Record<string, unknown>,
        actor_email: log.actor_id ? actorProfiles[log.actor_id]?.email : undefined,
        actor_name: log.actor_id ? actorProfiles[log.actor_id]?.full_name || undefined : undefined,
      }));

      return {
        logs: enrichedLogs,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get available action types for filter dropdown
export const useAuditActionTypes = () => {
  return useQuery({
    queryKey: ['audit-action-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('action_type')
        .limit(1000);

      if (error) throw error;

      const uniqueTypes = [...new Set((data || []).map(d => d.action_type))].sort();
      return uniqueTypes;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useAuditLogs;
