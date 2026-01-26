import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Plus, Clock, CheckCircle, Send, Paperclip, X, 
  Image, File, MessageCircle, Headphones, Bot, User as UserIcon,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
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

interface Message {
  id: number;
  sender: 'user' | 'support' | 'bot';
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: string; size: string }[];
}

interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  date: string;
  replies: number;
  department: string;
  messages: Message[];
}

const mockTickets: Ticket[] = [
  { 
    id: 1, 
    subject: 'Website not loading', 
    status: 'open', 
    priority: 'high',
    date: '2024-01-25', 
    replies: 3,
    department: 'Technical Support',
    messages: [
      { id: 1, sender: 'user', content: 'My website is showing a 500 error. Please help!', timestamp: new Date('2024-01-25T10:00:00') },
      { id: 2, sender: 'support', content: 'Hello! I understand you\'re experiencing issues with your website. Can you please provide your domain name?', timestamp: new Date('2024-01-25T10:05:00') },
      { id: 3, sender: 'user', content: 'Yes, it\'s example.com', timestamp: new Date('2024-01-25T10:10:00') },
      { id: 4, sender: 'support', content: 'Thank you! I\'ve checked your server and found an issue with the PHP configuration. I\'m fixing it now.', timestamp: new Date('2024-01-25T10:15:00') },
    ]
  },
  { 
    id: 2, 
    subject: 'Email configuration help', 
    status: 'closed', 
    priority: 'medium',
    date: '2024-01-20', 
    replies: 5,
    department: 'Email Support',
    messages: [
      { id: 1, sender: 'user', content: 'I need help setting up my email on Outlook', timestamp: new Date('2024-01-20T14:00:00') },
      { id: 2, sender: 'support', content: 'Sure! I can help you with that. What version of Outlook are you using?', timestamp: new Date('2024-01-20T14:10:00') },
    ]
  },
];

const SupportPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTab, setActiveTab] = useState('tickets');
  
  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    subject: '',
    department: '',
    priority: 'medium',
    message: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
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

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message || !newTicket.department) {
      toast({
        title: language === 'bn' ? 'তথ্য অসম্পূর্ণ' : 'Incomplete Information',
        description: language === 'bn' ? 'সব ফিল্ড পূরণ করুন' : 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: language === 'bn' ? 'টিকেট তৈরি হয়েছে' : 'Ticket Created',
      description: language === 'bn' 
        ? 'আমাদের টিম শীঘ্রই যোগাযোগ করবে' 
        : 'Our team will respond shortly',
    });
    setShowNewTicketDialog(false);
    setNewTicket({ subject: '', department: '', priority: 'medium', message: '' });
    setAttachments([]);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: chatMessages.length + 1,
      sender: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: chatMessages.length + 2,
        sender: 'bot',
        content: language === 'bn' 
          ? 'ধন্যবাদ আপনার মেসেজের জন্য। একজন সাপোর্ট এজেন্ট শীঘ্রই আপনার সাথে যোগাযোগ করবেন। আপনি কি আরো কিছু জানাতে চান?'
          : 'Thank you for your message. A support agent will connect with you shortly. Is there anything else you\'d like to add?',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;

    toast({
      title: language === 'bn' ? 'রিপ্লাই পাঠানো হয়েছে' : 'Reply Sent',
      description: language === 'bn' ? 'আপনার মেসেজ পাঠানো হয়েছে' : 'Your message has been sent',
    });
    setReplyMessage('');
    setReplyAttachments([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
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
              <p className="text-2xl font-bold">2</p>
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
              <p className="text-2xl font-bold">1</p>
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
              <p className="text-2xl font-bold">~2h</p>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'গড় রেসপন্স' : 'Avg Response'}
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
                <CardTitle className="flex items-center gap-3">
                  {selectedTicket.subject}
                  <StatusBadge status={selectedTicket.status} />
                  <Badge className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  #{selectedTicket.id} • {selectedTicket.department} • {selectedTicket.date}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] p-6">
              <div className="space-y-4">
                {selectedTicket.messages.map((msg) => (
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
                        <Headphones className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <div className={cn(
                      'max-w-[70%] rounded-2xl p-4',
                      msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-muted rounded-tl-sm'
                    )}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={cn(
                        'text-xs mt-2',
                        msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Reply Section */}
            {selectedTicket.status !== 'closed' && (
              <div className="p-4 border-t bg-muted/30">
                {/* Attachments Preview */}
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
                  <Button onClick={handleSendReply} className="gap-2">
                    <Send className="h-4 w-4" />
                    {language === 'bn' ? 'পাঠান' : 'Send'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockTickets.map(ticket => (
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
                      <p className="font-semibold flex items-center gap-2">
                        {ticket.subject}
                        <Badge className={getPriorityColor(ticket.priority)} variant="secondary">
                          {ticket.priority}
                        </Badge>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        #{ticket.id} • {ticket.department} • {ticket.date} • {ticket.replies} {language === 'bn' ? 'রিপ্লাই' : 'replies'}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'নতুন টিকেট তৈরি করুন' : 'Create New Ticket'}</DialogTitle>
            <DialogDescription>
              {language === 'bn' 
                ? 'আপনার সমস্যা বিস্তারিত লিখুন, আমরা শীঘ্রই সাড়া দেব'
                : 'Describe your issue in detail and we\'ll respond shortly'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>{language === 'bn' ? 'বিষয়' : 'Subject'} *</Label>
              <Input 
                value={newTicket.subject}
                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                placeholder={language === 'bn' ? 'সমস্যার সংক্ষিপ্ত বিবরণ' : 'Brief description of your issue'} 
                className="mt-1" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'bn' ? 'বিভাগ' : 'Department'} *</Label>
                <Select 
                  value={newTicket.department}
                  onValueChange={(value) => setNewTicket(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={language === 'bn' ? 'নির্বাচন করুন' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">{language === 'bn' ? 'টেকনিক্যাল সাপোর্ট' : 'Technical Support'}</SelectItem>
                    <SelectItem value="billing">{language === 'bn' ? 'বিলিং' : 'Billing'}</SelectItem>
                    <SelectItem value="sales">{language === 'bn' ? 'সেলস' : 'Sales'}</SelectItem>
                    <SelectItem value="general">{language === 'bn' ? 'সাধারণ' : 'General'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'bn' ? 'অগ্রাধিকার' : 'Priority'}</Label>
                <Select 
                  value={newTicket.priority}
                  onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{language === 'bn' ? 'নিম্ন' : 'Low'}</SelectItem>
                    <SelectItem value="medium">{language === 'bn' ? 'মাঝারি' : 'Medium'}</SelectItem>
                    <SelectItem value="high">{language === 'bn' ? 'উচ্চ' : 'High'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{language === 'bn' ? 'বার্তা' : 'Message'} *</Label>
              <Textarea 
                value={newTicket.message}
                onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                placeholder={language === 'bn' ? 'আপনার সমস্যা বিস্তারিত লিখুন...' : 'Describe your issue in detail...'} 
                className="mt-1" 
                rows={5} 
              />
            </div>
            
            {/* File Attachments */}
            <div>
              <Label>{language === 'bn' ? 'ফাইল সংযুক্ত করুন' : 'Attach Files'}</Label>
              <div className="mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={(e) => handleFileSelect(e)}
                />
                <Button 
                  type="button"
                  variant="outline" 
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  {language === 'bn' ? 'ফাইল নির্বাচন করুন' : 'Choose Files'}
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'bn' ? 'সর্বোচ্চ ১০MB প্রতি ফাইল' : 'Max 10MB per file'}
                </p>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        {file.type.startsWith('image/') ? (
                          <Image className="h-4 w-4 text-primary" />
                        ) : (
                          <File className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                      </div>
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
            <Button onClick={handleCreateTicket}>
              {language === 'bn' ? 'টিকেট তৈরি করুন' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Live Chat Dialog */}
      <Dialog open={showLiveChat} onOpenChange={setShowLiveChat}>
        <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <DialogTitle className="flex items-center gap-2 text-primary-foreground">
              <div className="relative">
                <Headphones className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-primary" />
              </div>
              {language === 'bn' ? 'লাইভ চ্যাট সাপোর্ট' : 'Live Chat Support'}
            </DialogTitle>
            <p className="text-sm text-primary-foreground/80">
              {language === 'bn' ? 'সাধারণত ২ মিনিটে রেসপন্স' : 'Usually responds in 2 minutes'}
            </p>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2',
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
                    'max-w-[80%] rounded-2xl px-4 py-2',
                    msg.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted rounded-tl-sm'
                  )}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-success" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার মেসেজ লিখুন...' : 'Type your message...'}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <Button onClick={handleSendChatMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportPage;
