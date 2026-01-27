import React, { useState } from 'react';
import { useErrorLogs, useErrorStats, ErrorLogFilters } from '@/hooks/useErrorLogs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertTriangle, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Clock,
  RefreshCw,
  AlertCircle,
  Info,
  XCircle,
  Globe,
  Server,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const ErrorLogsManagement: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [filters, setFilters] = useState<ErrorLogFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data, isLoading, refetch, isFetching } = useErrorLogs({ page, pageSize, filters });
  const { data: stats, isLoading: statsLoading } = useErrorStats();

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPage(1);
  };

  const handleFilterChange = (key: keyof ErrorLogFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value === 'all' ? undefined : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
    setPage(1);
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'frontend': return <Globe className="h-4 w-4" />;
      case 'backend': return <Server className="h-4 w-4" />;
      case 'edge': return <Server className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: language === 'bn' ? bn : undefined,
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'bn' ? 'এরর লগ' : 'Error Logs'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === 'bn' ? 'সিস্টেম এরর ট্র্যাকিং' : 'System error tracking'}
            </p>
          </div>
        </div>
        <Button onClick={() => refetch()} variant="outline" disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === 'bn' ? 'গত ২৪ ঘন্টা' : 'Last 24h'}
                  </p>
                  <p className="text-2xl font-bold">{stats.total24h}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-destructive">{stats.criticalCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-orange-500">{stats.errorCount}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'bn' ? 'শীর্ষ এরর' : 'Top Errors'}
                </p>
                {stats.topErrors.slice(0, 2).map((err, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="truncate">{err.code}</span>
                    <Badge variant="outline" className="ml-2">{err.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'bn' ? 'মেসেজ বা এরর কোড খুঁজুন...' : 'Search message or error code...'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>

            {/* Source Filter */}
            <Select
              value={filters.source || 'all'}
              onValueChange={(value) => handleFilterChange('source', value)}
            >
              <SelectTrigger className="w-full md:w-40">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'bn' ? 'সকল' : 'All Sources'}</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="edge">Edge</SelectItem>
              </SelectContent>
            </Select>

            {/* Severity Filter */}
            <Select
              value={filters.severity || 'all'}
              onValueChange={(value) => handleFilterChange('severity', value)}
            >
              <SelectTrigger className="w-full md:w-40">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'bn' ? 'সকল' : 'All Severity'}</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(filters.source || filters.severity || filters.search) && (
              <Button variant="ghost" onClick={clearFilters}>
                {language === 'bn' ? 'সাফ করুন' : 'Clear'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <div className="space-y-3">
        {data?.logs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                {language === 'bn' ? 'কোনো এরর পাওয়া যায়নি' : 'No errors found'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'এটি ভালো খবর!' : "That's good news!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          data?.logs.map((log) => (
            <Collapsible 
              key={log.id} 
              open={expandedRows.has(log.id)}
              onOpenChange={() => toggleRow(log.id)}
            >
              <Card className="overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      {/* Left: Error Info */}
                      <div className="flex items-start gap-3 flex-1">
                        {getSeverityIcon(log.severity)}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getSeverityBadgeVariant(log.severity)}>
                              {log.error_code}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getSourceIcon(log.source)}
                              <span className="ml-1">{log.source}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {log.message}
                          </p>
                        </div>
                      </div>

                      {/* Right: Time */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                          <Clock className="h-4 w-4" />
                          <span title={format(new Date(log.created_at), 'PPpp')}>
                            {formatTimeAgo(log.created_at)}
                          </span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${expandedRows.has(log.id) ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t px-4 py-3 bg-muted/30 space-y-3">
                    <div>
                      <p className="font-medium text-sm mb-1">{language === 'bn' ? 'মেসেজ' : 'Message'}</p>
                      <p className="text-sm text-muted-foreground">{log.message}</p>
                    </div>
                    
                    {log.url && (
                      <div>
                        <p className="font-medium text-sm mb-1">URL</p>
                        <p className="text-sm text-muted-foreground font-mono break-all">{log.url}</p>
                      </div>
                    )}
                    
                    {log.stack_trace && (
                      <div>
                        <p className="font-medium text-sm mb-1">Stack Trace</p>
                        <ScrollArea className="h-32">
                          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap">
                            {log.stack_trace}
                          </pre>
                        </ScrollArea>
                      </div>
                    )}
                    
                    {Object.keys(log.context).length > 0 && (
                      <div>
                        <p className="font-medium text-sm mb-1">Context</p>
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.context, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      <span>Session: {log.session_id || 'N/A'}</span>
                      {log.user_id && <span className="ml-4">User: {log.user_id}</span>}
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {language === 'bn' 
              ? `মোট ${data.totalCount} এরর`
              : `${data.totalCount} total errors`
            }
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              {page} / {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorLogsManagement;
