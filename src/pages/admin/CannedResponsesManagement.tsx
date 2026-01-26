import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, ArrowLeft, Plus, Edit2, Trash2, Search,
  MessageSquare, FileText, CreditCard, Clock, HelpCircle,
  Save, X, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { cn } from '@/lib/utils';
import {
  useAllCannedResponses,
  useCreateCannedResponse,
  useUpdateCannedResponse,
  useDeleteCannedResponse,
  CannedResponse,
  CannedResponseInput,
} from '@/hooks/useCannedResponses';

const categoryIcons: Record<string, React.ReactNode> = {
  greeting: <MessageSquare className="h-4 w-4" />,
  technical: <FileText className="h-4 w-4" />,
  billing: <CreditCard className="h-4 w-4" />,
  closing: <Clock className="h-4 w-4" />,
  general: <HelpCircle className="h-4 w-4" />,
  info: <HelpCircle className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  greeting: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  technical: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  billing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  closing: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  general: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  info: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
};

const CATEGORIES = ['greeting', 'technical', 'billing', 'closing', 'general', 'info'];

const CannedResponsesManagement: React.FC = () => {
  const { language } = useLanguage();
  const { data: responses, isLoading } = useAllCannedResponses();
  const createMutation = useCreateCannedResponse();
  const updateMutation = useUpdateCannedResponse();
  const deleteMutation = useDeleteCannedResponse();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<CannedResponse | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CannedResponseInput>({
    title: '',
    title_bn: '',
    content: '',
    content_bn: '',
    category: 'general',
    shortcut: '',
    sort_order: 0,
    is_active: true,
  });

  const filteredResponses = responses?.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.shortcut && r.shortcut.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleOpenCreate = () => {
    setEditingResponse(null);
    setFormData({
      title: '',
      title_bn: '',
      content: '',
      content_bn: '',
      category: 'general',
      shortcut: '',
      sort_order: 0,
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (response: CannedResponse) => {
    setEditingResponse(response);
    setFormData({
      title: response.title,
      title_bn: response.title_bn || '',
      content: response.content,
      content_bn: response.content_bn || '',
      category: response.category,
      shortcut: response.shortcut || '',
      sort_order: response.sort_order,
      is_active: response.is_active,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (editingResponse) {
      await updateMutation.mutateAsync({ id: editingResponse.id, ...formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'ক্যানড রেসপন্স ম্যানেজমেন্ট' : 'Canned Responses Management'}
        description="Manage quick response templates"
        canonicalUrl="/admin/canned-responses"
        noIndex
      />
      
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <Link to="/admin/tickets">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'টিকেটে ফিরে যান' : 'Back to Tickets'}
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold font-display flex items-center gap-3">
                <Zap className="h-8 w-8 text-amber-500" />
                {language === 'bn' ? 'ক্যানড রেসপন্স' : 'Canned Responses'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'দ্রুত উত্তর টেমপ্লেট পরিচালনা করুন' : 'Manage quick response templates'}
              </p>
            </div>
            <Button className="gap-2" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              {language === 'bn' ? 'নতুন রেসপন্স' : 'New Response'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'bn' ? 'টাইটেল, শর্টকাট...' : 'Title, shortcut...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</SelectItem>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      <div className="flex items-center gap-2">
                        {categoryIcons[cat]}
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Responses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : filteredResponses.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{language === 'bn' ? 'কোন রেসপন্স পাওয়া যায়নি' : 'No responses found'}</p>
            </div>
          ) : (
            filteredResponses.map(response => (
              <Card 
                key={response.id} 
                className={cn(
                  "transition-all hover:shadow-md",
                  !response.is_active && "opacity-60"
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn("text-xs", categoryColors[response.category] || 'bg-muted')}>
                        {categoryIcons[response.category]}
                        <span className="ml-1">{response.category}</span>
                      </Badge>
                      {response.shortcut && (
                        <code className="text-xs px-1.5 py-0.5 rounded bg-muted">
                          {response.shortcut}
                        </code>
                      )}
                      {!response.is_active && (
                        <Badge variant="secondary" className="text-xs">Inactive</Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => handleOpenEdit(response)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(response.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-2">{response.title}</CardTitle>
                  {response.title_bn && (
                    <p className="text-sm text-muted-foreground">{response.title_bn}</p>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {response.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              {editingResponse 
                ? (language === 'bn' ? 'রেসপন্স সম্পাদনা' : 'Edit Response')
                : (language === 'bn' ? 'নতুন রেসপন্স' : 'New Response')
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'টাইটেল (English)' : 'Title (English)'} *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Welcome message"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'টাইটেল (বাংলা)' : 'Title (Bengali)'}</Label>
                <Input
                  value={formData.title_bn || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_bn: e.target.value }))}
                  placeholder="স্বাগত বার্তা"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'bn' ? 'কন্টেন্ট (English)' : 'Content (English)'} *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Hello! Thank you for contacting us..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>{language === 'bn' ? 'কন্টেন্ট (বাংলা)' : 'Content (Bengali)'}</Label>
              <Textarea
                value={formData.content_bn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content_bn: e.target.value }))}
                placeholder="হ্যালো! আমাদের সাথে যোগাযোগের জন্য ধন্যবাদ..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'ক্যাটাগরি' : 'Category'}</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex items-center gap-2">
                          {categoryIcons[cat]}
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'শর্টকাট' : 'Shortcut'}</Label>
                <Input
                  value={formData.shortcut || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortcut: e.target.value }))}
                  placeholder="/hello"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'সর্ট অর্ডার' : 'Sort Order'}</Label>
                <Input
                  type="number"
                  value={formData.sort_order || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">{language === 'bn' ? 'সক্রিয়' : 'Active'}</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
              <X className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {language === 'bn' ? 'সেভ করুন' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{language === 'bn' ? 'নিশ্চিত করুন' : 'Are you sure?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? 'এই ক্যানড রেসপন্সটি স্থায়ীভাবে মুছে ফেলা হবে।'
                : 'This canned response will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'bn' ? 'বাতিল' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CannedResponsesManagement;
