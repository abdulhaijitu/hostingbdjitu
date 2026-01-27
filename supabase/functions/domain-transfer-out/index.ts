import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransferOutRequest {
  domainId: string;
  targetRegistrar?: string;
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

    const { domainId, targetRegistrar }: TransferOutRequest = await req.json();

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: "Domain ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get domain
    const { data: domain, error: domainError } = await supabaseClient
      .from("domains")
      .select("*")
      .eq("id", domainId)
      .single();

    if (domainError || !domain) {
      return new Response(
        JSON.stringify({ error: "Domain not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if domain can be transferred
    if (!["active"].includes(domain.status)) {
      return new Response(
        JSON.stringify({ error: "Domain must be active to transfer out" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unlock domain for transfer (in production, call registrar API)
    const { data: updatedDomain, error: updateError } = await supabaseClient
      .from("domains")
      .update({
        status: "transfer_out",
        metadata: {
          ...domain.metadata,
          transfer_out_initiated_at: new Date().toISOString(),
          transfer_out_by: user.id,
          target_registrar: targetRegistrar || "unknown",
        },
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
      p_action_type: "domain_transfer_out_initiated",
      p_target_type: "domain",
      p_target_id: domainId,
      p_metadata: {
        domain_name: domain.domain_name,
        target_registrar: targetRegistrar,
      },
    });

    console.log(`[Transfer Out] Initiated for domain ${domain.domain_name}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Domain transfer out initiated",
        domain: {
          id: updatedDomain.id,
          domain_name: updatedDomain.domain_name,
          status: updatedDomain.status,
          auth_code: updatedDomain.auth_code,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[Transfer Out Error]", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to initiate transfer" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
