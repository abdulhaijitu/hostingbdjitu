import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NOTIFICATION_DAYS = [30, 15, 7, 1];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const jobId = crypto.randomUUID();
  const jobName = "domain_expiry_notifications";
  const startTime = new Date();

  console.log(`[${jobName}] Starting job ${jobId}`);

  try {
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Log job start
    await adminClient.from("scheduled_jobs").insert({
      id: jobId,
      job_name: jobName,
      job_type: "recurring",
      status: "running",
      started_at: startTime.toISOString(),
      metadata: { notification_days: NOTIFICATION_DAYS }
    });

    // First, update domain statuses based on expiry
    await adminClient.rpc("update_domain_expiry_status");

    let notificationsSent = 0;
    let autoRenewsAttempted = 0;
    const errors: string[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const daysBeforeExpiry of NOTIFICATION_DAYS) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);
      const targetDateStart = targetDate.toISOString().split('T')[0];
      const targetDateEnd = `${targetDateStart}T23:59:59`;

      console.log(`[${jobName}] Checking domains expiring on ${targetDateStart} (${daysBeforeExpiry} days)`);

      // Get domains expiring on target date
      const { data: expiringDomains, error: fetchError } = await adminClient
        .from("domains")
        .select("*")
        .in("status", ["active", "pending_renewal"])
        .gte("expiry_date", targetDateStart)
        .lt("expiry_date", targetDateEnd);

      if (fetchError) {
        console.error(`[${jobName}] Fetch error:`, fetchError);
        errors.push(`Fetch error for ${daysBeforeExpiry} days: ${fetchError.message}`);
        continue;
      }

      console.log(`[${jobName}] Found ${expiringDomains?.length || 0} domains expiring in ${daysBeforeExpiry} days`);

      for (const domain of expiringDomains || []) {
        try {
          const notificationType = `${daysBeforeExpiry}_day`;

          // Check if notification already sent
          const { data: existingNotification } = await adminClient
            .from("domain_expiry_notifications")
            .select("id")
            .eq("domain_id", domain.id)
            .eq("notification_type", notificationType)
            .maybeSingle();

          if (existingNotification) {
            console.log(`[${jobName}] Notification already sent for ${domain.domain_name} (${notificationType})`);
            continue;
          }

          // Get user email
          const { data: profile } = await adminClient
            .from("profiles")
            .select("email, full_name")
            .eq("user_id", domain.user_id)
            .single();

          if (!profile?.email) {
            console.log(`[${jobName}] No email for user ${domain.user_id}`);
            continue;
          }

          // Attempt auto-renew on last day if enabled
          if (daysBeforeExpiry === 1 && domain.auto_renew) {
            console.log(`[${jobName}] Attempting auto-renew for ${domain.domain_name}`);
            autoRenewsAttempted++;

            try {
              const supabaseUrl = Deno.env.get("SUPABASE_URL");
              const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

              const renewResponse = await fetch(`${supabaseUrl}/functions/v1/domain-renew`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${anonKey}`
                },
                body: JSON.stringify({
                  domainId: domain.id,
                  years: 1,
                  renewalType: "auto"
                })
              });

              if (renewResponse.ok) {
                console.log(`[${jobName}] Auto-renewal successful for ${domain.domain_name}`);
                
                // Send success notification
                await adminClient.from("domain_expiry_notifications").insert({
                  domain_id: domain.id,
                  user_id: domain.user_id,
                  notification_type: "auto_renewed",
                  days_before_expiry: daysBeforeExpiry,
                  status: "sent",
                  sent_at: new Date().toISOString()
                });

                continue; // Skip expiry notification since domain was renewed
              }
            } catch (renewError) {
              console.error(`[${jobName}] Auto-renew failed for ${domain.domain_name}:`, renewError);
            }
          }

          // Create notification record
          const { data: notification, error: notifError } = await adminClient
            .from("domain_expiry_notifications")
            .insert({
              domain_id: domain.id,
              user_id: domain.user_id,
              notification_type: notificationType,
              days_before_expiry: daysBeforeExpiry,
              status: "pending"
            })
            .select()
            .single();

          if (notifError) {
            console.error(`[${jobName}] Notification create error:`, notifError);
            continue;
          }

          // Send email notification (simplified - in production use proper email template)
          const { data: emailLog, error: emailError } = await adminClient
            .from("email_logs")
            .insert({
              user_id: domain.user_id,
              email_type: "domain_expiring",
              recipient_email: profile.email,
              subject: `Domain ${domain.domain_name} expires in ${daysBeforeExpiry} day(s)`,
              status: "sent",
              related_id: domain.id,
              related_type: "domain",
              sent_at: new Date().toISOString()
            })
            .select()
            .single();

          // Update notification with email log
          await adminClient
            .from("domain_expiry_notifications")
            .update({
              status: "sent",
              sent_at: new Date().toISOString(),
              email_log_id: emailLog?.id
            })
            .eq("id", notification.id);

          notificationsSent++;
          console.log(`[${jobName}] Sent ${daysBeforeExpiry}-day notification for ${domain.domain_name}`);

        } catch (domainError) {
          const errorMsg = domainError instanceof Error ? domainError.message : "Unknown error";
          console.error(`[${jobName}] Error processing ${domain.domain_name}:`, errorMsg);
          errors.push(`${domain.domain_name}: ${errorMsg}`);
        }
      }
    }

    // Update job status
    const completedAt = new Date();
    await adminClient
      .from("scheduled_jobs")
      .update({
        status: errors.length > 0 ? "completed_with_errors" : "completed",
        completed_at: completedAt.toISOString(),
        metadata: {
          duration_ms: completedAt.getTime() - startTime.getTime(),
          notifications_sent: notificationsSent,
          auto_renews_attempted: autoRenewsAttempted,
          errors: errors.length > 0 ? errors : undefined
        },
        error_message: errors.length > 0 ? errors.join("; ") : null
      })
      .eq("id", jobId);

    console.log(`[${jobName}] Job completed. Notifications: ${notificationsSent}, Auto-renews: ${autoRenewsAttempted}`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        notificationsSent,
        autoRenewsAttempted,
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
