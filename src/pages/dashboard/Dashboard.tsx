import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, FileText, CreditCard, User, LogOut, Server, Globe, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useInvoices } from '@/hooks/useInvoices';
import { useProfile } from '@/hooks/useProfile';
import SEOHead from '@/components/common/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const activeOrders = orders?.filter(o => o.status === 'completed') || [];
  const pendingOrders = orders?.filter(o => o.status === 'pending') || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      completed: { variant: 'default', label: language === 'bn' ? 'সক্রিয়' : 'Active' },
      pending: { variant: 'secondary', label: language === 'bn' ? 'পেন্ডিং' : 'Pending' },
      cancelled: { variant: 'destructive', label: language === 'bn' ? 'বাতিল' : 'Cancelled' },
      refunded: { variant: 'outline', label: language === 'bn' ? 'রিফান্ড' : 'Refunded' },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
        description={language === 'bn' ? 'আপনার হোস্টিং এবং ডোমেইন পরিচালনা করুন' : 'Manage your hosting and domains'}
        canonicalUrl="/dashboard"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display">
                {language === 'bn' ? 'স্বাগতম' : 'Welcome'}, {profile?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'আপনার সার্ভিস পরিচালনা করুন' : 'Manage your services'}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'লগআউট' : 'Logout'}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'সক্রিয় সার্ভিস' : 'Active Services'}
                </CardTitle>
                <Server className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{activeOrders.length}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'পেন্ডিং অর্ডার' : 'Pending Orders'}
                </CardTitle>
                <Clock className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{pendingOrders.length}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'মোট ইনভয়েস' : 'Total Invoices'}
                </CardTitle>
                <FileText className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                {invoicesLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">{invoices?.length || 0}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'ডোমেইন' : 'Domains'}
                </CardTitle>
                <Globe className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-3xl font-bold">
                    {orders?.filter(o => o.order_type === 'domain' && o.status === 'completed').length || 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'সাম্প্রতিক অর্ডার' : 'Recent Orders'}</CardTitle>
                <CardDescription>{language === 'bn' ? 'আপনার সর্বশেষ অর্ডারগুলো' : 'Your latest orders'}</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            {order.order_type === 'domain' ? (
                              <Globe className="h-5 w-5 text-primary" />
                            ) : (
                              <Server className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{order.item_name}</p>
                            <p className="text-sm text-muted-foreground">{order.order_number}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status)}
                          <p className="text-sm text-muted-foreground mt-1">৳{order.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'bn' ? 'কোন অর্ডার নেই' : 'No orders yet'}</p>
                    <Button variant="hero" className="mt-4" asChild>
                      <Link to="/hosting/web">{language === 'bn' ? 'হোস্টিং কিনুন' : 'Buy Hosting'}</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/profile">
                    <User className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/orders">
                    <Package className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'অর্ডার' : 'Orders'}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/dashboard/invoices">
                    <FileText className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'ইনভয়েস' : 'Invoices'}
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/support">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'সাপোর্ট' : 'Support'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
