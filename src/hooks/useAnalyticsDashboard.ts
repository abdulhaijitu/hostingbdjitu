import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { format, subDays, startOfDay, endOfDay, startOfMonth, parseISO } from 'date-fns';

// ═══════════════════════════════════════════════════════════════
// ANALYTICS QUERY CONFIG - Optimized for dashboard performance
// ═══════════════════════════════════════════════════════════════
const QUERY_CONFIG = {
  staleTime: 2 * 60 * 1000, // Data fresh for 2 minutes
  gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  refetchOnWindowFocus: false,
  refetchOnMount: false as const,
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
};

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
export interface DateRange {
  from: Date;
  to: Date;
}

export interface KPIData {
  todayRevenue: number;
  monthRevenue: number;
  activeCustomers: number;
  activeHostingAccounts: number;
  activeDomains: number;
  pendingInvoices: number;
  pendingInvoicesAmount: number;
  failedPayments: number;
  failedPaymentsAmount: number;
}

export interface RevenueByProduct {
  hosting: number;
  vps: number;
  dedicated: number;
  domain: number;
  other: number;
}

export interface RevenueByPaymentMethod {
  method: string;
  amount: number;
  count: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export interface BillingInsights {
  paidInvoices: number;
  paidAmount: number;
  unpaidInvoices: number;
  unpaidAmount: number;
  overdueInvoices: number;
  overdueAmount: number;
  successPayments: number;
  failedPayments: number;
  refundCount: number;
  refundAmount: number;
  averageOrderValue: number;
}

export interface CustomerMetrics {
  newSignupsToday: number;
  newSignupsMonth: number;
  activeCustomers: number;
  inactiveCustomers: number;
  churnRate: number;
}

export interface ExpiringServices {
  hosting7Days: number;
  hosting15Days: number;
  hosting30Days: number;
  domains7Days: number;
  domains15Days: number;
  domains30Days: number;
}

// ═══════════════════════════════════════════════════════════════
// MAIN ANALYTICS HOOK
// ═══════════════════════════════════════════════════════════════
export const useAnalyticsDashboard = (dateRange?: DateRange) => {
  const { user, isAdmin } = useAuth();

  // Fetch all required data in parallel
  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['analytics-orders', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });

