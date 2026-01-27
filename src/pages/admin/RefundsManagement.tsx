import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ResponsiveAdminTable from '@/components/admin/ResponsiveAdminTable';

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
          <Badge className="bg-warning/20 text-warning border-warning/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-success/20 text-success border-success/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30">
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

  // Columns for ResponsiveAdminTable
  const columns = [
    {
      key: 'order_number',
      label: 'Order #',
      render: (request: any) => (
        <span className="font-medium">{request.order_number}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      highlight: true,
      render: (request: any) => `৳${request.amount.toLocaleString()}`,
    },
    {
      key: 'reason',
      label: 'Reason',
      hideOnMobile: true,
      render: (request: any) => (
        <span className="truncate max-w-xs">{request.reason}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (request: any) => getStatusBadge(request.status),
    },
    {
      key: 'created_at',
      label: 'Date',
      hideOnMobile: true,
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'রিফান্ড রিকোয়েস্ট | CHost' : 'Refund Requests | CHost'}
        description="Manage refund requests"
      />
      
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            {language === 'bn' ? 'রিফান্ড রিকোয়েস্ট' : 'Refund Requests'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {language === 'bn' ? 'সকল রিফান্ড রিকোয়েস্ট দেখুন ও প্রসেস করুন' : 'View and process refund requests'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-warning/5 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-warning">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card className="bg-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-success">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-success">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-destructive">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-destructive">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'bn' ? 'অর্ডার নম্বর খুঁজুন...' : 'Search order number...'}
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Refunds Table */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{language === 'bn' ? 'রিফান্ড তালিকা' : 'Refund Requests'}</CardTitle>
            <CardDescription>
              {filteredRequests.length} {language === 'bn' ? 'টি রিকোয়েস্ট' : 'requests'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            <ResponsiveAdminTable
              data={filteredRequests}
              columns={columns}
              keyExtractor={(request) => request.id}
              isLoading={false}
              getTitle={(request) => request.order_number}
              getSubtitle={(request) => `৳${request.amount.toLocaleString()}`}
              getBadge={(request) => {
                const variantMap: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
                  pending: 'warning',
                  approved: 'success',
                  rejected: 'destructive',
                };
                return {
                  text: request.status.charAt(0).toUpperCase() + request.status.slice(1),
                  variant: variantMap[request.status] || 'secondary',
                };
              }}
              language={language as 'en' | 'bn'}
              mobileExpandable={true}
              emptyState={
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  No refund requests found
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* Info Note */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm text-primary">
              <p className="font-medium mb-1">Coming Soon</p>
              <p className="text-primary/80">
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
