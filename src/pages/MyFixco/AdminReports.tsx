import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Calendar, Download, DollarSign, Globe } from 'lucide-react';
import { getBookingsDaily, getRevenueMonthly, getROTRUTSavings, getTopServices } from '@/lib/admin';
import { useAnalytics } from '@/hooks/useAnalytics';
import AdminBack from '@/components/admin/AdminBack';
import SEOKPICards from '@/components/admin/analytics/SEOKPICards';
import BookingFunnelDropoff from '@/components/admin/analytics/BookingFunnelDropoff';
import LandingPagePerformance from '@/components/admin/analytics/LandingPagePerformance';
import SessionJourneyPanel from '@/components/admin/analytics/SessionJourneyPanel';

const AdminReports = () => {
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [rotRutData, setRotRutData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  const analyticsFilters = useMemo(() => {
    const now = new Date();
    const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '365d' ? 365 : 30;
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return { startDate: start.toISOString(), endDate: now.toISOString() };
  }, [period]);

  const { analytics, loading: analyticsLoading } = useAnalytics(analyticsFilters);

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [bookings, revenue, rotRut, services] = await Promise.all([
        getBookingsDaily(),
        getRevenueMonthly(),
        getROTRUTSavings(),
        getTopServices()
      ]);
      setBookingsData(bookings || []);
      setRevenueData(revenue || []);
      setRotRutData(rotRut || []);
      setServicesData(services || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => row[h] || '').join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(amount);
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalSavings = rotRutData.reduce((sum, item) => sum + (item.savings || 0), 0);
  const totalBookings = bookingsData.reduce((sum, item) => sum + (item.bookings || 0), 0);

  return (
    <div className="space-y-6">
      <AdminBack />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rapporter & Analys</h1>
          <p className="text-muted-foreground">Översikt av verksamheten och KPI:er</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 dagar</SelectItem>
            <SelectItem value="30d">30 dagar</SelectItem>
            <SelectItem value="90d">90 dagar</SelectItem>
            <SelectItem value="365d">1 år</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Översikt
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Globe className="h-4 w-4" />
            SEO & Resor
          </TabsTrigger>
        </TabsList>

        {/* === OVERVIEW TAB === */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Totalt bokningar</p>
                    <p className="text-2xl font-bold">{totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total intäkt</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">ROT/RUT besparingar</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalSavings)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Genomsnitt/bokning</p>
                    <p className="text-2xl font-bold">
                      {totalBookings > 0 ? formatCurrency(totalRevenue / totalBookings) : '0 kr'}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Bokningar per dag
                </div>
                <Button onClick={() => exportData(bookingsData, 'bokningar-per-dag')} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />Exportera
                </Button>
              </CardTitle>
              <CardDescription>Senaste 30 dagarna</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {bookingsData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{new Date(item.day).toLocaleDateString('sv-SE')}</span>
                      <span className="font-medium">{item.bookings} bokningar</span>
                    </div>
                  ))}
                  {bookingsData.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">Ingen data tillgänglig</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Populäraste tjänster
                </div>
                <Button onClick={() => exportData(servicesData, 'topp-tjanster')} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />Exportera
                </Button>
              </CardTitle>
              <CardDescription>Mest bokade tjänster</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <div className="space-y-2">
                  {servicesData.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{service.service_name}</div>
                        <div className="text-sm text-muted-foreground">#{service.service_id}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{service.booking_count}</div>
                        <div className="text-xs text-muted-foreground">bokningar</div>
                      </div>
                    </div>
                  ))}
                  {servicesData.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">Ingen data tillgänglig</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* === SEO & RESOR TAB === */}
        <TabsContent value="seo" className="space-y-6">
          <SEOKPICards data={analytics?.bounceAnalytics} loading={analyticsLoading} />
          <BookingFunnelDropoff data={analytics?.detailedFunnel} loading={analyticsLoading} />
          <LandingPagePerformance data={analytics?.journeys} loading={analyticsLoading} />
          <SessionJourneyPanel data={analytics?.journeys} loading={analyticsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
