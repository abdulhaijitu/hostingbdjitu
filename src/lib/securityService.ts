import { supabase } from '@/integrations/supabase/client';

// ═══════════════════════════════════════════════════════════════════════════
// SECURITY SERVICE - Centralized security operations
// ═══════════════════════════════════════════════════════════════════════════

export type SecurityEventType = 
  | 'login_failed'
  | 'login_success'
  | 'logout'
  | 'password_reset_requested'
  | 'password_changed'
  | 'session_revoked'
  | 'rate_limit_hit'
  | 'permission_denied'
  | 'admin_high_risk_action'
  | 'suspicious_activity'
  | 'role_change_attempt'
  | 'brute_force_detected';

export type SecuritySeverity = 'info' | 'warn' | 'error' | 'critical';

export interface SecurityEvent {
  id: string;
  event_type: SecurityEventType;
  severity: SecuritySeverity;
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

export interface CooldownStatus {
  is_in_cooldown: boolean;
  cooldown_remaining_seconds: number;
  last_action_at: string | null;
}

// High-risk actions that require extra protection
export const HIGH_RISK_ACTIONS = [
  'refund_approval',
  'hosting_termination',
  'role_change',
  'settings_update',
  'user_deletion',
  'force_logout',
  'bulk_operation',
] as const;

export type HighRiskAction = typeof HIGH_RISK_ACTIONS[number];

// Action cooldown times in seconds
export const ACTION_COOLDOWNS: Record<string, number> = {
  refund_approval: 30,
  hosting_termination: 60,
  role_change: 10,
  settings_update: 5,
  user_deletion: 120,
  force_logout: 5,
  bulk_operation: 60,
};

// ═══════════════════════════════════════════════════════════════════════════
// LOG SECURITY EVENT
// ═══════════════════════════════════════════════════════════════════════════
export const logSecurityEvent = async (
  eventType: SecurityEventType,
  severity: SecuritySeverity = 'info',
  details: Record<string, unknown> = {}
): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase.rpc('log_security_event', {
      p_event_type: eventType,
      p_severity: severity,
      p_user_id: userData?.user?.id || null,
      p_ip_address: null, // Will be captured server-side if needed
      p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      p_details: JSON.parse(JSON.stringify(details)),
    });

    if (error) {
      console.error('[Security] Failed to log event:', error);
      return null;
    }

    return data as string;
  } catch (e) {
    console.error('[Security] Exception logging event:', e);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CHECK ADMIN ACTION COOLDOWN
// ═══════════════════════════════════════════════════════════════════════════
export const checkActionCooldown = async (
  actionType: string,
  cooldownSeconds?: number
): Promise<CooldownStatus> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) {
      return { is_in_cooldown: false, cooldown_remaining_seconds: 0, last_action_at: null };
    }

    const { data, error } = await supabase.rpc('check_admin_action_cooldown', {
      p_admin_user_id: userData.user.id,
      p_action_type: actionType,
      p_cooldown_seconds: cooldownSeconds || ACTION_COOLDOWNS[actionType] || 30,
    });

    if (error) {
      console.error('[Security] Cooldown check failed:', error);
      return { is_in_cooldown: false, cooldown_remaining_seconds: 0, last_action_at: null };
    }

    const result = data?.[0];
    return {
      is_in_cooldown: result?.is_in_cooldown || false,
      cooldown_remaining_seconds: result?.cooldown_remaining_seconds || 0,
      last_action_at: result?.last_action_at || null,
    };
  } catch (e) {
    console.error('[Security] Cooldown check exception:', e);
    return { is_in_cooldown: false, cooldown_remaining_seconds: 0, last_action_at: null };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// RECORD ADMIN ACTION
// ═══════════════════════════════════════════════════════════════════════════
export const recordAdminAction = async (
  actionType: string,
  targetType?: string,
  targetId?: string,
  metadata: Record<string, unknown> = {},
  requiresReauth = false,
  reauthVerified = false
): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.id) return null;

    const { data, error } = await supabase.rpc('record_admin_action', {
      p_admin_user_id: userData.user.id,
      p_action_type: actionType,
      p_target_type: targetType || null,
      p_target_id: targetId || null,
      p_requires_reauth: requiresReauth,
      p_reauth_verified: reauthVerified,
      p_ip_address: null,
      p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      p_metadata: JSON.parse(JSON.stringify(metadata)),
    });

    if (error) {
      console.error('[Security] Failed to record action:', error);
      return null;
    }

    return data as string;
  } catch (e) {
    console.error('[Security] Exception recording action:', e);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// VERIFY RE-AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════
export const verifyReauth = async (password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    // Attempt to sign in with the provided password
    const { error } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password,
    });

    if (error) {
      // Log failed re-auth attempt
      await logSecurityEvent('permission_denied', 'warn', {
        reason: 'reauth_failed',
        email: userData.user.email,
      });
      return { success: false, error: 'Invalid password' };
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: 'Verification failed' };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CHECK IF ACTION REQUIRES RE-AUTH
// ═══════════════════════════════════════════════════════════════════════════
export const actionRequiresReauth = (actionType: string): boolean => {
  const reauthActions = ['refund_approval', 'hosting_termination', 'user_deletion', 'role_change'];
  return reauthActions.includes(actionType);
};

// ═══════════════════════════════════════════════════════════════════════════
// INPUT VALIDATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
export const sanitizeInput = (input: string, maxLength = 1000): string => {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"]/g, ''); // Remove special chars
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// ═══════════════════════════════════════════════════════════════════════════
// MASK SENSITIVE DATA
// ═══════════════════════════════════════════════════════════════════════════
export const maskSensitiveData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization', 'cookie', 'api_key'];
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      masked[key] = '***MASKED***';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value as Record<string, unknown>);
    } else {
      masked[key] = value;
    }
  }

  return masked;
};

// ═══════════════════════════════════════════════════════════════════════════
// SESSION HELPERS
// ═══════════════════════════════════════════════════════════════════════════
export const getDeviceInfo = (): string => {
  if (typeof navigator === 'undefined') return 'Unknown';
  
  const ua = navigator.userAgent;
  let device = 'Desktop';
  
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    device = /iPad/.test(ua) ? 'Tablet' : 'Mobile';
  }
  
  let browser = 'Unknown';
  if (/Chrome/.test(ua)) browser = 'Chrome';
  else if (/Firefox/.test(ua)) browser = 'Firefox';
  else if (/Safari/.test(ua)) browser = 'Safari';
  else if (/Edge/.test(ua)) browser = 'Edge';
  
  let os = 'Unknown';
  if (/Windows/.test(ua)) os = 'Windows';
  else if (/Mac/.test(ua)) os = 'macOS';
  else if (/Linux/.test(ua)) os = 'Linux';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iOS|iPhone|iPad/.test(ua)) os = 'iOS';
  
  return `${device} - ${browser} on ${os}`;
};
