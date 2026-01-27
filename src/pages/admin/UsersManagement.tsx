import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Search, Package, CreditCard, Mail, Phone, Building, Download, FileSpreadsheet, Trash2, UserX, CheckSquare, Square, Shield, UserCog, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState, EmptyState } from '@/components/common/DashboardSkeletons';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import ResponsiveAdminTable from '@/components/admin/ResponsiveAdminTable';
import { auditUser } from '@/lib/auditLogger';

interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  profile: {
    full_name: string | null;
    phone: string | null;
    company_name: string | null;
  } | null;
  role: string;
  orders_count: number;
  total_spent: number;
}

const UsersManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isBulkActionDialogOpen, setIsBulkActionDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'delete' | 'export' | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [roleChangeUser, setRoleChangeUser] = useState<UserWithProfile | null>(null);
  const [newRole, setNewRole] = useState<'customer' | 'admin'>('customer');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  
  usePagePerformance('Users Management');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setIsError(false);
    setIsTimeout(false);
    
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setIsError(true);
      setIsTimeout(true);
    }, 8000);

    try {
      const [profilesResult, rolesResult, ordersResult] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id, role'),
        supabase.from('orders').select('user_id, amount, status'),
      ]);

      clearTimeout(timeoutId);

      if (profilesResult.error) throw profilesResult.error;
      if (rolesResult.error) throw rolesResult.error;
      if (ordersResult.error) throw ordersResult.error;

      const profiles = profilesResult.data;
      const roles = rolesResult.data;
      const orders = ordersResult.data;

      const usersData: UserWithProfile[] = profiles.map(profile => {
        const userRole = roles.find(r => r.user_id === profile.user_id);
        const userOrders = orders.filter(o => o.user_id === profile.user_id);
        const completedOrders = userOrders.filter(o => o.status === 'completed');
        
        return {
          id: profile.user_id,
          email: profile.email,
          created_at: profile.created_at,
          profile: {
            full_name: profile.full_name,
            phone: profile.phone,
            company_name: profile.company_name,
          },
          role: userRole?.role || 'customer',
          orders_count: userOrders.length,
          total_spent: completedOrders.reduce((sum, o) => sum + Number(o.amount), 0),
        };
      });

      setUsers(usersData);
      setIsError(false);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error fetching users:', error);
      setIsError(true);
      toast({
        title: language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred',
        variant: 'destructive',
      });
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const viewUserOrders = async (user: UserWithProfile) => {
    setSelectedUser(user);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserOrders(data || []);
      setIsOrdersDialogOpen(true);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    }
  };

  const openRoleChangeDialog = (user: UserWithProfile) => {
    setRoleChangeUser(user);
    setNewRole(user.role as 'customer' | 'admin');
    setIsRoleDialogOpen(true);
  };

  const handleRoleChange = async () => {
    if (!roleChangeUser) return;
    
    if (roleChangeUser.id === currentUser?.id && newRole === 'customer') {
      toast({
        title: language === 'bn' ? 'অনুমতি নেই' : 'Not Allowed',
        description: language === 'bn' 
          ? 'আপনি নিজের রোল পরিবর্তন করতে পারবেন না' 
          : 'You cannot change your own role',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdatingRole(true);
    const oldRole = roleChangeUser.role;
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', roleChangeUser.id);

      if (error) throw error;

      // Log audit event for role change
      auditUser.roleChange(roleChangeUser.id, oldRole, newRole);

      setUsers(prev => prev.map(u => 
        u.id === roleChangeUser.id ? { ...u, role: newRole } : u
      ));

      toast({
        title: language === 'bn' ? 'রোল পরিবর্তন সফল' : 'Role Updated',
        description: language === 'bn' 
          ? `${roleChangeUser.profile?.full_name || roleChangeUser.email} এখন ${newRole === 'admin' ? 'অ্যাডমিন' : 'কাস্টমার'}`
          : `${roleChangeUser.profile?.full_name || roleChangeUser.email} is now ${newRole === 'admin' ? 'Admin' : 'Customer'}`,
      });

      setIsRoleDialogOpen(false);
      setRoleChangeUser(null);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred',
        description: language === 'bn' 
          ? 'রোল পরিবর্তন করা যায়নি' 
          : 'Could not update role',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.profile?.full_name?.toLowerCase().includes(searchLower) ||
      user.profile?.company_name?.toLowerCase().includes(searchLower)
    );
  });

  const exportToCSV = (usersToExport: UserWithProfile[]) => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Role', 'Orders', 'Total Spent', 'Joined Date'];
    const rows = usersToExport.map(user => [
      user.profile?.full_name || '',
      user.email,
      user.profile?.phone || '',
      user.profile?.company_name || '',
      user.role,
      user.orders_count.toString(),
      user.total_spent.toString(),
      format(new Date(user.created_at), 'yyyy-MM-dd'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: language === 'bn' ? 'এক্সপোর্ট সম্পন্ন' : 'Export Complete',
      description: language === 'bn' 
        ? `${usersToExport.length} জন গ্রাহক এক্সপোর্ট করা হয়েছে` 
        : `${usersToExport.length} customers exported`,
    });
  };

  const exportToExcel = (usersToExport: UserWithProfile[]) => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Role', 'Orders', 'Total Spent (BDT)', 'Joined Date'];
    const rows = usersToExport.map(user => [
      user.profile?.full_name || '',
      user.email,
      user.profile?.phone || '',
      user.profile?.company_name || '',
      user.role,
      user.orders_count,
      user.total_spent,
      format(new Date(user.created_at), 'yyyy-MM-dd'),
    ]);

    const BOM = '\uFEFF';
    const csvContent = BOM + [
      headers.join('\t'),
      ...rows.map(row => row.map(cell => `${cell}`).join('\t')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `customers_${format(new Date(), 'yyyyMMdd_HHmmss')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: language === 'bn' ? 'এক্সপোর্ট সম্পন্ন' : 'Export Complete',
      description: language === 'bn' 
        ? `${usersToExport.length} জন গ্রাহক এক্সপোর্ট করা হয়েছে` 
        : `${usersToExport.length} customers exported`,
    });
  };

  const exportSelectedUsers = (format: 'csv' | 'excel') => {
    const usersToExport = users.filter(u => selectedUsers.has(u.id));
    if (usersToExport.length === 0) {
      toast({
        title: language === 'bn' ? 'কোন গ্রাহক নির্বাচন করা হয়নি' : 'No customers selected',
        variant: 'destructive',
      });
      return;
    }
    if (format === 'csv') {
      exportToCSV(usersToExport);
    } else {
      exportToExcel(usersToExport);
    }
  };

  const exportAllUsers = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      exportToCSV(filteredUsers);
    } else {
      exportToExcel(filteredUsers);
    }
  };

  // Columns for ResponsiveAdminTable
  const columns = [
    {
      key: 'user',
      label: language === 'bn' ? 'ইউজার' : 'User',
      render: (user: UserWithProfile) => (
        <div>
          <p className="font-medium">{user.profile?.full_name || '-'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'contact',
      label: language === 'bn' ? 'যোগাযোগ' : 'Contact',
      hideOnMobile: true,
      render: (user: UserWithProfile) => (
        <div className="space-y-1">
          {user.profile?.phone && (
            <div className="flex items-center gap-1 text-sm">
              <Phone className="h-3 w-3" />
              {user.profile.phone}
            </div>
          )}
          {user.profile?.company_name && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Building className="h-3 w-3" />
              {user.profile.company_name}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      label: language === 'bn' ? 'রোল' : 'Role',
      render: (user: UserWithProfile) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role === 'admin' ? (
            <><Shield className="h-3 w-3 mr-1" /> Admin</>
          ) : (
            'Customer'
          )}
        </Badge>
      ),
    },
    {
      key: 'orders_count',
      label: language === 'bn' ? 'অর্ডার' : 'Orders',
      mobileLabel: language === 'bn' ? 'অর্ডার' : 'Orders',
    },
    {
      key: 'total_spent',
      label: language === 'bn' ? 'মোট খরচ' : 'Total Spent',
      mobileLabel: language === 'bn' ? 'মোট' : 'Spent',
      highlight: true,
      render: (user: UserWithProfile) => `৳${user.total_spent.toLocaleString()}`,
    },
    {
      key: 'created_at',
      label: language === 'bn' ? 'যোগদান' : 'Joined',
      hideOnMobile: true,
      render: (user: UserWithProfile) => format(new Date(user.created_at), 'dd MMM yyyy'),
    },
  ];

  const actions = [
    {
      label: language === 'bn' ? 'রোল' : 'Role',
      icon: <UserCog className="h-4 w-4" />,
      onClick: (user: UserWithProfile) => openRoleChangeDialog(user),
    },
    {
      label: language === 'bn' ? 'অর্ডার' : 'Orders',
      icon: <Package className="h-4 w-4" />,
      onClick: (user: UserWithProfile) => viewUserOrders(user),
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'Users Management'}
        description="Manage users"
        canonicalUrl="/admin/users"
      />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold font-display flex items-center gap-3">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              {language === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'Users Management'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {language === 'bn' 
                ? `মোট ${users.length} জন ইউজার`
                : `Total ${users.length} users`
              }
            </p>
          </div>
          {isError && (
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry'}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                {language === 'bn' ? 'মোট ইউজার' : 'Total Users'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              {isLoading ? (
                <Skeleton className="h-7 md:h-9 w-12 md:w-16" />
              ) : (
                <div className="text-xl md:text-3xl font-bold">{users.length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                {language === 'bn' ? 'অ্যাডমিন' : 'Admins'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              {isLoading ? (
                <Skeleton className="h-7 md:h-9 w-10 md:w-12" />
              ) : (
                <div className="text-xl md:text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 p-3 md:p-6">
              <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                {language === 'bn' ? 'কাস্টমার' : 'Customers'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
              {isLoading ? (
                <Skeleton className="h-7 md:h-9 w-10 md:w-12" />
              ) : (
                <div className="text-xl md:text-3xl font-bold">{users.filter(u => u.role === 'customer').length}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-lg">{language === 'bn' ? 'সকল ইউজার' : 'All Users'}</CardTitle>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {language === 'bn' ? 'এক্সপোর্ট' : 'Export'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => exportAllUsers('csv')}>
                        <Download className="h-4 w-4 mr-2" />
                        {language === 'bn' ? 'CSV' : 'CSV'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportAllUsers('excel')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        {language === 'bn' ? 'Excel' : 'Excel'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={language === 'bn' ? 'সার্চ করুন...' : 'Search users...'} 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {isError ? (
              <div className="p-4">
                <ErrorState 
                  title={language === 'bn' ? 'ডেটা লোড করতে সমস্যা' : 'Failed to Load Data'}
                  description={isTimeout 
                    ? (language === 'bn' ? 'রিকোয়েস্ট টাইমআউট হয়েছে। আবার চেষ্টা করুন।' : 'Request timed out. Please try again.')
                    : (language === 'bn' ? 'ইউজার ডেটা লোড করতে সমস্যা হয়েছে' : 'Could not load user data')
                  }
                  onRetry={fetchUsers}
                  isTimeout={isTimeout}
                />
              </div>
            ) : (
              <ResponsiveAdminTable
                data={filteredUsers}
                columns={columns}
                actions={actions}
                keyExtractor={(user) => user.id}
                isLoading={isLoading}
                getTitle={(user) => user.profile?.full_name || user.email}
                getSubtitle={(user) => user.email}
                getBadge={(user) => ({
                  text: user.role === 'admin' ? 'Admin' : 'Customer',
                  variant: user.role === 'admin' ? 'default' : 'secondary',
                })}
                language={language as 'en' | 'bn'}
                mobileExpandable={true}
                emptyState={
                  <p className="text-muted-foreground py-8">
                    {language === 'bn' ? 'কোন ইউজার পাওয়া যায়নি' : 'No users found'}
                  </p>
                }
              />
            )}
          </CardContent>
        </Card>

      {/* User Orders Dialog */}
      <Dialog open={isOrdersDialogOpen} onOpenChange={setIsOrdersDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.profile?.full_name || selectedUser?.email} - {language === 'bn' ? 'অর্ডার' : 'Orders'}
            </DialogTitle>
          </DialogHeader>
          
          {userOrders.length > 0 ? (
            <div className="space-y-4">
              {userOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{order.item_name}</p>
                    <p className="text-sm text-muted-foreground">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">৳{order.amount}</p>
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {language === 'bn' ? 'কোন অর্ডার নেই' : 'No orders found'}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              {language === 'bn' ? 'রোল পরিবর্তন করুন' : 'Change User Role'}
            </DialogTitle>
            <DialogDescription>
              {roleChangeUser?.profile?.full_name || roleChangeUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              {language === 'bn' ? 'নতুন রোল নির্বাচন করুন' : 'Select New Role'}
            </label>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as 'customer' | 'admin')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {language === 'bn' ? 'কাস্টমার' : 'Customer'}
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {roleChangeUser?.id === currentUser?.id && newRole === 'customer' && (
              <p className="text-sm text-destructive mt-2">
                {language === 'bn' 
                  ? '⚠️ আপনি নিজের রোল পরিবর্তন করতে পারবেন না' 
                  : '⚠️ You cannot demote yourself'}
              </p>
            )}

            {newRole === 'admin' && roleChangeUser?.role !== 'admin' && (
              <p className="text-sm text-muted-foreground mt-2">
                {language === 'bn' 
                  ? '⚠️ অ্যাডমিন ব্যবহারকারীরা সকল ডেটা অ্যাক্সেস করতে পারবে' 
                  : '⚠️ Admin users will have access to all data'}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleRoleChange} 
              disabled={isUpdatingRole || (roleChangeUser?.id === currentUser?.id && newRole === 'customer')}
            >
              {isUpdatingRole 
                ? (language === 'bn' ? 'আপডেট হচ্ছে...' : 'Updating...') 
                : (language === 'bn' ? 'রোল পরিবর্তন করুন' : 'Change Role')
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default UsersManagement;
