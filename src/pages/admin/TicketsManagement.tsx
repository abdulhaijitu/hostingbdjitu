import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, ArrowLeft, Search, Filter, Clock, CheckCircle, 
  AlertCircle, User, Send, Paperclip, MoreHorizontal, 
  Eye, Reply, X, RefreshCw
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/common/SEOHead';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  sender: 'user' | 'admin';
  senderName: string;
  content: string;
  timestamp: Date;
}

interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  messages: Message[];
}

const mockTickets: Ticket[] = [
  {
    id: 1001,
    subject: 'Website showing 500 error after update',
    status: 'open',
    priority: 'high',
    department: 'Technical Support',
    createdAt: '2024-01-25T10:00:00',
    updatedAt: '2024-01-25T14:30:00',
    customerName: 'Rahman Ahmed',
    customerEmail: 'rahman@example.com',
    messages: [
      { id: 1, sender: 'user', senderName: 'Rahman Ahmed', content: 'My website is showing a 500 error after the latest WordPress update. Please help urgently!', timestamp: new Date('2024-01-25T10:00:00') },
      { id: 2, sender: 'admin', senderName: 'Support Team', content: 'Hello Rahman! I understand you\'re experiencing issues. Can you please provide your domain name?', timestamp: new Date('2024-01-25T10:05:00') },
      { id: 3, sender: 'user', senderName: 'Rahman Ahmed', content: 'Yes, it\'s mywebsite.com. I tried clearing cache but it didn\'t work.', timestamp: new Date('2024-01-25T10:10:00') },
    ]
  },
  {
    id: 1002,
    subject: 'Cannot configure email on mobile',
    status: 'pending',
    priority: 'medium',
    department: 'Email Support',
    createdAt: '2024-01-24T15:00:00',
    updatedAt: '2024-01-25T09:00:00',
    customerName: 'Fatima Begum',
    customerEmail: 'fatima@example.com',
    messages: [
      { id: 1, sender: 'user', senderName: 'Fatima Begum', content: 'I need help setting up my email on my iPhone. The settings are not working.', timestamp: new Date('2024-01-24T15:00:00') },
    ]
  },
  {
    id: 1003,
    subject: 'Billing inquiry for hosting renewal',
    status: 'resolved',
    priority: 'low',
    department: 'Billing',
    createdAt: '2024-01-23T11:00:00',
    updatedAt: '2024-01-24T16:00:00',
    customerName: 'Karim Hossain',
    customerEmail: 'karim@example.com',
    messages: [
      { id: 1, sender: 'user', senderName: 'Karim Hossain', content: 'I was charged twice for my hosting renewal. Please check.', timestamp: new Date('2024-01-23T11:00:00') },
      { id: 2, sender: 'admin', senderName: 'Billing Team', content: 'We apologize for the inconvenience. We have processed a refund for the duplicate charge.', timestamp: new Date('2024-01-24T16:00:00') },
    ]
  },
  {
    id: 1004,
    subject: 'SSL certificate not showing',
    status: 'open',
    priority: 'urgent',
    department: 'Technical Support',
    createdAt: '2024-01-25T08:00:00',
    updatedAt: '2024-01-25T08:00:00',
    customerName: 'Nasir Uddin',
    customerEmail: 'nasir@example.com',
    messages: [
      { id: 1, sender: 'user', senderName: 'Nasir Uddin', content: 'My SSL certificate expired and my website is showing as not secure. This is urgent for my e-commerce store!', timestamp: new Date('2024-01-25T08:00:00') },
    ]
  },
];

const TicketsManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toString().includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'admin',
      senderName: 'Support Team',
      content: replyMessage,
      timestamp: new Date(),
    };

    setTickets(prev => prev.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, messages: [...t.messages, newMessage], updatedAt: new Date().toISOString() }
        : t
    ));

    setSelectedTicket(prev => prev 
      ? { ...prev, messages: [...prev.messages, newMessage] } 
      : null
    );

    setReplyMessage('');

    toast({
      title: language === 'bn' ? 'রিপ্লাই পাঠানো হয়েছে' : 'Reply Sent',
      description: language === 'bn' ? 'গ্রাহককে ইমেইল নোটিফিকেশন পাঠানো হয়েছে' : 'Customer has been notified via email',
    });
  };

  const handleUpdateStatus = (ticketId: number, newStatus: string) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: newStatus as Ticket['status'] } : t
    ));

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus as Ticket['status'] } : null);
    }

    toast({
      title: language === 'bn' ? 'স্ট্যাটাস আপডেট হয়েছে' : 'Status Updated',
    });
  };

  const handleUpdatePriority = (ticketId: number, newPriority: string) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, priority: newPriority as Ticket['priority'] } : t
    ));

    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, priority: newPriority as Ticket['priority'] } : null);
    }

    toast({
      title: language === 'bn' ? 'অগ্রাধিকার আপডেট হয়েছে' : 'Priority Updated',
    });
  };

  // Stats
  const openCount = tickets.filter(t => t.status === 'open').length;
  const pendingCount = tickets.filter(t => t.status === 'pending').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const urgentCount = tickets.filter(t => t.priority === 'urgent' && t.status !== 'closed').length;

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'সাপোর্ট টিকেট ম্যানেজমেন্ট' : 'Support Tickets Management'}
        description="Manage customer support tickets"
        canonicalUrl="/admin/tickets"
        noIndex
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
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
              <Button variant="outline" className="gap-2">
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
                    <p className="text-2xl font-bold">{openCount}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'ওপেন' : 'Open'}
                    </p>
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
                    <p className="text-2xl font-bold">{pendingCount}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
                    </p>
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
                    <p className="text-2xl font-bold">{resolvedCount}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'সমাধান' : 'Resolved'}
                    </p>
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
                    <p className="text-2xl font-bold">{urgentCount}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'জরুরি' : 'Urgent'}
                    </p>
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
                    placeholder={language === 'bn' ? 'টিকেট আইডি, বিষয়, গ্রাহকের নাম...' : 'Ticket ID, subject, customer name...'}
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
                {filteredTickets.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    {language === 'bn' ? 'কোন টিকেট পাওয়া যায়নি' : 'No tickets found'}
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
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-muted-foreground">#{ticket.id}</span>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <h3 className="font-semibold truncate">{ticket.subject}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {ticket.customerName}
                            </span>
                            <span>{ticket.department}</span>
                            <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {ticket.messages.length}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedTicket(ticket); }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ticket.id, 'resolved'); }}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ticket.id, 'closed'); }}>
                                <X className="h-4 w-4 mr-2" />
                                Close Ticket
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ticket Detail Dialog */}
          <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
              <DialogHeader className="p-6 pb-4 border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      #{selectedTicket?.id} - {selectedTicket?.subject}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {selectedTicket?.customerName} ({selectedTicket?.customerEmail})
                      </span>
                    </DialogDescription>
                  </div>
                </div>
                
                {/* Status & Priority Controls */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Select 
                      value={selectedTicket?.status} 
                      onValueChange={(value) => selectedTicket && handleUpdateStatus(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Priority:</span>
                    <Select 
                      value={selectedTicket?.priority} 
                      onValueChange={(value) => selectedTicket && handleUpdatePriority(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {selectedTicket?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex gap-3',
                        msg.sender === 'admin' && 'flex-row-reverse'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        msg.sender === 'admin' ? 'bg-primary/10' : 'bg-muted'
                      )}>
                        <User className={cn(
                          'h-5 w-5',
                          msg.sender === 'admin' ? 'text-primary' : 'text-muted-foreground'
                        )} />
                      </div>
                      <div className={cn(
                        'max-w-[70%] rounded-2xl p-4',
                        msg.sender === 'admin' 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted rounded-tl-sm'
                      )}>
                        <p className={cn(
                          'text-xs font-medium mb-1',
                          msg.sender === 'admin' ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        )}>
                          {msg.senderName}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn(
                          'text-xs mt-2',
                          msg.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {msg.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Box */}
              {selectedTicket?.status !== 'closed' && (
                <div className="p-4 border-t bg-muted/30">
                  <div className="flex gap-2">
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder={language === 'bn' ? 'আপনার রিপ্লাই লিখুন...' : 'Type your reply...'}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Paperclip className="h-4 w-4" />
                      {language === 'bn' ? 'ফাইল যোগ করুন' : 'Attach File'}
                    </Button>
                    <Button onClick={handleSendReply} className="gap-2">
                      <Send className="h-4 w-4" />
                      {language === 'bn' ? 'রিপ্লাই পাঠান' : 'Send Reply'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
};

export default TicketsManagement;
