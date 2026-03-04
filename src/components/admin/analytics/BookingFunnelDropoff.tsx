import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowDown, Filter } from 'lucide-react';
import type { DetailedFunnel } from '@/lib/api/analyticsDetailed';

interface BookingFunnelDropoffProps {
  data: DetailedFunnel | undefined;
  loading: boolean;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--primary) / 0.85)', 'hsl(var(--primary) / 0.7)', 'hsl(var(--primary) / 0.55)', 'hsl(var(--primary) / 0.4)', 'hsl(var(--primary) / 0.3)', 'hsl(var(--accent))'];

export default function BookingFunnelDropoff({ data, loading }: BookingFunnelDropoffProps) {
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Bokningsfunnel</CardTitle>
        </CardHeader>
        <CardContent><div className="h-64 animate-pulse bg-muted rounded" /></CardContent>
      </Card>
    );
  }

  const chartData = data.steps.map(s => ({
    name: s.label,
    sessioner: s.count,
    dropoff: s.dropoffPercent,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Detaljerad bokningsfunnel
        </CardTitle>
        <CardDescription>Varje steg visar unika sessioner. Dropoff = % som tappas från föregående steg.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === 'sessioner' ? [value, 'Sessioner'] : [`${value.toFixed(1)}%`, 'Dropoff']
              }
            />
            <Bar dataKey="sessioner" radius={[0, 4, 4, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Dropoff indicators */}
        <div className="mt-4 space-y-1">
          {data.steps.slice(1).map((step, i) => (
            <div key={step.eventType} className="flex items-center gap-2 text-sm">
              <ArrowDown className="h-3 w-3 text-destructive" />
              <span className="text-muted-foreground">{data.steps[i].label} → {step.label}:</span>
              <span className={`font-medium ${step.dropoffPercent > 80 ? 'text-destructive' : step.dropoffPercent > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                -{step.dropoffPercent.toFixed(1)}% ({step.dropoff} tappade)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
