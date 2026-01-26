import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getClaims(token);
    
    if (authError || !authData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { invoiceId } = await req.json();
    
    if (!invoiceId) {
      return new Response(JSON.stringify({ error: 'Invoice ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch invoice with payment and order details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, payments(*, orders(*))')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', invoice.user_id)
      .single();

    const order = invoice.payments?.orders;

    // Generate HTML for PDF
    const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
    .invoice { max-width: 800px; margin: 0 auto; padding: 40px; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #10B981; }
    .logo { font-size: 28px; font-weight: bold; color: #10B981; }
    .invoice-info { text-align: right; }
    .invoice-info h2 { font-size: 24px; color: #10B981; margin-bottom: 5px; }
    .invoice-info p { color: #666; }
    .addresses { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .address { width: 45%; }
    .address h3 { font-size: 14px; color: #999; text-transform: uppercase; margin-bottom: 10px; }
    .address p { color: #333; }
    .items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e9ecef; }
    .items td { padding: 12px; border-bottom: 1px solid #e9ecef; }
    .items .amount { text-align: right; }
    .totals { margin-left: auto; width: 300px; }
    .totals table { width: 100%; }
    .totals td { padding: 8px 0; }
    .totals .label { color: #666; }
    .totals .value { text-align: right; font-weight: 500; }
    .totals .total-row td { font-size: 18px; font-weight: bold; color: #10B981; border-top: 2px solid #10B981; padding-top: 12px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; color: #999; font-size: 12px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-paid { background: #d1fae5; color: #059669; }
    .status-unpaid { background: #fee2e2; color: #dc2626; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="logo">CHOST</div>
      <div class="invoice-info">
        <h2>INVOICE</h2>
        <p><strong>${invoice.invoice_number}</strong></p>
        <p>Date: ${new Date(invoice.created_at).toLocaleDateString('en-GB')}</p>
        <span class="status ${invoice.status === 'paid' ? 'status-paid' : 'status-unpaid'}">${invoice.status.toUpperCase()}</span>
      </div>
    </div>

    <div class="addresses">
      <div class="address">
        <h3>From</h3>
        <p><strong>CHOST - Premium Hosting</strong></p>
        <p>Dhaka, Bangladesh</p>
        <p>support@chost.com</p>
        <p>+880 1234-567890</p>
      </div>
      <div class="address">
        <h3>Bill To</h3>
        <p><strong>${profile?.full_name || 'Customer'}</strong></p>
        <p>${profile?.email || ''}</p>
        ${profile?.phone ? `<p>${profile.phone}</p>` : ''}
        ${profile?.company_name ? `<p>${profile.company_name}</p>` : ''}
        ${profile?.address ? `<p>${profile.address}</p>` : ''}
      </div>
    </div>

    <table class="items">
      <thead>
        <tr>
          <th>Description</th>
          <th>Billing</th>
          <th class="amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${order?.item_name || 'Service'}</strong>
            ${order?.domain_name ? `<br><small>Domain: ${order.domain_name}</small>` : ''}
          </td>
          <td>${order?.billing_cycle || 'One-time'}</td>
          <td class="amount">৳${invoice.amount.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <table>
        <tr>
          <td class="label">Subtotal</td>
          <td class="value">৳${invoice.amount.toLocaleString()}</td>
        </tr>
        <tr>
          <td class="label">Tax</td>
          <td class="value">৳${(invoice.tax || 0).toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td class="label">Total</td>
          <td class="value">৳${invoice.total.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p>If you have any questions, please contact us at support@chost.com</p>
    </div>
  </div>
</body>
</html>`;

    return new Response(JSON.stringify({ 
      success: true, 
      html: invoiceHtml,
      invoice: {
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
        tax: invoice.tax,
        total: invoice.total,
        status: invoice.status,
        created_at: invoice.created_at,
        item_name: order?.item_name,
        billing_cycle: order?.billing_cycle,
        domain_name: order?.domain_name,
        customer: {
          name: profile?.full_name,
          email: profile?.email,
          phone: profile?.phone,
          company: profile?.company_name,
          address: profile?.address,
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
