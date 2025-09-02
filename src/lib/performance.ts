/**
 * Performance monitoring utilities for Luxora
 */

// Performance monitoring for client-side
export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName: string, startTime: number) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(`🚀 ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
      
      // Warn if render time is too high
      if (renderTime > 16) { // 60fps threshold
        console.warn(`⚠️ ${componentName} render time exceeded 16ms (${renderTime.toFixed(2)}ms)`);
      }
    }
  },

  // Measure API call performance
  measureApiCall: async <T>(
    apiName: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌐 ${apiName} completed in ${duration.toFixed(2)}ms`);
        
        if (duration > 1000) {
          console.warn(`⚠️ ${apiName} took longer than 1s (${duration.toFixed(2)}ms)`);
        }
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${apiName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  },

  // Measure database query performance
  measureDbQuery: async <T>(
    queryName: string,
    query: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await query();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🗄️ ${queryName} executed in ${duration.toFixed(2)}ms`);
        
        if (duration > 500) {
          console.warn(`⚠️ ${queryName} took longer than 500ms (${duration.toFixed(2)}ms)`);
        }
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${queryName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  },
};

// Web Vitals monitoring
export const webVitals = {
  // Report Core Web Vitals
  reportWebVitals: (metric: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vital:', metric);
    }
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics, Vercel Analytics, etc.
      // gtag('event', metric.name, {
      //   value: Math.round(metric.value),
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
    }
  },
};

// Bundle size monitoring
export const bundleAnalyzer = {
  // Log bundle size warnings
  checkBundleSize: (componentName: string, size: number) => {
    if (process.env.NODE_ENV === 'development') {
      if (size > 100000) { // 100KB
        console.warn(`📦 ${componentName} bundle size is large: ${(size / 1024).toFixed(2)}KB`);
      }
    }
  },
};

// Memory usage monitoring
export const memoryMonitor = {
  // Check memory usage
  checkMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const used = memory.usedJSHeapSize / 1024 / 1024; // MB
      const total = memory.totalJSHeapSize / 1024 / 1024; // MB
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🧠 Memory usage: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
        
        if (used > 50) { // 50MB threshold
          console.warn(`⚠️ High memory usage detected: ${used.toFixed(2)}MB`);
        }
      }
    }
  },
};

// Image optimization utilities
export const imageOptimizer = {
  // Generate optimized image URLs
  getOptimizedImageUrl: (url: string, width?: number, height?: number, quality = 80) => {
    if (!url) return '';
    
    // If it's an ImageKit URL, add optimization parameters
    if (url.includes('ik.imagekit.io')) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', quality.toString());
      params.set('f', 'auto'); // Auto format
      
      return `${url}?${params.toString()}`;
    }
    
    return url;
  },

  // Preload critical images
  preloadImage: (url: string) => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    }
  },
};

// Cache utilities
export const cacheUtils = {
  // Simple in-memory cache
  cache: new Map<string, { data: any; timestamp: number; ttl: number }>(),

  // Set cache entry
  set: (key: string, data: any, ttl = 300000) => { // 5 minutes default
    cacheUtils.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  },

  // Get cache entry
  get: (key: string) => {
    const entry = cacheUtils.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      cacheUtils.cache.delete(key);
      return null;
    }
    
    return entry.data;
  },

  // Clear cache
  clear: () => {
    cacheUtils.cache.clear();
  },

  // Clear expired entries
  clearExpired: () => {
    const now = Date.now();
    for (const [key, entry] of cacheUtils.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        cacheUtils.cache.delete(key);
      }
    }
  },
};
