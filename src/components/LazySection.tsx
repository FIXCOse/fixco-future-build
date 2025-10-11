import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Skeleton } from '@/components/ui/skeleton';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}

export const LazySection = ({ 
  children, 
  fallback = <Skeleton className="h-96 w-full" />,
  rootMargin = '200px'
}: LazySectionProps) => {
  const { ref, isVisible } = useIntersectionObserver({ 
    rootMargin,
    freezeOnceVisible: true 
  });

  return (
    <div ref={ref} className="min-h-[100px]">
      {isVisible ? children : fallback}
    </div>
  );
};
