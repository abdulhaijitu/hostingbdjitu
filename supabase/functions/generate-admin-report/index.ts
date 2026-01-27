import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportRequest {
  reportType: 'monthly_revenue' | 'payment_summary' | 'refund_summary' | 'new_customers';
  startDate?: string;
  endDate?: string;
}

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  refunds: number;
  refundAmount: number;
  newCustomers: number;
  averageOrderValue: number;
  topProducts: Array<{ name: string; count: number; revenue: number }>;
}

const generateReportHTML = (
  reportType: string,
  data: ReportData,
  startDate: string,
  endDate: string
): string => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const reportTitles: Record<string, string> = {
    monthly_revenue: 'Monthly Revenue Report',
    payment_summary: 'Payment Summary Report',
    refund_summary: 'Refund Summary Report',
    new_customers: 'New Customer Report'
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitles[reportType]} - CHost Admin</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', sans-serif; 
      color: #1f2937; 
      line-height: 1.5;
      background: #f9fafb;
      padding: 40px;
    }
    
    .report { 
      max-width: 900px; 
      margin: 0 auto; 
      background: #fff; 
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .header { 
      background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
      padding: 32px 40px;
      color: white;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .logo { 
      font-size: 24px; 
      font-weight: 700;
      color: #10B981;
    }
    
    .report-badge {
      background: rgba(16, 185, 129, 0.2);
      color: #10B981;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .report-title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .report-period {
      color: #9ca3af;
      font-size: 14px;
    }
    
    .content { padding: 40px; }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .summary-card {
      background: #f9fafb;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    
    .summary-card.highlight {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: white;
    }
    
    .summary-card .value {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .summary-card.highlight .value {
      color: white;
    }
    
    .summary-card .label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .summary-card.highlight .label {
      color: rgba(255,255,255,0.8);
    }
    
    .section {
      margin-bottom: 32px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th {
      text-align: left;
      padding: 12px 16px;
      background: #f3f4f6;
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 0.5px;
    }
    
    .data-table td {
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .data-table td:last-child {
      text-align: right;
      font-weight: 600;
    }
    
    .progress-bar {
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 8px;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      border-radius: 4px;
    }
    
    .footer {
      background: #f9fafb;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer p {
      color: #6b7280;
      font-size: 12px;
    }
    
    .generated-at {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="report">
    <div class="header">
      <div class="header-top">
        <div class="logo">CHOST</div>
        <span class="report-badge">Admin Report</span>
      </div>
      <h1 class="report-title">${reportTitles[reportType]}</h1>
      <p class="report-period">${formatDate(startDate)} - ${formatDate(endDate)}</p>
    </div>
    
    <div class="content">
      <div class="summary-grid">
        <div class="summary-card highlight">
          <div class="value">৳${data.totalRevenue.toLocaleString()}</div>
          <div class="label">Total Revenue</div>
        </div>
        <div class="summary-card">
          <div class="value">${data.totalOrders}</div>
          <div class="label">Total Orders</div>
        </div>
        <div class="summary-card">
          <div class="value">${data.successfulPayments}</div>
          <div class="label">Successful Payments</div>
        </div>
        <div class="summary-card">
          <div class="value">${data.newCustomers}</div>
          <div class="label">New Customers</div>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">Payment Breakdown</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Count</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Successful Payments</td>
              <td>${data.successfulPayments}</td>
              <td>৳${data.totalRevenue.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Failed Payments</td>
              <td>${data.failedPayments}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Refunds Processed</td>
              <td>${data.refunds}</td>
              <td>৳${data.refundAmount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2 class="section-title">Key Metrics</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Average Order Value (AOV)</td>
              <td>৳${data.averageOrderValue.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Payment Success Rate</td>
              <td>${data.totalPayments > 0 ? ((data.successfulPayments / data.totalPayments) * 100).toFixed(1) : 0}%</td>
            </tr>
            <tr>
              <td>Net Revenue (After Refunds)</td>
              <td>৳${(data.totalRevenue - data.refundAmount).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      ${data.topProducts.length > 0 ? `
      <div class="section">
        <h2 class="section-title">Top Products</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${data.topProducts.map(p => `
            <tr>
              <td>${p.name}</td>
              <td>${p.count}</td>
              <td>৳${p.revenue.toLocaleString()}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p>CHost Admin Dashboard - Confidential Report</p>
      <p class="generated-at">Generated on ${new Date().toLocaleString('en-GB')}</p>
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

    // Use service role for admin check and data access
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin role
    const userId = authData.claims.sub;
    const { data: userRole } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (userRole?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { reportType, startDate, endDate }: ReportRequest = await req.json();

    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch payments data
    const { data: payments } = await adminClient
      .from('payments')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    // Fetch orders data
    const { data: orders } = await adminClient
      .from('orders')
      .select('*')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    // Fetch new customers (profiles created in period)
    const { data: newProfiles } = await adminClient
      .from('profiles')
      .select('id')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    // Calculate metrics
    const successfulPayments = payments?.filter(p => p.status === 'completed') || [];
    const failedPayments = payments?.filter(p => p.status === 'failed') || [];
    const refundedPayments = payments?.filter(p => p.status === 'refunded') || [];

    const totalRevenue = successfulPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const refundAmount = refundedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    
    // Calculate top products
    const productMap = new Map<string, { count: number; revenue: number }>();
    orders?.forEach(order => {
      const existing = productMap.get(order.item_name) || { count: 0, revenue: 0 };
      productMap.set(order.item_name, {
        count: existing.count + 1,
        revenue: existing.revenue + Number(order.amount)
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const reportData: ReportData = {
      totalRevenue,
      totalOrders: orders?.length || 0,
      totalPayments: payments?.length || 0,
      successfulPayments: successfulPayments.length,
      failedPayments: failedPayments.length,
      refunds: refundedPayments.length,
      refundAmount,
      newCustomers: newProfiles?.length || 0,
      averageOrderValue: orders && orders.length > 0 
        ? Math.round(totalRevenue / orders.length) 
        : 0,
      topProducts
    };

    // Generate HTML report
    const reportHtml = generateReportHTML(
      reportType,
      reportData,
      start.toISOString(),
      end.toISOString()
    );

    // Log job execution
    await adminClient.from('scheduled_jobs').insert({
      job_name: `${reportType}_report`,
      job_type: 'report_generation',
      status: 'completed',
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      metadata: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        metrics: reportData
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      html: reportHtml,
      data: reportData,
      period: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error generating report:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
