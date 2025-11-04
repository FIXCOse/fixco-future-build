import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function DashboardJobsChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-jobs-chart'],
    queryFn: async () => {
      const { data: jobs } = await supabase
        .from('jobs')
        .select('status')
        .is('deleted_at', null);

      const statusCounts: Record<string, number> = {};
      jobs?.forEach((job) => {
        statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
      });

      const statusLabels: Record<string, string> = {
        pool: 'Pool',
        assigned: 'Tilldelade',
        active: 'Aktiva',
        completed: 'Slutförda',
        cancelled: 'Avbrutna',
      };

      const statusColors: Record<string, string> = {
        pool: 'hsl(var(--muted-foreground))',
        assigned: 'hsl(var(--chart-1))',
        active: 'hsl(var(--chart-2))',
        completed: 'hsl(var(--chart-3))',
        cancelled: 'hsl(var(--destructive))',
      };

      return Object.entries(statusCounts).map(([status, count]) => ({
        status: statusLabels[status] || status,
        count,
        color: statusColors[status] || 'hsl(var(--primary))',
      }));
    },
    refetchInterval: 60000,
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
        <CardTitle>Jobb per status</CardTitle>
        <CardDescription>Översikt av alla jobb</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="status" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [value, 'Antal']}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
