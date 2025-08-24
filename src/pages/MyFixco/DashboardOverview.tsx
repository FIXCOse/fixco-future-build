import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import DashboardHeader from '@/components/DashboardHeader';
import { Calendar, FileText, CreditCard, TrendingUp, Plus, ChevronRight, Building, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';

interface DashboardStats {
  upcomingBookings: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  totalSavings: number;
  currentYearSpent: number;
  rotRutSavings: number;
}

const DashboardOverview = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingBookings: 0,
    pendingQuotes: 0,
    unpaidInvoices: 0,
    totalSavings: 0,
    currentYearSpent: 0,
    rotRutSavings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboardStats(user.id);
    }
  }, [user?.id]);

  const loadDashboardStats = async (userId: string) => {
    try {
      setLoading(true);

      // Load upcoming bookings
      const { data: upcomingBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('customer_id', userId)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .eq('status', 'confirmed');

      // Load pending quotes
      const { data: pendingQuotes } = await supabase
        .from('quotes')
        .select('id')
        .eq('customer_id', userId)
        .eq('status', 'sent');

      // Load unpaid invoices
      const { data: unpaidInvoices } = await supabase
        .from('invoices')
        .select('id')
        .eq('customer_id', userId)
        .in('status', ['sent', 'overdue']);

      // Calculate ROT/RUT savings for current year
      const currentYear = new Date().getFullYear();
      const { data: rotRutData } = await supabase
        .from('invoices')
        .select('rot_amount, rut_amount')
        .eq('customer_id', userId)
        .gte('issue_date', `${currentYear}-01-01`)
        .eq('status', 'paid');

      const rotRutSavings = rotRutData?.reduce((sum, invoice) => 
        sum + (invoice.rot_amount || 0) + (invoice.rut_amount || 0), 0) || 0;

      setStats({
        upcomingBookings: upcomingBookings?.length || 0,
        pendingQuotes: pendingQuotes?.length || 0,
        unpaidInvoices: unpaidInvoices?.length || 0,
        totalSavings: profile?.total_spent || 0,
        currentYearSpent: profile?.total_spent || 0,
        rotRutSavings
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Laddar profil...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Min översikt | Mitt Fixco</title>
        <meta name="description" content="Översikt över dina bokningar, fakturor och ROT/RUT-sparande" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="space-y-6">
        <DashboardHeader profile={profile} stats={stats} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Snabbåtgärder</CardTitle>
            <CardDescription>De vanligaste åtgärderna du kan behöva göra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/boka-hembesok">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Boka tjänst</span>
                </Button>
              </Link>
              
              <Link to="/mitt-fixco/properties">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                  <Building className="h-6 w-6" />
                  <span>Hantera fastigheter</span>
                </Button>
              </Link>
              
              <Link to="/mitt-fixco/invoices">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span>Visa fakturor</span>
                </Button>
              </Link>
              
              <Link to="/mitt-fixco/rot-rut">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>ROT/RUT-översikt</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Senaste aktivitet</CardTitle>
                <Link to="/mitt-fixco/activity">
                  <Button variant="ghost" size="sm">
                    Visa alla <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="mx-auto h-12 w-12 mb-2" />
                    <p>Ingen aktivitet att visa ännu</p>
                    <Link to="/boka-hembesok">
                      <Button variant="link" className="mt-2">
                        Skapa din första bokning
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Kontooversikt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Totalt spenderat</span>
                  <span className="font-medium">{(profile.total_spent || 0).toLocaleString('sv-SE')} kr</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ROT/RUT sparat i år</span>
                  <span className="font-medium text-green-600">{stats.rotRutSavings.toLocaleString('sv-SE')} kr</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Lojalitetspoäng</span>
                  <span className="font-medium">{profile.loyalty_points}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Senaste bokningar</CardTitle>
                <Link to="/mitt-fixco/history">
                  <Button variant="ghost" size="sm">
                    Visa alla <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  <Home className="mx-auto h-12 w-12 mb-2" />
                  <p>Inga bokningar ännu</p>
                  <Link to="/boka-hembesok">
                    <Button variant="link" className="mt-2">
                      Boka din första tjänst
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;