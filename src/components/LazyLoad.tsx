'use client';

import React, { Suspense, lazy, ComponentType, memo } from 'react';
import CardSkeleton from '@/components/CardSkeleton';

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyLoad Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center text-red-500">
            Failed to load component. Please try again.
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Higher-order component for lazy loading with error handling
export function withLazyLoad<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode,
  errorFallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return memo(function LazyWrapper(props: T) {
    return (
      <LazyErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback || <CardSkeleton />}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    );
  });
}

// Lazy load heavy components with optimized fallbacks
export const LazyProductDetails = withLazyLoad(
  () => import('./ProductDetails'),
  <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
  <div className="p-4 text-center text-gray-500">
    Failed to load product details
  </div>
);

export const LazyProductCard = withLazyLoad(
  () => import('./ProductCard'),
  <CardSkeleton />,
  <div className="p-4 text-center text-gray-500">Failed to load product</div>
);

export const LazyFeaturedProducts = withLazyLoad(
  () => import('./FeaturedProducts'),
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>,
  <div className="p-4 text-center text-gray-500">
    Failed to load featured products
  </div>
);

// Optimized Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsIntersecting(true);
          setHasIntersected(true);
          observer.disconnect(); // Stop observing once intersected
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // Increased for better UX
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options, hasIntersected]);

  return { isIntersecting, hasIntersected };
}

// Optimized lazy load images with intersection observer
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = memo(
  ({
    src,
    alt,
    className = '',
    width,
    height,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
    onLoad,
    onError,
  }: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [isInView, setIsInView] = React.useState(false);
    const imgRef = React.useRef<HTMLDivElement>(null);

    const observer = React.useRef<IntersectionObserver | null>(null);

    React.useEffect(() => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.current?.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      );

      if (imgRef.current) {
        observer.current.observe(imgRef.current);
      }

      return () => observer.current?.disconnect();
    }, []);

    const handleLoad = React.useCallback(() => {
      setIsLoaded(true);
      onLoad?.();
    }, [onLoad]);

    const handleError = React.useCallback(() => {
      setHasError(true);
      onError?.();
    }, [onError]);

    return (
      <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
        {isInView && !hasError && (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
          />
        )}
        {!isLoaded && !hasError && (
          <div
            className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
            style={{
              backgroundImage: `url(${placeholder})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            aria-label="Loading image..."
          />
        )}
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
            <span>Failed to load image</span>
          </div>
        )}
      </div>
    );
  }
);

LazyImage.displayName = 'LazyImage';

// Optimized virtual scrolling hook for large lists
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const { visibleItems, totalHeight, offsetY, startIndex, endIndex } =
    React.useMemo(() => {
      const startIndex = Math.max(
        0,
        Math.floor(scrollTop / itemHeight) - overscan
      );
      const endIndex = Math.min(
        items.length,
        startIndex + Math.ceil(containerHeight / itemHeight) + overscan * 2
      );

      const visibleItems = items.slice(startIndex, endIndex);
      const totalHeight = items.length * itemHeight;
      const offsetY = startIndex * itemHeight;

      return {
        visibleItems,
        totalHeight,
        offsetY,
        startIndex,
        endIndex,
      };
    }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const handleScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop);
    },
    []
  );

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll,
  };
}
