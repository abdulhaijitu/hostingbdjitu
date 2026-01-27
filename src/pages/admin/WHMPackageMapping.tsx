import React, { useState } from 'react';
import { 
  Package, Plus, Edit, Trash2, Server, Link2
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { 
  useWHMPackageMappings, 
  useCreateWHMPackageMapping, 
  useUpdateWHMPackageMapping,
  useDeleteWHMPackageMapping 
} from '@/hooks/useWHMPackageMappings';
import { useHostingPlans } from '@/hooks/useHostingPlans';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/common/SEOHead';
import { ErrorState } from '@/components/common/DashboardSkeletons';
import ResponsiveAdminTable from '@/components/admin/ResponsiveAdminTable';

const WHMPackageMapping: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [editingMapping, setEditingMapping] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    hosting_plan_id: '',
    server_id: '',
    whm_package_name: '',
    is_active: true
  });

  const { data: mappings, isLoading, isError, refetch } = useWHMPackageMappings();
  const { data: hostingPlans } = useHostingPlans();
  const { data: servers } = useQuery({
    queryKey: ['hosting_servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hosting_servers')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useCreateWHMPackageMapping();
  const updateMutation = useUpdateWHMPackageMapping();
  const deleteMutation = useDeleteWHMPackageMapping();

  const handleOpenDialog = (mapping?: any) => {
    if (mapping) {
      setEditingMapping(mapping);
      setFormData({
        hosting_plan_id: mapping.hosting_plan_id,
        server_id: mapping.server_id,
        whm_package_name: mapping.whm_package_name,
        is_active: mapping.is_active ?? true
      });
    } else {
      setEditingMapping(null);
      setFormData({
        hosting_plan_id: '',
        server_id: '',
        whm_package_name: '',
        is_active: true
      });
    }
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.hosting_plan_id || !formData.server_id || !formData.whm_package_name) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'সব ফিল্ড পূরণ করুন' : 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingMapping) {
        await updateMutation.mutateAsync({ id: editingMapping.id, ...formData });
        toast({
          title: language === 'bn' ? 'সফল' : 'Success',
          description: language === 'bn' ? 'ম্যাপিং আপডেট হয়েছে' : 'Mapping updated successfully',
        });
      } else {
        await createMutation.mutateAsync(formData);
        toast({
          title: language === 'bn' ? 'সফল' : 'Success',
          description: language === 'bn' ? 'নতুন ম্যাপিং তৈরি হয়েছে' : 'New mapping created',
        });
      }
      setShowDialog(false);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast({
        title: language === 'bn' ? 'সফল' : 'Success',
        description: language === 'bn' ? 'ম্যাপিং ডিলিট হয়েছে' : 'Mapping deleted',
        variant: 'destructive',
      });
      setDeleteId(null);
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Columns for ResponsiveAdminTable
  const columns = [
    {
      key: 'hosting_plan',
      label: language === 'bn' ? 'হোস্টিং প্ল্যান' : 'Hosting Plan',
      render: (mapping: any) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <div>
            <span className="font-medium">{mapping.hosting_plans?.name || 'Unknown'}</span>
            <p className="text-xs text-muted-foreground">{mapping.hosting_plans?.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'server',
      label: language === 'bn' ? 'সার্ভার' : 'Server',
      hideOnMobile: true,
      render: (mapping: any) => (
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span>{mapping.hosting_servers?.name || 'Unknown'}</span>
        </div>
      ),
    },
    {
      key: 'whm_package_name',
      label: language === 'bn' ? 'WHM প্যাকেজ' : 'WHM Package',
      render: (mapping: any) => (
        <code className="px-2 py-1 bg-muted rounded text-sm">
          {mapping.whm_package_name}
        </code>
      ),
    },
    {
      key: 'is_active',
      label: language === 'bn' ? 'স্ট্যাটাস' : 'Status',
      render: (mapping: any) => (
        <Badge variant={mapping.is_active ? 'default' : 'secondary'}>
          {mapping.is_active 
            ? (language === 'bn' ? 'সক্রিয়' : 'Active') 
            : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: language === 'bn' ? 'এডিট' : 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (mapping: any) => handleOpenDialog(mapping),
    },
    {
      label: language === 'bn' ? 'ডিলিট' : 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (mapping: any) => setDeleteId(mapping.id),
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'WHM প্যাকেজ ম্যাপিং' : 'WHM Package Mapping'}
        description="Map hosting plans to WHM packages"
        canonicalUrl="/admin/package-mapping"
      />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold font-display flex items-center gap-3">
              <Link2 className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              {language === 'bn' ? 'WHM প্যাকেজ ম্যাপিং' : 'WHM Package Mapping'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {language === 'bn' 
                ? 'হোস্টিং প্ল্যান থেকে WHM প্যাকেজে ম্যাপ করুন'
                : 'Map hosting plans to WHM packages'}
            </p>
          </div>
          <Button variant="hero" onClick={() => handleOpenDialog()} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {language === 'bn' ? 'নতুন' : 'Add'}
          </Button>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{language === 'bn' ? 'প্যাকেজ ম্যাপিং তালিকা' : 'Package Mappings'}</CardTitle>
            <CardDescription>
              {mappings?.length || 0} {language === 'bn' ? 'টি ম্যাপিং' : 'mappings'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {isError ? (
              <div className="p-4">
                <ErrorState 
                  title={language === 'bn' ? 'ডেটা লোড করতে সমস্যা হয়েছে' : 'Failed to load data'}
                  onRetry={() => refetch()}
                />
              </div>
            ) : (
              <ResponsiveAdminTable
                data={mappings || []}
                columns={columns}
                actions={actions}
                keyExtractor={(mapping) => mapping.id}
                isLoading={isLoading}
                getTitle={(mapping) => mapping.hosting_plans?.name || 'Unknown'}
                getSubtitle={(mapping) => mapping.whm_package_name}
                getBadge={(mapping) => ({
                  text: mapping.is_active ? 'Active' : 'Inactive',
                  variant: mapping.is_active ? 'success' : 'secondary',
                })}
                language={language as 'en' | 'bn'}
                mobileExpandable={true}
                emptyState={
                  <div className="text-center py-12">
                    <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'কোন ম্যাপিং নেই' : 'No mappings found'}
                    </p>
                    <Button className="mt-4" onClick={() => handleOpenDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      {language === 'bn' ? 'প্রথম ম্যাপিং তৈরি করুন' : 'Create First Mapping'}
                    </Button>
                  </div>
                }
              />
            )}
          </CardContent>
        </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMapping 
                ? (language === 'bn' ? 'ম্যাপিং এডিট করুন' : 'Edit Mapping')
                : (language === 'bn' ? 'নতুন ম্যাপিং তৈরি করুন' : 'Create New Mapping')}
            </DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? 'হোস্টিং প্ল্যানকে WHM প্যাকেজের সাথে লিংক করুন'
                : 'Link a hosting plan to a WHM package on a specific server'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'হোস্টিং প্ল্যান' : 'Hosting Plan'}</Label>
              <Select 
                value={formData.hosting_plan_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, hosting_plan_id: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={language === 'bn' ? 'প্ল্যান সিলেক্ট করুন' : 'Select plan'} />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {hostingPlans?.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} ({plan.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>{language === 'bn' ? 'সার্ভার' : 'Server'}</Label>
              <Select 
                value={formData.server_id} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, server_id: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={language === 'bn' ? 'সার্ভার সিলেক্ট করুন' : 'Select server'} />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {servers?.map(server => (
                    <SelectItem key={server.id} value={server.id}>
                      {server.name} ({server.hostname})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{language === 'bn' ? 'WHM প্যাকেজ নাম' : 'WHM Package Name'}</Label>
              <Input
                value={formData.whm_package_name}
                onChange={(e) => setFormData(prev => ({ ...prev, whm_package_name: e.target.value }))}
                placeholder="e.g., starter_pkg"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'bn' 
                  ? 'WHM-এ তৈরি করা প্যাকেজের সঠিক নাম দিন'
                  : 'Enter the exact package name as created in WHM'}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Label>{language === 'bn' ? 'সক্রিয়' : 'Active'}</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingMapping 
                ? (language === 'bn' ? 'আপডেট করুন' : 'Update')
                : (language === 'bn' ? 'তৈরি করুন' : 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'bn' ? 'ম্যাপিং ডিলিট করবেন?' : 'Delete Mapping?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? 'এই ম্যাপিং ডিলিট করলে এই প্ল্যানে নতুন অ্যাকাউন্ট প্রভিশন হবে না।'
                : 'Deleting this mapping will prevent new accounts from being provisioned with this plan.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {language === 'bn' ? 'ডিলিট' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default WHMPackageMapping;
