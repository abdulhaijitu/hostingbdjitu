import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Server, Globe, MapPin, Calendar, ExternalLink, RefreshCw,
  FolderOpen, Database, Mail, Key, Settings, ArrowLeft, Copy, Check,
  ArrowUpRight, Rocket, AlertCircle, Loader2, Shield
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import UsageProgress from '@/components/client-dashboard/UsageProgress';
import QuickActions from '@/components/client-dashboard/QuickActions';
import PlanUpgradeModal from '@/components/client-dashboard/PlanUpgradeModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { useHostingAccounts, useHostingAccount, useCPanelAction } from '@/hooks/useHostingAccounts';
import { useToast } from '@/hooks/use-toast';

const HostingList: React.FC = () => {
  const { language } = useLanguage();
  const { data: hostingAccounts, isLoading } = useHostingAccounts();
  const { data: orders } = useOrders();
  
  // Combine hosting accounts with legacy order-based display
  const hostingItems = React.useMemo(() => {
    const items: any[] = [];
    
    // Add real hosting accounts
    if (hostingAccounts) {
      hostingAccounts.forEach(account => {
        items.push({
          id: account.id,
          type: 'account',
          name: account.whm_package || 'Hosting Account',
          domain: account.domain,
          status: account.status,
          server: account.hosting_servers,
          location: account.hosting_servers?.location || 'Singapore',
          expiryDate: null, // Would come from order
          account,
        });
      });
    }
    
    // Add pending orders without accounts
    if (orders) {
      const accountOrderIds = hostingAccounts?.map(a => a.order_id) || [];
      orders
        .filter(o => o.order_type === 'hosting' && !accountOrderIds.includes(o.id))
        .forEach(order => {
          items.push({
            id: order.id,
            type: 'order',
            name: order.item_name,
            domain: order.domain_name,
            status: order.status,
            location: 'Singapore',
            expiryDate: order.expiry_date,
            order,
          });
        });
    }
    
    return items;
  }, [hostingAccounts, orders]);

  return (
    <DashboardLayout 
      title={language === 'bn' ? 'আমার হোস্টিং' : 'My Hosting'}
      description={language === 'bn' ? 'আপনার হোস্টিং অ্যাকাউন্ট পরিচালনা করুন' : 'Manage your hosting accounts'}
    >
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'আমার হোস্টিং' : 'My Hosting'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'bn' 
            ? 'আপনার সকল হোস্টিং অ্যাকাউন্ট ম্যানেজ করুন'
            : 'Manage all your hosting accounts'}
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : hostingItems.length > 0 ? (
        <div className="grid gap-4">
          {hostingItems.map(item => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        {item.type === 'account' && item.account?.ssl_status === 'active' && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            SSL
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5" />
                        {item.domain || 'No domain assigned'}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.location}
                        </span>
                        {item.type === 'account' && item.account?.ip_address && (
                          <span className="flex items-center gap-1 font-mono text-xs">
                            IP: {item.account.ip_address}
                          </span>
                        )}
                        {item.expiryDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <StatusBadge status={item.status} />
                    <Button asChild disabled={item.status === 'pending' || item.status === 'provisioning_failed'}>
                      <Link to={item.type === 'account' ? `/client/hosting/${item.id}` : '#'}>
                        {language === 'bn' ? 'ম্যানেজ করুন' : 'Manage'}
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {item.status === 'provisioning_failed' && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {language === 'bn' 
                        ? 'হোস্টিং সেটআপ ব্যর্থ হয়েছে। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।'
                        : 'Hosting setup failed. Please contact support.'}
                    </AlertDescription>
                  </Alert>
                )}
                
                {item.status === 'pending' && (
                  <Alert className="mt-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>
                      {language === 'bn' 
                        ? 'আপনার হোস্টিং সেটআপ হচ্ছে। কিছুক্ষণ অপেক্ষা করুন।'
                        : 'Your hosting is being set up. Please wait a moment.'}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Server className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {language === 'bn' ? 'কোন হোস্টিং অ্যাকাউন্ট নেই' : 'No Hosting Accounts'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {language === 'bn' 
                ? 'আপনার এখনও কোন হোস্টিং অ্যাকাউন্ট নেই'
                : 'You don\'t have any hosting accounts yet'}
            </p>
            <Button variant="hero" asChild>
              <Link to="/hosting/web">
                {language === 'bn' ? 'হোস্টিং কিনুন' : 'Get Hosting Now'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

const HostingDetails: React.FC = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: account, isLoading } = useHostingAccount(id);
  const cpanelAction = useCPanelAction();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: language === 'bn' ? 'কপি হয়েছে!' : 'Copied!',
      description: text,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSyncUsage = async () => {
    if (!id) return;
    setIsSyncing(true);
    try {
      await cpanelAction.mutateAsync({
        action: 'getUsage',
        hostingAccountId: id,
      });
      toast({
        title: language === 'bn' ? 'সিঙ্ক সফল' : 'Sync Successful',
        description: language === 'bn' ? 'রিসোর্স ব্যবহারের তথ্য আপডেট হয়েছে' : 'Resource usage has been updated',
      });
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'সিঙ্ক ব্যর্থ' : 'Sync Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const server = account?.hosting_servers;

  const quickActions = [
    { 
      icon: FolderOpen, 
      label: language === 'bn' ? 'ফাইল ম্যানেজার' : 'File Manager',
      onClick: () => window.location.href = '/client/files'
    },
    { 
      icon: Database, 
      label: language === 'bn' ? 'ডাটাবেস' : 'Databases',
      onClick: () => window.location.href = `/client/databases?account=${id}`
    },
    { 
      icon: Mail, 
      label: language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Accounts',
      onClick: () => window.location.href = `/client/emails?account=${id}`
    },
    { 
      icon: Key, 
      label: language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password',
      onClick: () => toast({ title: 'Coming Soon', description: 'This feature will be available soon.' })
    },
    { 
      icon: RefreshCw, 
      label: language === 'bn' ? 'সিঙ্ক করুন' : 'Sync Usage',
      onClick: handleSyncUsage
    },
    { 
      icon: Settings, 
      label: language === 'bn' ? 'সেটিংস' : 'Settings',
      onClick: () => toast({ title: 'Coming Soon', description: 'This feature will be available soon.' })
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Loading...">
        <Skeleton className="h-96 w-full" />
      </DashboardLayout>
    );
  }

  if (!account) {
    return (
      <DashboardLayout title="Not Found">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="font-semibold text-lg mb-4">
              {language === 'bn' ? 'হোস্টিং খুঁজে পাওয়া যায়নি' : 'Hosting Not Found'}
            </h3>
            <Button asChild>
              <Link to="/client/hosting">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={account.domain}
      description={language === 'bn' ? 'হোস্টিং বিস্তারিত' : 'Hosting Details'}
    >
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/client/hosting">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'bn' ? 'ফিরে যান' : 'Back to Hosting'}
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display flex items-center gap-3">
              {account.domain}
              <StatusBadge status={account.status} />
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span className="font-mono text-sm">{account.cpanel_username}</span>
              {account.whm_package && (
                <>
                  <span>•</span>
                  <span>{account.whm_package}</span>
                </>
              )}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowUpgradeModal(true)}
          >
            <ArrowUpRight className="h-4 w-4" />
            {language === 'bn' ? 'আপগ্রেড' : 'Upgrade Plan'}
          </Button>
        </div>
      </div>

      {/* Suspended Alert */}
      {account.status === 'suspended' && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {language === 'bn' 
              ? `এই অ্যাকাউন্টটি সাসপেন্ড করা হয়েছে${account.suspension_reason ? `: ${account.suspension_reason}` : ''}`
              : `This account has been suspended${account.suspension_reason ? `: ${account.suspension_reason}` : ''}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Upgrade Modal */}
      <PlanUpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlanName={account.whm_package || 'Current Plan'}
        onUpgrade={(planId, planName) => {
          toast({
            title: language === 'bn' ? 'আপগ্রেড অনুরোধ পাঠানো হয়েছে' : 'Upgrade Request Sent',
            description: language === 'bn' 
              ? `${planName} প্ল্যানে আপগ্রেড করার অনুরোধ পাঠানো হয়েছে`
              : `Your request to upgrade to ${planName} has been submitted`,
          });
          setShowUpgradeModal(false);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Usage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{language === 'bn' ? 'রিসোর্স ব্যবহার' : 'Resource Usage'}</CardTitle>
                <CardDescription>
                  {account.last_synced_at 
                    ? `${language === 'bn' ? 'সর্বশেষ সিঙ্ক:' : 'Last synced:'} ${new Date(account.last_synced_at).toLocaleString()}`
                    : language === 'bn' ? 'সিঙ্ক করা হয়নি' : 'Not synced yet'}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSyncUsage}
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {language === 'bn' ? 'সিঙ্ক' : 'Sync'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <UsageProgress
                label={language === 'bn' ? 'ডিস্ক স্পেস' : 'Disk Space'}
                used={account.disk_used_mb / 1024}
                total={account.disk_limit_mb / 1024}
                unit="GB"
              />
              <UsageProgress
                label={language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
                used={account.bandwidth_used_mb / 1024}
                total={account.bandwidth_limit_mb / 1024}
                unit="GB"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Accounts'}
                  </p>
                  <p className="text-xl font-bold">
                    {account.email_accounts_used}/{account.email_accounts_limit}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'bn' ? 'ডাটাবেস' : 'Databases'}
                  </p>
                  <p className="text-xl font-bold">
                    {account.databases_used}/{account.databases_limit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Server Information */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সার্ভার তথ্য' : 'Server Information'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Server IP</p>
                    <p className="font-mono font-medium">{account.ip_address || server?.ip_address || 'N/A'}</p>
                  </div>
                  {account.ip_address && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => copyToClipboard(account.ip_address!, 'ip')}
                    >
                      {copiedField === 'ip' ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">PHP Version</p>
                    <p className="font-medium">PHP {account.php_version}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">SSL Status</p>
                    <Badge variant={account.ssl_status === 'active' ? 'default' : 'secondary'}>
                      {account.ssl_status === 'active' ? '🔒 Active' : account.ssl_status}
                    </Badge>
                  </div>
                </div>

                {server?.nameservers && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-2">Nameservers</p>
                    <div className="space-y-2">
                      {(server.nameservers as string[]).map((ns: string, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <p className="font-mono font-medium">{ns}</p>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(ns, `ns-${index}`)}
                          >
                            {copiedField === `ns-${index}` ? (
                              <Check className="h-4 w-4 text-success" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions
            title={language === 'bn' ? 'দ্রুত অ্যাকশন' : 'Quick Actions'}
            actions={quickActions}
            columns={2}
          />

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'bn' ? 'অ্যাকাউন্ট বিবরণ' : 'Account Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Username</span>
                <span className="font-mono font-medium">{account.cpanel_username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domain</span>
                <span className="font-medium">{account.domain}</span>
              </div>
              {account.whm_package && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{account.whm_package}</span>
                </div>
              )}
              {server && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Server</span>
                  <span className="font-medium">{server.name}</span>
                </div>
              )}
              {account.provisioned_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(account.provisioned_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* cPanel Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'bn' ? 'কন্ট্রোল প্যানেল' : 'Control Panel'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full gap-2" 
                variant="outline"
                onClick={() => {
                  if (server?.hostname) {
                    window.open(`https://${server.hostname}:2083`, '_blank');
                  }
                }}
                disabled={!server?.hostname}
              >
                <ExternalLink className="h-4 w-4" />
                {language === 'bn' ? 'cPanel খুলুন' : 'Open cPanel'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {language === 'bn' 
                  ? 'আপনার cPanel ইউজারনেম এবং পাসওয়ার্ড দিয়ে লগইন করুন'
                  : 'Login with your cPanel username and password'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export { HostingList, HostingDetails };
