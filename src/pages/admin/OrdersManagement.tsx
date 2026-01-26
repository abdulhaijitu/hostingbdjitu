import React, { useState, useCallback } from 'react';
import { 
  ShoppingCart, Search, Filter, Eye, Edit, MoreHorizontal,
  ArrowLeft, Package, Calendar, User, CreditCard, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePagePerformance } from '@/hooks/usePagePerformance';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders, Order } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/admin/PullToRefreshIndicator';
import MobileAdminCard from '@/components/admin/MobileAdminCard';
import MobileAdminHeader from '@/components/admin/MobileAdminHeader';
import MobileStatCard from '@/components/admin/MobileStatCard';
import { cn } from '@/lib/utils';

const OrdersManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { data: orders, isLoading, refetch } = useOrders();
  
  usePagePerformance('Orders Management');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Pull to refresh
  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const {
    isRefreshing,
    pullDistance,
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: isMobile,
  });

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.domain_name && order.domain_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
      pending: { color: 'bg-warning/10 text-warning border-warning/20', label: language === 'bn' ? 'পেন্ডিং' : 'Pending', variant: 'warning' },
      processing: { color: 'bg-primary/10 text-primary border-primary/20', label: language === 'bn' ? 'প্রসেসিং' : 'Processing', variant: 'secondary' },
      completed: { color: 'bg-success/10 text-success border-success/20', label: language === 'bn' ? 'সম্পন্ন' : 'Completed', variant: 'success' },
      cancelled: { color: 'bg-destructive/10 text-destructive border-destructive/20', label: language === 'bn' ? 'বাতিল' : 'Cancelled', variant: 'destructive' },
      refunded: { color: 'bg-muted text-muted-foreground border-muted', label: language === 'bn' ? 'রিফান্ড' : 'Refunded', variant: 'secondary' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return { badge: <Badge variant="outline" className={config.color}>{config.label}</Badge>, ...config };
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus as any })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast({
        title: language === 'bn' ? 'স্ট্যাটাস আপডেট হয়েছে' : 'Status Updated',
        description: language === 'bn' ? 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে' : 'Order status updated successfully',
      });
      
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowStatusUpdate(false);
      setSelectedOrder(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Stats
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const completedOrders = orders?.filter(o => o.status === 'completed').length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.amount), 0) || 0;

  // Order Details Component (Drawer on mobile, Dialog on desktop)
  const OrderDetailsContent = () => (
    selectedOrder && (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'আইটেম' : 'Item'}</p>
            <p className="font-medium">{selectedOrder.item_name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'টাইপ' : 'Type'}</p>
            <p className="font-medium capitalize">{selectedOrder.order_type}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'মূল্য' : 'Amount'}</p>
            <p className="font-medium">৳{Number(selectedOrder.amount).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'বিলিং সাইকেল' : 'Billing Cycle'}</p>
            <p className="font-medium capitalize">{selectedOrder.billing_cycle}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</p>
            {getStatusBadge(selectedOrder.status).badge}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'তারিখ' : 'Date'}</p>
            <p className="font-medium">{format(new Date(selectedOrder.created_at), 'dd MMM yyyy')}</p>
          </div>
          {selectedOrder.domain_name && (
            <div className="col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ডোমেইন' : 'Domain'}</p>
              <p className="font-medium">{selectedOrder.domain_name}</p>
            </div>
          )}
          {selectedOrder.notes && (
            <div className="col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">{language === 'bn' ? 'নোট' : 'Notes'}</p>
              <p className="text-sm">{selectedOrder.notes}</p>
            </div>
          )}
        </div>
      </div>
    )
  );

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'অর্ডার ম্যানেজমেন্ট' : 'Order Management'}
        description="Manage orders"
        canonicalUrl="/admin/orders"
      />
      
      <div 
        ref={containerRef}
        className={cn(
          "relative min-h-screen",
          isMobile ? "overflow-y-auto" : ""
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to refresh indicator */}
        <PullToRefreshIndicator 
          pullDistance={pullDistance} 
          isRefreshing={isRefreshing} 
        />

        <div className={cn(
          isMobile ? "p-4 space-y-4" : "p-6 lg:p-8"
        )}>
          {/* Header - Mobile vs Desktop */}
          {isMobile ? (
            <MobileAdminHeader
              title={language === 'bn' ? 'অর্ডার' : 'Orders'}
              description={language === 'bn' ? `${filteredOrders?.length || 0}টি অর্ডার` : `${filteredOrders?.length || 0} orders`}
              language={language as 'en' | 'bn'}
            />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <Button variant="ghost" size="sm" className="mb-2" asChild>
                  <Link to="/admin">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                  </Link>
                </Button>
                <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  {language === 'bn' ? 'অর্ডার ম্যানেজমেন্ট' : 'Order Management'}
                </h1>
              </div>
            </div>
          )}

          {/* Stats - Mobile optimized */}
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          )}>
            <MobileStatCard
              title={language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
              value={isLoading ? '-' : totalOrders}
              icon={<Package className="h-5 w-5" />}
              variant="primary"
              isLoading={isLoading}
            />
            <MobileStatCard
              title={language === 'bn' ? 'পেন্ডিং' : 'Pending'}
              value={isLoading ? '-' : pendingOrders}
              icon={<Clock className="h-5 w-5" />}
              variant="warning"
              isLoading={isLoading}
            />
            <MobileStatCard
              title={language === 'bn' ? 'সম্পন্ন' : 'Completed'}
              value={isLoading ? '-' : completedOrders}
              icon={<ShoppingCart className="h-5 w-5" />}
              variant="success"
              isLoading={isLoading}
            />
            <MobileStatCard
              title={language === 'bn' ? 'মোট মূল্য' : 'Total Value'}
              value={isLoading ? '-' : `৳${totalRevenue.toLocaleString()}`}
              icon={<CreditCard className="h-5 w-5" />}
              variant="primary"
              isLoading={isLoading}
            />
          </div>

          {/* Filters */}
          <Card className={isMobile ? "" : "mb-6"}>
            <CardContent className={isMobile ? "p-3" : "p-4"}>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'bn' ? 'অর্ডার খুঁজুন...' : 'Search orders...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'bn' ? 'সব স্ট্যাটাস' : 'All Status'}</SelectItem>
                    <SelectItem value="pending">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</SelectItem>
                    <SelectItem value="processing">{language === 'bn' ? 'প্রসেসিং' : 'Processing'}</SelectItem>
                    <SelectItem value="completed">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'bn' ? 'বাতিল' : 'Cancelled'}</SelectItem>
                    <SelectItem value="refunded">{language === 'bn' ? 'রিফান্ড' : 'Refunded'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            isMobile ? (
              // Mobile Card View
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <MobileAdminCard
                      key={order.id}
                      title={order.order_number}
                      subtitle={order.item_name}
                      badge={{ text: statusInfo.label, variant: statusInfo.variant }}
                      fields={[
                        { label: language === 'bn' ? 'মূল্য' : 'Amount', value: `৳${Number(order.amount).toLocaleString()}`, highlight: true },
                        { label: language === 'bn' ? 'টাইপ' : 'Type', value: order.order_type },
                        { label: language === 'bn' ? 'তারিখ' : 'Date', value: format(new Date(order.created_at), 'dd MMM yyyy') },
                        { label: language === 'bn' ? 'বিলিং' : 'Billing', value: order.billing_cycle },
                        ...(order.domain_name ? [{ label: language === 'bn' ? 'ডোমেইন' : 'Domain', value: order.domain_name }] : []),
                      ]}
                      actions={[
                        { 
                          label: language === 'bn' ? 'বিস্তারিত' : 'View Details', 
                          icon: <Eye className="h-4 w-4" />, 
                          onClick: () => { setSelectedOrder(order); setShowDetails(true); } 
                        },
                        { 
                          label: language === 'bn' ? 'স্ট্যাটাস আপডেট' : 'Update Status', 
                          icon: <Edit className="h-4 w-4" />, 
                          onClick: () => { setSelectedOrder(order); setNewStatus(order.status); setShowStatusUpdate(true); } 
                        },
                      ]}
                      expandable={true}
                      onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                    />
                  );
                })}
              </div>
            ) : (
              // Desktop Table View
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'অর্ডার তালিকা' : 'Orders List'}</CardTitle>
                  <CardDescription>
                    {language === 'bn' ? `${filteredOrders?.length || 0}টি অর্ডার পাওয়া গেছে` : `${filteredOrders?.length || 0} orders found`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">{language === 'bn' ? 'অর্ডার #' : 'Order #'}</th>
                          <th className="text-left py-3 px-4 font-medium">{language === 'bn' ? 'আইটেম' : 'Item'}</th>
                          <th className="text-left py-3 px-4 font-medium">{language === 'bn' ? 'টাইপ' : 'Type'}</th>
                          <th className="text-left py-3 px-4 font-medium">{language === 'bn' ? 'মূল্য' : 'Amount'}</th>
                          <th className="text-left py-3 px-4 font-medium">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                          <th className="text-left py-3 px-4 font-medium">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                          <th className="text-right py-3 px-4 font-medium">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-mono text-sm">{order.order_number}</td>
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{order.item_name}</p>
                                {order.domain_name && (
                                  <p className="text-xs text-muted-foreground">{order.domain_name}</p>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 capitalize">{order.order_type}</td>
                            <td className="py-3 px-4 font-medium">৳{Number(order.amount).toLocaleString()}</td>
                            <td className="py-3 px-4">{getStatusBadge(order.status).badge}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {format(new Date(order.created_at), 'dd MMM yyyy')}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setShowStatusUpdate(true); }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === 'bn' ? 'কোন অর্ডার পাওয়া যায়নি' : 'No orders found'}
              </p>
            </div>
          )}
        </div>

        {/* Order Details - Drawer on mobile, Dialog on desktop */}
        {isMobile ? (
          <Drawer open={showDetails} onOpenChange={setShowDetails}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{language === 'bn' ? 'অর্ডার বিস্তারিত' : 'Order Details'}</DrawerTitle>
                <DrawerDescription>{selectedOrder?.order_number}</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <OrderDetailsContent />
              </div>
              <DrawerFooter>
                <Button 
                  onClick={() => {
                    setShowDetails(false);
                    setNewStatus(selectedOrder?.status || '');
                    setShowStatusUpdate(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'স্ট্যাটাস আপডেট' : 'Update Status'}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{language === 'bn' ? 'অর্ডার বিস্তারিত' : 'Order Details'}</DialogTitle>
                <DialogDescription>{selectedOrder?.order_number}</DialogDescription>
              </DialogHeader>
              <OrderDetailsContent />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </Button>
                <Button onClick={() => {
                  setShowDetails(false);
                  setNewStatus(selectedOrder?.status || '');
                  setShowStatusUpdate(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'স্ট্যাটাস আপডেট' : 'Update Status'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Status Update - Drawer on mobile, Dialog on desktop */}
        {isMobile ? (
          <Drawer open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{language === 'bn' ? 'স্ট্যাটাস আপডেট করুন' : 'Update Status'}</DrawerTitle>
                <DrawerDescription>{selectedOrder?.order_number}</DrawerDescription>
              </DrawerHeader>
              <div className="px-4 pb-4">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</SelectItem>
                    <SelectItem value="processing">{language === 'bn' ? 'প্রসেসিং' : 'Processing'}</SelectItem>
                    <SelectItem value="completed">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'bn' ? 'বাতিল' : 'Cancelled'}</SelectItem>
                    <SelectItem value="refunded">{language === 'bn' ? 'রিফান্ড' : 'Refunded'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DrawerFooter>
                <Button onClick={handleUpdateStatus} disabled={isUpdating} className="w-full">
                  {isUpdating ? (language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') : (language === 'bn' ? 'আপডেট করুন' : 'Update Status')}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{language === 'bn' ? 'স্ট্যাটাস আপডেট করুন' : 'Update Order Status'}</DialogTitle>
                <DialogDescription>{selectedOrder?.order_number}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</SelectItem>
                    <SelectItem value="processing">{language === 'bn' ? 'প্রসেসিং' : 'Processing'}</SelectItem>
                    <SelectItem value="completed">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'bn' ? 'বাতিল' : 'Cancelled'}</SelectItem>
                    <SelectItem value="refunded">{language === 'bn' ? 'রিফান্ড' : 'Refunded'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowStatusUpdate(false)}>
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button onClick={handleUpdateStatus} disabled={isUpdating}>
                  {isUpdating ? (language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') : (language === 'bn' ? 'আপডেট করুন' : 'Update')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default OrdersManagement;
