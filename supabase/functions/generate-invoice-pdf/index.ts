import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CHost brand colors
const BRAND_PRIMARY = '#10B981';
const BRAND_SECONDARY = '#6b21a8';

interface InvoiceData {
  invoice_number: string;
  amount: number;
  tax: number | null;
  total: number;
  status: string;
  created_at: string;
  due_date: string | null;
  paid_at: string | null;
  user_id: string;
  payments?: {
    payment_method: string | null;
    transaction_id: string | null;
    orders?: {
      item_name: string;
      billing_cycle: string;
      domain_name: string | null;
      order_number: string;
    };
  };
}

interface ProfileData {
  full_name: string | null;
  email: string;
  phone: string | null;
  company_name: string | null;
  address: string | null;
}

interface OrderData {
  item_name: string;
  billing_cycle: string;
  domain_name: string | null;
  order_number: string;
}

const generateInvoiceHTML = (
  invoice: InvoiceData, 
  profile: ProfileData | null,
  order: OrderData | null
): string => {
  const issueDate = new Date(invoice.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  const dueDate = invoice.due_date 
    ? new Date(invoice.due_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : 'On Receipt';

  const paidDate = invoice.paid_at 
    ? new Date(invoice.paid_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      color: #1f2937; 
      line-height: 1.5;
      background: #f9fafb;
    }
    
    .invoice { 
      max-width: 800px; 
      margin: 20px auto; 
      background: #fff; 
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .header { 
      background: linear-gradient(135deg, ${BRAND_PRIMARY} 0%, #059669 100%);
      padding: 32px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-section { color: white; }
    
    .logo { 
      font-size: 32px; 
      font-weight: 700; 
      letter-spacing: -1px;
      margin-bottom: 4px;
    }
    
    .tagline { 
      font-size: 12px; 
      opacity: 0.9;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .invoice-badge {
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      padding: 16px 24px;
      border-radius: 12px;
      text-align: right;
      color: white;
    }
    
    .invoice-badge h2 {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
      margin-bottom: 4px;
    }
    
    .invoice-badge .number {
      font-size: 20px;
      font-weight: 700;
    }
    
    .content { padding: 40px; }
    
    .meta-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .meta-item h4 {
      font-size: 11px;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }
    
    .meta-item p {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-paid { 
      background: #d1fae5; 
      color: #059669; 
    }
    
    .status-unpaid { 
      background: #fef3c7; 
      color: #d97706; 
    }
    
    .addresses {
      display: flex;
      justify-content: space-between;
      gap: 40px;
      margin-bottom: 32px;
    }
    
    .address {
      flex: 1;
      padding: 20px;
      background: #f9fafb;
      border-radius: 10px;
    }
    
    .address h3 {
      font-size: 11px;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 12px;
      letter-spacing: 1px;
    }
    
    .address .name {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
    }
    
    .address p {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    
    .items-table th {
      text-align: left;
      padding: 14px 16px;
      background: #f3f4f6;
      font-size: 11px;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    .items-table th:last-child {
      text-align: right;
    }
    
    .items-table td {
      padding: 20px 16px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    
    .items-table td:last-child {
      text-align: right;
      font-weight: 600;
    }
    
    .item-name {
      font-weight: 600;
      color: #1f2937;
    }
    
    .item-detail {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    
    .totals {
      display: flex;
      justify-content: flex-end;
    }
    
    .totals-box {
      width: 280px;
      background: #f9fafb;
      border-radius: 10px;
      padding: 20px;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    
    .totals-row.total {
      border-top: 2px solid ${BRAND_PRIMARY};
      margin-top: 8px;
      padding-top: 16px;
    }
    
    .totals-row.total .label,
    .totals-row.total .value {
      font-size: 18px;
      font-weight: 700;
      color: ${BRAND_PRIMARY};
    }
    
    .label { color: #6b7280; }
    .value { font-weight: 600; color: #1f2937; }
    
    .payment-info {
      margin-top: 24px;
      padding: 16px;
      background: #f0fdf4;
      border-radius: 8px;
      border-left: 4px solid ${BRAND_PRIMARY};
    }
    
    .payment-info h4 {
      font-size: 12px;
      color: #059669;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .payment-info p {
      font-size: 13px;
      color: #1f2937;
    }
    
    .footer {
      background: #1f2937;
      color: white;
      padding: 32px 40px;
      text-align: center;
    }
    
    .footer-content {
      margin-bottom: 16px;
    }
    
    .footer h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .footer p {
      font-size: 13px;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      padding-top: 16px;
      border-top: 1px solid #374151;
    }
    
    .footer-links a {
      color: ${BRAND_PRIMARY};
      text-decoration: none;
      font-size: 13px;
    }
    
    .copyright {
      margin-top: 16px;
      font-size: 11px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="logo-section">
        <div class="logo">CHOST</div>
        <div class="tagline">Secure • Fast • Online</div>
      </div>
      <div class="invoice-badge">
        <h2>Invoice</h2>
        <div class="number">${invoice.invoice_number}</div>
      </div>
    </div>
    
    <div class="content">
      <div class="meta-row">
        <div class="meta-item">
          <h4>Issue Date</h4>
          <p>${issueDate}</p>
        </div>
        <div class="meta-item">
          <h4>Due Date</h4>
          <p>${dueDate}</p>
        </div>
        <div class="meta-item">
          <h4>Status</h4>
          <span class="status-badge ${invoice.status === 'paid' ? 'status-paid' : 'status-unpaid'}">
            ${invoice.status === 'paid' ? '✓ Paid' : '⏳ Unpaid'}
          </span>
        </div>
        ${paidDate ? `
        <div class="meta-item">
          <h4>Paid On</h4>
          <p>${paidDate}</p>
        </div>
        ` : ''}
      </div>
      
      <div class="addresses">
        <div class="address">
          <h3>From</h3>
          <div class="name">CHost - Premium Hosting</div>
          <p>House#71, Road#27, Gulshan-01</p>
          <p>Dhaka, Bangladesh</p>
          <p>support@chostbd.com</p>
          <p>License: 132653</p>
        </div>
        <div class="address">
          <h3>Bill To</h3>
          <div class="name">${profile?.full_name || 'Customer'}</div>
          <p>${profile?.email || ''}</p>
          ${profile?.phone ? `<p>${profile.phone}</p>` : ''}
          ${profile?.company_name ? `<p>${profile.company_name}</p>` : ''}
          ${profile?.address ? `<p>${profile.address}</p>` : ''}
        </div>
      </div>
      
      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Billing Cycle</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="item-name">${order?.item_name || 'Service'}</div>
              ${order?.domain_name ? `<div class="item-detail">Domain: ${order.domain_name}</div>` : ''}
              ${order?.order_number ? `<div class="item-detail">Order: ${order.order_number}</div>` : ''}
            </td>
            <td>${order?.billing_cycle || 'One-time'}</td>
            <td>৳${Number(invoice.amount).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="totals">
        <div class="totals-box">
          <div class="totals-row">
            <span class="label">Subtotal</span>
            <span class="value">৳${Number(invoice.amount).toLocaleString()}</span>
          </div>
          <div class="totals-row">
            <span class="label">Tax (VAT)</span>
            <span class="value">৳${Number(invoice.tax || 0).toLocaleString()}</span>
          </div>
          <div class="totals-row total">
            <span class="label">Total</span>
            <span class="value">৳${Number(invoice.total).toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      ${invoice.payments?.payment_method ? `
      <div class="payment-info">
        <h4>Payment Information</h4>
        <p><strong>Method:</strong> ${invoice.payments.payment_method}</p>
        ${invoice.payments.transaction_id ? `<p><strong>Transaction ID:</strong> ${invoice.payments.transaction_id}</p>` : ''}
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <div class="footer-content">
        <h3>Thank you for choosing CHost!</h3>
        <p>For any questions, please contact us at support@chostbd.com</p>
      </div>
      <div class="footer-links">
        <a href="https://hostingbdjitu.lovable.app">Website</a>
        <a href="https://hostingbdjitu.lovable.app/support">Support</a>
        <a href="https://hostingbdjitu.lovable.app/client">Dashboard</a>
      </div>
      <div class="copyright">
        © 2026 CHostbd. All Rights Reserved. Design & Developed: CreationTech
      </div>
    </div>
  </div>
</body>
</html>`;
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

    const { invoiceId, regenerate } = await req.json();
    
    if (!invoiceId) {
      return new Response(JSON.stringify({ error: 'Invoice ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role for full access
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch invoice with payment and order details
    const { data: invoice, error: invoiceError } = await adminClient
      .from('invoices')
      .select('*, payments(*, orders(*))')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error('Invoice fetch error:', invoiceError);
      return new Response(JSON.stringify({ error: 'Invoice not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has access (owner or admin)
    const userId = authData.claims.sub;
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    const isAdmin = userRole?.role === 'admin';
    if (invoice.user_id !== userId && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user profile
    const { data: profile } = await adminClient
      .from('profiles')
      .select('*')
      .eq('user_id', invoice.user_id)
      .single();

    const order = invoice.payments?.orders;

    // Generate HTML
    const invoiceHtml = generateInvoiceHTML(invoice as InvoiceData, profile, order);

    // Store the HTML content for PDF conversion (client-side)
    // In production, you'd use a PDF service like Puppeteer or PDFKit
    
    // Create a signed URL path for storage
    const pdfPath = `${invoice.user_id}/${invoice.invoice_number}.pdf`;

    return new Response(JSON.stringify({ 
      success: true, 
      html: invoiceHtml,
      pdfPath,
      invoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
        tax: invoice.tax,
        total: invoice.total,
        status: invoice.status,
        created_at: invoice.created_at,
        due_date: invoice.due_date,
        paid_at: invoice.paid_at,
        item_name: order?.item_name,
        billing_cycle: order?.billing_cycle,
        domain_name: order?.domain_name,
        order_number: order?.order_number,
        payment_method: invoice.payments?.payment_method,
        transaction_id: invoice.payments?.transaction_id,
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
