import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subDays, format } from 'date-fns';
import { sv } from 'date-fns/locale';

export function DashboardRevenueChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-revenue-chart'],
    queryFn: async () => {
      const days = 30;
      const endDate = new Date();
      const startDate = subDays(endDate, days);

      const { data: invoices } = await supabase
        .from('invoices')
        .select('issue_date, total_amount')
        .gte('issue_date', startDate.toISOString())
        .lte('issue_date', endDate.toISOString())
        .order('issue_date');

      // Group by date
      const revenueByDate: Record<string, number> = {};
      invoices?.forEach((invoice) => {
        const date = format(new Date(invoice.issue_date), 'yyyy-MM-dd');
        revenueByDate[date] = (revenueByDate[date] || 0) + Number(invoice.total_amount);
      });

      // Create array with all dates
      const chartData = [];
      for (let i = 0; i < days; i++) {
        const date = subDays(endDate, days - i - 1);
        const dateStr = format(date, 'yyyy-MM-dd');
        chartData.push({
          date: format(date, 'd MMM', { locale: sv }),
          revenue: revenueByDate[dateStr] || 0,
        });
      }

      return chartData;
    },
    refetchInterval: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intäktsutveckling</CardTitle>
        <CardDescription>Daglig intäkt senaste 30 dagarna</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                new Intl.NumberFormat('sv-SE', {
                  style: 'currency',
                  currency: 'SEK',
                  maximumFractionDigits: 0,
                }).format(value),
                'Intäkt'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