  const { data: payments, isLoading: paymentsLoading, refetch: refetchPayments } = useQuery({
    queryKey: ['analytics-payments', dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });

  const { data: invoices, isLoading: invoicesLoading, refetch: refetchInvoices } = useQuery({
    queryKey: ['analytics-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });

  const { data: hostingAccounts, isLoading: hostingLoading, refetch: refetchHosting } = useQuery({
    queryKey: ['analytics-hosting-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_accounts')
        .select('*, hosting_servers(name, server_type)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });

  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
    queryKey: ['analytics-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });

  const { data: hostingPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['analytics-hosting-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_plans')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
    ...QUERY_CONFIG,
  });

  // ═══════════════════════════════════════════════════════════════
  // COMPUTED KPIs
  // ═══════════════════════════════════════════════════════════════
  const kpiData = useMemo<KPIData | null>(() => {
    if (!payments || !orders || !hostingAccounts || !profiles || !invoices) return null;

    const today = new Date();
    const startOfToday = startOfDay(today);
    const startOfThisMonth = startOfMonth(today);

    // Revenue calculations
    const completedPayments = payments.filter(p => p.status === 'completed');
    const todayRevenue = completedPayments
      .filter(p => new Date(p.created_at) >= startOfToday)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const monthRevenue = completedPayments
      .filter(p => new Date(p.created_at) >= startOfThisMonth)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    // Active customers (with at least one completed order)
    const activeCustomers = new Set(
      orders.filter(o => o.status === 'completed').map(o => o.user_id)
    ).size;

    // Active hosting accounts
    const activeHostingAccounts = hostingAccounts.filter(h => h.status === 'active').length;

    // Active domains (from domain orders)
    const activeDomains = orders.filter(
      o => o.order_type === 'domain' && o.status === 'completed'
    ).length;

    // Pending invoices
    const pendingInvoicesList = invoices.filter(i => i.status === 'unpaid' || i.status === 'pending');
    const pendingInvoices = pendingInvoicesList.length;
    const pendingInvoicesAmount = pendingInvoicesList.reduce((sum, i) => sum + Number(i.total), 0);

    // Failed payments
    const failedPaymentsList = payments.filter(p => p.status === 'failed');
    const failedPayments = failedPaymentsList.length;
    const failedPaymentsAmount = failedPaymentsList.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      todayRevenue,
      monthRevenue,
      activeCustomers,
      activeHostingAccounts,
      activeDomains,
      pendingInvoices,
      pendingInvoicesAmount,
      failedPayments,
      failedPaymentsAmount,
    };
  }, [payments, orders, hostingAccounts, profiles, invoices]);

  // ═══════════════════════════════════════════════════════════════
  // REVENUE BY PRODUCT
  // ═══════════════════════════════════════════════════════════════
  const revenueByProduct = useMemo<RevenueByProduct | null>(() => {
    if (!orders) return null;

    const completedOrders = orders.filter(o => o.status === 'completed');
    
    return {
      hosting: completedOrders
        .filter(o => ['hosting', 'web-hosting', 'wordpress-hosting'].includes(o.order_type?.toLowerCase() || ''))
        .reduce((sum, o) => sum + Number(o.amount), 0),
      vps: completedOrders
        .filter(o => o.order_type?.toLowerCase().includes('vps'))
        .reduce((sum, o) => sum + Number(o.amount), 0),
      dedicated: completedOrders
        .filter(o => o.order_type?.toLowerCase().includes('dedicated'))
        .reduce((sum, o) => sum + Number(o.amount), 0),
      domain: completedOrders
        .filter(o => o.order_type?.toLowerCase() === 'domain')
        .reduce((sum, o) => sum + Number(o.amount), 0),
      other: completedOrders
        .filter(o => !['hosting', 'web-hosting', 'wordpress-hosting', 'vps', 'dedicated', 'domain']
          .some(type => o.order_type?.toLowerCase().includes(type)))
        .reduce((sum, o) => sum + Number(o.amount), 0),
    };
  }, [orders]);

  // ═══════════════════════════════════════════════════════════════
  // REVENUE BY PAYMENT METHOD
  // ═══════════════════════════════════════════════════════════════
  const revenueByPaymentMethod = useMemo<RevenueByPaymentMethod[]>(() => {
    if (!payments) return [];

    const completedPayments = payments.filter(p => p.status === 'completed');
    const methodMap: Record<string, { amount: number; count: number }> = {};

    completedPayments.forEach(p => {
      const method = p.payment_method || 'Unknown';
      if (!methodMap[method]) {
        methodMap[method] = { amount: 0, count: 0 };
      }
      methodMap[method].amount += Number(p.amount);
      methodMap[method].count += 1;
    });

    return Object.entries(methodMap).map(([method, data]) => ({
      method,
      amount: data.amount,
      count: data.count,
    }));
  }, [payments]);

  // ═══════════════════════════════════════════════════════════════
  // DAILY REVENUE (Last 30 days)
  // ═══════════════════════════════════════════════════════════════
  const dailyRevenue = useMemo<DailyRevenue[]>(() => {
    if (!payments) return [];

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, 'yyyy-MM-dd');
    });

    const completedPayments = payments.filter(p => p.status === 'completed');

    return last30Days.map(dateStr => {
      const dayPayments = completedPayments.filter(p => {
        const paymentDate = format(parseISO(p.created_at), 'yyyy-MM-dd');
        return paymentDate === dateStr;
      });

      return {
        date: format(parseISO(dateStr), 'MMM dd'),
        revenue: dayPayments.reduce((sum, p) => sum + Number(p.amount), 0),
        orders: dayPayments.length,
      };
    });
  }, [payments]);

  // ═══════════════════════════════════════════════════════════════
  // MONTHLY REVENUE (Last 12 months)
  // ═══════════════════════════════════════════════════════════════
  const monthlyRevenue = useMemo<MonthlyRevenue[]>(() => {
    if (!payments) return [];

    const completedPayments = payments.filter(p => p.status === 'completed');
    const monthMap: Record<string, { revenue: number; orders: number }> = {};

    completedPayments.forEach(p => {
      const month = format(parseISO(p.created_at), 'MMM yyyy');
      if (!monthMap[month]) {
        monthMap[month] = { revenue: 0, orders: 0 };
      }
      monthMap[month].revenue += Number(p.amount);
      monthMap[month].orders += 1;
    });

    return Object.entries(monthMap)
      .slice(-12)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        orders: data.orders,
      }));
  }, [payments]);

  // ═══════════════════════════════════════════════════════════════
  // BILLING INSIGHTS
  // ═══════════════════════════════════════════════════════════════
  const billingInsights = useMemo<BillingInsights | null>(() => {
    if (!invoices || !payments || !orders) return null;

    const today = new Date();

    // Invoice stats
    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const unpaidInvoices = invoices.filter(i => i.status === 'unpaid' || i.status === 'pending');
    const overdueInvoices = invoices.filter(i => 
      (i.status === 'unpaid' || i.status === 'pending') && 
      i.due_date && 
      new Date(i.due_date) < today
    );

    // Payment stats
    const successPayments = payments.filter(p => p.status === 'completed').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    const refundedPayments = payments.filter(p => p.status === 'refunded');

    // Average order value
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalOrderValue = completedOrders.reduce((sum, o) => sum + Number(o.amount), 0);
    const averageOrderValue = completedOrders.length > 0 ? totalOrderValue / completedOrders.length : 0;

    return {
      paidInvoices: paidInvoices.length,
      paidAmount: paidInvoices.reduce((sum, i) => sum + Number(i.total), 0),
      unpaidInvoices: unpaidInvoices.length,
      unpaidAmount: unpaidInvoices.reduce((sum, i) => sum + Number(i.total), 0),
      overdueInvoices: overdueInvoices.length,
      overdueAmount: overdueInvoices.reduce((sum, i) => sum + Number(i.total), 0),
      successPayments,
      failedPayments,
      refundCount: refundedPayments.length,
      refundAmount: refundedPayments.reduce((sum, p) => sum + Number(p.amount), 0),
      averageOrderValue,
    };
  }, [invoices, payments, orders]);

