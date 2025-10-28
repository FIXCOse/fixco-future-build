import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { Skeleton } from '@/components/ui/skeleton';

interface RequireOwnerOrAdminProps {
  children: React.ReactNode;
}

const RequireOwnerOrAdmin: React.FC<RequireOwnerOrAdminProps> = ({ children }) => {
  const { isAdmin, isOwner, loading } = useRole();

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isAdmin && !isOwner) {
    return <Navigate to="/mitt-fixco" replace />;
  }

  return <>{children}</>;
};

export default RequireOwnerOrAdmin;