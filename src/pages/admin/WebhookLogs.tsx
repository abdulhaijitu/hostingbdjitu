import React, { useState } from 'react';
import { 
  Webhook, Search, Filter, Eye, ArrowLeft, 
  CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';

interface WebhookLog {
  id: string;
  provider: string;
  event_type: string | null;
  status: string;
  payload: any;
  error_message: string | null;
  invoice_id: string | null;
  processed_at: string | null;
  created_at: string;
}

const WebhookLogs: React.FC = () => {
  const { language } = useLanguage();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['webhook-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as WebhookLog[];
    },
  });

  const filteredLogs = logs?.filter(log => {
    const matchesSearch = 
      log.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.event_type && log.event_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.invoice_id && log.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
      received: { 
        color: 'bg-primary/10 text-primary border-primary/20', 
        label: language === 'bn' ? 'রিসিভড' : 'Received',
        icon: <Clock className="h-3 w-3" />
      },
      processed: { 
        color: 'bg-success/10 text-success border-success/20', 
        label: language === 'bn' ? 'প্রসেসড' : 'Processed',
        icon: <CheckCircle className="h-3 w-3" />
      },
      failed: { 
        color: 'bg-destructive/10 text-destructive border-destructive/20', 
        label: language === 'bn' ? 'ব্যর্থ' : 'Failed',
        icon: <XCircle className="h-3 w-3" />
      },
      error: { 
        color: 'bg-destructive/10 text-destructive border-destructive/20', 
        label: language === 'bn' ? 'ত্রুটি' : 'Error',
        icon: <AlertTriangle className="h-3 w-3" />
      },
    };
    const config = statusConfig[status] || statusConfig.received;
    return (
      <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Stats
  const totalLogs = logs?.length || 0;
  const processedLogs = logs?.filter(l => l.status === 'processed').length || 0;
  const failedLogs = logs?.filter(l => l.status === 'failed' || l.status === 'error').length || 0;
  const recentLogs = logs?.filter(l => {
    const logDate = new Date(l.created_at);
    const now = new Date();
    return (now.getTime() - logDate.getTime()) < 24 * 60 * 60 * 1000; // Last 24 hours
  }).length || 0;

  return (
    <AdminLayout>
      <SEOHead 
        title={language === 'bn' ? 'ওয়েবহুক লগ' : 'Webhook Logs'}
        description="View webhook logs"
        canonicalUrl="/admin/webhooks"
      />
      
      <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <Button variant="ghost" size="sm" className="mb-2" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
              </Button>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <Webhook className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'ওয়েবহুক লগ' : 'Webhook Logs'}
              </h1>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Webhook className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalLogs}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'মোট লগ' : 'Total Logs'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{processedLogs}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'প্রসেসড' : 'Processed'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <XCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{failedLogs}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'ব্যর্থ' : 'Failed'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{recentLogs}</p>
                    <p className="text-xs text-muted-foreground">{language === 'bn' ? 'গত ২৪ ঘন্টা' : 'Last 24h'}</p>
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
                    placeholder={language === 'bn' ? 'ইভেন্ট বা ইনভয়েস আইডি খুঁজুন...' : 'Search event or invoice ID...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'bn' ? 'সব স্ট্যাটাস' : 'All Status'}</SelectItem>
                    <SelectItem value="received">{language === 'bn' ? 'রিসিভড' : 'Received'}</SelectItem>
                    <SelectItem value="processed">{language === 'bn' ? 'প্রসেসড' : 'Processed'}</SelectItem>
                    <SelectItem value="failed">{language === 'bn' ? 'ব্যর্থ' : 'Failed'}</SelectItem>
                    <SelectItem value="error">{language === 'bn' ? 'ত্রুটি' : 'Error'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'ওয়েবহুক লগ তালিকা' : 'Webhook Logs List'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? `${filteredLogs?.length || 0}টি লগ পাওয়া গেছে` : `${filteredLogs?.length || 0} logs found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredLogs && filteredLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'প্রোভাইডার' : 'Provider'}</TableHead>
                        <TableHead>{language === 'bn' ? 'ইভেন্ট টাইপ' : 'Event Type'}</TableHead>
                        <TableHead>{language === 'bn' ? 'ইনভয়েস আইডি' : 'Invoice ID'}</TableHead>
                        <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                        <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                        <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.map((log) => (
                        <TableRow key={log.id} className={log.error_message ? 'bg-destructive/5' : ''}>
                          <TableCell className="font-medium capitalize">{log.provider}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.event_type || 'N/A'}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.invoice_id || 'N/A'}
                          </TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm:ss')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => { setSelectedLog(log); setShowDetails(true); }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {language === 'bn' ? 'বিস্তারিত' : 'Details'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'কোন ওয়েবহুক লগ পাওয়া যায়নি' : 'No webhook logs found'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Log Details Dialog */}
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{language === 'bn' ? 'ওয়েবহুক লগ বিস্তারিত' : 'Webhook Log Details'}</DialogTitle>
                <DialogDescription>
                  {selectedLog?.provider} - {selectedLog?.event_type || 'N/A'}
                </DialogDescription>
              </DialogHeader>
              {selectedLog && (
                <ScrollArea className="max-h-[60vh]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'প্রোভাইডার' : 'Provider'}</p>
                        <p className="font-medium capitalize">{selectedLog.provider}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ইভেন্ট টাইপ' : 'Event Type'}</p>
                        <p className="font-mono font-medium">{selectedLog.event_type || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</p>
                        {getStatusBadge(selectedLog.status)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ইনভয়েস আইডি' : 'Invoice ID'}</p>
                        <p className="font-mono font-medium">{selectedLog.invoice_id || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'রিসিভ সময়' : 'Received At'}</p>
                        <p className="font-medium">{format(new Date(selectedLog.created_at), 'dd MMM yyyy, HH:mm:ss')}</p>
                      </div>
                      {selectedLog.processed_at && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">{language === 'bn' ? 'প্রসেস সময়' : 'Processed At'}</p>
                          <p className="font-medium">{format(new Date(selectedLog.processed_at), 'dd MMM yyyy, HH:mm:ss')}</p>
                        </div>
                      )}
                    </div>

                    {selectedLog.error_message && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ত্রুটি বার্তা' : 'Error Message'}</p>
                        <div className="bg-destructive/10 text-destructive p-3 rounded-lg">
                          <p className="text-sm font-mono">{selectedLog.error_message}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{language === 'bn' ? 'পেলোড' : 'Payload'}</p>
                      <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                        {JSON.stringify(selectedLog.payload, null, 2)}
                      </pre>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default WebhookLogs;
