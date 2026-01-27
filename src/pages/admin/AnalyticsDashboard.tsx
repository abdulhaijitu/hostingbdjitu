import React, { useState, Suspense, lazy } from 'react';
import { 
  TrendingUp, RefreshCw, ArrowLeft, BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOHead from '@/components/common/SEOHead';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAnalyticsDashboard, DateRange } from '@/hooks/useAnalyticsDashboard';
import { cn } from '@/lib/utils';

// Lazy load chart components for better performance
const AnalyticsKPICards = lazy(() => import('@/components/admin/analytics/AnalyticsKPICards'));
const RevenueCharts = lazy(() => import('@/components/admin/analytics/RevenueCharts'));
const CustomerUsageMetrics = lazy(() => import('@/components/admin/analytics/CustomerUsageMetrics'));
const BillingInsightsPanel = lazy(() => import('@/components/admin/analytics/BillingInsightsPanel'));
const AnalyticsFilters = lazy(() => import('@/components/admin/analytics/AnalyticsFilters'));

const ChartSkeleton = () => (
  <div className="w-full h-64 bg-card rounded-xl border animate-pulse" />
);

const AnalyticsDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  
  // Filter states
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [productFilter, setProductFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  // Fetch analytics data
  const {
    kpiData,
    revenueByProduct,
    revenueByPaymentMethod,
    dailyRevenue,
    monthlyRevenue,
    billingInsights,
    customerMetrics,
    expiringServices,
    hostingByPlan,
    isLoading,
    refetchAll,
  } = useAnalyticsDashboard(dateRange);
  
  // Track page performance
  usePagePerformance('Analytics Dashboard');

  return (
    <>
      <SEOHead 
        title={language === 'bn' ? 'অ্যানালিটিক্স ড্যাশবোর্ড' : 'Analytics Dashboard'}
        description="Comprehensive business analytics and revenue dashboard"
        canonicalUrl="/admin/analytics"
      />
      
      <div className={cn(isMobile ? "pb-20" : "p-6 lg:p-8")}>
        {/* Header */}
        <div className={cn(
          "flex flex-col gap-4 mb-6",
          isMobile ? "px-4 pt-4" : ""
        )}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
              </Button>
              <h1 className={cn(
                "font-bold font-display flex items-center gap-3",
                isMobile ? "text-xl" : "text-3xl"
              )}>
                <BarChart3 className={cn(isMobile ? "h-5 w-5" : "h-8 w-8", "text-primary")} />
                {language === 'bn' ? 'অ্যানালিটিক্স ড্যাশবোর্ড' : 'Analytics Dashboard'}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {language === 'bn' ? 'ব্যবসায়িক অন্তর্দৃষ্টি এবং রেভিনিউ ট্র্যাক করুন' : 'Track business insights and revenue'}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetchAll}
              className="shrink-0"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
          </div>

          {/* Filters */}
          <Suspense fallback={<div className="h-10 bg-muted/50 rounded-lg animate-pulse" />}>
            <AnalyticsFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              productFilter={productFilter}
              onProductFilterChange={setProductFilter}
              paymentMethodFilter={paymentMethodFilter}
              onPaymentMethodFilterChange={setPaymentMethodFilter}
              language={language as 'en' | 'bn'}
              isMobile={isMobile}
            />
          </Suspense>
        </div>

        {/* Content Sections */}
        <div className={cn("space-y-6", isMobile && "px-4")}>
          {/* Section 1: KPI Cards */}
          <section>
            <h2 className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              isMobile ? "text-base" : "text-lg"
            )}>
              <TrendingUp className="h-4 w-4 text-primary" />
              {language === 'bn' ? 'মূল মেট্রিক্স' : 'Key Metrics'}
            </h2>
            <Suspense fallback={<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[1,2,3,4].map(i => <ChartSkeleton key={i} />)}</div>}>
              <AnalyticsKPICards
                data={kpiData}
                isLoading={isLoading}
                language={language as 'en' | 'bn'}
                isMobile={isMobile}
              />
            </Suspense>
          </section>

          {/* Section 2: Revenue Analytics */}
          <section>
            <h2 className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              isMobile ? "text-base" : "text-lg"
            )}>
              <BarChart3 className="h-4 w-4 text-primary" />
              {language === 'bn' ? 'রেভিনিউ বিশ্লেষণ' : 'Revenue Analytics'}
            </h2>
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueCharts
                dailyRevenue={dailyRevenue}
                monthlyRevenue={monthlyRevenue}
                revenueByProduct={revenueByProduct}
                revenueByPaymentMethod={revenueByPaymentMethod}
                isLoading={isLoading}
                language={language as 'en' | 'bn'}
                isMobile={isMobile}
              />
            </Suspense>
          </section>

          {/* Section 3: Customer & Usage Analytics */}
          <section>
            <h2 className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              isMobile ? "text-base" : "text-lg"
            )}>
              {language === 'bn' ? 'গ্রাহক এবং ব্যবহার বিশ্লেষণ' : 'Customer & Usage Analytics'}
            </h2>
            <Suspense fallback={<ChartSkeleton />}>
              <CustomerUsageMetrics
                customerMetrics={customerMetrics}
                expiringServices={expiringServices}
                hostingByPlan={hostingByPlan}
                isLoading={isLoading}
                language={language as 'en' | 'bn'}
                isMobile={isMobile}
              />
            </Suspense>
          </section>

          {/* Section 4: Billing & Payment Insights */}
          <section>
            <h2 className={cn(
              "font-semibold mb-3 flex items-center gap-2",
              isMobile ? "text-base" : "text-lg"
            )}>
              {language === 'bn' ? 'বিলিং এবং পেমেন্ট ইনসাইট' : 'Billing & Payment Insights'}
            </h2>
            <Suspense fallback={<ChartSkeleton />}>
              <BillingInsightsPanel
                data={billingInsights}
                isLoading={isLoading}
                language={language as 'en' | 'bn'}
                isMobile={isMobile}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;
