import React, { useState } from 'react';
import { useCMSPages, useCreateCMSPage, useUpdateCMSPage, useDeleteCMSPage } from '@/hooks/useCMSPages';
import CMSPermissionGate from '@/components/cms/CMSPermissionGate';
import CMSConfirmDialog from '@/components/cms/CMSConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, FileText, Search, 
  ExternalLink, Clock, RefreshCcw, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { useCMSPermission } from '@/components/cms/CMSPermissionGate';

const CMSPagesManagement: React.FC = () => {
  const { data: pages, isLoading, error, refetch } = useCMSPages();
  const createPage = useCreateCMSPage();
  const updatePage = useUpdateCMSPage();
  const deletePage = useDeleteCMSPage();
  
  const canEdit = useCMSPermission('editor');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    slug: '',
    page_type: 'static',
    seo_title: '',
    seo_description: '',
    is_published: false,
  });

  const filteredPages = pages?.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedPage(null);
    setFormData({
      title: '',
      title_bn: '',
      slug: '',
      page_type: 'static',
      seo_title: '',
      seo_description: '',
      is_published: false,
    });
    setEditDialogOpen(true);
  };

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setFormData({
      title: page.title || '',
      title_bn: page.title_bn || '',
      slug: page.slug || '',
      page_type: page.page_type || 'static',
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      is_published: page.is_published || false,
    });
    setEditDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (selectedPage) {
      await updatePage.mutateAsync({ id: selectedPage.id, ...formData });
    } else {
      await createPage.mutateAsync(formData);
    }
    setEditDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedPage) {
      await deletePage.mutateAsync(selectedPage.id);
      setDeleteDialogOpen(false);
      setSelectedPage(null);
    }
  };

  const handleTogglePublish = async (page: any) => {
    await updatePage.mutateAsync({
      id: page.id,
      is_published: !page.is_published,
    });
  };

  if (error) {
    return (
      <Card className="m-6 border-destructive/50">
        <CardContent className="flex items-center gap-4 py-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold">ডাটা লোড করতে সমস্যা হয়েছে</h3>
            <p className="text-sm text-muted-foreground">পুনরায় চেষ্টা করুন</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="ml-auto">
            <RefreshCcw className="h-4 w-4 mr-2" />
            আবার চেষ্টা করুন
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <CMSPermissionGate requiredRole="editor">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">পেজ ম্যানেজমেন্ট</h1>
            <p className="text-muted-foreground">ফ্রন্টএন্ড পেজ এবং SEO মেটা পরিচালনা করুন</p>
          </div>
          
          {canEdit && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              নতুন পেজ
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="পেজ খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              সকল পেজ
            </CardTitle>
            <CardDescription>
              {pages?.length || 0} টি পেজ পাওয়া গেছে
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>পেজ</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>টাইপ</TableHead>
                    <TableHead>স্ট্যাটাস</TableHead>
                    <TableHead>আপডেট</TableHead>
                    <TableHead className="text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages?.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{page.title}</p>
                          {page.title_bn && (
                            <p className="text-sm text-muted-foreground">{page.title_bn}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          /{page.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{page.page_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {page.is_published ? (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                            <Eye className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(page.updated_at), 'dd MMM yyyy')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleTogglePublish(page)}
                                title={page.is_published ? 'Unpublish' : 'Publish'}
                              >
                                {page.is_published ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(page)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  setSelectedPage(page);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredPages?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        কোনো পেজ পাওয়া যায়নি
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit/Create Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPage ? 'পেজ এডিট করুন' : 'নতুন পেজ তৈরি করুন'}
              </DialogTitle>
              <DialogDescription>
                পেজের তথ্য এবং SEO মেটা পূরণ করুন
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>পেজ টাইটেল (English)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Page Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>পেজ টাইটেল (বাংলা)</Label>
                  <Input
                    value={formData.title_bn}
                    onChange={(e) => setFormData({ ...formData, title_bn: e.target.value })}
                    placeholder="পেজ টাইটেল"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">/</span>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-') 
                    })}
                    placeholder="page-slug"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="SEO optimized title (max 60 chars)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.seo_title.length}/60 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="SEO meta description (max 160 chars)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.seo_description.length}/160 characters
                </p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label>পাবলিশ স্ট্যাটাস</Label>
                  <p className="text-sm text-muted-foreground">
                    পাবলিশ করলে সাইটে দেখাবে
                  </p>
                </div>
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                বাতিল
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={createPage.isPending || updatePage.isPending}
              >
                {createPage.isPending || updatePage.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <CMSConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="পেজ মুছে ফেলুন"
          description={`"${selectedPage?.title}" পেজটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
          actionType="delete"
          confirmLabel="মুছে ফেলুন"
          isLoading={deletePage.isPending}
        />
      </div>
    </CMSPermissionGate>
  );
};

export default CMSPagesManagement;
