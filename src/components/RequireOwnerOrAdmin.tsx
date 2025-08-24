import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireOwnerOrAdminProps {
  children: React.ReactNode;
}

const RequireOwnerOrAdmin: React.FC<RequireOwnerOrAdminProps> = ({ children }) => {
  const { role, loading } = useAuthProfile();

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!['owner', 'admin'].includes(role)) {
    return <Navigate to="/mitt-fixco" replace />;
  }

  return <>{children}</>;
};

export default RequireOwnerOrAdmin;