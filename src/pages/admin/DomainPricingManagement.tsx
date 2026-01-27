import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Globe, Star, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDomainPricing, useCreateDomainPrice, useUpdateDomainPrice, useDeleteDomainPrice, DomainPrice } from '@/hooks/useDomainPricing';
import { useToast } from '@/hooks/use-toast';
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

const DomainPricingManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: prices, isLoading, isError, refetch } = useDomainPricing();
  const createPrice = useCreateDomainPrice();
  const updatePrice = useUpdateDomainPrice();
  const deletePrice = useDeleteDomainPrice();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<DomainPrice | null>(null);
  const [deletingPrice, setDeletingPrice] = useState<DomainPrice | null>(null);

  const [formData, setFormData] = useState({
    extension: '',
    registration_price: 0,
    renewal_price: 0,
    transfer_price: 0,
    is_active: true,
    is_popular: false,
    sort_order: 0,
  });

  const resetForm = () => {
    setFormData({
      extension: '',
      registration_price: 0,
      renewal_price: 0,
      transfer_price: 0,
      is_active: true,
      is_popular: false,
      sort_order: 0,
    });
    setEditingPrice(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (price: DomainPrice) => {
    setEditingPrice(price);
    setFormData({
      extension: price.extension,
      registration_price: price.registration_price,
      renewal_price: price.renewal_price,
      transfer_price: price.transfer_price,
      is_active: price.is_active ?? true,
      is_popular: price.is_popular ?? false,
      sort_order: price.sort_order ?? 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingPrice) {
        await updatePrice.mutateAsync({ id: editingPrice.id, ...formData });
        toast({ title: language === 'bn' ? 'দাম আপডেট হয়েছে' : 'Price updated successfully' });
      } else {
        await createPrice.mutateAsync(formData);
        toast({ title: language === 'bn' ? 'দাম যোগ হয়েছে' : 'Price added successfully' });
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
    if (!deletingPrice) return;
    try {
      await deletePrice.mutateAsync(deletingPrice.id);
      toast({ title: language === 'bn' ? 'দাম ডিলিট হয়েছে' : 'Price deleted successfully' });
      setIsDeleteDialogOpen(false);
      setDeletingPrice(null);
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
      key: 'extension',
      label: language === 'bn' ? 'এক্সটেনশন' : 'Extension',
      render: (price: DomainPrice) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{price.extension}</span>
          {price.is_popular && <Star className="h-4 w-4 text-accent fill-accent" />}
        </div>
      ),
    },
    {
      key: 'registration_price',
      label: language === 'bn' ? 'রেজিস্ট্রেশন' : 'Registration',
      render: (price: DomainPrice) => `৳${price.registration_price}`,
    },
    {
      key: 'renewal_price',
      label: language === 'bn' ? 'রিনিউয়াল' : 'Renewal',
      render: (price: DomainPrice) => `৳${price.renewal_price}`,
    },
    {
      key: 'transfer_price',
      label: language === 'bn' ? 'ট্রান্সফার' : 'Transfer',
      hideOnMobile: true,
      render: (price: DomainPrice) => `৳${price.transfer_price}`,
    },
    {
      key: 'is_active',
      label: language === 'bn' ? 'স্ট্যাটাস' : 'Status',
      render: (price: DomainPrice) => (
        <Badge variant={price.is_active ? 'default' : 'secondary'}>
          {price.is_active ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
        </Badge>
      ),
    },
  ];

  const actions = [
    {
      label: language === 'bn' ? 'এডিট' : 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (price: DomainPrice) => openEditDialog(price),
    },
    {
      label: language === 'bn' ? 'ডিলিট' : 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (price: DomainPrice) => {
        setDeletingPrice(price);
        setIsDeleteDialogOpen(true);
      },
      variant: 'destructive' as const,
    },
  ];

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'ডোমেইন প্রাইসিং ম্যানেজমেন্ট' : 'Domain Pricing Management'}
        description="Manage domain pricing"
        canonicalUrl="/admin/domain-pricing"
      />
      
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold font-display flex items-center gap-3">
              <Globe className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              {language === 'bn' ? 'ডোমেইন প্রাইসিং' : 'Domain Pricing'}
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
            <CardTitle>{language === 'bn' ? 'সকল ডোমেইন এক্সটেনশন' : 'All Domain Extensions'}</CardTitle>
            <CardDescription>
              {prices?.length || 0} {language === 'bn' ? 'টি এক্সটেনশন' : 'extensions'}
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
                data={prices || []}
                columns={columns}
                actions={actions}
                keyExtractor={(price) => price.id}
                isLoading={isLoading}
                getTitle={(price) => price.extension}
                getSubtitle={(price) => `৳${price.registration_price}`}
                getBadge={(price) => ({
                  text: price.is_active ? 'Active' : 'Inactive',
                  variant: price.is_active ? 'success' : 'secondary',
                })}
                language={language as 'en' | 'bn'}
                mobileExpandable={true}
                emptyState={
                  <p className="text-center text-muted-foreground py-8">
                    {language === 'bn' ? 'কোন ডোমেইন প্রাইস নেই' : 'No domain prices found'}
                  </p>
                }
              />
            )}
          </CardContent>
        </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPrice 
                ? (language === 'bn' ? 'দাম এডিট করুন' : 'Edit Price')
                : (language === 'bn' ? 'নতুন এক্সটেনশন যোগ করুন' : 'Add New Extension')
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'এক্সটেনশন' : 'Extension'}</Label>
              <Input 
                value={formData.extension} 
                onChange={e => setFormData({ ...formData, extension: e.target.value })} 
                placeholder=".com, .net, .org"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'রেজিস্ট্রেশন (৳)' : 'Registration (৳)'}</Label>
                <Input 
                  type="number" 
                  value={formData.registration_price} 
                  onChange={e => setFormData({ ...formData, registration_price: Number(e.target.value) })} 
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'রিনিউয়াল (৳)' : 'Renewal (৳)'}</Label>
                <Input 
                  type="number" 
                  value={formData.renewal_price} 
                  onChange={e => setFormData({ ...formData, renewal_price: Number(e.target.value) })} 
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'ট্রান্সফার (৳)' : 'Transfer (৳)'}</Label>
                <Input 
                  type="number" 
                  value={formData.transfer_price} 
                  onChange={e => setFormData({ ...formData, transfer_price: Number(e.target.value) })} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input 
                type="number" 
                value={formData.sort_order} 
                onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })} 
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Switch checked={formData.is_active} onCheckedChange={v => setFormData({ ...formData, is_active: v })} />
                <Label>{language === 'bn' ? 'সক্রিয়' : 'Active'}</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={formData.is_popular} onCheckedChange={v => setFormData({ ...formData, is_popular: v })} />
                <Label>{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} disabled={createPrice.isPending || updatePrice.isPending}>
              {editingPrice ? (language === 'bn' ? 'আপডেট করুন' : 'Update') : (language === 'bn' ? 'যোগ করুন' : 'Add')}
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
                ? `"${deletingPrice?.extension}" স্থায়ীভাবে মুছে যাবে।`
                : `This will permanently delete "${deletingPrice?.extension}".`
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

export default DomainPricingManagement;
