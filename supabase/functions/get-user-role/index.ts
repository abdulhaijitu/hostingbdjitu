import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoleResponse {
  role: 'admin' | 'customer' | null;
  error?: string;
  userId?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      const response: RoleResponse = { 
        role: null, 
        error: 'Missing or invalid authorization header' 
      };
      return new Response(JSON.stringify(response), {
        status: 200, // Return 200 even for auth issues - let frontend handle
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client with user's token for auth verification
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { headers: { Authorization: authHeader } }
      }
    );

    // Validate the JWT and get user claims
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims?.sub) {
      console.error('JWT validation failed:', claimsError?.message);
      const response: RoleResponse = { 
        role: null, 
        error: 'Invalid or expired token' 
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;

    // Create admin client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Fetch role from user_roles table
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (roleError) {
      console.error('Role query failed:', roleError.message);
      // Return null role with error flag - DO NOT return 403/401
      const response: RoleResponse = { 
        role: null, 
        error: roleError.message,
        userId 
      };
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Return resolved role (or customer as default)
    const userRole = (roleData?.role as 'admin' | 'customer') || 'customer';
    
    const response: RoleResponse = { 
      role: userRole,
      userId 
    };
    
    console.log(`Role resolved for user ${userId}: ${userRole}`);
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in get-user-role:', error);
    
    // Return null role with error - NEVER return 500/403
    const response: RoleResponse = { 
      role: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
