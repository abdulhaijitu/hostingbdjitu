/**
 * Audit Logging Service
 * Tracks all critical actions for security, accountability, and debugging
 */

import { supabase } from '@/integrations/supabase/client';

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'ROLE_CHANGE'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'HOSTING_PROVISION'
  | 'HOSTING_SUSPEND'
  | 'HOSTING_UNSUSPEND'
  | 'HOSTING_TERMINATE'
  | 'PAYMENT_CREATE'
  | 'PAYMENT_CONFIRM'
  | 'PAYMENT_REFUND'
  | 'REFUND_REQUEST'
  | 'REFUND_APPROVE'
  | 'REFUND_REJECT'
  | 'ORDER_CREATE'
  | 'ORDER_UPDATE'
  | 'ORDER_CANCEL'
  | 'TICKET_CREATE'
  | 'TICKET_UPDATE'
  | 'TICKET_CLOSE'
  | 'SETTINGS_UPDATE'
  | 'SERVER_CREATE'
  | 'SERVER_UPDATE'
  | 'SERVER_DELETE'
  | 'PLAN_CREATE'
  | 'PLAN_UPDATE'
  | 'PLAN_DELETE'
  | 'DOMAIN_PRICING_UPDATE'
  | 'ANNOUNCEMENT_CREATE'
  | 'ANNOUNCEMENT_UPDATE';

export type TargetType =
  | 'user'
  | 'order'
  | 'payment'
  | 'invoice'
  | 'hosting_account'
  | 'hosting_plan'
  | 'server'
  | 'ticket'
  | 'refund'
  | 'setting'
  | 'domain_pricing'
  | 'announcement';

export interface AuditLogData {
  actionType: AuditActionType;
  targetType?: TargetType;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

// Mask sensitive fields in metadata
const maskSensitiveData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sensitiveKeys = ['password', 'token', 'secret', 'api_key', 'credit_card', 'ssn', 'apikey'];
  const masked: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      masked[key] = '***MASKED***';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      masked[key] = maskSensitiveData(value as Record<string, unknown>);
    } else {
      masked[key] = value;
    }
  }
  
  return masked;
};

// Get current user role from cache
const getCurrentRole = (): string => {
  try {
    const cached = sessionStorage.getItem('user_role_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed.role || 'customer';
    }
  } catch {
    // Ignore
  }
  return 'customer';
};

/**
 * Log an audit event asynchronously
 * Non-blocking - will not interrupt user flow
 */
export const logAuditEvent = async (data: AuditLogData): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;
    const actorRole = getCurrentRole();
    
    // Mask any sensitive data in metadata
    const safeMetadata = data.metadata ? maskSensitiveData(data.metadata) : {};
    
    const { data: result, error } = await supabase.rpc('log_audit_event', {
      p_actor_id: userId,
      p_actor_role: actorRole,
      p_action_type: data.actionType,
      p_target_type: data.targetType || null,
      p_target_id: data.targetId || null,
      p_metadata: JSON.parse(JSON.stringify(safeMetadata)),
      p_ip_address: null, // IP captured server-side
      p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });

    if (error) {
      console.error('[AuditLogger] Failed to log event:', error);
      return null;
    }

    return result as string;
  } catch (e) {
    // Silent fail - audit logging should never crash the app
    console.error('[AuditLogger] Exception:', e);
    return null;
  }
};

/**
 * Helper functions for common audit events
 */
export const auditAuth = {
  login: (userId: string) => 
    logAuditEvent({ actionType: 'LOGIN', targetType: 'user', targetId: userId }),
  
  logout: (userId: string) => 
    logAuditEvent({ actionType: 'LOGOUT', targetType: 'user', targetId: userId }),
};

export const auditUser = {
  create: (targetUserId: string, metadata?: Record<string, unknown>) =>
    logAuditEvent({ actionType: 'USER_CREATE', targetType: 'user', targetId: targetUserId, metadata }),
  
  update: (targetUserId: string, metadata?: Record<string, unknown>) =>
    logAuditEvent({ actionType: 'USER_UPDATE', targetType: 'user', targetId: targetUserId, metadata }),
  
  delete: (targetUserId: string, metadata?: Record<string, unknown>) =>
    logAuditEvent({ actionType: 'USER_DELETE', targetType: 'user', targetId: targetUserId, metadata }),
  
  roleChange: (targetUserId: string, oldRole: string, newRole: string) =>
    logAuditEvent({ 
      actionType: 'ROLE_CHANGE', 
      targetType: 'user', 
      targetId: targetUserId, 
      metadata: { oldRole, newRole } 
    }),
};

export const auditHosting = {
  provision: (accountId: string, metadata?: Record<string, unknown>) =>
    logAuditEvent({ actionType: 'HOSTING_PROVISION', targetType: 'hosting_account', targetId: accountId, metadata }),
  
  suspend: (accountId: string, reason?: string) =>
    logAuditEvent({ actionType: 'HOSTING_SUSPEND', targetType: 'hosting_account', targetId: accountId, metadata: { reason } }),
  
  unsuspend: (accountId: string) =>
    logAuditEvent({ actionType: 'HOSTING_UNSUSPEND', targetType: 'hosting_account', targetId: accountId }),
  
  terminate: (accountId: string, reason?: string) =>
    logAuditEvent({ actionType: 'HOSTING_TERMINATE', targetType: 'hosting_account', targetId: accountId, metadata: { reason } }),
};

export const auditPayment = {
  create: (paymentId: string, amount: number) =>
    logAuditEvent({ actionType: 'PAYMENT_CREATE', targetType: 'payment', targetId: paymentId, metadata: { amount } }),
  
  confirm: (paymentId: string, transactionId?: string) =>
    logAuditEvent({ actionType: 'PAYMENT_CONFIRM', targetType: 'payment', targetId: paymentId, metadata: { transactionId } }),
  
  refund: (paymentId: string, amount: number, reason?: string) =>
    logAuditEvent({ actionType: 'PAYMENT_REFUND', targetType: 'payment', targetId: paymentId, metadata: { amount, reason } }),
};

export const auditRefund = {
  request: (refundId: string, amount: number, reason?: string) =>
    logAuditEvent({ actionType: 'REFUND_REQUEST', targetType: 'refund', targetId: refundId, metadata: { amount, reason } }),
  
  approve: (refundId: string) =>
    logAuditEvent({ actionType: 'REFUND_APPROVE', targetType: 'refund', targetId: refundId }),
  
  reject: (refundId: string, reason?: string) =>
    logAuditEvent({ actionType: 'REFUND_REJECT', targetType: 'refund', targetId: refundId, metadata: { reason } }),
};

export const auditOrder = {
  create: (orderId: string, metadata?: Record<string, unknown>) =>
    logAuditEvent({ actionType: 'ORDER_CREATE', targetType: 'order', targetId: orderId, metadata }),
  
  update: (orderId: string, changes?: Record<string, unknown>) =>
    logAuditEvent({ actionType: 'ORDER_UPDATE', targetType: 'order', targetId: orderId, metadata: changes }),
  
  cancel: (orderId: string, reason?: string) =>
    logAuditEvent({ actionType: 'ORDER_CANCEL', targetType: 'order', targetId: orderId, metadata: { reason } }),
};

export const auditSettings = {
  update: (settingKey: string, metadata?: Record<string, unknown>) =>
    logAuditEvent({ actionType: 'SETTINGS_UPDATE', targetType: 'setting', targetId: settingKey, metadata }),
};

export default {
  logAuditEvent,
  auditAuth,
  auditUser,
  auditHosting,
  auditPayment,
  auditRefund,
  auditOrder,
  auditSettings,
};
