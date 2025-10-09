import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileText,
  Plus,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface KPIData {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayBookings: number;
  totalUsers: number;
  avgOrderValue: number;
  rotSavings: number;
}

const SalesOverview = () => {
  const [kpiData, setKpiData] = useState<KPIData>({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    todayBookings: 0,
    totalUsers: 0,
    avgOrderValue: 0,
    rotSavings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIData();
  }, []);

  const fetchKPIData = async () => {
    try {
      // Fetch various KPIs from the database
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Today's revenue
      const { data: todayInvoices } = await supabase
        .from('invoices')
        .select('total_amount, rot_amount, rut_amount')
        .eq('issue_date', today)
        .eq('status', 'paid');

      // Week revenue
      const { data: weekInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .gte('issue_date', weekAgo)
        .eq('status', 'paid');

      // Month revenue
      const { data: monthInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .gte('issue_date', monthAgo)
        .eq('status', 'paid');

      // Today's bookings (by created_at since scheduled_date doesn't exist anymore)
      const { data: todayBookings } = await supabase
        .from('bookings')
        .select('id')
        .gte('created_at', today);

      // Total users
      const { data: totalUsers } = await supabase
        .from('profiles')
        .select('id');

      const todayRev = todayInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
      const weekRev = weekInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
      const monthRev = monthInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
      const rotSavings = todayInvoices?.reduce((sum, inv) => sum + (inv.rot_amount || 0) + (inv.rut_amount || 0), 0) || 0;

      setKpiData({
        todayRevenue: todayRev,
        weekRevenue: weekRev,
        monthRevenue: monthRev,
        todayBookings: todayBookings?.length || 0,
        totalUsers: totalUsers?.length || 0,
        avgOrderValue: weekInvoices?.length ? weekRev / weekInvoices.length : 0,
        rotSavings
      });
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const quickActions = [
    {
      title: 'Skapa offert',
      description: 'Ny offert för kund',
      icon: FileText,
      href: '/mitt-fixco/properties',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Lägg till personal',
      description: 'Registrera ny personal',
      icon: Users,
      href: '/mitt-fixco/staff',
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Se rapporter',
      description: 'Detaljerad analys',
      icon: Activity,
      href: '/mitt-fixco',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Visa fakturor',
      description: 'Hantera fakturering',
      icon: DollarSign,
      href: '/mitt-fixco/invoices',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Försäljningsöversikt</h1>
        <p className="text-muted-foreground">
          KPIer och försäljningsdata för idag, denna vecka och månad
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idag</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.todayRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{kpiData.todayBookings} bokningar
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denna vecka</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.weekRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% vs föregående vecka
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denna månad</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.monthRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                85% av månadsmål
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROT/RUT-besparingar</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.rotSavings)}</div>
            <p className="text-xs text-muted-foreground">
              Totalt sparat för kunder idag
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittligt ordervärde</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpiData.avgOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Senaste 7 dagarna
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala användare</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registrerade kunder
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vinstmarginal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.1% vs föregående månad
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snabblänkar</CardTitle>
          <CardDescription>
            Vanliga åtgärder för att hantera din verksamhet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <div className="flex items-center p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Senaste aktivitet</CardTitle>
          <CardDescription>
            Översikt över de senaste försäljningshändelserna
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Ny bokning från Anna Andersson</span>
              <Badge variant="outline">5 min sedan</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Faktura #2024-001 betald ({formatCurrency(15000)})</span>
              <Badge variant="outline">12 min sedan</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Offert skickad till Stockholms BRF</span>
              <Badge variant="outline">25 min sedan</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>ROT-avdrag beviljat för {formatCurrency(4500)}</span>
              <Badge variant="outline">1 tim sedan</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOverview;