import React, { useState } from 'react';
import { 
  Database, Plus, Search, Trash2, User, Key, ExternalLink, Loader2, RefreshCw
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useHostingAccounts } from '@/hooks/useHostingAccounts';
import { 
  useCPanelDatabases, 
  useCreateDatabase, 
  useDeleteDatabase,
  useCreateDatabaseUser,
  useDeleteDatabaseUser
} from '@/hooks/useCPanelDatabases';

const DatabasesPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDbDialog, setShowCreateDbDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'databases' | 'users'>('databases');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'database' | 'user'; name: string } | null>(null);
  
  // Form state
  const [newDbName, setNewDbName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Fetch user's hosting accounts
  const { data: hostingAccounts, isLoading: accountsLoading } = useHostingAccounts();
  
  // Set default account
  React.useEffect(() => {
    if (hostingAccounts && hostingAccounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(hostingAccounts[0].id);
    }
  }, [hostingAccounts, selectedAccountId]);

  // Fetch databases for selected account
  const { data: dbData, isLoading: dbLoading, isError: dbError, refetch: refetchDatabases } = useCPanelDatabases(selectedAccountId);
  
  const createDbMutation = useCreateDatabase();
  const deleteDbMutation = useDeleteDatabase();
  const createUserMutation = useCreateDatabaseUser();
  const deleteUserMutation = useDeleteDatabaseUser();

  const databases = dbData?.databases || [];
  const databaseUsers = dbData?.users || [];

  const filteredDatabases = databases.filter(db => 
    db.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = databaseUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDatabase = async () => {
    if (!newDbName || !selectedAccountId) return;
    try {
      await createDbMutation.mutateAsync({ accountId: selectedAccountId, name: newDbName });
      setShowCreateDbDialog(false);
      setNewDbName('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleCreateUser = async () => {
    if (!newUsername || !newPassword || !selectedAccountId) return;
    try {
      await createUserMutation.mutateAsync({ 
        accountId: selectedAccountId, 
        username: newUsername, 
        password: newPassword 
      });
      setShowCreateUserDialog(false);
      setNewUsername('');
      setNewPassword('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !selectedAccountId) return;
    try {
      if (deleteTarget.type === 'database') {
        await deleteDbMutation.mutateAsync({ accountId: selectedAccountId, name: deleteTarget.name });
      } else {
        await deleteUserMutation.mutateAsync({ accountId: selectedAccountId, username: deleteTarget.name });
      }
      setDeleteTarget(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const openPhpMyAdmin = () => {
    const account = hostingAccounts?.find(a => a.id === selectedAccountId);
    if (account) {
      window.open(`https://${account.domain}:2083/3rdparty/phpMyAdmin/`, '_blank');
    } else {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'অ্যাকাউন্ট সিলেক্ট করুন' : 'Please select an account',
        variant: 'destructive',
      });
    }
  };

  const selectedAccount = hostingAccounts?.find(a => a.id === selectedAccountId);

  return (
    <DashboardLayout 
      title={language === 'bn' ? 'ডাটাবেস ম্যানেজমেন্ট' : 'Database Management'}
      description={language === 'bn' ? 'আপনার ডাটাবেস পরিচালনা করুন' : 'Manage your databases'}
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display">
              {language === 'bn' ? 'ডাটাবেস' : 'Databases'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === 'bn' 
                ? 'MySQL ডাটাবেস এবং ইউজার ম্যানেজ করুন'
                : 'Manage MySQL databases and users'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetchDatabases()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
            <Button variant="outline" onClick={openPhpMyAdmin}>
              <ExternalLink className="h-4 w-4 mr-2" />
              phpMyAdmin
            </Button>
            <Button 
              variant="hero" 
              onClick={() => activeTab === 'databases' ? setShowCreateDbDialog(true) : setShowCreateUserDialog(true)}
              disabled={!selectedAccountId}
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 'databases' 
                ? (language === 'bn' ? 'নতুন ডাটাবেস' : 'Create Database')
                : (language === 'bn' ? 'নতুন ইউজার' : 'Create User')}
            </Button>
          </div>
        </div>
      </div>

      {/* Account Selector */}
      {hostingAccounts && hostingAccounts.length > 1 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap">{language === 'bn' ? 'অ্যাকাউন্ট:' : 'Account:'}</Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {hostingAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.domain} ({account.cpanel_username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {accountsLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</span>
            </div>
          </CardContent>
        </Card>
      ) : hostingAccounts && hostingAccounts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {language === 'bn' 
                ? 'আপনার কোন হোস্টিং অ্যাকাউন্ট নেই'
                : 'You don\'t have any hosting accounts'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button 
              variant={activeTab === 'databases' ? 'default' : 'outline'}
              onClick={() => setActiveTab('databases')}
            >
              <Database className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'ডাটাবেস' : 'Databases'} ({databases.length})
            </Button>
            <Button 
              variant={activeTab === 'users' ? 'default' : 'outline'}
              onClick={() => setActiveTab('users')}
            >
              <User className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'ইউজার' : 'Users'} ({databaseUsers.length})
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === 'databases' 
                ? (language === 'bn' ? 'ডাটাবেস খুঁজুন...' : 'Search databases...')
                : (language === 'bn' ? 'ইউজার খুঁজুন...' : 'Search users...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'databases' 
                  ? (language === 'bn' ? 'ডাটাবেস তালিকা' : 'Database List')
                  : (language === 'bn' ? 'ইউজার তালিকা' : 'User List')}
              </CardTitle>
              {selectedAccount && (
                <CardDescription>
                  {selectedAccount.domain} - {language === 'bn' ? 'লিমিট:' : 'Limit:'} {selectedAccount.databases_used}/{selectedAccount.databases_limit}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {dbLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : dbError ? (
                <div className="text-center py-8">
                  <div className="p-4 rounded-2xl bg-destructive/10 inline-block mb-4">
                    <Database className="h-10 w-10 text-destructive" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {language === 'bn' ? 'ডাটাবেস লোড করতে সমস্যা হয়েছে' : 'Failed to load databases'}
                  </p>
                  <Button onClick={() => refetchDatabases()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                  </Button>
                </div>
              ) : activeTab === 'databases' ? (
                filteredDatabases.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                        <TableHead>{language === 'bn' ? 'সাইজ' : 'Size'}</TableHead>
                        <TableHead>{language === 'bn' ? 'টেবিল' : 'Tables'}</TableHead>
                        <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDatabases.map((db, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium font-mono">{db.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{db.size}</TableCell>
                          <TableCell>{db.tables || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setDeleteTarget({ type: 'database', name: db.name })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'কোন ডাটাবেস নেই' : 'No databases found'}
                    </p>
                  </div>
                )
              ) : (
                filteredUsers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'ইউজারনেম' : 'Username'}</TableHead>
                        <TableHead>{language === 'bn' ? 'ডাটাবেস অ্যাক্সেস' : 'Database Access'}</TableHead>
                        <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium font-mono">{user.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.databases.length > 0 ? user.databases.map(db => (
                              <span key={db} className="inline-block px-2 py-1 bg-muted rounded text-xs mr-1">
                                {db}
                              </span>
                            )) : (
                              <span className="text-muted-foreground text-sm">
                                {language === 'bn' ? 'কোন অ্যাক্সেস নেই' : 'No access'}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" title={language === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : 'Change password'}>
                                <Key className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setDeleteTarget({ type: 'user', name: user.username })}
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
                  <div className="text-center py-8">
                    <User className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'কোন ইউজার নেই' : 'No users found'}
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Create Database Dialog */}
      <Dialog open={showCreateDbDialog} onOpenChange={setShowCreateDbDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নতুন ডাটাবেস তৈরি করুন' : 'Create New Database'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? `${selectedAccount?.cpanel_username}_[নাম] ফরম্যাটে তৈরি হবে`
                : `Will be created as ${selectedAccount?.cpanel_username}_[name]`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'ডাটাবেস নাম' : 'Database Name'}</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{selectedAccount?.cpanel_username}_</span>
                <Input 
                  value={newDbName}
                  onChange={(e) => setNewDbName(e.target.value)}
                  placeholder="my_database" 
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'bn' 
                  ? 'শুধুমাত্র অক্ষর, সংখ্যা এবং আন্ডারস্কোর ব্যবহার করুন'
                  : 'Use only letters, numbers, and underscores'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDbDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleCreateDatabase}
              disabled={!newDbName || createDbMutation.isPending}
            >
              {createDbMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'তৈরি করুন' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'নতুন ইউজার তৈরি করুন' : 'Create New User'}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? `${selectedAccount?.cpanel_username}_[নাম] ফরম্যাটে তৈরি হবে`
                : `Will be created as ${selectedAccount?.cpanel_username}_[name]`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'ইউজারনেম' : 'Username'}</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{selectedAccount?.cpanel_username}_</span>
                <Input 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="db_user" 
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>{language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}</Label>
              <Input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••" 
                className="mt-1" 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'bn' 
                  ? 'শক্তিশালী পাসওয়ার্ড ব্যবহার করুন'
                  : 'Use a strong password'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleCreateUser}
              disabled={!newUsername || !newPassword || createUserMutation.isPending}
            >
              {createUserMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'তৈরি করুন' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === 'database'
                ? (language === 'bn' ? 'ডাটাবেস ডিলিট করবেন?' : 'Delete Database?')
                : (language === 'bn' ? 'ইউজার ডিলিট করবেন?' : 'Delete User?')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? `"${deleteTarget?.name}" স্থায়ীভাবে মুছে যাবে। এই অ্যাকশন পূর্বাবস্থায় ফেরানো যাবে না।`
                : `"${deleteTarget?.name}" will be permanently deleted. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground"
            >
              {language === 'bn' ? 'ডিলিট' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DatabasesPage;
