import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Clock, AlertTriangle, TrendingUp, RefreshCw, Trash2 } from 'lucide-react';
import { adminAnalytics, PerformanceStats } from '@/lib/adminAnalytics';

/**
 * Performance Monitor Widget for Admin Dashboard
 * Shows real-time performance metrics
 */
const PerformanceMonitor = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loadTimesByPage, setLoadTimesByPage] = useState<Record<string, { avg: number; count: number; min: number; max: number }>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      setStats(adminAnalytics.getStats());
      setLoadTimesByPage(adminAnalytics.getLoadTimesByPage());
    };

    updateStats();

    // Auto-refresh every 5 seconds
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClear = () => {
    adminAnalytics.clear();
    setRefreshKey(prev => prev + 1);
  };

  const getLoadTimeColor = (time: number) => {
    if (time < 300) return 'text-green-600 dark:text-green-400';
    if (time < 1000) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getLoadTimeBadge = (time: number) => {
    if (time < 300) return 'default';
    if (time < 1000) return 'secondary';
    return 'destructive';
  };

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              পারফরম্যান্স মনিটর
            </CardTitle>
            <CardDescription>
              অ্যাডমিন পেজ লোড টাইম এবং এরর ট্র্যাকিং
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="h-3 w-3" />
              মোট লোড
            </div>
            <div className="text-xl font-bold">{stats.totalPageLoads}</div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Clock className="h-3 w-3" />
              গড় সময়
            </div>
            <div className={`text-xl font-bold ${getLoadTimeColor(stats.averageLoadTime)}`}>
              {stats.averageLoadTime}ms
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <AlertTriangle className="h-3 w-3" />
              এরর
            </div>
            <div className={`text-xl font-bold ${stats.errorCount > 0 ? 'text-destructive' : 'text-green-600'}`}>
              {stats.errorCount}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Activity className="h-3 w-3" />
              ধীরতম পেজ
            </div>
            <div className="text-sm font-medium truncate">
              {stats.slowestPage || '-'}
            </div>
          </div>
        </div>

        {/* Page Load Times */}
        {Object.keys(loadTimesByPage).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">পেজ লোড টাইম</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(loadTimesByPage)
                .sort((a, b) => b[1].avg - a[1].avg)
                .map(([page, data]) => (
                  <div
                    key={page}
                    className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/30 text-sm"
                  >
                    <span className="font-medium truncate max-w-[40%]">{page}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {data.count}x
                      </span>
                      <Badge variant={getLoadTimeBadge(data.avg)}>
                        {data.avg}ms
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({data.min}-{data.max})
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Errors */}
        {adminAnalytics.getErrors().length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-destructive flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              সাম্প্রতিক এরর
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {adminAnalytics.getErrors().slice(-5).reverse().map((error, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-destructive/5 border border-destructive/20 text-xs"
                >
                  <div className="font-medium text-destructive">{error.pageName}</div>
                  <div className="text-muted-foreground truncate">{error.error}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.totalPageLoads === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            কোনো পারফরম্যান্স ডেটা নেই। পেজ নেভিগেট করলে এখানে দেখাবে।
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
