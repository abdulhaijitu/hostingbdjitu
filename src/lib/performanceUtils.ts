/**
 * Performance Utilities
 * Centralized performance optimization helpers
 */

import { useCallback, useRef, useMemo, useEffect, useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// TIMEOUT & FAILSAFE UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Promise with timeout - never hangs
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  fallbackValue?: T
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      if (fallbackValue !== undefined) {
        _;
      }
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Fetch with timeout wrapper
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ═══════════════════════════════════════════════════════════════
// RENDER OPTIMIZATION HOOKS
// ═══════════════════════════════════════════════════════════════

/**
 * Stable callback reference - prevents child re-renders
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    []
  );
}

/**
 * Previous value tracker for comparison
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * Debounced value - reduces re-renders
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttled callback - limits execution frequency
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    ((...args) => {
      const now = Date.now();
      
      if (now - lastRun.current >= delay) {
        lastRun.current = now;
        return callback(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          timeoutRef.current = null;
          callback(...args);
        }, delay - (now - lastRun.current));
      }
    }) as T,
    [callback, delay]
  );
}

// ═══════════════════════════════════════════════════════════════
// LOADING STATE UTILITIES
// ═══════════════════════════════════════════════════════════════

/**
 * Loading state with failsafe timeout
 */
export function useLoadingWithTimeout(
  initialLoading = false,
  timeoutMs = 8000
) {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setTimedOut(false);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setTimedOut(true);
    }, timeoutMs);
  }, [timeoutMs]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isLoading, timedOut, startLoading, stopLoading };
}

// ═══════════════════════════════════════════════════════════════
// MEMOIZATION HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Deep compare memo - for complex objects
 */
export function useDeepMemo<T>(value: T): T {
  const ref = useRef<T>(value);
  const signatureRef = useRef(JSON.stringify(value));

  const signature = JSON.stringify(value);
  if (signature !== signatureRef.current) {
    ref.current = value;
    signatureRef.current = signature;
  }

  return ref.current;
}

/**
 * Stable object reference - prevents re-renders from new object literals
 */
export function useStableObject<T extends object>(obj: T): T {
  const ref = useRef(obj);
  
  const isEqual = useMemo(() => {
    const keys = Object.keys(obj) as (keyof T)[];
    const refKeys = Object.keys(ref.current) as (keyof T)[];
    
    if (keys.length !== refKeys.length) return false;
    
    return keys.every(key => obj[key] === ref.current[key]);
  }, [obj]);

  if (!isEqual) {
    ref.current = obj;
  }

  return ref.current;
}

// ═══════════════════════════════════════════════════════════════
// REQUEST OPTIMIZATION
// ═══════════════════════════════════════════════════════════════

/**
 * Parallel request executor with individual timeouts
 */
export async function parallelRequests<T>(
  requests: (() => Promise<T>)[],
  timeoutMs = 5000
): Promise<(T | Error)[]> {
  return Promise.all(
    requests.map(async (fn) => {
      try {
        return await withTimeout(fn(), timeoutMs);
      } catch (error) {
        return error instanceof Error ? error : new Error(String(error));
      }
    })
  );
}

/**
 * Request deduplication - prevents duplicate API calls
 */
const pendingRequests = new Map<string, Promise<unknown>>();

export function deduplicatedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T> {
  const existing = pendingRequests.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fetchFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// ═══════════════════════════════════════════════════════════════
// OPTIMISTIC UI HELPERS
// ═══════════════════════════════════════════════════════════════

interface OptimisticState<T> {
  data: T;
  optimisticData: T;
  isPending: boolean;
  update: (newData: T, asyncFn: () => Promise<void>) => void;
  rollback: () => void;
}

/**
 * Optimistic update hook with automatic rollback
 */
export function useOptimisticUpdate<T>(initialData: T): OptimisticState<T> {
  const [data, setData] = useState(initialData);
  const [optimisticData, setOptimisticData] = useState(initialData);
  const [isPending, setIsPending] = useState(false);
  const previousDataRef = useRef(initialData);

  const update = useCallback(async (newData: T, asyncFn: () => Promise<void>) => {
    previousDataRef.current = data;
    setOptimisticData(newData);
    setIsPending(true);

    try {
      await asyncFn();
      setData(newData);
    } catch {
      // Rollback on error
      setOptimisticData(previousDataRef.current);
    } finally {
      setIsPending(false);
    }
  }, [data]);

  const rollback = useCallback(() => {
    setOptimisticData(previousDataRef.current);
  }, []);

  // Sync when initialData changes
  useEffect(() => {
    if (!isPending) {
      setData(initialData);
      setOptimisticData(initialData);
    }
  }, [initialData, isPending]);

  return {
    data,
    optimisticData,
    isPending,
    update,
    rollback,
  };
}

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════════

/**
 * Simple performance mark helper
 */
export function measurePerformance(name: string) {
  const startTime = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - startTime;
      if (duration > 100) {
        console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
      }
      return duration;
    },
  };
}

/**
 * Log slow operations in development
 */
export function logSlowOperation(
  operation: string,
  durationMs: number,
  threshold = 200
) {
  if (import.meta.env.DEV && durationMs > threshold) {
    console.warn(
      `[Slow Operation] ${operation}: ${durationMs.toFixed(2)}ms (threshold: ${threshold}ms)`
    );
  }
}
