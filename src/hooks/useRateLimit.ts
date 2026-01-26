import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RateLimitStatus {
  isLocked: boolean;
  attemptsRemaining: number;
  lockedUntil: Date | null;
  message: string;
}

interface UseRateLimitReturn {
  checkRateLimit: (identifier: string) => Promise<RateLimitStatus>;
  recordFailure: (identifier: string) => Promise<RateLimitStatus>;
  recordSuccess: (identifier: string) => Promise<void>;
  rateLimitStatus: RateLimitStatus | null;
  isChecking: boolean;
}

const DEFAULT_STATUS: RateLimitStatus = {
  isLocked: false,
  attemptsRemaining: 5,
  lockedUntil: null,
  message: 'OK',
};

export function useRateLimit(): UseRateLimitReturn {
  const [rateLimitStatus, setRateLimitStatus] = useState<RateLimitStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const callRateLimitFunction = useCallback(async (
    identifier: string,
    action: 'check' | 'record_failure' | 'record_success'
  ): Promise<RateLimitStatus> => {
    try {
      const { data, error } = await supabase.functions.invoke('check-rate-limit', {
        body: { identifier, action },
      });

      if (error) {
        // On error, fail open (allow the attempt)
        return DEFAULT_STATUS;
      }

      const status: RateLimitStatus = {
        isLocked: data.isLocked || false,
        attemptsRemaining: data.attemptsRemaining ?? 5,
        lockedUntil: data.lockedUntil ? new Date(data.lockedUntil) : null,
        message: data.message || 'OK',
      };

      return status;
    } catch {
      // On any error, fail open
      return DEFAULT_STATUS;
    }
  }, []);

  const checkRateLimit = useCallback(async (identifier: string): Promise<RateLimitStatus> => {
    setIsChecking(true);
    try {
      const status = await callRateLimitFunction(identifier, 'check');
      setRateLimitStatus(status);
      return status;
    } finally {
      setIsChecking(false);
    }
  }, [callRateLimitFunction]);

  const recordFailure = useCallback(async (identifier: string): Promise<RateLimitStatus> => {
    const status = await callRateLimitFunction(identifier, 'record_failure');
    setRateLimitStatus(status);
    return status;
  }, [callRateLimitFunction]);

  const recordSuccess = useCallback(async (identifier: string): Promise<void> => {
    await callRateLimitFunction(identifier, 'record_success');
    setRateLimitStatus(DEFAULT_STATUS);
  }, [callRateLimitFunction]);

  return {
    checkRateLimit,
    recordFailure,
    recordSuccess,
    rateLimitStatus,
    isChecking,
  };
}