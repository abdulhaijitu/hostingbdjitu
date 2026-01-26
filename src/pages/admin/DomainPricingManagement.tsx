import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Globe, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDomainPricing, useCreateDomainPrice, useUpdateDomainPrice, useDeleteDomainPrice, DomainPrice } from '@/hooks/useDomainPricing';
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

const DomainPricingManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: prices, isLoading } = useDomainPricing();
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

  return (
    <AdminLayout>
      <SEOHead 
        title={language === 'bn' ? 'ডোমেইন প্রাইসিং ম্যানেজমেন্ট' : 'Domain Pricing Management'}
        description="Manage domain pricing"
        canonicalUrl="/admin/domain-pricing"
      />
      
      <div className="p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'ডোমেইন প্রাইসিং ম্যানেজমেন্ট' : 'Domain Pricing Management'}
              </h1>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'নতুন এক্সটেনশন' : 'New Extension'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সকল ডোমেইন এক্সটেনশন' : 'All Domain Extensions'}</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : prices && prices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'bn' ? 'এক্সটেনশন' : 'Extension'}</TableHead>
                      <TableHead>{language === 'bn' ? 'রেজিস্ট্রেশন' : 'Registration'}</TableHead>
                      <TableHead>{language === 'bn' ? 'রিনিউয়াল' : 'Renewal'}</TableHead>
                      <TableHead>{language === 'bn' ? 'ট্রান্সফার' : 'Transfer'}</TableHead>
                      <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                      <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prices.map(price => (
                      <TableRow key={price.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {price.extension}
                            {price.is_popular && <Star className="h-4 w-4 text-accent fill-accent" />}
                          </div>
                        </TableCell>
                        <TableCell>৳{price.registration_price}</TableCell>
                        <TableCell>৳{price.renewal_price}</TableCell>
                        <TableCell>৳{price.transfer_price}</TableCell>
                        <TableCell>
                          <Badge variant={price.is_active ? 'default' : 'secondary'}>
                            {price.is_active ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(price)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setDeletingPrice(price); setIsDeleteDialogOpen(true); }}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {language === 'bn' ? 'কোন ডোমেইন প্রাইস নেই' : 'No domain prices found'}
                </p>
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
            <div className="grid grid-cols-3 gap-4">
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
    </AdminLayout>
  );
};

export default DomainPricingManagement;
