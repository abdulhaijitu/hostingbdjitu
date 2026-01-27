import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, AlertTriangle, CheckCircle2, Clock, RefreshCw,
  ArrowLeft, Filter, XCircle, Eye, Activity, Lock, Unlock,
  TrendingUp, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePagePerformance } from '@/hooks/usePagePerformance';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  useSecurityEvents, 
  useAdminActionLogs, 
  useSecuritySummary,
  useResolveSecurityEvent,
  SecurityEvent,
  AdminActionLog,
} from '@/hooks/useSecurityMonitoring';
import SEOHead from '@/components/common/SEOHead';
import { cn } from '@/lib/utils';

const severityColors = {
  info: 'bg-muted text-muted-foreground',
  warn: 'bg-warning/10 text-warning border-warning/30',
  error: 'bg-destructive/10 text-destructive border-destructive/30',
  critical: 'bg-destructive text-destructive-foreground',
};

const threatLevelColors = {
  low: 'text-success',
  medium: 'text-warning',
  high: 'text-orange-500',
  critical: 'text-destructive',
};

const SecurityMonitoringPage: React.FC = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  usePagePerformance('Security Monitoring');

  // Filters
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [resolvedFilter, setResolvedFilter] = useState<string>('all');

  // Data fetching
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useSecuritySummary();
  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useSecurityEvents({
    severity: severityFilter !== 'all' ? severityFilter : undefined,
    eventType: eventTypeFilter !== 'all' ? eventTypeFilter : undefined,
    resolved: resolvedFilter === 'all' ? undefined : resolvedFilter === 'resolved',
    limit: 100,
  });
  const { data: actionLogs, isLoading: actionsLoading, refetch: refetchActions } = useAdminActionLogs({ limit: 50 });
  const resolveEvent = useResolveSecurityEvent();

  const handleRefreshAll = () => {
    refetchSummary();
    refetchEvents();
    refetchActions();
  };

  const handleResolve = async (eventId: string) => {
    await resolveEvent.mutateAsync(eventId);
  };

  // Get unique event types for filter
  const eventTypes = useMemo(() => {
    if (!events) return [];
    return [...new Set(events.map(e => e.event_type))];
  }, [events]);

  const renderThreatIndicator = () => {
    if (summaryLoading) {
      return <Skeleton className="h-24 w-full" />;
    }

    const level = summary?.threatLevel || 'low';
    
    return (
      <Card className={cn(
        'border-2',
        level === 'critical' ? 'border-destructive bg-destructive/5' :
        level === 'high' ? 'border-orange-500 bg-orange-500/5' :
        level === 'medium' ? 'border-warning bg-warning/5' :
        'border-success bg-success/5'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-3 rounded-full',
                level === 'critical' ? 'bg-destructive text-destructive-foreground' :
                level === 'high' ? 'bg-orange-500 text-white' :
                level === 'medium' ? 'bg-warning text-warning-foreground' :
                'bg-success text-success-foreground'
              )}>
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'bn' ? 'থ্রেট লেভেল' : 'Threat Level'}
                </p>
                <p className={cn('text-2xl font-bold uppercase', threatLevelColors[level])}>
                  {level}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {language === 'bn' ? 'গত ২৪ ঘণ্টা' : 'Last 24 Hours'}
              </p>
              <p className="text-lg font-bold">{summary?.totalEvents24h || 0} events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSummaryCards = () => {
    if (summaryLoading) {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
      );
    }

    const cards = [
      {
        label: language === 'bn' ? 'ক্রিটিক্যাল ইভেন্ট' : 'Critical Events',
        value: summary?.criticalUnresolved || 0,
        icon: AlertCircle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
      },
      {
        label: language === 'bn' ? 'ব্যর্থ লগইন' : 'Failed Logins',
        value: summary?.failedLogins || 0,
        icon: Lock,
        color: 'text-warning',
        bg: 'bg-warning/10',
      },
      {
        label: language === 'bn' ? 'রেট লিমিট হিট' : 'Rate Limit Hits',
        value: summary?.rateLimitHits || 0,
        icon: Activity,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
      },
      {
        label: language === 'bn' ? 'সন্দেহজনক কার্যকলাপ' : 'Suspicious Activity',
        value: summary?.suspiciousActivity || 0,
        icon: AlertTriangle,
        color: 'text-primary',
        bg: 'bg-primary/10',
      },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', card.bg)}>
                  <card.icon className={cn('h-4 w-4', card.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className={cn('text-xl font-bold', card.color)}>{card.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderEventCard = (event: SecurityEvent) => (
    <div
      key={event.id}
      className={cn(
        'p-4 rounded-lg border',
        severityColors[event.severity as keyof typeof severityColors] || severityColors.info
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={event.resolved ? 'secondary' : 'outline'} className="text-xs">
              {event.event_type.replace(/_/g, ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs uppercase">
              {event.severity}
            </Badge>
            {event.resolved && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {language === 'bn' ? 'সমাধান হয়েছে' : 'Resolved'}
              </Badge>
            )}
          </div>
          <p className="text-sm mt-2 line-clamp-2">
            {JSON.stringify(event.details).substring(0, 150)}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(event.created_at), 'MMM dd, HH:mm')}
            </span>
            {event.ip_address && (
              <span>IP: {event.ip_address}</span>
            )}
          </div>
        </div>
        {!event.resolved && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleResolve(event.id)}
            disabled={resolveEvent.isPending}
          >
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderActionLog = (log: AdminActionLog) => (
    <div
      key={log.id}
      className="p-3 rounded-lg border bg-card"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {log.action_type.replace(/_/g, ' ')}
          </Badge>
          {log.requires_reauth && (
            <Badge variant={log.reauth_verified ? 'default' : 'secondary'} className="text-xs">
              {log.reauth_verified ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
              {log.reauth_verified ? 'Verified' : 'Required'}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {format(new Date(log.created_at), 'MMM dd, HH:mm')}
        </span>
      </div>
      {log.target_type && (
        <p className="text-xs text-muted-foreground mt-1">
          Target: {log.target_type} / {log.target_id}
        </p>
      )}
    </div>
  );

  return (
    <>
      <SEOHead
        title={language === 'bn' ? 'নিরাপত্তা মনিটরিং' : 'Security Monitoring'}
        description="Security monitoring dashboard"
        canonicalUrl="/admin/security"
      />

      <div className={cn(isMobile ? 'pb-20' : 'p-6 lg:p-8')}>
        {/* Header */}
        <div className={cn('flex flex-col gap-4 mb-6', isMobile && 'px-4 pt-4')}>
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
              </Button>
              <h1 className={cn('font-bold flex items-center gap-2', isMobile ? 'text-xl' : 'text-3xl')}>
                <Shield className="h-6 w-6 text-primary" />
                {language === 'bn' ? 'নিরাপত্তা মনিটরিং' : 'Security Monitoring'}
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefreshAll}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </Button>
          </div>
        </div>

        <div className={cn('space-y-6', isMobile && 'px-4')}>
          {/* Threat Level */}
          {renderThreatIndicator()}

          {/* Summary Stats */}
          {renderSummaryCards()}

          {/* Tabs for Events and Actions */}
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="events" className="flex-1">
                {language === 'bn' ? 'সিকিউরিটি ইভেন্ট' : 'Security Events'}
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex-1">
                {language === 'bn' ? 'অ্যাডমিন অ্যাকশন' : 'Admin Actions'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'bn' ? 'সব' : 'All'}</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'bn' ? 'সব' : 'All'}</SelectItem>
                    <SelectItem value="unresolved">{language === 'bn' ? 'অমীমাংসিত' : 'Unresolved'}</SelectItem>
                    <SelectItem value="resolved">{language === 'bn' ? 'সমাধান হয়েছে' : 'Resolved'}</SelectItem>
                  </SelectContent>
                </Select>

                {eventTypes.length > 0 && (
                  <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{language === 'bn' ? 'সব টাইপ' : 'All Types'}</SelectItem>
                      {eventTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Events List */}
              {eventsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24" />)}
                </div>
              ) : events && events.length > 0 ? (
                <div className="space-y-3">
                  {events.map(renderEventCard)}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'bn' ? 'কোন ইভেন্ট পাওয়া যায়নি' : 'No events found'}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {actionsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
                </div>
              ) : actionLogs && actionLogs.length > 0 ? (
                <div className="space-y-2">
                  {actionLogs.map(renderActionLog)}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{language === 'bn' ? 'কোন অ্যাকশন লগ নেই' : 'No action logs found'}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SecurityMonitoringPage;
