import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateNameserversRequest {
  domainId: string;
  nameservers: string[];
  userId: string;
}

// Validate nameserver format
function isValidNameserver(ns: string): boolean {
  const nsRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
  return nsRegex.test(ns) && ns.length <= 253;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("[domain-update-nameservers] Starting");

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { domainId, nameservers, userId }: UpdateNameserversRequest = await req.json();

    if (!domainId || !nameservers || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate nameservers
    if (!Array.isArray(nameservers) || nameservers.length < 2) {
      return new Response(
        JSON.stringify({ error: "At least 2 nameservers required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const invalidNs = nameservers.filter(ns => ns && !isValidNameserver(ns));
    if (invalidNs.length > 0) {
      return new Response(
        JSON.stringify({ error: `Invalid nameserver format: ${invalidNs.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filter out empty nameservers
    const validNameservers = nameservers.filter(ns => ns && ns.trim());

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

    // Check domain status
    if (!["active", "pending_renewal"].includes(domain.status)) {
      return new Response(
        JSON.stringify({ error: "Domain not eligible for nameserver updates", status: domain.status }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const previousNameservers = domain.nameservers;

    // Update to propagating status
    await adminClient
      .from("domains")
      .update({
        nameservers: validNameservers,
        nameserver_status: "propagating"
      })
      .eq("id", domainId);

    // Add to provisioning queue
    await adminClient
      .from("domain_provisioning_queue")
      .insert({
        domain_id: domainId,
        action: "update_nameservers",
        status: "pending",
        priority: 3,
        request_data: {
          domain_name: domain.domain_name,
          old_nameservers: previousNameservers,
          new_nameservers: validNameservers
        }
      });

    // Simulate registrar API call (in production, call actual registrar API)
    const updateSuccess = true;

    if (updateSuccess) {
      const now = new Date();

      // Update domain status
      await adminClient
        .from("domains")
        .update({
          nameserver_status: "active",
          last_synced_at: now.toISOString()
        })
        .eq("id", domainId);

      // Update queue
      await adminClient
        .from("domain_provisioning_queue")
        .update({
          status: "completed",
          completed_at: now.toISOString()
        })
        .eq("domain_id", domainId)
        .eq("action", "update_nameservers")
        .eq("status", "pending");

      // Log audit event
      await adminClient.rpc("log_audit_event", {
        p_actor_id: userId,
        p_actor_role: domain.user_id === userId ? "customer" : "admin",
        p_action_type: "NAMESERVER_CHANGED",
        p_target_type: "domain",
        p_target_id: domainId,
        p_metadata: { 
          domain_name: domain.domain_name,
          old_nameservers: previousNameservers,
          new_nameservers: validNameservers
        }
      });

      console.log(`[domain-update-nameservers] Nameservers updated for ${domain.domain_name}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Nameservers updated. Changes may take 24-48 hours to propagate.",
          nameservers: validNameservers
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Revert on failure
      await adminClient
        .from("domains")
        .update({
          nameservers: previousNameservers,
          nameserver_status: "active"
        })
        .eq("id", domainId);

      return new Response(
        JSON.stringify({ error: "Failed to update nameservers at registrar" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("[domain-update-nameservers] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
