import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProvisionRequest {
  orderId: string;
}

// WHM API call helper
async function callWHMApi(
  hostname: string,
  apiToken: string,
  function_name: string,
  params: Record<string, any> = {}
): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://${hostname}:2087/json-api/${function_name}?api.version=1&${queryString}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `whm root:${apiToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`WHM API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { orderId }: ProvisionRequest = await req.json();

    // Get order details
    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .select("*, hosting_plans(*)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (order.order_type !== "hosting") {
      return new Response(
        JSON.stringify({ error: "Order is not a hosting order" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already provisioned
    const { data: existingAccount } = await adminClient
      .from("hosting_accounts")
      .select("id")
      .eq("order_id", orderId)
      .single();

    if (existingAccount) {
      return new Response(
        JSON.stringify({ error: "Order already provisioned" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Select best available server
    const { data: servers } = await adminClient
      .from("hosting_servers")
      .select("*")
      .eq("is_active", true)
      .eq("api_type", "whm")
      .order("current_accounts", { ascending: true })
      .limit(1);

    if (!servers || servers.length === 0) {
      // Queue for manual provisioning
      await adminClient.from("provisioning_queue").insert({
        order_id: orderId,
        status: "failed",
        last_error: "No available servers",
      });

      return new Response(
        JSON.stringify({ error: "No available servers" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const server = servers[0];

    // Create provisioning queue entry
    const { data: queueEntry } = await adminClient
      .from("provisioning_queue")
      .insert({
        order_id: orderId,
        server_id: server.id,
        status: "processing",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    try {
      // Get WHM API token
      const apiToken = Deno.env.get(`WHM_TOKEN_${server.id.replace(/-/g, "_").toUpperCase()}`) ||
                       Deno.env.get("WHM_API_TOKEN");

      if (!apiToken) {
        throw new Error("API token not configured for server");
      }

      // Generate cPanel username
      const domain = order.domain_name || `user${Date.now()}.chost.com.bd`;
      const { data: usernameResult } = await adminClient.rpc("generate_cpanel_username", {
        domain_name: domain,
      });
      const cpanelUsername = usernameResult || `user${Date.now()}`;

      // Get WHM package mapping
      let whmPackage = "default";
      if (order.hosting_plan_id) {
        const { data: mapping } = await adminClient
          .from("whm_package_mappings")
          .select("whm_package_name")
          .eq("hosting_plan_id", order.hosting_plan_id)
          .eq("server_id", server.id)
          .single();
        
        if (mapping) {
          whmPackage = mapping.whm_package_name;
        }
      }

      // Get user email
      const { data: profile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("user_id", order.user_id)
        .single();

      // Call WHM API to create account
      const whmResult = await callWHMApi(server.hostname, apiToken, "createacct", {
        username: cpanelUsername,
        domain: domain,
        plan: whmPackage,
        contactemail: profile?.email || "noreply@chost.com.bd",
      });

      // Check WHM result
      if (whmResult.metadata?.result !== 1) {
        throw new Error(whmResult.metadata?.reason || "WHM account creation failed");
      }

      // Extract account details from WHM response
      const accountData = whmResult.data?.acct;
      const ipAddress = accountData?.ip || server.ip_address;

      // Create hosting account record
      const { data: hostingAccount, error: accountError } = await adminClient
        .from("hosting_accounts")
        .insert({
          user_id: order.user_id,
          order_id: orderId,
          server_id: server.id,
          cpanel_username: cpanelUsername,
          domain: domain,
          whm_package: whmPackage,
          ip_address: ipAddress,
          status: "active",
          provisioned_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (accountError) {
        throw new Error("Failed to save hosting account");
      }

      // Update order status
      await adminClient
        .from("orders")
        .update({
          status: "completed",
          start_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("id", orderId);

      // Update server account count
      await adminClient
        .from("hosting_servers")
        .update({ current_accounts: server.current_accounts + 1 })
        .eq("id", server.id);

      // Update provisioning queue
      await adminClient
        .from("provisioning_queue")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", queueEntry?.id);

      // Log activity
      await adminClient.from("api_activity_logs").insert({
        user_id: order.user_id,
        server_id: server.id,
        action: "provisionHosting",
        endpoint: "createacct",
        request_data: { orderId, domain, cpanelUsername },
        response_status: 200,
        response_data: { hostingAccountId: hostingAccount.id },
      });

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            hostingAccountId: hostingAccount.id,
            cpanelUsername,
            domain,
            serverIp: ipAddress,
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } catch (provisionError: any) {
      // Update provisioning queue with error
      await adminClient
        .from("provisioning_queue")
        .update({
          status: "failed",
          attempts: (queueEntry?.attempts || 0) + 1,
          last_error: provisionError.message,
        })
        .eq("id", queueEntry?.id);

      throw provisionError;
    }

  } catch (error: any) {
    console.error("Provisioning Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Provisioning failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
