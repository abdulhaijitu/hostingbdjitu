import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WHMRequest {
  action: string;
  serverId: string;
  params?: Record<string, any>;
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

  const startTime = Date.now();
  
  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Validate user using getUser
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = userData.user.id;

    // Check if user is admin
    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleData?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, serverId, params = {} }: WHMRequest = await req.json();

    // Get server details from database
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: server, error: serverError } = await adminClient
      .from("hosting_servers")
      .select("*")
      .eq("id", serverId)
      .single();

    if (serverError || !server) {
      return new Response(
        JSON.stringify({ error: "Server not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get API token from secrets (stored per server)
    const apiToken = Deno.env.get(`WHM_TOKEN_${server.id.replace(/-/g, "_").toUpperCase()}`) || 
                     Deno.env.get("WHM_API_TOKEN");
    
    if (!apiToken) {
      return new Response(
        JSON.stringify({ error: "API token not configured for this server" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result: any;
    let endpoint = "";

    switch (action) {
      case "createAccount": {
        endpoint = "createacct";
        const { username, domain, plan, contactemail } = params;
        result = await callWHMApi(server.hostname, apiToken, "createacct", {
          username,
          domain,
          plan,
          contactemail,
        });
        break;
      }

      case "suspendAccount": {
        endpoint = "suspendacct";
        const { user, reason } = params;
        result = await callWHMApi(server.hostname, apiToken, "suspendacct", {
          user,
          reason: reason || "Suspended by admin",
        });
        break;
      }

      case "unsuspendAccount": {
        endpoint = "unsuspendacct";
        result = await callWHMApi(server.hostname, apiToken, "unsuspendacct", {
          user: params.user,
        });
        break;
      }

      case "terminateAccount": {
        endpoint = "removeacct";
        result = await callWHMApi(server.hostname, apiToken, "removeacct", {
          user: params.user,
          keepdns: params.keepdns || 0,
        });
        break;
      }

      case "listAccounts": {
        endpoint = "listaccts";
        result = await callWHMApi(server.hostname, apiToken, "listaccts", {
          searchtype: params.searchtype || "domain",
          search: params.search || "",
        });
        break;
      }

      case "getAccountSummary": {
        endpoint = "accountsummary";
        result = await callWHMApi(server.hostname, apiToken, "accountsummary", {
          user: params.user,
        });
        break;
      }

      case "serverStatus": {
        endpoint = "systemloadavg";
        const loadAvg = await callWHMApi(server.hostname, apiToken, "systemloadavg", {});
        const diskUsage = await callWHMApi(server.hostname, apiToken, "getdiskusage", {});
        result = { loadAvg, diskUsage };
        break;
      }

      case "listPackages": {
        endpoint = "listpkgs";
        result = await callWHMApi(server.hostname, apiToken, "listpkgs", {});
        break;
      }

      case "createPackage": {
        endpoint = "addpkg";
        result = await callWHMApi(server.hostname, apiToken, "addpkg", params);
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const duration = Date.now() - startTime;

    // Log API activity
    await adminClient.from("api_activity_logs").insert({
      user_id: userId,
      server_id: serverId,
      action,
      endpoint,
      request_data: params,
      response_status: 200,
      response_data: result,
      duration_ms: duration,
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("WHM API Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
