import React, { lazy, Suspense } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  DailyRevenue, MonthlyRevenue, RevenueByProduct, RevenueByPaymentMethod 
} from '@/hooks/useAnalyticsDashboard';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

interface RevenueChartsProps {
  dailyRevenue: DailyRevenue[];
  monthlyRevenue: MonthlyRevenue[];
  revenueByProduct: RevenueByProduct | null;
  revenueByPaymentMethod: RevenueByPaymentMethod[];
  isLoading: boolean;
  language: 'en' | 'bn';
  isMobile?: boolean;
}

const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div className="w-full" style={{ height }}>
    <Skeleton className="w-full h-full" />
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ৳{entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueCharts: React.FC<RevenueChartsProps> = ({
  dailyRevenue,
  monthlyRevenue,
  revenueByProduct,
  revenueByPaymentMethod,
  isLoading,
  language,
  isMobile = false,
}) => {
  // Prepare product data for pie chart
  const productChartData = revenueByProduct ? [
    { name: language === 'bn' ? 'হোস্টিং' : 'Hosting', value: revenueByProduct.hosting },
    { name: 'VPS', value: revenueByProduct.vps },
    { name: language === 'bn' ? 'ডেডিকেটেড' : 'Dedicated', value: revenueByProduct.dedicated },
    { name: language === 'bn' ? 'ডোমেইন' : 'Domain', value: revenueByProduct.domain },
    { name: language === 'bn' ? 'অন্যান্য' : 'Other', value: revenueByProduct.other },
  ].filter(item => item.value > 0) : [];

  const chartHeight = isMobile ? 200 : 300;

  return (
    <div className={cn('grid gap-4', isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2')}>
      {/* Daily Revenue Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'দৈনিক রেভিনিউ (গত ৩০ দিন)' : 'Daily Revenue (Last 30 Days)'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'দৈনিক আয়ের প্রবণতা' : 'Daily revenue trend'}
          </CardDescription>
        </CardHeader>
        <CardContent className={cn(isMobile && 'px-2')}>
          {isLoading ? (
            <ChartSkeleton height={chartHeight} />
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={dailyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 6 : 2}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
                  width={isMobile ? 45 : 60}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  name={language === 'bn' ? 'রেভিনিউ' : 'Revenue'}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Monthly Revenue Chart */}
      <Card>
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'মাসিক রেভিনিউ' : 'Monthly Revenue'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'গত ১২ মাসের তুলনা' : 'Last 12 months comparison'}
          </CardDescription>
        </CardHeader>
        <CardContent className={cn(isMobile && 'px-2')}>
          {isLoading ? (
            <ChartSkeleton height={chartHeight} />
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  interval={isMobile ? 1 : 0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 50 : 30}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
                  width={isMobile ? 45 : 60}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name={language === 'bn' ? 'রেভিনিউ' : 'Revenue'}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Product */}
      <Card>
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'প্রোডাক্ট অনুযায়ী রেভিনিউ' : 'Revenue by Product'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'পণ্য বিভাগ অনুযায়ী বিতরণ' : 'Distribution by product category'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ChartSkeleton height={chartHeight} />
          ) : productChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={productChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 70 : 100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => 
                    isMobile ? `${(percent * 100).toFixed(0)}%` : `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={!isMobile}
                >
                  {productChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `৳${value.toLocaleString()}`}
                />
                {!isMobile && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              {language === 'bn' ? 'কোন ডেটা নেই' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Payment Method */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className={cn(isMobile && 'pb-2')}>
          <CardTitle className={cn(isMobile && 'text-base')}>
            {language === 'bn' ? 'পেমেন্ট পদ্ধতি অনুযায়ী রেভিনিউ' : 'Revenue by Payment Method'}
          </CardTitle>
          <CardDescription className={cn(isMobile && 'text-xs')}>
            {language === 'bn' ? 'পেমেন্ট পদ্ধতি অনুযায়ী বিতরণ' : 'Distribution by payment method'}
          </CardDescription>
        </CardHeader>
        <CardContent className={cn(isMobile && 'px-2')}>
          {isLoading ? (
            <ChartSkeleton height={chartHeight - 100} />
          ) : revenueByPaymentMethod.length > 0 ? (
            <ResponsiveContainer width="100%" height={chartHeight - 100}>
              <BarChart 
                data={revenueByPaymentMethod} 
                layout="vertical"
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
                  className="text-muted-foreground"
                />
                <YAxis 
                  dataKey="method" 
                  type="category"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  width={isMobile ? 80 : 100}
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--accent))" 
                  radius={[0, 4, 4, 0]}
                  name={language === 'bn' ? 'পরিমাণ' : 'Amount'}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              {language === 'bn' ? 'কোন ডেটা নেই' : 'No data available'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueCharts;
