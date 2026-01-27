import React, { useState } from 'react';
import { 
  Server, Search, RefreshCw, Ban, CheckCircle, Trash2, 
  Eye, HardDrive, Mail, Database, Globe, User
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  useAllHostingAccounts, 
  useSuspendAccount, 
  useUnsuspendAccount,
  useTerminateAccount,
  useSyncAccountUsage
} from '@/hooks/useAllHostingAccounts';
import SEOHead from '@/components/common/SEOHead';
import { ErrorState } from '@/components/common/DashboardSkeletons';
import ResponsiveAdminTable from '@/components/admin/ResponsiveAdminTable';

const HostingAccountsManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [terminateId, setTerminateId] = useState<string | null>(null);

  const { data: accounts, isLoading, isError, refetch } = useAllHostingAccounts();
  const suspendMutation = useSuspendAccount();
  const unsuspendMutation = useUnsuspendAccount();
  const terminateMutation = useTerminateAccount();
  const syncMutation = useSyncAccountUsage();

  const filteredAccounts = accounts?.filter(account => {
    const matchesSearch = 
      account.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.cpanel_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (account.profiles as any)?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success border-success/30">{language === 'bn' ? 'সক্রিয়' : 'Active'}</Badge>;
      case 'suspended':
        return <Badge variant="destructive">{language === 'bn' ? 'সাসপেন্ড' : 'Suspended'}</Badge>;
      case 'pending':
        return <Badge variant="secondary">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</Badge>;
      case 'terminated':
        return <Badge variant="outline" className="text-muted-foreground">{language === 'bn' ? 'টার্মিনেট' : 'Terminated'}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSuspend = async () => {
    if (!selectedAccount || !suspendReason) return;
    try {
      await suspendMutation.mutateAsync({ accountId: selectedAccount.id, reason: suspendReason });
      toast({
        title: language === 'bn' ? 'সাসপেন্ড হয়েছে' : 'Account Suspended',
        description: `${selectedAccount.domain} সাসপেন্ড করা হয়েছে`,
        variant: 'destructive',
      });
      setShowSuspendDialog(false);
      setSuspendReason('');
      setSelectedAccount(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUnsuspend = async (account: any) => {
    try {
      await unsuspendMutation.mutateAsync({ accountId: account.id });
      toast({
        title: language === 'bn' ? 'আনসাসপেন্ড হয়েছে' : 'Account Unsuspended',
        description: `${account.domain} আবার সক্রিয় করা হয়েছে`,
      });
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleTerminate = async () => {
    if (!terminateId) return;
    const account = accounts?.find(a => a.id === terminateId);
    try {
      await terminateMutation.mutateAsync({ accountId: terminateId });
      toast({
        title: language === 'bn' ? 'টার্মিনেট হয়েছে' : 'Account Terminated',
        description: `${account?.domain} টার্মিনেট করা হয়েছে`,
        variant: 'destructive',
      });
      setTerminateId(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSync = async (account: any) => {
    try {
      await syncMutation.mutateAsync({ accountId: account.id });
      toast({
        title: language === 'bn' ? 'সিঙ্ক হয়েছে' : 'Synced',
        description: language === 'bn' ? 'ব্যবহার তথ্য আপডেট হয়েছে' : 'Usage data updated',
      });
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatBytes = (mb: number | null) => {
    if (!mb) return '0 MB';
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(0)} MB`;
  };

  // Columns for ResponsiveAdminTable
  const columns = [
    {
      key: 'domain',
      label: language === 'bn' ? 'ডোমেইন' : 'Domain',
      render: (account: any) => (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <div>
            <span className="font-medium">{account.domain}</span>
            <p className="text-xs text-muted-foreground font-mono">{account.cpanel_username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'client',
      label: language === 'bn' ? 'ক্লায়েন্ট' : 'Client',
      hideOnMobile: true,
      render: (account: any) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="text-sm">{(account.profiles as any)?.full_name || 'N/A'}</span>
            <p className="text-xs text-muted-foreground">{(account.profiles as any)?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'server',
      label: language === 'bn' ? 'সার্ভার' : 'Server',
      hideOnMobile: true,
      render: (account: any) => (
        <span className="text-sm">{(account.hosting_servers as any)?.name || 'N/A'}</span>
      ),
    },
    {
      key: 'usage',
      label: language === 'bn' ? 'ব্যবহার' : 'Usage',
      render: (account: any) => {
        const diskPercent = account.disk_limit_mb 
          ? ((account.disk_used_mb || 0) / account.disk_limit_mb) * 100 
          : 0;
        return (
          <div className="space-y-1 min-w-[120px]">
            <div className="flex items-center gap-2 text-xs">
              <HardDrive className="h-3 w-3" />
              <span>{formatBytes(account.disk_used_mb)} / {formatBytes(account.disk_limit_mb)}</span>
            </div>
            <Progress value={diskPercent} className="h-1" />
          </div>
        );
      },
    },
    {
      key: 'status',
      label: language === 'bn' ? 'স্ট্যাটাস' : 'Status',
      render: (account: any) => (
        <div>
          {getStatusBadge(account.status)}
          {account.suspension_reason && (
            <p className="text-xs text-muted-foreground mt-1 truncate max-w-[100px]">{account.suspension_reason}</p>
          )}
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: language === 'bn' ? 'সিঙ্ক' : 'Sync',
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: (account: any) => handleSync(account),
    },
    {
      label: language === 'bn' ? 'ডিলিট' : 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (account: any) => setTerminateId(account.id),
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'হোস্টিং অ্যাকাউন্ট ম্যানেজমেন্ট' : 'Hosting Accounts Management'}
        description="Manage all hosting accounts"
        canonicalUrl="/admin/hosting-accounts"
      />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-display flex items-center gap-3">
              <Server className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              {language === 'bn' ? 'হোস্টিং অ্যাকাউন্ট' : 'Hosting Accounts'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {language === 'bn' 
                ? 'সকল ক্লায়েন্টের হোস্টিং অ্যাকাউন্ট পরিচালনা করুন'
                : 'Manage all client hosting accounts'}
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'bn' ? 'ডোমেইন, ইউজারনেম বা ইমেইল খুঁজুন...' : 'Search domain, username or email...'}
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
                  <SelectItem value="suspended">{language === 'bn' ? 'সাসপেন্ড' : 'Suspended'}</SelectItem>
                  <SelectItem value="pending">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</SelectItem>
                  <SelectItem value="terminated">{language === 'bn' ? 'টার্মিনেট' : 'Terminated'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{language === 'bn' ? 'অ্যাকাউন্ট তালিকা' : 'Account List'}</CardTitle>
            <CardDescription>
              {language === 'bn' 
                ? `মোট ${filteredAccounts?.length || 0}টি অ্যাকাউন্ট`
                : `Total ${filteredAccounts?.length || 0} accounts`}
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
                data={filteredAccounts || []}
                columns={columns}
                actions={actions}
                keyExtractor={(account) => account.id}
                isLoading={isLoading}
                getTitle={(account) => account.domain}
                getSubtitle={(account) => account.cpanel_username}
                getBadge={(account) => {
                  const variantMap: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
                    active: 'success',
                    pending: 'warning',
                    suspended: 'destructive',
                    terminated: 'secondary',
                  };
                  return {
                    text: account.status.charAt(0).toUpperCase() + account.status.slice(1),
                    variant: variantMap[account.status] || 'secondary',
                  };
                }}
                language={language as 'en' | 'bn'}
                mobileExpandable={true}
                emptyState={
                  <div className="text-center py-12">
                    <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'কোন অ্যাকাউন্ট পাওয়া যায়নি' : 'No accounts found'}
                    </p>
                  </div>
                }
              />
            )}
          </CardContent>
        </Card>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'অ্যাকাউন্ট সাসপেন্ড করুন' : 'Suspend Account'}</DialogTitle>
            <DialogDescription>
              {selectedAccount?.domain}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'সাসপেন্ড কারণ' : 'Suspension Reason'}</Label>
              <Textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder={language === 'bn' ? 'কারণ লিখুন...' : 'Enter reason...'}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleSuspend}
              disabled={!suspendReason || suspendMutation.isPending}
            >
              {language === 'bn' ? 'সাসপেন্ড করুন' : 'Suspend'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Confirmation */}
      <AlertDialog open={!!terminateId} onOpenChange={() => setTerminateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'bn' ? 'অ্যাকাউন্ট টার্মিনেট করবেন?' : 'Terminate Account?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? 'এই অ্যাকাউন্ট এবং সম্পর্কিত সকল ডেটা স্থায়ীভাবে মুছে যাবে।'
                : 'This account and all associated data will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleTerminate} className="bg-destructive text-destructive-foreground">
              {language === 'bn' ? 'টার্মিনেট' : 'Terminate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default HostingAccountsManagement;
