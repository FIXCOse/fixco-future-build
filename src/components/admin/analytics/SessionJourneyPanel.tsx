import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Route, ChevronDown, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import type { JourneyAnalytics, SessionJourney } from '@/lib/api/analyticsJourneys';

interface SessionJourneyPanelProps {
  data: JourneyAnalytics | undefined;
  loading: boolean;
}

function JourneyRow({ journey }: { journey: SessionJourney }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <TableRow className="cursor-pointer hover:bg-muted/50">
          <TableCell>
            <div className="flex items-center gap-1">
              {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <span className="font-mono text-xs truncate max-w-[200px]" title={journey.landingPage}>
                {journey.landingPage || '/'}
              </span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant="outline" className="text-xs">
              {journey.utmSource || 'direct'}
            </Badge>
          </TableCell>
          <TableCell className="text-right">{journey.pagesVisited.length}</TableCell>
          <TableCell className="text-right">{journey.ctaClicks.length}</TableCell>
          <TableCell className="text-center">
            {journey.converted ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 inline" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground inline" />
            )}
          </TableCell>
          <TableCell className="text-right text-xs text-muted-foreground">{journey.totalEvents}</TableCell>
        </TableRow>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <tr>
          <td colSpan={6} className="p-4 bg-muted/30">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Sidor besökta: </span>
                <span className="font-mono text-xs">{journey.pagesVisited.join(' → ') || '-'}</span>
              </div>
              {journey.ctaClicks.length > 0 && (
                <div>
                  <span className="font-medium text-muted-foreground">CTA-klick: </span>
                  <span>{journey.ctaClicks.join(', ')}</span>
                </div>
              )}
              {journey.funnelSteps.length > 0 && (
                <div>
                  <span className="font-medium text-muted-foreground">Funnel: </span>
                  <span>{journey.funnelSteps.join(' → ')}</span>
                </div>
              )}
              {journey.utmCampaign && (
                <div>
                  <span className="font-medium text-muted-foreground">Kampanj: </span>
                  <span>{journey.utmCampaign}</span>
                </div>
              )}
              {journey.referrer && (
                <div>
                  <span className="font-medium text-muted-foreground">Referrer: </span>
                  <span className="font-mono text-xs">{journey.referrer}</span>
                </div>
              )}
            </div>
          </td>
        </tr>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function SessionJourneyPanel({ data, loading }: SessionJourneyPanelProps) {
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  if (loading || !data) {
    return (
      <Card>
        <CardHeader><CardTitle>Användarresor</CardTitle></CardHeader>
        <CardContent><div className="h-64 animate-pulse bg-muted rounded" /></CardContent>
      </Card>
    );
  }

  const sources = ['all', ...data.bySource.map(s => s.source)];
  const filteredJourneys = sourceFilter === 'all'
    ? data.topJourneys
    : data.topJourneys.filter(j => (j.utmSource || 'direct') === sourceFilter);

  // Source conversion chart data
  const chartData = data.bySource.slice(0, 10).map(s => ({
    name: s.source,
    sessioner: s.sessions,
    konverteringar: s.conversions,
    rate: s.conversionRate,
  }));

  return (
    <div className="space-y-6">
      {/* Source conversion chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Konvertering per källa
          </CardTitle>
          <CardDescription>
            {data.totalSessions} sessioner, {data.convertedSessions} konverterade ({data.conversionRate.toFixed(1)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Ingen data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'rate') return [`${value.toFixed(1)}%`, 'Konv. grad'];
                    return [value, name === 'sessioner' ? 'Sessioner' : 'Konverteringar'];
                  }}
                />
                <Bar dataKey="sessioner" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="konverteringar" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Journey table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Sessionsresor
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Alla källor" />
              </SelectTrigger>
              <SelectContent>
                {sources.map(s => (
                  <SelectItem key={s} value={s}>{s === 'all' ? 'Alla källor' : s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
          <CardDescription>Klicka på en rad för att se hela resan</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredJourneys.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Inga sessioner att visa</p>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Landing page</TableHead>
                    <TableHead>Källa</TableHead>
                    <TableHead className="text-right">Sidor</TableHead>
                    <TableHead className="text-right">CTA</TableHead>
                    <TableHead className="text-center">Konv.</TableHead>
                    <TableHead className="text-right">Events</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJourneys.slice(0, 50).map(journey => (
                    <JourneyRow key={journey.sessionId} journey={journey} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
