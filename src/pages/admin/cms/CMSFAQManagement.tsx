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
  HelpCircle,
  Loader2,
  Search
} from 'lucide-react';
import { 
  useCMSFAQs, 
  useCreateCMSFAQ, 
  useUpdateCMSFAQ, 
  useDeleteCMSFAQ,
  type CMSFAQInsert 
} from '@/hooks/useCMSFAQ';
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
  { value: 'general', label: 'সাধারণ' },
  { value: 'hosting', label: 'হোস্টিং' },
  { value: 'domain', label: 'ডোমেইন' },
  { value: 'billing', label: 'বিলিং' },
  { value: 'technical', label: 'টেকনিক্যাল' },
];

const CMSFAQManagement: React.FC = () => {
  const { data: faqs, isLoading } = useCMSFAQs();
  const createFAQ = useCreateCMSFAQ();
  const updateFAQ = useUpdateCMSFAQ();
  const deleteFAQ = useDeleteCMSFAQ();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<CMSFAQInsert>>({
    question: '',
    answer: '',
    category: 'general',
    is_active: true,
    sort_order: 0,
  });

  const handleOpenCreate = () => {
    setEditingFAQ(null);
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      is_active: true,
      sort_order: 0,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (faq: any) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      question_bn: faq.question_bn,
      answer: faq.answer,
      answer_bn: faq.answer_bn,
      category: faq.category || 'general',
      is_active: faq.is_active,
      sort_order: faq.sort_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingFAQ) {
      updateFAQ.mutate({
        id: editingFAQ.id,
        ...formData,
      }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createFAQ.mutate(formData as CMSFAQInsert, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই FAQ মুছে ফেলতে চান?')) {
      deleteFAQ.mutate(id);
    }
  };

  const toggleActive = (faq: any) => {
    updateFAQ.mutate({
      id: faq.id,
      is_active: !faq.is_active,
    });
  };

  const filteredFAQs = faqs?.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-foreground">FAQ ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground mt-1">
            সাধারণ প্রশ্ন ও উত্তর পরিচালনা করুন
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন FAQ
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="FAQ খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs?.map((faq) => (
          <Card key={faq.id} className={!faq.is_active ? 'opacity-50' : ''}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    <Badge variant="outline">
                      {CATEGORIES.find(c => c.value === faq.category)?.label || faq.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={faq.is_active || false}
                    onCheckedChange={() => toggleActive(faq)}
                  />
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleOpenEdit(faq)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFAQs?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          কোন FAQ পাওয়া যায়নি
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingFAQ ? 'FAQ এডিট করুন' : 'নতুন FAQ তৈরি করুন'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>প্রশ্ন (English) *</Label>
              <Input
                value={formData.question || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="What is web hosting?"
              />
            </div>
            <div>
              <Label>প্রশ্ন (বাংলা)</Label>
              <Input
                value={formData.question_bn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, question_bn: e.target.value }))}
                placeholder="ওয়েব হোস্টিং কি?"
              />
            </div>
            <div>
              <Label>উত্তর (English) *</Label>
              <Textarea
                value={formData.answer || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Web hosting is a service..."
                rows={4}
              />
            </div>
            <div>
              <Label>উত্তর (বাংলা)</Label>
              <Textarea
                value={formData.answer_bn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, answer_bn: e.target.value }))}
                placeholder="ওয়েব হোস্টিং হল একটি সেবা..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ক্যাটেগরি</Label>
                <Select
                  value={formData.category || 'general'}
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
              <div>
                <Label>সর্ট অর্ডার</Label>
                <Input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active ?? true}
                onCheckedChange={(val) => setFormData(prev => ({ ...prev, is_active: val }))}
              />
              <span className="text-sm">Active</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              বাতিল
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.question || !formData.answer || createFAQ.isPending || updateFAQ.isPending}
            >
              {(createFAQ.isPending || updateFAQ.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingFAQ ? 'আপডেট করুন' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSFAQManagement;
