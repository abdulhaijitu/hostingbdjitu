import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ErrorLog {
  id: string;
  error_code: string;
  message: string;
  stack_trace: string | null;
  context: Record<string, unknown>;
  user_id: string | null;
  session_id: string | null;
  url: string | null;
  source: string;
  severity: string;
  created_at: string;
}

export interface ErrorLogFilters {
  source?: string;
  severity?: string;
  errorCode?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

interface UseErrorLogsOptions {
  page?: number;
  pageSize?: number;
  filters?: ErrorLogFilters;
}

export const useErrorLogs = (options: UseErrorLogsOptions = {}) => {
  const { page = 1, pageSize = 25, filters = {} } = options;

  return useQuery({
    queryKey: ['error-logs', page, pageSize, filters],
    queryFn: async () => {
      let query = supabase
        .from('error_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Apply filters
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.errorCode) {
        query = query.eq('error_code', filters.errorCode);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo.toISOString());
      }
      if (filters.search) {
        query = query.or(`message.ilike.%${filters.search}%,error_code.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        logs: (data || []) as ErrorLog[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
      };
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Error statistics for dashboard
export const useErrorStats = () => {
  return useQuery({
    queryKey: ['error-stats'],
    queryFn: async () => {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('error_logs')
        .select('error_code, severity, created_at')
        .gte('created_at', twentyFourHoursAgo);

      if (error) throw error;

      const logs = data || [];
      
      // Count by severity
      const bySeverity = logs.reduce((acc, log) => {
        acc[log.severity] = (acc[log.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Count by error code
      const byCode = logs.reduce((acc, log) => {
        acc[log.error_code] = (acc[log.error_code] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Top 5 error codes
      const topErrors = Object.entries(byCode)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => ({ code, count }));

      return {
        total24h: logs.length,
        bySeverity,
        topErrors,
        criticalCount: bySeverity['critical'] || 0,
        errorCount: bySeverity['error'] || 0,
      };
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
};

export default useErrorLogs;
