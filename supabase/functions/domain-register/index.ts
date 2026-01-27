import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RegisterRequest {
  orderId: string;
  domainName: string;
  extension: string;
  userId: string;
  years?: number;
  nameservers?: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const jobId = crypto.randomUUID();
  console.log(`[domain-register] Starting job ${jobId}`);

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { orderId, domainName, extension, userId, years = 1, nameservers }: RegisterRequest = await req.json();

    if (!orderId || !domainName || !extension || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fullDomainName = domainName.includes('.') ? domainName : `${domainName}${extension}`;

    // Check if domain already exists
    const { data: existingDomain } = await adminClient
      .from("domains")
      .select("id")
      .eq("domain_name", fullDomainName)
      .maybeSingle();

    if (existingDomain) {
      return new Response(
        JSON.stringify({ error: "Domain already registered", code: "DOMAIN_EXISTS" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create domain record with pending status
    const { data: domain, error: domainError } = await adminClient
      .from("domains")
      .insert({
        user_id: userId,
        order_id: orderId,
        domain_name: fullDomainName,
        extension: extension,
        status: "pending_registration",
        nameservers: nameservers || ["ns1.chost.com.bd", "ns2.chost.com.bd"],
        metadata: { registration_years: years }
      })
      .select()
      .single();

    if (domainError) {
      console.error("[domain-register] Domain creation error:", domainError);
      throw new Error(`Failed to create domain record: ${domainError.message}`);
    }

    // Add to provisioning queue
    const { error: queueError } = await adminClient
      .from("domain_provisioning_queue")
      .insert({
        domain_id: domain.id,
        order_id: orderId,
        action: "register",
        status: "pending",
        priority: 1,
        request_data: {
          domain_name: fullDomainName,
          extension,
          years,
          nameservers: nameservers || ["ns1.chost.com.bd", "ns2.chost.com.bd"],
          user_id: userId
        }
      });

    if (queueError) {
      console.error("[domain-register] Queue error:", queueError);
    }

    // Simulate registrar API call (in production, call actual registrar API)
    // For now, mark as successful after a brief delay simulation
    const registrationSuccess = true; // Simulated success

    if (registrationSuccess) {
      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setFullYear(expiryDate.getFullYear() + years);

      // Update domain to active
      await adminClient
        .from("domains")
        .update({
          status: "active",
          registration_date: now.toISOString(),
          expiry_date: expiryDate.toISOString(),
          registrar_domain_id: `REG-${Date.now()}`,
          sync_status: "synced",
          last_synced_at: now.toISOString()
        })
        .eq("id", domain.id);

      // Update queue status
      await adminClient
        .from("domain_provisioning_queue")
        .update({
          status: "completed",
          completed_at: now.toISOString(),
          response_data: { registrar_id: `REG-${Date.now()}` }
        })
        .eq("domain_id", domain.id)
        .eq("action", "register");

      // Update order status
      await adminClient
        .from("orders")
        .update({
          status: "completed",
          start_date: now.toISOString(),
          expiry_date: expiryDate.toISOString()
        })
        .eq("id", orderId);

      // Log audit event
      await adminClient.rpc("log_audit_event", {
        p_actor_id: userId,
        p_actor_role: "customer",
        p_action_type: "DOMAIN_REGISTERED",
        p_target_type: "domain",
        p_target_id: domain.id,
        p_metadata: { domain_name: fullDomainName, years }
      });

      console.log(`[domain-register] Domain ${fullDomainName} registered successfully`);

      return new Response(
        JSON.stringify({
          success: true,
          domain: {
            id: domain.id,
            domain_name: fullDomainName,
            status: "active",
            expiry_date: expiryDate.toISOString()
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Handle registration failure
      await adminClient
        .from("domains")
        .update({
          status: "cancelled",
          sync_error: "Registration failed at registrar"
        })
        .eq("id", domain.id);

      await adminClient
        .from("domain_provisioning_queue")
        .update({
          status: "failed",
          error_message: "Registration failed at registrar",
          attempts: 1
        })
        .eq("domain_id", domain.id);

      return new Response(
        JSON.stringify({ error: "Domain registration failed", code: "REGISTRATION_FAILED" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("[domain-register] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
