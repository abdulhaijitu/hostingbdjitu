/**
 * API Response Utilities
 * Standardized error and success response helpers for Edge Functions
 */

// Standard error response shape
export interface StandardErrorResponse {
  success: false;
  errorCode: string;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

// Standard success response shape
export interface StandardSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
}

// Error codes
export const ErrorCodes = {
  // Auth errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  
  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  
  // Timeout
  TIMEOUT: 'TIMEOUT',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// Create standardized error response
export const createErrorResponse = (
  errorCode: ErrorCode,
  message: string,
  status: number = 500,
  context?: Record<string, unknown>,
  headers: Record<string, string> = {}
): Response => {
  const body: StandardErrorResponse = {
    success: false,
    errorCode,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

// Create standardized success response
export const createSuccessResponse = <T>(
  data: T,
  status: number = 200,
  headers: Record<string, string> = {}
): Response => {
  const body: StandardSuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
};

// Common error responses
export const Errors = {
  unauthorized: (message = 'Authentication required', headers?: Record<string, string>) =>
    createErrorResponse(ErrorCodes.UNAUTHORIZED, message, 401, undefined, headers),
  
  forbidden: (message = 'Access denied', headers?: Record<string, string>) =>
    createErrorResponse(ErrorCodes.FORBIDDEN, message, 403, undefined, headers),
  
  notFound: (resource = 'Resource', headers?: Record<string, string>) =>
    createErrorResponse(ErrorCodes.NOT_FOUND, `${resource} not found`, 404, undefined, headers),
  
  validationError: (message: string, context?: Record<string, unknown>, headers?: Record<string, string>) =>
    createErrorResponse(ErrorCodes.VALIDATION_ERROR, message, 400, context, headers),
  
  internalError: (message = 'An unexpected error occurred', headers?: Record<string, string>) =>
    createErrorResponse(ErrorCodes.INTERNAL_ERROR, message, 500, undefined, headers),
  
  timeout: (message = 'Request timed out', headers?: Record<string, string>) =>
    createErrorResponse(ErrorCodes.TIMEOUT, message, 504, undefined, headers),
  
  rateLimited: (message = 'Too many requests', retryAfter?: number, headers?: Record<string, string>) =>
    createErrorResponse(
      ErrorCodes.RATE_LIMITED, 
      message, 
      429, 
      retryAfter ? { retryAfter } : undefined,
      headers
    ),
};

// Timeout wrapper for async operations
export const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number = 5000,
  timeoutMessage = 'Operation timed out'
): Promise<T> => {
  let timeoutId: number | undefined;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs) as unknown as number;
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Safe JSON parse
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
};

// Extract error message from unknown error
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};
