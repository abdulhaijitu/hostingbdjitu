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
  Megaphone,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { 
  useCMSAnnouncements, 
  useCreateCMSAnnouncement, 
  useUpdateCMSAnnouncement, 
  useDeleteCMSAnnouncement,
  type CMSAnnouncementInsert 
} from '@/hooks/useCMSAnnouncements';
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

const TYPES = [
  { value: 'promo', label: 'প্রোমো' },
  { value: 'maintenance', label: 'মেইনটেন্যান্স' },
  { value: 'update', label: 'আপডেট' },
  { value: 'warning', label: 'সতর্কতা' },
];

const LOCATIONS = [
  { value: 'banner', label: 'টপ ব্যানার' },
  { value: 'modal', label: 'মডাল' },
  { value: 'sidebar', label: 'সাইডবার' },
];

const CMSAnnouncementsManagement: React.FC = () => {
  const { data: announcements, isLoading } = useCMSAnnouncements();
  const createAnnouncement = useCreateCMSAnnouncement();
  const updateAnnouncement = useUpdateCMSAnnouncement();
  const deleteAnnouncement = useDeleteCMSAnnouncement();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<CMSAnnouncementInsert>>({
    title: '',
    announcement_type: 'promo',
    display_location: 'banner',
    is_active: true,
    is_dismissible: true,
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      short_description: '',
      announcement_type: 'promo',
      display_location: 'banner',
      cta_label: '',
      cta_url: '',
      background_color: '#3b82f6',
      text_color: '#ffffff',
      is_active: true,
      is_dismissible: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      title_bn: item.title_bn,
      short_description: item.short_description,
      short_description_bn: item.short_description_bn,
      announcement_type: item.announcement_type,
      display_location: item.display_location,
      cta_label: item.cta_label,
      cta_label_bn: item.cta_label_bn,
      cta_url: item.cta_url,
      background_color: item.background_color,
      text_color: item.text_color,
      start_date: item.start_date?.split('T')[0],
      end_date: item.end_date?.split('T')[0],
      is_active: item.is_active,
      is_dismissible: item.is_dismissible,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateAnnouncement.mutate({
        id: editingItem.id,
        ...formData,
      }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createAnnouncement.mutate(formData as CMSAnnouncementInsert, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই অ্যানাউন্সমেন্ট মুছে ফেলতে চান?')) {
      deleteAnnouncement.mutate(id);
    }
  };

  const toggleActive = (item: any) => {
    updateAnnouncement.mutate({
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
          <h1 className="text-2xl font-bold text-foreground">অ্যানাউন্সমেন্ট</h1>
          <p className="text-muted-foreground mt-1">
            প্রোমো ব্যানার এবং নোটিশ পরিচালনা করুন
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন অ্যানাউন্সমেন্ট
        </Button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements?.map((item) => (
          <Card key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div 
                    className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.background_color || '#3b82f6' }}
                  >
                    <Megaphone className="h-6 w-6" style={{ color: item.text_color || '#fff' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">
                        {TYPES.find(t => t.value === item.announcement_type)?.label || item.announcement_type}
                      </Badge>
                      <Badge variant="secondary">
                        {LOCATIONS.find(l => l.value === item.display_location)?.label || item.display_location}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.short_description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.short_description}</p>
                    )}
                    {item.cta_url && (
                      <div className="flex items-center gap-1 text-xs text-primary mt-2">
                        <ExternalLink className="h-3 w-3" />
                        {item.cta_label || 'Link'}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.is_active || false}
                    onCheckedChange={() => toggleActive(item)}
                  />
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
            </CardContent>
          </Card>
        ))}
      </div>

      {announcements?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          কোন অ্যানাউন্সমেন্ট পাওয়া যায়নি
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'অ্যানাউন্সমেন্ট এডিট করুন' : 'নতুন অ্যানাউন্সমেন্ট তৈরি করুন'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>টাইটেল (English) *</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Special Offer!"
              />
            </div>
            <div>
              <Label>টাইটেল (বাংলা)</Label>
              <Input
                value={formData.title_bn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title_bn: e.target.value }))}
                placeholder="বিশেষ অফার!"
              />
            </div>
            <div>
              <Label>বর্ণনা (English)</Label>
              <Textarea
                value={formData.short_description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                placeholder="Get 50% off on all hosting plans"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>টাইপ</Label>
                <Select
                  value={formData.announcement_type || 'promo'}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, announcement_type: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>লোকেশন</Label>
                <Select
                  value={formData.display_location || 'banner'}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, display_location: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map(l => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTA লেবেল</Label>
                <Input
                  value={formData.cta_label || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_label: e.target.value }))}
                  placeholder="Order Now"
                />
              </div>
              <div>
                <Label>CTA URL</Label>
                <Input
                  value={formData.cta_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.background_color || '#3b82f6'}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    className="w-14 h-10 p-1"
                  />
                  <Input
                    value={formData.background_color || '#3b82f6'}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.text_color || '#ffffff'}
                    onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                    className="w-14 h-10 p-1"
                  />
                  <Input
                    value={formData.text_color || '#ffffff'}
                    onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>শুরু তারিখ</Label>
                <Input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label>শেষ তারিখ</Label>
                <Input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <Switch
                  checked={formData.is_dismissible ?? true}
                  onCheckedChange={(val) => setFormData(prev => ({ ...prev, is_dismissible: val }))}
                />
                <span className="text-sm">বন্ধ করা যাবে</span>
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
              disabled={!formData.title || createAnnouncement.isPending || updateAnnouncement.isPending}
            >
              {(createAnnouncement.isPending || updateAnnouncement.isPending) && (
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

export default CMSAnnouncementsManagement;
