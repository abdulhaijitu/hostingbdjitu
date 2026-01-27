import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransferInRequest {
  domainId: string;
  action: "accept" | "reject" | "cancel";
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

    const { domainId, action }: TransferInRequest = await req.json();

    if (!domainId || !action) {
      return new Response(
        JSON.stringify({ error: "Domain ID and action are required" }),
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

    // Check if domain is pending transfer in
    if (domain.status !== "transfer_in") {
      return new Response(
        JSON.stringify({ error: "Domain is not pending transfer in" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let newStatus: string;
    let message: string;

    switch (action) {
      case "accept":
        // In production, call registrar API to accept transfer
        newStatus = "active";
        message = "Domain transfer accepted and domain is now active";
        break;
      case "reject":
        newStatus = "cancelled";
        message = "Domain transfer rejected";
        break;
      case "cancel":
        newStatus = "cancelled";
        message = "Domain transfer cancelled";
        break;
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const { data: updatedDomain, error: updateError } = await supabaseClient
      .from("domains")
      .update({
        status: newStatus,
        metadata: {
          ...domain.metadata,
          [`transfer_${action}_at`]: new Date().toISOString(),
          [`transfer_${action}_by`]: user.id,
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
      p_action_type: `domain_transfer_${action}`,
      p_target_type: "domain",
      p_target_id: domainId,
      p_metadata: { domain_name: domain.domain_name },
    });

    console.log(`[Transfer In] ${action} for domain ${domain.domain_name}`);

    return new Response(
      JSON.stringify({
        success: true,
        message,
        domain: {
          id: updatedDomain.id,
          domain_name: updatedDomain.domain_name,
          status: updatedDomain.status,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("[Transfer In Error]", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process transfer" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
