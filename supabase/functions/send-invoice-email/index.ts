import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  invoiceId: string;
  emailType: 
    | "invoice_created" 
    | "payment_success" 
    | "payment_failed" 
    | "refund_approved"
    | "service_expiring";
  language?: 'en' | 'bn';
}

const emailTemplates = {
  invoice_created: {
    en: {
      subject: (invoiceNumber: string) => `Invoice ${invoiceNumber} - Payment Required`,
      heading: 'New Invoice',
      message: 'A new invoice has been generated for your account. Please complete the payment before the due date.',
      cta: 'Pay Now',
      ctaUrl: (invoiceId: string) => `https://hostingbdjitu.lovable.app/dashboard/invoices`,
    },
    bn: {
      subject: (invoiceNumber: string) => `ইনভয়েস ${invoiceNumber} - পেমেন্ট প্রয়োজন`,
      heading: 'নতুন ইনভয়েস',
      message: 'আপনার অ্যাকাউন্টের জন্য একটি নতুন ইনভয়েস তৈরি করা হয়েছে। অনুগ্রহ করে নির্ধারিত তারিখের আগে পেমেন্ট সম্পন্ন করুন।',
      cta: 'এখনই পে করুন',
      ctaUrl: (invoiceId: string) => `https://hostingbdjitu.lovable.app/dashboard/invoices`,
    }
  },
  payment_success: {
    en: {
      subject: (invoiceNumber: string) => `Payment Confirmed - ${invoiceNumber}`,
      heading: '✓ Payment Successful',
      message: 'Thank you! Your payment has been successfully processed. Your invoice is attached below.',
      cta: 'View Dashboard',
      ctaUrl: () => `https://hostingbdjitu.lovable.app/client`,
    },
    bn: {
      subject: (invoiceNumber: string) => `পেমেন্ট সফল - ${invoiceNumber}`,
      heading: '✓ পেমেন্ট সফল',
      message: 'ধন্যবাদ! আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। আপনার ইনভয়েস নিচে সংযুক্ত আছে।',
      cta: 'ড্যাশবোর্ড দেখুন',
      ctaUrl: () => `https://hostingbdjitu.lovable.app/client`,
    }
  },
  payment_failed: {
    en: {
      subject: (invoiceNumber: string) => `Payment Failed - ${invoiceNumber}`,
      heading: '⚠ Payment Failed',
      message: 'Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.',
      cta: 'Retry Payment',
      ctaUrl: (invoiceId: string) => `https://hostingbdjitu.lovable.app/dashboard/invoices`,
    },
    bn: {
      subject: (invoiceNumber: string) => `পেমেন্ট ব্যর্থ - ${invoiceNumber}`,
      heading: '⚠ পেমেন্ট ব্যর্থ',
      message: 'দুঃখিত, আপনার পেমেন্ট প্রক্রিয়া করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন অথবা সমস্যা থাকলে সাপোর্টে যোগাযোগ করুন।',
      cta: 'আবার চেষ্টা করুন',
      ctaUrl: (invoiceId: string) => `https://hostingbdjitu.lovable.app/dashboard/invoices`,
    }
  },
  refund_approved: {
    en: {
      subject: (invoiceNumber: string) => `Refund Approved - ${invoiceNumber}`,
      heading: '💰 Refund Approved',
      message: 'Your refund request has been approved. The amount will be credited to your original payment method within 5-10 business days.',
      cta: 'View Details',
      ctaUrl: () => `https://hostingbdjitu.lovable.app/dashboard/invoices`,
    },
    bn: {
      subject: (invoiceNumber: string) => `রিফান্ড অনুমোদিত - ${invoiceNumber}`,
      heading: '💰 রিফান্ড অনুমোদিত',
      message: 'আপনার রিফান্ড অনুরোধ অনুমোদিত হয়েছে। ৫-১০ কার্যদিবসের মধ্যে মূল পেমেন্ট মেথডে টাকা ফেরত দেওয়া হবে।',
      cta: 'বিস্তারিত দেখুন',
      ctaUrl: () => `https://hostingbdjitu.lovable.app/dashboard/invoices`,
    }
  },
  service_expiring: {
    en: {
      subject: (invoiceNumber: string) => `Service Expiring Soon - Action Required`,
      heading: '⏰ Service Expiring Soon',
      message: 'Your service is expiring soon. Renew now to avoid any interruption in your hosting services.',
      cta: 'Renew Now',
      ctaUrl: () => `https://hostingbdjitu.lovable.app/client/hosting`,
    },
    bn: {
      subject: (invoiceNumber: string) => `সার্ভিস মেয়াদ শেষ হচ্ছে - পদক্ষেপ প্রয়োজন`,
      heading: '⏰ সার্ভিস মেয়াদ শেষ হচ্ছে',
      message: 'আপনার সার্ভিসের মেয়াদ শীঘ্রই শেষ হচ্ছে। হোস্টিং সার্ভিসে কোনো বিঘ্ন এড়াতে এখনই রিনিউ করুন।',
      cta: 'এখনই রিনিউ করুন',
      ctaUrl: () => `https://hostingbdjitu.lovable.app/client/hosting`,
    }
  }
};

