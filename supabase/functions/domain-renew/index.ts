import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RenewRequest {
  domainId: string;
  years?: number;
  renewalType?: "manual" | "auto";
  paymentId?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("[domain-renew] Starting renewal process");

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { domainId, years = 1, renewalType = "manual", paymentId }: RenewRequest = await req.json();

    if (!domainId) {
      return new Response(
        JSON.stringify({ error: "Domain ID required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get domain details
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

    // Check if domain is eligible for renewal
    const eligibleStatuses = ["active", "pending_renewal", "expired", "grace_period"];
    if (!eligibleStatuses.includes(domain.status)) {
      return new Response(
        JSON.stringify({ 
          error: "Domain not eligible for renewal", 
          code: "NOT_ELIGIBLE",
          current_status: domain.status 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get renewal price from domain_pricing
    const { data: pricing } = await adminClient
      .from("domain_pricing")
      .select("renewal_price")
      .eq("extension", domain.extension)
      .eq("is_active", true)
      .maybeSingle();

    const renewalAmount = pricing?.renewal_price || 1499; // Default price

    // Calculate new expiry date
    const currentExpiry = domain.expiry_date ? new Date(domain.expiry_date) : new Date();
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    const newExpiryDate = new Date(baseDate);
    newExpiryDate.setFullYear(newExpiryDate.getFullYear() + years);

    // Create renewal record
    const { data: renewal, error: renewalError } = await adminClient
      .from("domain_renewals")
      .insert({
        domain_id: domainId,
        user_id: domain.user_id,
        renewal_type: renewalType,
        renewal_period: years,
        amount: renewalAmount * years,
        previous_expiry_date: domain.expiry_date,
        new_expiry_date: newExpiryDate.toISOString(),
        payment_id: paymentId,
        status: "pending"
      })
      .select()
      .single();

    if (renewalError) {
      console.error("[domain-renew] Renewal record error:", renewalError);
      throw new Error(`Failed to create renewal record: ${renewalError.message}`);
    }

    // Add to provisioning queue
    await adminClient
      .from("domain_provisioning_queue")
      .insert({
        domain_id: domainId,
        action: "renew",
        status: "pending",
        priority: 2,
        request_data: {
          domain_name: domain.domain_name,
          years,
          renewal_id: renewal.id,
          renewal_type: renewalType
        }
      });

    // Simulate registrar renewal (in production, call actual registrar API)
    const renewalSuccess = true;

    if (renewalSuccess) {
      const now = new Date();

      // Update domain
      await adminClient
        .from("domains")
        .update({
          status: "active",
          expiry_date: newExpiryDate.toISOString(),
          last_renewed_at: now.toISOString(),
          auto_renew_failed_at: null,
          auto_renew_failure_reason: null,
          sync_status: "synced",
          last_synced_at: now.toISOString()
        })
        .eq("id", domainId);

      // Update renewal record
      await adminClient
        .from("domain_renewals")
        .update({
          status: "completed",
          processed_at: now.toISOString()
        })
        .eq("id", renewal.id);

      // Update queue
      await adminClient
        .from("domain_provisioning_queue")
        .update({
          status: "completed",
          completed_at: now.toISOString()
        })
        .eq("domain_id", domainId)
        .eq("action", "renew")
        .eq("status", "pending");

      // Log audit event
      await adminClient.rpc("log_audit_event", {
        p_actor_id: domain.user_id,
        p_actor_role: "customer",
        p_action_type: "DOMAIN_RENEWED",
        p_target_type: "domain",
        p_target_id: domainId,
        p_metadata: { 
          domain_name: domain.domain_name, 
          years, 
          renewal_type: renewalType,
          new_expiry: newExpiryDate.toISOString()
        }
      });

      console.log(`[domain-renew] Domain ${domain.domain_name} renewed successfully`);

      return new Response(
        JSON.stringify({
          success: true,
          renewal: {
            id: renewal.id,
            domain_name: domain.domain_name,
            new_expiry_date: newExpiryDate.toISOString(),
            amount: renewalAmount * years
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Handle renewal failure
      await adminClient
        .from("domain_renewals")
        .update({
          status: "failed",
          failure_reason: "Renewal failed at registrar"
        })
        .eq("id", renewal.id);

      if (renewalType === "auto") {
        await adminClient
          .from("domains")
          .update({
            auto_renew_failed_at: new Date().toISOString(),
            auto_renew_failure_reason: "Renewal failed at registrar"
          })
          .eq("id", domainId);
      }

      return new Response(
        JSON.stringify({ error: "Domain renewal failed", code: "RENEWAL_FAILED" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("[domain-renew] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
