import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { adminAnalytics } from '@/lib/adminAnalytics';
import { format } from 'date-fns';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminStatsGridSkeleton, AdminTableSkeleton } from '@/components/admin/AdminSkeletons';

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
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'unpaid':
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Unpaid
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">{status}</Badge>
        );
    }
  };

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'ইনভয়েস ম্যানেজমেন্ট | CHost' : 'Invoice Management | CHost'}
        description="Manage all invoices"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === 'bn' ? 'ইনভয়েস ম্যানেজমেন্ট' : 'Invoice Management'}
            </h1>
            <p className="text-muted-foreground mt-1">
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

        {/* Stats Cards */}
        {isLoading ? (
          <AdminStatsGridSkeleton count={4} />
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Invoices</CardTitle>
                <FileText className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-700/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-emerald-400">Paid</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">{stats.paid}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-900/50 to-slate-900 border-amber-700/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-400">Unpaid</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-400">{stats.unpaid}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-900/50 to-slate-900 border-red-700/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-red-400">Overdue</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={language === 'bn' ? 'ইনভয়েস নম্বর খুঁজুন...' : 'Search invoice number...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-600"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-slate-900 border-slate-600">
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

        {/* Invoices Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            {isLoading ? (
              <AdminTableSkeleton rows={8} columns={6} />
            ) : error ? (
              <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400">Failed to load invoices</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-transparent">
                    <TableHead className="text-slate-400">Invoice #</TableHead>
                    <TableHead className="text-slate-400">Amount</TableHead>
                    <TableHead className="text-slate-400">Tax</TableHead>
                    <TableHead className="text-slate-400">Total</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'No invoices match your filters' 
                          : 'No invoices found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="font-medium text-white">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          ৳{invoice.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          ৳{(invoice.tax || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold text-white">
                          ৳{invoice.total.toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-slate-400">
                          {format(new Date(invoice.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invoice.pdf_url && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvoicesManagement;