const generateEmailHTML = (
  template: typeof emailTemplates.invoice_created.en,
  invoice: any,
  customer: any,
  colorScheme: 'success' | 'warning' | 'danger' | 'primary' = 'primary'
) => {
  const colors = {
    success: { bg: '#059669', light: '#d1fae5' },
    warning: { bg: '#d97706', light: '#fef3c7' },
    danger: { bg: '#dc2626', light: '#fee2e2' },
    primary: { bg: '#10B981', light: '#d1fae5' }
  };
  
  const color = colors[colorScheme];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, ${color.bg} 0%, #059669 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">CHost</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Secure • Fast • Online</p>
    </div>
    
    <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 24px;">${template.heading}</h2>
      
      <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
        Dear ${customer?.full_name || 'Valued Customer'},
      </p>
      
      <p style="color: #4b5563; line-height: 1.6; margin-bottom: 24px;">
        ${template.message}
      </p>
      
      <div style="background: ${color.light}; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Invoice Number:</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: 600; text-align: right;">${invoice.invoice_number}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Amount:</td>
            <td style="padding: 10px 0; color: ${color.bg}; font-weight: 700; font-size: 20px; text-align: right;">৳${Number(invoice.total).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Status:</td>
            <td style="padding: 10px 0; text-align: right;">
              <span style="background: ${color.bg}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                ${invoice.status}
              </span>
            </td>
          </tr>
          ${invoice.due_date ? `
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px;">Due Date:</td>
            <td style="padding: 10px 0; color: #1f2937; text-align: right;">${new Date(invoice.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
          </tr>
          ` : ''}
        </table>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${template.ctaUrl(invoice.id)}" style="display: inline-block; background: linear-gradient(135deg, ${color.bg} 0%, #059669 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          ${template.cta}
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 24px;">
        If you have any questions, please don't hesitate to contact our support team at 
        <a href="mailto:support@chostbd.com" style="color: ${color.bg};">support@chostbd.com</a>
      </p>
    </div>
    
    <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0 0 8px;">CHost - Premium Web Hosting</p>
      <p style="margin: 0 0 8px;">House#71, Road#27, Gulshan-01, Dhaka</p>
      <p style="margin: 0;">© 2026 CHostbd. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

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
    const { invoiceId, emailType, language = 'bn' }: EmailRequest = await req.json();

    if (!invoiceId || !emailType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role for full access
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch invoice with details
    const { data: invoice, error: invoiceError } = await adminClient
      .from('invoices')
      .select('*, payments(*, orders(*))')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice fetch error:', invoiceError);
      return new Response(JSON.stringify({ error: "Invoice not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch customer profile
    const { data: profile } = await adminClient
      .from('profiles')
      .select('*')
      .eq('user_id', invoice.user_id)
      .single();

    if (!profile?.email) {
      return new Response(JSON.stringify({ error: "Customer email not found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get template
    const template = emailTemplates[emailType]?.[language] || emailTemplates[emailType]?.en;
    if (!template) {
      return new Response(JSON.stringify({ error: "Invalid email type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine color scheme
    const colorSchemes: Record<string, 'success' | 'warning' | 'danger' | 'primary'> = {
      invoice_created: 'primary',
      payment_success: 'success',
      payment_failed: 'danger',
      refund_approved: 'success',
      service_expiring: 'warning'
    };

    const subject = template.subject(invoice.invoice_number);
    const htmlContent = generateEmailHTML(
      template,
      invoice,
      profile,
      colorSchemes[emailType]
    );

    // Send email
    const emailResponse = await resend.emails.send({
      from: "CHost <onboarding@resend.dev>",
      to: [profile.email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log to email_logs table
    await adminClient.from("email_logs").insert({
      user_id: invoice.user_id,
      email_type: emailType,
      recipient_email: profile.email,
      subject: subject,
      status: emailResponse.data?.id ? 'sent' : 'failed',
      resend_id: emailResponse.data?.id,
      related_id: invoiceId,
      related_type: 'invoice',
      sent_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: 'Email sent successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error in send-invoice-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
