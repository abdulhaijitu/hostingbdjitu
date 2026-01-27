import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Tag,
  Loader2,
  Star,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import CMSPermissionGate from '@/components/cms/CMSPermissionGate';
import CMSConfirmDialog from '@/components/cms/CMSConfirmDialog';
import { 
  useCMSPricing, 
  useCreateCMSPricing, 
  useUpdateCMSPricing, 
  useDeleteCMSPricing,
  type CMSPricingPlanInsert 
} from '@/hooks/useCMSPricing';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORIES = [
  { value: 'shared', label: 'শেয়ার্ড হোস্টিং' },
  { value: 'wordpress', label: 'ওয়ার্ডপ্রেস হোস্টিং' },
  { value: 'vps', label: 'VPS হোস্টিং' },
  { value: 'dedicated', label: 'ডেডিকেটেড সার্ভার' },
  { value: 'domain', label: 'ডোমেইন' },
  { value: 'reseller', label: 'রিসেলার হোস্টিং' },
];

const CMSPricingManagement: React.FC = () => {
  const { data: plans, isLoading } = useCMSPricing();
  const createPricing = useCreateCMSPricing();
  const updatePricing = useUpdateCMSPricing();
  const deletePricing = useDeleteCMSPricing();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<CMSPricingPlanInsert>>({
    plan_name: '',
    category: 'shared',
    display_price: '',
    features: [],
    whmcs_pid: '',
    whmcs_redirect_url: '',
    is_featured: false,
    is_active: true,
  });
  const [featuresText, setFeaturesText] = useState('');

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      plan_name: '',
      category: 'shared',
      display_price: '',
      features: [],
      whmcs_pid: '',
      whmcs_redirect_url: '',
      is_featured: false,
      is_active: true,
    });
    setFeaturesText('');
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      plan_name: plan.plan_name,
      category: plan.category,
      display_price: plan.display_price,
      original_price: plan.original_price,
      discount_label: plan.discount_label,
      billing_cycle_label: plan.billing_cycle_label,
      whmcs_pid: plan.whmcs_pid || '',
      whmcs_redirect_url: plan.whmcs_redirect_url || '',
      is_featured: plan.is_featured,
      is_active: plan.is_active,
    });
    setFeaturesText(Array.isArray(plan.features) ? plan.features.join('\n') : '');
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const features = featuresText.split('\n').filter(f => f.trim());
    
    if (editingPlan) {
      updatePricing.mutate({
        id: editingPlan.id,
        ...formData,
        features,
      }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createPricing.mutate({
        ...formData as CMSPricingPlanInsert,
        features,
      }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই প্ল্যান মুছে ফেলতে চান?')) {
      deletePricing.mutate(id);
    }
  };

  const toggleActive = (plan: any) => {
    updatePricing.mutate({
      id: plan.id,
      is_active: !plan.is_active,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group by category
  const groupedPlans = plans?.reduce((acc, plan) => {
    if (!acc[plan.category]) acc[plan.category] = [];
    acc[plan.category].push(plan);
    return acc;
  }, {} as Record<string, typeof plans>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">প্রাইসিং ডিসপ্লে</h1>
          <p className="text-muted-foreground mt-1">
            প্রাইসিং প্ল্যান (শুধুমাত্র UI এর জন্য - চেকআউট WHMCS এ রিডাইরেক্ট হয়)
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন প্ল্যান
        </Button>
      </div>

      {/* Notice */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-200">শুধুমাত্র ডিসপ্লে উদ্দেশ্যে</p>
              <p className="text-sm text-blue-200/70 mt-1">
                এই প্রাইসিং ডাটা শুধুমাত্র ফ্রন্টেন্ডে দেখানোর জন্য। প্রকৃত মূল্য এবং বিলিং 
                WHMCS থেকে আসে। "অর্ডার করুন" বাটনে ক্লিক করলে গ্রাহক WHMCS কার্টে রিডাইরেক্ট হবে।
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {groupedPlans && Object.entries(groupedPlans).map(([category, categoryPlans]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {CATEGORIES.find(c => c.value === category)?.label || category}
              <Badge variant="secondary" className="ml-2">
                {categoryPlans?.length || 0} প্ল্যান
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryPlans?.map((plan) => (
                <Card key={plan.id} className={`relative ${!plan.is_active ? 'opacity-50' : ''}`}>
                  {plan.is_featured && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-amber-500">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{plan.plan_name}</h3>
                        <Switch
                          checked={plan.is_active || false}
                          onCheckedChange={() => toggleActive(plan)}
                        />
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {plan.display_price}
                        {plan.billing_cycle_label && (
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.billing_cycle_label}
                          </span>
                        )}
                      </div>
                      {plan.original_price && (
                        <p className="text-sm text-muted-foreground line-through">
                          {plan.original_price}
                        </p>
                      )}
                      {plan.whmcs_pid && (
                        <p className="text-xs text-muted-foreground">
                          WHMCS PID: {plan.whmcs_pid}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenEdit(plan)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          এডিট
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(plan.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'প্ল্যান এডিট করুন' : 'নতুন প্ল্যান তৈরি করুন'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>প্ল্যান নাম *</Label>
                <Input
                  value={formData.plan_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, plan_name: e.target.value }))}
                  placeholder="যেমন: Starter"
                />
              </div>
              <div>
                <Label>ক্যাটেগরি *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ডিসপ্লে প্রাইস *</Label>
                <Input
                  value={formData.display_price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_price: e.target.value }))}
                  placeholder="৳১৯৯"
                />
              </div>
              <div>
                <Label>অরিজিনাল প্রাইস</Label>
                <Input
                  value={formData.original_price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                  placeholder="৳২৯৯"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>বিলিং সাইকেল</Label>
                <Input
                  value={formData.billing_cycle_label || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, billing_cycle_label: e.target.value }))}
                  placeholder="মাস"
                />
              </div>
              <div>
                <Label>ডিসকাউন্ট লেবেল</Label>
                <Input
                  value={formData.discount_label || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_label: e.target.value }))}
                  placeholder="৩০% ছাড়"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>WHMCS Product ID</Label>
                <Input
                  value={formData.whmcs_pid || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, whmcs_pid: e.target.value }))}
                  placeholder="123"
                />
              </div>
              <div>
                <Label>WHMCS Redirect URL</Label>
                <Input
                  value={formData.whmcs_redirect_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, whmcs_redirect_url: e.target.value }))}
                  placeholder="/cart.php?a=add&pid=123"
                />
              </div>
            </div>
            <div>
              <Label>ফিচার লিস্ট (প্রতি লাইনে একটি)</Label>
              <Textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="5GB SSD Storage&#10;Unlimited Bandwidth&#10;Free SSL"
                rows={5}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured || false}
                  onCheckedChange={(val) => setFormData(prev => ({ ...prev, is_featured: val }))}
                />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active ?? true}
                  onCheckedChange={(val) => setFormData(prev => ({ ...prev, is_active: val }))}
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              বাতিল
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.plan_name || !formData.display_price || createPricing.isPending || updatePricing.isPending}
            >
              {(createPricing.isPending || updatePricing.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingPlan ? 'আপডেট করুন' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSPricingManagement;
