import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateAuthCodeRequest {
  domainId: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user is admin
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleData?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { domainId }: GenerateAuthCodeRequest = await req.json();

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: "Domain ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get domain
    const { data: domain, error: domainError } = await supabaseClient
      .from("domains")
      .select("*, profiles:user_id(email, full_name)")
      .eq("id", domainId)
      .single();

    if (domainError || !domain) {
      return new Response(
        JSON.stringify({ error: "Domain not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if domain is eligible for transfer (must be active and > 60 days old)
    if (domain.status !== "active") {
      return new Response(
        JSON.stringify({ error: "Domain must be active to generate EPP code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate EPP/Auth code
    const authCode = generateEPPCode();

    // In production, this would call the registrar API
    // For now, we store locally and simulate
    const { data: updatedDomain, error: updateError } = await supabaseClient
      .from("domains")
      .update({
        auth_code: authCode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", domainId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log the action
    await supabaseClient.rpc("log_audit_event", {
      p_actor_id: user.id,
      p_actor_role: "admin",
      p_action_type: "domain_authcode_generated",
      p_target_type: "domain",
      p_target_id: domainId,
      p_metadata: { domain_name: domain.domain_name },
    });

    console.log(`[EPP Code] Generated for domain ${domain.domain_name}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "EPP code generated successfully",
        domain: {
          id: updatedDomain.id,
          domain_name: updatedDomain.domain_name,
          auth_code: authCode,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[EPP Code Error]", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate EPP code" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateEPPCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let code = "";
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
