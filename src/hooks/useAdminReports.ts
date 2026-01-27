import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  refunds: number;
  refundAmount: number;
  newCustomers: number;
  averageOrderValue: number;
  topProducts: Array<{ name: string; count: number; revenue: number }>;
}

interface GenerateReportResult {
  html: string;
  data: ReportData;
  period: {
    start: string;
    end: string;
  };
}

export type ReportType = 'monthly_revenue' | 'payment_summary' | 'refund_summary' | 'new_customers';

export const useAdminReports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateReport = async (
    reportType: ReportType,
    startDate?: string,
    endDate?: string
  ): Promise<GenerateReportResult | null> => {
    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-admin-report', {
        body: { reportType, startDate, endDate },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'রিপোর্ট জেনারেট ব্যর্থ',
        description: error instanceof Error ? error.message : 'অজানা ত্রুটি',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = async (
    reportType: ReportType,
    startDate?: string,
    endDate?: string
  ) => {
    const result = await generateReport(reportType, startDate, endDate);
    if (!result) return;

    // Create a new window with the report HTML for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(result.html);
      printWindow.document.close();
      
      // Add print styles and auto-print
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const viewReport = async (
    reportType: ReportType,
    startDate?: string,
    endDate?: string
  ) => {
    const result = await generateReport(reportType, startDate, endDate);
    if (!result) return null;

    // Open in new tab for viewing
    const viewWindow = window.open('', '_blank');
    if (viewWindow) {
      viewWindow.document.write(result.html);
      viewWindow.document.close();
    }

    return result;
  };

  return {
    generateReport,
    downloadReport,
    viewReport,
    isGenerating,
  };
};
