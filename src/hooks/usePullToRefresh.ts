import { useState, useCallback, useRef, useEffect } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  enabled?: boolean;
}

interface UsePullToRefreshReturn {
  isRefreshing: boolean;
  pullDistance: number;
  containerRef: React.RefObject<HTMLDivElement>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  enabled = true,
}: UsePullToRefreshOptions): UsePullToRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    // Only start pull if at top of scroll container
    const container = containerRef.current;
    if (!container || container.scrollTop > 5) return;
    
    startY.current = e.touches[0].clientY;
    isPulling.current = true;
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || !enabled || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    // Only allow pulling down
    if (diff < 0) {
      setPullDistance(0);
      return;
    }
    
    // Apply resistance (the further you pull, the harder it gets)
    const resistance = 0.4;
    const distance = Math.min(diff * resistance, threshold * 1.5);
    setPullDistance(distance);
  }, [enabled, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || !enabled) return;
    isPulling.current = false;
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  }, [enabled, pullDistance, threshold, onRefresh]);

  // Reset state on unmount
  useEffect(() => {
    return () => {
      setPullDistance(0);
      setIsRefreshing(false);
    };
  }, []);

  return {
    isRefreshing,
    pullDistance,
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}

export default usePullToRefresh;
