import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  invoiceId: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { invoiceId }: VerifyRequest = await req.json();

    if (!invoiceId) {
      return new Response(JSON.stringify({ error: "Invoice ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const uddoktaPayApiKey = Deno.env.get("UDDOKTAPAY_API_KEY");
    if (!uddoktaPayApiKey) {
      return new Response(JSON.stringify({ error: "Payment gateway not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify payment with UddoktaPay
    const verifyResponse = await fetch("https://sandbox.uddoktapay.com/api/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": uddoktaPayApiKey,
      },
      body: JSON.stringify({ invoice_id: invoiceId }),
    });

    const verifyResult = await verifyResponse.json();

    if (!verifyResponse.ok) {
      console.error("UddoktaPay verify error:", verifyResult);
      return new Response(JSON.stringify({ error: "Failed to verify payment" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update payment record
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const paymentStatus = verifyResult.status === "COMPLETED" ? "completed" : 
                          verifyResult.status === "PENDING" ? "pending" : "failed";

    const { data: payment, error: updateError } = await adminClient
      .from("payments")
      .update({
        status: paymentStatus,
        transaction_id: verifyResult.transaction_id,
        payment_method: verifyResult.payment_method,
        fee: verifyResult.fee || 0,
        paid_at: paymentStatus === "completed" ? new Date().toISOString() : null,
        metadata: verifyResult,
      })
      .eq("invoice_id", invoiceId)
      .select("*, orders(*)")
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
    }

    // If payment is completed, update order status and create invoice
    if (paymentStatus === "completed" && payment) {
      // Update order status
      await adminClient
        .from("orders")
        .update({
          status: "completed",
          start_date: new Date().toISOString(),
          expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
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

    return new Response(JSON.stringify({
      success: true,
      status: paymentStatus,
      data: verifyResult,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in verify-payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
