import React, { useState } from 'react';
import { 
  Mail, Plus, Search, ExternalLink, Key, Trash2, HardDrive, Loader2, AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import UsageProgress from '@/components/client-dashboard/UsageProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useHostingAccounts } from '@/hooks/useHostingAccounts';
import { 
  useCPanelEmails, 
  useCreateEmail, 
  useDeleteEmail, 
  useChangeEmailPassword 
} from '@/hooks/useCPanelEmails';

const EmailsPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: accounts, isLoading: accountsLoading } = useHostingAccounts();
  
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [newEmail, setNewEmail] = useState({ name: '', password: '', quota: '1024' });
  const [newPassword, setNewPassword] = useState('');
  
  // Get active hosting accounts
  const activeAccounts = accounts?.filter(a => a.status === 'active') || [];
  
  // Auto-select first account if not selected
  React.useEffect(() => {
    if (activeAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(activeAccounts[0].id);
    }
  }, [activeAccounts, selectedAccountId]);
  
  const selectedAccount = activeAccounts.find(a => a.id === selectedAccountId);
  
  const { 
    data: emails, 
    isLoading: emailsLoading, 
    refetch: refetchEmails 
  } = useCPanelEmails(selectedAccountId || undefined);
  
  const createEmail = useCreateEmail();
  const deleteEmail = useDeleteEmail();
  const changePassword = useChangeEmailPassword();

  const filteredEmails = emails?.filter(e => 
    e.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreateEmail = async () => {
    if (!selectedAccount) return;
    
    const emailAddress = `${newEmail.name}@${selectedAccount.domain}`;
    
    try {
      await createEmail.mutateAsync({
        accountId: selectedAccountId,
        email: emailAddress,
        password: newEmail.password,
        quota: parseInt(newEmail.quota) || 1024,
      });
      
      toast({
        title: language === 'bn' ? 'ইমেইল তৈরি হয়েছে' : 'Email Created',
        description: emailAddress,
      });
      setShowCreateDialog(false);
      setNewEmail({ name: '', password: '', quota: '1024' });
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleChangePassword = async () => {
    if (!selectedEmail) return;
    
    try {
      await changePassword.mutateAsync({
        accountId: selectedAccountId,
        email: selectedEmail.email,
        password: newPassword,
      });
      
      toast({
        title: language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন হয়েছে' : 'Password Changed',
        description: selectedEmail.email,
      });
      setShowPasswordDialog(false);
      setNewPassword('');
      setSelectedEmail(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEmail = async () => {
    if (!selectedEmail) return;
    
    try {
      await deleteEmail.mutateAsync({
        accountId: selectedAccountId,
        email: selectedEmail.email,
      });
      
      toast({
        title: language === 'bn' ? 'ইমেইল ডিলিট হয়েছে' : 'Email Deleted',
        description: selectedEmail.email,
      });
      setShowDeleteDialog(false);
      setSelectedEmail(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openWebmail = () => {
    if (selectedAccount) {
      window.open(`https://${selectedAccount.domain}:2096`, '_blank');
    }
  };

  // Calculate total storage
  const totalUsed = emails?.reduce((sum, e) => {
    const used = parseFloat(e.diskused) || 0;
    return sum + used;
  }, 0) || 0;
  
  const totalQuota = emails?.reduce((sum, e) => {
    const quota = parseFloat(e.diskquota) || 0;
    return sum + quota;
  }, 0) || 0;

  if (accountsLoading) {
    return (
      <DashboardLayout 
        title={language === 'bn' ? 'ইমেইল ম্যানেজমেন্ট' : 'Email Management'}
        description={language === 'bn' ? 'আপনার ইমেইল অ্যাকাউন্ট পরিচালনা করুন' : 'Manage your email accounts'}
      >
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      </DashboardLayout>
    );
  }

  if (activeAccounts.length === 0) {
    return (
      <DashboardLayout 
        title={language === 'bn' ? 'ইমেইল ম্যানেজমেন্ট' : 'Email Management'}
        description={language === 'bn' ? 'আপনার ইমেইল অ্যাকাউন্ট পরিচালনা করুন' : 'Manage your email accounts'}
      >
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'bn' ? 'কোন হোস্টিং অ্যাকাউন্ট নেই' : 'No Hosting Account'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'bn' 
                ? 'ইমেইল পরিচালনা করতে প্রথমে একটি হোস্টিং প্ল্যান কিনুন'
                : 'Purchase a hosting plan to manage emails'}
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={language === 'bn' ? 'ইমেইল ম্যানেজমেন্ট' : 'Email Management'}
      description={language === 'bn' ? 'আপনার ইমেইল অ্যাকাউন্ট পরিচালনা করুন' : 'Manage your email accounts'}
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              {language === 'bn' ? 'ইমেইল অ্যাকাউন্ট' : 'Email Accounts'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' 
                ? 'আপনার ইমেইল অ্যাকাউন্ট তৈরি ও পরিচালনা করুন'
                : 'Create and manage your email accounts'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openWebmail} disabled={!selectedAccount}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Webmail
            </Button>
            <Button variant="hero" onClick={() => setShowCreateDialog(true)} disabled={!selectedAccount}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'নতুন ইমেইল' : 'Create Email'}
            </Button>
          </div>
        </div>

        {/* Account Selector */}
        {activeAccounts.length > 1 && (
          <div className="mt-4">
            <Label>{language === 'bn' ? 'হোস্টিং অ্যাকাউন্ট নির্বাচন করুন' : 'Select Hosting Account'}</Label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="w-full sm:w-80 mt-1">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.domain} ({account.cpanel_username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'bn' ? 'ইমেইল খুঁজুন...' : 'Search emails...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'মোট অ্যাকাউন্ট' : 'Total Accounts'}
                </p>
                <p className="text-xl font-bold">
                  {emailsLoading ? '...' : `${emails?.length || 0}/${selectedAccount?.email_accounts_limit || 10}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <HardDrive className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'ব্যবহৃত স্টোরেজ' : 'Storage Used'}
                </p>
                <p className="text-xl font-bold">
                  {emailsLoading ? '...' : `${totalUsed.toFixed(1)}MB`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <UsageProgress
              label={language === 'bn' ? 'স্টোরেজ' : 'Storage'}
              used={totalUsed}
              total={totalQuota || 1024}
              unit="MB"
            />
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'ইমেইল তালিকা' : 'Email List'}</CardTitle>
        </CardHeader>
        <CardContent>
          {emailsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredEmails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'bn' ? 'ইমেইল' : 'Email'}</TableHead>
                  <TableHead>{language === 'bn' ? 'স্টোরেজ' : 'Storage'}</TableHead>
                  <TableHead>{language === 'bn' ? 'কোটা' : 'Quota'}</TableHead>
                  <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map((email, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{email.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <UsageProgress
                          label=""
                          used={parseFloat(email.diskused) || 0}
                          total={parseFloat(email.diskquota) || 1024}
                          unit="MB"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {email.humandiskquota || `${email.diskquota}MB`}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedEmail(email);
                            setShowPasswordDialog(true);
                          }}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedEmail(email);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === 'bn' ? 'কোন ইমেইল অ্যাকাউন্ট নেই' : 'No email accounts found'}
              </p>
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'প্রথম ইমেইল তৈরি করুন' : 'Create First Email'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Email Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নতুন ইমেইল তৈরি করুন' : 'Create New Email'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? 'আপনার ডোমেইনে একটি নতুন ইমেইল অ্যাকাউন্ট তৈরি করুন'
                : 'Create a new email account on your domain'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}</Label>
              <div className="flex mt-1">
                <Input 
                  placeholder="username"
                  value={newEmail.name}
                  onChange={(e) => setNewEmail({ ...newEmail, name: e.target.value })}
                  className="rounded-r-none"
                />
                <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                  @{selectedAccount?.domain || 'domain.com'}
                </div>
              </div>
            </div>
            <div>
              <Label>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
              <Input 
                type="password"
                placeholder="••••••••"
                value={newEmail.password}
                onChange={(e) => setNewEmail({ ...newEmail, password: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{language === 'bn' ? 'স্টোরেজ কোটা (MB)' : 'Storage Quota (MB)'}</Label>
              <Input 
                type="number"
                placeholder="1024"
                value={newEmail.quota}
                onChange={(e) => setNewEmail({ ...newEmail, quota: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleCreateEmail} disabled={createEmail.isPending}>
              {createEmail.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'তৈরি করুন' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Password'}
            </DialogTitle>
            <DialogDescription>
              {selectedEmail?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password'}</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleChangePassword} disabled={changePassword.isPending}>
              {changePassword.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'পরিবর্তন করুন' : 'Change Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'bn' ? 'ইমেইল ডিলিট করুন?' : 'Delete Email?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? `আপনি কি নিশ্চিত যে আপনি ${selectedEmail?.email} ডিলিট করতে চান? এই অ্যাকশন পূর্বাবস্থায় ফেরানো যাবে না।`
                : `Are you sure you want to delete ${selectedEmail?.email}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmail}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteEmail.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'ডিলিট করুন' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default EmailsPage;
