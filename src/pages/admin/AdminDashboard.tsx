import React, { useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, DollarSign, ShoppingCart,
  Package, Server, Users, MessageSquare, BarChart3, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { usePayments } from '@/hooks/usePayments';
import SEOHead from '@/components/common/SEOHead';
import ServerHealthMonitor from '@/components/admin/ServerHealthMonitor';
import PerformanceMonitor from '@/components/admin/PerformanceMonitor';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileStatCard from '@/components/admin/MobileStatCard';
import MobileAdminHeader from '@/components/admin/MobileAdminHeader';
import { 
  StatCardSkeleton, 
  EmptyState, 
  ErrorState 
} from '@/components/common/DashboardSkeletons';
import { cn } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const { data: orders, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useOrders();
  const { data: payments, isLoading: paymentsLoading, isError: paymentsError, refetch: refetchPayments } = usePayments();
  
  // Track page performance
  usePagePerformance('Admin Dashboard');

  // Calculate stats - memoized for performance
  const stats = useMemo(() => {
    const totalRevenue = payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
    const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
    const totalOrders = orders?.length || 0;
    
    return { totalRevenue, pendingOrders, completedOrders, totalOrders };
  }, [orders, payments]);

  // Quick access cards for dashboard home
  const quickAccessCards = useMemo(() => [
    { icon: BarChart3, label: language === 'bn' ? 'অ্যানালিটিক্স' : 'Analytics', href: '/admin/analytics', color: 'from-violet-500/10 to-purple-500/10 border-violet-500/20' },
    { icon: Server, label: language === 'bn' ? 'সার্ভার' : 'Servers', href: '/admin/servers', color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20' },
    { icon: Users, label: language === 'bn' ? 'ইউজার' : 'Users', href: '/admin/users', color: 'from-emerald-500/10 to-green-500/10 border-emerald-500/20' },
    { icon: MessageSquare, label: language === 'bn' ? 'সাপোর্ট' : 'Support', href: '/admin/tickets', color: 'from-orange-500/10 to-amber-500/10 border-orange-500/20' },
  ], [language]);

  const handleRetry = () => {
    refetchOrders();
    refetchPayments();
  };

  const hasError = ordersError || paymentsError;
  const isLoading = ordersLoading || paymentsLoading;

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
        description="Admin dashboard for CHost"
        canonicalUrl="/admin"
      />
      
      <div className={cn(isMobile ? "pb-4" : "p-6 lg:p-8")}>
        {/* Header - Mobile uses MobileTopBar, desktop shows inline header */}
        {!isMobile && (
          <MobileAdminHeader
            title="Dashboard"
            titleBn="ড্যাশবোর্ড"
            description="Your site overview"
            descriptionBn="আপনার সাইট ওভারভিউ"
            language={language as 'en' | 'bn'}
            actions={hasError && (
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
            className="px-0 pt-0"
          />
        )}

        {/* Mobile retry button */}
        {isMobile && hasError && (
          <div className="px-4 py-2">
            <Button variant="outline" size="sm" onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
            </Button>
          </div>
        )}

        {/* Stats Cards - Responsive grid */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-2 px-4 mb-4" : "grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        )}>
          <MobileStatCard
            title="Total Revenue"
            titleBn="মোট রেভিনিউ"
            value={`৳${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            isLoading={paymentsLoading}
            variant="primary"
            language={language as 'en' | 'bn'}
          />
          <MobileStatCard
            title="Total Orders"
            titleBn="মোট অর্ডার"
            value={stats.totalOrders}
            icon={<ShoppingCart className="h-5 w-5" />}
            isLoading={ordersLoading}
            language={language as 'en' | 'bn'}
          />
          <MobileStatCard
            title="Pending"
            titleBn="পেন্ডিং"
            value={stats.pendingOrders}
            icon={<Package className="h-5 w-5" />}
            isLoading={ordersLoading}
            variant="warning"
            language={language as 'en' | 'bn'}
          />
          <MobileStatCard
            title="Completed"
            titleBn="সম্পন্ন"
            value={stats.completedOrders}
            icon={<TrendingUp className="h-5 w-5" />}
            isLoading={ordersLoading}
            variant="success"
            language={language as 'en' | 'bn'}
          />
        </div>

        {/* Quick Access Cards - Static, no loading needed */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-4 px-4 mb-4" : "grid-cols-4 gap-4 mb-8"
        )}>
          {quickAccessCards.map((card) => (
            <Link key={card.href} to={card.href}>
              <Card className={cn(
                `bg-gradient-to-br ${card.color} hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-95`,
                isMobile ? "border-0" : ""
              )}>
                <CardContent className={cn(
                  "flex flex-col items-center justify-center text-center",
                  isMobile ? "p-3" : "p-4"
                )}>
                  <div className={cn(
                    "rounded-xl bg-background/50 group-hover:scale-110 transition-transform duration-200",
                    isMobile ? "p-2 mb-1" : "p-3 mb-2"
                  )}>
                    <card.icon className={cn(isMobile ? "h-4 w-4" : "h-5 w-5", "text-foreground/80")} />
                  </div>
                  <span className={cn(
                    "font-medium text-foreground/90",
                    isMobile ? "text-[10px] leading-tight" : "text-sm"
                  )}>{card.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Server Health Monitoring - Hide on mobile for performance */}
        {!isMobile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Suspense fallback={<div className="h-64 bg-card rounded-xl border animate-pulse" />}>
              <ServerHealthMonitor />
            </Suspense>
            <Suspense fallback={<div className="h-64 bg-card rounded-xl border animate-pulse" />}>
              <PerformanceMonitor />
            </Suspense>
          </div>
        )}

        {/* Recent Activity */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1 px-4" : "grid-cols-1 lg:grid-cols-2 gap-6"
        )}>
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}</CardTitle>
              <CardDescription>{language === 'bn' ? 'সর্বশেষ ৫টি অর্ডার' : 'Latest 5 orders'}</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersError ? (
                <ErrorState 
                  title={language === 'bn' ? 'ডেটা লোড করতে সমস্যা' : 'Failed to load data'}
                  onRetry={refetchOrders}
                />
              ) : ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">{order.item_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">৳{order.amount}</p>
                        <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<ShoppingCart className="h-8 w-8 text-muted-foreground" />}
                  title={language === 'bn' ? 'কোন অর্ডার নেই' : 'No orders yet'}
                  description={language === 'bn' ? 'নতুন অর্ডার এখানে দেখা যাবে' : 'New orders will appear here'}
                />
              )}
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সাম্প্রতিক পেমেন্ট' : 'Recent Payments'}</CardTitle>
              <CardDescription>{language === 'bn' ? 'সর্বশেষ ৫টি পেমেন্ট' : 'Latest 5 payments'}</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentsError ? (
                <ErrorState 
                  title={language === 'bn' ? 'ডেটা লোড করতে সমস্যা' : 'Failed to load data'}
                  onRetry={refetchPayments}
                />
              ) : paymentsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : payments && payments.length > 0 ? (
                <div className="space-y-3">
                  {payments.slice(0, 5).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{payment.transaction_id || 'Pending'}</p>
                        <p className="text-xs text-muted-foreground">{payment.payment_method || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">৳{payment.amount}</p>
                        <p className="text-xs text-muted-foreground capitalize">{payment.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<DollarSign className="h-8 w-8 text-muted-foreground" />}
                  title={language === 'bn' ? 'কোন পেমেন্ট নেই' : 'No payments yet'}
                  description={language === 'bn' ? 'নতুন পেমেন্ট এখানে দেখা যাবে' : 'New payments will appear here'}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
