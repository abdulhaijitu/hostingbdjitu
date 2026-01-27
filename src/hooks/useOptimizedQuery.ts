/**
 * Optimized Query Hook
 * Enhanced React Query wrapper with:
 * - Configurable cache times per data type
 * - Background revalidation
 * - Optimistic updates
 * - Deduplication
 */

import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════
// CACHE CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const CACHE_TIMES = {
  // Static/rarely changing data - cache longer
  hostingPlans: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  domainPricing: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  servers: { staleTime: 2 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  
  // User-specific data - moderate cache
  profile: { staleTime: 2 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  hostingAccounts: { staleTime: 60 * 1000, gcTime: 5 * 60 * 1000 },
  
  // Frequently changing data - shorter cache
  orders: { staleTime: 30 * 1000, gcTime: 5 * 60 * 1000 },
  payments: { staleTime: 30 * 1000, gcTime: 5 * 60 * 1000 },
  invoices: { staleTime: 30 * 1000, gcTime: 5 * 60 * 1000 },
  tickets: { staleTime: 15 * 1000, gcTime: 2 * 60 * 1000 },
  
  // Real-time data - minimal cache
  analytics: { staleTime: 10 * 1000, gcTime: 60 * 1000 },
  provisioning: { staleTime: 5 * 1000, gcTime: 30 * 1000 },
} as const;

type CacheKey = keyof typeof CACHE_TIMES;

// ═══════════════════════════════════════════════════════════════
// OPTIMIZED QUERY HOOK
// ═══════════════════════════════════════════════════════════════

interface UseOptimizedQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  cacheType?: CacheKey;
  enabled?: boolean;
  refetchOnMount?: boolean | 'always';
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  select?: (data: T) => T;
}

export function useOptimizedQuery<T>({
  queryKey,
  queryFn,
  cacheType,
  enabled = true,
  refetchOnMount = false,
  onSuccess,
  onError,
  select,
}: UseOptimizedQueryOptions<T>) {
  const cacheConfig = cacheType ? CACHE_TIMES[cacheType] : { staleTime: 30000, gcTime: 300000 };

  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    staleTime: cacheConfig.staleTime,
    gcTime: cacheConfig.gcTime,
    refetchOnMount,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    select,
  });

  // Handle success/error callbacks manually since they're deprecated in v5
  useMemo(() => {
    if (query.isSuccess && query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  useMemo(() => {
    if (query.isError && query.error && onError) {
      onError(query.error as Error);
    }
  }, [query.isError, query.error, onError]);

  return query;
}

// ═══════════════════════════════════════════════════════════════
// OPTIMISTIC MUTATION HOOK
// ═══════════════════════════════════════════════════════════════

interface UseOptimisticMutationOptions<TData, TVariables, TContext = unknown> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: QueryKey;
  optimisticUpdate?: (variables: TVariables, currentData: TData | undefined) => TData;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables, context: TContext | undefined) => void;
}

export function useOptimisticMutation<TData, TVariables, TContext = unknown>({
  mutationFn,
  queryKey,
  optimisticUpdate,
  onSuccess,
  onError,
}: UseOptimisticMutationOptions<TData, TVariables, TContext>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: optimisticUpdate
      ? async (variables: TVariables) => {
          // Cancel outgoing refetches
          await queryClient.cancelQueries({ queryKey });

          // Snapshot previous value
          const previousData = queryClient.getQueryData<TData>(queryKey);

          // Optimistically update
          queryClient.setQueryData<TData>(queryKey, (old) =>
            optimisticUpdate(variables, old)
          );

          return { previousData } as TContext;
        }
      : undefined,
    onError: (error: Error, variables: TVariables, context: TContext | undefined) => {
      // Rollback on error
      if (context && typeof context === 'object' && 'previousData' in context) {
        queryClient.setQueryData(queryKey, (context as { previousData: TData }).previousData);
      }
      onError?.(error, variables, context);
    },
    onSuccess: (data: TData, variables: TVariables) => {
      onSuccess?.(data, variables);
    },
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// ═══════════════════════════════════════════════════════════════
// PREFETCH HELPER
// ═══════════════════════════════════════════════════════════════

export function usePrefetch<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  cacheType?: CacheKey
) {
  const queryClient = useQueryClient();
  const cacheConfig = cacheType ? CACHE_TIMES[cacheType] : { staleTime: 30000, gcTime: 300000 };

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: cacheConfig.staleTime,
    });
  }, [queryClient, queryKey, queryFn, cacheConfig.staleTime]);

  return prefetch;
}

// ═══════════════════════════════════════════════════════════════
// INVALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════

export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  const invalidate = useCallback(
    (queryKey: QueryKey) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  const invalidateMultiple = useCallback(
    (queryKeys: QueryKey[]) => {
      queryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    [queryClient]
  );

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return { invalidate, invalidateMultiple, invalidateAll };
}
