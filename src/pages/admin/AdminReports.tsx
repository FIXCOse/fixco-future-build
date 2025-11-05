import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RefreshCw, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, FileText, Target, Clock, Hourglass, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsFilters } from '@/components/admin/analytics/AnalyticsFilters';
import { RevenueTimelineChart } from '@/components/admin/analytics/RevenueTimelineChart';
import { CustomerSegmentChart } from '@/components/admin/analytics/CustomerSegmentChart';
import { ServicePerformanceChart } from '@/components/admin/analytics/ServicePerformanceChart';
import { TopCustomersTable } from '@/components/admin/analytics/TopCustomersTable';
import { ConversionFunnelChart } from '@/components/admin/analytics/ConversionFunnelChart';
import { TrafficSourcesChart } from '@/components/admin/analytics/TrafficSourcesChart';
import { exportAnalyticsCSV, type AnalyticsFilters as Filters } from '@/lib/api/analytics';
import { toast } from 'sonner';

const AdminReports = () => {
  const [filters, setFilters] = useState<Filters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
  });

  const { analytics, loading, refresh } = useAnalytics(filters);

  const handleExportCSV = () => {
    if (!analytics) return;

    const exportData = [
      {
        metric: 'Total Intäkt',
        value: analytics.revenue.totalRevenue,
        trend: `${analytics.revenue.trend > 0 ? '+' : ''}${analytics.revenue.trend.toFixed(1)}%`,
      },
      {
        metric: 'Bokningar',
        value: analytics.bookings.totalBookings,
        trend: `${analytics.bookings.trend > 0 ? '+' : ''}${analytics.bookings.trend.toFixed(1)}%`,
      },
      {
        metric: 'AOV',
        value: analytics.revenue.avgOrderValue,
        trend: '-',
      },
    ];

    exportAnalyticsCSV(exportData, 'analytics-summary');
    toast.success('CSV exporterad');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const KPICard = ({
    title,
    value,
    trend,
    icon: Icon,
    description,
  }: {
    title: string;
    value: string | number;
    trend?: number;
    icon: any;
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            ) : trend < 0 ? (
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
            ) : null}
            <span className={trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : ''}>
              {formatPercentage(trend)}
            </span>
            <span className="ml-1">från förra perioden</span>
          </div>
        )}
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Laddar analytics...</p>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avancerad Analys</h1>
          <p className="text-muted-foreground">
            Fullständig översikt över företagets prestanda och trafik
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refresh()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportera CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilters onFilterChange={setFilters} />

      {/* Quote Pipeline KPI Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quote Pipeline</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <KPICard
            title="Väntande Offerter"
            value={`${analytics.quotePipeline.pending.count} st`}
            icon={Hourglass}
            description={formatCurrency(analytics.quotePipeline.pending.totalAmount)}
          />
          <KPICard
            title="Accepterade Offerter"
            value={`${analytics.quotePipeline.accepted.count} st`}
            icon={CheckCircle2}
            description={formatCurrency(analytics.quotePipeline.accepted.totalAmount)}
          />
          <KPICard
            title="Väntande Fakturor"
            value={`${analytics.quotePipeline.awaitingInvoice.count} st`}
            icon={AlertCircle}
            description={formatCurrency(analytics.quotePipeline.awaitingInvoice.totalAmount)}
          />
          <KPICard
            title="Conversion Rate"
            value={`${analytics.quotePipeline.conversionRate.toFixed(1)}%`}
            icon={Target}
            description="Accepterade av totalt"
          />
          <KPICard
            title="Pipeline Total"
            value={formatCurrency(analytics.quotePipeline.pipelineTotal)}
            icon={DollarSign}
            description="Väntande + Ej fakturerade"
          />
        </div>
      </div>

      {/* Revenue KPI Dashboard */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Ekonomi & Kunder</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <KPICard
            title="Total Intäkt"
            value={formatCurrency(analytics.revenue.totalRevenue)}
            trend={analytics.revenue.trend}
            icon={DollarSign}
          />
          <KPICard
            title="Bokningar"
            value={analytics.bookings.totalBookings}
            trend={analytics.bookings.trend}
            icon={ShoppingCart}
          />
          <KPICard
            title="AOV"
            value={formatCurrency(analytics.revenue.avgOrderValue)}
            icon={Target}
            description="Genomsnittligt ordervärde"
          />
          <KPICard
            title="Quote Accept"
            value={`${analytics.bookings.conversionRate.toFixed(1)}%`}
            icon={FileText}
            description="Bokning → Faktura"
          />
          <KPICard
            title="Kunder"
            value={analytics.customers.totalCustomers}
            icon={Users}
            description={`${analytics.customers.newVsReturning.new} nya`}
          />
          <KPICard
            title="ROT/RUT Besparing"
            value={formatCurrency(analytics.revenue.rotDeduction + analytics.revenue.rutDeduction)}
            icon={Clock}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="ekonomi">Ekonomi</TabsTrigger>
          <TabsTrigger value="kunder">Kunder</TabsTrigger>
          <TabsTrigger value="trafik">Trafik</TabsTrigger>
          <TabsTrigger value="tidsanalys">Tid</TabsTrigger>
          <TabsTrigger value="tjanster">Tjänster</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <RevenueTimelineChart data={analytics.revenueTimeline} />
            <CustomerSegmentChart data={analytics.customers} />
          </div>
          <ServicePerformanceChart data={analytics.services} />
        </TabsContent>

        {/* Tab 2: Ekonomi & Priser */}
        <TabsContent value="ekonomi" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(analytics.revenue.byCustomerType).map(([type, amount]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{type}</span>
                    <span className="font-semibold">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROT/RUT Statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROT Avdrag</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(analytics.revenue.rotDeduction)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">RUT Avdrag</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(analytics.revenue.rutDeduction)}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Besparing</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(analytics.revenue.rotDeduction + analytics.revenue.rutDeduction)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Faktura-statistik</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Antal Fakturor</span>
                  <span className="font-semibold">{analytics.revenue.invoiceCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Genomsnittligt Värde</span>
                  <span className="font-semibold">{formatCurrency(analytics.revenue.avgOrderValue)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <RevenueTimelineChart data={analytics.revenueTimeline} />
        </TabsContent>

        {/* Tab 3: Kund-analys */}
        <TabsContent value="kunder" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(analytics.customers.byType).map(([type, data]) => (
            <Card key={type}>
                <CardHeader>
                  <CardTitle className="capitalize">{type === 'company' ? 'Företag' : type === 'private' ? 'Privat' : 'BRF'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Antal:</span>
                    <span className="font-semibold">{(data as any).count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Intäkt:</span>
                    <span className="font-semibold">{formatCurrency((data as any).revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">AOV:</span>
                    <span className="font-semibold">{formatCurrency((data as any).avgOrderValue)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <CustomerSegmentChart data={analytics.customers} />

          <Card>
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Nya Kunder</p>
                  <p className="text-4xl font-bold">{analytics.customers.newVsReturning.new}</p>
                </div>
                <div className="text-center p-6 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Återkommande</p>
                  <p className="text-4xl font-bold">{analytics.customers.newVsReturning.returning}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <TopCustomersTable customers={analytics.topCustomers} />
        </TabsContent>

        {/* Tab 4: Trafik & Sidbesök */}
        <TabsContent value="trafik" className="space-y-6">
          <TrafficSourcesChart data={analytics.traffic} />

          <Card>
            <CardHeader>
              <CardTitle>Mest Populära Sidor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.traffic.topPages.map((page, index) => (
                  <div key={page.url} className="flex items-center justify-between p-3 rounded-lg bg-muted">
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
              </div>
            </CardContent>
          </Card>

          <ConversionFunnelChart data={analytics.funnel} />
        </TabsContent>

        {/* Tab 5: Tidsanalys */}
        <TabsContent value="tidsanalys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Säsongstrender</CardTitle>
              <CardDescription>Bokningar och intäkter över tid</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueTimelineChart data={analytics.revenueTimeline} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Tjänsteanalys */}
        <TabsContent value="tjanster" className="space-y-6">
          <ServicePerformanceChart data={analytics.services} />

          <Card>
            <CardHeader>
              <CardTitle>ROT/RUT Eligible Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">ROT Eligible</p>
                  <p className="text-2xl font-bold">
                    {analytics.services.services.filter((s) => s.rotEligible).length}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">RUT Eligible</p>
                  <p className="text-2xl font-bold">
                    {analytics.services.services.filter((s) => s.rutEligible).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: Performance Metrics */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{analytics.bookings.conversionRate.toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground mt-2">Bokning → Faktura</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Genomsnittligt Ordervärde</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{formatCurrency(analytics.revenue.avgOrderValue)}</div>
                <p className="text-sm text-muted-foreground mt-2">Per faktura</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Besparing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  {formatCurrency(analytics.revenue.rotDeduction + analytics.revenue.rutDeduction)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">ROT + RUT avdrag</p>
              </CardContent>
            </Card>
          </div>

          <ConversionFunnelChart data={analytics.funnel} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
