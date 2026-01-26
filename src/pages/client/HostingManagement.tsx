import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Server, Globe, MapPin, Calendar, ExternalLink, RefreshCw,
  FolderOpen, Database, Mail, Key, Settings, ArrowLeft, Copy, Check,
  ArrowUpRight, Rocket
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import UsageProgress from '@/components/client-dashboard/UsageProgress';
import QuickActions from '@/components/client-dashboard/QuickActions';
import PlanUpgradeModal from '@/components/client-dashboard/PlanUpgradeModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

const HostingList: React.FC = () => {
  const { language } = useLanguage();
  const { data: orders, isLoading } = useOrders();
  
  const hostingOrders = orders?.filter(o => 
    o.order_type === 'hosting' && o.status === 'completed'
  ) || [];

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
      ) : hostingOrders.length > 0 ? (
        <div className="grid gap-4">
          {hostingOrders.map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{order.item_name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5" />
                        {order.domain_name || 'No domain assigned'}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Singapore
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {order.expiry_date 
                            ? `Expires: ${new Date(order.expiry_date).toLocaleDateString()}`
                            : 'No expiry set'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <Button asChild>
                      <Link to={`/client/hosting/${order.id}`}>
                        {language === 'bn' ? 'ম্যানেজ করুন' : 'Manage'}
                      </Link>
                    </Button>
                  </div>
                </div>
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
  const { data: orders, isLoading } = useOrders();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const order = orders?.find(o => o.id === id);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: language === 'bn' ? 'কপি হয়েছে!' : 'Copied!',
      description: text,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Mock server details
  const serverDetails = {
    ip: '103.145.123.45',
    nameservers: ['ns1.chost.com.bd', 'ns2.chost.com.bd'],
    phpVersion: '8.2',
    diskUsed: 2.4,
    diskTotal: 10,
    bandwidthUsed: 45,
    bandwidthTotal: 100,
    emailsUsed: 3,
    emailsTotal: 10,
    databasesUsed: 2,
    databasesTotal: 5,
  };

  const quickActions = [
    { 
      icon: FolderOpen, 
      label: language === 'bn' ? 'ফাইল ম্যানেজার' : 'File Manager',
      onClick: () => window.location.href = '/client/files'
    },
    { 
      icon: Database, 
      label: language === 'bn' ? 'ডাটাবেস' : 'Databases',
      onClick: () => window.location.href = '/client/databases'
    },
    { 
      icon: Mail, 
      label: language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Accounts',
      onClick: () => window.location.href = '/client/emails'
    },
    { 
      icon: Key, 
      label: language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password',
      onClick: () => toast({ title: 'Coming Soon', description: 'This feature will be available soon.' })
    },
    { 
      icon: RefreshCw, 
      label: language === 'bn' ? 'সার্ভিস রিস্টার্ট' : 'Restart Services',
      onClick: () => toast({ title: 'Coming Soon', description: 'This feature will be available soon.' })
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

  if (!order) {
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
      title={order.item_name}
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
              {order.item_name}
              <StatusBadge status={order.status} />
            </h1>
            <p className="text-muted-foreground mt-1">
              {order.domain_name || order.order_number}
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

      {/* Upgrade Modal */}
      <PlanUpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlanName={order.item_name}
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
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'রিসোর্স ব্যবহার' : 'Resource Usage'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? 'আপনার হোস্টিং রিসোর্স ব্যবহারের সারসংক্ষেপ' : 'Overview of your hosting resource usage'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UsageProgress
                label={language === 'bn' ? 'ডিস্ক স্পেস' : 'Disk Space'}
                used={serverDetails.diskUsed}
                total={serverDetails.diskTotal}
                unit="GB"
              />
              <UsageProgress
                label={language === 'bn' ? 'ব্যান্ডউইথ' : 'Bandwidth'}
                used={serverDetails.bandwidthUsed}
                total={serverDetails.bandwidthTotal}
                unit="GB"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Accounts'}
                  </p>
                  <p className="text-xl font-bold">
                    {serverDetails.emailsUsed}/{serverDetails.emailsTotal}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === 'bn' ? 'ডাটাবেস' : 'Databases'}
                  </p>
                  <p className="text-xl font-bold">
                    {serverDetails.databasesUsed}/{serverDetails.databasesTotal}
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
                    <p className="font-mono font-medium">{serverDetails.ip}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => copyToClipboard(serverDetails.ip, 'ip')}
                  >
                    {copiedField === 'ip' ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">PHP Version</p>
                    <p className="font-medium">PHP {serverDetails.phpVersion}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-2">Nameservers</p>
                  <div className="space-y-2">
                    {serverDetails.nameservers.map((ns, index) => (
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

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {language === 'bn' ? 'প্ল্যান বিবরণ' : 'Plan Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">{order.item_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Billing Cycle</span>
                <span className="font-medium capitalize">{order.billing_cycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">৳{order.amount}</span>
              </div>
              {order.expiry_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires</span>
                  <span className="font-medium">
                    {new Date(order.expiry_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export { HostingList, HostingDetails };
