import React, { useState } from 'react';
import { MessageSquare, Plus, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const mockTickets = [
  { id: 1, subject: 'Website not loading', status: 'open', date: '2024-01-25', replies: 3 },
  { id: 2, subject: 'Email configuration help', status: 'closed', date: '2024-01-20', replies: 5 },
];

const SupportPage: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <DashboardLayout title={language === 'bn' ? 'সাপোর্ট টিকেট' : 'Support Tickets'}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'সাপোর্ট টিকেট' : 'Support Tickets'}
        </h1>
        <Button variant="hero" onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'bn' ? 'নতুন টিকেট' : 'New Ticket'}
        </Button>
      </div>

      <div className="space-y-4">
        {mockTickets.map(ticket => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">{ticket.subject}</p>
                    <p className="text-sm text-muted-foreground">#{ticket.id} - {ticket.date} - {ticket.replies} replies</p>
                  </div>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'নতুন টিকেট তৈরি করুন' : 'Create New Ticket'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Subject</Label>
              <Input placeholder="Brief description of your issue" className="mt-1" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea placeholder="Describe your issue in detail..." className="mt-1" rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: 'Ticket Created' }); setShowDialog(false); }}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportPage;
