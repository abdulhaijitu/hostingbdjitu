import React, { useState } from 'react';
import { useContactMessages, useMarkMessageAsRead, useDeleteContactMessage } from '@/hooks/useContactMessages';
import CMSPermissionGate from '@/components/cms/CMSPermissionGate';
import CMSConfirmDialog from '@/components/cms/CMSConfirmDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Mail, MailOpen, Trash2, Search, RefreshCcw, 
  AlertCircle, Clock, User, MessageSquare, Eye 
} from 'lucide-react';
import { format } from 'date-fns';
import { useCMSPermission } from '@/components/cms/CMSPermissionGate';

const CMSContactMessagesPage: React.FC = () => {
  const { data: messages, isLoading, error, refetch } = useContactMessages();
  const markAsRead = useMarkMessageAsRead();
  const deleteMessage = useDeleteContactMessage();
  
  const isSuperAdmin = useCMSPermission('super_admin');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredMessages = messages?.filter(msg => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') return matchesSearch && !msg.is_read;
    if (filter === 'read') return matchesSearch && msg.is_read;
    return matchesSearch;
  });

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

  const handleView = async (message: any) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
    
    if (!message.is_read) {
      await markAsRead.mutateAsync(message.id);
    }
  };

  const handleDelete = async () => {
    if (selectedMessage) {
      await deleteMessage.mutateAsync(selectedMessage.id);
      setDeleteDialogOpen(false);
      setViewDialogOpen(false);
      setSelectedMessage(null);
    }
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
    <CMSPermissionGate requiredRole="viewer">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">কন্টাক্ট মেসেজ</h1>
            <p className="text-muted-foreground">
              কন্টাক্ট ফর্ম থেকে আসা মেসেজগুলো দেখুন (কেবলমাত্র পড়া যায়)
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-sm px-3 py-1">
              <Mail className="h-4 w-4 mr-2" />
              {unreadCount} টি অপঠিত মেসেজ
            </Badge>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="মেসেজ খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              সব ({messages?.length || 0})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              অপঠিত ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              পঠিত ({(messages?.length || 0) - unreadCount})
            </Button>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          ) : filteredMessages?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                <p>কোনো মেসেজ পাওয়া যায়নি</p>
              </CardContent>
            </Card>
          ) : (
            filteredMessages?.map((message) => (
              <Card 
                key={message.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !message.is_read ? 'border-primary/50 bg-primary/5' : ''
                }`}
                onClick={() => handleView(message)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        message.is_read ? 'bg-muted' : 'bg-primary/10'
                      }`}>
                        {message.is_read ? (
                          <MailOpen className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.name}</span>
                          {!message.is_read && (
                            <Badge variant="default" className="text-xs">নতুন</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                        {message.subject && (
                          <p className="text-sm font-medium mt-1">{message.subject}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(message.created_at), 'dd MMM yyyy, HH:mm')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                মেসেজ বিস্তারিত
              </DialogTitle>
            </DialogHeader>
            
            {selectedMessage && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      প্রেরক
                    </p>
                    <p className="font-medium">{selectedMessage.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      ইমেইল
                    </p>
                    <p className="font-medium">{selectedMessage.email}</p>
                  </div>
                </div>
                
                {selectedMessage.subject && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">বিষয়</p>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">মেসেজ</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(selectedMessage.created_at), 'dd MMMM yyyy, hh:mm a')}
                  </span>
                  
                  {isSuperAdmin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      মুছে ফেলুন
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <CMSConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="মেসেজ মুছে ফেলুন"
          description="এই মেসেজটি মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।"
          actionType="delete"
          confirmLabel="মুছে ফেলুন"
          isLoading={deleteMessage.isPending}
        />
      </div>
    </CMSPermissionGate>
  );
};

export default CMSContactMessagesPage;
