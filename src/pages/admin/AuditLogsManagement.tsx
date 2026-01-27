import React, { useState, useMemo } from 'react';
import { useAuditLogs, useAuditActionTypes, AuditLogFilters } from '@/hooks/useAuditLogs';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  FileText, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  User,
  Clock,
  Activity,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const AuditLogsManagement: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data, isLoading, refetch, isFetching } = useAuditLogs({ page, pageSize, filters });
  const { data: actionTypes } = useAuditActionTypes();

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPage(1);
  };

  const handleFilterChange = (key: keyof AuditLogFilters, value: string | undefined) => {
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

  const getActionBadgeVariant = (action: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (action.includes('DELETE') || action.includes('TERMINATE') || action.includes('REJECT')) {
      return 'destructive';
    }
    if (action.includes('CREATE') || action.includes('APPROVE') || action.includes('CONFIRM')) {
      return 'default';
    }
    if (action.includes('UPDATE') || action.includes('CHANGE')) {
      return 'secondary';
    }
    return 'outline';
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' => {
    if (role === 'admin') return 'default';
    if (role === 'system') return 'secondary';
    return 'outline';
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
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
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
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {language === 'bn' ? 'অডিট লগ' : 'Audit Logs'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === 'bn' ? 'সকল গুরুত্বপূর্ণ কার্যক্রমের রেকর্ড' : 'Record of all critical actions'}
            </p>
          </div>
        </div>
        <Button onClick={() => refetch()} variant="outline" disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'bn' ? 'টার্গেট ID বা অ্যাকশন খুঁজুন...' : 'Search by target ID or action...'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>

            {/* Action Type Filter */}
            <Select
              value={filters.actionType || 'all'}
              onValueChange={(value) => handleFilterChange('actionType', value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <Activity className="h-4 w-4 mr-2" />
                <SelectValue placeholder={language === 'bn' ? 'অ্যাকশন টাইপ' : 'Action Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'bn' ? 'সকল অ্যাকশন' : 'All Actions'}</SelectItem>
                {actionTypes?.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Target Type Filter */}
            <Select
              value={filters.targetType || 'all'}
              onValueChange={(value) => handleFilterChange('targetType', value)}
            >
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={language === 'bn' ? 'টার্গেট টাইপ' : 'Target Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'bn' ? 'সকল' : 'All'}</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="hosting_account">Hosting</SelectItem>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="server">Server</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(filters.actionType || filters.targetType || filters.search) && (
              <Button variant="ghost" onClick={clearFilters}>
                {language === 'bn' ? 'ফিল্টার সাফ করুন' : 'Clear'}
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
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                {language === 'bn' ? 'কোনো লগ পাওয়া যায়নি' : 'No logs found'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন' : 'Try changing the filters'}
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
                      {/* Left: Action & Target */}
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <Activity className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getActionBadgeVariant(log.action_type)}>
                              {log.action_type}
                            </Badge>
                            {log.target_type && (
                              <span className="text-sm text-muted-foreground">
                                → {log.target_type}
                              </span>
                            )}
                          </div>
                          {log.target_id && (
                            <p className="text-sm font-mono text-muted-foreground mt-1 truncate">
                              ID: {log.target_id}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actor & Time */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">
                            {log.actor_name || log.actor_email || 'System'}
                          </span>
                          <Badge variant={getRoleBadgeVariant(log.actor_role)} className="text-xs">
                            {log.actor_role}
                          </Badge>
                        </div>
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
                  <div className="border-t px-4 py-3 bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">{language === 'bn' ? 'বিস্তারিত তথ্য' : 'Details'}</p>
                        <div className="space-y-1 text-muted-foreground">
                          <p><span className="font-medium">Actor ID:</span> {log.actor_id || 'N/A'}</p>
                          <p><span className="font-medium">Time:</span> {format(new Date(log.created_at), 'PPpp')}</p>
                          {log.ip_address && <p><span className="font-medium">IP:</span> {log.ip_address}</p>}
                        </div>
                      </div>
                      {Object.keys(log.metadata).length > 0 && (
                        <div>
                          <p className="font-medium mb-1">{language === 'bn' ? 'মেটাডেটা' : 'Metadata'}</p>
                          <ScrollArea className="h-24">
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
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
              ? `মোট ${data.totalCount} লগের মধ্যে ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, data.totalCount)} দেখানো হচ্ছে`
              : `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, data.totalCount)} of ${data.totalCount} logs`
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
              {!isMobile && (language === 'bn' ? 'আগে' : 'Previous')}
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
              {!isMobile && (language === 'bn' ? 'পরে' : 'Next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsManagement;
