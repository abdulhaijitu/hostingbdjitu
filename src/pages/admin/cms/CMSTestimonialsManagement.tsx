import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star,
  Loader2,
  Quote,
  User
} from 'lucide-react';
import { 
  useCMSTestimonials, 
  useCreateCMSTestimonial, 
  useUpdateCMSTestimonial, 
  useDeleteCMSTestimonial,
  type CMSTestimonialInsert 
} from '@/hooks/useCMSTestimonials';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CMSTestimonialsManagement: React.FC = () => {
  const { data: testimonials, isLoading } = useCMSTestimonials();
  const createTestimonial = useCreateCMSTestimonial();
  const updateTestimonial = useUpdateCMSTestimonial();
  const deleteTestimonial = useDeleteCMSTestimonial();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<CMSTestimonialInsert>>({
    client_name: '',
    feedback: '',
    rating: 5,
    is_featured: false,
    is_active: true,
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      client_name: '',
      feedback: '',
      company_name: '',
      avatar_url: '',
      rating: 5,
      is_featured: false,
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      client_name: item.client_name,
      client_name_bn: item.client_name_bn,
      feedback: item.feedback,
      feedback_bn: item.feedback_bn,
      company_name: item.company_name,
      avatar_url: item.avatar_url,
      rating: item.rating,
      is_featured: item.is_featured,
      is_active: item.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateTestimonial.mutate({
        id: editingItem.id,
        ...formData,
      }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createTestimonial.mutate(formData as CMSTestimonialInsert, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই টেস্টিমোনিয়াল মুছে ফেলতে চান?')) {
      deleteTestimonial.mutate(id);
    }
  };

  const toggleActive = (item: any) => {
    updateTestimonial.mutate({
      id: item.id,
      is_active: !item.is_active,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">টেস্টিমোনিয়াল</h1>
          <p className="text-muted-foreground mt-1">
            ক্লায়েন্ট রিভিউ এবং ফিডব্যাক পরিচালনা করুন
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন টেস্টিমোনিয়াল
        </Button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials?.map((item) => (
          <Card key={item.id} className={`relative ${!item.is_active ? 'opacity-50' : ''}`}>
            {item.is_featured && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-amber-500">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              </div>
            )}
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Quote className="h-8 w-8 text-primary/20" />
                <p className="text-sm text-muted-foreground line-clamp-3">
                  "{item.feedback}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {item.avatar_url ? (
                      <img 
                        src={item.avatar_url} 
                        alt={item.client_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.client_name}</p>
                    {item.company_name && (
                      <p className="text-xs text-muted-foreground">{item.company_name}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < (item.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <Switch
                    checked={item.is_active || false}
                    onCheckedChange={() => toggleActive(item)}
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          কোন টেস্টিমোনিয়াল পাওয়া যায়নি
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'টেস্টিমোনিয়াল এডিট করুন' : 'নতুন টেস্টিমোনিয়াল তৈরি করুন'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ক্লায়েন্ট নাম (English) *</Label>
                <Input
                  value={formData.client_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>ক্লায়েন্ট নাম (বাংলা)</Label>
                <Input
                  value={formData.client_name_bn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name_bn: e.target.value }))}
                  placeholder="জন ডো"
                />
              </div>
            </div>
            <div>
              <Label>কোম্পানি নাম</Label>
              <Input
                value={formData.company_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="ABC Company"
              />
            </div>
            <div>
              <Label>ফিডব্যাক (English) *</Label>
              <Textarea
                value={formData.feedback || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Great service..."
                rows={3}
              />
            </div>
            <div>
              <Label>ফিডব্যাক (বাংলা)</Label>
              <Textarea
                value={formData.feedback_bn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback_bn: e.target.value }))}
                placeholder="চমৎকার সেবা..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Avatar URL</Label>
                <Input
                  value={formData.avatar_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>রেটিং (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.rating || 5}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                />
              </div>
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
              disabled={!formData.client_name || !formData.feedback || createTestimonial.isPending || updateTestimonial.isPending}
            >
              {(createTestimonial.isPending || updateTestimonial.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingItem ? 'আপডেট করুন' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSTestimonialsManagement;
