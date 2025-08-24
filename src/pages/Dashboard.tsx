import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  Award, 
  Home,
  Building,
  Clock,
  DollarSign,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'private' | 'company' | 'brf';
  loyalty_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyalty_points: number;
  total_spent: number;
  company_name?: string;
  brf_name?: string;
}

interface DashboardStats {
  upcomingBookings: number;
  pendingQuotes: number;
  unpaidInvoices: number;
  totalSavings: number;
  currentYearSpent: number;
  rotRutSavings: number;
}

const Dashboard = () => {
  // Redirect to new dashboard structure
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/mitt-fixco', { replace: true });
  }, [navigate]);

  return null;

  const loadUserData = async (userId: string) => {
    try {
      setLoading(true);

      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        toast({
          title: "Fel",
          description: "Kunde inte ladda profildata",
          variant: "destructive"
        });
        return;
      }

      setProfile(profileData);

      // Load dashboard statistics
      await loadDashboardStats(userId);

    } catch (error) {
      console.error('Error in loadUserData:', error);
      toast({
        title: "Fel",
        description: "Ett oväntat fel uppstod",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async (userId: string) => {
    try {
      const currentYear = new Date().getFullYear();
      
      // Get upcoming bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', userId)
        .gte('scheduled_date', new Date().toISOString().split('T')[0])
        .eq('status', 'confirmed');

      // Get pending quotes
      const { data: quotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('customer_id', userId)
        .eq('status', 'sent');

      // Get unpaid invoices
      const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', userId)
        .in('status', ['sent', 'overdue']);

      // Calculate year-to-date spending and savings
      const { data: yearInvoices } = await supabase
        .from('invoices')
        .select('total_amount, rot_amount, rut_amount')
        .eq('customer_id', userId)
        .eq('status', 'paid')
        .gte('issue_date', `${currentYear}-01-01`);

      const currentYearSpent = yearInvoices?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0;
      const rotRutSavings = yearInvoices?.reduce((sum, invoice) => 
        sum + Number(invoice.rot_amount || 0) + Number(invoice.rut_amount || 0), 0) || 0;

      setStats({
        upcomingBookings: bookings?.length || 0,
        pendingQuotes: quotes?.length || 0,
        unpaidInvoices: invoices?.length || 0,
        totalSavings: rotRutSavings,
        currentYearSpent,
        rotRutSavings
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fel",
        description: "Kunde inte logga ut",
        variant: "destructive"
      });
    } else {
      navigate('/');
    }
  };

  const getLoyaltyProgress = (tier: string, points: number) => {
    const tiers = {
      bronze: { min: 0, max: 1000, next: 'Silver' },
      silver: { min: 1000, max: 2500, next: 'Gold' },
      gold: { min: 2500, max: 5000, next: 'Platinum' },
      platinum: { min: 5000, max: 10000, next: 'Max nivå' }
    };
    
    const current = tiers[tier as keyof typeof tiers];
    const progress = Math.min(((points - current.min) / (current.max - current.min)) * 100, 100);
    
    return { progress, next: current.next, pointsToNext: current.max - points };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p>Kunde inte ladda profildata</p>
        </div>
      </div>
    );
  }

  const loyaltyInfo = getLoyaltyProgress(profile.loyalty_tier, profile.loyalty_points);

  return (
    <>
      <Helmet>
        <title>Mitt Fixco - Dashboard</title>
        <meta name="description" content="Hantera dina bokningar, offerter och fakturor på ditt personliga Fixco-dashboard." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  Välkommen, {profile.first_name}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  {profile.user_type === 'company' && `${profile.company_name} - `}
                  {profile.user_type === 'brf' && `${profile.brf_name} - `}
                  Här är din översikt
                </p>
              </div>
              <Button onClick={handleSignOut} variant="outline">
                Logga ut
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kommande bokningar</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Bekräftade bokningar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Väntande offerter</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
                <p className="text-xs text-muted-foreground">
                  Kräver ditt svar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Obetalda fakturor</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.unpaidInvoices}</div>
                <p className="text-xs text-muted-foreground">
                  Betalning väntar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROT/RUT-sparande</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.rotRutSavings)}</div>
                <p className="text-xs text-muted-foreground">
                  Sparat i år
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Loyalty Program */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Lojalitetsprogram
                  </CardTitle>
                  <CardDescription>
                    Du är {profile.loyalty_tier.charAt(0).toUpperCase() + profile.loyalty_tier.slice(1)}-medlem
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Poäng: {profile.loyalty_points}</span>
                    <Badge variant={
                      profile.loyalty_tier === 'platinum' ? 'default' :
                      profile.loyalty_tier === 'gold' ? 'secondary' :
                      profile.loyalty_tier === 'silver' ? 'outline' : 'outline'
                    }>
                      {profile.loyalty_tier.charAt(0).toUpperCase() + profile.loyalty_tier.slice(1)}
                    </Badge>
                  </div>
                  
                  {profile.loyalty_tier !== 'platinum' && (
                    <>
                      <Progress value={loyaltyInfo.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {loyaltyInfo.pointsToNext} poäng till {loyaltyInfo.next}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Snabblänkar</CardTitle>
                  <CardDescription>
                    Vanliga åtgärder och navigering
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigate('/tjanster')}
                    >
                      <div className="flex items-center space-x-3">
                        <Plus className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">Ny bokning</div>
                          <div className="text-sm text-muted-foreground">Boka en tjänst</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigate('/mitt-fixco/properties')}
                    >
                      <div className="flex items-center space-x-3">
                        <Home className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">Mina fastigheter</div>
                          <div className="text-sm text-muted-foreground">Hantera adresser</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigate('/mitt-fixco/invoices')}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">Fakturor</div>
                          <div className="text-sm text-muted-foreground">Visa & ladda ner</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-auto p-4"
                      onClick={() => navigate('/mitt-fixco/rot-rut')}
                    >
                      <div className="flex items-center space-x-3">
                        <DollarSign className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium">ROT/RUT</div>
                          <div className="text-sm text-muted-foreground">Sparande & övervyn</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kontosammanfattning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Spenderat i år</span>
                    <span className="font-medium">{formatCurrency(stats.currentYearSpent)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROT/RUT-sparande</span>
                    <span className="font-medium text-green-600">{formatCurrency(stats.rotRutSavings)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lojalitetspoäng</span>
                    <span className="font-medium">{profile.loyalty_points}</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => navigate('/mitt-fixco/history')}
                  >
                    Visa historik
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Senaste aktivitet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Ny offert mottagen</p>
                        <p className="text-xs text-muted-foreground">För tiden</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Bokning bekräftad</p>
                        <p className="text-xs text-muted-foreground">VVS-installation</p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => navigate('/mitt-fixco/activity')}
                    >
                      <span className="text-sm">Visa all aktivitet</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;