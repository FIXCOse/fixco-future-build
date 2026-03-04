import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle } from 'lucide-react';
import type { JourneyAnalytics } from '@/lib/api/analyticsJourneys';

interface LandingPagePerformanceProps {
  data: JourneyAnalytics | undefined;
  loading: boolean;
}

function ConvBadge({ rate }: { rate: number }) {
  if (rate >= 5) return <Badge className="bg-green-500/15 text-green-600 border-green-500/30">{rate.toFixed(1)}%</Badge>;
  if (rate >= 1) return <Badge className="bg-yellow-500/15 text-yellow-600 border-yellow-500/30">{rate.toFixed(1)}%</Badge>;
  return <Badge variant="destructive">{rate.toFixed(1)}%</Badge>;
}

export default function LandingPagePerformance({ data, loading }: LandingPagePerformanceProps) {
  if (loading || !data) {
    return (
      <Card>
        <CardHeader><CardTitle>Landing Pages</CardTitle></CardHeader>
        <CardContent><div className="h-48 animate-pulse bg-muted rounded" /></CardContent>
      </Card>
    );
  }

  const pages = data.byLandingPage;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Landing Page Performance
        </CardTitle>
        <CardDescription>
          Vilka sidor besökare landar på och hur de konverterar. Hög trafik + låg konvertering = SEO-möjlighet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">Ingen data tillgänglig</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sida</TableHead>
                  <TableHead className="text-right">Sessioner</TableHead>
                  <TableHead className="text-right">Konverteringar</TableHead>
                  <TableHead className="text-right">Konv. grad</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => {
                  const isOpportunity = page.sessions >= 20 && page.conversionRate < 1;
                  return (
                    <TableRow key={page.page} className={isOpportunity ? 'bg-yellow-500/5' : ''}>
                      <TableCell className="font-mono text-xs max-w-[300px] truncate" title={page.page}>
                        {page.page}
                      </TableCell>
                      <TableCell className="text-right font-medium">{page.sessions}</TableCell>
                      <TableCell className="text-right">{page.conversions}</TableCell>
                      <TableCell className="text-right">
                        <ConvBadge rate={page.conversionRate} />
                      </TableCell>
                      <TableCell>
                        {isOpportunity && (
                          <span title="Hög trafik, låg konvertering"><AlertTriangle className="h-4 w-4 text-yellow-500" /></span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
