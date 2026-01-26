import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemName: string;
  redirectUrl: string;
  cancelUrl: string;
  webhookUrl: string;
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

    const userId = claimsData.claims.sub;
    const { orderId, amount, customerName, customerEmail, customerPhone, itemName, redirectUrl, cancelUrl, webhookUrl }: PaymentRequest = await req.json();

    // Validate required fields
    if (!orderId || !amount || !customerName || !customerEmail || !itemName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const uddoktaPayApiKey = Deno.env.get("UDDOKTAPAY_API_KEY");
    if (!uddoktaPayApiKey) {
      console.error("UDDOKTAPAY_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Payment gateway not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create payment with UddoktaPay
    const paymentData = {
      full_name: customerName,
      email: customerEmail,
      amount: amount.toString(),
      metadata: {
        order_id: orderId,
        user_id: userId,
        item_name: itemName,
      },
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
      webhook_url: webhookUrl,
    };

    const uddoktaResponse = await fetch("https://sandbox.uddoktapay.com/api/checkout-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-UDDOKTAPAY-API-KEY": uddoktaPayApiKey,
      },
      body: JSON.stringify(paymentData),
    });

    const uddoktaResult = await uddoktaResponse.json();

    if (!uddoktaResponse.ok) {
      console.error("UddoktaPay error:", uddoktaResult);
      return new Response(JSON.stringify({ error: "Failed to create payment" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create payment record in database
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: paymentError } = await adminClient
      .from("payments")
      .insert({
        order_id: orderId,
        user_id: userId,
        invoice_id: uddoktaResult.invoice_id,
        amount: amount,
        status: "pending",
        metadata: { uddoktapay_response: uddoktaResult },
      });

    if (paymentError) {
      console.error("Database error:", paymentError);
    }

    // Send order placed email
    try {
      const emailPayload = {
        type: "order_placed",
        orderId: orderId,
        userEmail: customerEmail,
        userName: customerName,
        orderNumber: orderId,
        itemName: itemName,
        amount: amount,
      };

      await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-order-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify(emailPayload),
      });

      console.log("Order email sent to:", customerEmail);
    } catch (emailError) {
      console.error("Failed to send order email:", emailError);
    }

    return new Response(JSON.stringify({
      success: true,
      payment_url: uddoktaResult.payment_url,
      invoice_id: uddoktaResult.invoice_id,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in create-payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
