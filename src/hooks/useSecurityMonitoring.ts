import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SecurityEvent {
  id: string;
  event_type: string;
  severity: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown>;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export interface AdminActionLog {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  requires_reauth: boolean;
  reauth_verified: boolean;
  ip_address: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown>;
  cooldown_until: string | null;
  created_at: string;
}

const QUERY_CONFIG = {
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 2,
};

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY EVENTS HOOK
// ═══════════════════════════════════════════════════════════════════════════
export const useSecurityEvents = (filters?: {
  eventType?: string;
  severity?: string;
  resolved?: boolean;
  limit?: number;
}) => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['security-events', filters],
    queryFn: async () => {
      let query = supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.eventType) {
        query = query.eq('event_type', filters.eventType);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SecurityEvent[];
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN ACTION LOGS HOOK
// ═══════════════════════════════════════════════════════════════════════════
export const useAdminActionLogs = (filters?: {
  actionType?: string;
  adminUserId?: string;
  limit?: number;
}) => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['admin-action-logs', filters],
    queryFn: async () => {
      let query = supabase
        .from('admin_action_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.actionType) {
        query = query.eq('action_type', filters.actionType);
      }
      if (filters?.adminUserId) {
        query = query.eq('admin_user_id', filters.adminUserId);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      } else {
        query = query.limit(100);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AdminActionLog[];
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// RESOLVE SECURITY EVENT
// ═══════════════════════════════════════════════════════════════════════════
export const useResolveSecurityEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('security_events')
        .update({ 
          resolved: true, 
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id 
        })
        .eq('id', eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security-events'] });
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY SUMMARY STATS
// ═══════════════════════════════════════════════════════════════════════════
export const useSecuritySummary = () => {
  const { user, isAdmin } = useAuth();

  return useQuery({
    queryKey: ['security-summary'],
    queryFn: async () => {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Get events from last 24 hours
      const { data: recentEvents, error: eventsError } = await supabase
        .from('security_events')
        .select('event_type, severity')
        .gte('created_at', last24Hours);

      if (eventsError) throw eventsError;

      // Get unresolved critical events
      const { data: unresolvedCritical, error: criticalError } = await supabase
        .from('security_events')
        .select('id')
        .eq('resolved', false)
        .in('severity', ['error', 'critical']);

      if (criticalError) throw criticalError;

      // Get failed login attempts
      const { data: loginAttempts, error: loginError } = await supabase
        .from('login_attempts')
        .select('attempts_count')
        .gte('last_attempt_at', last24Hours);

      if (loginError) throw loginError;

      // Get rate limit hits
      const rateLimitHits = recentEvents?.filter(e => e.event_type === 'rate_limit_hit').length || 0;
      const failedLogins = recentEvents?.filter(e => e.event_type === 'login_failed').length || 0;
      const suspiciousActivity = recentEvents?.filter(e => e.event_type === 'suspicious_activity').length || 0;
      const permissionDenials = recentEvents?.filter(e => e.event_type === 'permission_denied').length || 0;

      const criticalCount = unresolvedCritical?.length || 0;
      const warningCount = recentEvents?.filter(e => e.severity === 'warn').length || 0;

      return {
        totalEvents24h: recentEvents?.length || 0,
        criticalUnresolved: criticalCount,
        warningsCount: warningCount,
        failedLogins,
        rateLimitHits,
        suspiciousActivity,
        permissionDenials,
        threatLevel: criticalCount > 5 ? 'critical' : criticalCount > 0 ? 'high' : warningCount > 10 ? 'medium' : 'low',
      };
    },
    enabled: !!user && isAdmin,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
};
