import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Globe, Eye, MousePointerClick, ArrowDownUp, Timer } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsFilters } from '@/components/admin/analytics/AnalyticsFilters';
import { TrafficSourcesChart } from '@/components/admin/analytics/TrafficSourcesChart';
import { ConversionFunnelChart } from '@/components/admin/analytics/ConversionFunnelChart';
import SEOKPICards from '@/components/admin/analytics/SEOKPICards';
import BookingFunnelDropoff from '@/components/admin/analytics/BookingFunnelDropoff';
import LandingPagePerformance from '@/components/admin/analytics/LandingPagePerformance';
import SessionJourneyPanel from '@/components/admin/analytics/SessionJourneyPanel';
import type { AnalyticsFilters as Filters } from '@/lib/api/analytics';

const AdminTrafficSEO = () => {
  const [filters, setFilters] = useState<Filters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  const { analytics, loading, refresh } = useAnalytics(filters);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Laddar trafik & SEO-data...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Ingen data tillgänglig</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trafik & SEO</h1>
            <p className="text-muted-foreground">
              Besökare, konverteringar, användarresor och sidprestanda
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refresh()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Uppdatera
        </Button>
      </div>

      {/* Filters */}
      <AnalyticsFilters onFilterChange={setFilters} />

      {/* Section 1: SEO KPI Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-muted-foreground" />
          Nyckeltal
        </h2>
        <SEOKPICards data={analytics.bounceAnalytics} loading={false} />
      </section>

      {/* Section 2: Funnel & Landing Pages side by side */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
          Funnel & Landing Pages
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <BookingFunnelDropoff data={analytics.detailedFunnel} loading={false} />
          <LandingPagePerformance data={analytics.journeys} loading={false} />
        </div>
      </section>

      {/* Section 3: Traffic Sources */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MousePointerClick className="h-5 w-5 text-muted-foreground" />
          Trafikkällor
        </h2>
        <TrafficSourcesChart data={analytics.traffic} />
      </section>

      {/* Section 4: Conversion Funnel */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
          Konverteringsfunnel
        </h2>
        <ConversionFunnelChart data={analytics.funnel} />
      </section>

      {/* Section 5: Popular Pages */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Timer className="h-5 w-5 text-muted-foreground" />
          Populära sidor
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Mest besökta sidor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.traffic.topPages.map((page, index) => (
                <div key={page.url} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{page.url}</p>
                      <p className="text-xs text-muted-foreground">
                        Genomsnittlig tid: {Math.round(page.avgDuration)}s
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{page.views}</p>
                    <p className="text-xs text-muted-foreground">visningar</p>
                  </div>
                </div>
              ))}
              {analytics.traffic.topPages.length === 0 && (
                <p className="text-center py-6 text-muted-foreground">Inga sidor att visa</p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 6: Session Journeys */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          Sessionsresor
        </h2>
        <SessionJourneyPanel data={analytics.journeys} loading={false} />
      </section>
    </div>
  );
};

export default AdminTrafficSEO;
