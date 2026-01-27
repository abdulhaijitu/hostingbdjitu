import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Star, Package, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHostingPlans, useCreateHostingPlan, useUpdateHostingPlan, useDeleteHostingPlan, HostingPlan } from '@/hooks/useHostingPlans';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/common/SEOHead';
import { ErrorState } from '@/components/common/DashboardSkeletons';
import ResponsiveAdminTable from '@/components/admin/ResponsiveAdminTable';
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

const HostingPlansManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: plans, isLoading, isError, refetch } = useHostingPlans();
  const createPlan = useCreateHostingPlan();
  const updatePlan = useUpdateHostingPlan();
  const deletePlan = useDeleteHostingPlan();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<HostingPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<HostingPlan | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    name_bn: '',
    slug: '',
    description: '',
    description_bn: '',
    category: 'web',
    monthly_price: 0,
    yearly_price: 0,
    storage: '',
    bandwidth: '',
    websites: '',
    email_accounts: '',
    databases: '',
    features: [] as string[],
    is_active: true,
    is_featured: false,
    sort_order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      name_bn: '',
      slug: '',
      description: '',
      description_bn: '',
      category: 'web',
      monthly_price: 0,
      yearly_price: 0,
      storage: '',
      bandwidth: '',
      websites: '',
      email_accounts: '',
      databases: '',
      features: [],
      is_active: true,
      is_featured: false,
      sort_order: 0,
    });
    setEditingPlan(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (plan: HostingPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      name_bn: plan.name_bn || '',
      slug: plan.slug,
      description: plan.description || '',
      description_bn: plan.description_bn || '',
      category: plan.category,
      monthly_price: plan.monthly_price,
      yearly_price: plan.yearly_price,
      storage: plan.storage || '',
      bandwidth: plan.bandwidth || '',
      websites: plan.websites || '',
      email_accounts: plan.email_accounts || '',
      databases: plan.databases || '',
      features: (plan.features as string[]) || [],
      is_active: plan.is_active ?? true,
      is_featured: plan.is_featured ?? false,
      sort_order: plan.sort_order ?? 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const planData = {
        ...formData,
        features: formData.features,
      };

      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, ...planData });
        toast({ title: language === 'bn' ? 'প্ল্যান আপডেট হয়েছে' : 'Plan updated successfully' });
      } else {
        await createPlan.mutateAsync(planData);
        toast({ title: language === 'bn' ? 'প্ল্যান তৈরি হয়েছে' : 'Plan created successfully' });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ 
        title: language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingPlan) return;
    try {
      await deletePlan.mutateAsync(deletingPlan.id);
      toast({ title: language === 'bn' ? 'প্ল্যান ডিলিট হয়েছে' : 'Plan deleted successfully' });
      setIsDeleteDialogOpen(false);
      setDeletingPlan(null);
    } catch (error) {
      toast({ 
        title: language === 'bn' ? 'ত্রুটি হয়েছে' : 'Error occurred',
        variant: 'destructive'
      });
    }
  };

  // Columns for ResponsiveAdminTable
  const columns = [
    {
      key: 'name',
      label: language === 'bn' ? 'নাম' : 'Name',
      render: (plan: HostingPlan) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{plan.name}</span>
          {plan.is_featured && <Star className="h-4 w-4 text-accent fill-accent" />}
        </div>
      ),
    },
    {
      key: 'category',
      label: language === 'bn' ? 'ক্যাটেগরি' : 'Category',
      hideOnMobile: true,
      render: (plan: HostingPlan) => (
        <span className="capitalize">{plan.category}</span>
      ),
    },
    {
      key: 'monthly_price',
      label: language === 'bn' ? 'মাসিক' : 'Monthly',
      render: (plan: HostingPlan) => `৳${plan.monthly_price}`,
    },
    {
      key: 'yearly_price',
      label: language === 'bn' ? 'বাৎসরিক' : 'Yearly',
      highlight: true,
      render: (plan: HostingPlan) => `৳${plan.yearly_price}`,
    },
    {
      key: 'is_active',
      label: language === 'bn' ? 'স্ট্যাটাস' : 'Status',
      render: (plan: HostingPlan) => (
        <Badge variant={plan.is_active ? 'default' : 'secondary'}>
          {plan.is_active ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: language === 'bn' ? 'এডিট' : 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (plan: HostingPlan) => openEditDialog(plan),
    },
    {
      label: language === 'bn' ? 'ডিলিট' : 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (plan: HostingPlan) => {
        setDeletingPlan(plan);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'হোস্টিং প্ল্যান ম্যানেজমেন্ট' : 'Hosting Plans Management'}
        description="Manage hosting plans"
        canonicalUrl="/admin/hosting-plans"
      />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold font-display flex items-center gap-3">
              <Package className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              {language === 'bn' ? 'হোস্টিং প্ল্যান' : 'Hosting Plans'}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={openCreateDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'নতুন' : 'New'}
            </Button>
            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{language === 'bn' ? 'সকল প্ল্যান' : 'All Plans'}</CardTitle>
            <CardDescription>
              {plans?.length || 0} {language === 'bn' ? 'টি প্ল্যান' : 'plans'}
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
                data={plans || []}
                columns={columns}
                actions={actions}
                keyExtractor={(plan) => plan.id}
                isLoading={isLoading}
                getTitle={(plan) => plan.name}
                getSubtitle={(plan) => plan.category}
                getBadge={(plan) => ({
                  text: plan.is_active ? 'Active' : 'Inactive',
                  variant: plan.is_active ? 'success' : 'secondary',
                })}
                language={language as 'en' | 'bn'}
                mobileExpandable={true}
                emptyState={
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'bn' ? 'কোন প্ল্যান নেই' : 'No plans found'}
                  </p>
                }
              />
            )}
          </CardContent>
        </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="plan-dialog-description">
          <DialogHeader>
            <DialogTitle>
              {editingPlan 
                ? (language === 'bn' ? 'প্ল্যান এডিট করুন' : 'Edit Plan')
                : (language === 'bn' ? 'নতুন প্ল্যান তৈরি করুন' : 'Create New Plan')
              }
            </DialogTitle>
            <p id="plan-dialog-description" className="text-sm text-muted-foreground">
              {editingPlan
                ? (language === 'bn' ? 'প্ল্যানের বিবরণ আপডেট করুন' : 'Update the plan details below')
                : (language === 'bn' ? 'নতুন হোস্টিং প্ল্যানের তথ্য দিন' : 'Fill in the details for the new hosting plan')
              }
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'}</Label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'নাম (বাংলা)' : 'Name (Bangla)'}</Label>
              <Input value={formData.name_bn} onChange={e => setFormData({ ...formData, name_bn: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g., starter-plan" />
            </div>
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'ক্যাটেগরি' : 'Category'}</Label>
              <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Hosting</SelectItem>
                  <SelectItem value="premium">Premium Hosting</SelectItem>
                  <SelectItem value="wordpress">WordPress</SelectItem>
                  <SelectItem value="reseller">Reseller</SelectItem>
                  <SelectItem value="vps">VPS</SelectItem>
                  <SelectItem value="dedicated">Dedicated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'মাসিক মূল্য (৳)' : 'Monthly Price (৳)'}</Label>
              <Input type="number" value={formData.monthly_price} onChange={e => setFormData({ ...formData, monthly_price: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'বাৎসরিক মূল্য (৳)' : 'Yearly Price (৳)'}</Label>
              <Input type="number" value={formData.yearly_price} onChange={e => setFormData({ ...formData, yearly_price: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Storage</Label>
              <Input value={formData.storage} onChange={e => setFormData({ ...formData, storage: e.target.value })} placeholder="e.g., 10GB SSD" />
            </div>
            <div className="space-y-2">
              <Label>Bandwidth</Label>
              <Input value={formData.bandwidth} onChange={e => setFormData({ ...formData, bandwidth: e.target.value })} placeholder="e.g., Unlimited" />
            </div>
            <div className="space-y-2">
              <Label>Websites</Label>
              <Input value={formData.websites} onChange={e => setFormData({ ...formData, websites: e.target.value })} placeholder="e.g., 1" />
            </div>
            <div className="space-y-2">
              <Label>Email Accounts</Label>
              <Input value={formData.email_accounts} onChange={e => setFormData({ ...formData, email_accounts: e.target.value })} placeholder="e.g., 5" />
            </div>
            <div className="space-y-2">
              <Label>Databases</Label>
              <Input value={formData.databases} onChange={e => setFormData({ ...formData, databases: e.target.value })} placeholder="e.g., 1 MySQL" />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })} />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label>{language === 'bn' ? 'বিবরণ (ইংরেজি)' : 'Description (English)'}</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label>{language === 'bn' ? 'বিবরণ (বাংলা)' : 'Description (Bangla)'}</Label>
              <Textarea value={formData.description_bn} onChange={e => setFormData({ ...formData, description_bn: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={formData.is_active} onCheckedChange={v => setFormData({ ...formData, is_active: v })} />
              <Label>{language === 'bn' ? 'সক্রিয়' : 'Active'}</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={formData.is_featured} onCheckedChange={v => setFormData({ ...formData, is_featured: v })} />
              <Label>{language === 'bn' ? 'ফিচার্ড' : 'Featured'}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} disabled={createPlan.isPending || updatePlan.isPending}>
              {editingPlan ? (language === 'bn' ? 'আপডেট করুন' : 'Update') : (language === 'bn' ? 'তৈরি করুন' : 'Create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? `"${deletingPlan?.name}" প্ল্যান স্থায়ীভাবে মুছে যাবে।`
                : `This will permanently delete "${deletingPlan?.name}" plan.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {language === 'bn' ? 'ডিলিট করুন' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default HostingPlansManagement;
