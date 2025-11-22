import { lazy, Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components for better initial load
const LazyProjectShowcaseBase = lazy(() => import('@/components/ProjectShowcase'));
const LazyComparisonUltraBase = lazy(() => import('@/components/ComparisonUltra'));
const LazyServiceTeaserGridBase = lazy(() => import('@/components/ServiceTeaserGrid'));
const LazyFAQTeaserBase = lazy(() => import('@/components/FAQTeaser'));

// Loading fallback component
const ComponentSkeleton = () => (
  <div className="w-full py-24 space-y-4">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-6 w-1/2 mx-auto" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  </div>
);

// Wrapper component with Suspense
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback = <ComponentSkeleton />
) => {
  return (props: P) => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Export Suspense-wrapped versions ready to use
export const LazyProjectShowcase = () => (
  <Suspense fallback={<ComponentSkeleton />}>
    <LazyProjectShowcaseBase />
  </Suspense>
);

export const LazyComparisonUltra = () => (
  <Suspense fallback={<ComponentSkeleton />}>
    <LazyComparisonUltraBase />
  </Suspense>
);

export const LazyServiceTeaserGrid = () => (
  <Suspense fallback={<ComponentSkeleton />}>
    <LazyServiceTeaserGridBase />
  </Suspense>
);

export const LazyFAQTeaser = () => (
  <Suspense fallback={<ComponentSkeleton />}>
    <LazyFAQTeaserBase />
  </Suspense>
);
