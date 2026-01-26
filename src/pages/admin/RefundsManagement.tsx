import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { adminAnalytics } from '@/lib/adminAnalytics';
import { 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

const RefundsManagement: React.FC = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  
  usePagePerformance('Refunds Management');

  // Mock data - in production, this would come from a refund_requests table
  const refundRequests = [
    { id: '1', order_number: 'ORD-20250126-00001', amount: 2500, reason: 'Service not as expected', status: 'pending', created_at: '2025-01-25' },
    { id: '2', order_number: 'ORD-20250125-00002', amount: 1800, reason: 'Changed my mind', status: 'approved', created_at: '2025-01-24' },
    { id: '3', order_number: 'ORD-20250124-00003', amount: 3200, reason: 'Technical issues', status: 'rejected', created_at: '2025-01-23' },
  ];

  const stats = {
    total: refundRequests.length,
    pending: refundRequests.filter(r => r.status === 'pending').length,
    approved: refundRequests.filter(r => r.status === 'approved').length,
    rejected: refundRequests.filter(r => r.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRequests = refundRequests.filter(request => {
    const matchesSearch = request.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'রিফান্ড রিকোয়েস্ট | CHost' : 'Refund Requests | CHost'}
        description="Manage refund requests"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'bn' ? 'রিফান্ড রিকোয়েস্ট' : 'Refund Requests'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'bn' ? 'সকল রিফান্ড রিকোয়েস্ট দেখুন ও প্রসেস করুন' : 'View and process refund requests'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Requests</CardTitle>
              <RotateCcw className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-900/50 to-slate-900 border-amber-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-400">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border-emerald-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-400">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-900/50 to-slate-900 border-red-700/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={language === 'bn' ? 'অর্ডার নম্বর খুঁজুন...' : 'Search order number...'}
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Refunds Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">Order #</TableHead>
                  <TableHead className="text-slate-400">Amount</TableHead>
                  <TableHead className="text-slate-400">Reason</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                      No refund requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-white">{request.order_number}</TableCell>
                      <TableCell className="text-slate-300">৳{request.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-300 max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-slate-400">{request.created_at}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Coming Soon</p>
              <p className="text-blue-400/80">
                Full refund management functionality including approval/rejection workflows, 
                automatic payment processing, and customer notifications will be available soon.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RefundsManagement;
