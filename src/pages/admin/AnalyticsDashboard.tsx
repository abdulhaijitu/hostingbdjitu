import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, 
  Package, Users, Calendar, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { usePayments } from '@/hooks/usePayments';
import SEOHead from '@/components/common/SEOHead';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

const AnalyticsDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  const isLoading = ordersLoading || paymentsLoading;

  // Calculate stats
  const stats = useMemo(() => {
    if (!orders || !payments) return null;

    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const pendingRevenue = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    // Last 30 days revenue
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentRevenue = completedPayments
      .filter(p => new Date(p.created_at) > thirtyDaysAgo)
      .reduce((sum, p) => sum + Number(p.amount), 0);

    // Previous 30 days for comparison
    const sixtyDaysAgo = subDays(new Date(), 60);
    const previousRevenue = completedPayments
      .filter(p => {
        const date = new Date(p.created_at);
        return date > sixtyDaysAgo && date <= thirtyDaysAgo;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const revenueGrowth = previousRevenue > 0 
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    return {
      totalRevenue,
      pendingRevenue,
      recentRevenue,
      revenueGrowth,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [orders, payments]);

  // Daily revenue chart data (last 30 days)
  const dailyRevenueData = useMemo(() => {
    if (!payments) return [];

    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    return last30Days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayPayments = payments.filter(p => {
        const paymentDate = format(parseISO(p.created_at), 'yyyy-MM-dd');
        return paymentDate === dayStr && p.status === 'completed';
      });
      const revenue = dayPayments.reduce((sum, p) => sum + Number(p.amount), 0);

      return {
        date: format(day, 'MMM dd'),
        revenue,
        orders: dayPayments.length,
      };
    });
  }, [payments]);

  // Order status distribution
  const orderStatusData = useMemo(() => {
    if (!orders) return [];

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [orders]);

  // Revenue by order type
  const revenueByTypeData = useMemo(() => {
    if (!orders) return [];

    const typeTotals = orders.reduce((acc, order) => {
      const type = order.order_type || 'Other';
      acc[type] = (acc[type] || 0) + Number(order.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeTotals).map(([type, total]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: total,
    }));
  }, [orders]);

  // Monthly revenue comparison
  const monthlyRevenueData = useMemo(() => {
    if (!payments) return [];

    const months: Record<string, number> = {};
    
    payments
      .filter(p => p.status === 'completed')
      .forEach(p => {
        const month = format(parseISO(p.created_at), 'MMM yyyy');
        months[month] = (months[month] || 0) + Number(p.amount);
      });

    return Object.entries(months)
      .slice(-6)
      .map(([month, revenue]) => ({ month, revenue }));
  }, [payments]);

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'অ্যানালিটিক্স' : 'Analytics'}
        description="Sales and order analytics dashboard"
        canonicalUrl="/admin/analytics"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Button variant="ghost" size="sm" className="mb-2" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
              </Button>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'অ্যানালিটিক্স ড্যাশবোর্ড' : 'Analytics Dashboard'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'সেলস এবং অর্ডার ট্র্যাক করুন' : 'Track sales and orders'}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'bn' ? 'মোট রেভিনিউ' : 'Total Revenue'}
                </CardTitle>
                <DollarSign className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-3xl font-bold">৳{stats?.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      {stats?.revenueGrowth !== undefined && stats.revenueGrowth >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={stats?.revenueGrowth !== undefined && stats.revenueGrowth >= 0 ? 'text-success' : 'text-destructive'}>
                        {stats?.revenueGrowth?.toFixed(1)}%
                      </span>
                      {language === 'bn' ? 'গত মাসের তুলনায়' : 'vs last month'}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'পেন্ডিং রেভিনিউ' : 'Pending Revenue'}
                </CardTitle>
                <Calendar className="h-5 w-5 text-warning" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-3xl font-bold text-warning">৳{stats?.pendingRevenue.toLocaleString()}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
                </CardTitle>
                <ShoppingCart className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{stats?.totalOrders}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'সম্পন্ন অর্ডার' : 'Completed Orders'}
                </CardTitle>
                <Package className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold text-success">{stats?.completedOrders}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Daily Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'দৈনিক রেভিনিউ' : 'Daily Revenue'}</CardTitle>
                <CardDescription>{language === 'bn' ? 'গত ৩০ দিনের রেভিনিউ' : 'Revenue for the last 30 days'}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailyRevenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                        tickFormatter={(value) => `৳${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'অর্ডার স্ট্যাটাস' : 'Order Status'}</CardTitle>
                <CardDescription>{language === 'bn' ? 'স্ট্যাটাস অনুযায়ী অর্ডার বণ্টন' : 'Distribution by status'}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {orderStatusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Order Type */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'সার্ভিস অনুযায়ী রেভিনিউ' : 'Revenue by Service'}</CardTitle>
                <CardDescription>{language === 'bn' ? 'অর্ডার টাইপ অনুযায়ী' : 'By order type'}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueByTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                        tickFormatter={(value) => `৳${value}`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Monthly Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'মাসিক রেভিনিউ ট্রেন্ড' : 'Monthly Revenue Trend'}</CardTitle>
                <CardDescription>{language === 'bn' ? 'গত ৬ মাসের তুলনা' : 'Last 6 months comparison'}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                        tickFormatter={(value) => `৳${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AnalyticsDashboard;
