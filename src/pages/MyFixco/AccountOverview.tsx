import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  Home, 
  Receipt, 
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthProfile } from '@/hooks/useAuthProfile';

interface DashboardKPI {
  bookings: number;
  revenue: number;
  rot_savings: number;
  new_users: number;
  pending_quotes: number;
  unpaid_invoices: number;
}

const AccountOverview = () => {
  const { profile } = useAuthProfile();

  // Fetch today's KPIs
  const { data: kpiData } = useQuery({
    queryKey: ['kpi-today'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('kpi_today');
      if (error) throw error;
      return data as any as DashboardKPI;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const quickActions = [
    {
      title: 'Boka tjänst',
      description: 'Boka en ny tjänst',
      icon: Calendar,
      href: '/tjanster',
      variant: 'default' as const
    },
    {
      title: 'Mina fastigheter',
      description: 'Hantera fastigheter',
      icon: Home,
      href: '/mitt-fixco/properties',
      variant: 'outline' as const
    },
    {
      title: 'Se fakturor',
      description: 'Visa alla fakturor',
      icon: Receipt,
      href: '/mitt-fixco/invoices',
      variant: 'outline' as const
    },
    {
      title: 'ROT & RUT',
      description: 'Se skatteåterbäring',
      icon: TrendingUp,
      href: '/mitt-fixco/rot-rut',
      variant: 'outline' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Välkommen, {profile?.first_name || 'Användare'}!
          </h1>
          <p className="text-muted-foreground">
            Här är en översikt över dina aktiviteter
          </p>
        </div>
        <Badge variant="secondary">
          {profile?.role === 'owner' && 'Ägare'}
          {profile?.role === 'admin' && 'Administratör'}
          {profile?.role === 'staff' && 'Personal'}
          {profile?.role === 'customer' && 'Kund'}
        </Badge>
      </div>

      {/* KPI Cards for today */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bokningar idag</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData?.bookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              Nya bokningar idag
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intäkter idag</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData?.revenue?.toLocaleString('sv-SE') || 0} kr</div>
            <p className="text-xs text-muted-foreground">
              Betalda fakturor idag
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROT/RUT besparingar</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData?.rot_savings?.toLocaleString('sv-SE') || 0} kr</div>
            <p className="text-xs text-muted-foreground">
              Besparingar idag
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Väntande offerter</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData?.pending_quotes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Offerter att granska
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snabbåtgärder</CardTitle>
          <CardDescription>
            Vanliga uppgifter du kan utföra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant={action.variant}
                size="lg"
                className="h-auto p-4 justify-start"
                onClick={() => window.location.href = action.href}
              >
                <action.icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kontosammanfattning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Lojalitetspoäng</span>
              <Badge variant="outline">{profile?.loyalty_points || 0} poäng</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Medlem sedan</span>
              <span className="text-sm text-muted-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('sv-SE') : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total spenderat</span>
              <span className="font-medium">
                {profile?.total_spent?.toLocaleString('sv-SE') || 0} kr
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpiData?.unpaid_invoices ? (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {kpiData.unpaid_invoices} obetalda fakturor
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Alla fakturor är betalda</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">
                Kontotyp: {profile?.user_type === 'private' ? 'Privatperson' : 
                          profile?.user_type === 'company' ? 'Företag' : 'BRF'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountOverview;