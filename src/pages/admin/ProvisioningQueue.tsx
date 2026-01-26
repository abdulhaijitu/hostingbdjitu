import React, { useState } from 'react';
import { 
  ListTodo, RefreshCw, RotateCcw, Clock, CheckCircle, 
  XCircle, Loader2, AlertTriangle, Server, Eye
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import SEOHead from '@/components/common/SEOHead';
import { Skeleton } from '@/components/ui/skeleton';
import { useProvisioningQueue, useProvisionHosting } from '@/hooks/useWHMAdmin';
import { format } from 'date-fns';

const ProvisioningQueue: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { data: queue, isLoading, refetch } = useProvisioningQueue();
  const provisionHosting = useProvisionHosting();
  
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = async (item: any) => {
    setRetrying(item.id);
    try {
      await provisionHosting.mutateAsync(item.order_id);
      toast({
        title: language === 'bn' ? 'রিট্রাই সফল' : 'Retry Successful',
        description: language === 'bn' ? 'প্রভিশনিং আবার শুরু হয়েছে' : 'Provisioning has been restarted',
      });
      refetch();
    } catch (error: any) {
      toast({
        title: language === 'bn' ? 'রিট্রাই ব্যর্থ' : 'Retry Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setRetrying(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" /> {language === 'bn' ? 'সম্পন্ন' : 'Completed'}</Badge>;
      case 'processing':
        return <Badge className="bg-primary text-primary-foreground"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> {language === 'bn' ? 'প্রক্রিয়াধীন' : 'Processing'}</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> {language === 'bn' ? 'ব্যর্থ' : 'Failed'}</Badge>;
      case 'retry':
        return <Badge className="bg-warning text-warning-foreground"><RotateCcw className="h-3 w-3 mr-1" /> {language === 'bn' ? 'রিট্রাই' : 'Retry'}</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> {language === 'bn' ? 'পেন্ডিং' : 'Pending'}</Badge>;
    }
  };

  const pendingCount = queue?.filter(q => q.status === 'pending').length || 0;
  const failedCount = queue?.filter(q => q.status === 'failed').length || 0;
  const completedCount = queue?.filter(q => q.status === 'completed').length || 0;

  return (
    <AdminLayout>
      <SEOHead 
        title={language === 'bn' ? 'প্রভিশনিং কিউ' : 'Provisioning Queue'}
        description="Manage hosting provisioning queue"
        canonicalUrl="/admin/provisioning"
      />
      
      <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <ListTodo className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'প্রভিশনিং কিউ' : 'Provisioning Queue'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'হোস্টিং অ্যাকাউন্ট প্রভিশনিং পরিচালনা করুন' : 'Manage hosting account provisioning'}
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <ListTodo className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'মোট কিউ' : 'Total Queue'}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      <p className="text-3xl font-bold">{queue?.length || 0}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-warning/10">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'পেন্ডিং' : 'Pending'}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      <p className="text-3xl font-bold">{pendingCount}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-destructive/10">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'ব্যর্থ' : 'Failed'}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      <p className="text-3xl font-bold">{failedCount}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
                    </p>
                    {isLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      <p className="text-3xl font-bold">{completedCount}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Failed Queue Alert */}
          {failedCount > 0 && (
            <Card className="mb-6 border-destructive/50 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <p className="text-sm">
                    {language === 'bn' 
                      ? `${failedCount}টি প্রভিশনিং ব্যর্থ হয়েছে। রিট্রাই করুন অথবা সমস্যা সমাধান করুন।`
                      : `${failedCount} provisioning tasks have failed. Retry or resolve the issues.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Queue Table */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'প্রভিশনিং তালিকা' : 'Provisioning List'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? 'সকল প্রভিশনিং টাস্ক' : 'All provisioning tasks'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : queue && queue.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'bn' ? 'অর্ডার' : 'Order'}</TableHead>
                      <TableHead>{language === 'bn' ? 'সার্ভার' : 'Server'}</TableHead>
                      <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                      <TableHead>{language === 'bn' ? 'প্রচেষ্টা' : 'Attempts'}</TableHead>
                      <TableHead>{language === 'bn' ? 'শিডিউল' : 'Scheduled'}</TableHead>
                      <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queue.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.orders?.order_number || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.orders?.item_name || 'Unknown'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.hosting_servers ? (
                            <div className="flex items-center gap-2">
                              <Server className="h-4 w-4 text-muted-foreground" />
                              <span>{item.hosting_servers.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              {language === 'bn' ? 'নির্বাচিত নয়' : 'Not selected'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.attempts} / {item.max_attempts}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(item.scheduled_at), 'PP p')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDetailsDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {(item.status === 'failed' || item.status === 'retry') && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRetry(item)}
                                disabled={retrying === item.id}
                              >
                                {retrying === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RotateCcw className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {language === 'bn' ? 'কোন প্রভিশনিং টাস্ক নেই' : 'No provisioning tasks found'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'প্রভিশনিং বিবরণ' : 'Provisioning Details'}</DialogTitle>
            <DialogDescription>
              {selectedItem?.orders?.order_number}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? 'অর্ডার' : 'Order'}</p>
                  <p className="font-medium">{selectedItem.orders?.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? 'প্ল্যান' : 'Plan'}</p>
                  <p className="font-medium">{selectedItem.orders?.item_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? 'ডোমেইন' : 'Domain'}</p>
                  <p className="font-medium">{selectedItem.orders?.domain_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</p>
                  {getStatusBadge(selectedItem.status)}
                </div>
              </div>
              
              {selectedItem.hosting_servers && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">{language === 'bn' ? 'সার্ভার তথ্য' : 'Server Info'}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">{language === 'bn' ? 'নাম:' : 'Name:'}</span> {selectedItem.hosting_servers.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">{language === 'bn' ? 'হোস্ট:' : 'Host:'}</span> {selectedItem.hosting_servers.hostname}
                    </div>
                  </div>
                </div>
              )}

              {selectedItem.last_error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm font-medium text-destructive mb-1">
                    {language === 'bn' ? 'শেষ ত্রুটি' : 'Last Error'}
                  </p>
                  <p className="text-sm text-destructive/80">{selectedItem.last_error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{language === 'bn' ? 'শিডিউল' : 'Scheduled'}</p>
                  <p>{format(new Date(selectedItem.scheduled_at), 'PPpp')}</p>
                </div>
                {selectedItem.started_at && (
                  <div>
                    <p className="text-muted-foreground">{language === 'bn' ? 'শুরু' : 'Started'}</p>
                    <p>{format(new Date(selectedItem.started_at), 'PPpp')}</p>
                  </div>
                )}
                {selectedItem.completed_at && (
                  <div>
                    <p className="text-muted-foreground">{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</p>
                    <p>{format(new Date(selectedItem.completed_at), 'PPpp')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ProvisioningQueue;
