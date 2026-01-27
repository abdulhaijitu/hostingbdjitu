import React, { useState } from 'react';
import { useCMSAdmins, useAssignCMSRole, useRemoveCMSRole, CMSRole } from '@/hooks/useCMSRole';
import CMSPermissionGate from '@/components/cms/CMSPermissionGate';
import CMSConfirmDialog from '@/components/cms/CMSConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, Edit, Trash2, Shield, Crown, Eye, 
  UserPlus, Search, RefreshCcw, AlertCircle, Users 
} from 'lucide-react';
import { format } from 'date-fns';

const roleLabels: Record<CMSRole, { label: string; icon: React.ReactNode; color: string }> = {
  super_admin: {
    label: 'Super Admin',
    icon: <Crown className="h-3 w-3" />,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  },
  editor: {
    label: 'Editor',
    icon: <Edit className="h-3 w-3" />,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  },
  viewer: {
    label: 'Viewer',
    icon: <Eye className="h-3 w-3" />,
    color: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
  },
};

const CMSAdminUsersPage: React.FC = () => {
  const { data: admins, isLoading, error, refetch } = useCMSAdmins();
  const assignRole = useAssignCMSRole();
  const removeRole = useRemoveCMSRole();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [newUserId, setNewUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<CMSRole>('viewer');

  const filteredAdmins = admins?.filter(admin => {
    const profile = admin.profiles as any;
    const email = profile?.email?.toLowerCase() || '';
    const name = profile?.full_name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return email.includes(query) || name.includes(query);
  });

  const handleEdit = (admin: any) => {
    setSelectedAdmin(admin);
    setSelectedRole(admin.role);
    setEditDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (selectedAdmin) {
      await assignRole.mutateAsync({ userId: selectedAdmin.user_id, role: selectedRole });
      setEditDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  const handleAddAdmin = async () => {
    if (newUserId) {
      await assignRole.mutateAsync({ userId: newUserId, role: selectedRole });
      setAddDialogOpen(false);
      setNewUserId('');
      setSelectedRole('viewer');
    }
  };

  const handleRemove = async () => {
    if (selectedAdmin) {
      await removeRole.mutateAsync(selectedAdmin.user_id);
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  if (error) {
    return (
      <Card className="m-6 border-destructive/50">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold">ডাটা লোড করতে সমস্যা হয়েছে</h3>
            <p className="text-sm text-muted-foreground">পুনরায় চেষ্টা করুন</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="ml-auto">
            <RefreshCcw className="h-4 w-4 mr-2" />
            আবার চেষ্টা করুন
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <CMSPermissionGate requiredRole="super_admin">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">CMS অ্যাডমিন ইউজার</h1>
            <p className="text-muted-foreground">CMS অ্যাক্সেস এবং রোল পরিচালনা করুন</p>
          </div>
          
          <Button onClick={() => setAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            নতুন অ্যাডমিন যোগ করুন
          </Button>
        </div>

        {/* Role Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(roleLabels).map(([role, info]) => (
            <Card key={role}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${info.color}`}>
                  {info.icon}
                </div>
                <div>
                  <p className="font-medium">{info.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {role === 'super_admin' && 'সম্পূর্ণ অ্যাক্সেস'}
                    {role === 'editor' && 'কনটেন্ট এডিট করতে পারে'}
                    {role === 'viewer' && 'শুধুমাত্র দেখতে পারে'}
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {admins?.filter(a => a.role === role).length || 0}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="অ্যাডমিন খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Admins Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              CMS অ্যাডমিন তালিকা
            </CardTitle>
            <CardDescription>
              {admins?.length || 0} জন CMS অ্যাডমিন
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ইউজার</TableHead>
                    <TableHead>রোল</TableHead>
                    <TableHead>যোগ করা হয়েছে</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins?.map((admin) => {
                    const profile = admin.profiles as any;
                    const roleInfo = roleLabels[admin.role as CMSRole];
                    
                    return (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{profile?.full_name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{profile?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleInfo.color}>
                            {roleInfo.icon}
                            <span className="ml-1">{roleInfo.label}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(admin.created_at), 'dd MMM yyyy')}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(admin)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {filteredAdmins?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        কোনো CMS অ্যাডমিন পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Admin Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>নতুন CMS অ্যাডমিন যোগ করুন</DialogTitle>
              <DialogDescription>
                ইউজার ID দিয়ে নতুন CMS অ্যাডমিন যোগ করুন
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>ইউজার ID (UUID)</Label>
                <Input
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                />
                <p className="text-xs text-muted-foreground">
                  ইউজারের UUID প্রোফাইল থেকে কপি করুন
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>রোল</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as CMSRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - শুধুমাত্র দেখতে পারে</SelectItem>
                    <SelectItem value="editor">Editor - কনটেন্ট এডিট করতে পারে</SelectItem>
                    <SelectItem value="super_admin">Super Admin - সম্পূর্ণ অ্যাক্সেস</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                বাতিল
              </Button>
              <Button 
                onClick={handleAddAdmin}
                disabled={!newUserId || assignRole.isPending}
              >
                {assignRole.isPending ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>রোল পরিবর্তন করুন</DialogTitle>
              <DialogDescription>
                এই অ্যাডমিনের CMS রোল আপডেট করুন
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>নতুন রোল</Label>
                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as CMSRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - শুধুমাত্র দেখতে পারে</SelectItem>
                    <SelectItem value="editor">Editor - কনটেন্ট এডিট করতে পারে</SelectItem>
                    <SelectItem value="super_admin">Super Admin - সম্পূর্ণ অ্যাক্সেস</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                বাতিল
              </Button>
              <Button 
                onClick={handleUpdateRole}
                disabled={assignRole.isPending}
              >
                {assignRole.isPending ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <CMSConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleRemove}
          title="CMS অ্যাক্সেস মুছে ফেলুন"
          description="এই ইউজারের CMS অ্যাক্সেস মুছে ফেলতে চান? তারা আর CMS এ লগইন করতে পারবে না।"
          actionType="delete"
          confirmLabel="মুছে ফেলুন"
          isLoading={removeRole.isPending}
        />
      </div>
    </CMSPermissionGate>
  );
};

export default CMSAdminUsersPage;
