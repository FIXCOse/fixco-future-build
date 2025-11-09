import { useAuthProfile } from '@/hooks/useAuthProfile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Calendar, FileText, Receipt, TrendingUp, Home, ArrowRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  loading?: boolean;
  format?: 'number' | 'currency';
}

const StatCard = ({ title, value, icon: Icon, loading, format: formatType = 'number' }: StatCardProps) => {
  const formattedValue = formatType === 'currency' 
    ? `${Number(value).toLocaleString('sv-SE')} kr`
    : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{formattedValue}</div>
        )}
      </CardContent>
    </Card>
  );
};

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

  const displayName = profile?.first_name || 'där';
  const loyaltyProgress = ((profile?.loyalty_points || 0) % 100);

  if (profileLoading) {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Välkomst */}
      <div>
        <h1 className="text-3xl font-bold">Välkommen tillbaka, {displayName}! 👋</h1>
        <p className="text-muted-foreground mt-1">
          {format(new Date(), 'PPP', { locale: sv })}
        </p>
      </div>

      {/* Statistik kort */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Kommande bokningar" 
          value={bookingsCount} 
          icon={Calendar}
          loading={bookingsLoading}
        />
        <StatCard 
          title="Väntande offerter" 
          value={quotesCount} 
          icon={FileText}
          loading={quotesLoading}
        />
        <StatCard 
          title="Väntande fakturor" 
          value={invoicesCount} 
          icon={Receipt}
          loading={invoicesLoading}
        />
        <StatCard 
          title="Totalt spenderat (år)" 
          value={totalSpent} 
          icon={TrendingUp}
          loading={spentLoading}
          format="currency"
        />
      </div>

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

      {/* Lojalitetsprogram */}
      <Card>
        <CardHeader>
          <CardTitle>Lojalitetsprogram</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Lojalitetspoäng
              </span>
              <span className="text-lg font-bold">
                {profile?.loyalty_points || 0} poäng
              </span>
            </div>
            <Progress value={loyaltyProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Tjäna poäng genom att använda våra tjänster
            </p>
            <Button asChild variant="outline" className="w-full mt-2">
              <Link to="/mitt-fixco/history">
                Se din historik
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;
