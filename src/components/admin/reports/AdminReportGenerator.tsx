import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  FileText, 
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminReports, type ReportType } from '@/hooks/useAdminReports';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const AdminReportGenerator: React.FC = () => {
  const { language } = useLanguage();
  const { generateReport, downloadReport, viewReport, isGenerating } = useAdminReports();
  
  const [reportType, setReportType] = useState<ReportType>('monthly_revenue');
  const [dateRange, setDateRange] = useState<'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom'>('last30');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [lastReport, setLastReport] = useState<any>(null);

  const reportTypes = [
    { 
      value: 'monthly_revenue' as ReportType, 
      label: language === 'bn' ? 'মাসিক রেভিনিউ' : 'Monthly Revenue',
      icon: TrendingUp,
      description: language === 'bn' ? 'রেভিনিউ ও আর্থিক সারাংশ' : 'Revenue and financial summary'
    },
    { 
      value: 'payment_summary' as ReportType, 
      label: language === 'bn' ? 'পেমেন্ট সারাংশ' : 'Payment Summary',
      icon: CreditCard,
      description: language === 'bn' ? 'পেমেন্ট স্ট্যাটাস বিশ্লেষণ' : 'Payment status analysis'
    },
    { 
      value: 'refund_summary' as ReportType, 
      label: language === 'bn' ? 'রিফান্ড সারাংশ' : 'Refund Summary',
      icon: FileText,
      description: language === 'bn' ? 'রিফান্ড ট্র্যাকিং' : 'Refund tracking'
    },
    { 
      value: 'new_customers' as ReportType, 
      label: language === 'bn' ? 'নতুন গ্রাহক' : 'New Customers',
      icon: Users,
      description: language === 'bn' ? 'গ্রাহক অধিগ্রহণ মেট্রিক্স' : 'Customer acquisition metrics'
    },
  ];

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'last7':
        return { start: subDays(now, 7), end: now };
      case 'last30':
        return { start: subDays(now, 30), end: now };
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      case 'custom':
        return { 
          start: customStartDate ? new Date(customStartDate) : subDays(now, 30),
          end: customEndDate ? new Date(customEndDate) : now
        };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const handleGenerateReport = async () => {
    const { start, end } = getDateRange();
    const result = await generateReport(
      reportType,
      start.toISOString(),
      end.toISOString()
    );
    if (result) {
      setLastReport(result);
    }
  };

  const handleDownload = async () => {
    const { start, end } = getDateRange();
    await downloadReport(reportType, start.toISOString(), end.toISOString());
  };

  const handleView = async () => {
    const { start, end } = getDateRange();
    await viewReport(reportType, start.toISOString(), end.toISOString());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {language === 'bn' ? 'অ্যাডমিন রিপোর্ট জেনারেটর' : 'Admin Report Generator'}
          </CardTitle>
          <CardDescription>
            {language === 'bn' 
              ? 'পিডিএফ রিপোর্ট জেনারেট এবং ডাউনলোড করুন' 
              : 'Generate and download PDF reports'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map(({ value, label, icon: Icon, description }) => (
              <Card 
                key={value}
                className={`cursor-pointer transition-all ${
                  reportType === value 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-muted-foreground/30'
                }`}
                onClick={() => setReportType(value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      reportType === value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{language === 'bn' ? 'সময়সীমা' : 'Date Range'}</Label>
              <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7">
                    {language === 'bn' ? 'শেষ ৭ দিন' : 'Last 7 Days'}
                  </SelectItem>
                  <SelectItem value="last30">
                    {language === 'bn' ? 'শেষ ৩০ দিন' : 'Last 30 Days'}
                  </SelectItem>
                  <SelectItem value="thisMonth">
                    {language === 'bn' ? 'এই মাস' : 'This Month'}
                  </SelectItem>
                  <SelectItem value="lastMonth">
                    {language === 'bn' ? 'গত মাস' : 'Last Month'}
                  </SelectItem>
                  <SelectItem value="custom">
                    {language === 'bn' ? 'কাস্টম' : 'Custom Range'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'শুরু তারিখ' : 'Start Date'}</Label>
                  <Input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'শেষ তারিখ' : 'End Date'}</Label>
                  <Input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {language === 'bn' ? 'জেনারেট হচ্ছে...' : 'Generating...'}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'রিপোর্ট জেনারেট করুন' : 'Generate Report'}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleView} disabled={isGenerating}>
              <Eye className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'প্রিভিউ' : 'Preview'}
            </Button>
            <Button variant="outline" onClick={handleDownload} disabled={isGenerating}>
              <Download className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats from Last Report */}
      {lastReport?.data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'bn' ? 'রিপোর্ট সারাংশ' : 'Report Summary'}
            </CardTitle>
            <CardDescription>
              {format(new Date(lastReport.period.start), 'dd MMM yyyy')} - {format(new Date(lastReport.period.end), 'dd MMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  ৳{lastReport.data.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'মোট রেভিনিউ' : 'Total Revenue'}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">
                  {lastReport.data.totalOrders}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">
                  {lastReport.data.newCustomers}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'নতুন গ্রাহক' : 'New Customers'}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">
                  ৳{lastReport.data.averageOrderValue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'গড় অর্ডার মূল্য' : 'Avg Order Value'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminReportGenerator;
