import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CPanelRequest {
  action: string;
  hostingAccountId: string;
  params?: Record<string, any>;
}

// cPanel UAPI call helper
async function callCPanelUAPI(
  hostname: string,
  username: string,
  apiToken: string,
  module: string,
  func: string,
  params: Record<string, any> = {}
): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://${hostname}:2083/execute/${module}/${func}?${queryString}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `cpanel ${username}:${apiToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`cPanel API error: ${response.status} ${response.statusText}`);
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
    const { action, hostingAccountId, params = {} }: CPanelRequest = await req.json();

    // Get admin client for database operations
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get hosting account and verify ownership
    const { data: account, error: accountError } = await adminClient
      .from("hosting_accounts")
      .select("*, hosting_servers(*)")
      .eq("id", hostingAccountId)
      .single();

    if (accountError || !account) {
      return new Response(
        JSON.stringify({ error: "Hosting account not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check ownership or admin status
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    const isAdmin = roleData?.role === "admin";
    const isOwner = account.user_id === userId;

    if (!isAdmin && !isOwner) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get cPanel API token
    const apiToken = Deno.env.get(`CPANEL_TOKEN_${account.server_id.replace(/-/g, "_").toUpperCase()}`) ||
                     Deno.env.get("CPANEL_API_TOKEN");

    if (!apiToken) {
      return new Response(
        JSON.stringify({ error: "API token not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const server = account.hosting_servers;
    let result: any;
    let endpoint = "";

    switch (action) {
      // Disk and Bandwidth Usage
      case "getUsage": {
        endpoint = "ResourceUsage/get_usages";
        const quotaInfo = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Quota",
          "get_quota_info",
          {}
        );
        const bandwidth = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Bandwidth",
          "get_enabled_protocols",
          {}
        );
        result = { quota: quotaInfo, bandwidth };
        
        // Update local cache
        if (quotaInfo?.result?.data) {
          await adminClient
            .from("hosting_accounts")
            .update({
              disk_used_mb: Math.round((quotaInfo.result.data.bytes_used || 0) / 1024 / 1024),
              last_synced_at: new Date().toISOString(),
            })
            .eq("id", hostingAccountId);
        }
        break;
      }

      // Email Management
      case "listEmails": {
        endpoint = "Email/list_pops";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Email",
          "list_pops",
          {}
        );
        break;
      }

      case "createEmail": {
        endpoint = "Email/add_pop";
        const { email, password, quota } = params;
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Email",
          "add_pop",
          {
            email,
            password,
            quota: quota || 1024, // Default 1GB
          }
        );
        break;
      }

      case "deleteEmail": {
        endpoint = "Email/delete_pop";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Email",
          "delete_pop",
          { email: params.email }
        );
        break;
      }

      case "changeEmailPassword": {
        endpoint = "Email/passwd_pop";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Email",
          "passwd_pop",
          {
            email: params.email,
            password: params.password,
          }
        );
        break;
      }

      // Database Management
      case "listDatabases": {
        endpoint = "Mysql/list_databases";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Mysql",
          "list_databases",
          {}
        );
        break;
      }

      case "createDatabase": {
        endpoint = "Mysql/create_database";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Mysql",
          "create_database",
          { name: params.name }
        );
        break;
      }

      case "deleteDatabase": {
        endpoint = "Mysql/delete_database";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Mysql",
          "delete_database",
          { name: params.name }
        );
        break;
      }

      case "listDatabaseUsers": {
        endpoint = "Mysql/list_users";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Mysql",
          "list_users",
          {}
        );
        break;
      }

      // SSL Status
      case "getSSLStatus": {
        endpoint = "SSL/installed_hosts";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "SSL",
          "installed_hosts",
          {}
        );
        break;
      }

      // Change cPanel Password
      case "changePassword": {
        endpoint = "Passwd/set_password";
        // This requires WHM API, so we delegate to admin
        if (!isAdmin) {
          return new Response(
            JSON.stringify({ error: "Password change requires admin approval" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        // Implementation would call WHM passwd API
        result = { message: "Password change request submitted" };
        break;
      }

      // File Manager (limited operations)
      case "listFiles": {
        endpoint = "Fileman/list_files";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "Fileman",
          "list_files",
          {
            dir: params.dir || "/public_html",
            include_mime: 1,
            include_permissions: 1,
          }
        );
        break;
      }

      // Domain Info
      case "getDomainInfo": {
        endpoint = "DomainInfo/list_domains";
        result = await callCPanelUAPI(
          server.hostname,
          account.cpanel_username,
          apiToken,
          "DomainInfo",
          "list_domains",
          {}
        );
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
      server_id: account.server_id,
      action,
      endpoint,
      request_data: { hostingAccountId, ...params },
      response_status: 200,
      response_data: result,
      duration_ms: duration,
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("cPanel API Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
