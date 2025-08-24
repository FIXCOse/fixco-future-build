import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import RequireOwnerOrAdmin from '@/components/RequireOwnerOrAdmin';
import AdminDashboardContent from '@/components/AdminDashboardContent';

const MyFixcoLayout = () => {
  const { role, loading } = useAuthProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 bg-background/80 border-b border-border" />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // For admin/owner users, show tabs
  if (['owner', 'admin'].includes(role)) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Översikt</TabsTrigger>
                <TabsTrigger value="administration">Administration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Outlet />
              </TabsContent>
              
              <TabsContent value="administration">
                <RequireOwnerOrAdmin>
                  <AdminDashboardContent />
                </RequireOwnerOrAdmin>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  // For regular users, show simple layout (no changes)
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyFixcoLayout;