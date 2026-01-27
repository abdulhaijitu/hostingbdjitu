import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, FileX, AlertCircle, CheckCircle2, 
  XCircle, RefreshCw, DollarSign, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BillingInsights } from '@/hooks/useAnalyticsDashboard';

interface BillingInsightsPanelProps {
  data: BillingInsights | null;
  isLoading: boolean;
  language: 'en' | 'bn';
  isMobile?: boolean;
}

const InsightCard: React.FC<{
  title: string;
  count: number;
  amount: number;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  href?: string;
  isLoading?: boolean;
}> = ({ title, count, amount, icon, variant = 'default', href, isLoading }) => {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-destructive/30 bg-destructive/5',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
  };

  const content = (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg border transition-colors',
      variantStyles[variant],
      href && 'hover:bg-muted/50 cursor-pointer'
    )}>
      <div className={cn('p-2 rounded-lg bg-background', iconStyles[variant])}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        {isLoading ? (
          <Skeleton className="h-5 w-16 mt-0.5" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{count}</span>
            <span className="text-sm text-muted-foreground">
              ৳{amount.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return href ? <Link to={href}>{content}</Link> : content;
};

const BillingInsightsPanel: React.FC<BillingInsightsPanelProps> = ({
  data,
  isLoading,
  language,
  isMobile = false,
}) => {
  const totalPayments = (data?.successPayments || 0) + (data?.failedPayments || 0);
  const successRate = totalPayments > 0 
    ? ((data?.successPayments || 0) / totalPayments) * 100 
    : 0;

  return (
    <div className={cn('grid gap-4', isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2')}>
      {/* Invoice Summary */}
      <Card>
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'ইনভয়েস সারাংশ' : 'Invoice Summary'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'ইনভয়েস স্ট্যাটাস ওভারভিউ' : 'Invoice status overview'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <InsightCard
            title={language === 'bn' ? 'পেইড ইনভয়েস' : 'Paid Invoices'}
            count={data?.paidInvoices || 0}
            amount={data?.paidAmount || 0}
            icon={<FileCheck className="h-4 w-4" />}
            variant="success"
            href="/admin/invoices?status=paid"
            isLoading={isLoading}
          />
          <InsightCard
            title={language === 'bn' ? 'আনপেইড ইনভয়েস' : 'Unpaid Invoices'}
            count={data?.unpaidInvoices || 0}
            amount={data?.unpaidAmount || 0}
            icon={<FileX className="h-4 w-4" />}
            variant="warning"
            href="/admin/invoices?status=unpaid"
            isLoading={isLoading}
          />
          <InsightCard
            title={language === 'bn' ? 'ওভারডিউ ইনভয়েস' : 'Overdue Invoices'}
            count={data?.overdueInvoices || 0}
            amount={data?.overdueAmount || 0}
            icon={<AlertCircle className="h-4 w-4" />}
            variant="danger"
            href="/admin/invoices?status=overdue"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Payment Insights */}
      <Card>
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'পেমেন্ট ইনসাইট' : 'Payment Insights'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'সফল বনাম ব্যর্থ পেমেন্ট' : 'Success vs failed payments'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Success Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'bn' ? 'সাফল্যের হার' : 'Success Rate'}
              </span>
              {isLoading ? (
                <Skeleton className="h-4 w-12" />
              ) : (
                <span className={cn(
                  'font-medium',
                  successRate >= 90 ? 'text-success' : successRate >= 70 ? 'text-warning' : 'text-destructive'
                )}>
                  {successRate.toFixed(1)}%
                </span>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <Progress 
                value={successRate} 
                className={cn(
                  'h-2',
                  successRate >= 90 ? '[&>div]:bg-success' : successRate >= 70 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'
                )} 
              />
            )}
          </div>

          {/* Payment Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-success/10 border border-success/20">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <div>
                <p className="text-[10px] text-muted-foreground">
                  {language === 'bn' ? 'সফল' : 'Success'}
                </p>
                {isLoading ? (
                  <Skeleton className="h-4 w-8" />
                ) : (
                  <p className="text-sm font-bold text-success">{data?.successPayments || 0}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <XCircle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-[10px] text-muted-foreground">
                  {language === 'bn' ? 'ব্যর্থ' : 'Failed'}
                </p>
                {isLoading ? (
                  <Skeleton className="h-4 w-8" />
                ) : (
                  <p className="text-sm font-bold text-destructive">{data?.failedPayments || 0}</p>
                )}
              </div>
            </div>
          </div>

          {/* Refunds and AOV */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                {language === 'bn' ? 'রিফান্ড' : 'Refunds'}
              </p>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <p className="text-sm font-medium">
                  {data?.refundCount || 0} (৳{(data?.refundAmount || 0).toLocaleString()})
                </p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {language === 'bn' ? 'গড় অর্ডার মূল্য' : 'Avg Order Value'}
              </p>
              {isLoading ? (
                <Skeleton className="h-5 w-20" />
              ) : (
                <p className="text-sm font-medium">
                  ৳{(data?.averageOrderValue || 0).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingInsightsPanel;