  // ═══════════════════════════════════════════════════════════════
  // CUSTOMER METRICS
  // ═══════════════════════════════════════════════════════════════
  const customerMetrics = useMemo<CustomerMetrics | null>(() => {
    if (!profiles || !orders) return null;

    const today = new Date();
    const startOfToday = startOfDay(today);
    const startOfThisMonth = startOfMonth(today);
    const thirtyDaysAgo = subDays(today, 30);

    // New signups
    const newSignupsToday = profiles.filter(p => new Date(p.created_at) >= startOfToday).length;
    const newSignupsMonth = profiles.filter(p => new Date(p.created_at) >= startOfThisMonth).length;

    // Active vs inactive
    const customerIdsWithRecentOrders = new Set(
      orders
        .filter(o => new Date(o.created_at) >= thirtyDaysAgo)
        .map(o => o.user_id)
    );

    const activeCustomers = customerIdsWithRecentOrders.size;
    const inactiveCustomers = profiles.length - activeCustomers;

    // Basic churn rate
    const sixtyDaysAgo = subDays(today, 60);
    const olderCustomers = new Set(
      orders
        .filter(o => {
          const date = new Date(o.created_at);
          return date <= thirtyDaysAgo && date > sixtyDaysAgo;
        })
        .map(o => o.user_id)
    );
    
    const churnedCustomers = [...olderCustomers].filter(id => !customerIdsWithRecentOrders.has(id)).length;
    const churnRate = olderCustomers.size > 0 ? (churnedCustomers / olderCustomers.size) * 100 : 0;

    return {
      newSignupsToday,
      newSignupsMonth,
      activeCustomers,
      inactiveCustomers,
      churnRate,
    };
  }, [profiles, orders]);

  // ═══════════════════════════════════════════════════════════════
  // EXPIRING SERVICES
  // ═══════════════════════════════════════════════════════════════
  const expiringServices = useMemo<ExpiringServices | null>(() => {
    if (!orders || !hostingAccounts) return null;

    const today = new Date();
    const in7Days = subDays(today, -7);
    const in15Days = subDays(today, -15);
    const in30Days = subDays(today, -30);

    // Hosting expiring
    const hostingWithExpiry = orders.filter(
      o => o.order_type?.toLowerCase().includes('hosting') && o.expiry_date && o.status === 'completed'
    );

    const hosting7Days = hostingWithExpiry.filter(o => {
      const expiry = new Date(o.expiry_date!);
      return expiry >= today && expiry <= in7Days;
    }).length;

    const hosting15Days = hostingWithExpiry.filter(o => {
      const expiry = new Date(o.expiry_date!);
      return expiry >= today && expiry <= in15Days;
    }).length;

    const hosting30Days = hostingWithExpiry.filter(o => {
      const expiry = new Date(o.expiry_date!);
      return expiry >= today && expiry <= in30Days;
    }).length;

    // Domains expiring
    const domainOrders = orders.filter(
      o => o.order_type === 'domain' && o.expiry_date && o.status === 'completed'
    );

    const domains7Days = domainOrders.filter(o => {
      const expiry = new Date(o.expiry_date!);
      return expiry >= today && expiry <= in7Days;
    }).length;

    const domains15Days = domainOrders.filter(o => {
      const expiry = new Date(o.expiry_date!);
      return expiry >= today && expiry <= in15Days;
    }).length;

    const domains30Days = domainOrders.filter(o => {
      const expiry = new Date(o.expiry_date!);
      return expiry >= today && expiry <= in30Days;
    }).length;

    return {
      hosting7Days,
      hosting15Days,
      hosting30Days,
      domains7Days,
      domains15Days,
      domains30Days,
    };
  }, [orders, hostingAccounts]);

  // ═══════════════════════════════════════════════════════════════
  // HOSTING BY PLAN
  // ═══════════════════════════════════════════════════════════════
  const hostingByPlan = useMemo(() => {
    if (!hostingAccounts || !hostingPlans) return [];

    const planCounts: Record<string, number> = {};
    
    hostingAccounts
      .filter(h => h.status === 'active')
      .forEach(h => {
        const planName = h.whm_package || 'Unknown';
        planCounts[planName] = (planCounts[planName] || 0) + 1;
      });

    return Object.entries(planCounts).map(([plan, count]) => ({
      name: plan,
      value: count,
    }));
  }, [hostingAccounts, hostingPlans]);

  // Loading and refetch
  const isLoading = ordersLoading || paymentsLoading || invoicesLoading || hostingLoading || profilesLoading || plansLoading;

  const refetchAll = () => {
    refetchOrders();
    refetchPayments();
    refetchInvoices();
    refetchHosting();
    refetchProfiles();
  };

  return {
    kpiData,
    revenueByProduct,
    revenueByPaymentMethod,
    dailyRevenue,
    monthlyRevenue,
    billingInsights,
    customerMetrics,
    expiringServices,
    hostingByPlan,
    isLoading,
    refetchAll,
  };
};
