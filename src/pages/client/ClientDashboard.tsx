import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Server, Globe, HardDrive, Gauge, CreditCard, Activity,
  ArrowRight, Plus, ExternalLink, AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatCard from '@/components/client-dashboard/StatCard';
import UsageProgress from '@/components/client-dashboard/UsageProgress';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import QuickActions from '@/components/client-dashboard/QuickActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { useInvoices } from '@/hooks/useInvoices';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

const ClientDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();

  // Calculate stats from orders
  const hostingOrders = orders?.filter(o => 
    o.order_type === 'hosting' && o.status === 'completed'
  ) || [];
  const domainOrders = orders?.filter(o => 
    o.order_type === 'domain' && o.status === 'completed'
  ) || [];

  // Get unpaid invoices
  const unpaidInvoices = invoices?.filter(inv => inv.status === 'unpaid') || [];
  const nextInvoice = unpaidInvoices[0];

  // Mock usage data (would come from backend in production)
  const usageData = {
    disk: { used: 2.4, total: 10 },
    bandwidth: { used: 45, total: 100 },
  };

  const quickActions = [
    { 
      icon: Plus, 
      label: language === 'bn' ? 'হোস্টিং কিনুন' : 'Buy Hosting',
      onClick: () => window.location.href = '/hosting/web'
    },
    { 
      icon: Globe, 
      label: language === 'bn' ? 'ডোমেইন রেজিস্টার' : 'Register Domain',
      onClick: () => window.location.href = '/domain/register'
    },
    { 
      icon: CreditCard, 
      label: language === 'bn' ? 'পেমেন্ট করুন' : 'Make Payment',
      onClick: () => window.location.href = '/client/billing'
    },
    { 
      icon: ExternalLink, 
      label: language === 'bn' ? 'সাপোর্ট টিকেট' : 'Open Ticket',
      onClick: () => window.location.href = '/client/support'
    },
  ];

  return (
    <DashboardLayout 
      title={language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
      description={language === 'bn' ? 'আপনার হোস্টিং সার্ভিস পরিচালনা করুন' : 'Manage your hosting services'}
    >
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'স্বাগতম' : 'Welcome back'}, {profile?.full_name || user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'bn' 
            ? 'আপনার হোস্টিং এবং ডোমেইন সার্ভিসের সারসংক্ষেপ'
            : 'Here\'s an overview of your hosting and domain services'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={language === 'bn' ? 'সক্রিয় হোস্টিং' : 'Active Hosting'}
          value={hostingOrders.length}
          icon={Server}
          variant="default"
          isLoading={ordersLoading}
        />
        <StatCard
          title={language === 'bn' ? 'সক্রিয় ডোমেইন' : 'Active Domains'}
          value={domainOrders.length}
          icon={Globe}
          variant="success"
          isLoading={ordersLoading}
        />
        <StatCard
          title={language === 'bn' ? 'ডিস্ক ব্যবহার' : 'Disk Usage'}
          value={`${usageData.disk.used}GB`}
          icon={HardDrive}
          description={`of ${usageData.disk.total}GB`}
          variant={usageData.disk.used / usageData.disk.total > 0.8 ? 'warning' : 'default'}
        />
        <StatCard
          title={language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
          value={`${usageData.bandwidth.used}GB`}
          icon={Gauge}
          description={`of ${usageData.bandwidth.total}GB`}
          variant={usageData.bandwidth.used / usageData.bandwidth.total > 0.8 ? 'warning' : 'default'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Status Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">
                  {language === 'bn' ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Account Status'}
                </CardTitle>
                <CardDescription>
                  {language === 'bn' ? 'আপনার অ্যাকাউন্টের সামগ্রিক অবস্থা' : 'Overall status of your account'}
                </CardDescription>
              </div>
              <StatusBadge status="active" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <UsageProgress
                  label={language === 'bn' ? 'ডিস্ক স্পেস' : 'Disk Space'}
                  used={usageData.disk.used}
                  total={usageData.disk.total}
                  unit="GB"
                />
                <UsageProgress
                  label={language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
                  used={usageData.bandwidth.used}
                  total={usageData.bandwidth.total}
                  unit="GB"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Services */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {language === 'bn' ? 'সাম্প্রতিক সার্ভিস' : 'Recent Services'}
                </CardTitle>
                <CardDescription>
                  {language === 'bn' ? 'আপনার সক্রিয় হোস্টিং এবং ডোমেইন' : 'Your active hosting and domains'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/client/hosting">
                  {language === 'bn' ? 'সব দেখুন' : 'View All'}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : orders && orders.filter(o => o.status === 'completed').length > 0 ? (
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'completed').slice(0, 5).map(order => (
                    <div 
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          order.order_type === 'domain' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {order.order_type === 'domain' ? (
                            <Globe className="h-4 w-4" />
                          ) : (
                            <Server className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{order.item_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.domain_name || order.order_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/client/hosting/${order.id}`}>
                            {language === 'bn' ? 'ম্যানেজ' : 'Manage'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">
                    {language === 'bn' ? 'কোন সক্রিয় সার্ভিস নেই' : 'No active services yet'}
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/hosting/web">
                      {language === 'bn' ? 'হোস্টিং কিনুন' : 'Get Hosting'}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions
            title={language === 'bn' ? 'দ্রুত অ্যাকশন' : 'Quick Actions'}
            actions={quickActions}
            columns={2}
          />

          {/* Next Invoice */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {language === 'bn' ? 'পরবর্তী বিল' : 'Next Invoice'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : nextInvoice ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'পরিমাণ' : 'Amount'}
                    </span>
                    <span className="text-2xl font-bold">৳{nextInvoice.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === 'bn' ? 'নির্ধারিত তারিখ' : 'Due Date'}
                    </span>
                    <span className="font-medium">
                      {nextInvoice.due_date 
                        ? new Date(nextInvoice.due_date).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <Button variant="hero" className="w-full mt-2" asChild>
                    <Link to="/client/billing">
                      {language === 'bn' ? 'পেমেন্ট করুন' : 'Pay Now'}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {language === 'bn' ? 'কোন বকেয়া বিল নেই' : 'No pending invoices'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {language === 'bn' ? 'সিস্টেম স্ট্যাটাস' : 'System Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Web Server</span>
                  <StatusBadge status="active" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Server</span>
                  <StatusBadge status="active" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Server</span>
                  <StatusBadge status="active" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DNS</span>
                  <StatusBadge status="active" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
