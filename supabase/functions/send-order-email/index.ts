import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "order_placed" | "payment_completed";
  orderId: string;
  userEmail: string;
  userName: string;
  orderNumber: string;
  itemName: string;
  amount: number;
  paymentMethod?: string;
  transactionId?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(resendApiKey);
    const { type, orderId, userEmail, userName, orderNumber, itemName, amount, paymentMethod, transactionId }: EmailRequest = await req.json();

    // Validate required fields
    if (!type || !userEmail || !orderNumber || !itemName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let subject = "";
    let htmlContent = "";

    if (type === "order_placed") {
      subject = `অর্ডার নিশ্চিতকরণ - ${orderNumber}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6b21a8 0%, #ec4899 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">CHost</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0;">Premium Web Hosting</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin: 0 0 20px;">অর্ডার নিশ্চিতকরণ</h2>
              <p style="color: #4b5563; line-height: 1.6;">প্রিয় ${userName || 'গ্রাহক'},</p>
              <p style="color: #4b5563; line-height: 1.6;">আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>
              
              <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #1f2937; margin: 0 0 16px; font-size: 16px;">অর্ডার বিবরণ:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">অর্ডার নম্বর:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">সার্ভিস:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right;">${itemName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">মূল্য:</td>
                    <td style="padding: 8px 0; color: #6b21a8; font-weight: 700; font-size: 18px; text-align: right;">৳${amount}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6;">পেমেন্ট সম্পন্ন হলে আপনার সার্ভিস অ্যাক্টিভেট করা হবে।</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://hostingbdjitu.lovable.app/dashboard/orders" style="display: inline-block; background: linear-gradient(135deg, #6b21a8 0%, #ec4899 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">অর্ডার দেখুন</a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>© 2024 CHost. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === "payment_completed") {
      subject = `পেমেন্ট সফল - ${orderNumber}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">✓ পেমেন্ট সফল</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0;">CHost Premium Hosting</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
              <p style="color: #4b5563; line-height: 1.6;">প্রিয় ${userName || 'গ্রাহক'},</p>
              <p style="color: #4b5563; line-height: 1.6;">আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। ধন্যবাদ!</p>
              
              <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #166534; margin: 0 0 16px; font-size: 16px;">পেমেন্ট বিবরণ:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">অর্ডার নম্বর:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">সার্ভিস:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right;">${itemName}</td>
                  </tr>
                  ${transactionId ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">ট্রানজ্যাকশন ID:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-family: monospace; text-align: right;">${transactionId}</td>
                  </tr>
                  ` : ''}
                  ${paymentMethod ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">পেমেন্ট মেথড:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right;">${paymentMethod}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">মূল্য:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: 700; font-size: 18px; text-align: right;">৳${amount}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6;">আপনার সার্ভিস শীঘ্রই অ্যাক্টিভেট করা হবে। কোন প্রশ্ন থাকলে সাপোর্টে যোগাযোগ করুন।</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://hostingbdjitu.lovable.app/dashboard" style="display: inline-block; background: linear-gradient(135deg, #6b21a8 0%, #ec4899 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">ড্যাশবোর্ড দেখুন</a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>© 2024 CHost. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "CHost <onboarding@resend.dev>",
      to: [userEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log to database
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await adminClient.from("webhook_logs").insert({
      provider: "resend",
      event_type: `email_${type}`,
      payload: { orderId, userEmail, orderNumber, emailId: emailResponse.data?.id },
      status: "success",
      processed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in send-order-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
