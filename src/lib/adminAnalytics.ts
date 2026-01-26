/**
 * Admin Analytics Service
 * Tracks page load times, errors, and performance metrics
 */

interface PageLoadEvent {
  pageName: string;
  route: string;
  loadTime: number;
  timestamp: Date;
}

interface DataLoadEvent {
  pageName: string;
  dataName: string;
  route: string;
  loadTime: number;
  timestamp: Date;
}

interface ErrorEvent {
  pageName: string;
  route: string;
  error: string;
  stack?: string;
  timestamp: Date;
}

interface PerformanceStats {
  totalPageLoads: number;
  averageLoadTime: number;
  slowestPage: string | null;
  fastestPage: string | null;
  errorCount: number;
  recentEvents: Array<PageLoadEvent | ErrorEvent>;
}

// In-memory store for analytics (could be extended to persist to database)
class AdminAnalyticsService {
  private pageLoads: PageLoadEvent[] = [];
  private dataLoads: DataLoadEvent[] = [];
  private errors: ErrorEvent[] = [];
  private maxStoredEvents = 100;
  private slowLoadThreshold = 1000; // 1 second

  /**
   * Track page load performance
   */
  trackPageLoad(event: PageLoadEvent): void {
    this.pageLoads.push(event);
    
    // Keep only recent events
    if (this.pageLoads.length > this.maxStoredEvents) {
      this.pageLoads = this.pageLoads.slice(-this.maxStoredEvents);
    }

    // Log slow pages
    if (event.loadTime > this.slowLoadThreshold) {
      console.warn(
        `[AdminAnalytics] Slow page load: ${event.pageName} (${event.loadTime}ms)`,
        { route: event.route }
      );
    }

    // Debug log in development
    if (import.meta.env.DEV) {
      console.log(
        `[AdminAnalytics] Page loaded: ${event.pageName} in ${event.loadTime}ms`
      );
    }
  }

  /**
   * Track data/API load performance
   */
  trackDataLoad(event: DataLoadEvent): void {
    this.dataLoads.push(event);
    
    if (this.dataLoads.length > this.maxStoredEvents) {
      this.dataLoads = this.dataLoads.slice(-this.maxStoredEvents);
    }

    // Log slow data loads
    if (event.loadTime > this.slowLoadThreshold) {
      console.warn(
        `[AdminAnalytics] Slow data load: ${event.dataName} on ${event.pageName} (${event.loadTime}ms)`
      );
    }

    if (import.meta.env.DEV) {
      console.log(
        `[AdminAnalytics] Data loaded: ${event.dataName} in ${event.loadTime}ms`
      );
    }
  }

  /**
   * Track errors
   */
  trackError(event: ErrorEvent): void {
    this.errors.push(event);
    
    if (this.errors.length > this.maxStoredEvents) {
      this.errors = this.errors.slice(-this.maxStoredEvents);
    }

    console.error(
      `[AdminAnalytics] Error on ${event.pageName}:`,
      event.error,
      { route: event.route, stack: event.stack }
    );
  }

  /**
   * Get performance statistics
   */
  getStats(): PerformanceStats {
    const totalPageLoads = this.pageLoads.length;
    
    if (totalPageLoads === 0) {
      return {
        totalPageLoads: 0,
        averageLoadTime: 0,
        slowestPage: null,
        fastestPage: null,
        errorCount: this.errors.length,
        recentEvents: [],
      };
    }

    const loadTimes = this.pageLoads.map(e => e.loadTime);
    const averageLoadTime = Math.round(
      loadTimes.reduce((a, b) => a + b, 0) / totalPageLoads
    );

    const sortedByTime = [...this.pageLoads].sort((a, b) => b.loadTime - a.loadTime);
    const slowestPage = sortedByTime[0]?.pageName ?? null;
    const fastestPage = sortedByTime[sortedByTime.length - 1]?.pageName ?? null;

    // Get recent events (last 10)
    const recentEvents = [...this.pageLoads, ...this.errors]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      totalPageLoads,
      averageLoadTime,
      slowestPage,
      fastestPage,
      errorCount: this.errors.length,
      recentEvents,
    };
  }

  /**
   * Get page load history
   */
  getPageLoads(): PageLoadEvent[] {
    return [...this.pageLoads];
  }

  /**
   * Get data load history
   */
  getDataLoads(): DataLoadEvent[] {
    return [...this.dataLoads];
  }

  /**
   * Get error history
   */
  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  /**
   * Get load times grouped by page
   */
  getLoadTimesByPage(): Record<string, { avg: number; count: number; min: number; max: number }> {
    const grouped: Record<string, number[]> = {};

    this.pageLoads.forEach(event => {
      if (!grouped[event.pageName]) {
        grouped[event.pageName] = [];
      }
      grouped[event.pageName].push(event.loadTime);
    });

    const result: Record<string, { avg: number; count: number; min: number; max: number }> = {};

    Object.entries(grouped).forEach(([page, times]) => {
      result[page] = {
        avg: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        count: times.length,
        min: Math.min(...times),
        max: Math.max(...times),
      };
    });

    return result;
  }

  /**
   * Clear all stored analytics
   */
  clear(): void {
    this.pageLoads = [];
    this.dataLoads = [];
    this.errors = [];
  }
}

// Export singleton instance
export const adminAnalytics = new AdminAnalyticsService();

// Export types
export type { PageLoadEvent, DataLoadEvent, ErrorEvent, PerformanceStats };
