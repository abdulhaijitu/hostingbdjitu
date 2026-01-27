import React from 'react';
import { 
  Download, 
  Eye, 
  Mail, 
  MoreHorizontal, 
  Printer,
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInvoicePDF } from '@/hooks/useInvoicePDF';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface InvoiceActionsProps {
  invoiceId: string;
  invoiceStatus: string;
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'dropdown';
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoiceId,
  invoiceStatus,
  showLabels = false,
  variant = 'default',
}) => {
  const { language } = useLanguage();
  const { 
    downloadInvoice, 
    viewInvoice, 
    sendInvoiceEmail, 
    isGenerating, 
    isSendingEmail 
  } = useInvoicePDF();

  const handleDownload = () => downloadInvoice(invoiceId);
  const handleView = () => viewInvoice(invoiceId);
  const handleSendEmail = () => {
    const emailType = invoiceStatus === 'paid' ? 'payment_success' : 'invoice_created';
    sendInvoiceEmail(invoiceId, emailType);
  };

  const labels = {
    view: language === 'bn' ? 'দেখুন' : 'View',
    download: language === 'bn' ? 'ডাউনলোড' : 'Download',
    print: language === 'bn' ? 'প্রিন্ট' : 'Print',
    email: language === 'bn' ? 'ইমেইল পাঠান' : 'Send Email',
    resend: language === 'bn' ? 'পুনরায় পাঠান' : 'Resend',
  };

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isGenerating || isSendingEmail}>
            {isGenerating || isSendingEmail ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleView}>
            <Eye className="h-4 w-4 mr-2" />
            {labels.view}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            {labels.download}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Printer className="h-4 w-4 mr-2" />
            {labels.print}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            {labels.email}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleView}
          disabled={isGenerating}
          title={labels.view}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDownload}
          disabled={isGenerating}
          title={labels.download}
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleSendEmail}
          disabled={isSendingEmail}
          title={labels.email}
        >
          {isSendingEmail ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleView}
        disabled={isGenerating}
      >
        <Eye className="h-4 w-4 mr-2" />
        {showLabels && labels.view}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {showLabels && labels.download}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSendEmail}
        disabled={isSendingEmail}
      >
        {isSendingEmail ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Mail className="h-4 w-4 mr-2" />
        )}
        {showLabels && labels.email}
      </Button>
    </div>
  );
};

export default InvoiceActions;
