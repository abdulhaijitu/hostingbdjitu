import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { format } from 'date-fns';
import { 
  FileText, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminStatsGridSkeleton } from '@/components/admin/AdminSkeletons';
import ResponsiveAdminTable from '@/components/admin/ResponsiveAdminTable';
import InvoiceActions from '@/components/billing/InvoiceActions';

const QUERY_CONFIG = {
  staleTime: 30 * 1000,
  gcTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  retry: 2,
};

const InvoicesManagement: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  
  usePagePerformance('Invoices Management');

  const { data: invoices, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, payments(*, orders(*))')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    ...QUERY_CONFIG,
  });

  const filteredInvoices = React.useMemo(() => {
    if (!invoices) return [];
    
    return invoices.filter(invoice => {
      const matchesSearch = 
        invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const stats = React.useMemo(() => {
    if (!invoices) return { total: 0, paid: 0, unpaid: 0, overdue: 0 };
    
    return {
      total: invoices.length,
      paid: invoices.filter(i => i.status === 'paid').length,
      unpaid: invoices.filter(i => i.status === 'unpaid').length,
      overdue: invoices.filter(i => i.status === 'overdue').length,
    };
  }, [invoices]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'unpaid':
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <Clock className="h-3 w-3 mr-1" />
            Unpaid
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns = [
    {
      key: 'invoice_number',
      label: 'Invoice #',
      mobileLabel: 'Invoice',
      render: (invoice: any) => (
        <span className="font-medium">{invoice.invoice_number}</span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      highlight: true,
      render: (invoice: any) => (
        <span className="font-semibold">৳{invoice.total.toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (invoice: any) => getStatusBadge(invoice.status),
    },
    {
      key: 'created_at',
      label: 'Date',
      hideOnMobile: true,
      render: (invoice: any) => format(new Date(invoice.created_at), 'MMM dd, yyyy'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (invoice: any) => (
        <InvoiceActions 
          invoiceId={invoice.id} 
          invoiceStatus={invoice.status}
          variant="dropdown"
        />
      ),
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'ইনভয়েস ম্যানেজমেন্ট | CHost' : 'Invoice Management | CHost'}
        description="Manage all invoices"
      />
      
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {language === 'bn' ? 'ইনভয়েস ম্যানেজমেন্ট' : 'Invoice Management'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {language === 'bn' ? 'সকল ইনভয়েস দেখুন ও ম্যানেজ করুন' : 'View and manage all invoices'}
            </p>
          </div>
          {error && (
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>

        {isLoading ? (
          <AdminStatsGridSkeleton count={4} />
        ) : (
          <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-success">Paid</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold text-success">{stats.paid}</div>
              </CardContent>
            </Card>
            <Card className="bg-warning/5 border-warning/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-warning">Unpaid</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold text-warning">{stats.unpaid}</div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-destructive">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-xl md:text-2xl font-bold text-destructive">{stats.overdue}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'bn' ? 'ইনভয়েস নম্বর খুঁজুন...' : 'Search invoice number...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{language === 'bn' ? 'ইনভয়েস তালিকা' : 'Invoices List'}</CardTitle>
            <CardDescription>
              {filteredInvoices.length} {language === 'bn' ? 'টি ইনভয়েস' : 'invoices'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive">Failed to load invoices</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <ResponsiveAdminTable
                data={filteredInvoices}
                columns={columns}
                keyExtractor={(invoice) => invoice.id}
                isLoading={isLoading}
                getTitle={(invoice) => invoice.invoice_number}
                getSubtitle={(invoice) => `৳${invoice.total.toLocaleString()}`}
                getBadge={(invoice) => ({
                  text: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
                  variant: invoice.status === 'paid' ? 'success' : invoice.status === 'unpaid' ? 'warning' : 'destructive',
                })}
                language={language as 'en' | 'bn'}
                mobileExpandable={true}
                emptyState={
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No invoices match your filters' 
                      : 'No invoices found'}
                  </div>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvoicesManagement;
