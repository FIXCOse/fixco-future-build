import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CustomerSegmentation } from '@/lib/api/analytics';

interface CustomerSegmentChartProps {
  data: CustomerSegmentation;
}

const COLORS = {
  company: 'hsl(var(--chart-1))',
  private: 'hsl(var(--chart-2))',
  brf: 'hsl(var(--chart-3))',
};

export function CustomerSegmentChart({ data }: CustomerSegmentChartProps) {
  const chartData = [
    {
      name: 'Företag',
      value: data.byType.company.revenue,
      count: data.byType.company.count,
    },
    {
      name: 'Privat',
      value: data.byType.private.revenue,
      count: data.byType.private.count,
    },
    {
      name: 'BRF',
      value: data.byType.brf.revenue,
      count: data.byType.brf.count,
    },
  ].filter((item) => item.value > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundfördelning</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="text-center">
              <p className="text-sm text-muted-foreground">{item.name}</p>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(item.value)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
