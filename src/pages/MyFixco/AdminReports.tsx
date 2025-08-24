import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Calendar, Download, DollarSign } from 'lucide-react';
import { getBookingsDaily, getRevenueMonthly, getROTRUTSavings, getTopServices } from '@/lib/admin';
import AdminBack from '@/components/admin/AdminBack';

const AdminReports = () => {
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [rotRutData, setRotRutData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

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
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
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
          <p className="text-muted-foreground">
            Översikt av verksamheten och KPI:er
          </p>
        </div>
        
        <div className="flex items-center gap-4">
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
      </div>

      {/* KPI Cards */}
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

      {/* Bokningar per dag */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Bokningar per dag
            </div>
            <Button 
              onClick={() => exportData(bookingsData, 'bokningar-per-dag')}
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportera
            </Button>
          </CardTitle>
          <CardDescription>
            Senaste 30 dagarna
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                <div className="text-center py-8 text-muted-foreground">
                  Ingen data tillgänglig
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Topp-tjänster */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Populäraste tjänster
            </div>
            <Button 
              onClick={() => exportData(servicesData, 'topp-tjanster')}
              variant="outline" 
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportera
            </Button>
          </CardTitle>
          <CardDescription>
            Mest bokade tjänster
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                <div className="text-center py-8 text-muted-foreground">
                  Ingen data tillgänglig
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;