import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, ArrowLeft, Search, Clock, CheckCircle, 
  AlertCircle, User, Send, Paperclip, MoreHorizontal, 
  RefreshCw, Loader2, Headphones, Wifi, WifiOff, Download,
  Image as ImageIcon, X, File
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/common/SEOHead';
import { cn } from '@/lib/utils';
import { useSupportTickets, useTicketMessages, useUpdateTicketStatus, SupportTicket, TicketMessage } from '@/hooks/useSupportTickets';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { useTicketAttachments, UploadedAttachment } from '@/hooks/useTicketAttachments';
import CannedResponses from '@/components/support/CannedResponses';
import ImagePreview from '@/components/support/ImagePreview';

interface PendingFile {
  file: File;
  preview?: string;
}

const TicketsManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: tickets, isLoading: ticketsLoading, refetch } = useSupportTickets();
  const { uploadFiles, isUploading, uploadProgress } = useTicketAttachments();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const { data: messages, isLoading: messagesLoading } = useTicketMessages(selectedTicket?.id || null);
  const updateStatusMutation = useUpdateTicketStatus();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Monitor realtime connection status
  useEffect(() => {
    if (!selectedTicket) return;

    const channel = supabase
      .channel(`presence-${selectedTicket.id}`)
      .on('presence', { event: 'sync' }, () => {
        setIsConnected(true);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTicket]);

  // Cleanup file previews on unmount
  useEffect(() => {
    return () => {
      pendingFiles.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [pendingFiles]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: language === 'bn' ? 'ফাইল বড়' : 'File too large',
          description: language === 'bn' ? 'সর্বোচ্চ ১০MB' : 'Maximum 10MB allowed',
          variant: 'destructive',
        });
        return false;
      }
      return true;
    }).slice(0, 5 - pendingFiles.length);

    const newPendingFiles: PendingFile[] = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setPendingFiles(prev => [...prev, ...newPendingFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => {
      const file = prev[index];
      if (file.preview) URL.revokeObjectURL(file.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Admin reply mutation with attachments
  const adminReplyMutation = useMutation({
    mutationFn: async ({ ticketId, message, attachments }: { ticketId: string; message: string; attachments?: UploadedAttachment[] }) => {
      const attachmentsJson = attachments?.map(att => ({
        name: att.name,
        size: att.size,
        type: att.type,
        url: att.url,
        path: att.path,
      })) || [];
      
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([{
          ticket_id: ticketId,
          user_id: user!.id,
          message: message,
          is_staff_reply: true,
          attachments: attachmentsJson,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', variables.ticketId] });
      setReplyMessage('');
      setPendingFiles([]);
      toast({
        title: language === 'bn' ? 'রিপ্লাই পাঠানো হয়েছে' : 'Reply Sent',
        description: language === 'bn' ? 'গ্রাহককে নোটিফিকেশন পাঠানো হয়েছে' : 'Customer has been notified',
      });
    },
  });

  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'open': 'bg-blue-500/10 text-blue-600',
      'pending': 'bg-warning/10 text-warning',
      'resolved': 'bg-success/10 text-success',
      'closed': 'bg-muted text-muted-foreground',
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      'low': 'bg-muted text-muted-foreground',
      'medium': 'bg-blue-500/10 text-blue-600',
      'high': 'bg-warning/10 text-warning',
      'urgent': 'bg-destructive/10 text-destructive',
    };
    return <Badge className={styles[priority]}>{priority}</Badge>;
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      let uploadedAttachments: UploadedAttachment[] = [];
      
      if (pendingFiles.length > 0) {
        const filesToUpload = pendingFiles.map(f => f.file);
        uploadedAttachments = await uploadFiles(filesToUpload, selectedTicket.id);
      }

      await adminReplyMutation.mutateAsync({ 
        ticketId: selectedTicket.id, 
        message: replyMessage,
        attachments: uploadedAttachments,
      });
    } catch (error) {
      console.error('Send reply error:', error);
    }
  };

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    updateStatusMutation.mutate({ ticketId, status: newStatus });
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus as SupportTicket['status'] } : null);
    }
  };

  const handleCannedResponseSelect = (content: string) => {
    setReplyMessage(prev => prev ? `${prev}\n\n${content}` : content);
  };

  // Stats
  const openCount = tickets?.filter(t => t.status === 'open').length || 0;
  const pendingCount = tickets?.filter(t => t.status === 'pending').length || 0;
  const resolvedCount = tickets?.filter(t => t.status === 'resolved' || t.status === 'closed').length || 0;
  const urgentCount = tickets?.filter(t => t.priority === 'urgent' && t.status !== 'closed').length || 0;

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'সাপোর্ট টিকেট ম্যানেজমেন্ট' : 'Support Tickets Management'}
        description="Manage customer support tickets"
        canonicalUrl="/admin/tickets"
        noIndex
      />
      
      <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'bn' ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
              </Link>
            </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold font-display flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  {language === 'bn' ? 'সাপোর্ট টিকেট' : 'Support Tickets'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {language === 'bn' ? 'গ্রাহকদের সাপোর্ট টিকেট পরিচালনা করুন' : 'Manage customer support tickets'}
                </p>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
                {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    {ticketsLoading ? (
                      <>
                        <Skeleton className="h-7 w-12 mb-1" />
                        <Skeleton className="h-4 w-10" />
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">{openCount}</p>
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ওপেন' : 'Open'}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-warning/5 border-warning/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    {ticketsLoading ? (
                      <>
                        <Skeleton className="h-7 w-12 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">{pendingCount}</p>
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'পেন্ডিং' : 'Pending'}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    {ticketsLoading ? (
                      <>
                        <Skeleton className="h-7 w-12 mb-1" />
                        <Skeleton className="h-4 w-14" />
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">{resolvedCount}</p>
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'সমাধান' : 'Resolved'}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    {ticketsLoading ? (
                      <>
                        <Skeleton className="h-7 w-12 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold">{urgentCount}</p>
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'জরুরি' : 'Urgent'}</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'bn' ? 'টিকেট নম্বর, বিষয়...' : 'Ticket number, subject...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'bn' ? 'সব স্ট্যাটাস' : 'All Status'}</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'bn' ? 'সব অগ্রাধিকার' : 'All Priority'}</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {ticketsLoading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="p-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-6 w-20" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : filteredTickets.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'bn' ? 'কোন টিকেট পাওয়া যায়নি' : 'No tickets found'}</p>
                  </div>
                ) : (
                  filteredTickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm text-muted-foreground font-mono">{ticket.ticket_number}</span>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <h3 className="font-semibold truncate">{ticket.subject}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{ticket.category}</span>
                            <span>{new Date(ticket.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'open')}>
                              Mark as Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'pending')}>
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'resolved')}>
                              Mark as Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, 'closed')}>
                              Mark as Closed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

      {/* Ticket Detail Dialog with Live Chat */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0" aria-describedby="ticket-chat-description">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-muted-foreground text-sm">{selectedTicket?.ticket_number}</span>
                  {selectedTicket && getStatusBadge(selectedTicket.status)}
                  {selectedTicket && getPriorityBadge(selectedTicket.priority)}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {/* Connection Status */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs",
                        isConnected ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                      )}>
                        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                        <span className="hidden sm:inline">{isConnected ? 'লাইভ' : 'অফলাইন'}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isConnected ? 'রিয়েল-টাইম সংযুক্ত' : 'সংযোগ বিচ্ছিন্ন'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <p id="ticket-chat-description" className="text-base font-semibold mt-2">{selectedTicket?.subject}</p>
              <p className="text-sm text-muted-foreground">
                {selectedTicket?.category} • {selectedTicket && formatDistanceToNow(new Date(selectedTicket.created_at), { addSuffix: true, locale: bn })}
              </p>
            </DialogHeader>

            <div className="flex gap-2 mt-3">
              <Select 
                value={selectedTicket?.status} 
                onValueChange={(value) => selectedTicket && handleUpdateStatus(selectedTicket.id, value)}
              >
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-6 py-4 max-h-[400px]" ref={scrollAreaRef}>
            {messagesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className={cn("flex gap-3", i % 2 === 0 && "flex-row-reverse")}>
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <Skeleton className="h-24 flex-1 max-w-[70%] rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : messages?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">কোন মেসেজ নেই</p>
                <p className="text-sm text-muted-foreground/70 mt-1">প্রথম রিপ্লাই পাঠান</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages?.map((msg, index) => {
                  const isStaff = msg.is_staff_reply;
                  const showDate = index === 0 || 
                    new Date(messages[index - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
                  
                  return (
                    <React.Fragment key={msg.id}>
                      {showDate && (
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                            {new Date(msg.created_at).toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long' })}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}
                      <div className={cn(
                        'flex gap-3 group animate-in fade-in-0 slide-in-from-bottom-2 duration-300',
                        isStaff && 'flex-row-reverse'
                      )}>
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm',
                          isStaff 
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                            : 'bg-gradient-to-br from-primary to-primary/80'
                        )}>
                          {isStaff ? (
                            <Headphones className="h-4 w-4 text-white" />
                          ) : (
                            <User className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className={cn(
                          'max-w-[70%] rounded-2xl p-4 shadow-sm transition-all duration-200',
                          isStaff 
                            ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-tr-sm border border-emerald-500/20' 
                            : 'bg-muted rounded-tl-sm border border-border'
                        )}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium">
                              {isStaff ? 'সাপোর্ট টিম' : 'গ্রাহক'}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                          
                          {/* Attachments with Image Preview */}
                          {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <ImagePreview 
                                attachments={msg.attachments as any[]}
                              />
                            </div>
                          )}
                          
                          <p className="text-[10px] mt-2 text-muted-foreground/70 flex items-center gap-1">
                            {new Date(msg.created_at).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                            {isStaff && <CheckCircle className="h-2.5 w-2.5 text-emerald-500" />}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 animate-in fade-in-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Reply Section */}
          {selectedTicket?.status !== 'closed' ? (
            <div className="px-6 py-4 border-t bg-muted/30">
              {/* Upload Progress */}
              {isUploading && (
                <div className="mb-3 bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      {language === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...'}
                    </span>
                    <span className="text-primary font-medium">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1.5" />
                </div>
              )}

              {/* Pending Files Preview */}
              {pendingFiles.length > 0 && !isUploading && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {pendingFiles.map((item, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "relative group rounded-lg overflow-hidden",
                        item.preview ? "w-16 h-16" : "flex items-center gap-2 bg-muted px-3 py-2"
                      )}
                    >
                      {item.preview ? (
                        <>
                          <img
                            src={item.preview}
                            alt={item.file.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removePendingFile(index)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </>
                      ) : (
                        <>
                          <File className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs truncate max-w-[100px]">{item.file.name}</span>
                          <button onClick={() => removePendingFile(index)}>
                            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                    placeholder={language === 'bn' ? 'রিপ্লাই লিখুন... (Enter চাপুন পাঠাতে)' : 'Type your reply... (Press Enter to send)'}
                    className="min-h-[60px] max-h-[120px] pr-24 resize-none"
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    {/* Canned Responses */}
                    <CannedResponses 
                      onSelect={handleCannedResponseSelect}
                      language={language as 'en' | 'bn'}
                    />
                    
                    {/* File Upload */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                      onChange={handleFileSelect}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={pendingFiles.length >= 5}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {pendingFiles.length >= 5 
                          ? (language === 'bn' ? 'সর্বোচ্চ ৫টি ফাইল' : 'Max 5 files')
                          : (language === 'bn' ? 'ফাইল সংযুক্ত করুন' : 'Attach files')
                        }
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <Button 
                  onClick={handleSendReply} 
                  size="icon"
                  className="h-[60px] w-12 shrink-0"
                  disabled={adminReplyMutation.isPending || isUploading || !replyMessage.trim()}
                >
                  {adminReplyMutation.isPending || isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Shift+Enter নতুন লাইনের জন্য • Enter পাঠাতে
              </p>
            </div>
          ) : (
            <div className="px-6 py-4 border-t bg-muted/30 text-center">
              <p className="text-sm text-muted-foreground">এই টিকেট বন্ধ করা হয়েছে</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => selectedTicket && handleUpdateStatus(selectedTicket.id, 'open')}
              >
                পুনরায় খুলুন
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default TicketsManagement;
