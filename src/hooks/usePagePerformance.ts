import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { adminAnalytics } from '@/lib/adminAnalytics';

interface PerformanceMetrics {
  route: string;
  loadTime: number;
  renderTime: number;
  timestamp: Date;
}

/**
 * Hook to track page load performance
 * Measures time from route change to component render completion
 */
export const usePagePerformance = (pageName: string) => {
  const location = useLocation();
  const startTimeRef = useRef<number>(performance.now());
  const hasTrackedRef = useRef(false);

  // Reset on route change
  useEffect(() => {
    startTimeRef.current = performance.now();
    hasTrackedRef.current = false;
  }, [location.pathname]);

  // Track when component is fully rendered
  useEffect(() => {
    if (hasTrackedRef.current) return;

    // Use requestAnimationFrame to ensure render is complete
    const frameId = requestAnimationFrame(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTimeRef.current;
      
      hasTrackedRef.current = true;

      adminAnalytics.trackPageLoad({
        pageName,
        route: location.pathname,
        loadTime: Math.round(loadTime),
        timestamp: new Date(),
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [pageName, location.pathname]);

  // Manual tracking function for async data loads
  const trackDataLoad = useCallback((dataName: string, startTime: number) => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    adminAnalytics.trackDataLoad({
      pageName,
      dataName,
      route: location.pathname,
      loadTime: Math.round(loadTime),
      timestamp: new Date(),
    });
  }, [pageName, location.pathname]);

  return { trackDataLoad };
};

export default usePagePerformance;
