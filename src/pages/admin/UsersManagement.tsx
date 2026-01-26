import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Search, Package, CreditCard, Mail, Phone, Building } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';

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
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isOrdersDialogOpen, setIsOrdersDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles with user roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch orders summary per user
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, amount, status');

      if (ordersError) throw ordersError;

      // Combine data
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
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred',
        variant: 'destructive',
      });
    } finally {
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

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.profile?.full_name?.toLowerCase().includes(searchLower) ||
      user.profile?.company_name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'Users Management'}
        description="Manage users"
        canonicalUrl="/admin/users"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'Users Management'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' 
                  ? `মোট ${users.length} জন ইউজার`
                  : `Total ${users.length} users`
                }
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'মোট ইউজার' : 'Total Users'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'অ্যাডমিন' : 'Admins'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'কাস্টমার' : 'Customers'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users.filter(u => u.role === 'customer').length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>{language === 'bn' ? 'সকল ইউজার' : 'All Users'}</CardTitle>
                <div className="relative w-full sm:w-64">
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
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'ইউজার' : 'User'}</TableHead>
                        <TableHead>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</TableHead>
                        <TableHead>{language === 'bn' ? 'রোল' : 'Role'}</TableHead>
                        <TableHead>{language === 'bn' ? 'অর্ডার' : 'Orders'}</TableHead>
                        <TableHead>{language === 'bn' ? 'মোট খরচ' : 'Total Spent'}</TableHead>
                        <TableHead>{language === 'bn' ? 'যোগদান' : 'Joined'}</TableHead>
                        <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.profile?.full_name || '-'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role === 'admin' ? 'Admin' : 'Customer'}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.orders_count}</TableCell>
                          <TableCell className="font-semibold">৳{user.total_spent.toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(user.created_at), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => viewUserOrders(user)}>
                              <Package className="h-4 w-4 mr-1" />
                              {language === 'bn' ? 'অর্ডার' : 'Orders'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {language === 'bn' ? 'কোন ইউজার পাওয়া যায়নি' : 'No users found'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

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
    </Layout>
  );
};

export default UsersManagement;
