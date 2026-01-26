import React, { useState } from 'react';
import { 
  CreditCard, Search, Filter, Eye, ArrowLeft, 
  DollarSign, Clock, CheckCircle, XCircle, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
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
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePayments, Payment } from '@/hooks/usePayments';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';

interface LocalPayment {
  id: string;
  order_id: string;
  user_id: string;
  transaction_id: string | null;
  invoice_id: string | null;
  amount: number;
  fee: number | null;
  currency: string;
  payment_method: string | null;
  status: string;
  metadata: any;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

const PaymentsManagement: React.FC = () => {
  const { language } = useLanguage();
  const { data: payments, isLoading } = usePayments();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<LocalPayment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = 
      (payment.transaction_id && payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      payment.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      pending: { 
        color: 'bg-warning/10 text-warning border-warning/20', 
        label: language === 'bn' ? 'পেন্ডিং' : 'Pending',
        icon: <Clock className="h-3 w-3" />
      },
      completed: { 
        color: 'bg-success/10 text-success border-success/20', 
        label: language === 'bn' ? 'সম্পন্ন' : 'Completed',
        icon: <CheckCircle className="h-3 w-3" />
      },
      failed: { 
        color: 'bg-destructive/10 text-destructive border-destructive/20', 
        label: language === 'bn' ? 'ব্যর্থ' : 'Failed',
        icon: <XCircle className="h-3 w-3" />
      },
      cancelled: { 
        color: 'bg-muted text-muted-foreground border-muted', 
        label: language === 'bn' ? 'বাতিল' : 'Cancelled',
        icon: <XCircle className="h-3 w-3" />
      },
      refunded: { 
        color: 'bg-primary/10 text-primary border-primary/20', 
        label: language === 'bn' ? 'রিফান্ড' : 'Refunded',
        icon: <RefreshCw className="h-3 w-3" />
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Stats
  const totalPayments = payments?.length || 0;
  const completedPayments = payments?.filter(p => p.status === 'completed') || [];
  const pendingPayments = payments?.filter(p => p.status === 'pending') || [];
  const totalRevenue = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const pendingRevenue = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'পেমেন্ট ম্যানেজমেন্ট' : 'Payment Management'}
        description="Manage payments"
        canonicalUrl="/admin/payments"
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
                <CreditCard className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'পেমেন্ট ম্যানেজমেন্ট' : 'Payment Management'}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalPayments}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'মোট পেমেন্ট' : 'Total Payments'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'মোট আয়' : 'Total Revenue'}</p>
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
                    <p className="text-2xl font-bold">{pendingPayments.length}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <CheckCircle className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedPayments.length}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</p>
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
                    placeholder={language === 'bn' ? 'ট্রানজেকশন আইডি খুঁজুন...' : 'Search transaction ID...'}
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
                    <SelectItem value="completed">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</SelectItem>
                    <SelectItem value="failed">{language === 'bn' ? 'ব্যর্থ' : 'Failed'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'bn' ? 'বাতিল' : 'Cancelled'}</SelectItem>
                    <SelectItem value="refunded">{language === 'bn' ? 'রিফান্ড' : 'Refunded'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'পেমেন্ট তালিকা' : 'Payments List'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? `${filteredPayments?.length || 0}টি পেমেন্ট পাওয়া গেছে` : `${filteredPayments?.length || 0} payments found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredPayments && filteredPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}</TableHead>
                        <TableHead>{language === 'bn' ? 'মূল্য' : 'Amount'}</TableHead>
                        <TableHead>{language === 'bn' ? 'মেথড' : 'Method'}</TableHead>
                        <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                        <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                        <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">
                            {payment.transaction_id || 'N/A'}
                          </TableCell>
                          <TableCell className="font-medium">
                            ৳{Number(payment.amount).toLocaleString()}
                            {payment.fee && payment.fee > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                (fee: ৳{Number(payment.fee).toLocaleString()})
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="capitalize">
                            {payment.payment_method || 'N/A'}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(payment.created_at), 'dd MMM yyyy, HH:mm')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => { setSelectedPayment(payment); setShowDetails(true); }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {language === 'bn' ? 'বিস্তারিত' : 'Details'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'কোন পেমেন্ট পাওয়া যায়নি' : 'No payments found'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Details Dialog */}
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{language === 'bn' ? 'পেমেন্ট বিস্তারিত' : 'Payment Details'}</DialogTitle>
                <DialogDescription>{selectedPayment?.transaction_id || 'N/A'}</DialogDescription>
              </DialogHeader>
              {selectedPayment && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}</p>
                      <p className="font-mono font-medium">{selectedPayment.transaction_id || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'অর্ডার আইডি' : 'Order ID'}</p>
                      <p className="font-mono font-medium text-sm">{selectedPayment.order_id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'মূল্য' : 'Amount'}</p>
                      <p className="font-medium text-lg">৳{Number(selectedPayment.amount).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ফি' : 'Fee'}</p>
                      <p className="font-medium">৳{Number(selectedPayment.fee || 0).toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'কারেন্সি' : 'Currency'}</p>
                      <p className="font-medium">{selectedPayment.currency}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}</p>
                      <p className="font-medium capitalize">{selectedPayment.payment_method || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</p>
                      {getStatusBadge(selectedPayment.status)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'তারিখ' : 'Date'}</p>
                      <p className="font-medium">{format(new Date(selectedPayment.created_at), 'dd MMM yyyy, HH:mm:ss')}</p>
                    </div>
                    {selectedPayment.paid_at && (
                      <div className="space-y-1 col-span-2">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'পেমেন্ট সময়' : 'Paid At'}</p>
                        <p className="font-medium">{format(new Date(selectedPayment.paid_at), 'dd MMM yyyy, HH:mm:ss')}</p>
                      </div>
                    )}
                    {selectedPayment.metadata && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground mb-2">{language === 'bn' ? 'মেটাডাটা' : 'Metadata'}</p>
                        <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(selectedPayment.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentsManagement;
