import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, CheckCircle, Clock, XCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInvoices } from '@/hooks/useInvoices';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/common/SEOHead';
import { format } from 'date-fns';

const InvoicesPage: React.FC = () => {
  const { language } = useLanguage();
  const { data: invoices, isLoading } = useInvoices();

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive'; icon: typeof Clock; label: { en: string; bn: string } }> = {
      paid: { variant: 'default', icon: CheckCircle, label: { en: 'Paid', bn: 'পরিশোধিত' } },
      unpaid: { variant: 'secondary', icon: Clock, label: { en: 'Unpaid', bn: 'অপরিশোধিত' } },
      cancelled: { variant: 'destructive', icon: XCircle, label: { en: 'Cancelled', bn: 'বাতিল' } },
    };
    const { variant, icon: Icon, label } = config[status] || config.unpaid;
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {language === 'bn' ? label.bn : label.en}
      </Badge>
    );
  };

  const totalPaid = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total), 0) || 0;
  const totalUnpaid = invoices?.filter(i => i.status === 'unpaid').reduce((sum, i) => sum + Number(i.total), 0) || 0;

  return (
    <Layout>
      <SEOHead 
        title={language === 'bn' ? 'ইনভয়েস' : 'Invoices'}
        description="View your invoices"
        canonicalUrl="/dashboard/invoices"
      />
      
      <section className="section-padding bg-muted/30 min-h-screen">
        <div className="container-wide">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-display flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                {language === 'bn' ? 'ইনভয়েস' : 'Invoices'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {language === 'bn' ? 'সকল বিল ও ইনভয়েস' : 'All your bills and invoices'}
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === 'bn' ? 'মোট ইনভয়েস' : 'Total Invoices'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{invoices?.length || 0}</div>
              </CardContent>
            </Card>
            <Card className="bg-success/5 border-success/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-success">
                  {language === 'bn' ? 'পরিশোধিত' : 'Total Paid'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">৳{totalPaid.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-warning/5 border-warning/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-warning">
                  {language === 'bn' ? 'বকেয়া' : 'Outstanding'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">৳{totalUnpaid.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'ইনভয়েস হিস্ট্রি' : 'Invoice History'}</CardTitle>
              <CardDescription>
                {language === 'bn' ? 'সকল ইনভয়েসের তালিকা' : 'List of all your invoices'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : invoices && invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{language === 'bn' ? 'ইনভয়েস নম্বর' : 'Invoice #'}</TableHead>
                        <TableHead>{language === 'bn' ? 'মূল্য' : 'Amount'}</TableHead>
                        <TableHead>{language === 'bn' ? 'ট্যাক্স' : 'Tax'}</TableHead>
                        <TableHead>{language === 'bn' ? 'মোট' : 'Total'}</TableHead>
                        <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                        <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                        <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map(invoice => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono text-sm">{invoice.invoice_number}</TableCell>
                          <TableCell>৳{invoice.amount}</TableCell>
                          <TableCell>৳{invoice.tax || 0}</TableCell>
                          <TableCell className="font-semibold">৳{invoice.total}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(invoice.created_at), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            {invoice.pdf_url ? (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'bn' ? 'কোন ইনভয়েস নেই' : 'No invoices yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === 'bn' 
                      ? 'আপনার অর্ডার সম্পন্ন হলে ইনভয়েস এখানে দেখা যাবে'
                      : 'Invoices will appear here after you complete an order'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default InvoicesPage;
