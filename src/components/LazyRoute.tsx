import { Suspense, ComponentType, ReactElement } from 'react';

// Suspense fallback component
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Helper to wrap lazy-loaded components in Suspense
export const LazyRoute = ({ component: Component }: { component: ComponentType<any> }) => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Component />
    </Suspense>
  );
};

// Helper for routes with props
export const lazyElement = (Component: ComponentType<any>, props?: any): ReactElement => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Component {...props} />
    </Suspense>
  );
};
