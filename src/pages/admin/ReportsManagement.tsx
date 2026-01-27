import React, { useState, lazy, Suspense } from 'react';
import { 
  FileText, 
  Download, 
  BarChart3,
  Calendar,
  TrendingUp,
  Mail,
  Clock,
  CheckCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Lazy load heavy components
const AdminReportGenerator = lazy(() => import('@/components/admin/reports/AdminReportGenerator'));

const ReportsManagement: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('generator');

  // Fetch email logs
  const { data: emailLogs, isLoading: emailLogsLoading } = useQuery({
    queryKey: ['admin-email-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch scheduled jobs
  const { data: scheduledJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['admin-scheduled-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      sent: 'default',
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-primary" />
            {language === 'bn' ? 'রিপোর্ট ও অটোমেশন' : 'Reports & Automation'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'bn' 
              ? 'পিডিএফ রিপোর্ট জেনারেট, ইমেইল লগ এবং শিডিউলড জব দেখুন' 
              : 'Generate PDF reports, view email logs and scheduled jobs'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="generator" className="gap-2">
              <FileText className="h-4 w-4" />
              {language === 'bn' ? 'রিপোর্ট জেনারেটর' : 'Report Generator'}
            </TabsTrigger>
            <TabsTrigger value="email-logs" className="gap-2">
              <Mail className="h-4 w-4" />
              {language === 'bn' ? 'ইমেইল লগ' : 'Email Logs'}
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2">
              <Clock className="h-4 w-4" />
              {language === 'bn' ? 'শিডিউলড জব' : 'Scheduled Jobs'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <AdminReportGenerator />
            </Suspense>
          </TabsContent>

          <TabsContent value="email-logs">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'ইমেইল লগ' : 'Email Logs'}</CardTitle>
                <CardDescription>
                  {language === 'bn' 
                    ? 'পাঠানো সকল ইমেইলের রেকর্ড' 
                    : 'Record of all sent emails'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {emailLogsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : emailLogs && emailLogs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'bn' ? 'টাইপ' : 'Type'}</TableHead>
                          <TableHead>{language === 'bn' ? 'প্রাপক' : 'Recipient'}</TableHead>
                          <TableHead>{language === 'bn' ? 'সাবজেক্ট' : 'Subject'}</TableHead>
                          <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                          <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emailLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <Badge variant="outline">{log.email_type}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{log.recipient_email}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{log.subject}</TableCell>
                            <TableCell>{getStatusBadge(log.status)}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'কোন ইমেইল লগ নেই' : 'No email logs yet'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'শিডিউলড জব' : 'Scheduled Jobs'}</CardTitle>
                <CardDescription>
                  {language === 'bn' 
                    ? 'অটোমেটেড টাস্ক এক্সিকিউশন লগ' 
                    : 'Automated task execution logs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : scheduledJobs && scheduledJobs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'bn' ? 'জব নাম' : 'Job Name'}</TableHead>
                          <TableHead>{language === 'bn' ? 'টাইপ' : 'Type'}</TableHead>
                          <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                          <TableHead>{language === 'bn' ? 'শুরু' : 'Started'}</TableHead>
                          <TableHead>{language === 'bn' ? 'সম্পন্ন' : 'Completed'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledJobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.job_name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{job.job_type}</Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {job.started_at ? format(new Date(job.started_at), 'dd MMM HH:mm') : '-'}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {job.completed_at ? format(new Date(job.completed_at), 'dd MMM HH:mm') : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      {language === 'bn' ? 'কোন শিডিউলড জব নেই' : 'No scheduled jobs yet'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default ReportsManagement;
