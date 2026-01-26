import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDataFetchOptions<T> {
  fetchFn: () => Promise<T>;
  enabled?: boolean;
  timeout?: number; // Default 8000ms
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseDataFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isEmpty: boolean;
  isTimeout: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook for data fetching with:
 * - Proper loading states (never infinite)
 * - 8-second failsafe timeout
 * - Error handling with retry
 * - Empty state detection
 */
export function useDataFetch<T>({
  fetchFn,
  enabled = true,
  timeout = 8000,
  onSuccess,
  onError,
}: UseDataFetchOptions<T>): UseDataFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const clearTimeoutRef = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Reset states
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setIsTimeout(false);

    // Set failsafe timeout
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setIsLoading(false);
        setIsError(true);
        setIsTimeout(true);
        setError(new Error('Request timed out. Please try again.'));
      }
    }, timeout);

    try {
      const result = await fetchFn();
      
      clearTimeoutRef();
      
      if (mountedRef.current) {
        setData(result);
        setIsError(false);
        setError(null);
        onSuccess?.(result);
      }
    } catch (err) {
      clearTimeoutRef();
      
      if (mountedRef.current) {
        const errorObj = err instanceof Error ? err : new Error('Failed to fetch data');
        setError(errorObj);
        setIsError(true);
        onError?.(errorObj);
      }
    } finally {
      clearTimeoutRef();
      
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enabled, fetchFn, timeout, onSuccess, onError]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (enabled) {
      fetchData();
    }

    return () => {
      mountedRef.current = false;
      clearTimeoutRef();
    };
  }, [enabled]); // Only re-run when enabled changes

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Determine if data is empty
  const isEmpty = !isLoading && !isError && (
    data === null || 
    data === undefined || 
    (Array.isArray(data) && data.length === 0) ||
    (typeof data === 'object' && Object.keys(data as object).length === 0)
  );

  return {
    data,
    isLoading,
    isError,
    error,
    isEmpty,
    isTimeout,
    refetch,
  };
}

/**
 * Simple loading state hook for manual control
 */
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setErrorState = useCallback((err: Error | string) => {
    setIsLoading(false);
    setIsError(true);
    setError(typeof err === 'string' ? new Error(err) : err);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
  }, []);

  return {
    isLoading,
    isError,
    error,
    startLoading,
    stopLoading,
    setError: setErrorState,
    reset,
  };
}
