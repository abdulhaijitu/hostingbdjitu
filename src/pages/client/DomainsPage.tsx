import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Calendar, RefreshCw, Lock, Unlock, Settings,
  ExternalLink, Search, Plus, Network
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import DNSManagementModal from '@/components/client-dashboard/DNSManagementModal';
import WHOISLookup from '@/components/client-dashboard/WHOISLookup';
import DNSPropagationChecker from '@/components/client-dashboard/DNSPropagationChecker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

const DomainsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: orders, isLoading } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [showNameserverDialog, setShowNameserverDialog] = useState(false);
  const [showDNSDialog, setShowDNSDialog] = useState(false);
  const [dnsDomain, setDnsDomain] = useState('');

  const domainOrders = orders?.filter(o => 
    o.order_type === 'domain' && o.status === 'completed'
  ) || [];

  const filteredDomains = domainOrders.filter(d => 
    d.domain_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRenew = (domain: any) => {
    toast({
      title: language === 'bn' ? 'রিনিউ প্রসেসিং...' : 'Processing Renewal...',
      description: language === 'bn' 
        ? 'আপনাকে পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে'
        : 'Redirecting you to payment page',
    });
  };

  const handleToggleAutoRenew = (domain: any, enabled: boolean) => {
    toast({
      title: enabled 
        ? (language === 'bn' ? 'অটো-রিনিউ সক্রিয়' : 'Auto-Renew Enabled')
        : (language === 'bn' ? 'অটো-রিনিউ নিষ্ক্রিয়' : 'Auto-Renew Disabled'),
      description: domain.domain_name || domain.item_name,
    });
  };

  const handleToggleLock = (domain: any) => {
    toast({
      title: language === 'bn' ? 'ডোমেইন লক আপডেট হয়েছে' : 'Domain Lock Updated',
      description: domain.domain_name || domain.item_name,
    });
  };

  return (
    <DashboardLayout 
      title={language === 'bn' ? 'আমার ডোমেইন' : 'My Domains'}
      description={language === 'bn' ? 'আপনার ডোমেইন পরিচালনা করুন' : 'Manage your domains'}
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              {language === 'bn' ? 'আমার ডোমেইন' : 'My Domains'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' 
                ? 'আপনার সকল ডোমেইন ম্যানেজ করুন'
                : 'Manage all your domain names'}
            </p>
          </div>
          <Button variant="hero" asChild>
            <Link to="/domain/register">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'নতুন ডোমেইন' : 'Register Domain'}
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="domains" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="domains">
            {language === 'bn' ? 'ডোমেইন' : 'Domains'}
          </TabsTrigger>
          <TabsTrigger value="whois">
            WHOIS
          </TabsTrigger>
          <TabsTrigger value="dns">
            DNS Propagation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="mt-6">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'bn' ? 'ডোমেইন খুঁজুন...' : 'Search domains...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : filteredDomains.length > 0 ? (
            <div className="space-y-4">
              {filteredDomains.map(domain => (
                <Card key={domain.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-success/10">
                          <Globe className="h-6 w-6 text-success" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {domain.domain_name || domain.item_name}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Registered: {new Date(domain.created_at).toLocaleDateString()}
                            </span>
                            {domain.expiry_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                Expires: {new Date(domain.expiry_date).toLocaleDateString()}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Lock className="h-3.5 w-3.5" />
                              Locked
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={domain.status} />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRenew(domain)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          {language === 'bn' ? 'রিনিউ' : 'Renew'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setDnsDomain(domain.domain_name || domain.item_name);
                            setShowDNSDialog(true);
                          }}
                        >
                          <Network className="h-4 w-4 mr-2" />
                          {language === 'bn' ? 'DNS' : 'DNS'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedDomain(domain);
                            setShowNameserverDialog(true);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {language === 'bn' ? 'নেমসার্ভার' : 'Nameservers'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleLock(domain)}
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Auto-renew toggle */}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id={`autorenew-${domain.id}`}
                          defaultChecked={true}
                          onCheckedChange={(checked) => handleToggleAutoRenew(domain, checked)}
                        />
                        <Label htmlFor={`autorenew-${domain.id}`} className="text-sm">
                          {language === 'bn' ? 'অটো-রিনিউ সক্রিয়' : 'Auto-Renew Enabled'}
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Globe className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  {searchQuery 
                    ? (language === 'bn' ? 'কোন ডোমেইন পাওয়া যায়নি' : 'No Domains Found')
                    : (language === 'bn' ? 'কোন ডোমেইন নেই' : 'No Domains Yet')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? (language === 'bn' ? 'আপনার সার্চ পরিবর্তন করে দেখুন' : 'Try adjusting your search')
                    : (language === 'bn' ? 'আপনার প্রথম ডোমেইন রেজিস্টার করুন' : 'Register your first domain name')}
                </p>
                {!searchQuery && (
                  <Button variant="hero" asChild>
                    <Link to="/domain/register">
                      {language === 'bn' ? 'ডোমেইন রেজিস্টার করুন' : 'Register a Domain'}
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="whois" className="mt-6">
          <WHOISLookup />
        </TabsContent>

        <TabsContent value="dns" className="mt-6">
          <DNSPropagationChecker />
        </TabsContent>
      </Tabs>

      {/* Nameserver Dialog */}
      <Dialog open={showNameserverDialog} onOpenChange={setShowNameserverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নেমসার্ভার আপডেট করুন' : 'Update Nameservers'}
            </DialogTitle>
            <DialogDescription>
              {selectedDomain?.domain_name || selectedDomain?.item_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Nameserver 1</Label>
              <Input defaultValue="ns1.chost.com.bd" className="mt-1" />
            </div>
            <div>
              <Label>Nameserver 2</Label>
              <Input defaultValue="ns2.chost.com.bd" className="mt-1" />
            </div>
            <div>
              <Label>Nameserver 3 (Optional)</Label>
              <Input placeholder="ns3.example.com" className="mt-1" />
            </div>
            <div>
              <Label>Nameserver 4 (Optional)</Label>
              <Input placeholder="ns4.example.com" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameserverDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={() => {
              toast({
                title: language === 'bn' ? 'নেমসার্ভার আপডেট হয়েছে' : 'Nameservers Updated',
                description: language === 'bn' 
                  ? 'পরিবর্তন কার্যকর হতে ২৪-৪৮ ঘন্টা সময় লাগতে পারে'
                  : 'Changes may take 24-48 hours to propagate',
              });
              setShowNameserverDialog(false);
            }}>
              {language === 'bn' ? 'সেভ করুন' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DNS Management Modal */}
      <DNSManagementModal
        open={showDNSDialog}
        onOpenChange={setShowDNSDialog}
        domainName={dnsDomain}
      />
    </DashboardLayout>
  );
};

export default DomainsPage;
