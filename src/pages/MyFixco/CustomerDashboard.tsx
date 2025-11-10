import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Receipt, Home, ArrowRight, TrendingUp } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

const CustomerDashboard = () => {
  const { profile, loading: profileLoading } = useAuthProfile();

  // Bokningar count
  const { data: bookingsCount = 0, isLoading: bookingsLoading } = useQuery({
    queryKey: ['customer-bookings-count', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', profile.id)
        .in('status', ['confirmed', 'pending']);
      return count || 0;
    },
    enabled: !!profile?.id
  });

  // Offerter count
  const { data: quotesCount = 0, isLoading: quotesLoading } = useQuery({
    queryKey: ['customer-quotes-count', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;
      const { count } = await supabase
        .from('quotes_new')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', profile.id)
        .eq('status', 'pending');
      return count || 0;
    },
    enabled: !!profile?.id
  });

  // Fakturor count
  const { data: invoicesCount = 0, isLoading: invoicesLoading } = useQuery({
    queryKey: ['customer-invoices-count', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;
      const { count } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', profile.id)
        .in('status', ['draft', 'sent']);
      return count || 0;
    },
    enabled: !!profile?.id
  });

  // Total utgifter detta år
  const { data: totalSpent = 0, isLoading: spentLoading } = useQuery({
    queryKey: ['customer-total-spent', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return 0;
      const currentYear = new Date().getFullYear();
      const { data } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('customer_id', profile.id)
        .eq('status', 'paid')
        .gte('issue_date', `${currentYear}-01-01`)
        .lte('issue_date', `${currentYear}-12-31`);
      
      return data?.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0) || 0;
    },
    enabled: !!profile?.id
  });

  // Senaste aktiviteter
  const { data: recentActivities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['customer-recent-activities', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data } = await supabase
        .from('bookings')
        .select('id, service_slug, status, created_at, payload')
        .eq('customer_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!profile?.id
  });

  if (profileLoading || !profile) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const profileWithDefaults = {
    ...profile,
    loyalty_tier: 'bronze' as const,
    company_name: undefined,
    brf_name: undefined
  };

  const stats = {
    upcomingBookings: bookingsCount || 0,
    pendingQuotes: quotesCount || 0,
    unpaidInvoices: invoicesCount || 0,
    rotRutSavings: totalSpent || 0
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader profile={profileWithDefaults} stats={stats} />

      {/* Snabblänkar */}
      <Card>
        <CardHeader>
          <CardTitle>Snabblänkar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/tjanster">Boka tjänst</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/mitt-fixco/properties">
              <Home className="mr-2 h-4 w-4" />
              Mina fastigheter
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/mitt-fixco/invoices">
              <Receipt className="mr-2 h-4 w-4" />
              Mina fakturor
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/mitt-fixco/rot-rut">
              <TrendingUp className="mr-2 h-4 w-4" />
              ROT & RUT
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Senaste aktiviteter */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste aktiviteter</CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Inga aktiviteter än. Börja med att boka en tjänst!</p>
              <Button asChild className="mt-4">
                <Link to="/tjanster">Boka nu</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium capitalize">
                      {activity.service_slug?.replace(/-/g, ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(activity.created_at), 'PPP', { locale: sv })}
                    </p>
                  </div>
                  <Badge variant={
                    activity.status === 'confirmed' ? 'default' :
                    activity.status === 'pending' ? 'secondary' :
                    activity.status === 'completed' ? 'default' : 'outline'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
              <Button asChild variant="ghost" className="w-full mt-4">
                <Link to="/mitt-fixco/history" className="flex items-center justify-center">
                  Se alla aktiviteter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
