'use client';

import React from 'react';
import { useState, useEffect, ComponentType } from 'react';

interface DynamicImportOptions {
  loadingComponent?: ComponentType;
  errorComponent?: ComponentType<{ error: Error; retry: () => void }>;
  delay?: number;
  timeout?: number;
}

interface DynamicImportResult<T extends ComponentType<any>> {
  Component: T | null;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}

export const useDynamicImport = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): DynamicImportResult<T> => {
  const {
    loadingComponent: LoadingComponent,
    errorComponent: ErrorComponent,
    delay = 200,
    timeout = 10000
  } = options;

  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const loadComponent = async () => {
    setLoading(true);
    setError(null);

    // Add delay to prevent flicker for fast loads
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Component load timeout')), timeout);
      });

      const componentPromise = importFunction();
      
      const result = await Promise.race([componentPromise, timeoutPromise]) as { default: T };
      setComponent(result.default);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load component'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComponent();
  }, [retryKey]);

  const retry = () => {
    setRetryKey(prev => prev + 1);
  };

  // Render loading component
  if (loading && LoadingComponent) {
    return { Component: LoadingComponent as T, loading, error, retry };
  }

  // Render error component
  if (error && ErrorComponent) {
    return { 
      Component: React.createElement(ErrorComponent, { error, retry }) as unknown as T, 
      loading, 
      error, 
      retry 
    };
  }

  return { Component, loading, error, retry };
};

// Preload components for better performance
export const preloadComponent = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>
): Promise<{ default: T }> => {
  return importFunction();
};

// Intersection Observer for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
};

// Image lazy loading hook
export const useLazyImage = (src: string, options?: IntersectionObserverInit) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const isIntersecting = useIntersectionObserver(imgRef, options);

  useEffect(() => {
    if (!isIntersecting || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
      setError(null);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setLoading(false);
    };

    img.src = src;
  }, [isIntersecting, src]);

  return {
    ref: imgRef,
    src: imageSrc,
    loading,
    error,
    retry: () => {
      if (src) {
        const img = new Image();
        img.onload = () => {
          setImageSrc(src);
          setLoading(false);
          setError(null);
        };
        img.onerror = () => {
          setError('Failed to load image');
          setLoading(false);
        };
        img.src = src;
      }
    }
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({
            ...prev,
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    // Monitor memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize
      }));
    }

    return () => observer.disconnect();
  }, []);

  return metrics;
};

// Debounced value hook for performance
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length - 1
  );

  const visibleItems = items.slice(visibleStart, visibleEnd + 1);
  const offsetY = visibleStart * itemHeight;

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    offsetY,
    totalHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};
