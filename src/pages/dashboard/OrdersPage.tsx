import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Server, Globe, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';

const OrdersPage: React.FC = () => {
  const { language } = useLanguage();
  const { data: orders, isLoading } = useOrders();

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
      pending: { variant: 'secondary', icon: Clock },
      processing: { variant: 'outline', icon: RefreshCw },
      completed: { variant: 'default', icon: CheckCircle },
      cancelled: { variant: 'destructive', icon: XCircle },
      refunded: { variant: 'outline', icon: RefreshCw },
    };
    const { variant, icon: Icon } = config[status] || config.pending;
    const labels: Record<string, { en: string; bn: string }> = {
      pending: { en: 'Pending', bn: 'পেন্ডিং' },
      processing: { en: 'Processing', bn: 'প্রসেসিং' },
      completed: { en: 'Completed', bn: 'সম্পন্ন' },
      cancelled: { en: 'Cancelled', bn: 'বাতিল' },
      refunded: { en: 'Refunded', bn: 'রিফান্ড' },
    };
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {language === 'bn' ? labels[status]?.bn : labels[status]?.en}
      </Badge>
    );
  };

  const getOrderIcon = (type: string) => {
    if (type === 'domain') return <Globe className="h-5 w-5 text-primary" />;
    return <Server className="h-5 w-5 text-primary" />;
  };

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'অর্ডার' : 'Orders'}
        description="View your orders"
        canonicalUrl="/dashboard/orders"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'আমার অর্ডার' : 'My Orders'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'সকল অর্ডারের তালিকা' : 'List of all your orders'}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'অর্ডার হিস্ট্রি' : 'Order History'}</CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? `মোট ${orders?.length || 0}টি অর্ডার`
                  : `Total ${orders?.length || 0} orders`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'অর্ডার নম্বর' : 'Order #'}</TableHead>
                        <TableHead>{language === 'bn' ? 'আইটেম' : 'Item'}</TableHead>
                        <TableHead>{language === 'bn' ? 'মূল্য' : 'Amount'}</TableHead>
                        <TableHead>{language === 'bn' ? 'বিলিং' : 'Billing'}</TableHead>
                        <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                        <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                {getOrderIcon(order.order_type)}
                              </div>
                              <div>
                                <p className="font-medium">{order.item_name}</p>
                                {order.domain_name && (
                                  <p className="text-xs text-muted-foreground">{order.domain_name}</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">৳{order.amount}</TableCell>
                          <TableCell className="capitalize">{order.billing_cycle}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(order.created_at), 'dd MMM yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'bn' ? 'কোন অর্ডার নেই' : 'No orders yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {language === 'bn' 
                      ? 'আপনার প্রথম সার্ভিস অর্ডার করুন'
                      : 'Place your first order to get started'
                    }
                  </p>
                  <Button asChild>
                    <Link to="/hosting/web">
                      {language === 'bn' ? 'হোস্টিং কিনুন' : 'Buy Hosting'}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default OrdersPage;
