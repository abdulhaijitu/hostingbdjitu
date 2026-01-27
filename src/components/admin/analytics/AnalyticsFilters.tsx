import React, { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, subMonths } from 'date-fns';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DateRange } from '@/hooks/useAnalyticsDashboard';

interface AnalyticsFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  productFilter: string;
  onProductFilterChange: (product: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodFilterChange: (method: string) => void;
  language: 'en' | 'bn';
  isMobile?: boolean;
}

const presetRanges = [
  { label: 'Today', labelBn: 'আজ', value: 'today' },
  { label: 'Last 7 Days', labelBn: 'গত ৭ দিন', value: '7days' },
  { label: 'Last 30 Days', labelBn: 'গত ৩০ দিন', value: '30days' },
  { label: 'This Month', labelBn: 'এই মাস', value: 'thisMonth' },
  { label: 'Last Month', labelBn: 'গত মাস', value: 'lastMonth' },
  { label: 'This Year', labelBn: 'এই বছর', value: 'thisYear' },
  { label: 'Custom', labelBn: 'কাস্টম', value: 'custom' },
];

const productOptions = [
  { label: 'All Products', labelBn: 'সব প্রোডাক্ট', value: 'all' },
  { label: 'Hosting', labelBn: 'হোস্টিং', value: 'hosting' },
  { label: 'VPS', labelBn: 'ভিপিএস', value: 'vps' },
  { label: 'Dedicated', labelBn: 'ডেডিকেটেড', value: 'dedicated' },
  { label: 'Domain', labelBn: 'ডোমেইন', value: 'domain' },
];

const paymentMethodOptions = [
  { label: 'All Methods', labelBn: 'সব পদ্ধতি', value: 'all' },
  { label: 'UddoktaPay', labelBn: 'উদ্যোক্তা পে', value: 'uddoktapay' },
  { label: 'bKash', labelBn: 'বিকাশ', value: 'bkash' },
  { label: 'Nagad', labelBn: 'নগদ', value: 'nagad' },
  { label: 'Card', labelBn: 'কার্ড', value: 'card' },
];

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  productFilter,
  onProductFilterChange,
  paymentMethodFilter,
  onPaymentMethodFilterChange,
  language,
  isMobile = false,
}) => {
  const [presetValue, setPresetValue] = useState<string>('30days');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePresetChange = (value: string) => {
    setPresetValue(value);
    const today = new Date();

    switch (value) {
      case 'today':
        onDateRangeChange({ from: today, to: today });
        break;
      case '7days':
        onDateRangeChange({ from: subDays(today, 7), to: today });
        break;
      case '30days':
        onDateRangeChange({ from: subDays(today, 30), to: today });
        break;
      case 'thisMonth':
        onDateRangeChange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        onDateRangeChange({ from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) });
        break;
      case 'thisYear':
        onDateRangeChange({ from: startOfYear(today), to: today });
        break;
      case 'custom':
        setIsCalendarOpen(true);
        break;
      default:
        onDateRangeChange(undefined);
    }
  };

  const clearFilters = () => {
    setPresetValue('30days');
    onDateRangeChange({ from: subDays(new Date(), 30), to: new Date() });
    onProductFilterChange('all');
    onPaymentMethodFilterChange('all');
  };

  const hasActiveFilters = 
    productFilter !== 'all' || 
    paymentMethodFilter !== 'all' || 
    presetValue !== '30days';

  return (
    <div className={cn(
      'flex flex-wrap gap-2 items-center',
      isMobile && 'flex-col items-stretch'
    )}>
      {/* Date Range Preset */}
      <Select value={presetValue} onValueChange={handlePresetChange}>
        <SelectTrigger className={cn('w-auto min-w-[140px]', isMobile && 'w-full')}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          <SelectValue placeholder={language === 'bn' ? 'সময়কাল' : 'Time Range'} />
        </SelectTrigger>
        <SelectContent>
          {presetRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {language === 'bn' ? range.labelBn : range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Custom Date Picker */}
      {presetValue === 'custom' && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn(isMobile && 'w-full')}>
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                  </>
                ) : (
                  format(dateRange.from, 'MMM dd, yyyy')
                )
              ) : (
                language === 'bn' ? 'তারিখ নির্বাচন' : 'Pick dates'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange ? { from: dateRange.from, to: dateRange.to } : undefined}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onDateRangeChange({ from: range.from, to: range.to });
                  setIsCalendarOpen(false);
                } else if (range?.from) {
                  onDateRangeChange({ from: range.from, to: range.from });
                }
              }}
              initialFocus
              className="p-3 pointer-events-auto"
              numberOfMonths={isMobile ? 1 : 2}
            />
          </PopoverContent>
        </Popover>
      )}

      {/* Product Filter */}
      <Select value={productFilter} onValueChange={onProductFilterChange}>
        <SelectTrigger className={cn('w-auto min-w-[130px]', isMobile && 'w-full')}>
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder={language === 'bn' ? 'প্রোডাক্ট' : 'Product'} />
        </SelectTrigger>
        <SelectContent>
          {productOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {language === 'bn' ? option.labelBn : option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Payment Method Filter */}
      <Select value={paymentMethodFilter} onValueChange={onPaymentMethodFilterChange}>
        <SelectTrigger className={cn('w-auto min-w-[130px]', isMobile && 'w-full')}>
          <SelectValue placeholder={language === 'bn' ? 'পেমেন্ট' : 'Payment'} />
        </SelectTrigger>
        <SelectContent>
          {paymentMethodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {language === 'bn' ? option.labelBn : option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className={cn('gap-1', isMobile && 'w-full')}
        >
          <X className="h-4 w-4" />
          {language === 'bn' ? 'ফিল্টার মুছুন' : 'Clear'}
        </Button>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !isMobile && (
        <div className="flex items-center gap-1 ml-2">
          {productFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {productOptions.find(o => o.value === productFilter)?.[language === 'bn' ? 'labelBn' : 'label']}
            </Badge>
          )}
          {paymentMethodFilter !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {paymentMethodOptions.find(o => o.value === paymentMethodFilter)?.[language === 'bn' ? 'labelBn' : 'label']}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;
