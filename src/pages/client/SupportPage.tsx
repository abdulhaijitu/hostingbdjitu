import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Plus, Clock, CheckCircle, Send, Paperclip, X, 
  File, MessageCircle, Headphones, Bot, User as UserIcon,
  AlertCircle, Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useSupportTickets, 
  useTicketMessages, 
  useCreateTicket, 
  useCreateMessage,
  SupportTicket,
  TicketMessage 
} from '@/hooks/useSupportTickets';
import { useTicketAttachments, UploadedAttachment } from '@/hooks/useTicketAttachments';
import { Progress } from '@/components/ui/progress';

const SupportPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // Fetch tickets from database
  const { data: tickets, isLoading: ticketsLoading, isError: ticketsError, refetch: refetchTickets } = useSupportTickets();
  const { data: messages, isLoading: messagesLoading, isError: messagesError } = useTicketMessages(selectedTicket?.id || null);
  const createTicketMutation = useCreateTicket();
  const createMessageMutation = useCreateMessage();
  const { uploadFiles, isUploading, uploadProgress } = useTicketAttachments();
  
  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<{ id: number; sender: string; content: string; timestamp: Date }[]>([
    { 
      id: 1, 
      sender: 'bot', 
      content: language === 'bn' 
        ? 'স্বাগতম! আমি আপনাকে কিভাবে সাহায্য করতে পারি?' 
        : 'Welcome! How can I help you today?', 
      timestamp: new Date() 
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Ticket Reply State
  const [replyMessage, setReplyMessage] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
  const replyFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isReply = false) => {
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
    });

    if (isReply) {
      setReplyAttachments(prev => [...prev, ...validFiles]);
    } else {
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index: number, isReply = false) => {
    if (isReply) {
      setReplyAttachments(prev => prev.filter((_, i) => i !== index));
    } else {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.message || !newTicket.category) {
      toast({
        title: language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete Information',
        description: language === 'bn' ? 'সব ফিল্ড পূরণ করুন' : 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const ticket = await createTicketMutation.mutateAsync({
        subject: newTicket.subject,
        description: newTicket.message,
        priority: newTicket.priority,
        category: newTicket.category,
      });

      // Upload attachments if any
      let uploadedAttachments: UploadedAttachment[] = [];
      if (attachments.length > 0) {
        uploadedAttachments = await uploadFiles(attachments, ticket.id);
      }

      // Add initial message with attachments
      await createMessageMutation.mutateAsync({
        ticket_id: ticket.id,
        message: newTicket.message,
        attachments: uploadedAttachments,
      });

      toast({
        title: language === 'bn' ? 'টিকেট তৈরি হয়েছে' : 'Ticket Created',
        description: language === 'bn' 
          ? 'আমাদের টিম শীঘ্রই যোগাযোগ করবে' 
          : 'Our team will respond shortly',
      });
      setShowNewTicketDialog(false);
      setNewTicket({ subject: '', category: '', priority: 'medium', message: '' });
      setAttachments([]);
    } catch (error) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'টিকেট তৈরি করতে সমস্যা হয়েছে' : 'Failed to create ticket',
        variant: 'destructive',
      });
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        id: chatMessages.length + 2,
        sender: 'bot',
        content: language === 'bn' 
          ? 'ধন্যবাদ আপনার মেসেজের জন্য। একজন সাপোর্ট এজেন্ট শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'
          : 'Thank you for your message. A support agent will connect with you shortly.',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      // Upload attachments if any
      let uploadedAttachments: UploadedAttachment[] = [];
      if (replyAttachments.length > 0) {
        uploadedAttachments = await uploadFiles(replyAttachments, selectedTicket.id);
      }

      await createMessageMutation.mutateAsync({
        ticket_id: selectedTicket.id,
        message: replyMessage,
        attachments: uploadedAttachments,
      });

      toast({
        title: language === 'bn' ? 'রিপ্লাই পাঠানো হয়েছে' : 'Reply Sent',
        description: language === 'bn' ? 'আপনার মেসেজ পাঠানো হয়েছে' : 'Your message has been sent',
      });
      setReplyMessage('');
      setReplyAttachments([]);
    } catch (error) {
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: language === 'bn' ? 'রিপ্লাই পাঠাতে সমস্যা হয়েছে' : 'Failed to send reply',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const openTickets = tickets?.filter(t => t.status === 'open' || t.status === 'pending').length || 0;
  const resolvedTickets = tickets?.filter(t => t.status === 'resolved' || t.status === 'closed').length || 0;

  return (
    <DashboardLayout title={language === 'bn' ? 'সাপোর্ট সেন্টার' : 'Support Center'}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display">
            {language === 'bn' ? 'সাপোর্ট সেন্টার' : 'Support Center'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'bn' ? 'আমরা ২৪/৭ আপনার সেবায়' : "We're here to help 24/7"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowLiveChat(true)} className="gap-2">
            <MessageCircle className="h-4 w-4" />
            {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
          </Button>
          <Button variant="hero" onClick={() => setShowNewTicketDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {language === 'bn' ? 'নতুন টিকেট' : 'New Ticket'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{tickets?.length || 0}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'মোট টিকেট' : 'Total Tickets'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{resolvedTickets}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'সমাধান হয়েছে' : 'Resolved'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{openTickets}</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'খোলা আছে' : 'Open'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List or Ticket View */}
      {selectedTicket ? (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mb-2 -ml-2"
                  onClick={() => setSelectedTicket(null)}
                >
                  ← {language === 'bn' ? 'ফিরে যান' : 'Back'}
                </Button>
                <CardTitle className="flex items-center gap-3 flex-wrap">
                  {selectedTicket.subject}
                  <StatusBadge status={selectedTicket.status} />
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  #{selectedTicket.ticket_number} • {selectedTicket.category} • {new Date(selectedTicket.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] p-6">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-20 flex-1 rounded-2xl" />
                    </div>
                  ))}
                </div>
              ) : messagesError ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'মেসেজ লোড করতে সমস্যা হয়েছে' : 'Failed to load messages'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages?.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-3',
                        !msg.is_staff_reply && 'flex-row-reverse'
                      )}
                    >
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        !msg.is_staff_reply ? 'bg-primary/10' : 'bg-success/10'
                      )}>
                        {!msg.is_staff_reply ? (
                          <UserIcon className="h-4 w-4 text-primary" />
                        ) : (
                          <Headphones className="h-4 w-4 text-success" />
                        )}
                      </div>
                      <div className={cn(
                        'max-w-[70%] rounded-2xl p-4',
                        !msg.is_staff_reply 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted rounded-tl-sm'
                      )}>
                        <p className="text-sm">{msg.message}</p>
                        {/* Display attachments */}
                        {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(msg.attachments as any[]).map((att: any, idx: number) => (
                              <a
                                key={idx}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "flex items-center gap-1.5 text-xs px-2 py-1 rounded",
                                  !msg.is_staff_reply 
                                    ? "bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30" 
                                    : "bg-background hover:bg-accent"
                                )}
                              >
                                <File className="h-3 w-3" />
                                {att.name}
                              </a>
                            ))}
                          </div>
                        )}
                        <p className={cn(
                          'text-xs mt-2',
                          !msg.is_staff_reply ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Reply Section */}
            {selectedTicket.status !== 'closed' && (
              <div className="p-4 border-t bg-muted/30">
                {/* Upload progress */}
                {isUploading && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {language === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...'}
                      </span>
                      <span className="text-primary">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {replyAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {replyAttachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 text-sm">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-[150px] truncate">{file.name}</span>
                        <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                        <button onClick={() => removeAttachment(index, true)}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={replyFileInputRef}
                    className="hidden"
                    multiple
                    onChange={(e) => handleFileSelect(e, true)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => replyFileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার রিপ্লাই লিখুন...' : 'Type your reply...'}
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                  />
                  <Button 
                    onClick={handleSendReply} 
                    className="gap-2"
                    disabled={createMessageMutation.isPending || isUploading}
                  >
                    {(createMessageMutation.isPending || isUploading) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {language === 'bn' ? 'পাঠান' : 'Send'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ticketsLoading ? (
            [1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : ticketsError ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="p-4 rounded-2xl bg-destructive/10 inline-block mb-4">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'bn' ? 'টিকেট লোড করতে সমস্যা' : 'Failed to Load Tickets'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'bn' ? 'দয়া করে আবার চেষ্টা করুন' : 'Please try again'}
                </p>
                <Button onClick={() => refetchTickets()}>
                  {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                </Button>
              </CardContent>
            </Card>
          ) : tickets && tickets.length > 0 ? (
            tickets.map(ticket => (
              <Card 
                key={ticket.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'p-3 rounded-xl',
                        ticket.status === 'open' ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <MessageSquare className={cn(
                          'h-5 w-5',
                          ticket.status === 'open' ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div>
                        <p className="font-semibold flex items-center gap-2 flex-wrap">
                          {ticket.subject}
                          <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                            {ticket.priority}
                          </Badge>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          #{ticket.ticket_number} • {ticket.category} • {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'bn' ? 'কোন টিকেট নেই' : 'No Tickets Yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {language === 'bn' 
                    ? 'সাহায্যের জন্য একটি নতুন টিকেট তৈরি করুন' 
                    : 'Create a new ticket to get help from our team'}
                </p>
                <Button onClick={() => setShowNewTicketDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {language === 'bn' ? 'নতুন টিকেট' : 'New Ticket'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'নতুন সাপোর্ট টিকেট' : 'New Support Ticket'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? 'আপনার সমস্যার বিবরণ দিন, আমরা সাহায্য করব' 
                : 'Describe your issue and our team will help you'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'বিষয়' : 'Subject'} *</Label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                placeholder={language === 'bn' ? 'টিকেটের বিষয় লিখুন' : 'Enter ticket subject'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'bn' ? 'বিভাগ' : 'Category'} *</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'bn' ? 'বিভাগ নির্বাচন করুন' : 'Select category'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">{language === 'bn' ? 'টেকনিক্যাল সাপোর্ট' : 'Technical Support'}</SelectItem>
                    <SelectItem value="billing">{language === 'bn' ? 'বিলিং' : 'Billing'}</SelectItem>
                    <SelectItem value="sales">{language === 'bn' ? 'সেলস' : 'Sales'}</SelectItem>
                    <SelectItem value="general">{language === 'bn' ? 'সাধারণ' : 'General'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === 'bn' ? 'প্রায়োরিটি' : 'Priority'}</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{language === 'bn' ? 'কম' : 'Low'}</SelectItem>
                    <SelectItem value="medium">{language === 'bn' ? 'মাঝারি' : 'Medium'}</SelectItem>
                    <SelectItem value="high">{language === 'bn' ? 'বেশি' : 'High'}</SelectItem>
                    <SelectItem value="urgent">{language === 'bn' ? 'জরুরি' : 'Urgent'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'bn' ? 'বিবরণ' : 'Description'} *</Label>
              <Textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                placeholder={language === 'bn' ? 'আপনার সমস্যার বিস্তারিত লিখুন...' : 'Describe your issue in detail...'}
                rows={5}
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'ফাইল সংযুক্ত করুন' : 'Attachments'}</Label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => handleFileSelect(e)}
              />
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
                {language === 'bn' ? 'ফাইল যোগ করুন' : 'Add Files'}
              </Button>
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
                      <File className="h-4 w-4 text-muted-foreground" />
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button onClick={() => removeAttachment(index)}>
                        <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleCreateTicket}
              disabled={createTicketMutation.isPending}
            >
              {createTicketMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {language === 'bn' ? 'টিকেট তৈরি করুন' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog open={showLiveChat} onOpenChange={setShowLiveChat}>
        <DialogContent className="sm:max-w-[450px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3',
                    msg.sender === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    msg.sender === 'user' ? 'bg-primary/10' : 'bg-success/10'
                  )}>
                    {msg.sender === 'user' ? (
                      <UserIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <Bot className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <div className={cn(
                    'max-w-[80%] rounded-2xl p-3',
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted rounded-tl-sm'
                  )}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-success" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={language === 'bn' ? 'মেসেজ লিখুন...' : 'Type a message...'}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
            />
            <Button onClick={handleSendChatMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportPage;
