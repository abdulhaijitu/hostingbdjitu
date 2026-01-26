import React, { useState } from 'react';
import { Download, FileText, Loader2, Eye } from 'lucide-react';
import DashboardLayout from '@/components/client-dashboard/DashboardLayout';
import StatusBadge from '@/components/client-dashboard/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/contexts/LanguageContext';
import { useInvoices } from '@/hooks/useInvoices';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BillingPage: React.FC = () => {
  const { language } = useLanguage();
  const { data: invoices, isLoading } = useInvoices();
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const generateAndDownloadPDF = async (invoiceId: string, invoiceNumber: string) => {
    setDownloadingId(invoiceId);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: language === 'bn' ? 'ত্রুটি' : 'Error',
          description: language === 'bn' ? 'অনুগ্রহ করে লগইন করুন' : 'Please login first',
          variant: 'destructive',
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoiceId },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { html } = response.data;
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      toast({
        title: language === 'bn' ? 'সফল' : 'Success',
        description: language === 'bn' ? 'ইনভয়েস ডাউনলোড হচ্ছে' : 'Invoice download started',
      });
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message || (language === 'bn' ? 'ইনভয়েস তৈরি করতে সমস্যা হয়েছে' : 'Failed to generate invoice'),
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const previewInvoice = async (invoiceId: string) => {
    setDownloadingId(invoiceId);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: language === 'bn' ? 'ত্রুটি' : 'Error',
          description: language === 'bn' ? 'অনুগ্রহ করে লগইন করুন' : 'Please login first',
          variant: 'destructive',
        });
        return;
      }

      const response = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoiceId },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setPreviewHtml(response.data.html);
      setShowPreview(true);
    } catch (error: any) {
      console.error('Error previewing invoice:', error);
      toast({
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        description: error.message || (language === 'bn' ? 'ইনভয়েস দেখতে সমস্যা হয়েছে' : 'Failed to preview invoice'),
        variant: 'destructive',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <DashboardLayout title={language === 'bn' ? 'বিলিং ও ইনভয়েস' : 'Billing & Invoices'}>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold font-display">
          {language === 'bn' ? 'বিলিং ও ইনভয়েস' : 'Billing & Invoices'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'bn' ? 'আপনার সব ইনভয়েস এখানে দেখুন এবং ডাউনলোড করুন' : 'View and download all your invoices here'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'ইনভয়েস তালিকা' : 'Invoice List'}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'bn' ? 'ইনভয়েস #' : 'Invoice #'}</TableHead>
                    <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                    <TableHead>{language === 'bn' ? 'পরিমাণ' : 'Amount'}</TableHead>
                    <TableHead>{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</TableHead>
                    <TableHead className="text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv: any) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono font-medium">{inv.invoice_number}</TableCell>
                      <TableCell>{new Date(inv.created_at).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell className="font-semibold">৳{inv.total.toLocaleString()}</TableCell>
                      <TableCell><StatusBadge status={inv.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => previewInvoice(inv.id)}
                            disabled={downloadingId === inv.id}
                          >
                            {downloadingId === inv.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">{language === 'bn' ? 'দেখুন' : 'View'}</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => generateAndDownloadPDF(inv.id, inv.invoice_number)}
                            disabled={downloadingId === inv.id}
                          >
                            {downloadingId === inv.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">PDF</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'bn' ? 'কোন ইনভয়েস নেই' : 'No Invoices Yet'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'bn' 
                  ? 'আপনার প্রথম অর্ডারের পর এখানে ইনভয়েস দেখা যাবে' 
                  : 'Invoices will appear here after your first order'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{language === 'bn' ? 'ইনভয়েস প্রিভিউ' : 'Invoice Preview'}</DialogTitle>
          </DialogHeader>
          {previewHtml && (
            <div 
              className="border rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </Button>
            <Button 
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow && previewHtml) {
                  printWindow.document.write(previewHtml);
                  printWindow.document.close();
                  printWindow.onload = () => printWindow.print();
                }
              }}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {language === 'bn' ? 'প্রিন্ট/PDF' : 'Print/PDF'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BillingPage;
