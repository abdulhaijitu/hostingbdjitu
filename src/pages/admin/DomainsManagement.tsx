import React, { useState } from 'react';
import { 
  Globe, Search, RefreshCw, Calendar, Key, ArrowRightLeft, 
  Clock, AlertTriangle, CheckCircle, XCircle, User, FileText, Eye
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  useAdminDomains, 
  useDomainSyncLogs,
  useAdminRenewDomain,
  useOverrideExpiryDate,
  useSyncDomain,
  useUpdateDomainStatus,
  useGenerateAuthCode,
  useInitiateTransferOut,
  AdminDomain,
  DomainSyncLog
} from '@/hooks/useAdminDomains';
import { getStatusColor, getStatusText, getDaysUntilExpiry, DomainStatus } from '@/hooks/useDomains';
import SEOHead from '@/components/common/SEOHead';
import { ErrorState } from '@/components/common/DashboardSkeletons';
import ResponsiveAdminTable from '@/components/admin/ResponsiveAdminTable';
import AdminLayout from '@/components/admin/AdminLayout';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

const DomainsManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('domains');
  
  // Dialog states
  const [selectedDomain, setSelectedDomain] = useState<AdminDomain | null>(null);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showExpiryDialog, setShowExpiryDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  // Form states
  const [renewYears, setRenewYears] = useState('1');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [expiryReason, setExpiryReason] = useState('');
  const [newStatus, setNewStatus] = useState<DomainStatus>('active');
  const [statusReason, setStatusReason] = useState('');
  const [selectedSyncLogDomain, setSelectedSyncLogDomain] = useState<string | undefined>(undefined);

  const { data: domains, isLoading, isError, refetch } = useAdminDomains(statusFilter);
  const { data: syncLogs, isLoading: syncLogsLoading } = useDomainSyncLogs(selectedSyncLogDomain);
  
  const renewMutation = useAdminRenewDomain();
  const expiryMutation = useOverrideExpiryDate();
  const syncMutation = useSyncDomain();
  const statusMutation = useUpdateDomainStatus();
  const authCodeMutation = useGenerateAuthCode();
  const transferOutMutation = useInitiateTransferOut();

  const filteredDomains = domains?.filter(domain => {
    const matchesSearch = 
      domain.domain_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const domainColumns = [
    {
      key: 'domain',
      label: language === 'bn' ? 'ডোমেইন' : 'Domain',
      render: (domain: AdminDomain) => (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <div>
            <span className="font-medium">{domain.domain_name}</span>
            <p className="text-xs text-muted-foreground">{domain.extension}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      label: language === 'bn' ? 'ক্লায়েন্ট' : 'Client',
      hideOnMobile: true,
      render: (domain: AdminDomain) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-sm">{domain.profiles?.full_name || 'N/A'}</span>
            <p className="text-xs text-muted-foreground">{domain.profiles?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'expiry',
      label: language === 'bn' ? 'মেয়াদ' : 'Expiry',
      render: (domain: AdminDomain) => {
        const daysLeft = getDaysUntilExpiry(domain.expiry_date);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-3 w-3" />
              <span>
                {domain.expiry_date 
                  ? format(new Date(domain.expiry_date), 'dd MMM yyyy', { locale: language === 'bn' ? bn : undefined })
                  : 'N/A'}
              </span>
            </div>
            {daysLeft !== null && (
              <Badge variant={daysLeft <= 7 ? 'destructive' : daysLeft <= 30 ? 'secondary' : 'outline'} className="text-xs">
                {daysLeft <= 0 
                  ? (language === 'bn' ? 'মেয়াদ শেষ' : 'Expired')
                  : (language === 'bn' ? `${daysLeft} দিন বাকি` : `${daysLeft} days left`)}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'autoRenew',
      label: language === 'bn' ? 'অটো রিনিউ' : 'Auto Renew',
      hideOnMobile: true,
      render: (domain: AdminDomain) => (
        <Badge variant={domain.auto_renew ? 'default' : 'outline'}>
          {domain.auto_renew 
            ? (language === 'bn' ? 'সক্রিয়' : 'On')
            : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Off')}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: language === 'bn' ? 'স্ট্যাটাস' : 'Status',
      render: (domain: AdminDomain) => (
        <Badge className={getStatusColor(domain.status)}>
          {getStatusText(domain.status, language as 'en' | 'bn')}
        </Badge>
      ),
    },
  ];

  const domainActions = [
    {
      label: language === 'bn' ? 'বিস্তারিত' : 'Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (domain: AdminDomain) => {
        setSelectedDomain(domain);
        setShowDetailsDialog(true);
      },
    },
    {
      label: language === 'bn' ? 'রিনিউ' : 'Renew',
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: (domain: AdminDomain) => {
        setSelectedDomain(domain);
        setShowRenewDialog(true);
      },
    },
    {
      label: language === 'bn' ? 'এক্সপায়ারি' : 'Expiry',
      icon: <Calendar className="h-4 w-4" />,
      onClick: (domain: AdminDomain) => {
        setSelectedDomain(domain);
        setNewExpiryDate(domain.expiry_date ? domain.expiry_date.split('T')[0] : '');
        setShowExpiryDialog(true);
      },
    },
    {
      label: language === 'bn' ? 'EPP কোড' : 'EPP Code',
      icon: <Key className="h-4 w-4" />,
      onClick: (domain: AdminDomain) => {
        authCodeMutation.mutate(domain.id);
      },
    },
    {
      label: language === 'bn' ? 'সিঙ্ক' : 'Sync',
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: (domain: AdminDomain) => {
        syncMutation.mutate(domain.id);
      },
    },
  ];

  const syncLogColumns = [
    {
      key: 'domain',
      label: language === 'bn' ? 'ডোমেইন' : 'Domain',
      render: (log: DomainSyncLog) => (
        <span className="font-mono text-sm">{log.domain_id?.slice(0, 8) || 'N/A'}</span>
      ),
    },
    {
      key: 'type',
      label: language === 'bn' ? 'টাইপ' : 'Type',
      render: (log: DomainSyncLog) => (
        <Badge variant="outline">{log.sync_type}</Badge>
      ),
    },
    {
      key: 'status',
      label: language === 'bn' ? 'স্ট্যাটাস' : 'Status',
      render: (log: DomainSyncLog) => (
        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
          {log.status === 'success' 
            ? <CheckCircle className="h-3 w-3 mr-1" />
            : <XCircle className="h-3 w-3 mr-1" />}
          {log.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      label: language === 'bn' ? 'তারিখ' : 'Date',
      render: (log: DomainSyncLog) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}
        </span>
      ),
    },
    {
      key: 'error',
      label: language === 'bn' ? 'ত্রুটি' : 'Error',
      hideOnMobile: true,
      render: (log: DomainSyncLog) => (
        <span className="text-sm text-destructive truncate max-w-[200px]">
          {log.error_message || '-'}
        </span>
      ),
    },
  ];

  const handleRenew = async () => {
    if (!selectedDomain) return;
    await renewMutation.mutateAsync({ 
      domainId: selectedDomain.id, 
      years: parseInt(renewYears) 
    });
    setShowRenewDialog(false);
    setSelectedDomain(null);
  };

  const handleExpiryOverride = async () => {
    if (!selectedDomain || !newExpiryDate || !expiryReason) return;
    await expiryMutation.mutateAsync({ 
      domainId: selectedDomain.id, 
      newExpiryDate: new Date(newExpiryDate).toISOString(),
      reason: expiryReason
    });
    setShowExpiryDialog(false);
    setSelectedDomain(null);
    setNewExpiryDate('');
    setExpiryReason('');
  };

  const handleStatusChange = async () => {
    if (!selectedDomain) return;
    await statusMutation.mutateAsync({ 
      domainId: selectedDomain.id, 
      status: newStatus,
      reason: statusReason
    });
    setShowStatusDialog(false);
    setSelectedDomain(null);
    setStatusReason('');
  };

  const statusOptions: DomainStatus[] = [
    'pending_registration',
    'active',
    'pending_renewal',
    'expired',
    'grace_period',
    'redemption',
    'cancelled',
    'transfer_in',
    'transfer_out'
  ];

  // Stats
  const stats = {
    total: domains?.length || 0,
    active: domains?.filter(d => d.status === 'active').length || 0,
    expiringSoon: domains?.filter(d => {
      const days = getDaysUntilExpiry(d.expiry_date);
      return days !== null && days <= 30 && days > 0;
    }).length || 0,
    expired: domains?.filter(d => d.status === 'expired' || d.status === 'grace_period').length || 0,
  };

  return (
    <AdminLayout>
      <SEOHead 
        title={language === 'bn' ? 'ডোমেইন ম্যানেজমেন্ট' : 'Domain Management'}
        description="Manage all domains"
        canonicalUrl="/admin/domains"
      />
      
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-display flex items-center gap-3">
              <Globe className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              {language === 'bn' ? 'ডোমেইন ম্যানেজমেন্ট' : 'Domain Management'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {language === 'bn' 
                ? 'সকল ডোমেইন পরিচালনা করুন'
                : 'Manage all domains'}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? 'মোট' : 'Total'}</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Globe className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? 'সক্রিয়' : 'Active'}</p>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? '৩০ দিনে শেষ' : 'Expiring Soon'}</p>
                  <p className="text-2xl font-bold text-warning">{stats.expiringSoon}</p>
                </div>
                <Clock className="h-8 w-8 text-warning/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? 'মেয়াদ শেষ' : 'Expired'}</p>
                  <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-destructive/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="domains">
              {language === 'bn' ? 'ডোমেইন তালিকা' : 'Domain List'}
            </TabsTrigger>
            <TabsTrigger value="sync-logs">
              {language === 'bn' ? 'সিঙ্ক লগ' : 'Sync Logs'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="domains" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'bn' ? 'ডোমেইন বা ক্লায়েন্ট খুঁজুন...' : 'Search domain or client...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="all">{language === 'bn' ? 'সব স্ট্যাটাস' : 'All Status'}</SelectItem>
                      <SelectItem value="active">{language === 'bn' ? 'সক্রিয়' : 'Active'}</SelectItem>
                      <SelectItem value="pending_registration">{language === 'bn' ? 'রেজিস্ট্রেশন পেন্ডিং' : 'Pending Registration'}</SelectItem>
                      <SelectItem value="pending_renewal">{language === 'bn' ? 'রিনিউ পেন্ডিং' : 'Pending Renewal'}</SelectItem>
                      <SelectItem value="expired">{language === 'bn' ? 'মেয়াদ শেষ' : 'Expired'}</SelectItem>
                      <SelectItem value="grace_period">{language === 'bn' ? 'গ্রেস পিরিয়ড' : 'Grace Period'}</SelectItem>
                      <SelectItem value="redemption">{language === 'bn' ? 'রিডেম্পশন' : 'Redemption'}</SelectItem>
                      <SelectItem value="transfer_in">{language === 'bn' ? 'ট্রান্সফার ইন' : 'Transfer In'}</SelectItem>
                      <SelectItem value="transfer_out">{language === 'bn' ? 'ট্রান্সফার আউট' : 'Transfer Out'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Domains Table */}
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle>{language === 'bn' ? 'ডোমেইন তালিকা' : 'Domain List'}</CardTitle>
                <CardDescription>
                  {language === 'bn' 
                    ? `মোট ${filteredDomains?.length || 0}টি ডোমেইন`
                    : `Total ${filteredDomains?.length || 0} domains`}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                {isError ? (
                  <div className="p-4">
                    <ErrorState 
                      title={language === 'bn' ? 'ডেটা লোড করতে সমস্যা হয়েছে' : 'Failed to load data'}
                      onRetry={() => refetch()}
                    />
                  </div>
                ) : (
                  <ResponsiveAdminTable
                    data={filteredDomains || []}
                    columns={domainColumns}
                    actions={domainActions}
                    keyExtractor={(domain) => domain.id}
                    isLoading={isLoading}
                    getTitle={(domain) => domain.domain_name}
                    getSubtitle={(domain) => domain.profiles?.email || ''}
                    getBadge={(domain) => ({
                      text: getStatusText(domain.status, language as 'en' | 'bn'),
                      variant: domain.status === 'active' ? 'success' 
                        : ['expired', 'redemption'].includes(domain.status) ? 'destructive' 
                        : 'secondary',
                    })}
                    language={language as 'en' | 'bn'}
                    mobileExpandable={true}
                    emptyState={
                      <div className="text-center py-12">
                        <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          {language === 'bn' ? 'কোন ডোমেইন পাওয়া যায়নি' : 'No domains found'}
                        </p>
                      </div>
                    }
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync-logs" className="space-y-4">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle>{language === 'bn' ? 'সিঙ্ক লগ' : 'Sync Logs'}</CardTitle>
                <CardDescription>
                  {language === 'bn' 
                    ? 'রেজিস্ট্রার সিঙ্ক অপারেশনের লগ'
                    : 'Registrar sync operation logs'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 md:p-6 md:pt-0">
                <ResponsiveAdminTable
                  data={syncLogs || []}
                  columns={syncLogColumns}
                  actions={[]}
                  keyExtractor={(log) => log.id}
                  isLoading={syncLogsLoading}
                  getTitle={(log) => log.sync_type}
                  getSubtitle={(log) => format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}
                  getBadge={(log) => ({
                    text: log.status,
                    variant: log.status === 'success' ? 'success' : 'destructive',
                  })}
                  language={language as 'en' | 'bn'}
                  mobileExpandable={true}
                  emptyState={
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === 'bn' ? 'কোন সিঙ্ক লগ পাওয়া যায়নি' : 'No sync logs found'}
                      </p>
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Renew Dialog */}
        <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === 'bn' ? 'ডোমেইন রিনিউ করুন' : 'Renew Domain'}</DialogTitle>
              <DialogDescription>{selectedDomain?.domain_name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>{language === 'bn' ? 'রিনিউ সময়কাল' : 'Renewal Period'}</Label>
                <Select value={renewYears} onValueChange={setRenewYears}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="1">1 {language === 'bn' ? 'বছর' : 'Year'}</SelectItem>
                    <SelectItem value="2">2 {language === 'bn' ? 'বছর' : 'Years'}</SelectItem>
                    <SelectItem value="3">3 {language === 'bn' ? 'বছর' : 'Years'}</SelectItem>
                    <SelectItem value="5">5 {language === 'bn' ? 'বছর' : 'Years'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button onClick={handleRenew} disabled={renewMutation.isPending}>
                {renewMutation.isPending 
                  ? (language === 'bn' ? 'রিনিউ হচ্ছে...' : 'Renewing...')
                  : (language === 'bn' ? 'রিনিউ করুন' : 'Renew')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Expiry Override Dialog */}
        <Dialog open={showExpiryDialog} onOpenChange={setShowExpiryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === 'bn' ? 'এক্সপায়ারি ডেট পরিবর্তন' : 'Override Expiry Date'}</DialogTitle>
              <DialogDescription>{selectedDomain?.domain_name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>{language === 'bn' ? 'নতুন এক্সপায়ারি ডেট' : 'New Expiry Date'}</Label>
                <Input
                  type="date"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{language === 'bn' ? 'কারণ' : 'Reason'}</Label>
                <Textarea
                  value={expiryReason}
                  onChange={(e) => setExpiryReason(e.target.value)}
                  placeholder={language === 'bn' ? 'পরিবর্তনের কারণ লিখুন...' : 'Enter reason for change...'}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowExpiryDialog(false)}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleExpiryOverride} 
                disabled={!newExpiryDate || !expiryReason || expiryMutation.isPending}
              >
                {expiryMutation.isPending 
                  ? (language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...')
                  : (language === 'bn' ? 'আপডেট করুন' : 'Update')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{language === 'bn' ? 'ডোমেইন বিস্তারিত' : 'Domain Details'}</DialogTitle>
              <DialogDescription>{selectedDomain?.domain_name}</DialogDescription>
            </DialogHeader>
            {selectedDomain && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</Label>
                    <p className="mt-1">
                      <Badge className={getStatusColor(selectedDomain.status)}>
                        {getStatusText(selectedDomain.status, language as 'en' | 'bn')}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{language === 'bn' ? 'অটো রিনিউ' : 'Auto Renew'}</Label>
                    <p className="mt-1">
                      <Badge variant={selectedDomain.auto_renew ? 'default' : 'outline'}>
                        {selectedDomain.auto_renew ? 'On' : 'Off'}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{language === 'bn' ? 'রেজিস্ট্রেশন তারিখ' : 'Registration Date'}</Label>
                    <p className="mt-1 font-medium">
                      {selectedDomain.registration_date 
                        ? format(new Date(selectedDomain.registration_date), 'dd MMM yyyy')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{language === 'bn' ? 'এক্সপায়ারি তারিখ' : 'Expiry Date'}</Label>
                    <p className="mt-1 font-medium">
                      {selectedDomain.expiry_date 
                        ? format(new Date(selectedDomain.expiry_date), 'dd MMM yyyy')
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">{language === 'bn' ? 'নেমসার্ভার' : 'Nameservers'}</Label>
                    <div className="mt-1 space-y-1">
                      {selectedDomain.nameservers?.map((ns, i) => (
                        <p key={i} className="font-mono text-sm">{ns}</p>
                      ))}
                    </div>
                  </div>
                  {selectedDomain.auth_code && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">{language === 'bn' ? 'EPP/Auth কোড' : 'EPP/Auth Code'}</Label>
                      <p className="mt-1 font-mono bg-muted px-2 py-1 rounded">{selectedDomain.auth_code}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">{language === 'bn' ? 'রেজিস্ট্রার' : 'Registrar'}</Label>
                    <p className="mt-1 font-medium">{selectedDomain.registrar_name}</p>
                  </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowStatusDialog(true);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'স্ট্যাটাস পরিবর্তন' : 'Change Status'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowDetailsDialog(false);
                      setShowTransferDialog(true);
                    }}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'ট্রান্সফার' : 'Transfer'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === 'bn' ? 'স্ট্যাটাস পরিবর্তন' : 'Change Status'}</DialogTitle>
              <DialogDescription>{selectedDomain?.domain_name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>{language === 'bn' ? 'নতুন স্ট্যাটাস' : 'New Status'}</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as DomainStatus)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {getStatusText(status, language as 'en' | 'bn')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'bn' ? 'কারণ (ঐচ্ছিক)' : 'Reason (Optional)'}</Label>
                <Textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder={language === 'bn' ? 'পরিবর্তনের কারণ...' : 'Reason for change...'}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button onClick={handleStatusChange} disabled={statusMutation.isPending}>
                {statusMutation.isPending 
                  ? (language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...')
                  : (language === 'bn' ? 'আপডেট করুন' : 'Update')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transfer Dialog */}
        <AlertDialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {language === 'bn' ? 'ডোমেইন ট্রান্সফার আউট?' : 'Transfer Domain Out?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {language === 'bn' 
                  ? 'এটি ডোমেইনটিকে ট্রান্সফার আউটের জন্য আনলক করবে। ক্লায়েন্ট EPP কোড পাবে।'
                  : 'This will unlock the domain for transfer out. Client will receive the EPP code.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  if (selectedDomain) {
                    transferOutMutation.mutate({ domainId: selectedDomain.id });
                  }
                  setShowTransferDialog(false);
                }}
              >
                {language === 'bn' ? 'ট্রান্সফার শুরু করুন' : 'Initiate Transfer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default DomainsManagement;
