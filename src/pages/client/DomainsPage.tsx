import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, Calendar, RefreshCw, Lock, Unlock, Settings,
  Search, Plus, Network, AlertTriangle, Clock, CheckCircle,
  Loader2, ExternalLink
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  useDomains, 
  useToggleAutoRenew, 
  useUpdateNameservers,
  useRenewDomain,
  getDaysUntilExpiry,
  getStatusColor,
  getStatusText,
  Domain
} from '@/hooks/useDomains';

const DomainsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: domains, isLoading, isError, refetch } = useDomains();
  const toggleAutoRenew = useToggleAutoRenew();
  const updateNameservers = useUpdateNameservers();
  const renewDomain = useRenewDomain();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [showNameserverDialog, setShowNameserverDialog] = useState(false);
  const [showDNSDialog, setShowDNSDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [dnsDomain, setDnsDomain] = useState('');
  const [nameserverInputs, setNameserverInputs] = useState(['', '', '', '']);

  const filteredDomains = (domains || []).filter(d => 
    d.domain_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count domains by status
  const activeDomains = domains?.filter(d => d.status === 'active').length || 0;
  const expiringDomains = domains?.filter(d => {
    const days = getDaysUntilExpiry(d.expiry_date);
    return days !== null && days <= 30 && days > 0;
  }).length || 0;
  const expiredDomains = domains?.filter(d => 
    ['expired', 'grace_period', 'redemption'].includes(d.status)
  ).length || 0;

  const handleToggleAutoRenew = (domain: Domain, enabled: boolean) => {
    toggleAutoRenew.mutate({ domainId: domain.id, autoRenew: enabled });
  };

  const handleUpdateNameservers = () => {
    if (!selectedDomain) return;
    const validNs = nameserverInputs.filter(ns => ns.trim());
    if (validNs.length < 2) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'কমপক্ষে ২টি নেমসার্ভার দরকার' : 'At least 2 nameservers required',
        variant: 'destructive',
      });
      return;
    }
    updateNameservers.mutate(
      { domainId: selectedDomain.id, nameservers: validNs },
      { onSuccess: () => setShowNameserverDialog(false) }
    );
  };

  const handleRenewDomain = () => {
    if (!selectedDomain) return;
    renewDomain.mutate(
      { domainId: selectedDomain.id, years: 1 },
      { onSuccess: () => setShowRenewDialog(false) }
    );
  };

  const openNameserverDialog = (domain: Domain) => {
    setSelectedDomain(domain);
    const ns = domain.nameservers || [];
    setNameserverInputs([ns[0] || '', ns[1] || '', ns[2] || '', ns[3] || '']);
    setShowNameserverDialog(true);
  };

  const openRenewDialog = (domain: Domain) => {
    setSelectedDomain(domain);
    setShowRenewDialog(true);
  };

  const renderExpiryBadge = (domain: Domain) => {
    const days = getDaysUntilExpiry(domain.expiry_date);
    if (days === null) return null;

    if (days <= 0) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {language === 'bn' ? 'মেয়াদ শেষ' : 'Expired'}
        </Badge>
      );
    } else if (days <= 7) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Clock className="h-3 w-3" />
          {days} {language === 'bn' ? 'দিন বাকি' : 'days left'}
        </Badge>
      );
    } else if (days <= 30) {
      return (
        <Badge variant="outline" className="gap-1 border-warning text-warning">
          <Clock className="h-3 w-3" />
          {days} {language === 'bn' ? 'দিন বাকি' : 'days left'}
        </Badge>
      );
    }
    return null;
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeDomains}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'সক্রিয় ডোমেইন' : 'Active Domains'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiringDomains}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'মেয়াদ শেষ হচ্ছে' : 'Expiring Soon'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiredDomains}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'মেয়াদ শেষ' : 'Expired'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Alert */}
      {expiringDomains > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {language === 'bn' ? 'মনোযোগ দিন!' : 'Attention Required!'}
          </AlertTitle>
          <AlertDescription>
            {language === 'bn' 
              ? `আপনার ${expiringDomains}টি ডোমেইনের মেয়াদ শীঘ্রই শেষ হচ্ছে। সার্ভিস বন্ধ এড়াতে এখনই রিনিউ করুন।`
              : `${expiringDomains} domain(s) expiring soon. Renew now to avoid service interruption.`}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="domains" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="domains">
            {language === 'bn' ? 'ডোমেইন' : 'Domains'}
          </TabsTrigger>
          <TabsTrigger value="whois">WHOIS</TabsTrigger>
          <TabsTrigger value="dns">DNS Propagation</TabsTrigger>
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
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : isError ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="p-4 rounded-2xl bg-destructive/10 inline-block mb-4">
                  <Globe className="h-12 w-12 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {language === 'bn' ? 'ডোমেইন লোড করতে সমস্যা' : 'Failed to Load Domains'}
                </h3>
                <Button onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                </Button>
              </CardContent>
            </Card>
          ) : filteredDomains.length > 0 ? (
            <div className="space-y-4">
              {filteredDomains.map(domain => {
                const daysLeft = getDaysUntilExpiry(domain.expiry_date);
                const isExpiringSoon = daysLeft !== null && daysLeft <= 30 && daysLeft > 0;

                return (
                  <Card 
                    key={domain.id} 
                    className={`hover:shadow-md transition-shadow ${isExpiringSoon ? 'border-warning/50' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${getStatusColor(domain.status)}`}>
                            <Globe className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{domain.domain_name}</h3>
                              <Badge variant="outline" className={getStatusColor(domain.status)}>
                                {getStatusText(domain.status, language as 'en' | 'bn')}
                              </Badge>
                              {renderExpiryBadge(domain)}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                              {domain.registration_date && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {language === 'bn' ? 'রেজিস্ট্রেশন:' : 'Registered:'} {new Date(domain.registration_date).toLocaleDateString()}
                                </span>
                              )}
                              {domain.expiry_date && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {language === 'bn' ? 'মেয়াদ:' : 'Expires:'} {new Date(domain.expiry_date).toLocaleDateString()}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Lock className="h-3.5 w-3.5" />
                                {domain.registrar_name}
                              </span>
                            </div>

                            {/* Nameservers */}
                            <div className="mt-3 text-xs text-muted-foreground">
                              <span className="font-medium">Nameservers: </span>
                              {domain.nameservers?.slice(0, 2).join(', ')}
                              {domain.nameservers?.length > 2 && ` +${domain.nameservers.length - 2} more`}
                              {domain.nameserver_status === 'propagating' && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  Propagating
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <Button 
                            variant={isExpiringSoon ? "default" : "outline"}
                            size="sm"
                            onClick={() => openRenewDialog(domain)}
                            disabled={!['active', 'pending_renewal', 'expired', 'grace_period'].includes(domain.status)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {language === 'bn' ? 'রিনিউ' : 'Renew'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setDnsDomain(domain.domain_name);
                              setShowDNSDialog(true);
                            }}
                          >
                            <Network className="h-4 w-4 mr-2" />
                            DNS
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openNameserverDialog(domain)}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            {language === 'bn' ? 'নেমসার্ভার' : 'NS'}
                          </Button>
                        </div>
                      </div>

                      {/* Auto-renew toggle */}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch 
                            id={`autorenew-${domain.id}`}
                            checked={domain.auto_renew}
                            disabled={toggleAutoRenew.isPending}
                            onCheckedChange={(checked) => handleToggleAutoRenew(domain, checked)}
                          />
                          <Label htmlFor={`autorenew-${domain.id}`} className="text-sm cursor-pointer">
                            {language === 'bn' ? 'অটো-রিনিউ' : 'Auto-Renew'}
                            {domain.auto_renew && (
                              <span className="text-success ml-1">✓</span>
                            )}
                          </Label>
                          {domain.auto_renew_failed_at && (
                            <Badge variant="destructive" className="text-xs">
                              {language === 'bn' ? 'অটো-রিনিউ ব্যর্থ' : 'Auto-renew failed'}
                            </Badge>
                          )}
                        </div>
                        
                        {daysLeft !== null && daysLeft > 0 && daysLeft <= 365 && (
                          <div className="hidden sm:flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              {daysLeft} {language === 'bn' ? 'দিন বাকি' : 'days left'}
                            </span>
                            <Progress value={Math.max(0, (365 - daysLeft) / 365 * 100)} className="w-20 h-2" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
              {selectedDomain?.domain_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i}>
                <Label>Nameserver {i + 1} {i >= 2 ? '(Optional)' : '*'}</Label>
                <Input 
                  value={nameserverInputs[i]}
                  onChange={(e) => {
                    const updated = [...nameserverInputs];
                    updated[i] = e.target.value;
                    setNameserverInputs(updated);
                  }}
                  placeholder={`ns${i + 1}.example.com`}
                  className="mt-1" 
                />
              </div>
            ))}
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                {language === 'bn' 
                  ? 'নেমসার্ভার পরিবর্তন কার্যকর হতে ২৪-৪৮ ঘন্টা সময় লাগতে পারে।'
                  : 'Nameserver changes may take 24-48 hours to propagate globally.'}
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNameserverDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleUpdateNameservers}
              disabled={updateNameservers.isPending}
            >
              {updateNameservers.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'সেভ করুন' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'ডোমেইন রিনিউ করুন' : 'Renew Domain'}
            </DialogTitle>
            <DialogDescription>
              {selectedDomain?.domain_name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex justify-between p-4 bg-muted rounded-lg">
              <span>{language === 'bn' ? 'বর্তমান মেয়াদ' : 'Current Expiry'}</span>
              <span className="font-semibold">
                {selectedDomain?.expiry_date 
                  ? new Date(selectedDomain.expiry_date).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between p-4 bg-success/10 rounded-lg text-success">
              <span>{language === 'bn' ? 'নতুন মেয়াদ' : 'New Expiry'}</span>
              <span className="font-semibold">
                {selectedDomain?.expiry_date 
                  ? new Date(new Date(selectedDomain.expiry_date).setFullYear(
                      new Date(selectedDomain.expiry_date).getFullYear() + 1
                    )).toLocaleDateString()
                  : '+1 Year'}
              </span>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {language === 'bn' 
                  ? 'রিনিউ সম্পন্ন করতে পেমেন্ট প্রয়োজন হতে পারে।'
                  : 'Renewal may require payment to complete.'}
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenewDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleRenewDomain}
              disabled={renewDomain.isPending}
            >
              {renewDomain.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'রিনিউ করুন' : 'Renew Now'}
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
