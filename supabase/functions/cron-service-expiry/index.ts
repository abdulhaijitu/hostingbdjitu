import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExpiringService {
  id: string;
  user_id: string;
  domain: string;
  status: string;
  order_id: string;
  orders: {
    expiry_date: string;
    item_name: string;
  };
}

const REMINDER_DAYS = [7, 3, 1]; // Days before expiry to send reminders

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const jobId = crypto.randomUUID();
  const jobName = "service_expiry_reminder";
  const startTime = new Date();

  console.log(`[${jobName}] Starting job ${jobId} at ${startTime.toISOString()}`);

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
      metadata: { triggered_at: startTime.toISOString(), reminder_days: REMINDER_DAYS },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let remindersSent = 0;
    const errors: string[] = [];

    for (const daysBeforeExpiry of REMINDER_DAYS) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + daysBeforeExpiry);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      console.log(`[${jobName}] Checking services expiring on ${targetDateStr} (${daysBeforeExpiry} days)`);

      // Find hosting accounts with orders expiring on target date
      const { data: expiringAccounts, error: accountsError } = await adminClient
        .from("hosting_accounts")
        .select(`
          id,
          user_id,
          domain,
          status,
          order_id,
          orders!inner (
            expiry_date,
            item_name
          )
        `)
        .eq("status", "active")
        .gte("orders.expiry_date", targetDateStr)
        .lt("orders.expiry_date", `${targetDateStr}T23:59:59`);

      if (accountsError) {
        console.error(`[${jobName}] Error fetching accounts:`, accountsError);
        errors.push(`Fetch error for ${daysBeforeExpiry} days: ${accountsError.message}`);
        continue;
      }

      console.log(`[${jobName}] Found ${expiringAccounts?.length || 0} services expiring in ${daysBeforeExpiry} days`);

      for (const account of (expiringAccounts || []) as unknown as ExpiringService[]) {
        try {
          // Check if reminder already sent today for this account and day threshold
          const reminderKey = `expiry_${daysBeforeExpiry}d_${account.id}`;
          const todayStart = today.toISOString();

          const { data: existingLog } = await adminClient
            .from("email_logs")
            .select("id")
            .eq("related_id", account.id)
            .eq("email_type", "service_expiring")
            .gte("created_at", todayStart)
            .limit(1)
            .single();

          if (existingLog) {
            console.log(`[${jobName}] Reminder already sent today for account ${account.id}`);
            continue;
          }

          // Get user profile for email
          const { data: profile } = await adminClient
            .from("profiles")
            .select("email, full_name")
            .eq("user_id", account.user_id)
            .single();

          if (!profile?.email) {
            console.log(`[${jobName}] No email found for user ${account.user_id}`);
            continue;
          }

          // Get or create an invoice for this service
          const { data: existingInvoice } = await adminClient
            .from("invoices")
            .select("id")
            .eq("user_id", account.user_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (existingInvoice) {
            // Send service expiring email
            const supabaseUrl = Deno.env.get("SUPABASE_URL");
            const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

            await fetch(`${supabaseUrl}/functions/v1/send-invoice-email`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${anonKey}`,
              },
              body: JSON.stringify({
                invoiceId: existingInvoice.id,
                emailType: "service_expiring",
                language: "bn",
              }),
            });

            // Log the reminder
            await adminClient.from("email_logs").insert({
              user_id: account.user_id,
              email_type: "service_expiring",
              recipient_email: profile.email,
              subject: `Service Expiring in ${daysBeforeExpiry} day(s) - ${account.domain}`,
              status: "sent",
              related_id: account.id,
              related_type: "hosting_account",
              sent_at: new Date().toISOString(),
            });

            remindersSent++;
            console.log(`[${jobName}] Sent ${daysBeforeExpiry}-day reminder for ${account.domain}`);
          }

        } catch (accountError) {
          const errorMsg = accountError instanceof Error ? accountError.message : "Unknown error";
          console.error(`[${jobName}] Error processing account ${account.id}:`, errorMsg);
          errors.push(`Account ${account.id}: ${errorMsg}`);
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
          triggered_at: startTime.toISOString(),
          completed_at: completedAt.toISOString(),
          duration_ms: completedAt.getTime() - startTime.getTime(),
          reminders_sent: remindersSent,
          errors: errors.length > 0 ? errors : undefined,
        },
        error_message: errors.length > 0 ? errors.join("; ") : null,
      })
      .eq("id", jobId);

    console.log(`[${jobName}] Job completed. Reminders sent: ${remindersSent}`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        remindersSent,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
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
        error_message: error instanceof Error ? error.message : "Unknown error",
      })
      .eq("id", jobId);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
