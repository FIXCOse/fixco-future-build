import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';

interface ProtectedRouteProps {
  children: ReactNode;
  flagKey: string;
  fallback?: string;
}

export function ProtectedRoute({ children, flagKey, fallback = '/' }: ProtectedRouteProps) {
  const { data: enabled, isLoading } = useFeatureFlag(flagKey);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!enabled) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
