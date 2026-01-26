import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, rt-uddoktapay-api-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const adminClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Get the API key from header
    const webhookApiKey = req.headers.get("RT-UDDOKTAPAY-API-KEY");
    const configuredApiKey = Deno.env.get("UDDOKTAPAY_API_KEY");

    // Validate webhook source
    if (!webhookApiKey || webhookApiKey !== configuredApiKey) {
      console.error("Invalid webhook API key");
      
      // Log the failed attempt
      await adminClient.from("webhook_logs").insert({
        provider: "uddoktapay",
        event_type: "invalid_key",
        payload: { headers: Object.fromEntries(req.headers.entries()) },
        status: "failed",
        error_message: "Invalid API key",
      });

      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    
    // Log the webhook
    const { data: webhookLog, error: logError } = await adminClient
      .from("webhook_logs")
      .insert({
        provider: "uddoktapay",
        event_type: payload.status,
        invoice_id: payload.invoice_id,
        payload: payload,
        status: "received",
      })
      .select()
      .single();

    if (logError) {
      console.error("Failed to log webhook:", logError);
    }

    // Check for duplicate processing
    const { data: existingPayment } = await adminClient
      .from("payments")
      .select("id, status")
      .eq("invoice_id", payload.invoice_id)
      .single();

    if (existingPayment?.status === "completed") {
      console.log("Payment already processed:", payload.invoice_id);
      
      // Update webhook log
      if (webhookLog) {
        await adminClient
          .from("webhook_logs")
          .update({
            status: "processed",
            error_message: "Already processed",
            processed_at: new Date().toISOString(),
          })
          .eq("id", webhookLog.id);
      }

      return new Response(JSON.stringify({ success: true, message: "Already processed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Process the payment update
    const paymentStatus = payload.status === "COMPLETED" ? "completed" : 
                          payload.status === "PENDING" ? "pending" : "failed";

    const { data: payment, error: updateError } = await adminClient
      .from("payments")
      .update({
        status: paymentStatus,
        transaction_id: payload.transaction_id,
        payment_method: payload.payment_method,
        fee: payload.fee || 0,
        paid_at: paymentStatus === "completed" ? new Date().toISOString() : null,
        metadata: payload,
      })
      .eq("invoice_id", payload.invoice_id)
      .select()
      .single();

    if (updateError) {
      console.error("Failed to update payment:", updateError);
      
      if (webhookLog) {
        await adminClient
          .from("webhook_logs")
          .update({
            status: "failed",
            error_message: updateError.message,
            processed_at: new Date().toISOString(),
          })
          .eq("id", webhookLog.id);
      }

      return new Response(JSON.stringify({ error: "Failed to process payment" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If payment is completed, update order and create invoice
    if (paymentStatus === "completed" && payment) {
      // Update order status
      await adminClient
        .from("orders")
        .update({
          status: "completed",
          start_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("id", payment.order_id);

      // Create invoice
      const invoiceNumber = `INV-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
      
      await adminClient
        .from("invoices")
        .insert({
          payment_id: payment.id,
          user_id: payment.user_id,
          invoice_number: invoiceNumber,
          amount: payment.amount,
          total: payment.amount,
          status: "paid",
          paid_at: new Date().toISOString(),
        });
    }

    // Update webhook log as processed
    if (webhookLog) {
      await adminClient
        .from("webhook_logs")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
        })
        .eq("id", webhookLog.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in payment-webhook:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Log the error
    await adminClient.from("webhook_logs").insert({
      provider: "uddoktapay",
      event_type: "error",
      payload: { error: errorMessage },
      status: "failed",
      error_message: errorMessage,
    });

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
