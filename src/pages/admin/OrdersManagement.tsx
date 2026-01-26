import React, { useState } from 'react';
import { 
  ShoppingCart, Search, Filter, Eye, Edit, MoreHorizontal,
  ArrowLeft, Package, Calendar, User, CreditCard, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders, Order } from '@/hooks/useOrders';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';

const OrdersManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useOrders();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.domain_name && order.domain_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-warning/10 text-warning border-warning/20', label: language === 'bn' ? 'পেন্ডিং' : 'Pending' },
      processing: { color: 'bg-primary/10 text-primary border-primary/20', label: language === 'bn' ? 'প্রসেসিং' : 'Processing' },
      completed: { color: 'bg-success/10 text-success border-success/20', label: language === 'bn' ? 'সম্পন্ন' : 'Completed' },
      cancelled: { color: 'bg-destructive/10 text-destructive border-destructive/20', label: language === 'bn' ? 'বাতিল' : 'Cancelled' },
      refunded: { color: 'bg-muted text-muted-foreground border-muted', label: language === 'bn' ? 'রিফান্ড' : 'Refunded' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
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

  return (
    <AdminLayout>
      <SEOHead 
        title={language === 'bn' ? 'অর্ডার ম্যানেজমেন্ট' : 'Order Management'}
        description="Manage orders"
        canonicalUrl="/admin/orders"
      />
      
      <div className="p-6 lg:p-8">
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
                <ShoppingCart className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'অর্ডার ম্যানেজমেন্ট' : 'Order Management'}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <ShoppingCart className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedOrders}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <CreditCard className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'মোট মূল্য' : 'Total Value'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'bn' ? 'অর্ডার খুঁজুন...' : 'Search orders...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
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

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'অর্ডার তালিকা' : 'Orders List'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? `${filteredOrders?.length || 0}টি অর্ডার পাওয়া গেছে` : `${filteredOrders?.length || 0} orders found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredOrders && filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'অর্ডার #' : 'Order #'}</TableHead>
                        <TableHead>{language === 'bn' ? 'আইটেম' : 'Item'}</TableHead>
                        <TableHead>{language === 'bn' ? 'টাইপ' : 'Type'}</TableHead>
                        <TableHead>{language === 'bn' ? 'মূল্য' : 'Amount'}</TableHead>
                        <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                        <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                        <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.item_name}</p>
                              {order.domain_name && (
                                <p className="text-xs text-muted-foreground">{order.domain_name}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{order.order_type}</TableCell>
                          <TableCell className="font-medium">৳{Number(order.amount).toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(order.created_at), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedOrder(order); setShowDetails(true); }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setShowStatusUpdate(true); }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  {language === 'bn' ? 'স্ট্যাটাস আপডেট' : 'Update Status'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'কোন অর্ডার পাওয়া যায়নি' : 'No orders found'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Details Dialog */}
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{language === 'bn' ? 'অর্ডার বিস্তারিত' : 'Order Details'}</DialogTitle>
                <DialogDescription>{selectedOrder?.order_number}</DialogDescription>
              </DialogHeader>
              {selectedOrder && (
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
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'তারিখ' : 'Date'}</p>
                      <p className="font-medium">{format(new Date(selectedOrder.created_at), 'dd MMM yyyy, HH:mm')}</p>
                    </div>
                    {selectedOrder.domain_name && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ডোমেইন' : 'Domain'}</p>
                        <p className="font-medium">{selectedOrder.domain_name}</p>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'নোট' : 'Notes'}</p>
                        <p className="text-sm">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Update Status Dialog */}
          <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{language === 'bn' ? 'স্ট্যাটাস আপডেট করুন' : 'Update Status'}</DialogTitle>
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;
