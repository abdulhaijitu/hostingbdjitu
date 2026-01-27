import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InvoiceData {
  id: string;
  invoice_number: string;
  amount: number;
  tax: number | null;
  total: number;
  status: string;
  created_at: string;
  due_date: string | null;
  paid_at: string | null;
  item_name?: string;
  billing_cycle?: string;
  domain_name?: string;
  order_number?: string;
  payment_method?: string;
  transaction_id?: string;
  customer?: {
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    address: string | null;
  };
}

export const useInvoicePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const generateInvoice = async (invoiceId: string): Promise<{ html: string; invoice: InvoiceData } | null> => {
    setIsGenerating(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('generate-invoice-pdf', {
        body: { invoiceId },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: 'ইনভয়েস জেনারেট ব্যর্থ',
        description: error instanceof Error ? error.message : 'অজানা ত্রুটি',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    const result = await generateInvoice(invoiceId);
    if (!result) return;

    // Create a new window with the invoice HTML for printing/saving
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(result.html);
      printWindow.document.close();
      
      // Add print styles and auto-print
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
      // Fallback: download as HTML
      const blob = new Blob([result.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.invoice.invoice_number}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const viewInvoice = async (invoiceId: string) => {
    const result = await generateInvoice(invoiceId);
    if (!result) return null;

    // Open in new tab for viewing
    const viewWindow = window.open('', '_blank');
    if (viewWindow) {
      viewWindow.document.write(result.html);
      viewWindow.document.close();
    }

    return result;
  };

  const sendInvoiceEmail = async (
    invoiceId: string, 
    emailType: 'invoice_created' | 'payment_success' | 'payment_failed' | 'refund_approved' | 'service_expiring'
  ) => {
    setIsSendingEmail(true);
    try {
      const response = await supabase.functions.invoke('send-invoice-email', {
        body: { invoiceId, emailType, language: 'bn' },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: 'ইমেইল পাঠানো হয়েছে',
        description: 'ইনভয়েস ইমেইল সফলভাবে পাঠানো হয়েছে।',
      });

      return response.data;
    } catch (error) {
      console.error('Error sending invoice email:', error);
      toast({
        title: 'ইমেইল পাঠাতে ব্যর্থ',
        description: error instanceof Error ? error.message : 'অজানা ত্রুটি',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSendingEmail(false);
    }
  };

  return {
    generateInvoice,
    downloadInvoice,
    viewInvoice,
    sendInvoiceEmail,
    isGenerating,
    isSendingEmail,
  };
};
