import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, ArrowLeft, Search, Clock, CheckCircle, 
  AlertCircle, User, Send, Paperclip, MoreHorizontal, 
  RefreshCw, Loader2, Headphones
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/common/SEOHead';
import { cn } from '@/lib/utils';
import { useSupportTickets, useTicketMessages, useUpdateTicketStatus, SupportTicket, TicketMessage } from '@/hooks/useSupportTickets';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const TicketsManagement: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: tickets, isLoading: ticketsLoading, refetch } = useSupportTickets();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const { data: messages, isLoading: messagesLoading } = useTicketMessages(selectedTicket?.id || null);
  const updateStatusMutation = useUpdateTicketStatus();

  // Admin reply mutation
  const adminReplyMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticketId,
          user_id: user!.id,
          message: message,
          is_staff_reply: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', variables.ticketId] });
      setReplyMessage('');
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

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    adminReplyMutation.mutate({ ticketId: selectedTicket.id, message: replyMessage });
  };

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    updateStatusMutation.mutate({ ticketId, status: newStatus });
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus as SupportTicket['status'] } : null);
    }
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

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-muted-foreground">{selectedTicket?.ticket_number}</span>
              {selectedTicket && getStatusBadge(selectedTicket.status)}
              {selectedTicket && getPriorityBadge(selectedTicket.priority)}
            </DialogTitle>
            <p className="text-lg font-semibold">{selectedTicket?.subject}</p>
            <p className="text-sm text-muted-foreground">
              {selectedTicket?.category} • {selectedTicket && new Date(selectedTicket.created_at).toLocaleString()}
            </p>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <Select 
              value={selectedTicket?.status} 
              onValueChange={(value) => selectedTicket && handleUpdateStatus(selectedTicket.id, value)}
            >
              <SelectTrigger className="w-32">
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

          <ScrollArea className="flex-1 pr-4 max-h-[400px]">
            {messagesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-20 flex-1 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3',
                      msg.is_staff_reply && 'flex-row-reverse'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      msg.is_staff_reply ? 'bg-success/10' : 'bg-primary/10'
                    )}>
                      {msg.is_staff_reply ? (
                        <Headphones className="h-4 w-4 text-success" />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className={cn(
                      'max-w-[70%] rounded-2xl p-4',
                      msg.is_staff_reply 
                        ? 'bg-success/10 rounded-tr-sm' 
                        : 'bg-muted rounded-tl-sm'
                    )}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs mt-2 text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Reply Section */}
          {selectedTicket?.status !== 'closed' && (
            <div className="pt-4 border-t mt-4">
              <div className="flex gap-2">
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={language === 'bn' ? 'রিপ্লাই লিখুন...' : 'Type your reply...'}
                  className="flex-1 min-h-[80px]"
                />
              </div>
              <div className="flex justify-end mt-3">
                <Button 
                  onClick={handleSendReply} 
                  className="gap-2"
                  disabled={adminReplyMutation.isPending || !replyMessage.trim()}
                >
                  {adminReplyMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {language === 'bn' ? 'রিপ্লাই পাঠান' : 'Send Reply'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default TicketsManagement;
