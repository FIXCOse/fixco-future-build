import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import type { ServicePerformance } from '@/lib/api/analytics';

interface ServicePerformanceChartProps {
  data: ServicePerformance;
}

export function ServicePerformanceChart({ data }: ServicePerformanceChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const topServices = data.services.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Tjänster</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topServices} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              className="text-xs"
            />
            <YAxis
              type="category"
              dataKey="title"
              width={150}
              className="text-xs"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Bar
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
              name="Intäkter"
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {topServices.slice(0, 5).map((service) => (
            <div key={service.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex-1">
                <p className="font-medium text-sm">{service.title}</p>
                <p className="text-xs text-muted-foreground">
                  {service.bookingCount} bokningar • {formatCurrency(service.avgPrice)} snitt
                </p>
              </div>
              <div className="flex gap-1">
                {service.rotEligible && (
                  <Badge variant="outline" className="text-xs">ROT</Badge>
                )}
                {service.rutEligible && (
                  <Badge variant="outline" className="text-xs">RUT</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
