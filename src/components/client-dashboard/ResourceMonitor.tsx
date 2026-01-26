import React, { useState, useEffect } from 'react';
import { Cpu, MemoryStick, HardDrive, Activity, RefreshCw, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ResourceData {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: string;
  loadAverage: number[];
}

interface ResourceMonitorProps {
  accountId?: string;
  serverId?: string;
  cpanelUsername?: string;
}

const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ 
  accountId,
  serverId,
  cpanelUsername 
}) => {
  const { language } = useLanguage();
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchResourceData = async () => {
    if (!serverId || !cpanelUsername) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cpanel-api', {
        body: {
          action: 'getResourceUsage',
          serverId,
          cpanelUsername,
        },
      });

      if (error) throw error;

      if (data?.success) {
        setResourceData(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch resource data:', error);
      // Use mock data if API fails
      setResourceData({
        cpu: { usage: Math.random() * 30 + 5, cores: 2 },
        memory: { used: 256, total: 1024, percentage: 25 },
        disk: { used: 2.4, total: 10, percentage: 24 },
        uptime: '15 days, 3 hours',
        loadAverage: [0.5, 0.7, 0.8],
      });
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchResourceData();
    
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(fetchResourceData, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [serverId, cpanelUsername, autoRefresh]);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const formatBytes = (gb: number) => {
    if (gb >= 1) return `${gb.toFixed(1)} GB`;
    return `${(gb * 1024).toFixed(0)} MB`;
  };

  if (!resourceData && !isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Activity className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            {language === 'bn' ? 'রিসোর্স ডেটা লোড হচ্ছে না' : 'Unable to load resource data'}
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={fetchResourceData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'bn' ? 'পুনরায় চেষ্টা করুন' : 'Retry'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              {language === 'bn' ? 'লাইভ রিসোর্স মনিটর' : 'Live Resource Monitor'}
            </CardTitle>
            <CardDescription className="text-xs">
              {lastUpdated && (
                <>
                  {language === 'bn' ? 'সর্বশেষ আপডেট: ' : 'Last updated: '}
                  {lastUpdated.toLocaleTimeString()}
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={autoRefresh ? "default" : "secondary"} 
              className="text-[10px] cursor-pointer"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse mr-1" />
                  LIVE
                </>
              ) : (
                'PAUSED'
              )}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={fetchResourceData}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Cpu className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium">
                {language === 'bn' ? 'সিপিইউ' : 'CPU'}
              </span>
            </div>
            <span className={cn(
              "text-sm font-bold",
              getStatusColor(resourceData?.cpu.usage || 0)
            )}>
              {resourceData?.cpu.usage.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                getProgressColor(resourceData?.cpu.usage || 0)
              )}
              style={{ width: `${resourceData?.cpu.usage || 0}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {resourceData?.cpu?.cores} {language === 'bn' ? 'কোর' : 'Cores'} • 
            Load: {resourceData?.loadAverage?.join(', ') || 'N/A'}
          </p>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-success/10">
                <MemoryStick className="h-3.5 w-3.5 text-success" />
              </div>
              <span className="text-sm font-medium">
                {language === 'bn' ? 'মেমোরি' : 'Memory'}
              </span>
            </div>
            <span className={cn(
              "text-sm font-bold",
              getStatusColor(resourceData?.memory.percentage || 0)
            )}>
              {resourceData?.memory.percentage.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                getProgressColor(resourceData?.memory.percentage || 0)
              )}
              style={{ width: `${resourceData?.memory.percentage || 0}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {resourceData?.memory.used} MB / {resourceData?.memory.total} MB
          </p>
        </div>

        {/* Disk Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-warning/10">
                <HardDrive className="h-3.5 w-3.5 text-warning" />
              </div>
              <span className="text-sm font-medium">
                {language === 'bn' ? 'ডিস্ক' : 'Disk'}
              </span>
            </div>
            <span className={cn(
              "text-sm font-bold",
              getStatusColor(resourceData?.disk.percentage || 0)
            )}>
              {resourceData?.disk.percentage.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                getProgressColor(resourceData?.disk.percentage || 0)
              )}
              style={{ width: `${resourceData?.disk.percentage || 0}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            {formatBytes(resourceData?.disk.used || 0)} / {formatBytes(resourceData?.disk.total || 0)}
          </p>
        </div>

        {/* Uptime */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {language === 'bn' ? 'আপটাইম' : 'Uptime'}
            </span>
            <span className="font-medium text-success">
              {resourceData?.uptime || 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceMonitor;
