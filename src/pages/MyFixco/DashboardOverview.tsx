import { useRole } from '@/hooks/useRole';
import { Navigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardKPICards } from '@/components/admin/dashboard/DashboardKPICards';
import { DashboardQuickActions } from '@/components/admin/dashboard/DashboardQuickActions';
import { DashboardRevenueChart } from '@/components/admin/dashboard/DashboardRevenueChart';
import { DashboardJobsChart } from '@/components/admin/dashboard/DashboardJobsChart';
import { DashboardActivityFeed } from '@/components/admin/dashboard/DashboardActivityFeed';
import { DashboardOngoingProjects } from '@/components/admin/dashboard/DashboardOngoingProjects';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

const DashboardOverview = () => {
  const { isAdmin, loading } = useRole();
  const { profile } = useAuthProfile();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/mitt-fixco" replace />;
  }

  const greeting = `Välkommen tillbaka, ${profile?.first_name || 'Admin'}! 👋`;
  const today = format(new Date(), "d MMMM yyyy", { locale: sv });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{greeting}</h1>
        <p className="text-muted-foreground">
          {today}
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardKPICards />

      {/* Quick Actions */}
      <DashboardQuickActions />

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardRevenueChart />
        <DashboardJobsChart />
      </div>

      {/* Activity & Projects Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <DashboardActivityFeed />
        <DashboardOngoingProjects />
      </div>
    </div>
  );
};

export default DashboardOverview;
