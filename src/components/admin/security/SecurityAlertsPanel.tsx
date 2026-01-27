import React from 'react';
import { Shield, AlertTriangle, Activity, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useSecuritySummary } from '@/hooks/useSecurityMonitoring';
import { cn } from '@/lib/utils';

interface SecurityAlertsPanelProps {
  language?: 'en' | 'bn';
  className?: string;
}

const SecurityAlertsPanel: React.FC<SecurityAlertsPanelProps> = ({
  language = 'en',
  className,
}) => {
  const { data: summary, isLoading } = useSecuritySummary();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const threatLevel = summary?.threatLevel || 'low';
  const hasAlerts = (summary?.criticalUnresolved || 0) > 0 || 
                    (summary?.failedLogins || 0) > 5 ||
                    (summary?.suspiciousActivity || 0) > 0;

  const threatColors = {
    low: 'text-success border-success/30 bg-success/5',
    medium: 'text-warning border-warning/30 bg-warning/5',
    high: 'text-orange-500 border-orange-500/30 bg-orange-500/5',
    critical: 'text-destructive border-destructive/30 bg-destructive/5',
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            {language === 'bn' ? 'নিরাপত্তা স্ট্যাটাস' : 'Security Status'}
          </span>
          <Badge 
            variant="outline" 
            className={cn('uppercase text-xs', threatColors[threatLevel])}
          >
            {threatLevel}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasAlerts ? (
          <>
            {(summary?.criticalUnresolved || 0) > 0 && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    {summary?.criticalUnresolved} {language === 'bn' ? 'ক্রিটিক্যাল ইভেন্ট' : 'Critical Events'}
                  </p>
                </div>
              </div>
            )}
            
            {(summary?.failedLogins || 0) > 5 && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-warning/10 border border-warning/20">
                <Lock className="h-4 w-4 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-warning">
                    {summary?.failedLogins} {language === 'bn' ? 'ব্যর্থ লগইন চেষ্টা' : 'Failed Logins'}
                  </p>
                </div>
              </div>
            )}

            {(summary?.suspiciousActivity || 0) > 0 && (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Activity className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {summary?.suspiciousActivity} {language === 'bn' ? 'সন্দেহজনক কার্যকলাপ' : 'Suspicious Activity'}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
            <Shield className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm font-medium text-success">
                {language === 'bn' ? 'সব ঠিক আছে' : 'All Clear'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'bn' ? 'কোন সক্রিয় থ্রেট নেই' : 'No active threats detected'}
              </p>
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/admin/security">
            {language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecurityAlertsPanel;
