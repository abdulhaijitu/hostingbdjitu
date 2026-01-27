import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SyncRequest {
  domainId?: string; // If provided, sync single domain. Otherwise, sync all.
  syncType?: "status_check" | "full_sync" | "nameserver_sync";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const jobId = crypto.randomUUID();
  const jobName = "domain_sync";
  const startTime = new Date();

  console.log(`[${jobName}] Starting job ${jobId}`);

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const { domainId, syncType = "status_check" }: SyncRequest = body;

    // Log job start
    await adminClient.from("scheduled_jobs").insert({
      id: jobId,
      job_name: jobName,
      job_type: domainId ? "manual" : "recurring",
      status: "running",
      started_at: startTime.toISOString(),
      metadata: { domain_id: domainId, sync_type: syncType }
    });

    let domainsToSync;
    
    if (domainId) {
      // Sync single domain
      const { data, error } = await adminClient
        .from("domains")
        .select("*")
        .eq("id", domainId)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Domain not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      domainsToSync = [data];
    } else {
      // Sync all active domains
      const { data, error } = await adminClient
        .from("domains")
        .select("*")
        .in("status", ["active", "pending_renewal", "expired", "grace_period"])
        .order("last_synced_at", { ascending: true, nullsFirst: true })
        .limit(100); // Process in batches

      if (error) {
        throw new Error(`Failed to fetch domains: ${error.message}`);
      }
      domainsToSync = data || [];
    }

    console.log(`[${jobName}] Syncing ${domainsToSync.length} domains`);

    let synced = 0;
    let mismatches = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const domain of domainsToSync) {
      try {
        // Simulate registrar API call for domain status
        // In production, this would call the actual registrar API
        const registrarData = {
          domain_name: domain.domain_name,
          status: "active", // Simulated - would come from registrar
          expiry_date: domain.expiry_date,
          nameservers: domain.nameservers,
          registrar_id: domain.registrar_domain_id || `REG-${Date.now()}`
        };

        const localData = {
          domain_name: domain.domain_name,
          status: domain.status,
          expiry_date: domain.expiry_date,
          nameservers: domain.nameservers,
          registrar_id: domain.registrar_domain_id
        };

        // Check for mismatches
        const detectedMismatches: Record<string, { local: any; registrar: any }> = {};
        
        if (registrarData.status !== domain.status) {
          detectedMismatches.status = { local: domain.status, registrar: registrarData.status };
        }
        
        // Compare expiry dates (with 1-day tolerance)
        if (registrarData.expiry_date && domain.expiry_date) {
          const regExpiry = new Date(registrarData.expiry_date).getTime();
          const localExpiry = new Date(domain.expiry_date).getTime();
          if (Math.abs(regExpiry - localExpiry) > 86400000) { // 1 day in ms
            detectedMismatches.expiry_date = { local: domain.expiry_date, registrar: registrarData.expiry_date };
          }
        }

        const hasMismatches = Object.keys(detectedMismatches).length > 0;
        if (hasMismatches) mismatches++;

        // Log sync
        await adminClient.from("domain_sync_logs").insert({
          domain_id: domain.id,
          sync_type: syncType,
          status: hasMismatches ? "mismatch_detected" : "success",
          local_data: localData,
          registrar_data: registrarData,
          mismatches: hasMismatches ? detectedMismatches : null
        });

        // Update domain sync status
        await adminClient
          .from("domains")
          .update({
            sync_status: hasMismatches ? "mismatch" : "synced",
            last_synced_at: new Date().toISOString(),
            sync_error: null,
            registrar_domain_id: registrarData.registrar_id
          })
          .eq("id", domain.id);

        synced++;

      } catch (domainError) {
        failed++;
        const errorMsg = domainError instanceof Error ? domainError.message : "Unknown error";
        errors.push(`${domain.domain_name}: ${errorMsg}`);

        // Log failed sync
        await adminClient.from("domain_sync_logs").insert({
          domain_id: domain.id,
          sync_type: syncType,
          status: "failed",
          error_message: errorMsg
        });

        // Update domain with error
        await adminClient
          .from("domains")
          .update({
            sync_status: "failed",
            sync_error: errorMsg
          })
          .eq("id", domain.id);
      }
    }

    // Update job status
    const completedAt = new Date();
    await adminClient
      .from("scheduled_jobs")
      .update({
        status: failed > 0 ? "completed_with_errors" : "completed",
        completed_at: completedAt.toISOString(),
        metadata: {
          duration_ms: completedAt.getTime() - startTime.getTime(),
          domains_synced: synced,
          mismatches_detected: mismatches,
          failed: failed,
          errors: errors.length > 0 ? errors : undefined
        },
        error_message: errors.length > 0 ? errors.join("; ") : null
      })
      .eq("id", jobId);

    console.log(`[${jobName}] Completed. Synced: ${synced}, Mismatches: ${mismatches}, Failed: ${failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        synced,
        mismatches,
        failed,
        errors: errors.length > 0 ? errors : undefined
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error(`[${jobName}] Job failed:`, error);

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await adminClient
      .from("scheduled_jobs")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        error_message: error instanceof Error ? error.message : "Unknown error"
      })
      .eq("id", jobId);

    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
