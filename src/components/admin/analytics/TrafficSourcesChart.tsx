import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import type { TrafficAnalytics } from '@/lib/api/analytics';

interface TrafficSourcesChartProps {
  data: TrafficAnalytics;
}

export function TrafficSourcesChart({ data }: TrafficSourcesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Trafik-källor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.bySource}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="source" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Besök" />
              <Bar dataKey="conversions" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Konverteringar" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Källa</TableHead>
              <TableHead className="text-right">Besök</TableHead>
              <TableHead className="text-right">Konverteringar</TableHead>
              <TableHead className="text-right">Conversion Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.bySource.map((source) => (
              <TableRow key={source.source}>
                <TableCell className="font-medium capitalize">{source.source}</TableCell>
                <TableCell className="text-right">{source.visits.toLocaleString('sv-SE')}</TableCell>
                <TableCell className="text-right">{source.conversions.toLocaleString('sv-SE')}</TableCell>
                <TableCell className="text-right">
                  <Badge variant={source.conversionRate > 5 ? 'default' : 'secondary'}>
                    {source.conversionRate.toFixed(2)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Totala Sidbesök</p>
            <p className="text-3xl font-bold">{data.totalPageViews.toLocaleString('sv-SE')}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground">Unika Besökare</p>
            <p className="text-3xl font-bold">{data.uniqueVisitors.toLocaleString('sv-SE')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
