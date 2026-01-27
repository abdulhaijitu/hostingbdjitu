import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  FileText,
  Loader2,
  Eye,
  Calendar,
  Search,
  EyeOff
} from 'lucide-react';
import CMSPermissionGate from '@/components/cms/CMSPermissionGate';
import CMSConfirmDialog from '@/components/cms/CMSConfirmDialog';
import { useCMSPermission } from '@/components/cms/CMSPermissionGate';
import { 
  useCMSBlogPosts, 
  useCreateCMSBlogPost, 
  useUpdateCMSBlogPost, 
  useDeleteCMSBlogPost,
  type CMSBlogPostInsert 
} from '@/hooks/useCMSBlog';
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
import { format } from 'date-fns';

const CATEGORIES = [
  { value: 'general', label: 'সাধারণ' },
  { value: 'hosting', label: 'হোস্টিং' },
  { value: 'domain', label: 'ডোমেইন' },
  { value: 'tutorial', label: 'টিউটোরিয়াল' },
  { value: 'news', label: 'নিউজ' },
];

const CMSBlogManagement: React.FC = () => {
  const { data: posts, isLoading } = useCMSBlogPosts();
  const createPost = useCreateCMSBlogPost();
  const updatePost = useUpdateCMSBlogPost();
  const deletePost = useDeleteCMSBlogPost();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<CMSBlogPostInsert>>({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    category: 'general',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image_url: '',
      status: 'draft',
      category: 'general',
      seo_title: '',
      seo_description: '',
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      title_bn: post.title_bn,
      slug: post.slug,
      content: post.content,
      content_bn: post.content_bn,
      excerpt: post.excerpt,
      excerpt_bn: post.excerpt_bn,
      featured_image_url: post.featured_image_url,
      status: post.status,
      category: post.category,
      seo_title: post.seo_title,
      seo_description: post.seo_description,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const postData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title || ''),
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
    };

    if (editingPost) {
      updatePost.mutate({
        id: editingPost.id,
        ...postData,
      }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createPost.mutate(postData as CMSBlogPostInsert, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই পোস্ট মুছে ফেলতে চান?')) {
      deletePost.mutate(id);
    }
  };

  const toggleStatus = (post: any) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    updatePost.mutate({
      id: post.id,
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    });
  };

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-foreground">ব্লগ পোস্ট</h1>
          <p className="text-muted-foreground mt-1">
            ব্লগ এবং নিউজ আর্টিকেল পরিচালনা করুন
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          নতুন পোস্ট
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="পোস্ট খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts?.map((post) => (
          <Card key={post.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {post.featured_image_url ? (
                    <img 
                      src={post.featured_image_url} 
                      alt={post.title}
                      className="h-16 w-24 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status === 'published' ? 'প্রকাশিত' : 'ড্রাফট'}
                      </Badge>
                      <Badge variant="outline">
                        {CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.created_at), 'dd/MM/yyyy')}
                      </span>
                      <span>/{post.slug}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleStatus(post)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleOpenEdit(post)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          কোন পোস্ট পাওয়া যায়নি
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'পোস্ট এডিট করুন' : 'নতুন পোস্ট তৈরি করুন'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>টাইটেল (English) *</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      title: e.target.value,
                      slug: prev.slug || generateSlug(e.target.value)
                    }));
                  }}
                  placeholder="How to Choose the Right Hosting"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="how-to-choose-hosting"
                />
              </div>
            </div>
            <div>
              <Label>টাইটেল (বাংলা)</Label>
              <Input
                value={formData.title_bn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title_bn: e.target.value }))}
                placeholder="সঠিক হোস্টিং কিভাবে নির্বাচন করবেন"
              />
            </div>
            <div>
              <Label>Excerpt (English)</Label>
              <Textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary of the post..."
                rows={2}
              />
            </div>
            <div>
              <Label>কন্টেন্ট (English) *</Label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Full content of the blog post..."
                rows={8}
              />
            </div>
            <div>
              <Label>কন্টেন্ট (বাংলা)</Label>
              <Textarea
                value={formData.content_bn || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, content_bn: e.target.value }))}
                placeholder="ব্লগ পোস্টের সম্পূর্ণ কন্টেন্ট..."
                rows={6}
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
                <Label>স্ট্যাটাস</Label>
                <Select
                  value={formData.status || 'draft'}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">ড্রাফট</SelectItem>
                    <SelectItem value="published">প্রকাশিত</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Featured Image URL</Label>
              <Input
                value={formData.featured_image_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SEO Title</Label>
                <Input
                  value={formData.seo_title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <Label>SEO Description</Label>
                <Input
                  value={formData.seo_description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                  placeholder="Meta description"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              বাতিল
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.title || !formData.content || createPost.isPending || updatePost.isPending}
            >
              {(createPost.isPending || updatePost.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingPost ? 'আপডেট করুন' : 'তৈরি করুন'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMSBlogManagement;
