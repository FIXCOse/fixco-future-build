import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Users, AlertCircle } from 'lucide-react';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export function DashboardKPICards() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['admin-dashboard-kpis'],
    queryFn: async () => {
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Fetch current month invoices
      const { data: currentInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .gte('issue_date', currentMonthStart.toISOString())
        .lte('issue_date', currentMonthEnd.toISOString());

      // Fetch last month invoices
      const { data: lastMonthInvoices } = await supabase
        .from('invoices')
        .select('total_amount')
        .gte('issue_date', lastMonthStart.toISOString())
        .lte('issue_date', lastMonthEnd.toISOString());

      const currentRevenue = currentInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
      const lastMonthRevenue = lastMonthInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
      const revenueChange = lastMonthRevenue > 0 
        ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      // Fetch active jobs
      const { count: activeJobs } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .in('status', ['active', 'assigned']);

      // Fetch customers created this month
      const { count: newCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonthStart.toISOString());

      // Fetch pending items
      const { count: unansweredQuestions } = await supabase
        .from('quote_questions')
        .select('*', { count: 'exact', head: true })
        .eq('answered', false);

      const { count: pendingRequests } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      return {
        revenue: { value: currentRevenue, change: revenueChange },
        activeJobs: { value: activeJobs || 0 },
        newCustomers: { value: newCustomers || 0 },
        pendingItems: { value: (unansweredQuestions || 0) + (pendingRequests || 0) },
      };
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    {
      title: 'Total intäkt',
      icon: DollarSign,
      value: kpis ? formatCurrency(kpis.revenue.value) : '0 kr',
      change: kpis?.revenue.change,
      description: 'Denna månad',
    },
    {
      title: 'Aktiva jobb',
      icon: Briefcase,
      value: kpis?.activeJobs.value || 0,
      description: 'Pågående & tilldelade',
    },
    {
      title: 'Nya kunder',
      icon: Users,
      value: kpis?.newCustomers.value || 0,
      description: 'Denna månad',
    },
    {
      title: 'Väntande',
      icon: AlertCircle,
      value: kpis?.pendingItems.value || 0,
      description: 'Frågor & förfrågningar',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">{card.description}</p>
              {card.change !== undefined && (
                <div className={`flex items-center text-xs ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(card.change).toFixed(1)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
