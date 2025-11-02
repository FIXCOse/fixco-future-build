import React from 'react';
import { useRole } from '@/hooks/useRole';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, BarChart3, Shield, Database, UserCheck, ArrowRight, Briefcase, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AdminPage = () => {
  const { isAdmin, isOwner, loading, role } = useRole();
  // Admin page with job management

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Redirect if not admin or owner
  if (!isAdmin) {
    return <Navigate to="/mitt-fixco" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administration</h1>
          <p className="text-muted-foreground">
            Hantera användare, inställningar och systemöversikt
          </p>
        </div>
        <Badge variant={isOwner ? "default" : "secondary"}>
          {isOwner ? "Ägare" : "Administratör"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <Link to="/admin/users" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Användarhantering
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Hantera kunder, personal och roller
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* System Settings */}
        <Link to="/admin/settings" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Systeminställningar
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Konfigurera systemparametrar och inställningar
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Analytics */}
        <Link to="/admin/reports" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Rapporter & Analys
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Översikt av verksamheten och KPI:er
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Security */}
        <Link to="/admin/security" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Säkerhet & Behörigheter
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Hantera åtkomst och säkerhetsinställningar
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Database Management */}
        <Link to="/admin/database" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Databashantering
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Backup, underhåll och datahantering
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Staff Management - For Admin and Owner */}
        {isAdmin && (
          <Link to="/admin/staff" className="block group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Personalhantering
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription>
                  Hantera anställda och deras behörigheter
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )}

        {/* Jobs Management */}
        <Link to="/admin/jobs" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Jobb Administration
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Hantera alla jobb, tilldelningar och ersättningar
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Worker Analytics */}
        <Link to="/admin/worker-analytics" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Worker Analytics
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Djupgående analys av worker prestanda och beteende
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* System Status */}
        <Link to="/admin/status" className="block group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Systemstatus
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
              <CardDescription>
                Övervaka systemets olika komponenter
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Systemstatus</CardTitle>
          <CardDescription>
            Aktuell status för systemets olika komponenter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Database</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Autentisering</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Betalningar</span>
              <Badge variant="default">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">Notifieringar</span>
              <Badge variant="default">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;