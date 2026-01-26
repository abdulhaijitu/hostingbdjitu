import React, { useState } from 'react';
import { 
  Server, Plus, RefreshCw, Edit2, Trash2, Globe, 
  CheckCircle, XCircle, Loader2, Activity, HardDrive, AlertTriangle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/common/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { useHostingServers, useCreateServer, useUpdateServer, useDeleteServer, useWHMAction } from '@/hooks/useWHMAdmin';

const ServerManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: servers, isLoading, refetch } = useHostingServers();
  const createServer = useCreateServer();
  const updateServer = useUpdateServer();
  const deleteServer = useDeleteServer();
  const whmAction = useWHMAction();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState<string | null>(null);
  const [serverStatuses, setServerStatuses] = useState<Record<string, any>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    server_type: 'shared',
    hostname: '',
    ip_address: '',
    api_type: 'whm',
    location: 'Singapore',
    max_accounts: 500,
  });

  const handleCreateServer = async () => {
    try {
      await createServer.mutateAsync(formData as any);
      toast({
        title: language === 'bn' ? 'সার্ভার তৈরি হয়েছে' : 'Server Created',
        description: formData.name,
      });
      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateServer = async () => {
    if (!selectedServer) return;
    try {
      await updateServer.mutateAsync({ id: selectedServer.id, ...formData });
      toast({
        title: language === 'bn' ? 'সার্ভার আপডেট হয়েছে' : 'Server Updated',
        description: formData.name,
      });
      setShowEditDialog(false);
      setSelectedServer(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteServer = async () => {
    if (!selectedServer) return;
    try {
      await deleteServer.mutateAsync(selectedServer.id);
      toast({
        title: language === 'bn' ? 'সার্ভার মুছে ফেলা হয়েছে' : 'Server Deleted',
        description: selectedServer.name,
      });
      setShowDeleteDialog(false);
      setSelectedServer(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const checkServerStatus = async (server: any) => {
    setCheckingStatus(server.id);
    try {
      const result = await whmAction.mutateAsync({
        action: 'getServerStatus',
        serverId: server.id,
      });
      setServerStatuses(prev => ({
        ...prev,
        [server.id]: result,
      }));
      toast({
        title: language === 'bn' ? 'স্ট্যাটাস চেক হয়েছে' : 'Status Checked',
        description: result.status === 'online' ? 'Server is online' : 'Server is offline',
      });
    } catch (error: any) {
      setServerStatuses(prev => ({
        ...prev,
        [server.id]: { status: 'error', error: error.message },
      }));
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCheckingStatus(null);
    }
  };

  const openEditDialog = (server: any) => {
    setSelectedServer(server);
    setFormData({
      name: server.name,
      server_type: server.server_type,
      hostname: server.hostname,
      ip_address: server.ip_address || '',
      api_type: server.api_type,
      location: server.location || 'Singapore',
      max_accounts: server.max_accounts || 500,
    });
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      server_type: 'shared',
      hostname: '',
      ip_address: '',
      api_type: 'whm',
      location: 'Singapore',
      max_accounts: 500,
    });
  };

  const getStatusBadge = (server: any) => {
    const status = serverStatuses[server.id];
    if (!status) {
      return server.is_active ? (
        <Badge variant="outline" className="bg-muted">
          {language === 'bn' ? 'অজানা' : 'Unknown'}
        </Badge>
      ) : (
        <Badge variant="destructive">{language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive'}</Badge>
      );
    }
    
    if (status.status === 'online') {
      return <Badge className="bg-success text-success-foreground">{language === 'bn' ? 'অনলাইন' : 'Online'}</Badge>;
    } else if (status.status === 'error') {
      return <Badge variant="destructive">{language === 'bn' ? 'ত্রুটি' : 'Error'}</Badge>;
    }
    return <Badge variant="secondary">{language === 'bn' ? 'অফলাইন' : 'Offline'}</Badge>;
  };

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'সার্ভার ম্যানেজমেন্ট' : 'Server Management'}
        description="Manage WHM/cPanel servers"
        canonicalUrl="/admin/servers"
      />
      
      <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <Server className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'সার্ভার ম্যানেজমেন্ট' : 'Server Management'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'WHM/cPanel সার্ভার পরিচালনা করুন' : 'Manage WHM/cPanel servers'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
              </Button>
              <Button onClick={() => { resetForm(); setShowCreateDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'নতুন সার্ভার' : 'Add Server'}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'মোট সার্ভার' : 'Total Servers'}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      <p className="text-3xl font-bold">{servers?.length || 0}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'সক্রিয় সার্ভার' : 'Active Servers'}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      <p className="text-3xl font-bold">
                        {servers?.filter(s => s.is_active).length || 0}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <HardDrive className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'মোট অ্যাকাউন্ট' : 'Total Accounts'}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-16" />
                    ) : (
                      <p className="text-3xl font-bold">
                        {servers?.reduce((sum, s) => sum + (s.current_accounts || 0), 0) || 0}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Servers Table */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সার্ভার তালিকা' : 'Server List'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? 'সকল WHM/cPanel সার্ভার' : 'All WHM/cPanel servers'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : servers && servers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                      <TableHead>{language === 'bn' ? 'হোস্টনেম' : 'Hostname'}</TableHead>
                      <TableHead>{language === 'bn' ? 'ধরন' : 'Type'}</TableHead>
                      <TableHead>{language === 'bn' ? 'অ্যাকাউন্ট' : 'Accounts'}</TableHead>
                      <TableHead>{language === 'bn' ? 'লোকেশন' : 'Location'}</TableHead>
                      <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                      <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servers.map(server => (
                      <TableRow key={server.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{server.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{server.hostname}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {server.server_type} / {server.api_type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {server.current_accounts || 0} / {server.max_accounts || 500}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            {server.location || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(server)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => checkServerStatus(server)}
                              disabled={checkingStatus === server.id}
                              title={language === 'bn' ? 'স্ট্যাটাস চেক করুন' : 'Check Status'}
                            >
                              {checkingStatus === server.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Activity className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(server)}
                              title={language === 'bn' ? 'সম্পাদনা করুন' : 'Edit'}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedServer(server);
                                setShowDeleteDialog(true);
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'কোন সার্ভার নেই' : 'No servers found'}
                  </p>
                  <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'প্রথম সার্ভার যোগ করুন' : 'Add First Server'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

      {/* Create Server Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'নতুন সার্ভার যোগ করুন' : 'Add New Server'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'WHM/cPanel সার্ভার কনফিগার করুন' : 'Configure a WHM/cPanel server'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'সার্ভার নাম' : 'Server Name'}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Production Server 1"
                className="mt-1"
              />
            </div>
            <div>
              <Label>{language === 'bn' ? 'হোস্টনেম' : 'Hostname'}</Label>
              <Input
                value={formData.hostname}
                onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                placeholder="server1.chost.com.bd"
                className="mt-1"
              />
            </div>
            <div>
              <Label>{language === 'bn' ? 'আইপি অ্যাড্রেস' : 'IP Address'}</Label>
              <Input
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                placeholder="192.168.1.1"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'bn' ? 'সার্ভার টাইপ' : 'Server Type'}</Label>
                <Select
                  value={formData.server_type}
                  onValueChange={(val) => setFormData({ ...formData, server_type: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="vps">VPS</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'bn' ? 'API টাইপ' : 'API Type'}</Label>
                <Select
                  value={formData.api_type}
                  onValueChange={(val) => setFormData({ ...formData, api_type: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whm">WHM</SelectItem>
                    <SelectItem value="cpanel">cPanel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'bn' ? 'লোকেশন' : 'Location'}</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Singapore"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{language === 'bn' ? 'সর্বোচ্চ অ্যাকাউন্ট' : 'Max Accounts'}</Label>
                <Input
                  type="number"
                  value={formData.max_accounts}
                  onChange={(e) => setFormData({ ...formData, max_accounts: parseInt(e.target.value) || 500 })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateServer} disabled={createServer.isPending}>
              {createServer.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'তৈরি করুন' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Server Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'সার্ভার সম্পাদনা' : 'Edit Server'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' ? 'সার্ভার সেটিংস আপডেট করুন' : 'Update server settings'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'সার্ভার নাম' : 'Server Name'}</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{language === 'bn' ? 'হোস্টনেম' : 'Hostname'}</Label>
              <Input
                value={formData.hostname}
                onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{language === 'bn' ? 'আইপি অ্যাড্রেস' : 'IP Address'}</Label>
              <Input
                value={formData.ip_address}
                onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'bn' ? 'সার্ভার টাইপ' : 'Server Type'}</Label>
                <Select
                  value={formData.server_type}
                  onValueChange={(val) => setFormData({ ...formData, server_type: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared">Shared</SelectItem>
                    <SelectItem value="vps">VPS</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'bn' ? 'API টাইপ' : 'API Type'}</Label>
                <Select
                  value={formData.api_type}
                  onValueChange={(val) => setFormData({ ...formData, api_type: val })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whm">WHM</SelectItem>
                    <SelectItem value="cpanel">cPanel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'bn' ? 'লোকেশন' : 'Location'}</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{language === 'bn' ? 'সর্বোচ্চ অ্যাকাউন্ট' : 'Max Accounts'}</Label>
                <Input
                  type="number"
                  value={formData.max_accounts}
                  onChange={(e) => setFormData({ ...formData, max_accounts: parseInt(e.target.value) || 500 })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleUpdateServer} disabled={updateServer.isPending}>
              {updateServer.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'আপডেট করুন' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {language === 'bn' ? 'সার্ভার মুছে ফেলুন?' : 'Delete Server?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? `আপনি কি "${selectedServer?.name}" সার্ভারটি মুছে ফেলতে চান? এই অ্যাকশন পূর্বাবস্থায় ফেরানো যাবে না।`
                : `Are you sure you want to delete "${selectedServer?.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteServer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteServer.isPending}
            >
              {deleteServer.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default ServerManagement;
