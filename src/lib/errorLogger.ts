/**
 * Centralized Error Logging Service
 * Handles frontend error logging with async, non-blocking behavior
 */

import { supabase } from '@/integrations/supabase/client';

export interface ErrorLogData {
  errorCode: string;
  message: string;
  stackTrace?: string;
  context?: Record<string, unknown>;
  url?: string;
  source?: 'frontend' | 'backend' | 'edge';
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

// Generate session ID for error correlation
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('error_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('error_session_id', sessionId);
  }
  return sessionId;
};

// Log error asynchronously - never blocks UI
export const logError = async (data: ErrorLogData): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data: result, error } = await supabase.rpc('log_error', {
      p_error_code: data.errorCode,
      p_message: data.message.substring(0, 1000), // Limit message length
      p_stack_trace: data.stackTrace?.substring(0, 5000) || null,
      p_context: JSON.parse(JSON.stringify(data.context || {})),
      p_user_id: userData?.user?.id || null,
      p_session_id: getSessionId(),
      p_url: data.url || (typeof window !== 'undefined' ? window.location.href : null),
      p_source: data.source || 'frontend',
      p_severity: data.severity || 'error',
    });

    if (error) {
      console.error('[ErrorLogger] Failed to log error:', error);
      return null;
    }

    return result as string;
  } catch (e) {
    // Silent fail - logging should never crash the app
    console.error('[ErrorLogger] Exception:', e);
    return null;
  }
};

// Generate user-friendly error ID for support reference
export const generateErrorId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ERR-${timestamp}-${random}`;
};

// Categorize error for better tracking
export const categorizeError = (error: Error): string => {
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || message.includes('cors')) {
    return 'NETWORK_ERROR';
  }
  if (message.includes('timeout') || message.includes('timed out')) {
    return 'TIMEOUT_ERROR';
  }
  if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'AUTH_ERROR';
  }
  if (message.includes('permission') || message.includes('access denied')) {
    return 'PERMISSION_ERROR';
  }
  if (name.includes('syntax') || name.includes('reference') || name.includes('type')) {
    return 'CODE_ERROR';
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return 'VALIDATION_ERROR';
  }
  
  return 'RUNTIME_ERROR';
};

// Global error handler for uncaught errors
export const setupGlobalErrorHandlers = (): void => {
  if (typeof window === 'undefined') return;

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    logError({
      errorCode: 'UNCAUGHT_ERROR',
      message: event.message || 'Unknown error',
      stackTrace: event.error?.stack,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      severity: 'critical',
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    logError({
      errorCode: 'UNHANDLED_REJECTION',
      message: reason?.message || String(reason) || 'Unhandled promise rejection',
      stackTrace: reason?.stack,
      context: {
        type: typeof reason,
      },
      severity: 'error',
    });
  });
};

export default {
  logError,
  generateErrorId,
  categorizeError,
  setupGlobalErrorHandlers,
};
