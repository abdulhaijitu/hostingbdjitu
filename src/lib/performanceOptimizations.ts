/**
 * Performance optimization utilities
 */

// Debounce function for scroll/resize handlers
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Throttle function for frequent events
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Preload multiple images
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

// Check if browser supports native lazy loading
export function supportsLazyLoading(): boolean {
  return 'loading' in HTMLImageElement.prototype;
}

// Check if browser supports IntersectionObserver
export function supportsIntersectionObserver(): boolean {
  return 'IntersectionObserver' in window;
}

// Request idle callback polyfill
export function requestIdleCallback(callback: () => void): void {
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
}

// Measure component render time
export function measureRenderTime(componentName: string): () => void {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
    }
  };
}

// Check connection speed
export function getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
  const connection = (navigator as Navigator & { 
    connection?: { 
      effectiveType?: string;
      downlink?: number;
    } 
  }).connection;

  if (!connection) return 'fast';

  const effectiveType = connection.effectiveType;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'slow';
  }
  
  if (effectiveType === '3g') {
    return 'medium';
  }
  
  return 'fast';
}

// Defer non-critical operations
export function deferNonCritical(callback: () => void): void {
  if (document.readyState === 'complete') {
    requestIdleCallback(callback);
  } else {
    window.addEventListener('load', () => {
      requestIdleCallback(callback);
    });
  }
}

// Memory-efficient image observer
export function createImageObserver(
  onIntersect: (entry: IntersectionObserverEntry) => void
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(onIntersect);
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );
}
