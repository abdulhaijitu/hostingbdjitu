import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Star, Package } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  const { data: plans, isLoading } = useHostingPlans();
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

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'হোস্টিং প্ল্যান ম্যানেজমেন্ট' : 'Hosting Plans Management'}
        description="Manage hosting plans"
        canonicalUrl="/admin/hosting-plans"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <Package className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'হোস্টিং প্ল্যান ম্যানেজমেন্ট' : 'Hosting Plans Management'}
              </h1>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'নতুন প্ল্যান' : 'New Plan'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সকল প্ল্যান' : 'All Plans'}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : plans && plans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                      <TableHead>{language === 'bn' ? 'ক্যাটেগরি' : 'Category'}</TableHead>
                      <TableHead>{language === 'bn' ? 'মাসিক মূল্য' : 'Monthly'}</TableHead>
                      <TableHead>{language === 'bn' ? 'বাৎসরিক মূল্য' : 'Yearly'}</TableHead>
                      <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                      <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map(plan => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {plan.name}
                            {plan.is_featured && <Star className="h-4 w-4 text-accent fill-accent" />}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{plan.category}</TableCell>
                        <TableCell>৳{plan.monthly_price}</TableCell>
                        <TableCell>৳{plan.yearly_price}</TableCell>
                        <TableCell>
                          <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                            {plan.is_active ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(plan)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeletingPlan(plan); setIsDeleteDialogOpen(true); }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {language === 'bn' ? 'কোন প্ল্যান নেই' : 'No plans found'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan 
                ? (language === 'bn' ? 'প্ল্যান এডিট করুন' : 'Edit Plan')
                : (language === 'bn' ? 'নতুন প্ল্যান তৈরি করুন' : 'Create New Plan')
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
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
            <div className="col-span-2 space-y-2">
              <Label>{language === 'bn' ? 'বিবরণ (ইংরেজি)' : 'Description (English)'}</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-2">
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
    </Layout>
  );
};

export default HostingPlansManagement;
