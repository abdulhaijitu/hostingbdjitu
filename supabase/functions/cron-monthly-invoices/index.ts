import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RecurringOrder {
  id: string;
  user_id: string;
  item_name: string;
  amount: number;
  billing_cycle: string;
  expiry_date: string;
  hosting_plan_id: string | null;
  domain_name: string | null;
  order_type: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const jobId = crypto.randomUUID();
  const jobName = "monthly_invoice_generation";
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
      metadata: { triggered_at: startTime.toISOString() },
    });

    // Get current date info
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysUntilExpiry = 30; // Generate invoice 30 days before expiry

    // Find orders expiring in the next billing period
    const expiryThreshold = new Date();
    expiryThreshold.setDate(expiryThreshold.getDate() + daysUntilExpiry);

    const { data: expiringOrders, error: ordersError } = await adminClient
      .from("orders")
      .select("*")
      .in("status", ["completed", "processing"])
      .in("billing_cycle", ["monthly", "yearly"])
      .lte("expiry_date", expiryThreshold.toISOString())
      .gte("expiry_date", today.toISOString());

    if (ordersError) {
      throw new Error(`Failed to fetch expiring orders: ${ordersError.message}`);
    }

    console.log(`[${jobName}] Found ${expiringOrders?.length || 0} orders expiring soon`);

    let invoicesGenerated = 0;
    let emailsSent = 0;
    const errors: string[] = [];

    for (const order of (expiringOrders || []) as RecurringOrder[]) {
      try {
        // Check if invoice already exists for this period
        const invoiceMonth = today.toISOString().slice(0, 7); // YYYY-MM
        const { data: existingInvoice } = await adminClient
          .from("invoices")
          .select("id")
          .eq("payment_id", order.id)
          .gte("created_at", `${invoiceMonth}-01`)
          .limit(1)
          .single();

        if (existingInvoice) {
          console.log(`[${jobName}] Invoice already exists for order ${order.id}`);
          continue;
        }

        // Create payment record
        const { data: payment, error: paymentError } = await adminClient
          .from("payments")
          .insert({
            order_id: order.id,
            user_id: order.user_id,
            amount: order.amount,
            currency: "BDT",
            status: "pending",
          })
          .select()
          .single();

        if (paymentError || !payment) {
          throw new Error(`Payment creation failed: ${paymentError?.message}`);
        }

        // Generate invoice number
        const { data: invoiceNumber } = await adminClient
          .rpc("generate_invoice_number");

        // Calculate due date (7 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        // Create invoice
        const { data: invoice, error: invoiceError } = await adminClient
          .from("invoices")
          .insert({
            payment_id: payment.id,
            user_id: order.user_id,
            invoice_number: invoiceNumber || `INV-${Date.now()}`,
            amount: order.amount,
            tax: 0,
            total: order.amount,
            status: "unpaid",
            due_date: dueDate.toISOString(),
          })
          .select()
          .single();

        if (invoiceError || !invoice) {
          throw new Error(`Invoice creation failed: ${invoiceError?.message}`);
        }

        console.log(`[${jobName}] Created invoice ${invoice.invoice_number} for order ${order.id}`);
        invoicesGenerated++;

        // Send invoice email
        try {
          const supabaseUrl = Deno.env.get("SUPABASE_URL");
          const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
          
          await fetch(`${supabaseUrl}/functions/v1/send-invoice-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${anonKey}`,
            },
            body: JSON.stringify({
              invoiceId: invoice.id,
              emailType: "invoice_created",
              language: "bn",
            }),
          });
          emailsSent++;
        } catch (emailError) {
          console.error(`[${jobName}] Email sending failed for invoice ${invoice.id}:`, emailError);
        }

      } catch (orderError) {
        const errorMsg = orderError instanceof Error ? orderError.message : "Unknown error";
        console.error(`[${jobName}] Error processing order ${order.id}:`, errorMsg);
        errors.push(`Order ${order.id}: ${errorMsg}`);
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
          invoices_generated: invoicesGenerated,
          emails_sent: emailsSent,
          errors: errors.length > 0 ? errors : undefined,
        },
        error_message: errors.length > 0 ? errors.join("; ") : null,
      })
      .eq("id", jobId);

    console.log(`[${jobName}] Job completed. Invoices: ${invoicesGenerated}, Emails: ${emailsSent}`);

    return new Response(
      JSON.stringify({
        success: true,
        jobId,
        invoicesGenerated,
        emailsSent,
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

    // Update job as failed
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
