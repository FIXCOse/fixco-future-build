import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueTimelineChartProps {
  data: Array<{
    date: string;
    total: number;
    company: number;
    private: number;
    brf: number;
  }>;
}

export function RevenueTimelineChart({ data }: RevenueTimelineChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intäkter över tid</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
            />
            <YAxis
              tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              className="text-xs"
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Totalt"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="company"
              stroke="hsl(var(--chart-1))"
              strokeWidth={1.5}
              name="Företag"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="private"
              stroke="hsl(var(--chart-2))"
              strokeWidth={1.5}
              name="Privat"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="brf"
              stroke="hsl(var(--chart-3))"
              strokeWidth={1.5}
              name="BRF"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
