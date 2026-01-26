import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, CreditCard, Globe, Server, 
  FileText, Settings, LogOut, TrendingUp, DollarSign, ShoppingCart,
  Webhook
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { usePayments } from '@/hooks/usePayments';
import SEOHead from '@/components/common/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: payments, isLoading: paymentsLoading } = usePayments();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Calculate stats
  const totalRevenue = payments?.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
  const totalOrders = orders?.length || 0;

  const adminLinks = [
    { icon: Package, label: language === 'bn' ? 'হোস্টিং প্ল্যান' : 'Hosting Plans', href: '/admin/hosting-plans' },
    { icon: Globe, label: language === 'bn' ? 'ডোমেইন প্রাইসিং' : 'Domain Pricing', href: '/admin/domain-pricing' },
    { icon: ShoppingCart, label: language === 'bn' ? 'অর্ডার' : 'Orders', href: '/admin/orders' },
    { icon: CreditCard, label: language === 'bn' ? 'পেমেন্ট' : 'Payments', href: '/admin/payments' },
    { icon: Users, label: language === 'bn' ? 'ইউজার' : 'Users', href: '/admin/users' },
    { icon: Webhook, label: language === 'bn' ? 'ওয়েবহুক লগ' : 'Webhook Logs', href: '/admin/webhooks' },
  ];

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
        description="Admin dashboard for CHost"
        canonicalUrl="/admin"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'সাইট পরিচালনা করুন' : 'Manage your site'}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'লগআউট' : 'Logout'}
            </Button>
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
                {paymentsLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <div className="text-3xl font-bold">৳{totalRevenue.toLocaleString()}</div>
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
                {ordersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{totalOrders}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'পেন্ডিং অর্ডার' : 'Pending Orders'}
                </CardTitle>
                <Package className="h-5 w-5 text-warning" />
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{pendingOrders}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'সম্পন্ন অর্ডার' : 'Completed Orders'}
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{completedOrders}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adminLinks.map((link) => (
              <Card key={link.href} className="hover:border-primary/50 transition-colors cursor-pointer">
                <Link to={link.href}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <link.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{link.label}</CardTitle>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}</CardTitle>
                <CardDescription>{language === 'bn' ? 'সর্বশেষ ৫টি অর্ডার' : 'Latest 5 orders'}</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'bn' ? 'কোন অর্ডার নেই' : 'No orders yet'}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'সাম্প্রতিক পেমেন্ট' : 'Recent Payments'}</CardTitle>
                <CardDescription>{language === 'bn' ? 'সর্বশেষ ৫টি পেমেন্ট' : 'Latest 5 payments'}</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.slice(0, 5).map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'bn' ? 'কোন পেমেন্ট নেই' : 'No payments yet'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
