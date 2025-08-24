import { Navigate, Outlet } from "react-router-dom";
import { useRole } from "@/hooks/useRole";
import { Skeleton } from "@/components/ui/skeleton";

interface RequireRoleProps {
  roles: Array<"owner" | "admin">;
}

export function RequireRole({ roles }: RequireRoleProps) {
  const { role, loading } = useRole();

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!role || !roles.includes(role as "owner" | "admin")) {
    return <Navigate to="/mitt-fixco" replace />;
  }

  return <Outlet />;
}