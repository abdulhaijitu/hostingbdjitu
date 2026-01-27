import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ToggleAutoRenewRequest {
  domainId: string;
  autoRenew: boolean;
  userId: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("[domain-toggle-autorenew] Starting");

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { domainId, autoRenew, userId }: ToggleAutoRenewRequest = await req.json();

    if (!domainId || typeof autoRenew !== "boolean" || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get domain and verify ownership
    const { data: domain, error: domainError } = await adminClient
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

    if (domain.user_id !== userId) {
      // Check if user is admin
      const { data: isAdmin } = await adminClient.rpc("has_role", {
        _user_id: userId,
        _role: "admin"
      });

      if (!isAdmin) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check domain status - only active domains can have auto-renew changed
    if (!["active", "pending_renewal"].includes(domain.status)) {
      return new Response(
        JSON.stringify({ 
          error: "Auto-renew can only be changed for active domains",
          current_status: domain.status 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update auto-renew setting
    const { error: updateError } = await adminClient
      .from("domains")
      .update({
        auto_renew: autoRenew,
        auto_renew_failed_at: null,
        auto_renew_failure_reason: null
      })
      .eq("id", domainId);

    if (updateError) {
      throw new Error(`Failed to update auto-renew: ${updateError.message}`);
    }

    // Log audit event
    await adminClient.rpc("log_audit_event", {
      p_actor_id: userId,
      p_actor_role: domain.user_id === userId ? "customer" : "admin",
      p_action_type: "AUTO_RENEW_TOGGLED",
      p_target_type: "domain",
      p_target_id: domainId,
      p_metadata: { 
        domain_name: domain.domain_name,
        auto_renew: autoRenew,
        previous_value: domain.auto_renew
      }
    });

    console.log(`[domain-toggle-autorenew] Auto-renew ${autoRenew ? "enabled" : "disabled"} for ${domain.domain_name}`);

    return new Response(
      JSON.stringify({
        success: true,
        auto_renew: autoRenew,
        message: autoRenew 
          ? "Auto-renewal enabled. Your domain will be renewed automatically before expiry."
          : "Auto-renewal disabled. Remember to renew manually before the domain expires."
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[domain-toggle-autorenew] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
