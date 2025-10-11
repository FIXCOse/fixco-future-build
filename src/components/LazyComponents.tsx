import { lazy, Suspense, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components for better initial load
export const LazyProjectShowcase = lazy(() => import('@/components/ProjectShowcase'));
export const LazyComparisonUltra = lazy(() => import('@/components/ComparisonUltra'));
export const LazyServiceTeaserGrid = lazy(() => import('@/components/ServiceTeaserGrid'));
export const LazyFAQTeaser = lazy(() => import('@/components/FAQTeaser'));

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
