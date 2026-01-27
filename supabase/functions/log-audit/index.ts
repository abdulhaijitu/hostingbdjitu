/**
 * Audit Logging Edge Function
 * Logs audit events via server-side for IP tracking and security
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.91.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AuditLogRequest {
  actionType: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

// Standard error response
const errorResponse = (code: string, message: string, status: number) => {
  return new Response(
    JSON.stringify({
      success: false,
      errorCode: code,
      message,
      timestamp: new Date().toISOString(),
    }),
    { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

// Standard success response
const successResponse = (data: unknown) => {
  return new Response(
    JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only accept POST
    if (req.method !== 'POST') {
      return errorResponse('METHOD_NOT_ALLOWED', 'Only POST requests are allowed', 405);
    }

    // Get auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('UNAUTHORIZED', 'Missing or invalid authorization header', 401);
    }

    // Initialize Supabase client with user's token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: authError } = await supabase.auth.getClaims(token);
    
    if (authError || !claims?.claims) {
      return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401);
    }

    const userId = claims.claims.sub;

    // Parse request body
    let body: AuditLogRequest;
    try {
      body = await req.json();
    } catch {
      return errorResponse('INVALID_INPUT', 'Invalid JSON body', 400);
    }

    // Validate required fields
    if (!body.actionType) {
      return errorResponse('VALIDATION_ERROR', 'actionType is required', 400);
    }

    // Get user role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    const actorRole = roleData?.role || 'customer';

    // Get client IP and user agent
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';
    const userAgent = req.headers.get('user-agent') || null;

    // Use service role client to insert audit log (bypasses RLS)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: logId, error: insertError } = await adminClient.rpc('log_audit_event', {
      p_actor_id: userId,
      p_actor_role: actorRole,
      p_action_type: body.actionType,
      p_target_type: body.targetType || null,
      p_target_id: body.targetId || null,
      p_metadata: body.metadata || {},
      p_ip_address: clientIp,
      p_user_agent: userAgent,
    });

    if (insertError) {
      console.error('Failed to insert audit log:', insertError);
      return errorResponse('DATABASE_ERROR', 'Failed to create audit log', 500);
    }

    return successResponse({ logId });
  } catch (error) {
    console.error('Audit log error:', error);
    return errorResponse('INTERNAL_ERROR', 'An unexpected error occurred', 500);
  }
});
